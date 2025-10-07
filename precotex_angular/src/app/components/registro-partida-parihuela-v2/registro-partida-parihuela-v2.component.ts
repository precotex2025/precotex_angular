import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Console } from 'console';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { RegistroPartidaParihuelaService } from 'src/app/services/registro-partida-parihuela.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
@Component({
  selector: 'app-registro-partida-parihuela-v2',
  templateUrl: './registro-partida-parihuela-v2.component.html',
  styleUrls: ['./registro-partida-parihuela-v2.component.scss']
})
export class RegistroPartidaParihuelaV2Component implements OnInit {
  //RegistroParihuelaV2 <- ruta
  busquedaForm: FormGroup;
  grupoForm: FormGroup;
  parihuelaFormArray: FormArray;
  categorias: any[] = [];
  tiposComplemento = [];
  codigoTelita: string = '';
  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;

  constructor(
    private fb: FormBuilder,
    private serviceRegistroParihuela: RegistroPartidaParihuelaService,
    private SpinnerService: NgxSpinnerService,
    private http: HttpClient
  ) {
    this.busquedaForm = this.fb.group({
      codigo: ['']
    });

    this.grupoForm = this.fb.group({
      codTela: ['']
    });

    this.parihuelaFormArray = this.fb.array([]);
  }

  ngOnInit(): void {
    
  }

  buscarPartida() {
    let cod_Parihuela = this.busquedaForm.get('codigo')?.value;
    this.cargarCategorias(cod_Parihuela);
    
    
  }

  agregarComplemento(grupo: FormGroup) {
    const complementos = grupo.get('complementos') as FormArray;
    complementos.push(this.fb.group({
      peso: [null],
      tipo: [null]
    }));
  }

  get parihuelaGrupos(): FormGroup[] {
  return this.parihuelaFormArray.controls as FormGroup[];
  }

  parihuelas = [];
  onObtenerDetalle(){
    let cod_Parihuela = this.busquedaForm.get('codigo')?.value;
    let condicion = 'C';
    this.SpinnerService.show();
    this.parihuelas = [];
    this.serviceRegistroParihuela.obtenerDetPartida(cod_Parihuela.toUpperCase(), condicion).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.parihuelas = response.elements;
            this.crearFormularioDesdeData(this.parihuelas);
            this.SpinnerService.hide();
          }else{
            this.parihuelas = [];
            this.SpinnerService.hide();
          }
        }else{
          this.parihuelas = [];
        }
      },
      error: (error) => { 
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    })
  }

  crearFormularioDesdeData(data: any[]) {
    const agrupado = new Map<string, any>();

    data.forEach(item => {
    const key = item.codigoParihuela;

    if (!agrupado.has(key)) {
      agrupado.set(key, {
        codigoParihuela: key,
        pesoParihuela: item.pesoParihuela > 0 ? item.pesoParihuela : 0,
        pesoBruto: item.pesoBruto != null && item.pesoBruto > 0 ? item.pesoBruto : 0,
        pesoTela: item.pesoTela > 0 ? item.pesoTela : (item.pesoBruto ?? 0),
        complementos: []
      });
    } else {
      const grupo = agrupado.get(key);

      if (grupo.pesoParihuela === 0 && item.pesoParihuela > 0) {
        grupo.pesoParihuela = item.pesoParihuela;
      }

      if ((grupo.pesoBruto === 0 || grupo.pesoBruto == null) && item.pesoBruto != null && item.pesoBruto > 0) {
        grupo.pesoBruto = item.pesoBruto;
      }

      if (grupo.pesoTela === 0 && item.pesoBruto != null && item.pesoBruto > 0) {
        grupo.pesoTela = item.pesoBruto;
      }
    }

    if (item.complemento) {
      agrupado.get(key).complementos.push({
        tipo: item.complemento ?? '',
        peso: item.pesoComplemento ?? 0
      });
    }
  });

  const grupos = Array.from(agrupado.values());
  this.parihuelaFormArray = new FormArray(
    grupos.map(grupo =>
      new FormGroup({
        codigo: new FormControl(grupo.codigoParihuela),
        pesoParihuela: new FormControl(grupo.pesoParihuela),
        pesoTela: new FormControl(grupo.pesoTela),
        pesoBruto: new FormControl(grupo.pesoBruto),
        codTela: new FormControl(this.codigoTelita),
        complementos: new FormArray(
          grupo.complementos.map(comp =>
            new FormGroup({
              tipo: new FormControl(comp.tipo),
              peso: new FormControl(comp.peso)
            })
          )
        )
      })
    )
  );
}



  guardarPartida() {
  const detalle: any[] = [];

  this.parihuelaFormArray.controls.forEach((grupo: FormGroup) => {
    const codigoPartida = this.busquedaForm.get('codigo')?.value;
    const codigoParihuela = grupo.get('codigo')?.value;
    const pesoParihuela = grupo.get('pesoParihuela')?.value ?? 0;
    const pesoBruto = grupo.get('pesoTela')?.value ?? 0;
    const pesoTela = grupo.get('pesoTela')?.value ?? 0;
    const pesoNeto = pesoBruto - pesoTela - pesoParihuela;
    const complementos = grupo.get('complementos') as FormArray;

    if (complementos.length === 0) {
      detalle.push({
        codigoPartida: codigoPartida.toUpperCase(),
        codigoParihuela,
        pesoParihuela,
        pesoBruto,
        complemento: '',
        pesoNeto,
        pesoComplemento: 0
      });
    } else {
      complementos.controls.forEach((comp: FormGroup) => {
        detalle.push({
          codigoPartida: codigoPartida.toUpperCase(),
          codigoParihuela,
          pesoParihuela,
          pesoBruto,
          complemento: comp.get('tipo')?.value,
          pesoNeto,
          pesoComplemento: comp.get('peso')?.value ?? 0
        });
      });
    }
  });

  const usuario = GlobalVariable.vusu;
  const estadoParihuela = 'CONFORME';

  this.serviceRegistroParihuela.updateDetPartida(detalle, usuario, estadoParihuela).subscribe({
    next: (res) => {
      console.log('Guardado exitosamente:', res);
    },
    error: (err) => {
      console.error('Error al guardar:', err);
    }
    });
  }


  cargarCategorias(codPartida: string ): void {

    this.serviceRegistroParihuela.getCategoriasById(codPartida.toUpperCase()).subscribe((result: any) => {
      this.categorias = result.elements;

      //COGEMOS EL PRIMER CODIGO DE LA TELA DEL ARREGLO
      this.codigoTelita = this.categorias[0]?.desPartida ?? '';

      //AGREGAMOS LOS CODIGOS DE TELA AL ARREGLO, EXCEPTO EL PRIMERO
      this.tiposComplemento = this.categorias
      .map(cat => cat.desPartida)
      .filter((v, i, a) => v && v !== this.codigoTelita && a.indexOf(v) === i);

      //FORZAMOS A COMPLETAR UN CICLO HASTA QUE SE CARGUE LA DATA Y LUEGO CARGAMOS EL DETALLE
      setTimeout(() => {
      this.onObtenerDetalle();
      }, 0);
    });
  }

  enviarDespacho(){
    let codPartida = this.busquedaForm.get('codigo')?.value.toUpperCase();
    console.log('el codigo partida es: ', codPartida);

    this.http.post(this.baseUrlTinto + 'RegistroPartidaParihuela/postEnviarCabecera', JSON.stringify(codPartida),
    {headers: { 'Content-Type': 'application/json' }}
          ).subscribe(() => {
            this.serviceRegistroParihuela.enviarDespacho(codPartida).subscribe({
            next: (res) => {
            console.log('Se envió el despacho', res);
            },
            error: (err) => {
            console.error('Error al enviar el despacho ', err);
            }
          });
    })

    
  }
  // postEnviarCabecera

}

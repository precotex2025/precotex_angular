import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Console } from 'console';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { RegistroPartidaParihuelaService } from 'src/app/services/registro-partida-parihuela.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registro-partida-parihuela-v2',
  templateUrl: './registro-partida-parihuela-v2.component.html',
  styleUrls: ['./registro-partida-parihuela-v2.component.scss']
})
export class RegistroPartidaParihuelaV2Component implements OnInit {
  //RegistroParihuelaV2 <- ruta
  sCod_Usuario = GlobalVariable.vusu;
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
    private toastr: ToastrService,
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
    if(!cod_Parihuela){
      this.toastr.warning('Ingrese número de partida.', 'Alerta', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing'
      });
      return;
    }
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
            console.log("Detalle de parihuelas:", this.parihuelas);
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
        pesoParihuela: item.pesoParihuela >= 0 ? item.pesoParihuela : 0,
        pesoBruto: item.pesoBruto != null && item.pesoBruto > 0 ? item.pesoBruto : 0,
        pesoTela: item.pesoTela >= 0 ? item.pesoTela : (item.pesoBruto ?? 0),
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
  const Reposicion = this.codigoTelita.toString();

  this.serviceRegistroParihuela.updateDetPartida(detalle, usuario, estadoParihuela, Reposicion).subscribe({
    next: (res) => {
      this.toastr.success('Partida guardada correctamente.', 'Éxito', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing'
      });
      //console.log('Guardado exitosamente:', res);
    },
    error: (err) => {
      this.toastr.error('Error al guardar la partida.', 'Error', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing'
      });
      //console.error('Error al guardar:', err);
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

  enviarDespacho() {
  let codPartida = this.busquedaForm.get('codigo')?.value.toUpperCase();

  this.SpinnerService.show();

  this.serviceRegistroParihuela.enviarDespacho(codPartida, this.sCod_Usuario)
    .subscribe({
      next: (res) => {
        this.toastr.success('Despacho Exitoso', 'Éxito', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing'
        });
        this.SpinnerService.hide();
      },
      error: (err) => {
        this.toastr.error('Error al realizar el despacho.', 'Error', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing'
        });
        this.SpinnerService.hide();
      }
    });
  }
  // postEnviarCabecera


  getTiposDisponibles(grupo: FormGroup): string[] {
  const complementos = grupo.get('complementos') as FormArray;
  const seleccionados = complementos.controls.map(c => c.get('tipo')?.value).filter(v => !!v);

  return this.tiposComplemento.filter(tipo => !seleccionados.includes(tipo));
  }

  validarSeleccion(valor: string, grupo: FormGroup) {
    // Obtener todos los complementos seleccionados en este grupo
    const complementos = grupo.get('complementos') as FormArray;
    const seleccionados = complementos.controls
      .map(c => c.get('tipo')?.value)
      .filter(v => !!v);

    // Contar cuántas veces aparece el valor
    const repetidos = seleccionados.filter(v => v === valor);

    if (repetidos.length > 1) {
      // Mostrar alerta y resetear el último campo
      this.toastr.warning(`El complemento "${valor}" ya fue seleccionado.`, 'Duplicado', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing'
      });

      // Resetear el último control que intentó asignar el duplicado
      complementos.at(complementos.length - 1).get('tipo')?.reset();
    }
  }



}

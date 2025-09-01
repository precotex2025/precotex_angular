import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroPartidaParihuelaService } from 'src/app/services/registro-partida-parihuela.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { HttpErrorResponse } from '@angular/common/http';
import { Console } from 'console';

@Component({
  selector: 'app-registro-partida-parihuela',
  templateUrl: './registro-partida-parihuela.component.html',
  styleUrls: ['./registro-partida-parihuela.component.scss']
})
export class RegistroPartidaParihuelaComponent implements OnInit {

  formularioDet!: FormGroup;
  codigoParihuela: string;
  esEditable = false; // Cambia a true si quieres permitir edición
  arrayList: [];
  countPar: number;
  categorias: any[] = [];
  categoriaSeleccionada: string = ''; // ID seleccionado
  sCod_Usuario = GlobalVariable.vusu;
  estParihurela: string;
  estadoParihuela: string = '2';
  mostrarBotonDespacho = false;

  fields = [
    { controlName: 'pesoParihuela', placeholder: 'Peso Parihuela', },
    { controlName: 'pesoBruto', placeholder: 'Peso Tela' },
    { controlName: 'pesoComplemento', placeholder: 'Peso Complemento' }
    //{ controlName: 'complemento', placeholder: 'Complemento' }
  ];

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService,
    private matSnackBar: MatSnackBar,
    private RegistroPartidaParihuela: RegistroPartidaParihuelaService,
    private fb: FormBuilder,

  ) { }

    //* Declaramos formulario para obtener los controles */
    formulario = this.formBuilder.group({
      Num_Partida:   ['']

    })

  ngOnInit(): void {
    this.formularioDet = this.fb.group({
      detalles: this.fb.array([]) // Array dinámico de inputs
    });
  }

  get detalles(): FormArray {
    return this.formularioDet.get('detalles') as FormArray;
  }

  applyEnterAdd(event: any) {

    const inputElement = event.target as HTMLInputElement;
    const codigoPartida = inputElement.value;

    // Obtener el FormArray 'detalles'
    const detallesArray = this.formularioDet.get('detalles') as FormArray;

    // Contar la cantidad de elementos en el FormArray
    const cantidadElementos = detallesArray.length;

    if(cantidadElementos == 0){
      this.ObtenerDetPartida();
      this.formulario[0] = '';
    }
    else{

      let formularioValido = false;
      const valoresComplemento = this.categorias;
      const valoresUnicos = new Set(valoresComplemento);
      let cantComplemento = valoresComplemento?.length ?? 0;

      detallesArray.controls.forEach((detalle, index) => {

        if(cantComplemento > 0){
          const pesoBruto = detalle.get('pesoBruto')?.value;
          const complemento = detalle.get('complemento')?.value;

          // Si hay opciones en valoresComplemento, validamos que el usuario haya seleccionado una
          if (pesoBruto > 0 && valoresComplemento.length > 0 && !complemento) {
            this.matSnackBar.open('Seleccione el complemento por favor', 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 2500
            });
            this.formulario.patchValue({ Num_Partida: '' });
            formularioValido = true; // Indica que el formulario no es válido
            return;
          }
          cantComplemento--;

        }

      });

      if(!formularioValido){

        detallesArray.controls.forEach((grupo: FormGroup) => {
          grupo.get('pesoParihuela')?.disable();
          grupo.get('pesoBruto')?.disable();
          grupo.get('pesoComplemento')?.disable();
          grupo.get('complemento')?.disable();


          if (this.formulario.get('pesoBruto')?.value! > 0)  {
            this.mostrarBotonDespacho  = true;
          }

          if (this.formulario.get('Num_Partida')?.value! == grupo.get('codigoParihuela')?.value)  {
              grupo.get('pesoParihuela')?.enable();

              if(this.formulario.get('Num_Partida')?.value! == grupo.get('codigoParihuela')?.value && grupo.get('pesoParihuela')?.value > 0){
                grupo.get('pesoParihuela')?.disable();
                grupo.get('pesoBruto')?.enable();

                if(grupo.get('complemento')?.value == ""){
                  grupo.get('pesoComplemento')?.disable();
                }
                else{
                  grupo.get('pesoComplemento')?.enable();
                }
              }
          }
        });
        this.formulario.patchValue({ Num_Partida: '' });
      }

    }
  }


  ObtenerDetPartida() {

    const codigoPartida: string = this.formulario.get('Num_Partida')?.value!;
    const opcion : string = "C";
    const codPartida = codigoPartida.split("-");

    this.cargarCategorias(codPartida[0]);

    this.RegistroPartidaParihuela.obtenerDetPartida(codPartida[0], opcion).subscribe((result: any) => {
      this.detalles.clear(); // Limpia el array antes de agregar nuevos datos
      console.log("result.elements");
      console.log(result.elements);
      result.elements.forEach(dato => {
          const grupo = this.fb.group({

            codigoParihuela: [dato.codigoParihuela],
            pesoParihuela: [{value: dato.pesoParihuela === 0 ? null : dato.pesoParihuela, disabled: dato.pesoParihuela >= 0}],
            pesoBruto: [{ value: dato.pesoBruto === 0 ? null : dato.pesoBruto , disabled: dato.pesoParihuela >= 0}],
            pesoComplemento: [{value: dato.pesoComplemento === 0 ? null : dato.pesoComplemento, disabled: dato.pesoParihuela >= 0}],
            complemento: [{value: dato.complemento === null ?  '': dato.complemento, disabled: dato.pesoBruto >= 0}],

          });

          if (grupo.get('pesoBruto')?.value! > 0)  {
            this.mostrarBotonDespacho  = true;
          }

          grupo.get('pesoComplemento')?.valueChanges.subscribe(valor => {
            if (valor > 0) {
              grupo.get('complemento')?.enable();
              this.mostrarBotonDespacho;
            } else {
              grupo.get('complemento')?.disable();

            }
          });

          grupo.get('pesoBruto')?.valueChanges.subscribe(valor => {
            if (valor > 0) {
              grupo.get('pesoComplemento')?.enable();
              grupo.get('complemento')?.enable();

            } else {
              grupo.get('complemento')?.disable();
            }
          });


          if (codigoPartida == grupo.get('codigoParihuela')?.value)  {
              grupo.get('pesoParihuela')?.enable();

              if(grupo.get('pesoParihuela')?.value > 0 ){
                grupo.get('pesoParihuela')?.disable();
                grupo.get('pesoBruto')?.enable();
                grupo.get('pesoComplemento')?.enable();
                grupo.get('complemento')?.disable();

              }
          }
          this.detalles.push(grupo);

      });

    });
  }


  guardarDetalles() {
    const detallesArray = this.formularioDet.get('detalles') as FormArray;
    const valoresComplemento = detallesArray.controls.map(control => control.get('complemento')?.value);

    console.log("valoresComplemento");
    console.log(valoresComplemento);

    let formularioValido = false;
    let intEstado = 0;

    const valoresUnicos = new Set(valoresComplemento);
    detallesArray.controls.forEach((detalle, index) => {
      //const complemento = Number(detalle.get('complemento')?.value) || 0;
      const complemento = detalle.get('complemento')?.value;
      const pesoComplemento = Number(detalle.get('pesoComplemento')?.value) || 0;
      const pesoBruto = Number(detalle.get('pesoBruto')?.value) || 0;
      const pesoParihuela = Number(detalle.get('pesoParihuela')?.value) || 0;


      console.log("valoresUnicos");
      console.log(valoresUnicos);
      console.log(valoresUnicos.size);
      if(pesoBruto != null){

        if(pesoBruto > 0){
            if (!complemento && detalle.get('pesoComplemento')?.value > 0) {
            this.matSnackBar.open('Seleccione el complemento por favor', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            formularioValido = true;
            return;

          }
        }
      }

    });

    // Si la validación es correcta, continuar con el guardado
    console.log("this.formularioDet.valueválido, enviando datos...", this.formularioDet.value);
    if (!formularioValido) {

      let datos = this.formularioDet.getRawValue();
      // Convertir a array si no lo es
      if (!Array.isArray(datos.detalles)) {
        datos.detalles = datos.detalles ? [datos.detalles] : [];
      }

      // Recorrer y setear null en valores vacíos
      datos.detalles = datos.detalles.map((item: any) => {
        Object.keys(item).forEach((key) => {
          if (item[key] === '') {
            item[key] = null; // Si el campo está vacío, lo establece en null
          }
        });
        return item;
      });

      console.log("Datos procesados:", datos);

      console.log("datos.detalles válido, enviando datos...", datos.detalles);

      this.RegistroPartidaParihuela.updateDetPartida(datos.detalles,this.sCod_Usuario, this.estadoParihuela).subscribe({
        next: (respuesta) => {
          this.formularioDet = this.fb.group({
            detalles: this.fb.array([]) // Array dinámico de inputs
          });

          this.matSnackBar.open('Se guardo los datos correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        },
        error: (error) => {
          this.matSnackBar.open(error.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        }
      });
    }

    //VALIDAR MERMA
    //const codigoPartida: string =  this.formularioDet.get('detalles')?.value.map((item: any) => item.codigoParihuela.split('-')[0]) || [];
    //this.validarMerma(codigoPartida[0]);

    this.formulario.patchValue({ Num_Partida: '' });

  }


  cargarCategorias(codPartida: string ): void {

    this.RegistroPartidaParihuela.getCategoriasById(codPartida).subscribe((result: any) => {
      console.log("cargarCategorias");
      console.log(result.elements);
      this.categorias = result.elements;
      console.log("cargarCategorias fin");
    });
  }


  enviarDespacho() {

      const codPartida = this.formularioDet.get('detalles')?.value.map((item: any) => item.codigoParihuela.split('-')[0]) || [];

      this.RegistroPartidaParihuela.enviarDespacho(codPartida[0]).subscribe({
        next: (respuesta: any) => {
          console.log("estParihurela inicio", respuesta);

          if (respuesta.success === true) {
              this.matSnackBar.open('Se envio despacho correctamente!!!', 'Cerrar', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3500
              });
          } else {
            this.matSnackBar.open(respuesta.message ||'Error al enviar despacho!!!', 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 4500
            });
          }
        },
        error: (error) => {
          console.error('Error al validar merma:', error);
          this.matSnackBar.open(error.message || 'Error al validar merma', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2500
          });
        }
      });
  }

  validarMerma(codPartida: string): void {
    this.RegistroPartidaParihuela.validaMerma(codPartida).subscribe({
      next: (respuesta: any) => {
        console.log("estParihurela inicio", respuesta);

        if (respuesta.success === true) {
            this.matSnackBar.open('Merma "CONFORME"', 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 2500
            });
        } else {
          this.matSnackBar.open('Merma fuera de rango', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2500
          });
        }
      },
      error: (error) => {
        console.error('Error al validar merma:', error);
        this.matSnackBar.open(error.message || 'Error al validar merma', 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2500
        });
      }
    });
  }

  onFocus(index: number, controlName: string) {
    const detalle = this.detalles.at(index) as FormGroup;
    detalle.get(controlName)?.markAsTouched();
  }

  onBlur(index: number, controlName: string) {
    const detalle = this.detalles.at(index) as FormGroup;
    if (!detalle.get(controlName)?.value) {
      detalle.get(controlName)?.markAsUntouched();
    }
  }

}

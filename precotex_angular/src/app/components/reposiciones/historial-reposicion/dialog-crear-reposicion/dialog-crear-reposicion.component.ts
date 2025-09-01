import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ReposicionesService } from 'src/app/services/reposiciones/reposiciones.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dialog-crear-reposicion',
  templateUrl: './dialog-crear-reposicion.component.html',
  styleUrls: ['./dialog-crear-reposicion.component.scss']
})
export class DialogCrearReposicionComponent implements OnInit {

  listar_operacionCliente: Array<any> = [];
  dataComponentes: Array<any> = [];
  dataPiezas: Array<any> = [];
  dataTallas: Array<any> = [];
  submit = false;
  dataItems: Array<any> = [];
  matcher = new MyErrorStateMatcher();
  formulario!: FormGroup;
  formularioTabla!: FormGroup;

  Tipo = '';
  constructor(private reposicionesService: ReposicionesService, private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      accion: ['I'],
      Cod_Cliente: ['', Validators.required],
      Tipo: ['Interno', Validators.required],
      Sede: ['', ],
      Num_Linea: ['', ],
      Artes: ['',],
      Piezas_Falladas: [0, Validators.required],
      Piezas_Malogradas: [0, Validators.required],
      Piezas_Faltantes: [0, Validators.required],
      Observacion: ['',],
      Taller_Externo: ['',],
      Cod_Usuario: ['', Validators.required]
    });

    this.formularioTabla = this.formBuilder.group({
      OC: [''],
      OP: [''],
      Cod_Est: [''],
      Cod_EstPro: [''],
      Cod_Present: [''],
      Des_Present: [''],
      Cod_Talla: [''],
      Pieza: [''],
      Tipo_Tela: [''],
      Cantidad: [''],
      Cod_Compest: [''],
      COMBO: [''],
      Version: [''],
      Tipo: [''],
      Obs_Defecto: ['']
    });
    this.formulario.patchValue({
      Cod_Usuario: GlobalVariable.vusu
    })
    this.CargarOperacionCliente();
  }

  CargarOperacionCliente() {

    this.listar_operacionCliente = [];
    var Abr = ''
    var Abr_Motivo = ''
    var Nom_Cliente = ''
    var Cod_Accion = 'L'
    this.reposicionesService.getClientes(Abr, Abr_Motivo, Nom_Cliente, Cod_Accion).subscribe(
      (result: any) => {
        this.listar_operacionCliente = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  get f() { return this.formulario.controls; }

  crearReposicion() {
    console.log(this.f.Observacion.status);
    this.submit = true;
    if (this.formulario.valid) {
      if (this.dataItems.length > 0) {
        this.SpinnerService.show();
        this.reposicionesService.retornaIdReposicion().subscribe(
          (result: any) => {
            console.log(result);
            let comodin = ''
            switch (result.toString().length) {
              case 1: comodin = '0000000'
                break;
              case 2: comodin = '000000'
                break;
              case 3: comodin = '00000'
                break;
              case 4: comodin = '0000'
                break;
              case 5: comodin = '000'
                break;
              case 6: comodin = '00'
                break;
              case 7: comodin = '0'
                break;
              case 8: comodin = ''
                break;
            }

            let idGnReposicion = comodin + result
            let datos = {
              Accion: 'I',
              Num_Solicitud: idGnReposicion,
              Tipo: this.formulario.get('Tipo').value,
              Cod_Cliente: this.formulario.get('Cod_Cliente').value,
              Sede: this.formulario.get('Sede').value,
              Num_Linea: this.formulario.get('Num_Linea').value,
              Artes: this.formulario.get('Artes').value,
              Piezas_Falladas: this.formulario.get('Piezas_Falladas').value,
              Piezas_Malogradas: this.formulario.get('Piezas_Malogradas').value,
              Piezas_Faltantes: this.formulario.get('Piezas_Faltantes').value,
              Observacion: this.formulario.get('Observacion').value,
              Cod_Usuario: this.formulario.get('Cod_Usuario').value,
              Taller_Externo: this.formulario.get('Taller_Externo').value,
              data: this.dataItems
            };
            this.reposicionesService.CF_INSERTAR_REPOSICION_CAB(datos).subscribe(
              (result: any) => {
                console.log(result);
                this.SpinnerService.hide();
                if (result.msg == 'OK') {
                  this.matSnackBar.open('Se realizo correctamente el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                  this.dataItems = [];
                  this.formularioTabla.reset();
                  this.formulario.reset();

                  this.formulario.patchValue({
                    accion: 'I',
                    Piezas_Falladas: 0,
                    Piezas_Malogradas: 0,
                    Piezas_Faltantes: 0
                  });
                } else {
                  this.matSnackBar.open('Ha ocurrido un error al realizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                }
              },
              (err: HttpErrorResponse) => {
                this.SpinnerService.hide();
                this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              })

          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          })
      } else {
        this.SpinnerService.hide();
        this.matSnackBar.open('Debes ingresar el detalle de la reposición..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    } else {
      this.SpinnerService.hide();
      this.matSnackBar.open('Debes llenar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  changeMotivo(event){
    console.log(event);
    this.Tipo = event.value;
  }

  eliminarItem(item, index) {
    console.log(item);
    console.log(index);
    this.dataItems.splice(index, 1);
    console.log(this.dataItems);
  }


  agregarItem() {
    if (this.dataItems.length == 0) {
      var OC = this.formularioTabla.get('OC').value;
      var Cod_Compest = this.formularioTabla.get('Cod_Compest').value;
      var Pieza = this.formularioTabla.get('Pieza').value;
      var Cod_Talla = this.formularioTabla.get('Cod_Talla').value;
      var Cantidad = this.formularioTabla.get('Cantidad').value;
      var Tipo = this.formularioTabla.get('Tipo').value;
      var Obs_Defecto = this.formularioTabla.get('Obs_Defecto').value;
      if ((OC != '' && OC != null) && (Cantidad != '' && Cantidad != null) && (Cod_Compest != '' && Cod_Compest != null) && (Pieza != '' && Pieza != null) && (Cod_Talla != '' && Cod_Talla != null) && (Tipo != '' && Tipo != null)) {
        if(((Tipo == '1' || Tipo == '2') && Obs_Defecto != '') || Tipo == '3'){
          this.dataItems.push(this.formularioTabla.value);
          this.formularioTabla.reset();
        }else{
          this.matSnackBar.open('Debes seleccionar el detalle.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })  
        }
        
      } else {
        this.matSnackBar.open('Debes ingresar los campos requeridos.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    }else{
      if(this.dataItems[0].Cod_Est == this.formularioTabla.get('Cod_Est').value){
        var OC = this.formularioTabla.get('OC').value;
        var Cod_Compest = this.formularioTabla.get('Cod_Compest').value;
        var Pieza = this.formularioTabla.get('Pieza').value;
        var Cod_Talla = this.formularioTabla.get('Cod_Talla').value;
        var Cantidad = this.formularioTabla.get('Cantidad').value;
        var Tipo = this.formularioTabla.get('Tipo').value;
        var Obs_Defecto = this.formularioTabla.get('Obs_Defecto').value;
        if ((OC != '' && OC != null) && (Cantidad != '' && Cantidad != null) && (Cod_Compest != '' && Cod_Compest != null) && (Pieza != '' && Pieza != null) && (Cod_Talla != '' && Cod_Talla != null)  && (Tipo != '' && Tipo != null)) {
          if(((Tipo == '1' || Tipo == '2') && Obs_Defecto != '') || Tipo == '3'){
            console.log(this.formularioTabla.value);
            this.dataItems.push(this.formularioTabla.value);
            this.formularioTabla.reset();
          }else{
            this.matSnackBar.open('Debes seleccionar el detalle.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })  
          }
         
        } else {
          this.matSnackBar.open('Debes ingresar los campos requeridos.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }else{
        this.matSnackBar.open('No puedes ingresar estilos diferentes en la reposición.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    }

  }

  getValidarOC(event) {
    var OC = event.target.value;
    if (OC != '' && OC.length >= 5) {
      this.dataComponentes = [];
      this.reposicionesService.cf_busca_Componentes(OC).subscribe(
        (result: any) => {
          console.log(result);
          if (result.length == 0) {
            this.matSnackBar.open('La OC Ingresada no existe.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          } else {
            this.dataComponentes = result;
            this.formularioTabla.patchValue({
              OC: OC,
              OP: result[0]['OP'],
              Cod_Est: result[0]['cod_estcli'],
              Cod_EstPro: result[0]['cod_estpro'],
              Cod_Present: result[0]['COD_PRESENT'],
              Des_Present: result[0]['PRESENTACION'],
              Version: result[0]['cod_version']
            })
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
    }
  }

  changeComponente(event) {
    console.log(event);
    var data = this.dataComponentes.filter(element => {
      return element.COD_COMPEST === event.value;
    });

    console.log(data);
    this.formularioTabla.patchValue({
      Tipo_Tela: data[0].DES_TELA,
      Cod_Compest: data[0].COD_COMPEST,
      COMBO: data[0].COMBO
    });

    this.getBuscarPiezas(data);
    this.getBuscarTalla(data);
    // this.formularioTabla.patchValue({

    // })
  }

  getBuscarPiezas(data) {
    this.dataPiezas = [];
    this.reposicionesService.buscarPiezaComponente('V', data[0].cod_estpro, data[0].cod_version, data[0].COD_COMPEST).subscribe(
      (result: any) => {
        console.log(result);
        if (result != false) {
          this.dataPiezas = result;
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      })
  }

  getBuscarTalla(data) {
    this.dataTallas = [];
    this.reposicionesService.CF_BUSCAR_PIEZA_TALLA(data[0].OP, data[0].COD_PRESENT).subscribe(
      (result: any) => {
        console.log(result);
        if (result != false) {
          this.dataTallas = result;
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      })
  }
}

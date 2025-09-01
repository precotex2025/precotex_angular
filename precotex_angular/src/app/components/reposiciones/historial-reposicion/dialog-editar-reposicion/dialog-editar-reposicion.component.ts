import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
  selector: 'app-dialog-editar-reposicion',
  templateUrl: './dialog-editar-reposicion.component.html',
  styleUrls: ['./dialog-editar-reposicion.component.scss']
})
export class DialogEditarReposicionComponent implements OnInit {

  listar_operacionCliente: Array<any> = [];
  dataComponentes: Array<any> = [];
  dataPiezas: Array<any> = [];
  dataTallas: Array<any> = [];
  submit = false;
  dataItems: Array<any> = [];
  matcher = new MyErrorStateMatcher();
  formulario!: FormGroup;
  formularioTabla!: FormGroup;
  Tipo:string = '';
  constructor(private reposicionesService: ReposicionesService, private matSnackBar: MatSnackBar, private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    console.log(this.data);
    this.formulario = this.formBuilder.group({
      accion: ['I'],
      Cod_Cliente: ['', Validators.required],
      Tipo: ['Interno', Validators.required],
      Sede: ['',],
      Num_Linea: ['', Validators.required],
      Artes: ['',],
      Piezas_Falladas: [0, Validators.required],
      Piezas_Malogradas: [0, Validators.required],
      Piezas_Faltantes: [0, Validators.required],
      Observacion: ['',],
      Cod_Usuario: ['', Validators.required]
    });

    this.formularioTabla = this.formBuilder.group({
      Co_CodOrdPro: [''],
      Cod_OrdPro: [''],
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
      accion: 'U',
      Cod_Cliente: this.data.data.Cod_Cliente,
      Tipo: this.data.data.Tipo,
      Sede: this.data.data.Sede,
      Num_Linea: this.data.data.Num_Linea,
      Artes: this.data.data.Artes,
      Piezas_Falladas: this.data.data.Piezas_Falladas,
      Piezas_Malogradas: this.data.data.Piezas_Malogradas,
      Piezas_Faltantes: this.data.data.Piezas_Faltantes,
      Observacion: this.data.data.Observacion,
      Cod_Usuario: this.data.data.Cod_usuario
    });

    this.CargarOperacionCliente();
    this.getDetalles();
  }

  changeMotivo(event){
    console.log(event);
    this.Tipo = event.value;
  }


  getDetalles() {
    this.reposicionesService.getReposiciones('O', this.data.data.Num_Solicitud, '', '').subscribe(
      (result: any) => {
        console.log(result);
        if (result != false) {
          this.dataItems = result;
        } else {
          this.dataItems = [];
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      })
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

  editarReposicion() {
    console.log(this.formulario);
    this.submit = true;
    if (this.formulario.valid) {
      if (this.dataItems.length > 0) {
        this.SpinnerService.show();

            let datos = {
              Accion: 'U',
              Num_Solicitud: this.data.data.Num_Solicitud,
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
              data: []
            };
            this.reposicionesService.CF_INSERTAR_REPOSICION_CAB(datos).subscribe(
              (result: any) => {
                console.log(result);
                this.SpinnerService.hide();
                if (result[0].Respuesta == 'OK') {
                  this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
                  //this.dataItems = [];
                  //this.formularioTabla.reset();
                  //this.formulario.reset();

                  this.dialog.closeAll();
                } else {
                  this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
                }
              },
              (err: HttpErrorResponse) => {
                this.SpinnerService.hide();
                this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              
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

  eliminarItem(item, index) {
    console.log(item);
    console.log(index);
    this.dataItems.splice(index, 1);
    console.log(this.dataItems);
  }


  agregarItem() {
    console.log( this.formularioTabla.value);
    console.log(this.dataItems[0].Cod_Est)
    if (this.dataItems.length == 0) {
      var OC = this.formularioTabla.get('Co_CodOrdPro').value;
      var Cod_Compest = this.formularioTabla.get('Cod_Compest').value;
      var Pieza = this.formularioTabla.get('Pieza').value;
      var Cod_Talla = this.formularioTabla.get('Cod_Talla').value;
      var Cantidad = this.formularioTabla.get('Cantidad').value;
      var Tipo = this.formularioTabla.get('Tipo').value;
      var Obs_Defecto = this.formularioTabla.get('Obs_Defecto').value;
      if ((OC != '' && OC != null) && (Cantidad != '' && Cantidad != null) && (Cod_Compest != '' && Cod_Compest != null) && (Pieza != '' && Pieza != null) && (Cod_Talla != '' && Cod_Talla != null)  && (Tipo != '' && Tipo != null)) {
        console.log(this.formularioTabla.value);
        // this.dataItems.push(this.formularioTabla.value);
        
        if(((Tipo == '1' || Tipo == '2') && Obs_Defecto != '') || Tipo == '3'){
          this.formularioTabla.reset();
          this.addItem('I', 0);
        }else{
          this.matSnackBar.open('Debes seleccionar el detalle.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })  
        }
      } else {
        this.matSnackBar.open('Debes ingresar los campos requeridos.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    } else {
      if (this.dataItems[0].Cod_Est == this.formularioTabla.get('Cod_Est').value) {
        var OC = this.formularioTabla.get('Co_CodOrdPro').value;
        var Cod_Compest = this.formularioTabla.get('Cod_Compest').value;
        var Pieza = this.formularioTabla.get('Pieza').value;
        var Cod_Talla = this.formularioTabla.get('Cod_Talla').value;
        var Cantidad = this.formularioTabla.get('Cantidad').value;
        var Tipo = this.formularioTabla.get('Tipo').value;
        var Obs_Defecto = this.formularioTabla.get('Obs_Defecto').value;
        if ((OC != '' && OC != null) && (Cantidad != '' && Cantidad != null) && (Cod_Compest != '' && Cod_Compest != null) && (Pieza != '' && Pieza != null) && (Cod_Talla != '' && Cod_Talla != null)) {
          
          if(((Tipo == '1' || Tipo == '2') && Obs_Defecto != '') || Tipo == '3'){
            console.log(this.formularioTabla.value);
            this.addItem('I', 0);
            this.formularioTabla.reset();
          }else{
            this.matSnackBar.open('Debes seleccionar el detalle.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })  
          }
        } else {
          this.matSnackBar.open('Debes ingresar los campos requeridos.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      } else {
        this.matSnackBar.open('No puedes ingresar estilos diferentes en la reposición.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    }

  }

  addItem(Accion, Id_Reposicion_Detalle){
    this.reposicionesService.insertarDetalle(
      Accion,
      Id_Reposicion_Detalle,
      this.data.data.Num_Solicitud,
      this.formularioTabla.get('Co_CodOrdPro').value,
      this.formularioTabla.get('Cod_Est').value,
      this.formularioTabla.get('Cod_OrdPro').value,
      this.formularioTabla.get('Cod_Present').value,
      this.formularioTabla.get('Des_Present').value,
      this.formularioTabla.get('Pieza').value,
      this.formularioTabla.get('Cod_Talla').value,
      this.formularioTabla.get('Cantidad').value,
      this.formularioTabla.get('Tipo_Tela').value,
      this.formularioTabla.get('Cod_Compest').value,
      this.formularioTabla.get('COMBO').value,
      this.formularioTabla.get('Version').value,
      this.formularioTabla.get('Cod_EstPro').value,
    ).subscribe(
      (result: any) => {
        console.log(result);
        if(result[0]['Respuesta'] == 'OK'){
          if(Accion == 'I'){
            this.matSnackBar.open('Se inserto el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }else{
            this.matSnackBar.open('Se elimino el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          this.getDetalles();
        }else{
          if(Accion == 'I'){
            this.matSnackBar.open('Ha ocurrido un error.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }else{
            this.matSnackBar.open('Ha ocurrido un error al eliminar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
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
              Co_CodOrdPro: OC,
              Cod_OrdPro: result[0]['OP'],
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

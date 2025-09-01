import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MovimientoLiquidacionAviosService } from 'src/app/services/movimiento-liquidacion-avios.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import * as moment from 'moment';

interface data {
  Fecha: string,
  Num_Liquidacion: string,
  area_liquida: string,
  IdCliente: string,
  cliente: string,
  resp_liquid: string,
  linea_liquida: string,
  idliquida: string,
  idplanta: string
}


interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}
@Component({
  selector: 'app-dialog-cabecera-liquidacion',
  templateUrl: 'dialog-cabecera-liquidacion.component.html',
  styleUrls: ['dialog-cabecera-liquidacion.component.scss']
})
export class DialogCabeceraLiquidacionComponent implements OnInit {

  listar_Cliente: Cliente[] = [];
  filtroCliente: Observable<Cliente[]> | undefined;
  Opcion = "";
  Id_Liquidacion = "";
  Fecha = "";
  Area = "";
  Linea = "";
  IdCliente = "";
  Cliente = "";
  Usuario = "";
  NombreUsuario = "";
  Planta = "";
  Num_Liquidacion = ""
  Flg_Status = ""
  Cod_Usuario = ""
  Can_Lote = 0
  Cod_Motivo = ''
  Titulo = ''
  Cod_EstCli = ''
  myControl = new FormControl();
  formulario = this.formBuilder.group({
  })

  listar_lineas = [];
  Abr = ''
  Nom_Cliente = ''
  Cod_Cliente = ''
  Cod_Accion = ''

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: data,
    private movimientoLiquidacionAviosService: MovimientoLiquidacionAviosService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,) {

    this.formulario = formBuilder.group({
      Fecha: ['', Validators.required],
      Area: ['', Validators.required],
      Linea: ['', [Validators.required,
      Validators.pattern('[0-9]*')]],
      IdCliente: ['', Validators.required],
      Cliente: [''],
      Usuario: [''],
      NombreUsuario: [''],
      IdLiquidacion: [''],
      IdPlanta: ['']
    });
  }

  ngOnInit(): void {

    this.formulario.controls['Usuario'].setValue(GlobalVariable.vusu);
    this.formulario.controls['IdPlanta'].setValue(this.data.idplanta);
    this.CargarCliente();
    this.CargarNombreUsuario();
    this.Titulo = this.data.Num_Liquidacion
    if (this.Titulo != undefined) {
      /*
          this.formulario.controls['Fecha'].disable();
         
    */
           
      this.limpiar()
      this.formulario.reset(); 
      const fechaSeleccionada = new Date(this.data.Fecha);
      this.formulario.controls['Fecha'].setValue(fechaSeleccionada);
      this.formulario.controls['Area'].setValue(this.data.area_liquida);
      this.formulario.controls['Linea'].setValue(this.data.linea_liquida);
      this.formulario.controls['IdCliente'].setValue(this.data.IdCliente);
      this.formulario.controls['Cliente'].setValue(this.data.cliente);
      this.formulario.controls['Usuario'].setValue(GlobalVariable.vusu);
      this.formulario.controls['NombreUsuario'].setValue('');
      this.formulario.controls['IdLiquidacion'].setValue(this.data.idliquida);
      this.formulario.controls['IdPlanta'].setValue(this.data.idplanta);
    } 
  }

  get linea() {
    return this.formulario.get('Linea') as FormControl;
  }

  get lineaErrors() {
    if (this.linea.hasError('pattern')) {
      return 'Este campo solo permite números';
    }
    return '';
  }

  submit(formDirective): void {

    this.Opcion = 'I'
    this.Num_Liquidacion = ''
    this.Id_Liquidacion = '0'
    if (this.Titulo != undefined) {
      this.Opcion = 'A'
      this.Num_Liquidacion = this.data.Num_Liquidacion;
      this.Id_Liquidacion = this.formulario.get('IdLiquidacion')?.value;
    }

    if (!_moment(this.formulario.get('Fecha')?.value).isValid()) {
      this.Fecha = '01/01/1900';
    }

    this.Fecha = _moment(this.formulario.get('Fecha')?.value.valueOf()).format('DD/MM/YYYY');

    const formData = new FormData();
    formData.append('Opcion', this.Opcion);
    formData.append('Id_Liquidacion', this.Id_Liquidacion);
    formData.append('Fecha_Liquidacion', this.Fecha);
    formData.append('Cod_Cliente', this.formulario.get('IdCliente')?.value);
    formData.append('Area_Liquidacion', this.formulario.get('Area')?.value);
    formData.append('Linea_Liquidacion', this.formulario.get('Linea')?.value);
    formData.append('Resp_Liquidacion', this.formulario.get('Usuario')?.value);
    formData.append('Id_Planta', this.formulario.get('IdPlanta')?.value);
    formData.append('Liquidacion', this.Num_Liquidacion);





    this.Flg_Status = 'P'
    this.Cod_EstCli = ''

    this.movimientoLiquidacionAviosService.MantMovimientoLiquidacionAviosCabService(
      formData
    ).subscribe(
      (result: any) => {

        if (result[0].Respuesta !== 'false') {

          if (this.Titulo == undefined) {
            this.limpiar()
            formDirective.resetForm();
            this.formulario.reset();
          }
          this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    )

  }

  limpiar() {
    this.formulario.controls['Fecha'].setValue('');
    this.formulario.controls['Area'].setValue('');
    this.formulario.controls['Linea'].setValue('');
    this.formulario.controls['IdCliente'].setValue('');
    this.formulario.controls['Cliente'].setValue('');
    this.formulario.controls['Usuario'].setValue('');
    this.formulario.controls['NombreUsuario'].setValue('');
  }



  CargarCliente() {

    this.listar_Cliente = [];
    this.Abr = ''
    this.Cod_Cliente = ''
    this.Nom_Cliente = this.formulario.get('Cliente')?.value
    this.Cod_Accion = 'L'

    this.movimientoLiquidacionAviosService.cargarClienteService(this.Abr, this.Cod_Cliente, this.Nom_Cliente, this.Cod_Accion).subscribe(
      (result: any) => {
        this.listar_Cliente = result
        this.RecargarCliente();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  RecargarCliente() {
    this.filtroCliente = this.formulario.controls['Cliente'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterCliente(option) : this.listar_Cliente.slice())),
    );
  }


  private _filterCliente(value: string): Cliente[] {
    if (value == null || value == undefined) {
      value = ''
    }
    const filterValue = value.toLowerCase();
    return this.listar_Cliente.filter(option => option.Nom_Cliente.toLowerCase().includes(filterValue));
  }

  CambiarValorCliente(Cod_Cliente: string, Abr_Cliente: string) {
    this.Cod_Cliente = Cod_Cliente;
    this.formulario.controls['IdCliente'].setValue(Abr_Cliente);
  }


  CargarNombreUsuario() {

    this.Usuario = this.formulario.get('Usuario')?.value;
    this.seguridadControlVehiculoService.mantenimientoUsuarioService(
      this.Usuario
    ).subscribe(
      (result: any) => {

        if (result.length > 0) {
          this.NombreUsuario = result[0].Nom_usuario;

        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        // this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }


}



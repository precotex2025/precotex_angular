import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from '../../../../services/seguridad-control-vehiculo.service';
import { DialogEliminarComponent } from '../../../dialogs/dialog-eliminar/dialog-eliminar.component';

import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogVehiculoModificarKmComponent } from '../dialog-vehiculo/dialog-vehiculo-modificar-km/dialog-vehiculo-modificar-km.component';

@Component({
  selector: 'app-seguridad-control-vehiculo-historial',
  templateUrl: './seguridad-control-vehiculo-historial.component.html',
  styleUrls: ['./seguridad-control-vehiculo-historial.component.scss']
})
export class SeguridadControlVehiculoHistorialComponent implements OnInit {

  nNum_Planta = GlobalVariable.num_planta;
  des_planta = ''
  Cod_Barras = ''
  Dni_Conductor = ''
  ope = ''
  Visible_Observacion: boolean = false

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //fec_registro: [''],
    sCod_Barras: [''],
    nDni_Conductor: ['']
  })  

  displayedColumns_cab: string[] = ['tipo','fecha','hora', 'vehiculo', 'conductor', 'origen', 'destino','kilometraje','tipo_operacion','ver','detalle']

    
  
  public data_det = [{
    hora: "",
    vehiculo: "",
    conductor: "",
    origen: "",
    destino: "",
    Cod_Barras:"",
    Cod_Accion:"",
    Cod_Vehiculo:"",
    Num_Kilometraje: "",
    Num_Planta_Destino:"",
    Dni_Conductor: "",
    Numero_Planta:"",
    tipo: "",
    Num_Conductor:"",
    Observacion:"",
    tipo_operacion: ""

  }] 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog:MatDialog) { }

  ngOnInit(): void {
    this.MostrarTitulo();

    this.formulario = new FormGroup({
      'sCod_Barras': new FormControl(''),
      'nDni_Conductor': new FormControl(''),
      'fec_registro': new FormControl(''),
    });
    
  }
  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['fec_registro'].setValue('')
  }

  MostrarTitulo() {
    if (GlobalVariable.num_planta == 1) {
      this.des_planta = 'Santa Maria'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'Santa Cecilia'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'Huachipa Sede I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'Huachipa Sede II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'Independencia'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'Independencia II'
    } else if (GlobalVariable.num_planta == 13) {
      this.des_planta = 'Santa Rosa'
    } else if (GlobalVariable.num_planta == 11) {
      this.des_planta = 'VyD'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'Huachipa Sede III'
    } else {
      this.des_planta = ''
    }
  }  
 
 
  ListarHistorial() {
    
    
    this.Cod_Barras = this.formulario.get('sCod_Barras')?.value
    this.Dni_Conductor = this.formulario.get('nDni_Conductor')?.value

   /* if(this.Cod_Barras.length){
      this.Cod_Barras =''
    }
    
    if(this.Dni_Conductor == ''){
      this.Dni_Conductor = 'null'
    }*/
  
    

    this.seguridadControlVehiculoService.ListarHistoritalService(this.nNum_Planta,this.Cod_Barras,this.Dni_Conductor,
      this.formulario.get('fec_registro')?.value).subscribe(
        (result: any) => {
          this.data_det = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 4000,
        }))
  }
 
  ModificarKm(Id: number, Num_Kilometraje: number){
    if(GlobalVariable.vCod_Rol == 1 || GlobalVariable.vCod_Rol == 3){
      let dialogRef =  this.dialog.open(DialogVehiculoModificarKmComponent, { disableClose: true, data:{Id: Id, Km: Num_Kilometraje} });
      dialogRef.afterClosed().subscribe(result =>{
      if(result == 'true'){  
        this.ListarHistorial()
        } 
      })
    }
  }


  EliminarRegistro(Cod_Barras: string,Cod_Accion:string,Cod_Vehiculo:string,Num_Kilometraje: string, Num_Planta_Destino: String,Dni_Conductor: string,Numero_Planta:string) {

    let dialogRef =  this.dialog.open(DialogEliminarComponent, { disableClose: true, data:{} });
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){  


    this.seguridadControlVehiculoService.EliminarRegistroService(
      this.nNum_Planta,
      Cod_Barras,
      Cod_Accion,
      Cod_Vehiculo,
      Num_Kilometraje,
      Num_Planta_Destino,
      Dni_Conductor,
      Numero_Planta,
      this.ope).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 4000 })

            this.ListarHistorial()
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 4000 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 4000 }))
      } 
    })
  }

     

}

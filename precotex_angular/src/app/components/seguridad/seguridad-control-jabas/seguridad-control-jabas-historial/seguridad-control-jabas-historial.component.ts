import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlJabaService } from 'src/app/services/seguridad-control-jaba.service';
import { ExcelService } from 'src/app/services/excel.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-seguridad-control-jabas-historial',
  templateUrl: './seguridad-control-jabas-historial.component.html',
  styleUrls: ['./seguridad-control-jabas-historial.component.scss']
})
export class SeguridadControlJabasHistorialComponent implements OnInit {

     
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
   
  })  

  displayedColumns_cab: string[] = ['tipo','hora', 'vehiculo', 'conductor', 'origen', 'destino','kilometraje','tipo_operacion','ver']

    

  public data_det = [{
    tipo: "",
    fecha: "",
    hora: "",
    Num_Guia:"",
    Cod_Jaba: "",
    Des_Jaba: "",
    origen: "",
    destino: "",
    Cod_Usuario: ""

  }] 

 
  public data_det_excel = [{
    fecha: "",
    hora: "",
    numero_guia:"",
    codigo_jaba: "",
    descripcion:"",
    codigo_barras:"",
    accion: "",
    numero_planta_origen:"", 
    planta_origen:"",
    numero_planta_destino:"",
    planta_destino:"",
    codigo_usuario:"",
    codigo_proveedor:"",
    ruc_proveedor:"",
    proveedor:""
  }] 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlJabaService: SeguridadControlJabaService,
    private excelService:ExcelService) { }

  ngOnInit(): void {
    this.MostrarTitulo();
    this.ListarHistorialExcel();
    this.formulario = new FormGroup({
      'sCod_Barras': new FormControl(''),
      'fec_registro': new FormControl(''),
    });
    
  }

  exportAsXLSX():void {
    console.log(this.data_det_excel)
    this.excelService.exportAsExcelFile(this.data_det_excel, 'Historial-Control-Jabas');
 }
  
  MostrarTitulo() {
    if (GlobalVariable.num_planta === 1) {
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
    

    this.seguridadControlJabaService.ListarHistoritalService(this.nNum_Planta,this.Cod_Barras,
      this.formulario.get('fec_registro')?.value).subscribe(
        (result: any) => {
          if(result.length>0){
          if (result[0].Respuesta == 'OK') {
            this.data_det = result
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }}
          else{
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }


  ListarHistorialExcel() {
  

    this.seguridadControlJabaService.ListarHistoritalExcelService().subscribe(
        (result: any) => {
          if(result.length>0){
         
            this.data_det_excel = result
            
          }
          else{
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }
 


  EliminarRegistro(Cod_Jaba: number) {

    alert(Cod_Jaba)
   /* this.seguridadControlVehiculoService.EliminarRegistroService(
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
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

            this.ListarHistorial()
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  */
      }


     
      

}

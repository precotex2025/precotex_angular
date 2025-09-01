import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from '../../services/seguridad-control-vehiculo.service';
import { DialogEliminarComponent } from '../dialogs/dialog-eliminar/dialog-eliminar.component';

import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { SeguridadVisitasService } from 'src/app/services/seguridad-visitas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExceljsVisitasService } from 'src/app/services/exceljs-visitas.service';

@Component({
  selector: 'app-reporte-visitas',
  templateUrl: './reporte-visitas.component.html',
  styleUrls: ['./reporte-visitas.component.scss']
})
export class ReporteVisitasComponent implements OnInit {

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

  displayedColumns_cab: string[] = ['Fecha_Registro','Cod_Empresa','Tipo_Documento','Nombres_Visita', 'Hora_Ingreso','Hora_Salida', 'Horas_Planta','Area_Visitada', 'Motivo_Visita','Observaciones','Cod_Usuario']


  dataForExcel = [];
    
  
  public data_det = [{
    //Id: "",
    Fec_Registro: "",
    Cod_Empresa: "",
    Tipo_Documento: "",
    Nro_DNI: "",
    Nombres_Visita: "", 
    Empresa: "", 
    Hora_Ingreso: "", 
    Hora_Salida: "", 
    Horas_Planta: "",
    Area_Visitada: "",
    Persona_Visitada: "",
    Motivo_Visita: "",
    Observaciones: "",
    Cod_Usuario: ""
  }] 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private exceljsVisitasService: ExceljsVisitasService,
    private seguridadVisitasService: SeguridadVisitasService,
    private SpinnerService: NgxSpinnerService,
    public dialog:MatDialog) { }

  ngOnInit(): void {
    this.MostrarTitulo();

    this.formulario = new FormGroup({
      'sCod_Barras': new FormControl(''),
      'nDni_Conductor': new FormControl(''),
      'fec_registro': new FormControl(''),
    });
    
    this.ListarHistorial();
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
      this.des_planta = 'Independencia III'
    }else {
      this.des_planta = ''
    }
  }  
 
 
  ListarHistorial() {

    this.Dni_Conductor = this.formulario.get('nDni_Conductor')?.value
    this.SpinnerService.show();
    this.seguridadVisitasService.SEG_OBTENER_VISITAS(this.formulario.get('fec_registro')?.value, this.Dni_Conductor, this.nNum_Planta,
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          this.data_det = result
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 4000,
        })
      })
  }
 


  EliminarRegistro() {

   
  }

  exportarRegistros(){
    
      if (this.data_det.length == 0) {
        this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
      else {
        var data = [];

        this.data_det.forEach((elem:any) => {
          let datos = {
            ['Fecha Registro'] : elem.Fec_Registro,
            ['Empresa Visitada']: elem.Cod_Empresa == '07' ? 'PRECOTEX SAC' : elem.Cod_Empresa  == '56' ? 'VYD' : elem.Cod_Empresa  == '77' ? 'SABOR CRIOLLO' : 'KAPRA',
            ['Empresa Visitante']: elem.Empresa,
            ['Tipo Documento']: elem.Tipo_Documento,
            ['N° DNI']: elem.Nro_DNI,
            ['Nombres Visitante']: elem.Nombres_Visita,
            ['Área Visitada']: elem.Area_Visitada,
            Planta: this.des_planta,
            ['Motivo Visita'] : elem.Motivo_Visita,
            ['Persona Visitada'] : elem.Persona_Visitada,
            ['Hora Ingreso'] : elem.Hora_Ingreso,
            ['Hora Salida'] : elem.Hora_Salida,
            ['Tiempo Planta'] : elem.Horas_Planta,
            ['Observaciones'] : elem.Observaciones,
            ['Usuario'] : elem.Cod_Usuario
          }

          data.push(datos);
        });
        

        this.dataForExcel = [];
        data.forEach((row: any) => {
          this.dataForExcel.push(Object.values(row))
        })
  
        let reportData = {
          title: 'REPORTE CONTROL VISITAS',
          data: this.dataForExcel,
          headers: Object.keys(data[0])
        }
  
  
        this.exceljsVisitasService.exportExcel(reportData);
        //this.dataSource.data = [];
  
      }
  }
     

}

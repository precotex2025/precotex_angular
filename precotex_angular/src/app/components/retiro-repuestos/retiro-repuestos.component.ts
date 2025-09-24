import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, timeout } from 'rxjs';
import { RetiroRepuestosService } from 'src/app/services/RetiroRepuestos/retiro-repuestos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRetiroRepuestosComponent } from './dialog-retiro-repuestos/dialog-retiro-repuestos/dialog-retiro-repuestos.component';
import { Result } from '@zxing/library';
import { DialogRetiroRepuestosDetalleComponent } from './dialog-retiro-repuestos-detalle/dialog-retiro-repuestos-detalle.component';
import { TOOLTIP_PANEL_CLASS } from '@angular/material/tooltip';
import { DialogRetiroRepuestosCierreComponent } from './dialog-retiro-repuestos-cierre/dialog-retiro-repuestos-cierre.component';
import { ExceljsService } from 'src/app/services/exceljs.service';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';

interface data_req{
  num_requerimiento: number,
  nom_seguridad: string,
  nom_mantenimiento: string,
  nro_precinto_apertura: string,
  nro_precinto_cierre: string,
}


@Component({
  selector: 'app-retiro-repuestos',
  templateUrl: './retiro-repuestos.component.html',
  styleUrls: ['./retiro-repuestos.component.scss']
})
export class RetiroRepuestosComponent implements OnInit {
 FormData: FormGroup;
 @ViewChild(MatSort) sort!: MatSort;   
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private serviceRetiroRepuestos: RetiroRepuestosService,
    private exceljsService: ExceljsService,
    private router: Router,
    private http: HttpClient
  ) { }

  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });    

  

  ngOnInit(): void {
    this.onGetRetiros();
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = [
    'num_requerimiento',
    'fec_creacion',
    'fec_aprobacion',
    'hora_aprobacion',
    'nom_seguridad',
    'nom_mantenimiento',
    'nro_precinto_apertura',
    'nro_precinto_cierre',
    'editar',
    'opcion'
  ];

  dataSource: MatTableDataSource<data_req> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataListadoRequerimientos: Array<any> = [];
  selectListadoRequerimiento: Array<data_req> = [];

  //REPORTE
  dataForExcel: any = [];
  dataSourceExcel: any = [];   
  dataReporteRetiros: Array<any> = [];

  formulario = this.formBuilder.group({
    Num_Requerimiento: ['']
  });

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }
  
  onCreate(){
    // this.router.navigate(['/DialogRetiroRepuestos'],
    //   {queryParams: { 
    //                   Accion: 'Insertar',
    //                   Num_Requerimiento: ''
    //                 }}
    // );
    let dialogRef = this.dialog.open(DialogRetiroRepuestosComponent,{
      width:'500px',
      disableClose: true,
      panelClass: 'my-class',
      data:{
        Title: "Nuevo",
        Accion:"Insertar"
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.onGetRetiros()
    });
  }

  onEdit(objeto: any){
    let num_req = objeto.num_Requerimiento;
    let ctrol_des_seg_env= objeto.nom_Seguridad;
    let ctrol_des_mant_env = objeto.nom_Mantenimiento;
    let ctrol_pre_aper_env = objeto.nro_Precinto_Apertura;

    let dialogRef = this.dialog.open(DialogRetiroRepuestosComponent,{
      width:'500px',
      disableClose: true,
      panelClass: 'my-class',
      data:{
        Title: "Editar",
        Accion: "Editar",
        num_requerimiento: num_req,
        ctrol_des_seg: ctrol_des_seg_env,
        ctrol_des_mant: ctrol_des_mant_env,
        ctrol_pre_aper: ctrol_pre_aper_env,
        
      }
    });
    dialogRef.afterClosed().subscribe(Result=>{
      this.onGetRetiros()
    });
  }

  onGetRetiros(){
    const sFecIni: string = this.range.get('start').value;
    const sFecFin: string = this.range.get('end').value;
    
    if(sFecIni == '' || sFecIni == null || sFecFin == '' || sFecFin == null){
      this.matSnackBar.open("Ingrese Rango de Fechas", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
      );
      return; 
    }else{

    this.SpinnerService.show();
    this.dataListadoRequerimientos = [];
    this.serviceRetiroRepuestos.getListaRetiros(sFecIni, sFecFin).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            console.log('Reparto', response.elements);
            this.dataListadoRequerimientos = response.elements;
            this.dataSource.data = this.dataListadoRequerimientos;
            this.dataSource.sort = this.sort;
            this.SpinnerService.hide();
          }else{
            this.dataListadoRequerimientos = [];
            this.dataSource.data = [];
            this.SpinnerService.hide();
          }
        }else{
          this.dataListadoRequerimientos = [];
          this.dataSource.data = [];
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
}

  onInsertarDetalle(objeto: any){

    let num = objeto.num_Requerimiento;

    // this.router.navigate(['/ruta-al-otro-componente']);

    let dialogRef = this.dialog.open(DialogRetiroRepuestosDetalleComponent,{
      width:'1165px',
      height: '600px',
      disableClose: true,
      panelClass: 'my-class',
      data:{
        Title: "Detalle de Retiro ",  
        num_requerimiento: num
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.onGetRetiros()
    });
  }

  onUpdatePrecintoCierre(objeto: any){
    let num = objeto.num_Requerimiento;

    let dialogRef = this.dialog.open(DialogRetiroRepuestosCierreComponent,{
      width:'500px',
      disableClose: true,
      panelClass: 'my-class',
      data:{
        Title: "Precinto de Cierre",  
        num_requerimiento: num
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.onGetRetiros()
    });
  }

  onExportarExcel(){
    
    this.dataForExcel = [];
    this.dataSourceExcel = [];
    this.dataReporteRetiros = [];

    const sFecIni: string = this.range.get('start').value;
    const sFecFin: string = this.range.get('end').value;

    if(sFecIni == '' || sFecIni == null || sFecFin == '' || sFecFin == null){
      this.matSnackBar.open("Ingrese Rango de Fechas", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
      );
      return;
    }else{
      this.SpinnerService.show();
      this.serviceRetiroRepuestos.getDatosReporte(sFecIni, sFecFin).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.totalElements > 0){

              this.dataReporteRetiros = response.elements;

              //QUE COMIENCE EL JUEGO DE LA EXPORTACION
              this.dataReporteRetiros.forEach((item: any) => {

                let datos = {
                  
                  ['Fec. Aprobacion']: _moment(item.fec_Aprobacion.valueOf()).format('DD/MM/YYYY'),
                  ['Hora Aprobacion']: item.hora_Aprobacion ,
                  ['Nom. Seguridad']: item.nom_Seguridad,
                  ['Fec. Requerimiento']: _moment(item.fec_Creacion.valueOf()).format('DD/MM/YYYY')   ,
                  ['Nom. Mantenimiento']: item.nom_Mantenimiento,
                  ['# Precinto Apertura']: item.nro_Precinto_Apertura,
                  ['# Precinto Cierre']: item.nro_Precinto_Cierre,
                  ['# Requerimiento']: item.num_Requerimiento,
                  ['Secuencia']: item.nro_Secuencia       ,
                  ['Cod. Item']: item.cod_Item ,
                  ['Descripcion']: item.des_Item       ,
                  ['Can. Requerida']: item.can_Requerida           ,
                  ['UM']: item.cod_UniMed,
                  ['Repuesto de Cambio']: item.rpt_Cambio ,
                  ['Foto']: item.itm_Foto   
                };
                this.dataForExcel.push(datos);              
              });        
              
              if (this.dataForExcel.length > 0) {

                this.dataForExcel.forEach((row: any) => {
                  this.dataSourceExcel.push(Object.values(row))
                })              

                let num = 0;
                
                let reportData = {
                  title: 'REPORTE',
                  data: this.dataSourceExcel,
                  headers: Object.keys(this.dataForExcel[0]),
                  Num_Requerimiento: num
                }

                //GUARDA ARCHIVO EXCEL
                this.exceljsService.exportExcel4(reportData);

              } else {
                // this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.SpinnerService.hide();
              }
              this.SpinnerService.hide();
            }
            else{
              this.SpinnerService.hide();
            };
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          console.log(error.error.message, 'Cerrar', {
          timeOut: 2500,
          });
        }
      });
      this.SpinnerService.hide();
    }
  }

  onEnviarCorreo(){
    this.dataForExcel = [];
    this.dataSourceExcel = [];
    this.dataReporteRetiros = [];
 
      this.SpinnerService.show();
      this.serviceRetiroRepuestos.getListaRetiroRepuestosPorIdRequerimientoMAX().subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.totalElements > 0){

              this.dataReporteRetiros = response.elements;

              //QUE COMIENCE EL JUEGO DE LA EXPORTACION
              this.dataReporteRetiros.forEach((item: any) => {

                let datos = {
                  
                  ['Fec. Aprobacion']: _moment(item.fec_Aprobacion.valueOf()).format('DD/MM/YYYY'),
                  ['Hora Aprobacion']: item.hora_Aprobacion ,
                  ['Nom. Seguridad']: item.nom_Seguridad,
                  ['Fec. Requerimiento']: _moment(item.fec_Creacion.valueOf()).format('DD/MM/YYYY')   ,
                  ['Nom. Mantenimiento']: item.nom_Mantenimiento,
                  ['# Precinto Apertura']: item.nro_Precinto_Apertura,
                  ['# Precinto Cierre']: item.nro_Precinto_Cierre,
                  ['# Requerimiento']: item.num_Requerimiento,
                  ['Secuencia']: item.nro_Secuencia       ,
                  ['Cod. Item']: item.cod_Item ,
                  ['Descripcion']: item.des_Item       ,
                  ['Can. Requerida']: item.can_Requerida           ,
                  ['UM']: item.cod_UniMed,
                  ['Repuesto de Cambio']: item.rpt_Cambio ,
                  ['Foto']: item.itm_Foto   
                };
                this.dataForExcel.push(datos);              
              });        
              
              if (this.dataForExcel.length > 0) {

                this.dataForExcel.forEach((row: any) => {
                  this.dataSourceExcel.push(Object.values(row))
                })              

                let num = this.dataReporteRetiros[0].num_Requerimiento;

                let reportData = {
                  title: 'REPORTE',
                  data: this.dataSourceExcel,
                  headers: Object.keys(this.dataForExcel[0]),
                  Num_Requerimiento: num
                }

                //GUARDA ARCHIVO
                this.exceljsService.exportExcel4(reportData);

                this.toastr.success('Correo Enviado', '', {
                  timeOut: 5500,
                });

              } else {
                this.SpinnerService.hide();
              }
              this.SpinnerService.hide();
            }
            else{
              this.SpinnerService.hide();
            };
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          console.log(error.error.message, 'Cerrar', {
          timeOut: 2500,
          });
        }
      });
      
      this.SpinnerService.hide();
    
  }

}

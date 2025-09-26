import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RetiroRepuestosService } from 'src/app/services/RetiroRepuestos/retiro-repuestos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExceljsService } from 'src/app/services/exceljs.service';
import * as _moment from 'moment';

interface data {
  Title: string,
  Accion: string,
  num_requerimiento: number
}

@Component({
  selector: 'app-dialog-retiro-repuestos-cierre',
  templateUrl: './dialog-retiro-repuestos-cierre.component.html',
  styleUrls: ['./dialog-retiro-repuestos-cierre.component.scss']
})
export class DialogRetiroRepuestosCierreComponent implements OnInit {

  formulario = this.formBuilder.group({
    ctrol_pre_cier: ['', [Validators.pattern('[0-9]*')]]
  });

  // ctrol_pre_cier = new FormControl ('', [Validators.pattern('[0-9]*')])
  getErrorMessage() {
      return this.formulario.get('ctrol_pre_cier')?.hasError('pattern') ? 'Ingrese solo números' : '';
  }

  constructor(        
          private formBuilder       : FormBuilder,
          private matSnackBar       : MatSnackBar,
          private serviceRetiro     : RetiroRepuestosService,
          private datePipe          : DatePipe,
          private SpinnerService    : NgxSpinnerService,
          private toastr            : ToastrService,
          private serviceRetiroRepuestos: RetiroRepuestosService,
          private exceljsService: ExceljsService,
          @Inject(MAT_DIALOG_DATA) public data: data,
          public dialogRef: MatDialogRef<DialogRetiroRepuestosCierreComponent>
          ) { }

  ngOnInit(): void {
  }

  onSave(){
      if((this.formulario.get('ctrol_pre_cier')?.value) == '' || (this.formulario.get('ctrol_pre_cier')?.value) == null){
            this.matSnackBar.open("Ingrese N° Precinto de Cierre", "Cerrar",
              {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
            );
            return;
      }else{
        Swal.fire({
        title: "¿Desea Ingresar el Precinto de Cierre?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si',
        cancelButtonText: 'No'
      }).then((result) =>{
        if(result.isConfirmed){
          const nNum_Req = this.data.num_requerimiento;
          const sPre_Cier = (this.formulario.get('ctrol_pre_cier')?.value);
          
          
            let data: any = {
            "Num_Requerimiento": nNum_Req,
            "Nro_Precinto_Cierre": sPre_Cier,
            };
            this.SpinnerService.show();
            this.serviceRetiro.patchActualizarPrecintoCierre(data).subscribe({
              next: (response: any) => {
                if(response.success){
                  if(response.codeResult == 200){
                    
                    this.toastr.success(response.message, '', {
                      timeOut: 2500,
                    });
                    this.onEnviarCorreo();
                    this.dialogRef.close();
                  }else if(response.codeResult == 201){
                    this.toastr.info(response.message, '', {
                      timeOut: 2500,
                    });
                  }
                  this.SpinnerService.hide();
                }else{
                  this.toastr.error(response.message, 'Cerrar', {
                    timeOut:2500
                  });
                  this.SpinnerService.hide();
                }
              },
              error:(error) => {
                this. SpinnerService.hide();
                this.toastr.error(error.message, 'Cerrar', {
                  timeOut: 2500
                });
              }
            })
          
        }
      })
      }
    }

    dataForExcel = [];
    dataSourceExcel = [];
    dataReporteRetiros = [];

  onEnviarCorreo(){
        this.dataForExcel = [];
        this.dataSourceExcel = [];
        this.dataReporteRetiros = [];
     
          this.SpinnerService.show();
          this.serviceRetiroRepuestos.getListaRetiroRepuestosDetallePorNumRequerimiento(this.data.num_requerimiento).subscribe({
            next: (response: any)=> {
              if(response.success){
                if (response.totalElements > 0){
    
                  this.dataReporteRetiros = response.elements;
    
                  
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
                    
                    // this.toastr.success('Correo Enviado', '', {
                    // timeOut: 5500,
                    // });
    
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

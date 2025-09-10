import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    ctrol_pre_cier: ['']
  });

  constructor(        
          private formBuilder       : FormBuilder,
          private matSnackBar       : MatSnackBar,
          private serviceRetiro     : RetiroRepuestosService,
          private datePipe          : DatePipe,
          private SpinnerService    : NgxSpinnerService,
          private toastr            : ToastrService,
          @Inject(MAT_DIALOG_DATA) public data: data,
          public dialogRef: MatDialogRef<DialogRetiroRepuestosCierreComponent>
          ) { }

  ngOnInit(): void {
  }

  onSave(){
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
          console.log('numreq', nNum_Req);
          console.log('precier', sPre_Cier);
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

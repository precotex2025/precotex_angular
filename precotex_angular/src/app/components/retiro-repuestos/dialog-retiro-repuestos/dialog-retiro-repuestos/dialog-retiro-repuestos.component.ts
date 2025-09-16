import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { RetiroRepuestosService } from 'src/app/services/RetiroRepuestos/retiro-repuestos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogRetiroRepuestosDetalleComponent } from '../../dialog-retiro-repuestos-detalle/dialog-retiro-repuestos-detalle.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface data{
  Title: string,
  Accion: string,
  num_requerimiento: number,
  ctrol_des_seg: string,
  ctrol_des_mant: string,
  ctrol_pre_aper: string
}


@Component({
  selector: 'app-dialog-retiro-repuestos',
  templateUrl: './dialog-retiro-repuestos.component.html',
  styleUrls: ['./dialog-retiro-repuestos.component.scss']
})
export class DialogRetiroRepuestosComponent implements OnInit {



  formulario = this.formBuilder.group({
    ctrol_req: [''],
    ctrol_des_seg: [''],
    ctrol_des_mant: [''],
    ctrol_pre_aper: ['', [Validators.pattern('[0-9]*')]],
  });

  getErrorMessage() {
      return this.formulario.get('ctrol_pre_aper')?.hasError('pattern') ? 'Ingrese solo números' : '';
  }

  dataUsuariosSeguridad: Array<any> = [];
  dataUsuariosMantenimiento: Array<any> = [];
  SeguridadFiltrados: any[] = [];

  dataListaRetirosPorNumReq: Array<any> = [];


  constructor(
        private formBuilder       : FormBuilder,
        private matSnackBar       : MatSnackBar,
        private serviceRetiro     : RetiroRepuestosService,
        private datePipe          : DatePipe,
        private SpinnerService    : NgxSpinnerService,
        private toastr            : ToastrService,
        private router            : Router,
        private route             : ActivatedRoute,
        private location          : Location,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: data,
        public dialogRef: MatDialogRef<DialogRetiroRepuestosComponent>,
  ) { }
  Accion = ''
  Num_Requerimiento  = 0
  Nro_Pre_Aper = ''
  ngOnInit(): void {
      
      // this.route.queryParams.subscribe(params => {
      // this.Accion = params['Accion'];
      // this.Num_Requerimiento = parseInt(params['Num_Requerimiento']);
      // this.Nro_Pre_Aper = params['Nro_Pre_Aper'];
      // });

    if(this.data.Accion === 'Insertar')
    {
      this.DesHabilitar(false);
      this.getUsuariosSeguridad();
      this.getUsuariosMantenimiento();
    }
    else if(this.data.Accion === 'Editar')
    {
      this.DesHabilitar(true);
      this.getUsuariosSeguridad();
      this.getUsuariosMantenimiento();
      console.log('numreq2', this.data.num_requerimiento);
      this.getRetirosPorNumReq(this.data.num_requerimiento);

      this.formulario.get('ctrol_req')?.setValue(this.data.num_requerimiento);
      this.formulario.get('ctrol_pre_aper')?.setValue(this.data.ctrol_pre_aper);
    }
  }

  getRetirosPorNumReq(Num_Req){
    this.serviceRetiro.getListaRetirosPorNumReq(Num_Req).subscribe(
      (result:any) => {
        if(result.totalElements > 0){
          this.dataListaRetirosPorNumReq = result.elements;
          this.formulario.get('ctrol_des_seg')?.setValue(this.dataListaRetirosPorNumReq[0].cod_Seguridad);
          this.formulario.get('ctrol_des_mant')?.setValue(this.dataListaRetirosPorNumReq[0].cod_Mantenimiento);
        }else{
          this.matSnackBar.open("No existen registros!", 'Cerrar',{
            horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
          })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar',{
        duration: 1500
      })
    )
  }

  getUsuariosSeguridad(){
    this.serviceRetiro.getUsuariosPorTipoSeguridad().subscribe(
      (result:any) => {
        if(result.totalElements > 0){
          this.dataUsuariosSeguridad = result.elements;
          
        }else{
          this.matSnackBar.open("No existen registros!", 'Cerrar',{
            horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
          })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar',{
        duration: 1500
      })
    )
  }

  getUsuariosMantenimiento(){
    this.serviceRetiro.getUsuariosPorTipoMantenimiento().subscribe(
      (result:any) => {
        if(result.totalElements > 0){
          this.dataUsuariosMantenimiento = result.elements;
        
        }else{
          this.matSnackBar.open("No existen registros!", 'Cerrar',{
            horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
          })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar',{
        duration: 1500
      })
    )
  }

  Regresar(){
    this.location.back();
  }

  Procesar(){
    let sAction = this.data.Accion;

    const sNum_Req = String(this.formulario.get('ctrol_req')?.value);
    const sCod_Seg = (this.formulario.get('ctrol_des_seg')?.value);
    const sCod_Mant = (this.formulario.get('ctrol_des_mant')?.value);
    const sPre_Aper = (this.formulario.get('ctrol_pre_aper')?.value);

    if(sAction === "Insertar")
    {
      if(sNum_Req == '' || sNum_Req == null)
      { 
        this.matSnackBar.open("Ingrese N° Requerimiento", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else if (sCod_Seg == '' || sCod_Seg == null) 
      {
        this.matSnackBar.open("Seleccione Personal de Seguridad", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else if (sCod_Mant == '' || sCod_Mant == null) 
      {
        this.matSnackBar.open("Seleccione Personal de Mantenimiento", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else if (sPre_Aper == '' || sPre_Aper == null) 
      {
        this.matSnackBar.open("Ingrese N° Precinto Apertura", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else { 
        //VERIFICAR SI EL REQUERIMIENTO EXISTE EN LA BASE DE DATOS
        const sNum_Req = String(this.formulario.get('ctrol_req')?.value);
        this.serviceRetiro.getListaRetirosPorNumReq(sNum_Req).subscribe(
        (result:any) => {
          if(result.totalElements > 0){
            this.matSnackBar.open("El N° de requerimiento ya se encuentra registrado", 'Cerrar',{
              horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
            })
          }else{
            this.onSave(); 
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar',{
          duration: 1500
        })
       )        
      }
      
    }
    else
    {
      if(sNum_Req == '' || sNum_Req == null)
      { 
        this.matSnackBar.open("Ingrese N° Requerimiento", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else if (sCod_Seg == '' || sCod_Seg == null) 
      {
        this.matSnackBar.open("Seleccione Personal de Seguridad", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else if (sCod_Mant == '' || sCod_Mant == null) 
      {
        this.matSnackBar.open("Seleccione Personal de Mantenimiento", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else if (sPre_Aper == '' || sPre_Aper == null) 
      {
        this.matSnackBar.open("Ingrese N° Precinto Apertura", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration: 1500}
        );
        return;
      }
      else { this.onUpdate(); }
    }
  }

  onSave(){
    Swal.fire({
      title: "¿Desea Registrar el Retiro?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si',
      cancelButtonText: 'No'
    }).then((result) =>{
      if(result.isConfirmed){
        const sNum_Req = String(this.formulario.get('ctrol_req')?.value);
        const sCod_Seg = (this.formulario.get('ctrol_des_seg')?.value);
        const sCod_Mant = (this.formulario.get('ctrol_des_mant')?.value);
        const sPre_Aper = (this.formulario.get('ctrol_pre_aper')?.value);
        
        let data: any = {
          "Num_Requerimiento": sNum_Req,
          "Cod_Seguridad": sCod_Seg,
          "Cod_Mantenimiento": sCod_Mant,
          "Nro_Precinto_Apertura": sPre_Aper,
          "Nro_Precinto_Cierre": ""
        };


        this.SpinnerService.show();
        this.serviceRetiro.postRegistrarRequerimiento(data).subscribe({
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

  onUpdate(){
    Swal.fire({
      title: "¿Desea Actualizar el Retiro?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si',
      cancelButtonText: 'No'
    }).then((result) =>{
      if(result.isConfirmed){
        const sNum_Req = String(this.formulario.get('ctrol_req')?.value);
        const sCod_Seg = (this.formulario.get('ctrol_des_seg')?.value);
        const sCod_Mant = (this.formulario.get('ctrol_des_mant')?.value);
        const sPre_Aper = (this.formulario.get('ctrol_pre_aper')?.value);
        
        let data: any = {
          "Num_Requerimiento": sNum_Req,
          "Cod_Seguridad": sCod_Seg,
          "Cod_Mantenimiento": sCod_Mant,
          "Nro_Precinto_Apertura": sPre_Aper,
          "Nro_Precinto_Cierre": ""
        };


        this.SpinnerService.show();
        this.serviceRetiro.patchActualizarRequerimiento(data).subscribe({
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



  DesHabilitar(sComponente: boolean){
  sComponente?this.formulario.get('ctrol_req')?.disable():this.formulario.get('ctrol_req')?.enable();
 
  }





}

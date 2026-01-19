import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { time } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RegistroQuejasReclamosService } from 'src/app/services/quejas-reclamos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import Swal from 'sweetalert2';

interface data {
  Datos: any   ;
}

@Component({
  selector: 'app-modal-informe-cierre',
  templateUrl: './modal-informe-cierre.component.html',
  styleUrls: ['./modal-informe-cierre.component.scss']
})
export class ModalInformeCierreComponent implements OnInit {

  dataTipoConsecuencia   : Array<any> = [];
  dataSubTipoDevolucion  : Array<any> = [];
  dataInforme  : Array<any> = [];

  formulario = this.formBuilder.group({
    ctrol_consecuencia_principal  : [''],
    ctrol_subtipo_devolucion      : [''],
    ctrol_incluye_nota_credito    : [''],
    ctrol_incluye_flete_aereo     : [''],
    ctrol_comentario_comercial    : ['']
  })  

  sUsuario  = GlobalVariable.vusu;
  isVisibleButtonCerrar: boolean = false;
  isVisibleButtonReenviar: boolean = false;

  constructor(
    private formBuilder    : FormBuilder                         ,
    public  dialogRef      : MatDialogRef<ModalInformeCierreComponent> ,
    private RegistroQuejasReclamosService: RegistroQuejasReclamosService,
    private matSnackBar       : MatSnackBar                         ,
    private SpinnerService    : NgxSpinnerService                   ,
    private toastr            : ToastrService                   ,
    @Inject(MAT_DIALOG_DATA) public data: data                   ,
  ) { }

  ngOnInit(): void {
    console.log('this.data.Datos', this.data.Datos);
    this.onListaTipoConsecuencia();

    //solo trae informacion cuando el estado es cerrado
    if(this.data.Datos.cod_Estado.trim() ==  '04'){
      this.getObtieneDetalleInformeComercial(Number(this.data.Datos.id));
      this.deshabilitarControles(true);
    }else if (this.data.Datos.cod_Estado.trim() ==  '03') {
      this.isVisibleButtonCerrar = true;
      this.isVisibleButtonReenviar = true;
    }
  }

  onListaTipoConsecuencia(){
    this.RegistroQuejasReclamosService.ListaTipoConsecuencia().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataTipoConsecuencia = result.elements;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))  
  }

  onListaSubTipoDevolucion(sCod_Tipo_Consecuencia: string){
    this.dataSubTipoDevolucion=[];
    this.SpinnerService.show();
    this.RegistroQuejasReclamosService.ListaSubTipoDevolucion(sCod_Tipo_Consecuencia).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataSubTipoDevolucion = result.elements;
        }
        else {
            console.log('No existen registros..!!');
          //this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        this.SpinnerService.hide();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))      

  }

  onCierreInforme(){

      if (!this.formulario.get('ctrol_consecuencia_principal')?.value) {
        this.matSnackBar.open("Seleccione Consecuencia Principal.", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;  
      }       

      Swal.fire({
        title: '¿Desea cerrar el caso / reclamo?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {   
         if (result.isConfirmed) {

            const sNroCaso = this.data.Datos.nroCaso;
            const sCod_Tipo_Consecuencia       = this.formulario.get('ctrol_consecuencia_principal')?.value; 
            const sCod_SubTipo_Devolucion      = this.formulario.get('ctrol_subtipo_devolucion')?.value; 
            const sFlg_NotaCredito             = this.formulario.get('ctrol_incluye_nota_credito')?.value; 
            const sFlg_FleteAereo              = this.formulario.get('ctrol_incluye_flete_aereo')?.value;//Nuevo
            const sObservacion_Comercial_Cierre = this.formulario.get('ctrol_comentario_comercial')?.value; 
            const sCod_Usuario = this.sUsuario ;          

            let data: any = {
              "NroCaso": sNroCaso,
              "Cod_Tipo_Consecuencia"   :     sCod_Tipo_Consecuencia ,
              "Cod_SubTipo_Devolucion"     :     sCod_SubTipo_Devolucion   ,
              "Flg_NotaCredito"  : sFlg_NotaCredito?"1":"0",
              "Flg_FleteAereo"   : sFlg_FleteAereo?"1":"0",//Nuevo
              "Observacion_Comercial_Cierre": sObservacion_Comercial_Cierre ,
              "sCod_Usuario": sCod_Usuario,
            };   


          this.SpinnerService.show();
          this.RegistroQuejasReclamosService.ProcesoCerrarReclamo(data).subscribe({
              next: (response: any)=> {
                if(response.success){
                  if (response.codeResult == 200){
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
                    timeOut: 2500,
                  });
                  this.SpinnerService.hide();
                }
              },
              error: (error) => {
                this.SpinnerService.hide();
                this.toastr.error(error.message, 'Cerrar', {
                timeOut: 2500,
                });
              }
            });                

         }
      });
    }


    onConsecuenciaChange(event: MatSelectChange){
        const selectedValue = event.value;
        console.log('Valor seleccionado:', selectedValue);
        this.onListaSubTipoDevolucion(selectedValue);

        //ACTIVAMOS EL CHECK CASO SEA NOTA DE CREDITO
        if (selectedValue == '02'){
          this.formulario.get('ctrol_incluye_nota_credito')?.setValue(true);
          //this.formulario.get('ctrol_incluye_flete_aereo')?.setValue(true);
        }else{
          this.formulario.get('ctrol_incluye_nota_credito')?.setValue(false);
          //this.formulario.get('ctrol_incluye_flete_aereo')?.setValue(false);
          //this.formulario.get('ctrol_incluye_nota_credito')?.reset(); 
        }

    }
    
  getObtieneDetalleInformeComercial(id: number){
    this.RegistroQuejasReclamosService.ObtieneDetalleInformeComercial(id).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataInforme = result.elements;
          console.log('getObtieneDetalleInformeComercial', this.dataInforme);

          /*MOSTRARA LOS DATOS*/
          this.formulario.get('ctrol_consecuencia_principal')?.setValue(this.dataInforme[0].cod_Tipo_Consecuencia);
          this.onListaSubTipoDevolucion(this.dataInforme[0].cod_Tipo_Consecuencia);
          this.formulario.get('ctrol_subtipo_devolucion')?.setValue(this.dataInforme[0].cod_SubTipo_Devolucion);
          this.formulario.get('ctrol_incluye_nota_credito')?.setValue(this.dataInforme[0].flg_NotaCredito=='0'?false:true);
          this.formulario.get('ctrol_incluye_flete_aereo')?.setValue(this.dataInforme[0].flg_FleteAreo=='0'?false:true);//Nuevo
          this.formulario.get('ctrol_comentario_comercial')?.setValue(this.dataInforme[0].observacion_Comercial_Cierre);
          
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))             
  }    

  deshabilitarControles(estado: boolean){
    if (estado){       
        this.formulario.get('ctrol_consecuencia_principal')?.disable();
        this.formulario.get('ctrol_subtipo_devolucion')?.disable();  
        this.formulario.get('ctrol_incluye_nota_credito')?.disable();    
        this.formulario.get('ctrol_incluye_flete_aereo')?.disable(); //Nuevo
        this.formulario.get('ctrol_comentario_comercial')?.disable();      
    }else {
          this.formulario.get('ctrol_consecuencia_principal')?.enable();   
          this.formulario.get('ctrol_subtipo_devolucion')?.enable();   
          this.formulario.get('ctrol_incluye_nota_credito')?.enable();  
          this.formulario.get('ctrol_incluye_flete_aereo')?.enable(); //Nuevo 
          this.formulario.get('ctrol_comentario_comercial')?.enable();  
    }
    
  }
  
  onReenviarInforme(){


      Swal.fire({
        title: '¿Desea reenviar el caso / reclamo al area de calidad?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {   

        if (result.isConfirmed) {

          

        }

      });    
    
  }
  
}


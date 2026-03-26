import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PrimerapartidaService } from 'src/app/services/tintoreria/primerapartida.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import Swal from 'sweetalert2';

interface data {
  Title       : string;
  SubTitle    : string;
  Accion      : string;
  Datos       : any   ;
}

@Component({
  selector: 'app-procesar-confirmacion-modal',
  templateUrl: './procesar-confirmacion-modal.component.html',
  styleUrls: ['./procesar-confirmacion-modal.component.scss']
})
export class ProcesarConfirmacionModalComponent implements OnInit {

  sCod_Usuario  = GlobalVariable.vusu;
  formulario = this.formBuilder.group({
    ctrol_estado: [''],
    ctrol_nuevaPartida: [''],
    ctrol_kilosTenidos: [''],
    ctrol_comentario: ['']
  });     

  opcionesEstado = [
    { valor: 'A', texto: 'Aprobado' },
    { valor: 'D', texto: 'Desaprobado' }
  ];  

  constructor(
    private formBuilder         : FormBuilder           ,
    private matSnackBar         : MatSnackBar           ,   
    private SpinnerService      : NgxSpinnerService     ,  
    private toastr              : ToastrService         ,
    private servicePrimeraPartida : PrimerapartidaService,
    @Inject(MAT_DIALOG_DATA) public data: data          ,
    public dialogRef: MatDialogRef<ProcesarConfirmacionModalComponent>,
  ) { }

  ngOnInit(): void {
    this.formulario.get('ctrol_nuevaPartida')?.disable();
    this.formulario.get('ctrol_kilosTenidos')?.disable();
    this.onLoadInfo();
  }

  onLoadInfo(){
    const dKilosAsignados = this.data.Datos.kgs_Asignados || 0;
    this.formulario.get('ctrol_kilosTenidos')?.setValue(dKilosAsignados);
  }

  onSave(){

    const sCod_Cliente_Tex = this.data.Datos.cod_Cliente_Tex;
    const sSer_OrdComp = this.data.Datos.ser_OrdComp;    
    const sCod_OrdComp = this.data.Datos.cod_OrdComp;
    const sSec_OrdComp = this.data.Datos.sec_OrdComp;
    const sCodOrdtra = this.data.Datos.primeraPartida;
    const sCodTela = this.data.Datos.codigoTela;
    const sNumSec = Number(this.data.Datos.num_Secuencia);
    const sKilosTenidos = Number(this.formulario.get('ctrol_kilosTenidos')?.value)||''; 
    const sComentario = String(this.formulario.get('ctrol_comentario')?.value)||'';    
    const sCodOrdtraNueva = String(this.formulario.get('ctrol_nuevaPartida')?.value)||''; 
    const sCodEstado = String(this.formulario.get('ctrol_estado')?.value)||''; 
    const sUsuarioCrea = this.sCod_Usuario

    if (!sCodEstado || sCodEstado.trim() === ''){
      this.matSnackBar.open("¡Seleccione Estado...!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }    
    
    //SOlo valida cuando es DESAPROBADO
    if(sCodEstado == "D"){
      if (!sCodOrdtraNueva || sCodOrdtraNueva.trim() === ''){
        this.matSnackBar.open("¡Ingrese Nueva Partida...!", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;
      }    
    }

    if (!sKilosTenidos || sKilosTenidos <= 0 ){
      this.matSnackBar.open("¡Ingrese Kilos Teñidos - 1RA Partida...!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }    

    let data: any = {

      "cod_Cliente_Tex": sCod_Cliente_Tex,
      "ser_OrdComp": sSer_OrdComp,
      "cod_OrdComp": sCod_OrdComp,
      "sec_OrdComp": '',//sSec_OrdComp,

      "cod_Ordtra"    : sCodOrdtra,
      "cod_Tela"      : sCodTela,
      "num_Secuencia" : sNumSec,
      "kgs_Tenidos"   : sKilosTenidos,
      "comentario"    : sComentario,
      "cod_Ordtra_Nueva": sCodOrdtraNueva,
      "flg_Status"    : sCodEstado,
      "fec_Registro"  : "2026-03-23T21:44:09.127Z",
      "usu_Registro"  : sUsuarioCrea
    }     
    
    Swal.fire({
      title: '¿Desea evaluar el resultado de la 1RA Partida?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {    

      if (result.isConfirmed) {
        this.SpinnerService.show();
        this.servicePrimeraPartida.postAuditoriaPrimeraPartida(data).subscribe({
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
              const mensaje =
                error?.error?.message ||
                error?.error?.title ||
                "Ocurrió un error en el servidor";
              
              this.toastr.error(mensaje, 'Cerrar', {
              timeOut: 2500,
              });
              this.SpinnerService.hide();
            }
          });             
      }
    });
  }

  onChangeEstado(event: any){
    console.log('evento change', event.value);

    const sValue: string = event.value;
    if (sValue === 'D'){
      this.formulario.get('ctrol_nuevaPartida')?.setValue('');
      this.formulario.get('ctrol_nuevaPartida')?.enable();
    }else{
      this.formulario.get('ctrol_nuevaPartida')?.setValue('');
      this.formulario.get('ctrol_nuevaPartida')?.disable();      
    }

  }

  onClose() {
    this.dialogRef.close();
  }

}

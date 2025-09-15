import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RegistroQuejasReclamosService } from 'src/app/services/quejas-reclamos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import Swal from 'sweetalert2';

interface data {
  Datos: any   ;
}

@Component({
  selector: 'app-modal-informe',
  templateUrl: './modal-informe.component.html',
  styleUrls: ['./modal-informe.component.scss']
})
export class ModalInformeComponent implements OnInit {

  fileName: string = '';
  selectedFile: File | null = null;

  formulario = this.formBuilder.group({
    ctrol_btnAttach         : [''],
    ctrol_comentario        : [''],
    ctrol_responsable_final : ['']
  })

  dataResponsableFinal  : Array<any> = [];
  dataInforme  : Array<any> = [];
  sUsuario  = GlobalVariable.vusu;
  isHabilitaButtonAttach: boolean = false;
  isVisibleButtonConfirmaEnvio: boolean = false;
  isVisibleButtonDownload: boolean = false;

  constructor(
     private formBuilder    : FormBuilder                         ,
     public  dialogRef      : MatDialogRef<ModalInformeComponent> ,
     private matSnackBar    : MatSnackBar                         ,
     private RegistroQuejasReclamosService: RegistroQuejasReclamosService,
     private SpinnerService    : NgxSpinnerService                ,
     private toastr            : ToastrService                   ,
     @Inject(MAT_DIALOG_DATA) public data: data                   ,
  ) { }

  ngOnInit(): void {
    console.log('carga inicial', this.data.Datos);

    this.getAreasCalidad();
    //solo trae informacion cuando el estado atendido
    if(this.data.Datos.cod_Estado.trim() ==  '03' || this.data.Datos.cod_Estado.trim() ==  '04'){
      this.isHabilitaButtonAttach = true;
      this.isVisibleButtonDownload = true;
      this.getObtieneDetalleInformeCalidad(Number(this.data.Datos.id))
      this.deshabilitarControles(true);
    }else if (this.data.Datos.cod_Estado.trim() ==  '02') {
      this.isVisibleButtonConfirmaEnvio = true;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }

  getAreasCalidad(){
    this.RegistroQuejasReclamosService.ListaAreasCalidad().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataResponsableFinal = result.elements;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))  
  }

  onConfirma(){

      console.log('selectedFile', this.selectedFile);


      if (!this.fileName) {
        this.matSnackBar.open("No hay archivo seleccionado.", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;   
      }

      if (!this.formulario.get('ctrol_responsable_final')?.value) {
        this.matSnackBar.open("Seleccione area responsable.", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;  
      }      

      Swal.fire({
        title: '¿Desea enviar a comercial?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {    

        if (result.isConfirmed) {

          const sNroCaso = String(this.data.Datos.nroCaso);
          const sObservacionCalidad         = this.formulario.get('ctrol_comentario')?.value; 
          const sCodAreaResponsableCalidad  = this.formulario.get('ctrol_responsable_final')?.value; 
          const sCod_Usuario = this.sUsuario ;

          const formData = new FormData();

          formData.append("sNroCaso", sNroCaso);
          formData.append("sNombreArchivoCalidad", this.selectedFile.name);
          formData.append("sObservacionCalidad", sObservacionCalidad);
          formData.append("sCodAreaResponsableCalidad", sCodAreaResponsableCalidad);
          formData.append("sCod_Usuario", sCod_Usuario);      
          formData.append("archivoCalidad", this.selectedFile); // el archivo real    

          console.log('formData', formData);


          // let data: any = {
          //   "sNroCaso": sNroCaso,
          //   "sNombreArchivoCalidad"   :     sNombreArchivoCalidad ,
          //   "sObservacionCalidad"     :     sObservacionCalidad   ,
          //   "sCodAreaResponsableCalidad"  : sCodAreaResponsableCalidad,
          //   "sCod_Usuario": sCod_Usuario,
          // };          

      this.SpinnerService.show();
      this.RegistroQuejasReclamosService.ProcesoConfirmarReclamo(formData).subscribe({
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
  
  getObtieneDetalleInformeCalidad(id: number){
    this.RegistroQuejasReclamosService.ObtieneDetalleInformeCalidad(id).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataInforme = result.elements;
          console.log('getObtieneDetalleInformeCalidad', this.dataInforme);

          /*MOSTRARA LOS DATOS*/
          this.formulario.get('ctrol_comentario')?.setValue(this.dataInforme[0].observacion_Calidad);
          this.formulario.get('ctrol_responsable_final')?.setValue(this.dataInforme[0].cod_Area_Responsable_Calidad);
          this.fileName = this.dataInforme[0].nombreArchivo_Calidad;

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
        
          this.formulario.get('ctrol_comentario')?.disable();
          this.formulario.get('ctrol_responsable_final')?.disable();    
    }else {
          this.formulario.get('ctrol_comentario')?.enable();   
          this.formulario.get('ctrol_responsable_final')?.enable();   
    }
    
  }

  download(){
      if (this.fileName!= ''){
          this.RegistroQuejasReclamosService.descargarArchivo(this.fileName).subscribe({
            next: (blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = this.fileName;   // nombre sugerido
              a.click();
              window.URL.revokeObjectURL(url);
            },
            error: (err) => {
              console.error('Error al descargar', err);
            }
          });
      }
  }

}

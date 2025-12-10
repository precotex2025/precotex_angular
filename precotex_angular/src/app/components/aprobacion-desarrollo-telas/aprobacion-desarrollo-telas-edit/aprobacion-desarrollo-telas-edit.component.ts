import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GlobalVariable } from 'src/app/VarGlobals';
import { NgxSpinnerService } from 'ngx-spinner';
import { DesarrolloTelaService } from 'src/app/services/desarrollo-tela.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface data {
  Title       : string;
  Accion      : string;
  Datos       : any   ;
}

@Component({
  selector: 'app-aprobacion-desarrollo-telas-edit',
  templateUrl: './aprobacion-desarrollo-telas-edit.component.html',
  styleUrls: ['./aprobacion-desarrollo-telas-edit.component.scss']
})
export class AprobacionDesarrolloTelasEditComponent implements OnInit {
  @ViewChild('pdfDialog') pdfDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  formulario = this.formBuilder.group({
      ctrol_codigo_tela : [''],
      ctrol_tela        : [''],
      ctrol_motivo      : [''],
      ctrol_comentario  : [''],
      ctrol_version     : [''],
      ctrol_fecha       : [''],
      ctrol_usuario     : [''],
      ctrol_comentario2 : [''],
  });    

  pdfUrl!    : SafeResourceUrl;  
  //pdfDisponible = false;

  constructor(
    private SpinnerService    : NgxSpinnerService               ,
    private formBuilder       : FormBuilder                     ,
    private toastr            : ToastrService                   ,
    private sanitizer         : DomSanitizer                    ,
    private ServiceDesarrolloTela : DesarrolloTelaService       ,
    public dialogEdit              : MatDialogRef<AprobacionDesarrolloTelasEditComponent>,
    private dialog    : MatDialog                             ,
    @Inject(MAT_DIALOG_DATA) public data: data                  
  ) { }

  ngOnInit(): void {
    console.log('Aprobación Desarrollo', this.data);
    this.setValoresFormulario(this.data);
  }

  //#region Metodos
  setValoresFormulario(data: any){
     this.formulario.get('ctrol_codigo_tela')?.setValue(data.Datos.cod_Tela);
     this.formulario.get('ctrol_tela')?.setValue(data.Datos.des_Tela);
     this.formulario.get('ctrol_motivo')?.setValue(data.Datos.des_Motivo_Solicitud);
     this.formulario.get('ctrol_comentario')?.setValue(data.Datos.comentario);
     this.formulario.get('ctrol_version')?.setValue(data.Datos.nom_Version);
     this.formulario.get('ctrol_fecha')?.setValue(data.Datos.fec_Registro_Solicitud);
     this.formulario.get('ctrol_usuario')?.setValue(data.Datos.cod_Usuario_Solicitud);
     this.formulario.get('ctrol_comentario2')?.setValue(data.Datos.comentario_Solicitud);
  }

  //#region Eventos
  onRechazar(){
    //Cuestiona al Rechazar
    Swal.fire({
      title: '¿Desea Rechazar la Ficha Pendiente?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        const sCodTela      : string = String(this.data.Datos.cod_Tela);
        const sCodVersion   : string = String(this.data.Datos.cod_Version); 
        const sCod_Usuario  : string = String(GlobalVariable.vusu); 
        const sComentario_Solicitud : string = this.formulario.get('ctrol_comentario2')?.value || '';
        /********************/
        //Input's Para Avanzar Solicitud
        /********************/
        const data: any = {
            "accion"      : "A",
            "cod_Tela"    : sCodTela,
            "cod_Version" : sCodVersion,
            "nom_Version" : "",
            "comentario"  : "",
            "ruta_Archivo": "",
            "cod_Motivo_Solicitud": "",
            "comentario_Solicitud": sComentario_Solicitud,
            "cod_Usuario"         : sCod_Usuario
        };    

        //GUARDAR 
        this.SpinnerService.show();
        this.ServiceDesarrolloTela.postProcesoDesarrolloTela(data).subscribe({
            next: (response: any)=> {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });
                  
                  //Cierra Modal
                  this.dialogEdit.close();

                }else {
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

  onAprobar(){
    //Cuestiona al Grabar
    Swal.fire({
      title: '¿Desea Aprobar la Ficha Pendiente?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        const sCodTela      : string = String(this.data.Datos.cod_Tela);
        const sCodVersion   : string = String(this.data.Datos.cod_Version); 
        const sCod_Usuario  : string = String(GlobalVariable.vusu); 
        const sComentario_Solicitud : string = this.formulario.get('ctrol_comentario2')?.value || '';
        /********************/
        //Input's Para Avanzar Solicitud
        /********************/
        const data: any = {
            "accion"      : "A",
            "cod_Tela"    : sCodTela,
            "cod_Version" : sCodVersion,
            "nom_Version" : "",
            "comentario"  : "",
            "ruta_Archivo": "",
            "cod_Motivo_Solicitud": "",
            "comentario_Solicitud": sComentario_Solicitud,
            "cod_Usuario"         : sCod_Usuario
        };    

        //GUARDAR 
        this.SpinnerService.show();
        this.ServiceDesarrolloTela.postProcesoDesarrolloTela(data).subscribe({
            next: (response: any)=> {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });
                  
                  //Cierra Modal
                  this.dialogEdit.close();

                }else {
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

  onCerrar() {
    this.dialogEdit.close();
  }

  onVerPdf() {

    const rutaPDF = this.data?.Datos?.ruta_Archivo_Ant;
    this.openPDFDialog(rutaPDF);    
  
  }

  Cerrar(){
    this.dialogRef.close();
  }

  openPDFDialog(sRuta: any) {

    this.ServiceDesarrolloTela.getPdf(sRuta).subscribe({
      next: (pdfBlob: Blob) => {
        //this.pdfDisponible = true;
        const fileURL = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.dialogRef = this.dialog.open(this.pdfDialog, {
        width: '100vw',
        height: '100vh',
        maxWidth: '95vw',
        maxHeight: '82vh'
        });
      },
      error: (err) => {
        //this.pdfDisponible = false;
        if (err.status === 404) {

          // Aquí puedes mostrar un mensaje al usuario
          this.toastr.error('El archivo no existe o fue eliminado.', '', {
            timeOut: 2500,
          });          
        } else {

          this.toastr.error('Error al cargar el archivo.', '', {
            timeOut: 2500,
          }); 
        }
      }
    });
  }


}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { DesarrolloTelaService } from 'src/app/services/desarrollo-tela.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AprobacionDesarrolloTelasEditComponent } from './aprobacion-desarrollo-telas-edit/aprobacion-desarrollo-telas-edit.component';

interface data_det {
  cod_Tela              : string,
  des_Tela              : string,
  des_Motivo_Solicitud  : string,
  comentario_Solicitud  : string,
  cod_Version           : string,
  nom_Version           : string,
  comentario            : string,
  ruta_Archivo          : string,
  ruta_Archivo_Ant      : string,
  fec_Registro_Solicitud: string,
  cod_Usuario_Solicitud : string
}

@Component({
  selector: 'app-aprobacion-desarrollo-telas',
  templateUrl: './aprobacion-desarrollo-telas.component.html',
  styleUrls: ['./aprobacion-desarrollo-telas.component.scss']
})
export class AprobacionDesarrolloTelasComponent implements OnInit {
  @ViewChild('pdfDialog') pdfDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  displayedColumns: string[] = [
      "acciones"            ,
      "cod_Tela"            ,
      "des_Tela"            ,
      "des_Motivo_Solicitud",
      "comentario_Solicitud",
      //"cod_Version"         ,
      "nom_Version"         ,
      "comentario"          ,
      // "ruta_Archivo"        ,
      "fec_Registro_Solicitud",
      "cod_Usuario_Solicitud",
  ];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  dataListadoDesarrolloTelas: Array<any> = [];   

  pdfUrl!    : SafeResourceUrl;  
  intervalId: any;

  constructor(
    private SpinnerService        : NgxSpinnerService     ,
    private ServiceDesarrolloTela : DesarrolloTelaService ,
    private formBuilder           : FormBuilder           ,
    private toastr                : ToastrService         ,
    private dialog    : MatDialog                             ,
    private sanitizer : DomSanitizer,
  ) { }

  ngOnInit(): void {

    this.onGetListadoDesarrolloTelasPendientes();
    //Refrescar cada 60 segundos
    this.intervalId = setInterval(() => {
      this.onGetListadoDesarrolloTelasPendientes();
    }, 60000);        
      
  }

  formulario = this.formBuilder.group({
  });  

  //#region METODOS
  onGetListadoDesarrolloTelasPendientes(){

    const sCod_Usuario  : string = String(GlobalVariable.vusu); 
    const param = {
      "accion": "P",
      "cod_Tela": "",
      "cod_Version": "",
      "nom_Version": "",
      "comentario": "",
      "ruta_Archivo": "",
      "cod_Motivo_Solicitud": "",
      "comentario_Solicitud": "",
      "cod_Usuario": sCod_Usuario
    }

    this.dataListadoDesarrolloTelas = [];
    this.SpinnerService.show();
    this.ServiceDesarrolloTela.postListadoDesarrolloTelas(param).subscribe({
      next: (response: any)=> {

        if(response.success){
          if (response.totalElements > 0){
              console.log('Data Source Desarrollo de Telas', response.elements);
              this.dataListadoDesarrolloTelas = response.elements;
              this.dataSource.data = this.dataListadoDesarrolloTelas;

              this.SpinnerService.hide();
          }
          else{
            this.dataListadoDesarrolloTelas = [];
            this.dataSource.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataListadoDesarrolloTelas = [];
          this.dataSource.data = [];
          this.SpinnerService.hide();
        }
      }
    });
  }

  onAprobar(row: any){

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

        const sCodTela      : string = String(row.cod_Tela);
        const sCodVersion   : string = String(row.cod_Version); 
        const sCod_Usuario  : string = String(GlobalVariable.vusu); 
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
            "comentario_Solicitud": "",
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
                  
                  //Consulta Información
                  this.onGetListadoDesarrolloTelasPendientes();                          
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
    })   
  }
  onRechazar(row: any){

    //Cuestiona al Grabar
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

        const sCodTela      : string = String(row.cod_Tela);
        const sCodVersion   : string = String(row.cod_Version); 
        const sCod_Usuario  : string = String(GlobalVariable.vusu); 
        /********************/
        //Input's Para Avanzar Solicitud
        /********************/
        const data: any = {
            "accion"      : "R",
            "cod_Tela"    : sCodTela,
            "cod_Version" : sCodVersion,
            "nom_Version" : "",
            "comentario"  : "",
            "ruta_Archivo": "",
            "cod_Motivo_Solicitud": "",
            "comentario_Solicitud": "",
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
                  
                  //Consulta Información
                  this.onGetListadoDesarrolloTelasPendientes();                          
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
    })       

  }

  onEditar(row: any){

    let dialogRef = this.dialog.open(AprobacionDesarrolloTelasEditComponent, {
      width: '700px',
      disableClose: false,
      panelClass: 'my-class',
      data: {
        Title  : "::. Ficha Tecnica .::",
        Accion : "U",
        Datos  : row
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.onGetListadoDesarrolloTelasPendientes();  
    });    
    
  }

  onVerPdf(row: any){
    const rutaPDF = row.ruta_Archivo;
    this.openPDFDialog(rutaPDF);
  }

  openPDFDialog(sRuta: any) {

    this.ServiceDesarrolloTela.getPdf(sRuta).subscribe((pdfBlob: Blob) => {

      const fileURL = URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

      this.dialogRef = this.dialog.open(this.pdfDialog, {
        width: '100vw',
        height: '100vh',
        maxWidth: '95vw',
        maxHeight: '82vh'
      });
    });
  }

  Cerrar() {
    this.dialogRef.close();
  }  
}

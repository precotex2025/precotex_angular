import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { ToastrService } from 'ngx-toastr';

interface FormData {
  resp_Id: number,
  resp_Nom: string,
  resp_Ape_Pat: string,
  resp_Ape_Mat: string
}


@Component({
  selector: 'app-dialog-responsables-nuevo',
  templateUrl: './dialog-responsables-nuevo.component.html',
  styleUrls: ['./dialog-responsables-nuevo.component.scss']
})
export class DialogResponsablesNuevoComponent implements OnInit {
  accionR: string = '';
  resp_IdR: number = 0;
  resp_NomR: string = '';
  resp_Ape_PatR: string = '';
  resp_Ape_MatR: string = '';
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private serviceReporteNC: ReporteNCService,
    private toastr: ToastrService
  ) { }

  formData: FormData = {
    resp_Id: 0,
    resp_Nom: '',
    resp_Ape_Pat: '',
    resp_Ape_Mat: ''
  }

  ngOnInit(): void {
    this.OnGetParams();
  }
  OnGetParams(){
      this.route.queryParams.subscribe(params => {
        this.accionR = params['accionR'] || 'H';
        this.resp_IdR = params['resp_IdR'] || 0;
        this.resp_NomR = params['resp_NomR'] || '';
        this.resp_Ape_PatR = params['resp_Ape_PatR'] || '';
        this.resp_Ape_MatR = params['resp_Ape_MatR'] || '';
      })
      console.log(this.accionR);
      console.log(this.resp_IdR);
      console.log(this.resp_NomR);
      console.log(this.resp_Ape_PatR);
      console.log(this.resp_Ape_MatR);
      
      if(this.accionR === 'U'){
        this.formData.resp_Id = this.resp_IdR
        this.formData.resp_Nom = this.resp_NomR
        this.formData.resp_Ape_Pat = this.resp_Ape_PatR
        this.formData.resp_Ape_Mat = this.resp_Ape_MatR
      }
    }
  
  Procesar(): void {
    console.log(this.accionR);
    if(this.accionR === 'I'){
      this.guardarResponsable();
    }else{
      this.EditarResponsable();
    }
  }
  
  guardarResponsable() {
    const EnviarData: FormData = {
      ...this.formData
    };
    Swal.fire({
          title: "¿Registrar Responsable?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor:'#3085d6',
          cancelButtonColor:'#d33',
          confirmButtonText:'Si',
          cancelButtonText: 'No'
        }).then((result) =>{
          if(result.isConfirmed){    
    //  'MantenimientoAreaXSede'
    //    'DialogAreaNuevo'
            this.SpinnerService.show();
            this.serviceReporteNC.postRegistrarResponsable(EnviarData).subscribe({
              next: (response: any) => {
                if(response.success){
                  if(response.codeResult == 200){
                    this.router.navigate(['MantenimientoResponsables']);
                    this.toastr.success(response.message, '', {
                      timeOut: 2500,
                    });
                    // this.dialogRef.close();
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
  
  EditarResponsable(){
    const EnviarData: FormData = {
      ...this.formData
    };
    Swal.fire({
          title: "Editar Datos de Responsable?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor:'#3085d6',
          cancelButtonColor:'#d33',
          confirmButtonText:'Si',
          cancelButtonText: 'No'
        }).then((result) =>{
          if(result.isConfirmed){    
            this.SpinnerService.show();
            this.serviceReporteNC.patchActualizarResponsable(EnviarData).subscribe({
              next: (response: any) => {
                if(response.success){
                  if(response.codeResult == 200){
                    this.router.navigate(['MantenimientoResponsables']);
                    this.toastr.success(response.message, '', {
                      timeOut: 2500,
                    });
                    // this.dialogRef.close();
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
  
  
  cancelarRegistro() {
    this.router.navigate(['MantenimientoResponsables']);
  }
  

}

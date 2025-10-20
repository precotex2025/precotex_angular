import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';


interface FormData {
  are_Id: number,
  are_Des: string,
  num_Planta: number
}

@Component({
  selector: 'app-dialog-area-nuevo',
  templateUrl: './dialog-area-nuevo.component.html',
  styleUrls: ['./dialog-area-nuevo.component.scss']
})
export class DialogAreaNuevoComponent implements OnInit {
  accionR = '';
  are_IdR = 0;
  num_PlantaR = 0;
  are_DesR = '';


  @ViewChild(MatSort) sort!: MatSort;  
  constructor(
    private SpinnerService: NgxSpinnerService,  
    private serviceReporteNC: ReporteNCService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }



  ngOnInit(): void {
    this.ngOnGetParams();
    this.onGetSedes();
  }

  formData: FormData = {
    are_Id: 0,
    are_Des: '',
    num_Planta: 0
  }

  sede = {
    num_Planta: '',
    are_Des: ''
  };

listaPlantas = [
  // { num_Planta: '01', des_Planta: 'Huachipa I' },
  // { num_Planta: '02', des_Planta: 'Santa Rosa' },
  // ... otras sedes
];

ngOnGetParams(){
    this.route.queryParams.subscribe(params => {
      this.accionR = params['accionR'] || 'H';
      this.are_IdR = Number(params['are_IdR']) || 0;
      this.num_PlantaR = Number(params['num_PlantaR']) || 0;
      this.are_DesR = params['are_DesR'] || 'H';
    })

    if(this.accionR === 'U'){
      this.formData.are_Id = this.are_IdR;
      this.formData.num_Planta = this.num_PlantaR;
      this.formData.are_Des = this.are_DesR;
    }
  }

Procesar(): void {
  console.log(this.accionR);
  if(this.accionR === 'I'){
    this.guardarSede();
  }else{
    this.editarSede();
  }
}

guardarSede() {
  const EnviarData: FormData = {
    ...this.formData
  };
  Swal.fire({
        title: "¿Registrar Área?",
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
          this.serviceReporteNC.postRegistrarArea(EnviarData).subscribe({
            next: (response: any) => {
              if(response.success){
                if(response.codeResult == 200){
                  this.router.navigate(['MantenimientoAreaXSede']);
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

editarSede(){
  const EnviarData: FormData = {
    ...this.formData
  };
  Swal.fire({
        title: "¿Editar Área?",
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
          this.serviceReporteNC.patchActualizarArea(EnviarData).subscribe({
            next: (response: any) => {
              if(response.success){
                if(response.codeResult == 200){
                  this.router.navigate(['MantenimientoAreaXSede']);
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
  this.router.navigate(['MantenimientoAreaXSede']);
}

sedes = [];
onGetSedes(): void{
    this.SpinnerService.show();
    this.listaPlantas = [];
    this.serviceReporteNC.getListarPlantas().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            //this.listaPlantas = response.elements;
            this.listaPlantas = response.elements.map((p: any) => ({
              ...p,
              num_Planta: Number(p.num_Planta)
            }));
            if (this.accionR === 'U') {
              this.formData.num_Planta = this.num_PlantaR;
            }
            this.SpinnerService.hide();
          }else{
            this.listaPlantas = [];
            this.SpinnerService.hide();
          }
        }else{
          this.listaPlantas = [];
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

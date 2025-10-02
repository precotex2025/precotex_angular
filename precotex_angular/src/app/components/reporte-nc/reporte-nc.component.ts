import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalVariable } from 'src/app/VarGlobals';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
//*********************************************************************************** */
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';



interface FormData {
  rep_Id: number;
  rep_FecObs: string;
  rep_HorObs: string;
  cod_Planta_Tg: string;
  are_Id: number;
  rep_Esp: string;
  rep_Clas: string;
  rep_DesNC: string;
  rep_NivRgo: string;
  rep_AccCor: string;
  resp_Id: number;
  rep_RepPor: string;
  // codigo: number,
  // sMsj: string
}


@Component({
  selector: 'app-reporte-nc',
  templateUrl: './reporte-nc.component.html',
  styleUrls: ['./reporte-nc.component.scss']
})
export class ReporteNCComponent implements OnInit {
  
  sCod_Usuario = GlobalVariable.vusu;
  accionR = '';

  private timer: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private serviceReporteNC: ReporteNCService  
  ) { }

  
  ngOnInit(): void {
    this.updateFechaHora();
    this.timer = setInterval(() => this.updateFechaHora(), 1000);
    this.ngOnGetParams();
  }

  formData: FormData= {
    rep_Id: 0,
    rep_FecObs: '',
    rep_HorObs: '',
    cod_Planta_Tg: '',
    are_Id: 0,
    rep_Esp: '',
    rep_Clas: '',
    rep_DesNC: '',
    rep_NivRgo: '',
    rep_AccCor: '',
    resp_Id: 0,
    rep_RepPor: this.sCod_Usuario
    // codigo: 0,
    // sMsj: ''
  };

  ngOnDestroy(): void {
      this.updateFechaHora();
      this.timer = setInterval(() => this.updateFechaHora(), 1000);
  }

  ngOnGetParams(){
    this.route.queryParams.subscribe(params => {
      this.accionR = params['accionR'] || 'H';
    })
  }

  onRedireccionarListado(modo: number){
    if(modo === 0){
      this.router.navigate(['ReporteNCListado'])
      // , 
      // { queryParams: {
      //     estado: 1,
      //     sexo: 'si'
      // }}
    // )
    }else{
      this.router.navigate(['ReporteNCListado'])
    //     , 
    //   { queryParams: {
    //       estado: 1,
    //       sexo: 'si'
    //   }}
    // )
    }
  }

  updateFechaHora(): void {
  const now = new Date();
  const horas = now.getHours().toString().padStart(2, '0');
  const minutos = now.getMinutes().toString().padStart(2, '0');
  const segundos = now.getSeconds().toString().padStart(2, '0');
  this.formData.rep_HorObs = `${horas}:${minutos}:${segundos}`;

  const dia = now.getDate().toString().padStart(2, '0');
  const mes = (now.getMonth() + 1).toString().padStart(2, '0');
  const año = now.getFullYear();
  this.formData.rep_FecObs = `${dia}/${mes}/${año}`;
}

  sedes = ['Santa Marta', 'Santa Cecilia', 'Santa Rosa', 'Huachipa 1', 'Huachipa 2', 'Huachipa 3', 'Independencia', 'Faraday'];
  areas = [
  { id: 1, nombre: 'Producción' },
  { id: 2, nombre: 'Mantenimiento' },
  { id: 3, nombre: 'Calidad' },
  { id: 4, nombre: 'Seguridad' }
  ];

  clasificaciones = ['Auto Inspección', 'Condición Insegura', 'Mantenimiento', 'Producción'];

  niveles = ['ALTO', 'MEDIO', 'BAJO'];

  responsables = [
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'Ana Torres' },
  { id: 3, nombre: 'Carlos Díaz' }
  ];

  // select(field: keyof typeof this.formData, value: string) {
  //   this.formData[field] = value;
  // }
  select<K extends keyof FormData>(field: K, value: FormData[K]): void {
  this.formData[field] = value;
  }

  onProcesar(){
    console.log('La Accion es: ', this.accionR);
    if(this.accionR === 'I'){
      console.log('Acabas de entrar a la insercion');
      this.onGuardar();
    }else{
      this.onEditar();
    }
  }

  onGuardar(): void{
    const EnviarData: FormData = {
      ...this.formData,
          // imagenes: this.imagenes
    };
    console.log('Los datos que se van a enviar son: ', EnviarData);
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

        this.SpinnerService.show();
        this.serviceReporteNC.postRegistrarReporteNC(EnviarData).subscribe({
          next: (response: any) => {
            if(response.success){
              if(response.codeResult == 200){
                this.router.navigate(['ReporteNCListado']);
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

  onEditar(): void{

  }

}

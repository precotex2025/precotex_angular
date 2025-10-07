import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
//*********************************************************************************** */
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';


// interface dataReporte{
//   rep_Id: string;
//   rep_FecObs: string;
//   rep_HorObs: string;
//   cod_Planta_Tg: string;
//   are_Id: number;
//   rep_Esp: string;
//   rep_Clas: string;
//   rep_DesNC: string;
//   rep_NivRgo: number;
//   rep_AccCor: string;
//   resp_Id: number;
//   rep_RepPor: string;
//   rep_Est: string;
//   Rep_FecSub: string;
// }


interface FormData {
  rep_Id: number;
  rep_FecObs: string;
  rep_HorObs: string;
  cod_Planta_Tg: string;
  are_Id: number;
  rep_Esp: string;
  rep_Clas: string;
  rep_DesNC: string;
  rep_NivRgo: number;
  rep_AccCor: string;
  resp_Id: number;
  rep_RepPor: string;
  rep_Est: string;
  Rep_FecSub: string;
  // codigo: number,
  // sMsj: string
}

interface Sede {
  Num_Planta: string;
  Des_Planta: string;
}

interface Clasificacion{
  Cla_Id: string;
  Cla_Des: string;
}


@Component({
  selector: 'app-reporte-nc',
  templateUrl: './reporte-nc.component.html',
  styleUrls: ['./reporte-nc.component.scss']
})
export class ReporteNCComponent implements OnInit {
  sedeSeleccionada: string = '';
  clasificacionSeleccionada: string = '';
  sCod_Usuario = GlobalVariable.vusu;
  accionR = '';
  rep_IdR = 0;
  private timer: any;
  @ViewChild(MatSort) sort!: MatSort;  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private serviceReporteNC: ReporteNCService  
  ) { }

  
  ngOnInit(): void {
    this.ngOnGetParams();
    this.onGetSedes();
    this.onGetClasificaciones();
    
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
    rep_NivRgo: 0,
    rep_AccCor: '',
    resp_Id: 0,
    rep_RepPor: this.sCod_Usuario,
    rep_Est: '',
    Rep_FecSub: ''
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
      this.rep_IdR = Number(params['rep_IdR']) || 0;
    })
    console.log(this.accionR);
    console.log(this.rep_IdR);
    if(this.rep_IdR == 0 ){
      this.updateFechaHora();
      this.timer = setInterval(() => this.updateFechaHora(), 1000);
    }else{
      this.onCargarDatos(this.rep_IdR)
    }
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

  sedes = [];

  areas = [
  { id: 1, nombre: 'Producción' },
  { id: 2, nombre: 'Mantenimiento' },
  { id: 3, nombre: 'Calidad' },
  { id: 4, nombre: 'Seguridad' }
  ];

  clasificaciones = [];

  niveles = [
  { id: 1, nombre: 'BAJO' },
  { id: 2, nombre: 'MEDIO' },
  { id: 3, nombre: 'ALTO' }
];

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
        this.serviceReporteNC.patchActualizarReporteNCOriginal(EnviarData).subscribe({
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

  onCancelar(): void{
    this.router.navigate(['ReporteNCListado']);
  }

  selectNivel(nivel: { id: number; nombre: string }): void {
  this.formData.rep_NivRgo = nivel.id;
  console.log('Nivel seleccionado:', nivel.id);
  }

  dataSource: MatTableDataSource<FormData> = new MatTableDataSource();
  datita: Array<any> = [];
  onCargarDatos(Rep_ID: number){
    this.SpinnerService.show();
    this.datita = [];
    this.serviceReporteNC.getListarRegistro(Rep_ID).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            console.log('Reparto', response.elements);
            this.datita = response.elements;
            const datos = this.datita[0]; // suponiendo que solo quieres cargar el primero

            this.formData = {
              rep_Id: datos.rep_Id,
              rep_FecObs: datos.rep_FecObs,
              rep_HorObs: datos.rep_HorObs,
              cod_Planta_Tg: datos.cod_Planta_Tg,
              are_Id: datos.are_Id,
              rep_Esp: datos.rep_Esp,
              rep_Clas: datos.rep_Clas,
              rep_DesNC: datos.rep_DesNC,
              rep_NivRgo: datos.rep_NivRgo,
              rep_AccCor: datos.rep_AccCor,
              resp_Id: datos.resp_Id,
              rep_RepPor: datos.rep_RepPor,
              rep_Est: datos.rep_Est,
              Rep_FecSub: datos.Rep_FecSub
            }
            this.SpinnerService.hide();
          }else{
            this.datita = [];
            this.dataSource.data = [];
            this.SpinnerService.hide();
          }
        }else{
          this.datita = [];
          this.dataSource.data = [];
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

  onGetSedes(): void{
    this.SpinnerService.show();
    this.sedes = [];
    this.serviceReporteNC.getListarPlantas().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.sedes = response.elements;
            this.SpinnerService.hide();
          }else{
            this.sedes = [];
            this.SpinnerService.hide();
          }
        }else{
          this.sedes = [];
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

  onGetClasificaciones(): void{
    this.SpinnerService.show();
    this.clasificaciones = [];
    this.serviceReporteNC.getListarClasificaciones().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            console.log('Las clasificaciones son: ', response.elements);
            this.clasificaciones = response.elements;
            // this.clasificaciones = response.elements.map((c: any) => ({
            //   cla_Id: c.Cla_Id,
            //   cla_Des: c.Cla_Des
            // }));
            this.SpinnerService.hide();
          }else{
            this.clasificaciones = [];
            this.SpinnerService.hide();
          }
        }else{
          this.clasificaciones = [];
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
  
  selectSede(sede: { num_Planta: string; des_Planta: string }): void {
  this.formData.cod_Planta_Tg = sede.num_Planta;
  this.sedeSeleccionada = sede.num_Planta;
  console.log(this.sedeSeleccionada);
  }

  selectClasificacion(clasificacion: { cla_Id: string; cla_Des: string }): void {
  this.formData.rep_Clas = clasificacion.cla_Id;
  this.clasificacionSeleccionada = clasificacion.cla_Id;
  console.log(clasificacion.cla_Id);
  }


  
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatRadioChange } from '@angular/material/radio';
import Swal from 'sweetalert2';
interface FormData {
    fecha?: string,
    hora?: string,
    fechaObservacion: string,
    descripcion: string,
    estado: string,
    riesgo: string,
    accionCorrectiva: string,
    ubicacion: string,
    reportadoPor: string,
    responsable: string,
    area: string,
    aceptar?: string,
    responsableLevantamiento?: string,
    accionTomada?: string,
    fechaLevantamiento?: string,
    cierre?: string,
    observacion?: string
    est_Id?: string
}

@Component({
  selector: 'app-reporte-nc-resolvedor',
  templateUrl: './reporte-nc-resolvedor.component.html',
  styleUrls: ['./reporte-nc-resolvedor.component.scss']
})
export class ReporteNcResolvedorComponent implements OnInit, OnDestroy {
  isReadOnlyResponsable: boolean = true;
  isReadOnlyObservacion: boolean = true;
  cierreSeleccionado: string = '';
  constructor(
    private SpinnerService: NgxSpinnerService,
    private serviceReporteNC: ReporteNCService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ){}
  formData: FormData = {
    fecha: '',
    hora: '',
    fechaObservacion: '',
    descripcion: '',
    estado: '',
    riesgo: '',
    accionCorrectiva: '',
    ubicacion: '',
    reportadoPor: '',
    responsable: '',
    area: '',
    aceptar: '',
    responsableLevantamiento: '',
    accionTomada: '',
    fechaLevantamiento: '',
    cierre: '',
    observacion: '',
    est_Id: ''
  };

  // estados = [
  //   { label: 'Pendiente', value: 'pendiente' },
  //   { label: 'Cerrado', value: 'cerrado' },
  //   { label: 'Con Observación', value: 'observacion' }
  // ];

  // cierres = [
  //   { label: 'Pendiente', value: 'pendiente' },
  //   { label: 'Cerrado', value: 'cerrado' },
  //   { label: 'Con Observación', value: 'observacion' }
  // ];

  niveles = ['Alto', 'Medio', 'Bajo'];
  responsables = [{label: 'Juan Pérez', value: 1}, {label: 'Ana Torres', value: 2}, {label: 'Carlos Díaz', value: 2}];
  areas = ['Producción', 'Mantenimiento', 'Seguridad', 'Calidad'];

  imagenes: string[] = [
    'assets/img1.jpg',
    'assets/img2.jpg'
  ];

  private timer: any;

  ngOnInit(): void {
    this.updateFechaHora();
    this.timer = setInterval(() => this.updateFechaHora(), 1000);
    this.ngOnGetParams()
  }

  rep_IdR = 0;
  ngOnGetParams(){
    this.route.queryParams.subscribe(params => {
      this.rep_IdR = Number(params['rep_IdR']) || 0;
    })
      this.onGetDatosReporte(this.rep_IdR)
      this.cargarEstados();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  updateFechaHora(): void {
    const now = new Date();
    const horas = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const segundos = now.getSeconds().toString().padStart(2, '0');
    this.formData.hora = `${horas}:${minutos}:${segundos}`;

    const dia = now.getDate().toString().padStart(2, '0');
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    const año = now.getFullYear();
    this.formData.fecha = `${dia}/${mes}/${año}`;
  }

  select(field: keyof typeof this.formData, value: string): void {
    this.formData[field] = value;
  }

  datita = [];
  onGetDatosReporte(Rep_ID: number){
    this.SpinnerService.show();
    this.datita = [];
    this.serviceReporteNC.getListarDatosResolvedor(Rep_ID).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            
            this.datita = response.elements;
            const datos = this.datita[0]; // suponiendo que solo quieres cargar el primero
            console.log('Los datos en el arreglo son:', datos);
            this.formData = {
              fechaObservacion: datos.rep_FecObs,
              descripcion: datos.rep_DesNC,              
              estado: datos.est_Des,
              riesgo: datos.niv_Rgo_Des,
              accionCorrectiva: datos.rep_AccCor,
              ubicacion: datos.rep_Esp,
              reportadoPor: datos.rep_RepPor,
              responsable: datos.responsable,
              area: datos.are_Des
            }
            this.SpinnerService.hide();
          }else{
            this.datita = [];
            this.SpinnerService.hide();
          }
        }else{
          this.datita = [];
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

  onCancelar(): void{
    this.router.navigate(['ReporteNCListado']);
  }

  onAceptarChange(event: MatRadioChange): void {
    let valor = event.value;
    if(valor === 1){
      // this.isReadOnlyResponsable = false;
    }
  console.log('Valor seleccionado en Aceptar:', event.value);
  }

  onGuardar(): void{
      const EnviarData: FormData = {
        ...this.formData,
      }
      console.log('Los datos que se van a enviar son: ', EnviarData);
      Swal.fire({
        title: "¿Desea Actualizar el Registro?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si',
        cancelButtonText: 'No'
      }).then((result) =>{
        if(result.isConfirmed){    
  
          this.SpinnerService.show();
          this.serviceReporteNC.patchActualizarReporteNC(EnviarData).subscribe({
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
  
  cierres = [];
  cargarEstados(): void{
    this.SpinnerService.show();
    this.cierres = [];
    this.serviceReporteNC.getListarEstados().subscribe({
      next: (response: any) => {
        if(response.success){
          this.cierres = response.elements;
          console.log('Los estados son: ', this.cierres);
          if(response.elements > 0){
            this.cierres = response.elements;
            console.log('Los estados son dentro de elements > 0: ', this.cierres);
          }
        }
      }
    })
  }

  selectCierre(estado: { est_Id: string; est_Des: string }): void {
  this.formData.est_Id = estado.est_Id;
  this.cierreSeleccionado = estado.est_Id;
  console.log(this.cierreSeleccionado);
  }



}

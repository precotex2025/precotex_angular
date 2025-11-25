
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import * as _moment from 'moment';


interface ImagenAdjunta {
  img_Id?: number,
  nombre: string;
  base64: string;
  base64ParaVista: string;
}

interface ImagenAdjuntaPrecargada {
  nombrePreCargada: string;
  base64PreCargada: string;
  base64ParaVistaPreCargada: string;
}

interface FormData {
    fecha?: string,
    hora?: string,
    rep_Id: string,
    fechaObservacion: string,
    descripcion: string,
    estado: string,
    riesgo: string,
    accionCorrectiva: string,
    ubicacion: string,
    reportadoPor: string,
    responsable: string,
    area: string,
    imagenes?: string,
    imgnombre?: string,
    est_Id: string,
}

interface FormDataPatch {
    rep_Id: string,
    rep_Aceptado: string,
    rep_Resp_Levantamiento: string,
    rep_AccCor_Tom: string,
    rep_FecSub: Date | null,
    rep_Est?: string,
    rep_DetObs: string,
    imagenes?: string,
    imgnombre?: string,
    img_Fam?: number
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

  imagenesAdjuntas: ImagenAdjunta[] = []; 
  imagenesAdjuntasPreCargadas: ImagenAdjuntaPrecargada[] = [];
  constructor(
    private SpinnerService: NgxSpinnerService,
    private serviceReporteNC: ReporteNCService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar
  ){}
  formData: FormData = {
    fecha: '',
    hora: '',
    rep_Id: '0',
    fechaObservacion: '',
    descripcion: '',
    estado: '',
    riesgo: '',
    accionCorrectiva: '',
    ubicacion: '',
    reportadoPor: '',
    responsable: '',
    area: '',
    imagenes: '',
    imgnombre: '',
    est_Id: ''
  };

  formDataPatch: FormDataPatch = {
    rep_Id: '',
    rep_Aceptado: '0',
    rep_Resp_Levantamiento: '',
    rep_AccCor_Tom: '',
    rep_FecSub: new Date(),
    rep_Est: '',
    rep_DetObs: '',
    imagenes: '',
    imgnombre: '',
    img_Fam: 0
  }

  responsables = [];

  private timer: any;

  ngOnInit(): void {
    this.updateFechaHora();
    this.timer = setInterval(() => this.updateFechaHora(), 1000);
    this.onGetResponsables(1);
    this.ngOnGetParams();
    
  }

  rep_IdR = 0;
  ngOnGetParams(){
    this.route.queryParams.subscribe(params => {
      this.rep_IdR = Number(params['rep_IdR']) || 0;
    })
      this.cargarEstados();
      this.onGetDatosReporte(this.rep_IdR);
      this.onGetImagenes(this.rep_IdR, 1);
      this.onGetImagenes(this.rep_IdR, 2);
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
            const datos = this.datita[0]; 
            const fecha = new Date(datos.rep_FecObs);

            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();

            this.formData = {
              rep_Id: datos.rep_Id,
              fechaObservacion: `${dia}/${mes}/${anio}`,
              descripcion: datos.rep_DesNC,              
              estado: datos.est_Des,
              riesgo: datos.niv_Rgo_Des,
              accionCorrectiva: datos.rep_AccCor,
              ubicacion: datos.rep_Esp,
              reportadoPor: datos.rep_RepPor,
              responsable: datos.responsable,
              area: datos.are_Des,
              // aceptar: datos.aceptar,
              // responsableLevantamiento: datos.responsableLevantamiento,
              // accionTomada: datos.accionTomada,
              // fechaLevantamiento: datos.fechaLevantamiento,
              // cierre: datos.cierre,
              // observacion: datos.observacion,
              est_Id: datos.rep_Est,
            }

            this.formDataPatch = {
              rep_Id: datos.rep_Id,
              rep_Aceptado: datos.rep_Aceptado,
              rep_Resp_Levantamiento: datos.rep_Resp_Levantamiento,
              rep_AccCor_Tom: datos.rep_AccCor_Tom,
              // rep_FecSub: _moment(datos.rep_FecSub, 'MM/DD/YYYY HH:mm:ss').toDate(),
              rep_FecSub: _moment(datos.rep_FecSub, 'MM/DD/YYYY HH:mm:ss').toDate(),
              // rep_Est: datos.rep_Est,
              rep_DetObs: datos.rep_DetObs,
            }
            if(datos.rep_Est != null){
              this.cierreSeleccionado = datos.rep_Est.toString();
            }
            
            if(this.formDataPatch.rep_Aceptado != '1'){
              
              this.formDataPatch.rep_Resp_Levantamiento = datos.rep_Resp_Levantamiento;
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
      this.formDataPatch.rep_Resp_Levantamiento = null;
    }
  console.log('Valor seleccionado en Aceptar:', event.value);
  }

  onGuardar(): void{
      const base64Concatenado = this.imagenesAdjuntas.map(img => img.base64).join('|');
      const nombres = this.imagenesAdjuntas.map(img => img.nombre).join(',');
      let valor: string = ''
      if (this.formDataPatch.rep_Aceptado === '1'){
        valor = '';
      }else{
        valor = this.formDataPatch.rep_Resp_Levantamiento.toString() ?? '';
      }
      const EnviarData: FormDataPatch = {
        ...this.formDataPatch,
        rep_Id: this.formData.rep_Id,
        rep_Aceptado: this.formDataPatch.rep_Aceptado,
        rep_Est: this.cierreSeleccionado,
        rep_FecSub: this.formDataPatch.rep_FecSub
        // ? _moment(this.formDataPatch.rep_FecSub).format('DD/MM/YYYY HH:mm:ss')
        ? _moment(this.formDataPatch.rep_FecSub, 'DD/MM/YYYY').toDate()
        : null,
        rep_Resp_Levantamiento: valor,
        imagenes: base64Concatenado,
        imgnombre: nombres,
        img_Fam: 2
        };

        if(EnviarData.rep_Aceptado === "0"){
          this.matSnackBar.open("Indique si acepta o no la incidencia", "Cerrar", {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500
          });
          return;
        }else if(EnviarData.rep_Aceptado === "0" && EnviarData.rep_Resp_Levantamiento === ""){
          this.matSnackBar.open("Seleccione responsable de levantamiento", "Cerrar", {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500
          });
          return;
        }else if(EnviarData.rep_AccCor_Tom === ""){
          this.matSnackBar.open("Indique la acción correctiva tomada", "Cerrar", {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500
          });
          return;
        }
        // else if(EnviarData.imgnombre === ""){
        //   this.matSnackBar.open("Ingrese por lo menos una imagen", "Cerrar", {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 1500
        //   });
        //   return;
        // }
      console.log('LOS DATOS A ENVIAR SON: ', EnviarData);
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
          if(response.elements > 0){
            this.cierres = response.elements;
          }
        }
      }
    })
  }

  selectCierre(estado: { est_Id: string; est_Des: string }): void {
  this.formData.est_Id = estado.est_Id.toString();
  this.cierreSeleccionado = estado.est_Id.toString();
  }

  onImagenesSeleccionadas(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const archivos = Array.from(input.files);
    const maxImagenes = 2;

    if (this.imagenesAdjuntas.length + archivos.length > maxImagenes) {
      this.toastr.warning(`Solo puedes agregar hasta ${maxImagenes} imágenes.`, '', { timeOut: 2500 });
      return;
    }

    for (const archivo of archivos) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Completo = reader.result as string;
        const base64Solo = base64Completo.split(',')[1];
        this.imagenesAdjuntas.push({
          nombre: archivo.name,
          base64: base64Solo,
          base64ParaVista: base64Completo 
        });
      };
      reader.readAsDataURL(archivo);
    }


    input.value = '';
  }
  
  // imagenesExtraidas = [];
  onGetImagenes(Rep_Id: number, Img_Fam: number): void{
    this.SpinnerService.show();
    // this.imagenesExtraidas = [];
    this.serviceReporteNC.getObtenerImagenes(Rep_Id, Img_Fam).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            // this.imagenesExtraidas = response.elements;
            if(Img_Fam === 1){
              this.imagenesAdjuntasPreCargadas = response.elements.map((img: any) => ({
              nombrePreCargada: img.img_Des,
              base64ParaVistaPreCargada: this.serviceReporteNC.getImagenUrl(img.img_Des)
              }));
            }else{
              this.imagenesAdjuntas = response.elements.map((img: any) => ({
              img_Id: img.img_Id,
              nombre: img.img_Des,
              base64ParaVista: this.serviceReporteNC.getImagenUrl(img.img_Des)
              }));
            }

            this.SpinnerService.hide();
          }else{
            this.imagenesAdjuntas = [];
            this.imagenesAdjuntasPreCargadas = [];
            this.SpinnerService.hide();
          }
        }else{
          this.imagenesAdjuntasPreCargadas = [];
          this.imagenesAdjuntas = [];
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

  eliminarImagen(index: number, img_Id: number): void {
    if(img_Id === null || img_Id === undefined){
      const nombre = this.imagenesAdjuntas[index].nombre;
      this.imagenesAdjuntas.splice(index, 1);
    }else{
      Swal.fire({
      title: "¿Eliminar Imagen?",
      text: "Esta borrará de forma permanente",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si',
      cancelButtonText: 'No'
      }).then((result) =>{
        if(result.isConfirmed){    
          this.SpinnerService.show();
          this.serviceReporteNC.deleteEliminarImagenes(img_Id).subscribe({
            next: (response: any) => {
              if(response.success){
                if(response.codeResult == 200){
                  this.onGetImagenes(this.rep_IdR, 1)
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });
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
}

  onGetResponsables(Resp_Id: number):void {
      this.SpinnerService.show();
      this.responsables = [];
      this.serviceReporteNC.getObtenerResponsables(Resp_Id).subscribe({
        next: (response: any) => {
          if(response.success){
            if(response.totalElements > 0){
              this.responsables = response.elements;
              this.SpinnerService.hide();
            }else{
              this.responsables = [];
              this.SpinnerService.hide();
            }
          }else{
            this.responsables = [];
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

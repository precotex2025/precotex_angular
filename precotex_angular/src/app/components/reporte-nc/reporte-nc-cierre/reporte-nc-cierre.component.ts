import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { GlobalVariable } from 'src/app/VarGlobals';

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
    rep_Aceptado?: string,
    rep_Resp_Levantamiento?: string,
    rep_AccCor_Tom?: string,
    rep_FecSub?: Date | null,
    rep_Est?: string,
    rep_DetObs: string,
    imagenes?: string,
    imgnombre?: string,
    img_Fam?: number,
    rep_Usr_Sub?: string
}

interface FormDataImg{
    rep_Id: string,
    rep_Est?: string,
    rep_DetObs: string,
    imagenes?: string,
    imgnombre?: string,
    img_Fam?: number,
    rep_Usr_Sub?: string
}


@Component({
  selector: 'app-reporte-nc-cierre',
  templateUrl: './reporte-nc-cierre.component.html',
  styleUrls: ['./reporte-nc-cierre.component.scss']
})
export class ReporteNcCierreComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private serviceReporteNC: ReporteNCService,
    private matSnackBar: MatSnackBar
  ) { }

  rep_IdR = 0;
  ngOnInit(): void {
    this.cargarEstados();
    this.ngOnGetParams();
  }

  cierreSeleccionado: string = '';
  
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
    img_Fam: 0,
    rep_Usr_Sub: ''
  }
  formDataImg: FormDataImg = {
    rep_Id: '',
    rep_Est: '',
    rep_DetObs: '',
    imagenes: '',
    imgnombre: '',
    img_Fam: 0,
    rep_Usr_Sub: ''
  }

  ngOnGetParams(){
    this.route.queryParams.subscribe(params => {
      this.rep_IdR = Number(params['rep_IdR']) || 0;
    })
    this.formData.rep_Id = this.rep_IdR.toString();
      //this.onGetImagenes(this.rep_IdR, 1);
      this.onGetDatosReporte(this.rep_IdR);
      this.onGetImagenes(this.rep_IdR, 2);
      
  }

imagenesAdjuntas: ImagenAdjunta[] = []; 
imagenesAdjuntasPreCargadas: ImagenAdjuntaPrecargada[] = [];
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
              console.log('las imagenes guardadas son: ', this.imagenesAdjuntas);
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

onGuardar(): void{
      const base64Concatenado = this.imagenesAdjuntas.map(img => img.base64).join('|');
      const nombres = this.imagenesAdjuntas.map(img => img.nombre).join(',');
      const EnviarData: FormDataImg = {
        ...this.formDataPatch,
        rep_Id: this.formData.rep_Id,
        rep_Est: this.cierreSeleccionado,
        imagenes: base64Concatenado,
        imgnombre: nombres,
        img_Fam: 2,
        rep_Usr_Sub: GlobalVariable.vusu
        };

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
          this.serviceReporteNC.patchActualizarReporteNCCierre(EnviarData).subscribe({
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
              console.log('los datos obtenidos son: ', datos);
              this.formDataPatch = {
                rep_Id: datos.rep_Id,
                rep_Est: datos.rep_Est,
                rep_DetObs: datos.rep_DetObs
              }
  
              if(datos.rep_Est != null){
                this.cierreSeleccionado = datos.rep_Est.toString();
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

}

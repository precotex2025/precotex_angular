import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
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
import { parse } from 'path';

interface ImagenAdjunta {
  img_Id?: number,
  nombre: string;
  base64: string;
  base64ParaVista: string;
}

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
  imagenes?: string;
  imgnombre?: string;
  img_Fam: number;
  // num_Planta: string;
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
export class ReporteNCComponent implements OnInit, AfterViewInit {
  imagenesAdjuntas: ImagenAdjunta[] = []; 
  sedeSeleccionada: string = '';
  clasificacionSeleccionada: string = '';
  sedes = [];
  clasificaciones = [];
  imagenesCargadas = [];
  sCod_Usuario = GlobalVariable.vusu;
  accionR = '';
  rep_IdR = 0;
  Num_Planta: number = 0;
  Are_Id: number = 0;

  private timer: any;
  @ViewChild(MatSort) sort!: MatSort;  
  // @ViewChild('botonSede') botonSede!: ElementRef<HTMLButtonElement>;
  @ViewChildren('botonSede') botonesSede!: QueryList<ElementRef<HTMLButtonElement>>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private serviceReporteNC: ReporteNCService,
    private matSnackBar: MatSnackBar  
  ) { }

  
  ngOnInit(): void {
    
    this.onGetSedes();
    this.onGetClasificaciones();
    this.onGetRiesgos();
    this.onGetResponsables(1);
    this.ngOnGetParams();
    
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   const targetNumPlanta = this.formData.cod_Planta_Tg;
    //   console.log(targetNumPlanta);
    //   const boton = this.botonesSede.find((btn, index) => {
    //     const sede = this.sedes[index];
    //     return sede.num_Planta === targetNumPlanta;
    //   });
    //   console.log('CERCA A ENTRAR AL FORZADO');
    //   if (boton) {
    //     console.log('ENTRA AL FORZADO');
    //     boton.nativeElement.click();
    //     console.log('Click forzado en sede:', targetNumPlanta);
    //   }
    // }, 100);
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
    Rep_FecSub: '',
    imagenes: '',
    imgnombre: '',
    img_Fam: 0
    // num_Planta: ''
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
    if(this.rep_IdR == 0 ){
      this.updateFechaHora();
      this.timer = setInterval(() => this.updateFechaHora(), 1000);
    }else{
      this.onGetImagenes(this.rep_IdR, 1);
      this.onCargarDatos(this.rep_IdR); 
    }
  }

  onRedireccionarListado(modo: number){
    if(modo === 0){
      this.router.navigate(['ReporteNCListado'])
    }else{
      this.router.navigate(['ReporteNCListado'])
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

  

  areas = [];

  niveles = [];

  responsables = [];

  // select(field: keyof typeof this.formData, value: string) {
  //   this.formData[field] = value;
  // }
  select<K extends keyof FormData>(field: K, value: FormData[K]): void {
  this.formData[field] = value;
  }

  onProcesar(){
    if(this.accionR === 'I'){
      this.onGuardar();
    }else{
      this.onEditar();
    }
  }

  onGuardar(): void{
    const base64Concatenado = this.imagenesAdjuntas.map(img => img.base64).join('|');
    const nombres = this.imagenesAdjuntas.map(img => img.nombre).join(',');
    const EnviarData: FormData = {
      ...this.formData,
      imagenes: base64Concatenado,
      imgnombre: nombres,
      img_Fam: 1
    };

    if(EnviarData.cod_Planta_Tg === ""){
      this.matSnackBar.open("Seleccione una sede", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.are_Id === 0){
      this.matSnackBar.open("Seleccione el área", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.imagenes === ""){
      this.matSnackBar.open("Ingrese por lo menos una imagen", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_AccCor === ""){
      this.matSnackBar.open("Ingrese la acción correctiva sugerida", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_Clas === ""){
      this.matSnackBar.open("Seleccione la clasificación", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_DesNC === ""){
      this.matSnackBar.open("Ingrese descripción", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_Esp === ""){
      this.matSnackBar.open("Ingrese especificación del lugar", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_NivRgo === 0){
      this.matSnackBar.open("Seleccione el nivel de riesgo", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.resp_Id === 0){
      this.matSnackBar.open("Seleccione responsable", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }    

    Swal.fire({
      title: "¿Registrar Incidencia?",
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
    const base64Concatenado = this.imagenesAdjuntas.map(img => img.base64).join('|');
    const nombres = this.imagenesAdjuntas.map(img => img.nombre).join(',');
    const EnviarData: FormData = {
      ...this.formData,
      imagenes: base64Concatenado,
      imgnombre: nombres,
      img_Fam: 1
    };

    if(EnviarData.cod_Planta_Tg === ""){
      this.matSnackBar.open("Seleccione una sede", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.are_Id === 0){
      this.matSnackBar.open("Seleccione el área", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_AccCor === ""){
      this.matSnackBar.open("Ingrese la acción correctiva sugerida", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_Clas === ""){
      this.matSnackBar.open("Seleccione la clasificación", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_DesNC === ""){
      this.matSnackBar.open("Ingrese descripción", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_Esp === ""){
      this.matSnackBar.open("Ingrese especificación del lugar", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.rep_NivRgo === 0){
      this.matSnackBar.open("Seleccione el nivel de riesgo", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }else if (EnviarData.resp_Id === 0){
      this.matSnackBar.open("Seleccione responsable", "Cerrar", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500
      });
      return;
    }


    Swal.fire({
      title: "¿Editar Incidencia?",
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
  nivelSeleccionado = 0;
  selectNivel(nivel: any): void {
  this.formData.rep_NivRgo = nivel.niv_Rgo_Id;
  this.nivelSeleccionado = nivel.niv_Rgo_Id;
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
            this.datita = response.elements;
            const datos = this.datita[0];
            //damos formato a la feha
            const fecha = new Date(datos.rep_FecObs);
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();

            this.formData = {
              rep_Id: datos.rep_Id,
              rep_FecObs: `${dia}/${mes}/${anio}`,
              rep_HorObs: datos.rep_HorObs,
              cod_Planta_Tg: datos.cod_Planta_Tg.toString(),
              are_Id: datos.are_Id,
              rep_Esp: datos.rep_Esp,
              rep_Clas: datos.rep_Clas,
              rep_DesNC: datos.rep_DesNC,
              rep_NivRgo: datos.rep_NivRgo,
              rep_AccCor: datos.rep_AccCor,
              resp_Id: datos.resp_Id,
              rep_RepPor: datos.rep_RepPor,
              rep_Est: datos.rep_Est,
              Rep_FecSub: datos.Rep_FecSub,
              img_Fam: datos.img_Fam
            }

            this.sedeSeleccionada = datos.cod_Planta_Tg.toString();
            this.clasificacionSeleccionada = datos.rep_Clas;
            this.nivelSeleccionado = datos.rep_NivRgo;
            this.onGetAreaXSede(parseInt(this.sedeSeleccionada), datos.are_Id);
            this.onGetResponsables(parseInt(datos.resp_Id));
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
    this.onGetAreaXSede(parseInt(this.sedeSeleccionada), 0);
    }

    selectClasificacion(clasificacion: { cla_Id: string; cla_Des: string }): void {
    this.formData.rep_Clas = clasificacion.cla_Id;
    this.clasificacionSeleccionada = clasificacion.cla_Id;
    }

    onGetAreaXSede(Num_Planta: number, Are_Id: number):void {
      this.SpinnerService.show();
      this.areas = [];
      this.serviceReporteNC.getObtenerAreaXSede(Num_Planta, Are_Id).subscribe({
        next: (response: any) => {
          if(response.success){
            if(response.totalElements > 0){
              this.areas = response.elements;
              this.SpinnerService.hide();
            }else{
              this.areas = [];
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

    imagenes: string[] = [];
    
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
        const base64Solo = base64Completo.split(',')[1]; // para backend
        this.imagenesAdjuntas.push({
          nombre: archivo.name,
          base64: base64Solo,
          base64ParaVista: base64Completo // para mostrar en <img>
        });
      };
      reader.readAsDataURL(archivo);
    }


    input.value = '';
  }       

  eliminarImagen(index: number, img_Id: number): void {
    if(this.accionR == 'I' ){
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
          // if()
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
    this.imagenesCargadas = [];
    this.serviceReporteNC.getObtenerImagenes(Rep_Id, Img_Fam).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.imagenesCargadas = response.elements;

            this.imagenesAdjuntas = response.elements.map((img: any) => ({
              img_Id: img.img_Id,
              nombre: img.img_Des,
              base64ParaVista: this.serviceReporteNC.getImagenUrl(img.img_Des)
            }));

            this.SpinnerService.hide();
          }else{
            this.imagenesCargadas = [];
            this.SpinnerService.hide();
          }
        }else{
          this.imagenesCargadas = [];
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

  onGetRiesgos(): void{
    this.SpinnerService.show();
    this.niveles = [];
    this.serviceReporteNC.getListarRiesgos().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.niveles = response.elements;
            this.SpinnerService.hide();
          }else{
            this.niveles = [];
            this.SpinnerService.hide();
          }
        }else{
          this.niveles = [];
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

  cambiarEstilo(nivel: any): { [key: string]: string } {
  const isSelected = nivel.niv_Rgo_Id === this.nivelSeleccionado;

  if (!isSelected) {
    switch (nivel.niv_Rgo_Id) {
      case 1: return { 'background-color': '#4caf50', 'color': 'white' };
      case 2: return { 'background-color': '#ffeb3b', 'color': 'black' };
      case 3: return { 'background-color': '#f44336', 'color': 'white' };
      default: return {};
    }
  }

  switch (nivel.niv_Rgo_Id) {
    case 1: return { 'background-color': '#4b66ffff', 'color': 'white', 'box-shadow': '0 0 5px rgba(0,0,0,0.3)' };
    case 2: return { 'background-color': '#4b66ffff', 'color': 'white', 'box-shadow': '0 0 5px rgba(0,0,0,0.3)' };
    case 3: return { 'background-color': '#4b66ffff', 'color': 'white', 'box-shadow': '0 0 5px rgba(0,0,0,0.3)' };
    default: return {};
  }
}


}

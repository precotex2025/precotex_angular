import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from '../../../../services/seguridad-control-vehiculo.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam/public_api';
import { WebcamInitError } from 'ngx-webcam/src/app/modules/webcam/domain/webcam-init-error';
import { NgxSpinnerService } from 'ngx-spinner';

interface Listar_Origen {
  origen: string,
  num_planta_origen: number,
  vehiculo: string,
  conductor: string,
  kilometraje: number,
  glosa: string,
  Descripcion: String;
  Planta: number;
  des_vehiculo: String,

}



@Component({
  selector: 'app-seguridad-control-vehiculo-ingreso',
  templateUrl: './seguridad-control-vehiculo-ingreso.component.html',
  styleUrls: ['./seguridad-control-vehiculo-ingreso.component.scss']
})
export class SeguridadControlVehiculoIngresoComponent implements OnInit {

  nNum_Planta = GlobalVariable.num_planta;

  //opera: string[] = ['Carga', 'Descarga', 'Carga/Descarga'];

  listes: any[] = [
    { name: "Carga", cod: "C" },
    { name: "Descarga", cod: "D" },
    { name: "Carga/Descarga", cod: "X" },];


  //* Declaramos las variables a usar en los metodos */

  des_planta = ''
  origen_selectt = ''
  codigo_vehiculo = '';
  des_vehiculo = ''
  codigo_conductor = '';
  des_conductor = '';
  cod_accion = 'I';
  opera = '';
  Ultimo_Fec_Registro = ''
  Planta = ''
  Accion = ''
  Origen = ''
  Destino = ''
  Ultimo_Km = 0
  Usuario = ''
  Fecha_Registro = ''
  sAccion = ''





  //* Declaramos formulario para obtener los controles */
  // poner los formcontrolname en el html y aca para extraer sus valores en los metodos
  //estas variables deben estar en el html 
  formulario = this.formBuilder.group({
    origen: [''],
    num_planta_origen: [0],
    vehiculo: [''],
    conductor: [''],
    kilometraje: [''],
    glosa: [''],
    ope: [''],
    nombre: ['']


  })



  listar_origenes: Listar_Origen[] = [];


  // private trigger: Subject<any> = new Subject();
  // public webcamImage!: WebcamImage;
  // private nextWebcam: Subject<any> = new Subject();
  // sysImage = '';

  file: any;
  file2: any;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,

  ) { }



  @ViewChild('conductor') inputConductor!: ElementRef;
  @ViewChild('kilometraje') inputKilometraje!: ElementRef;

  ngOnInit(): void {
    this.formulario.controls['conductor'].disable()
    this.formulario.controls['nombre'].disable()
    this.MostrarTitulo()
    this.ListarOrigen()



    //this.DatosOrigen()
    //this.BuscarVehiculo()

  }

  // public getSnapshot(): void {
  //   this.trigger.next(void 0);
  // }
  // public captureImg(webcamImage: WebcamImage): void {
  //   this.webcamImage = webcamImage;
  //   this.sysImage = webcamImage!.imageAsDataUrl;
  //   console.info('got webcam image', this.sysImage);
  // }

  // public handleInitError(error: WebcamInitError): void {
  //   if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
  //     console.warn("Camera access was not allowed by user!");
  //   }
  // }
  // public get invokeObservable(): Observable<any> {
  //   return this.trigger.asObservable();
  // }
  // public get nextWebcamObservable(): Observable<any> {
  //   return this.nextWebcam.asObservable();
  // }

  MostrarTitulo() {
    if (GlobalVariable.num_planta == 1) {
      this.des_planta = 'Santa Maria'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'Santa Cecilia'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'Huachipa Sede I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'Huachipa Sede II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'Independencia'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'Independencia II'
    } else if (GlobalVariable.num_planta == 13) {
      this.des_planta = 'Santa Rosa'
    } else if (GlobalVariable.num_planta == 11) {
      this.des_planta = 'VyD'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'Huachipa Sede III'
    } else {
      this.des_planta = ''
    }
  }




  ListarOrigen() {
    this.seguridadControlVehiculoService.ListarOrigenesService(this.nNum_Planta).subscribe(
      (result: any) => {
        this.listar_origenes = result;

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*DatosOrigen() {
   let origen_select = this.listar_origenes.find(elemento => elemento.num_guia == this.formulario.get('num_guia')?.value)
   this.formulario.patchValue({ origen: origen_select?.origen })
   this.origen_selectt = this.formulario.get('origen')?.value
  }  
*/


  onChangeFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      console.log(this.file);


    }
  }

  onChangeFile2(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file2 = event.target.files[0];
      console.log(this.file2);


    }
  }
  eliminarArchivo() {
    this.file = null;
  }

  eliminarArchivo2() {
    this.file2 = null;
  }

  BuscarVehiculo() {
    this.Ultimo_Fec_Registro = ''
    this.Planta = ''
    this.Accion = ''
    this.Origen = ''
    this.Destino = ''
    this.Ultimo_Km = 0
    this.Usuario = ''
    this.codigo_vehiculo = this.formulario.get('vehiculo')?.value

    if (this.codigo_vehiculo == null) {
      this.formulario.controls['conductor'].setValue('');
    } else if (this.codigo_vehiculo.length <= 8 || this.codigo_vehiculo.length >= 10) {
      this.formulario.controls['conductor'].setValue('');
      this.des_vehiculo = '';
      this.des_conductor = '';
      this.formulario.controls['nombre'].setValue('');
    } else {



      this.seguridadControlVehiculoService.traerInfoVehiculoService(this.nNum_Planta, this.codigo_vehiculo).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.des_vehiculo = result[0].Descripcion;
            this.inputConductor.nativeElement.focus()
            if (result[0].Dni_Conductor.length > 0) {
              console.log(result)
              this.formulario.controls['conductor'].setValue(result[0].Dni_Conductor);
              this.formulario.controls['nombre'].setValue(result[0].Nombres);
              //this.BuscarConductor()
              this.Ultimo_Fec_Registro = result[0].Ultimo_Fec_Registro
              this.Planta = result[0].Planta
              this.Accion = result[0].Accion
              this.Origen = result[0].Origen
              this.Destino = result[0].Destino
              this.Ultimo_Km = result[0].Ultimo_Km
              this.Usuario = result[0].Usuario
            }
          } else {

            // this.formulario.controls['conductor'].setValue('');
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


    }

  }


  BuscarConductor() {
    this.codigo_conductor = this.formulario.get('conductor')?.value

    if (this.codigo_conductor.length <= 7 || this.codigo_conductor.length >= 9) {
      //this.des_vehiculo = '';
      this.des_conductor = '';
    } else {


      this.seguridadControlVehiculoService.traerInfoConductorService(this.nNum_Planta, this.codigo_conductor).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.des_conductor = result[0].Nombres;
            this.inputKilometraje.nativeElement.focus()
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    }

  }


  //sCod_Accion: string, nNum_Planta: number, sCod_barras: string, sDni_conductor: string,
  //nNum_Planta_Ref: number, nNum_kilometraje: number,sGlosa: string

  Guardar() {

    console.log(this.formulario.get('ope')?.value)
    this.sAccion = 'I'
    if (this.Fecha_Registro != '') {
      this.sAccion = 'U'
    }

    if (this.formulario.get('vehiculo')?.value == '' ||
      this.formulario.get('conductor')?.value == '' ||
      this.formulario.get('origen')?.value == '' ||
      this.formulario.get('kilometraje')?.value == '' ||
      this.formulario.get('ope')?.value == '') {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
      this.spinnerService.show();
      const formData = new FormData();
      formData.append('Accion', this.sAccion);
      formData.append('Cod_Accion', this.cod_accion);
      formData.append('Num_Planta', this.nNum_Planta.toString());
      formData.append('Cod_Barras', this.formulario.get('vehiculo')?.value);
      formData.append('Dni_Conductor', this.formulario.get('conductor')?.value);
      formData.append('Conductor', this.formulario.get('nombre')?.value);
      formData.append('Num_Planta_Referencia', this.formulario.get('origen')?.value);
      formData.append('Num_Kilometraje', this.formulario.get('kilometraje')?.value);
      formData.append('Observacion', this.formulario.get('glosa')?.value);
      formData.append('Operacion', this.formulario.get('ope')?.value);
      formData.append('Cod_Usuario', GlobalVariable.vusu)
      formData.append('Fecha_Registro', this.Fecha_Registro);
      formData.append('Foto1', this.file);
      formData.append('Foto2', this.file2);
      formData.append('Descripcion', this.des_vehiculo);



      this.seguridadControlVehiculoService.GuardarServiceCopia(
        formData).subscribe(

          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.spinnerService.hide();
              this.file = null;
              this.file2 = null;
              this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.Fecha_Registro = ''
              this.Limpiar()
              this.formulario.controls['origen'].enable()
              this.formulario.controls['ope'].enable()
              this.formulario.controls['glosa'].enable()
              this.formulario.controls['vehiculo'].enable()
              // this.ListarGuia()
            }
            else {
              this.spinnerService.hide();
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.spinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

          })

    }
  }

  Limpiar() {
    this.formulario.reset()
    this.des_vehiculo = '';
    this.des_conductor = '';
    this.formulario.controls['nombre'].setValue('');
  }



  CompletarInfo() {
    if (this.formulario.get('vehiculo')?.value == '') {
      this.matSnackBar.open('Ingresa el codigo del vehiculo..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
      this.sAccion = 'T'
      this.seguridadControlVehiculoService.GuardarService(
        this.sAccion,
        this.cod_accion,
        this.nNum_Planta = 0,
        this.formulario.get('vehiculo')?.value,
        this.formulario.get('conductor')?.value,
        0,
        0,
        this.formulario.get('glosa')?.value,
        this.formulario.get('ope')?.value,
        this.Fecha_Registro).subscribe(
          (result: any) => {

            if (result.length > 0) {
              this.formulario.controls['vehiculo'].setValue(result[0].Cod_Barras)
              this.formulario.controls['conductor'].setValue(result[0].Dni_Conductor)
              this.formulario.controls['nombre'].setValue(result[0].Nombre)
              this.formulario.controls['origen'].setValue(result[0].Num_Planta_Origen)
              this.formulario.controls['kilometraje'].setValue(result[0].Num_Kilometraje)
              this.formulario.controls['glosa'].setValue(result[0].Observacion)
              this.formulario.controls['ope'].setValue(result[0].Operacion)
              this.des_vehiculo = result[0].Descripcion
              this.formulario.controls['origen'].disable()
              this.formulario.controls['ope'].disable()
              this.formulario.controls['glosa'].disable()
              this.formulario.controls['vehiculo'].disable()
              this.Fecha_Registro = result[0].FECHA
            }
            else {
              this.matSnackBar.open('No se encontraron resultados..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        )
    }
  }
}

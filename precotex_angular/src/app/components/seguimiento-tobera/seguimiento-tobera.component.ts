import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SeguimientoToberaService } from 'src/app/services/seguimiento-tobera.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Archivo } from 'src/app/models/Archivo/Archivo';
//pch 21/01/25
import { TipMotivoReproceso } from 'src/app/models/Tintoreria/TipMotivoReproceso';
import { map, Observable, startWith } from 'rxjs';
import { TintoreriaService } from 'src/app/services/tintoreria.service';

@Component({
  selector: 'app-seguimiento-tobera',
  templateUrl: './seguimiento-tobera.component.html',
  styleUrls: ['./seguimiento-tobera.component.scss'],
})
export class SeguimientoToberaComponent implements OnInit {
  public archivos: any = [];

  @ViewChild('miInputref') miInputref: ElementRef;
  @ViewChild('miInput') miInput: ElementRef;

  numeroIngresado: string = '';
  numeroIngresado2: string = '';
  numero: number;
  numeroref: number | string = '';
  sw: number = 0;
  selectedElement: any;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  imgChangeEvt2: any = '';
  cropImgPreview2: any = '';

  RutaFoto = '';
  RutaFoto2 = '';
  RutaFoto3 = '';
  RutaFoto4 = '';
  RutaFoto5 = '';
  RutaFoto6 = '';

  NroReferencia = '';

  i: any = 0;

  deshabilitado: boolean = true; // Inicialmente deshabilitado
  estaDeshabilitado: boolean = true; // Inicialmente deshabilitado

  ToberaOrg: string = '';
  ToberaSelected: string = '';
  GlobalAutoriza: string = 'N';

  opcionSeleccionada: string = 'T';
  opciones = [
    { value: 'P', viewValue: 'PREVIO' },
    { value: 'T', viewValue: 'TEÑIDO' },
  ];

  autorizaCambio: string = 'N';
  opcionesAut = [
    { value: 'S', viewValue: 'SI' },
    { value: 'N', viewValue: 'NO' },
  ];

  /*Inicio - Nuevos Cambios Avanzados por Pch*/
  listar_TipMotivoReproceso: TipMotivoReproceso[] = [];
  Tip_MotivoReproceso = ''
  Des_MotivoReproceso = '' 
  deshabilitaMotivoReproceso: boolean = true; 
  flg_evaTob = ''; 
  /*Fin*/ 


  formulario = this.formBuilder.group({
    CodReceta: [''],
    CodReceta2: [''],
    CodRecetaHidden: [''],
    IdSeg: [''],
    Partida: [''],
    Maquina: [''],
    Tipo: ['T'],
    Autoriza: ['N'],
    Tobera: [''],
    Toberasel: ['0', [Validators.required]],
    Flg_Reproceso: [false],
    Option_TipMotivoReproceso: [null]
  });

  evitarTeclado(event: Event) {
    event.preventDefault();
    (event.target as HTMLElement).blur();
  }

  onFileChange(event: any): void {
    this.file = event.target.files[0];
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.RutaFoto = reader.result as string;
      };
    }
  }

  onFileChange2(event: any): void {
    this.file2 = event.target.files[0]; //aqui
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file2] = event.target.files;
      reader.readAsDataURL(file2);
      reader.onload = () => {
        this.RutaFoto2 = reader.result as string;
      };
    }
  }

  onFileChange3(event: any): void {
    this.file3 = event.target.files[0]; //aqui
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file3] = event.target.files;
      reader.readAsDataURL(file3);
      reader.onload = () => {
        this.RutaFoto3 = reader.result as string;
      };
    }
  }

  onFileChange4(event: any): void {
    this.file4 = event.target.files[0]; //aqui
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file4] = event.target.files;
      reader.readAsDataURL(file4);
      reader.onload = () => {
        this.RutaFoto4 = reader.result as string;
      };
    }
  }

  onFileChange5(event: any): void {
    this.file5 = event.target.files[0]; //aqui
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file5] = event.target.files;
      reader.readAsDataURL(file5);
      reader.onload = () => {
        this.RutaFoto5 = reader.result as string;
      };
    }
  }

  onFileChange6(event: any): void {
    this.file6 = event.target.files[0]; //aqui
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file6] = event.target.files;
      reader.readAsDataURL(file6);
      reader.onload = () => {
        this.RutaFoto6 = reader.result as string;
      };
    }
  }

  cropImg(e: ImageCroppedEvent) {
    //this.cropImgPreview = e.base64;
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }
  imgFailed() {
    // error msg
  }

  disaTexto = true;
  CodReceta: string = '';
  CodReceta2: string = '';
  CodRecetaHidden: string = '';
  IdSeg = '';
  Partida = 0;
  Maquina = '';
  Tobera = '';
  Toberasel = '';

  imagecropper = '';

  public archivo: Archivo;
  public archivosServer: Archivo;
  public lastPK: number;

  autorizaSeleccionada: boolean = false;
  estado: boolean = false;

  file: any;
  file2: any;
  file3: any;
  file4: any;
  file5: any;
  file6: any;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private exceljsService: ExceljsService,
    private SeguimientoTobera: SeguimientoToberaService,
    private TintoreriaService: TintoreriaService //pch 21/01/25
  ) {}

  ngOnInit(): void {
    document.getElementById('CodReceta')?.focus();
    this.formulario.controls['CodReceta2'].disable();
    this.formulario.controls['Partida'].disable();
    this.formulario.controls['Maquina'].disable();
    //this.formulario.controls['Tobera'].disable()
    //this.formulario.controls['Toberasel'].disable()

    //Cargar la lista de motivo de proceso
    this.CargarTipMotivoReproceso();
  }

  onToggle() {
    //debugger
    if (this.formulario.get('CodReceta')?.value.length >= 6) {
      this.showLectura(this.formulario.get('CodReceta')?.value);
    }
  }

  showLectura(nref) {
    this.NroReferencia = nref;

    this.RutaFoto = '';
    this.RutaFoto2 = '';
    this.RutaFoto3 = '';
    this.RutaFoto4 = '';
    this.RutaFoto5 = '';
    this.RutaFoto6 = '';

    this.file = '';
    this.file2 = '';
    this.file3 = '';
    this.file4 = '';
    this.file5 = '';
    this.file6 = '';
    this.SeguimientoTobera.showLecturaTobera(
      'L',
      nref,
      this.formulario.get('Tipo')?.value
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          //this.CodRecetaHidden=result[0].CodReceta;
          this.formulario.get('CodRecetaHidden')?.setValue(result[0].CodReceta);
          this.formulario.get('CodReceta2')?.setValue(result[0].CodReceta);
          this.formulario.get('IdSeg')?.setValue(result[0].IdSeg);
          this.formulario.get('Partida')?.setValue(result[0].Partida);
          this.formulario.get('Maquina')?.setValue(result[0].Maquina);
          this.formulario.get('Tobera')?.setValue(result[0].Tobera);
          this.formulario.get('Toberasel')?.setValue(result[0].Toberasel);
          //this.formulario.get('Tipo')?.setValue(result[0].TipoPrueba);

          if (result[0].Toberasel == '0') {
            this.formulario.get('Toberasel')?.setValue('');
          }

          //Nuevos Campos
          this.formulario.get('Flg_Reproceso')?.setValue(result[0].Flg_Reproceso);
          this.formulario.get('Option_TipMotivoReproceso')?.setValue(result[0].Cod_Motivo_Reproceso);

          if(result[0].Flg_Reproceso == '1'){
            this.deshabilitaMotivoReproceso = false;
          }else{
            this.formulario.get('Flg_Reproceso')?.setValue(0);
            this.deshabilitaMotivoReproceso = true;
          }

          this.ToberaOrg = result[0].Tobera;
          this.GlobalAutoriza = result[0].AutCambio;

          this.sw = 1;
          const inputElement = this.miInput.nativeElement;
          inputElement.focus();
          inputElement.select();

          if (result[0].AutCambio == 'S') {
            this.matSnackBar.open('Autorizado!', 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
            });

            this.formulario.get('Autoriza')?.setValue('S');
          }

          this.flg_evaTob = result[0].evaTob;
          if (result[0].evaTob == 'S') {
            this.estaDeshabilitado = false;
          } else {
            this.estaDeshabilitado = true;
          }

          if (result[0].Imagenes[0].RutaFoto == undefined) {
            this.RutaFoto = '';
          } else {
            this.RutaFoto = result[0].Imagenes[0].RutaFoto;
          }

          if (result[0].Imagenes[1].RutaFoto == undefined) {
            this.RutaFoto2 = '';
          } else {
            this.RutaFoto2 = result[0].Imagenes[1].RutaFoto;
          }

          if (result[0].Imagenes[2].RutaFoto == undefined) {
            this.RutaFoto3 = '';
          } else {
            this.RutaFoto3 = result[0].Imagenes[2].RutaFoto;
          }

          if (result[0].Imagenes[3].RutaFoto == undefined) {
            this.RutaFoto4 = '';
          } else {
            this.RutaFoto4 = result[0].Imagenes[3].RutaFoto;
          }

          if (result[0].Imagenes[4].RutaFoto == undefined) {
            this.RutaFoto5 = '';
          } else {
            this.RutaFoto5 = result[0].Imagenes[4].RutaFoto;
          }

          if (result[0].Imagenes[5].RutaFoto == undefined) {
            this.RutaFoto6 = '';
          } else {
            this.RutaFoto6 = result[0].Imagenes[5].RutaFoto;
          }

          this.imgChangeEvt = '';
          this.cropImgPreview = '';
          this.file = '';
          this.file2 = '';
          this.file3 = '';
          this.file4 = '';
          this.file5 = '';
          this.file6 = '';

          // this.formulario.get('CodReceta')?.setValue('');
        } else {
          //this.matSnackBar.open("Sin resultados", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          this.limpiar();
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
    );
  }

  onSelectionChange() {
    this.showLectura(this.formulario.get('CodRecetaHidden')?.value);
  }

  eliminarArchivo() {
    this.file = null;
  }

  asignarvalor(valor) {
    this.formulario.get('Toberasel')?.setValue(valor);
  }

  disminuirNumero() {
    // debugger

    if (this.numeroIngresado !== '' && this.numeroIngresado !== null) {
      this.numeroIngresado = this.numeroIngresado.toString().slice(0, -1);
    }
  }

  ingresarNumero(numero: number) {
    if (this.sw == 0) {
      this.numeroIngresado += numero.toString();
      if (this.numeroIngresado.length >= 6) {
        this.showLectura(this.numeroIngresado);
      }
    } else {
      // this.ToberaOrg      = result[0].Tobera;
      // this.GlobalAutoriza = result[0].RutaFoto ;

      this.ToberaSelected = this.formulario.get('Toberasel')?.value;
      this.numeroIngresado2 = numero.toString();

      if (this.numeroIngresado2 == '0') {
        this.matSnackBar.open('La Tobera dno pude ser 0 ', 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
        });

        this.numeroIngresado2 = '';
        this.formulario.get('Toberasel')?.setValue('');
        const inputElement = this.miInput.nativeElement;
        inputElement.focus();
      } else {
        if (this.GlobalAutoriza == 'N') {
          if (this.ToberaOrg !== this.numeroIngresado2) {
            this.matSnackBar.open(
              'La Tobera debe ser la misma de Orgatex! ToberaOrg: ' +
                this.ToberaOrg +
                ' ToberaSel: ' +
                this.numeroIngresado2,
              'Cerrar',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
              }
            );
            this.numeroIngresado2 = '';
            this.formulario.get('Toberasel')?.setValue('');
            const inputElement = this.miInput.nativeElement;
            inputElement.focus();

            //this.numeroIngresado2 = '';
          } else {
            this.numeroIngresado2 = numero.toString();
            this.formulario.get('Toberasel')?.setValue(this.numeroIngresado2);
          }
        } else {
          this.numeroIngresado2 = numero.toString();
          this.formulario.get('Toberasel')?.setValue(this.numeroIngresado2);
        }
      }
    }
  }

  validarNumero(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  validarInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 1) {
      inputElement.value = inputElement.value.charAt(0);
    }
  }

  validarInputRef(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 6) {
      inputElement.value = inputElement.value.charAt(0);
    }
  }

  InputSelTob() {
    const inputElement = this.miInput.nativeElement;
    inputElement.focus();
    inputElement.select();
  }

  ingresarValor(inputElement: ElementRef, valor: string) {
    inputElement.nativeElement.value = valor;
    console.log(`Valor ingresado: ${valor}`);
  }

  // REGISTRAR
  submit(formDirective): void {

    //Obtener el valor del checked
    const isChecked = this.formulario.get('Flg_Reproceso')?.value;
    const tipMotRepro = this.formulario.get('Option_TipMotivoReproceso').value;

    this.SeguimientoTobera.showGrabarLecturaTobera(
      'I',
      this.formulario.get('IdSeg')?.value,
      //this.formulario.get('CodRecetaHidden')?.value,
      this.formulario.get('CodRecetaHidden')?.value,
      this.formulario.get('Toberasel')?.value,
      this.formulario.get('Maquina')?.value,
      this.formulario.get('Partida')?.value,
      this.formulario.get('Tipo')?.value,
      this.formulario.get('Autoriza')?.value,
      //"http://192.168.1.36:8070\\uploads\\"+this.formulario.get('CodReceta')?.value

      isChecked?"1":"0",
      tipMotRepro,

      //this.file
    ).subscribe(
      (result: any) => {
        console.log(result);

        this.subirArchivo();

        if (result) {
          if (result.Mensaje == 'Ok') {
            this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
            });
            this.limpiar();
            this.formulario.get('CodReceta')?.setValue('');
          } else {
            this.matSnackBar.open(result.Mensaje, 'Cerrar', {
              duration: 3000,
            });
          }
        } else {
          this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
          });
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        })
    );
  }

  subirArchivo(): any {
    try {
      const formData = new FormData();
      //this.archivos.forEach(archivo=> {
      //console.log("Subirimagen " + archivo);
      formData.append('files', this.file);
      formData.append('files2', this.file2);
      formData.append('files3', this.file3);
      formData.append('files4', this.file4);
      formData.append('files5', this.file5);
      formData.append('files6', this.file6);
      formData.append(
        'codreceta',
        this.formulario.get('CodRecetaHidden')?.value
      );
      formData.append('partida', this.formulario.get('Partida')?.value);
      //formData.append('codreceta', this.CodRecetaHidden);
      //this.SeguimientoTobera.showGrabarImagen(formData, this.formulario.get('CodRecetaHidden')?.value).subscribe((result: any) => {
      this.SeguimientoTobera.showGrabarImagen(
        formData,
        this.formulario.get('CodRecetaHidden')?.value,
        this.formulario.get('Tipo')?.value
      ).subscribe((result: any) => {
        (err: HttpErrorResponse) => console.log(err.message);
      });
    } catch (e) {
      console.log('Error', e);
    }
    this.archivos = '';
  }

  limpiarReferencia() {
    this.numeroIngresado = '';
    this.formulario.get('CodReceta')?.setValue('');
    this.formulario.get('CodReceta2')?.setValue('');
    const inputElement = this.miInputref.nativeElement;
    this.sw = 0;
    inputElement.focus();
  }

  limpiar() {
    this.numeroIngresado = '';
    this.formulario.get('CodReceta')?.setValue('');
    this.formulario.get('CodReceta2')?.setValue('');

    this.formulario.get('IdSeg')?.setValue('');
    this.formulario.get('Partida')?.setValue('');
    this.formulario.get('Maquina')?.setValue('');
    this.formulario.get('Tobera')?.setValue('');
    this.formulario.get('Toberasel')?.setValue('');

    //Ini - Limpia control de Reproceso
    this.formulario.get('Flg_Reproceso')?.setValue(false);
    this.deshabilitaMotivoReproceso = true;
    this.formulario.get('Option_TipMotivoReproceso')?.reset(); 
    //Fin - Limpia control de Reproceso

    this.formulario.get('image-cropper')?.setValue('');
    this.imgChangeEvt = '';
    this.cropImgPreview = '';
    this.RutaFoto = '';
    this.RutaFoto2 = '';
    this.RutaFoto3 = '';
    this.RutaFoto4 = '';
    this.RutaFoto5 = '';
    this.RutaFoto6 = '';
    //this.RutaFoto= 'http://192.168.1.36/Estilos/default.jpg';
    this.file = '';
    this.file2 = '';
    this.file3 = '';
    this.file4 = '';
    this.file5 = '';
    this.file6 = '';

    const inputElement = this.miInputref.nativeElement;
    this.sw = 0;
    inputElement.focus();
  }

  // subirArchivo(archivo: Archivo) {
  //   this.SeguimientoTobera.uploadFile(this.archivo).subscribe(Response => {});
  // }

  // GuardarImagen(archivo: Archivo) {
  //   this.SeguimientoTobera.GuardarImagen(this.archivo).subscribe(Response => {});
  // }



  CargarTipMotivoReproceso(){
    this.listar_TipMotivoReproceso = [];    
    this.TintoreriaService.MuestraTipMotivoReproceso(      
      ).subscribe(data =>
      {
        this.listar_TipMotivoReproceso = data    
      }
      )
  }

  CambiarValorTipMotivoReproceso(Tip_MotivoReproceso: string){
    this.Tip_MotivoReproceso = Tip_MotivoReproceso
  }  

  onCheckboxReproceso():void{
    const isChecked = this.formulario.get('Flg_Reproceso')?.value;
    if (!isChecked) {
      this.deshabilitaMotivoReproceso = false;
      this.estaDeshabilitado = false; //Habilita Tipo Prueba
    } else {
      if (this.flg_evaTob == 'N'){
        this.estaDeshabilitado = true; //DesHabilita Tipo Prueba
      }
      this.deshabilitaMotivoReproceso = true;
      this.formulario.get('Option_TipMotivoReproceso')?.reset(); 
      
    }    
  }

}

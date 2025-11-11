import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SolicitudMantenimientoService } from 'src/app/services/SolicitudMantenimiento/solicitud-mantenimiento.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface data {
  Title       : string;
  Accion      : string;
  sCod_Usuario: string;
  sNom_Usuario: string;
  sCod_Planta : string;
}

@Component({
  selector: 'app-dialog-solicitud-mnto-create',
  templateUrl: './dialog-solicitud-mnto-create.component.html',
  styleUrls: ['./dialog-solicitud-mnto-create.component.scss']
})
export class DialogSolicitudMntoCreateComponent implements OnInit {
  fileName: string = '';
  selectedFile: File | null = null;  
  @ViewChild('inputQR') inputQR!: ElementRef<HTMLInputElement>;
  @ViewChild('inputObservacion') inputObservacion!: ElementRef<HTMLInputElement>;
  
  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });  

  dataAreas: any[] = [];

  //Variables
  sCodArea: string = '';
  sCodMaquina: string = '';
  isInfoCargada = false;

  constructor(
    private formBuilder : FormBuilder ,
    private datePipe    : DatePipe    ,
    private SpinnerService      : NgxSpinnerService,
    private serviceSolicitudMnto: SolicitudMantenimientoService,
    private matSnackBar       : MatSnackBar       ,
    private toastr            : ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogSolicitudMntoCreateComponent>,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.inputQR?.nativeElement.focus(), 300);
    const sFecActual       : string =  this.range.get('end').value;
    const fechaFormateada = this.datePipe.transform(sFecActual, 'dd/MM/yyyy');

    // Obtiene la hora actual en formato HH:mm (24h)
    const ahora = new Date();
    const horaActual = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });    

    //Deshabilitar Controles. 
    this.formulario.get('ctrolFecha')?.disable();
    this.formulario.get('ctrolSupervisor')?.disable();
    //this.formulario.get('ctrolArea')?.disable();
    //this.formulario.get('ctrolMaquina')?.disable();
    //this.formulario.get('ctrolHoraInicio')?.disable();
    //this.formulario.get('ctrolHoraFin')?.disable();

    //Setea Valores
    this.formulario.get('ctrolFecha')?.setValue(fechaFormateada);
    this.formulario.get('ctrolSupervisor')?.setValue(this.data.sNom_Usuario);
    // Asigna la hora al control
    this.formulario.get('ctrolHoraInicio')?.setValue(horaActual);    
  }

  formulario = this.formBuilder.group({
    ctrolFecha      :[''],
    ctrolSupervisor :[''],
    ctrolQR         :[''],
    ctrolArea       :[''],
    ctrolMaquina    :[''],
    ctrolObservacion:[''],
    ctrolPrioridad  :[''],
    ctrolParoMaquina:[''],
    ctrolFotografia :[''],
    ctrolHoraInicio :[''],
    ctrolHoraFin    :['']
  });  

  //METODOS O FUNCIONES
  onSave(){
    const qrValue = this.formulario.get('ctrolQR')?.value;
    const areaValue = this.formulario.get('ctrolArea')?.value;
    const maquinaValue = this.formulario.get('ctrolMaquina')?.value || '';
    const observacion = this.formulario.get('ctrolObservacion')?.value || '';
    const prioridad = this.formulario.get('ctrolPrioridad')?.value || '';
    const paroMaquina = this.formulario.get('ctrolParoMaquina')?.value;
    const hora_inicio = this.formulario.get('ctrolHoraInicio')?.value || '';
    const hora_fin = this.formulario.get('ctrolHoraFin')?.value || ''; 
    const nombreFile = (this.formulario.get('ctrolFotografia')?.value);

    if (!qrValue || qrValue.trim() === '') {
      this.matSnackBar.open('Debes escanear el código QR de la máquina antes de continuar con el proceso.', 'Cerrar', { duration: 3000 });
      this.inputQR.nativeElement.focus();
      return;
    } 

    if ((!areaValue || areaValue.trim() === '') || (!maquinaValue || maquinaValue.trim() === '')) {
      this.matSnackBar.open('Debes escanear un código QR valido, área y máquina vacios.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Validar observación
    // if (!observacion || observacion.trim() === '') {
    //   this.matSnackBar.open('⚠️ La observación es obligatoria.', 'Cerrar', { duration: 3000 });
    //   return;
    // }

    // Validar prioridad
    if (!prioridad || prioridad.trim() === '') {
      this.matSnackBar.open('Debes seleccionar la prioridad.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Validar paro máquina
    if (paroMaquina === null || paroMaquina === undefined || paroMaquina === '') {
      this.matSnackBar.open('Debes indicar si hay paro de máquina.', 'Cerrar', { duration: 3000 });
      return;
    }    


    Swal.fire({
      title: '¿Desea Registrar Solicitud de Mantenimiento?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const cod_Solicitud = '';
        const cod_Area = this.sCodArea;
        const cod_Maquina = this.sCodMaquina;

        const formData = new FormData();
        formData.append("sOpcion", "I");
        formData.append("sCod_Solicitud", " ");
        formData.append("sCod_Area", cod_Area);
        formData.append("sCod_Maquina", cod_Maquina);
        formData.append("sObservacion", observacion);
        formData.append("sPrioridad", prioridad);
        formData.append("sParo_Maquina", String(paroMaquina) );
        formData.append("sHora_Inicio", hora_inicio);
        formData.append("sUsu_Registro", this.data.sCod_Usuario);
        
        if (!this.selectedFile){
          formData.append("sRuta_Fotografia", "");
          formData.append("itm_Foto", null);
        }else {
          formData.append("sRuta_Fotografia", this.selectedFile.name);
          formData.append("itm_Foto", this.selectedFile);
        }

        console.log('onSave-data', formData);
        //return;

        /********************/
        //Solicitud de Mantenimiento
        /********************/
        /*
        let data: any = {
          "accion"            : "I" ,          
          "cod_Solicitud"     : ""  ,
          "cod_Area"          : cod_Area    ,
          "cod_Maquina"       : cod_Maquina ,
          "observacion"       : observacion ,
          "prioridad"         : prioridad   ,
          "paro_Maquina"      : String(paroMaquina) ,
          "ruta_Fotografia"   : ''          , //Falta verificar el nombre del archivo adjunto
          "hora_Inicio"       : hora_inicio ,
          "hora_Fin"          : hora_fin    ,
          "usu_Registro"      : this.data.sCod_Usuario
        };
        */
        //return;

        //GUARDAR
        this.SpinnerService.show();
        this.serviceSolicitudMnto.postProcesoMntoSolicitudMantenimiento(formData).subscribe({
            next: (response: any)=> {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });
                  this.dialogRef.close();

                }else if(response.codeResult == 201){
                  this.toastr.info(response.message, '', {
                    timeOut: 2500,
                  });
                }
                this.SpinnerService.hide();
              }else{
                this.toastr.error(response.message, 'Cerrar', {
                  timeOut: 2500,
                });
                this.SpinnerService.hide();
              }
            },
            error: (error) => {
              this.SpinnerService.hide();
              this.toastr.error(error.message, 'Cerrar', {
              timeOut: 2500,
              });
            }
          });        


      }
    })    

  }

  onScanQR(codigo: string, event: any){

    //event.preventDefault();   // ❌ evita que el Enter avance al siguiente control
    //event.stopPropagation();  // ❌ evita propagación al siguiente campo
    
    
    if (!codigo) return;


    //Obtiene el codigo QR
    const resultQR = codigo;
    const parts = resultQR
      .split(/\\+/)           // separa por '\' (regex) 
      .map(s => s.trim())     // quita espacios al inicio/fin
      .filter(s => s.length); // elimina elementos vacíos  

    //OBTENEMOS EL PRIMER ARRAY CON TODOS SUS VALORES
    const parte0 = parts[0]; // Por ejemplo: "?3Q1?&&&0000102&&&BDMP10_HCP2&&&"       
    
    if (parte0 && parte0.startsWith('?3Q1?')) {
      if (parte0 && parte0.length >= 14) {

        // Obtener desde el carácter 8 (índice 7), y tomar 7 caracteres EL CODIGOO DE MAQUINA
        const codigoExtraido = parte0.substring(8, 7 + 8);  
        this.formulario.get('ctrolQR')?.setValue(''); 

        //Obtenemos la descripción de la maquina
        this.SpinnerService.show();
        this.serviceSolicitudMnto.getObtieneInformacionMaquinas(codigoExtraido).subscribe(
          (result: any) => {
            if (result.totalElements > 0) {

              //Activa Input file
              this.isInfoCargada = true;
              this.formulario.get('ctrolQR')?.setValue(codigoExtraido); 

              this.formulario.get('ctrolArea')?.setValue(result.elements[0].nomb_Area_Tej_Mante_Maq);
              this.formulario.get('ctrolMaquina')?.setValue(result.elements[0].des_Maquina_Tejeduria);
              this.sCodArea = result.elements[0].cod_Area_Tej_Mante_Maq;
              this.sCodMaquina = result.elements[0].cod_Maquina_Tejeduria;

              this.SpinnerService.hide();
              setTimeout(() => this.inputObservacion?.nativeElement.focus(), 300);

            }
            else {

              this.SpinnerService.hide();
              this.isInfoCargada = false;
              //this.formulario.get('ctrolQR')?.setValue('');
              this.formulario.get('ctrolQR')?.reset();
              this.inputQR.nativeElement.focus();

              this.matSnackBar.open("No existe código scaneado..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.inputQR.nativeElement.focus();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))       
      }else {
        const sMessage = 'No contiene Codigo de Maquina';

        this.isInfoCargada = false;
        this.inputQR.nativeElement.focus();
        this.formulario.get('ctrolQR')?.reset();        

        this.matSnackBar.open(sMessage, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mi-snackbar-advertencia']
        });    
        
   

      }
    }else{
      const sMessage = 'Escanee un codigo Valido!';

      this.isInfoCargada = false;
      this.inputQR.nativeElement.focus();
      this.formulario.get('ctrolQR')?.reset();
      

      this.matSnackBar.open(sMessage, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mi-snackbar-advertencia']
      });        

    }    
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }  

  

}

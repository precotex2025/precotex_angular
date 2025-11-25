import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { DialogTiemposImproductivosService } from 'src/app/services/dialog-tiempos-improductivos.service';
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';
import * as _moment from 'moment';
import { GlobalVariable } from '../../../VarGlobals'; //<==== this one
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { SolicitudMantenimientoService } from 'src/app/services/SolicitudMantenimiento/solicitud-mantenimiento.service';
import { BrowserCodeReader } from '@zxing/browser';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface especialidad {
  Cod_Espe: string,
  Nomb_Espec: string,
}

interface area {
  Cod_Area_Tej_Mante_Maq: string,
  Nomb_Area_Tej_Mante_Maq: string,
}

interface maquinas {
  Codigo: string,
  Descripcion: string,
}

interface TAREA {
  Cod_Tarea: string,
  Nombre_Tarea: string,
  Flg_ValidaMaquina: string
}

interface articulo {
  Cod_Articulo: string,
  Desc_Articulo: string,
}

interface tipo_falla {
  Cod_Tarea: string,
  Cod_TipFall: string,
  Desc_TipFall: string,
}

interface tipo_atribuido {
  Cod_TipAtr: string,
  Desc_TipAtr: string,
}

interface condicion {
  Cod_Tej_Cond: string,
  Desc_Tej_Cond: string,
}

interface data {
  Title       : string;
  Accion      : string;
  sCod_Usuario: string;
  sNom_Usuario: string;
  sCod_Planta : string;
  sCod_Espe   : string;
  Datos       : any   ;
}

@Component({
  selector: 'app-dialog-solicitud-mnto-informe',
  templateUrl: './dialog-solicitud-mnto-informe.component.html',
  styleUrls: ['./dialog-solicitud-mnto-informe.component.scss']
})
export class DialogSolicitudMntoInformeComponent implements OnInit {
  @ViewChild('inputQR') inputQR!: ElementRef<HTMLInputElement>;
  constructor(
    private formBuilder : FormBuilder   ,
    private matSnackBar : MatSnackBar   ,
    private toastr      : ToastrService ,
    private dialog      : MatDialog     ,
    public dialogRef    : MatDialogRef<DialogSolicitudMntoInformeComponent>,
    private registromantemaquinastej: RegistroManteMaquinasTejService   ,
    private despachoTelaCrudaService: DialogTiemposImproductivosService ,  
    private serviceSolicitudMnto    : SolicitudMantenimientoService ,
    private SpinnerService          : NgxSpinnerService             ,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
  ) { }

  formulario = this.formBuilder.group({
    ctrolNroSolicitud: [''] ,
    ctrolEspecialidad: [''] ,
    ctrolDni         : [''] ,
    ctrolNombreTecnico: [''],
    ctrolArea       : ['']  ,
    ctrolMaquina    : ['']  ,
    ctrolTarea      : ['']  ,
    ctrolTipoFalla  : ['']  ,
    ctrolParoMaquina: []    ,
    ctrolCondicion  : ['']  ,
    ctrolArticulo   : ['']  ,
    ctrolFechaInicio: [new Date()],
    ctrolHoraInicio : ['00:00'],
    ctrolFechaFin   : [new Date()],
    ctrolHoraFin    : ['00:00'],
    ctrolAtribuido  : [''],
    ctrolJefeGrupo  : [''],
    ctrolDescripcionEvento    : [''],
    ctrolProcedimientoSolucion: [''],
    filtro  :[''],
    ctrolQR :[''],
    ctrolObservacion: [''],
  });  
  mostrarCtrolOtrasSedes: boolean = false; // Esta variable controlará la visibilidad

  listaEspecialidades:  especialidad[] = [];
  listaAreas      :  area[] = [];
  listaMaquinas   :  maquinas[] = [];
  listaTareas     :  TAREA [] = [];
  listarArticulo  :  articulo[] = [];
  listaFallas     :  tipo_falla[] = [];
  listaAtribuidos :  tipo_atribuido[] = [];
  listaCondiciones:  condicion[] = [];

  //Variables de Flag
  Flg_ValidaMaquina = "1";
  Flg_ShowBotonIniciar: boolean = false;
  Flg_ShowCtrolQR: Boolean = true;
  Flg_ShowBotonCerrarOT   : boolean = true;
  Flg_ShowBotonAprobarOT  : boolean = true;
  Flg_ShowBotonRechazarOT : boolean = true;
  Flg_ShowObservacionOT   : boolean = true;
  
  CodEstadoMant = ""; 
  CodNroSolicitud = ""; 

  selectedTipoFalla: any;
  filtro: string = '';
  tipoFallaFiltrada: any[] = []; // Lista filtrada  

  /*INICIO - CAMPOS A GUARDAR*/
  Cod_Accion    = ''
  Fec_Registro  = ''
  Cod_Maquina   = ''
  cod_tarea     = ''
  hini          = ''
  hfin          = ''
  Observacion   = ''
  Titulo        = ''
  Fec_Fin       = ''
  Fec_Inicio    = ''
  dni_tejedor   = ''
  Cod_OrdTra    =''
  Cod_TipOrdTra ="";
  xNum_Mante    = "";
  Cod_Tarea     ="";
  Cod_Espe      = "";
  Cod_Articulo  ="";
  Cod_Area_Tej_Mante_Maq = "";
  Cod_Tej_Cond  = "";
  Cod_ParMaq_Tej="";
  Cod_TipFall   = "";
  Observacion2  = "";
  Flg_Atribuido = "";
  Num_Planta    = "";  
  /*FIN - CAMPOS A GUARDAR*/

  sUsuario        = GlobalVariable.vusu;

  //Camara
  camaraActiva: boolean = false;  

ngOnInit(): void {
    console.log('this.data.Datos', this.data);
    var actual = new Date();
    var hora = _moment(actual.valueOf()).format('HH:mm');
    var weight = hora.split(':')   

    //Mostrar Datos de personal
    this.mostrarTejedor();    
    
    //ACtivamos los controles si no es planta 4
    if (Number(this.data.sCod_Planta) !== 4){
      //Aqui ocultamos los controles de
      this.mostrarCtrolOtrasSedes = true;
      this.formulario.get('ctrolArticulo')?.disable();
    }    

    //Setear Valores
    this.formulario.get('ctrolHoraInicio').setValue(weight[0]+':'+weight[1]);
    this.CodEstadoMant = this.data.Datos.cod_Estado_Mant;
    this.CodNroSolicitud = this.data.Datos.cod_Solicitud;

    //Controles Bloqueados
    this.formulario.get('ctrolFechaInicio').disable() ;
    this.formulario.get('ctrolHoraInicio').disable()  ;
    this.formulario.get('ctrolFechaFin').disable()    ;
    this.formulario.get('ctrolHoraFin').disable()     ;

    //this.Cod_Espe = this.listaEspecialidades[0].Cod_Espe;
    console.log('especialidad', this.data.sCod_Espe);
    console.log('sCod_Planta', this.data.sCod_Planta);
    
    //When estado REPORTADO
    if (this.data.Datos.cod_Estado_Mant === '01'){

        // 🔒 Deshabilita todos los controles
        this.formulario.disable();

        if (this.data.sCod_Espe !== '23'){
          // 🔓 Habilita solo el campo QR
          this.formulario.get('ctrolQR')?.enable();

          // 🎯 Da foco al control QR
          setTimeout(() => this.inputQR?.nativeElement.focus(), 300);
        }else {
          //Para las especialidades 15 Y 17 
          this.Flg_ShowCtrolQR = false;
        }
    }
    
    //When estado EN ATENCION
    if (this.data.Datos.cod_Estado_Mant === '02'){    
      if (this.data.sCod_Espe !== '23'){
        this.Flg_ShowCtrolQR = false;
      }else{
        this.formulario.disable();
        this.Flg_ShowCtrolQR = false;
        this.Flg_ShowBotonCerrarOT = false;
      }
    }

    //When estado PENDIENTE VB
    if (this.data.Datos.cod_Estado_Mant === '03' ){   
      // 🔒 Deshabilita todos los controles 
      this.formulario.disable();
      this.Flg_ShowCtrolQR = false;
      this.Flg_ShowObservacionOT = true;

      //const codigosPermitidos = ['23', '08', '14', '20'];
      //if (!codigosPermitidos.includes(this.data.sCod_Espe)) {     
       
      if (this.data.sCod_Espe !== '23'){      
        this.Flg_ShowObservacionOT = false;
        this.Flg_ShowBotonAprobarOT = false;
        this.Flg_ShowBotonRechazarOT = false;    
            
      }else{
        this.Flg_ShowObservacionOT = true;
        this.Flg_ShowBotonAprobarOT = true;
        this.Flg_ShowBotonRechazarOT = true;    
        // 🔓 Habilita solo el campo QR
        this.formulario.get('ctrolObservacion')?.enable();                     
      }
    }

    //When estado CERRRADO
    if (this.data.Datos.cod_Estado_Mant === '04'){   
      // 🔒 Deshabilita todos los controles 
      this.formulario.disable();
      this.Flg_ShowCtrolQR = false;
    }    


    //cargar Metodos por defecto
    this.CargarArea()         ;
    this.CargarTipoAtribuido();
    this.CargarCondicion()    ;

    //Setear valores de fomulario  
    this.setValoresFormulario(this.data);
  }

  setValoresFormulario(data: any){
    console.log('data.Datos',data.Datos);
    this.formulario.get('ctrolNroSolicitud')?.setValue(data.Datos.cod_Solicitud);
    //this.formulario.get('ctrolNombreTecnico')?.setValue(data.sNom_Usuario);
    this.formulario.get('ctrolParoMaquina')?.setValue(Number(data.Datos.paro_Maquina)); 
    console.log('Cargo todos los datods correctamente',data.Datos);
  }

  CargarEspecialidad(dni: string) 
  {

    this.registromantemaquinastej.ListarEspecialidad(dni).subscribe(
      (result: any) => {
        this.listaEspecialidades = result
        console.log('Lista de Expecialidades', this.listaEspecialidades);
        //Agregado por HMEDINA - 11/03/2025
        //this.Cod_Espe = this.listaEspecialidades[0].Cod_Espe;
        this.formulario.get('ctrolEspecialidad')?.setValue(this.listaEspecialidades[0].Cod_Espe);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CargarArea() {
    console.log('CargarArea planta', this.data.sCod_Planta);
    console.log('planta convertido', String(Number(this.data.Datos.num_Planta)))
    let iCodPlanta = Number(this.data.sCod_Planta);
    console.log('iCodPlanta', iCodPlanta);
    this.listaAreas = [];
    //this.registromantemaquinastej.ListarAreaBySede(String(Number(this.data.Datos.num_Planta))).subscribe({
    this.registromantemaquinastej.ListarAreaBySede(String(iCodPlanta)).subscribe({
      next: (result:any) => {
        if (result.length !== 0){
          this.listaAreas = result;
          console.log('Cargo listaAreas', this.listaAreas);
          this.formulario.get('ctrolArea')?.setValue( String(this.data.Datos.cod_Area));
          this.CargarMaquinas( String(this.data.Datos.cod_Area));
          this.CargarTareasSedes(String(this.data.Datos.cod_Area));
          
        }else{
          this.listaAreas = [];
          this.toastr.warning("No se configuro Areas para la Sede.", 'Cerrar', {
            timeOut: 2500,
            positionClass: 'toast-bottom-center'
             });             
        }
      },
      error: (err) => {
        console.error('Error al listar áreas:', err);
      }
    });  
  }

  CargarMaquinas(Cod_Tarea: string) {

    this.despachoTelaCrudaService.cargarMaquinas(Cod_Tarea).subscribe(
      (result: any) => {
        this.listaMaquinas = result;
        this.formulario.get('ctrolMaquina')?.setValue( String(this.data.Datos.cod_Maquina).trim());
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }  

  CargarTareasSedes(Cod_Tarea: string){

    this.listaTareas = [];
    this.registromantemaquinastej.ListarTareaByArea(String(this.data.Datos.num_Planta), Cod_Tarea).subscribe({

      next: (result:any) => {

        if (result){
          this.listaTareas = result;

          /*
            if (this.data.Opcion == 'MODIFICAR')
            {
              const tarea = this.listar_operacionTarea.find(t => t.Cod_Tarea === this.data.Cod_Tarea);
              this.Flg_ValidaMaquina = tarea.Flg_ValidaMaquina;
            }
          */

        }else{
          this.listaTareas = [];
          this.toastr.warning("No se configuro Areas para la Sede.", 'Cerrar', {
            timeOut: 2500,
            positionClass: 'toast-bottom-center'
             });             
        }
      },
      error: (err) => {
        console.error('Error al listar áreas:', err);
      }      
    });
  }

  CargarTipoFalla(Cod_Tarea: string, Flg_ValidaMaquina: string) {
    //Obtener el valor de flag de validar maquina (1 = "Valida", 0 = "no valida")
    this.Flg_ValidaMaquina = Flg_ValidaMaquina;
    
    //SI NO VALIDA MAQUINA DEBE DE LIMPIAR Y BLOQUEAR 

    //comentado no aplica porque estos datos ya trae desde que se registro la solicitud de maquina
    // if (this.Flg_ValidaMaquina == "0") {
    //   this.formulario.get('ctrolMaquina')?.setValue(''); 
    //   this.formulario.get('ctrolParoMaquina')?.setValue(''); 

    //   this.formulario.get('ctrolMaquina').disable();
    //   this.formulario.get('ctrolParoMaquina').disable();
    // } else {
    //   this.formulario.get('ctrolMaquina').enable();
    //   this.formulario.get('ctrolParoMaquina').enable();
    // }
    

    //Limpia articulo y (Min Max) - HMEDINA - 11/03/2025
    this.listarArticulo = [];
    //this.formulario.get('ct_MinMax')?.setValue('');
    //this.formulario.get('ct_Articulo')?.setValue('');
    //Hasta Aqui

    //Nuevo parametro
    const sCodArea : string = this.formulario.get('ctrolArea')?.value;
    
    this.registromantemaquinastej.ListarTipoFallaSede(String(this.data.Datos.num_Planta), sCodArea, Cod_Tarea).subscribe(
      (result: any) => {
        this.listaFallas = result;
        console.log("listaFallas", this.listaFallas);
        this.tipoFallaFiltrada = [...this.listaFallas]; 
        this.CargarArticulo(Cod_Tarea);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  filtrarTiposFalla() {
    //this.tipoFallaFiltrada = [];
    const filtroTexto = this.formulario.get('filtro')?.value?.toLowerCase();

    this.tipoFallaFiltrada = this.listaFallas.filter(item =>
      item.Desc_TipFall.toLowerCase().includes(filtroTexto)
    );
  }

  CargarArticulo(Cod_Tarea: string) {
    const sCodArea : string = this.formulario.get('ctrolArea')?.value;
    console.log("Codigo de tarea: ", Cod_Tarea);
    console.log("Planta: ", String(this.data.Datos.num_Planta));

    this.registromantemaquinastej.ListarArticuloSede(String(this.data.Datos.num_Planta), sCodArea, Cod_Tarea).subscribe(
      (result: any) => {
        this.listarArticulo = result
        console.log('this.listarArticulo', this.listarArticulo);
        //console.log("Codigo de tarea: "+Cod_Tarea);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }  

  CargarValoresMaquiTarea() {
    this.listaMaquinas  = [];
    this.listaTareas    = [];
    this.listarArticulo = [];
    this.listaFallas    = [];
    
    this.formulario.get('ctrolMaquina')?.setValue(''); 
    this.formulario.get('ctrolTarea')?.setValue(''); 
    this.formulario.get('ctrolArticulo')?.setValue(''); 
    this.formulario.get('ctrolTipoFalla')?.setValue(''); 

    const sCodArea : string = this.formulario.get('ctrolArea')?.value;
    this.CargarMaquinas(sCodArea);
    this.CargarTareasSedes(sCodArea);
  }  

  CargarTipoAtribuido(){
    this.listaAtribuidos = [
      { Cod_TipAtr: 'P', Desc_TipAtr: 'PRODUCCION' },
      { Cod_TipAtr: 'M', Desc_TipAtr: 'MANTENIMIENTO' },
      { Cod_TipAtr: 'S', Desc_TipAtr: 'SISTEMAS' }
    ];
    console.log('Cargo Atribuidos');
  }  

  CargarCondicion() {
    this.registromantemaquinastej.ListarCondicion().subscribe(
      (result: any) => {
        this.listaCondiciones = result
        console.log('Lista condiciones', this.listaCondiciones);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  mostrarTejedor() {

    //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
    let Cod_Trabajador=GlobalVariable.vcodtra;
    let Tip_Trabajador=GlobalVariable.vtiptra;
    //if (dni_tejedor.length===8) {
      this.registromantemaquinastej.traerTejedorTra(Cod_Trabajador, Tip_Trabajador).subscribe(
        (result: any) => {
          console.log('marca01', result);
           if (result[0].Respuesta == 'OK') {
            this.formulario.get('ctrolDni')?.setValue(result[0].Nro_DocIde); 
            this.formulario.get('ctrolNombreTecnico')?.setValue(result[0].Nombres);
           }
           this.CargarEspecialidad(String(result[0].Nro_DocIde));
         },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    //}
  }  

  onScanQR(codigo: string, event: any){

    //event.preventDefault();   // ❌ evita que el Enter avance al siguiente control
    //event.stopPropagation();  // ❌ evita propagación al siguiente campo
    //console.log('log.');

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

              const sCodMaquinaResult = String(result.elements[0].cod_Maquina_Tejeduria).trim();
              const sCodMaquinaOrigen = String(this.data.Datos.cod_Maquina).trim();

              if (sCodMaquinaResult !== sCodMaquinaOrigen){
                //Ocultamos el boton de inciar
                this.Flg_ShowBotonIniciar = false;  
                this.formulario.get('ctrolQR')?.setValue(''); 

                this.matSnackBar.open("¡Scanee maquina correcta!", 'Cerrar', {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 1500,
                });
                return;            
              } else {
                //Mostramos el boton de inciar
                this.Flg_ShowBotonIniciar = true;
              }
            }
            else {
              //Ocultamos el boton de inciar
              this.Flg_ShowBotonIniciar = false;    
              this.formulario.get('ctrolQR')?.setValue(''); 

              this.SpinnerService.hide();
              this.matSnackBar.open("No existe código scaneado..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))            

      } else {
        const sMessage = 'No contiene Codigo de Maquina';

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

  limpiaFiltro(){
    this.formulario.get('filtro')?.setValue(''); 
  }

  onIniciar():void{
    
    Swal.fire({
      title: '¿Desea Dar Inicio a la Atencion de la Solicitud ?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.onAvanzar(this.CodNroSolicitud, '', '');
    
        /********************/
        //Input's Para Avanzar Solicitud
        /********************/
        // const data: any = {
        //   cod_Usuario        : this.sUsuario,
        //   Cod_Solicitud      : this.CodNroSolicitud,
        //   Observaciones : ''
        // };
        // console.log('onSave-data', data);

        //GUARDAR
        // this.SpinnerService.show();
        // this.serviceSolicitudMnto.postAvanzaEstadoSolicitudMantenimiento(data).subscribe({
        //     next: (response: any)=> {
        //       if(response.success){
        //         if (response.codeResult == 200){
        //           this.toastr.success(response.message, '', {
        //             timeOut: 2500,
        //           });
        //           this.dialogRef.close();                          
        //         }else {
        //           this.toastr.info(response.message, '', {
        //             timeOut: 2500,
        //           });
        //         }
        //         this.SpinnerService.hide();
        //       }else{
        //         this.toastr.error(response.message, 'Cerrar', {
        //           timeOut: 2500,
        //         });
        //         this.SpinnerService.hide();
        //       }
        //     },
        //     error: (error) => {
        //       this.SpinnerService.hide();
        //       this.toastr.error(error.message, 'Cerrar', {
        //       timeOut: 2500,
        //       });
        //     }
        //   });         
      }
    })  
  }

  onCerrarOT():void{
    const codArea: string =  this.formulario.get('ctrolArea')?.value || null;
    const codTarea: string = this.formulario.get('ctrolTarea')?.value || null;
    const codMaq: string = this.formulario.get('ctrolMaquina')?.value || null;
    const paroMaq: string = this.formulario.get('ctrolParoMaquina')?.value;
    const sJefeGrupo: string = this.formulario.get('ctrolJefeGrupo')?.value || '';
    
    //const condicion: string = this.formulario.get('ct_Condicion')?.value || null;   

    console.log('paroMaq', paroMaq);
    console.log('codArea', codArea);
    console.log('codTarea', codTarea);
    console.log('codMaq', codMaq);

    if (codArea == null){
      this.matSnackBar.open("¡Importante seleccionar el area!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }     

    if (this.Flg_ValidaMaquina == '1' && codMaq == null){
      this.matSnackBar.open("¡Importante seleccionar maquina!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }     
    
    if (codTarea == null){
      this.matSnackBar.open("¡Importante seleccionar la tarea!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    } else {
      const codArticulo: string = this.formulario.get('ctrolArticulo')?.value || null;
      const codTipFalla: string = this.formulario.get('ctrolTipoFalla')?.value || null;

      //Valida si existe articulo a seleccionar
      //Solo cuando planta sea HUACHIPA 2
      if (Number(this.data.Datos.num_Planta) == 4){   

        if (this.listarArticulo.length > 0){
          if (codArticulo == null || codArticulo == ''){
            this.matSnackBar.open("¡Importante seleccionar el articulo!", 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
            return;
          }        
        }        
      }      

      //Valida si existe Tipo Falla a seleccionar
      if (this.listaFallas.length > 0){
        if (codTipFalla == null || codTipFalla == ''){
          this.matSnackBar.open("¡Importante seleccionar tipo falla!", 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
          return;
        }        
      }      

    }    
    
    if (this.Flg_ValidaMaquina == '1' && paroMaq == null){
      this.matSnackBar.open("¡Importante seleccionar paro maquina!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }      
    
    
    //if (Number(this.data.Num_Planta) !== 4){
    const Flg_Atribuido: string = this.formulario.get('ctrolAtribuido')?.value || null;
    if (Flg_Atribuido == null){
      this.matSnackBar.open("¡Importante seleccionar la Tipo Atribuido!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;        
    }    


    //Continua con el Registro de Informacion 
    this.Cod_Accion   = 'I'    
    this.Fec_Registro = this.formulario.get('ctrolFechaInicio')?.value;
    this.Cod_Maquina  = this.formulario.get('ctrolMaquina')?.value;
    this.Cod_Tarea    = this.formulario.get('ctrolTarea')?.value;
    this.Cod_OrdTra   = ' ';
    this.Fec_Inicio   = _moment(this.formulario.get('ctrolFechaInicio')?.value).format('DD/MM/YYYY');
    this.hini         = this.formulario.get('ctrolHoraInicio')?.value;
    this.Fec_Fin      = this.formulario.get('ctrolFechaFin')?.value;
    this.hfin         = this.formulario.get('ctrolHoraFin')?.value;
    this.Observacion  = this.formulario.get('ctrolDescripcionEvento')?.value;
    this.dni_tejedor  = this.formulario.get('ctrolDni')?.value;    

    //Nuevos Campos Requeridos 
    this.Cod_Espe               = this.formulario.get('ctrolEspecialidad')?.value;
    this.Cod_Articulo           = this.formulario.get('ctrolArticulo')?.value;
    this.Cod_Area_Tej_Mante_Maq = this.formulario.get('ctrolArea')?.value;
    this.Cod_Tej_Cond           = this.formulario.get('ctrolCondicion')?.value;
    this.Cod_ParMaq_Tej         = this.formulario.get('ctrolParoMaquina')?.value;
    this.Cod_TipFall            = this.formulario.get('ctrolTipoFalla')?.value || ' ';
    this.Flg_Atribuido          = this.formulario.get('ctrolAtribuido')?.value; //Obligatorio para todos   
    this.Num_Planta             = String(this.data.Datos.num_Planta);    
    
    //Se envia info cuando la planta no es nro 4
    if (Number(this.data.Datos.num_Planta) !== 4){
      this.Observacion2  = this.formulario.get('ctrolProcedimientoSolucion')?.value; 
    }else{
      this.Observacion2  = ' ';
    }

    //Cuestiona al Grabar
    Swal.fire({
      title: '¿Desea Registrar / Cerra la OT, Para La Solicitud?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        /*********************************************/
        //Registro de Tiempo Mantenimiento de Maquina
        /*********************************************/        
        let data: any = {

          "accion"      : "I",
          "num_Mante"   : 0,
          "cod_Maquina" : this.Cod_Maquina,
          "nro_DocIde"  : this.dni_tejedor,
          "cod_Tarea"   : this.Cod_Tarea  ,
          "cod_Ordtra"  : " ",
          "fec_Hora_Inicio" : this.hini,
          "fec_Hora_Fin"    : this.hfin,
          "obserMante"      : this.Observacion,
          "cod_Usuario"     : this.sUsuario,
          "cod_Espe"        : this.Cod_Espe,
          "cod_Articulo"    : this.Cod_Articulo,
          "cod_Area_Tej_Mante_Maq": this.Cod_Area_Tej_Mante_Maq,
          "cod_Tej_Cond"    : this.Cod_Tej_Cond,
          "cod_ParMaq_Tej"  : String(this.Cod_ParMaq_Tej),
          "cod_TipFall"     : this.Cod_TipFall,
          "obserMante2"     : this.Observacion2,
          "flg_Atribuido"   : this.Flg_Atribuido,
          "num_Planta"      : this.Num_Planta,
          "cod_Solicitud"   : this.data.Datos.cod_Solicitud,
          "datos_Lider"     : sJefeGrupo

        };    

        console.log('onSave-data', data);
        //return;
        //GUARDAR
        this.SpinnerService.show();
        this.serviceSolicitudMnto.postProcesoMntoTiempoManMquina(data).subscribe({
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

  onCancelar(){
    this.dialogRef.close();
  }

  onAvanzar(CodSolicitud:string, Observacion: string, sDatosLider: string){

    /********************/
    //Input's Para Avanzar Solicitud
    /********************/
    const data: any = {
      cod_Usuario     : this.sUsuario,
      Cod_Solicitud   : CodSolicitud,
      Observaciones   : Observacion,
      sDatosLider     : sDatosLider
    };

    //GUARDAR
    this.SpinnerService.show();
    this.serviceSolicitudMnto.postAvanzaEstadoSolicitudMantenimiento(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });
              this.dialogRef.close();                          
            }else {
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

  onAprobarVB() {
    let sObservacion = this.formulario.get('ctrolObservacion')?.value || '';

    //Cuestiona al Grabar, 
    Swal.fire({
      title             : '¿Desea Aprobar La Solicitud?, Confirme',
      icon              : 'question'  ,
      showCancelButton  : true        ,
      confirmButtonColor: '#3085d6' ,
      cancelButtonColor : '#d33'    ,
      confirmButtonText : 'Sí'        ,
      cancelButtonText  : 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        //Avanzamos 
        this.onAvanzar(this.CodNroSolicitud, sObservacion, '');
      }
    })  
  }

  onRechazarVB() {
    let sObservacion = this.formulario.get('ctrolObservacion')?.value || '';

    //Cuestiona al Grabar
    Swal.fire({
      title: '¿Desea Rechazar La Solicitud?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        //Avanzamos 
        this.onAvanzar(this.CodNroSolicitud, sObservacion, '');
      }
    })      
  }

  ActiveCameraScanQR(event: any): void {
    this.camaraActiva = true;
    BrowserCodeReader
      .listVideoInputDevices()
      .then(videoInputDevices => {
        // Buscar cámara trasera (usualmente contiene "back" o "environment")
        const backCamera = videoInputDevices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('environment')
        ) || videoInputDevices[0]; // fallback a la primera si no se encuentra

        if (!backCamera) {
          console.error('No se encontró cámara trasera');
          return;
        }

        const codeReader = new BrowserMultiFormatReader();
        const videoElement = document.querySelector('video');
        codeReader.decodeFromVideoDevice(backCamera.deviceId, videoElement, (result, error, controls) => {
          if (result) {
            //this.onScanQR(result.getText(), event); // tu función personalizada
            //console.log('Codigo QR', result.getText());
            const sCodigoScan = result.getText();
            this.onScanQR(sCodigoScan, null);

            controls.stop(); // detener escaneo después de leer
            this.camaraActiva = false;
          }
          if (error) {
            console.error(error);
          }          
        });
      })
      .catch(err => {
        console.error('Error al acceder a la cámara:', err);
    });
  }  

}

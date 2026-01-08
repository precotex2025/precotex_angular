import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogTiemposImproductivosService } from '../../services/dialog-tiempos-improductivos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalificacionRollosProcesoService } from '../../services/calificacion-rollos-proceso.service';
import { GlobalVariable } from '../../VarGlobals';
import { NgxSpinnerService } from 'ngx-spinner';
import { promise } from 'protractor';
import { MatTableDataSource } from '@angular/material/table';
import { Console } from 'node:console';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

interface datadet {
  Codigo      : string,
  Descripcion : string
  //Area  : string
}

interface maquinas {
  Codigo: string,
  Descripcion: string,
}

interface motivos {
  Codigo: string,
  Descripcion: string
}

@Component({
  selector: 'app-tiempos-improductivosv3',
  templateUrl: './tiempos-improductivosv3.component.html',
  styleUrls: ['./tiempos-improductivosv3.component.scss']
})
export class TiemposImproductivosv3Component implements OnInit {

range = new FormGroup({
  start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  end: new FormControl(new Date),
});    

dataInfoTiempoImproductivo: Array<any> = []; 
lstMaquinas:  maquinas[] = [];
lstMotivos: motivos[] = [];
sCod_Usuario = GlobalVariable.vusu;
selectedRow: any = null;
isCompact = true;

//Banderas para botones 
flgBtnHistorial = true;
flgBtnIniciar   = true;
flgBtnDetener   = true;
timerInterval: any;

//Datos para Insertar 
sCod_Accion    = '';
sFec_Registro  = '';
sCod_Maquina   = '';
sCod_Motivo    = '';
sHini          = '';
sHfin          = '';
sObservaciones = '';
sTitulo        = '';
sFec_Fin       = '';
sFec_Inicio    = '';
sDni_tejedor   = '';

bFlgTerminado = false;
sData: any;

  constructor(
    private formBuilder       : FormBuilder  ,
    private matSnackBar       : MatSnackBar  ,
    private SpinnerService    : NgxSpinnerService,
    private toastr            : ToastrService ,
    private datePipe          : DatePipe      ,
    private despachoTelaCrudaService          : DialogTiemposImproductivosService,
    private CalificacionRollosProcesoService  : CalificacionRollosProcesoService ,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {

      this.route.queryParams.subscribe(params => {
        const accion  = params['accion'] || 'I';
        const data    = params['codMaquina'] || '';

        console.log('Modo:', accion);
        console.log('Modelo recibido:', data);

        //Recibe parametros
        this.sCod_Accion = accion;
        this.sData = data;

        if (accion === 'U' && data) {
          //this.cargarModelo(data);
        }        
      });

      console.log('this.sCod_Accion', this.sCod_Accion);

      //Alguno controles deshabilitados
      this.formulario.get('codMotivo')?.disable();
      this.formulario.get('horaIni')?.setValue('00:00:00');
      this.formulario.get('horaFin')?.setValue('00:00:00');
      //this.datefecreg = new FormControl(new Date());
      
      //Activa el Spinner 
      this.SpinnerService.show();

      await Promise.all([
        this.CargarMaquinas() ,
        this.ObtenerDni()     ,
        this.CargarMotivos(),   
      ])
      .then(() => {
        this.SpinnerService.hide();
      })
      .catch(() => {
        this.SpinnerService.hide();
      });
    }

    displayedColumns: string[] = [
      'codigo' , 
      'descripcion'     
    ];
    dataSource: MatTableDataSource<datadet> = new MatTableDataSource();

    formulario = this.formBuilder.group({
      Fec_Registro:[''],
      Fec_Terminado:[''],
      datefecreg: [''],
      operador:   [''],
      dni:        ['', [Validators.required, Validators.maxLength(8)]],
      maquina:    ['', Validators.required],
      codMotivo:  [
                   '',
                    [
                      Validators.maxLength(2),
                      Validators.pattern(/^[0-9]*$/)  // SOLO números
                    ]
                  ],
      motivo:     [''],
      horaIni:    [''],
      horaFin:    [''],
      observacion:[''],
    });

//#region METODOS
  CargarMaquinas(): Promise<any> {
    return new Promise((resolve, reject)=>{
    this.despachoTelaCrudaService.mantenimientoConductorService().subscribe({
      next: (resp) =>{
       
        if (Array.isArray(resp)) {
          //this.lstMaquinas = resp;
          this.lstMaquinas = resp.map(item => ({ Codigo: item.Codigo.trim(), Descripcion: item.Descripcion }));
        }       
        
        if (this.sCod_Accion === 'U' && this.sData) {
          this.formulario.get('maquina')?.setValue(this.sData);
          this.onMaquinaSeleccionada();
        }          

        resolve(true);
      },
      error: (err) => reject(err)
      });
    });
  }

  ObtenerDni(): Promise<any> {
    return new Promise((resolve, reject)=>{

        this.CalificacionRollosProcesoService.obtenerDni(this.sCod_Usuario).subscribe({
          next: (resp) => {

            this.formulario.get('dni')?.setValue(resp.elements);
            const sDni = resp.elements;
            this.MostrarTejedor1(sDni);

            resolve(true);
          },
          error: (err) => reject(err)
        });

    
    });
   }  

  MostrarTejedor1(dni: string):Promise<any> {
    return new Promise((resolve, reject)=>{

      let dni_tejedor= dni;
      this.despachoTelaCrudaService.traerTejedor(dni_tejedor).subscribe({
        next: (resp) => {
          if (resp[0].Respuesta == 'OK') {
            this.formulario.get('operador')?.setValue(resp[0].Nombres);
          }
          resolve(true);
        },
        error: (err) => reject(err)
      });
    });
  }
  
  CargarMotivos():Promise<any> {
    return new Promise((resolve, reject) =>{
      this.despachoTelaCrudaService.listadoMotivosTiemposImproductivos().subscribe({
        next: (resp: any) => {
            this.lstMotivos = resp;
            this.dataSource.data = resp ;
            resolve(true);
        },
        error: (err) => reject(err)
      });
    });
  }

ActualizarHora(sTipo: string) {
  const ahora = new Date();

  const hora = String(ahora.getHours()).padStart(2, '0');
  const min  = String(ahora.getMinutes()).padStart(2, '0');
  const seg  = String(ahora.getSeconds()).padStart(2, '0');

  const horaCompleta = `${hora}:${min}:${seg}`;
  //const sFechaActual = String(new Date());
  const sFecActual       : string =  this.range.get('end').value;
  const fechaFormateada = this.datePipe.transform(sFecActual, 'dd/MM/yyyy');

  if (sTipo === 'INI')
  {
    this.formulario.get('horaIni')?.setValue(fechaFormateada + ' ' + horaCompleta);
    this.sHini = horaCompleta;
  }else {
    this.formulario.get('horaFin')?.setValue(fechaFormateada + ' ' + horaCompleta);
    this.sHfin = horaCompleta;
  }
}  

//#region EVENTOS
  onIniciar(){
    this.ActualizarHora('INI'); // Pone la hora inicial

    this.flgBtnIniciar = true;
    this.flgBtnDetener = false;

    // this.timerInterval = setInterval(() => {
    //   this.ActualizarHora();
    // }, 1000); // Actualiza cada 1 segundo    
  }
  onTerminar(){
    this.bFlgTerminado = true;
    
    this.flgBtnIniciar = true;
    this.flgBtnDetener = true;

    this.ActualizarHora('FIN')
    //const sFecTerminado = String(new Date());
    //this.formulario.get('Fec_Terminado')?.setValue(sFecTerminado);
    
  }
  onCancelar(){

    this.sCod_Accion = 'I'
    this.formulario.get('maquina')?.setValue('');
    this.formulario.get('codMotivo')?.setValue('');
    this.formulario.get('motivo')?.setValue('');
    this.formulario.get('codMotivo')?.disable();    

    this.bFlgTerminado = false;

    //Deshabilita 
    this.flgBtnIniciar = true;
    this.flgBtnDetener = true;
    
    this.formulario.get('horaIni')?.setValue('00:00:00');
    this.formulario.get('horaFin')?.setValue('00:00:00');    
    this.formulario.get('observacion')?.setValue('');
    
  }
  onRegistrar(){

    const sFechaActual = String(new Date());
    const sCodMaquina = String(this.formulario.get('maquina')?.value);
    const sCodMotivo = String(this.formulario.get('codMotivo')?.value);
    const sHoraIni = String(this.formulario.get('horaIni')?.value); 
    //const sHoraFin = String(this.formulario.get('horaFin')?.value); 
    const sObservaciones = String(this.formulario.get('observacion')?.value);
    const sDni = String(this.formulario.get('dni')?.value)    


    //Validación I
    if(this.sCod_Accion == 'I'){

      if (!sCodMaquina || sCodMaquina.trim() === '') {
          this.matSnackBar.open("¡Importante seleccionar Maquina!", 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });   
        return;
      }   

      if (!sCodMotivo || sCodMotivo.trim() === '') {
          this.matSnackBar.open("¡Importante seleccionar Motivo!", 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });   
        return;
      }     
      
      if (sHoraIni == '00:00:00'){
          this.matSnackBar.open("¡Importante registrar la hora de Inicio!", 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });   
        return;        
      }
    }



    //Validación U
    if(this.sCod_Accion == 'U' && !this.flgBtnDetener){
        this.matSnackBar.open("¡Importante registrar Hora Fin!", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });      

      return;
    }

    console.log('this.formulario.get(datefecreg)?.value', this.formulario.get('datefecreg')?.value);

    var sTituloVentana =  (this.sCod_Accion == 'I') ? "Registrar": "Actualizar"; 
    console.log('Accion Registrar', this.sCod_Accion);


    //Registrar Tiempo Improductivo
    Swal.fire({
      //title: ´¿Desea  Tiempo Improductivo?, Confirme´,
      title : `¿Desea ${sTituloVentana} Tiempo Improductivo?, Confirme`,
      icon  : 'question',
      showCancelButton    : true,
      confirmButtonColor  : '#3085d6',
      cancelButtonColor   : '#d33',
      confirmButtonText   : 'Sí',
      cancelButtonText    : 'No'
    }).then((result)=>{
      if (result.isConfirmed) {

        this.sFec_Registro  = sFechaActual;
        this.sCod_Maquina   = sCodMaquina;
        this.sCod_Motivo    = sCodMotivo;
        //this.sHini          = sHoraIni;
        //this.sHfin          = sHoraFin;
        this.sObservaciones = sObservaciones;
        this.sTitulo        = '';
        this.sFec_Fin       = this.bFlgTerminado === true?sFechaActual:"1900-01-01";
        this.sFec_Inicio    = sFechaActual;
        this.sDni_tejedor   = sDni;        
        

        //return;
        //PENDIENTE DE AGREGAR LA FUNCION DE INSERTAR 
        if (this.sCod_Accion == 'I'){
          console.log('sHini', this.sHini);
          console.log('sHfin', this.sHfin);
          this.despachoTelaCrudaService.ingresaTiempóimproductivo(this.sFec_Registro,
          this.sCod_Maquina,
          this.sCod_Motivo,
          this.sFec_Registro,
          this.sHini,
          this.sFec_Fin,
          this.sHfin,
          this.sObservaciones,
          this.sDni_tejedor).subscribe(
          (result: any) => {
            console.log(result);
            //this.dialog.closeAll();
            if (result[0]) {
              if (result[0].Respuesta == 'OK') {
                this.toastr.success('Proceso Ejecutado Correctamente!!', '', {
                  timeOut: 3000,
                });        
                this.onCancelar();      
                //this.dialog.closeAll();
              } else {
                this.toastr.info(result[0].Respuesta, '', {
                  timeOut: 3000,
                });              
              }
            } else {
              this.toastr.error('Error, No Se Pudo Registrar!!', 'Cerrar', {
                timeOut: 2500,
              });            
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

        }
        
        if (this.sCod_Accion == 'U'){
            
          this.despachoTelaCrudaService.modificaTiempóimproductivo(this.sFec_Registro,
            this.sCod_Maquina,
            this.sCod_Motivo,
            this.sFec_Registro,
            this.sHini,
            this.sFec_Fin,
            this.sHfin,
            this.sObservaciones,
            this.sDni_tejedor,
            this.sFec_Registro).subscribe(
            (result: any) => {
                this.toastr.success('Proceso Ejecutado Correctamente!!', '', {
                  timeOut: 3000,
                }); 
                this.onCancelar();   
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
        }

      }
    });   

  }
  onHistorial(){
    const sCodMaquina = String(this.formulario.get('maquina')?.value);
    this.router.navigate(['../TiemposImproductivos']
      // { queryParams: {
      //     codMaquina: sCodMaquina.trim()
      // }}
    )      

  }

  onRowClick(row: any) {
    this.selectedRow = row;

    const maquina = this.formulario.get('maquina')?.value;
    const horaInicio = this.formulario.get('horaIni')?.value;

    if(maquina){
      //Asigna valor a Texto
        if (horaInicio == "00:00:00"){
          const sCodMotivo = row.Codigo;
          const sMotivo    = row.Descripcion;
          this.formulario.get('codMotivo')?.setValue(sCodMotivo);
          this.formulario.get('motivo')?.setValue(sMotivo);
          this.formulario.get('codMotivo')?.enable();
          this.flgBtnIniciar = false;
        }
    }else{
      this.matSnackBar.open("Seleccione maquina a registrar..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }
  onCodigoChange() {
    const codigo = this.formulario.get('codMotivo')?.value;

    // Si está vacío, limpiar campos
    if (!codigo || codigo.trim() === '') {
      this.formulario.get('motivo')?.setValue('');
      this.formulario.get('horaIni')?.setValue('00:00:00');
      return;
    }

    // Buscar coincidencia exacta en la lista
    const data = this.lstMotivos.find(m => m.Codigo === codigo);    

    if (data) {
      this.flgBtnIniciar = false;
      this.formulario.get('codMotivo')?.setValue(data.Codigo);
      this.formulario.get('motivo')?.setValue(data.Descripcion);
    }else{
      this.flgBtnIniciar = true;
      this.formulario.get('motivo')?.setValue('');      
    }
  }  
  onMaquinaSeleccionada() {
    const maquina = this.formulario.get('maquina')?.value;

    if (maquina) {

      //Boton historial
      this.flgBtnHistorial = false;
      
      //Resetea flag Terminado
      this.bFlgTerminado = false;

      //Nueva Validacion en Caso ya cuenta con un Tiempo Improductivo pendiente de Cerrar
      this.dataInfoTiempoImproductivo = [];
      this.despachoTelaCrudaService.getObtieneTiempoImproductivoPendiente(maquina).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.totalElements > 0){    
              
              this.sCod_Accion = 'U';
              this.dataInfoTiempoImproductivo = response.elements;

              //Llena Informacion extraido
              const sFechaHoraIni = this.dataInfoTiempoImproductivo[0].fec_Hora_Inicio!; 
              const sCodMotivo = this.dataInfoTiempoImproductivo[0].cod_Motivo!;
              const sObservacion = this.dataInfoTiempoImproductivo[0].observacion!;
              const data = this.lstMotivos.find(m => m.Codigo === sCodMotivo);       
              const resultado = this.formatearFechaISO(sFechaHoraIni);

              //Habilita Deshabilita Botones
              this.flgBtnIniciar = true;
              this.flgBtnDetener = false;

              //Llena informacion 
              this.formulario.get('codMotivo')?.setValue(data.Codigo);
              this.formulario.get('motivo')?.setValue(data.Descripcion);
              this.formulario.get('horaIni')?.setValue(resultado);
              this.formulario.get('observacion')?.setValue(sObservacion);
              
              //console.log('this.dataInfoTiempoImproductivo', this.dataInfoTiempoImproductivo[0]);
            }else{
              this.sCod_Accion = 'I'
              this.dataInfoTiempoImproductivo = [];
              // Si escogió una máquina → habilitar

              //Habilita Deshabilita Botones
              this.flgBtnIniciar = true;
              this.flgBtnDetener = true;

              this.formulario.get('codMotivo')?.enable();
              this.formulario.get('codMotivo')?.setValue('');
              this.formulario.get('motivo')?.setValue('');                            
              this.formulario.get('horaIni')?.setValue('00:00:00');
              this.formulario.get('horaFin')?.setValue('00:00:00');
              this.formulario.get('observacion')?.setValue('');                  
            }
          }else{
            this.dataInfoTiempoImproductivo = [];
            this.SpinnerService.hide();
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          console.log(error.error.message, 'Cerrar', {
          timeOut: 2500,
          });
        }          
      });
    } else {
      this.flgBtnHistorial = true;
      // Si dejas máquina vacía → deshabilitar y limpiar
      this.formulario.get('codMotivo')?.reset();
      this.formulario.get('codMotivo')?.disable();
    }
  }

  formatearFechaISO(fechaISO: string): string {
    if (!fechaISO) return "";

    try {
      const [fechaPart, horaPart] = fechaISO.split("T");
      const [anio, mes, dia] = fechaPart.split("-");
      const [hh, mm, ss] = horaPart.split(":");

      return `${dia}/${mes}/${anio} ${hh}:${mm}:${ss}`;
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return fechaISO; // fallback
    }
  }

}

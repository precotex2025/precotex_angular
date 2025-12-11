import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DialogTiemposImproductivosService } from '../../services/dialog-tiempos-improductivos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalificacionRollosProcesoService } from '../../services/calificacion-rollos-proceso.service';
import { GlobalVariable } from '../../VarGlobals';
import { NgxSpinnerService } from 'ngx-spinner';
import { promise } from 'protractor';
import { MatTableDataSource } from '@angular/material/table';
import { Console } from 'node:console';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

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

lstMaquinas:  maquinas[] = [];
lstMotivos: motivos[] = [];
sCod_Usuario = GlobalVariable.vusu;
selectedRow: any = null;

//Banderas para botones 
flgBtnIniciar = true;
flgBtnDetener = true;
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
    private despachoTelaCrudaService          : DialogTiemposImproductivosService,
    private CalificacionRollosProcesoService  : CalificacionRollosProcesoService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {

      this.route.queryParams.subscribe(params => {
        const accion  = params['accion'] || 'I';
        const data    = params['model'] ? JSON.parse(params['model']) : null;

        console.log('Modo:', accion);
        console.log('Modelo recibido:', data);

        //Recibe parametros
        this.sCod_Accion = accion;
        this.sData = data;

        if (accion === 'U' && data) {
          //this.cargarModelo(data);
        }
      });

      //Alguno controles deshabilitados
      this.formulario.get('codMotivo')?.disable();
      this.formulario.get('horaIni')?.setValue('00:00');
      this.formulario.get('horaFin')?.setValue('00:00');
      //this.datefecreg = new FormControl(new Date());
      
      //Activa el Spinner 
      this.SpinnerService.show();

      await Promise.all([
        this.CargarMaquinas() ,
        this.ObtenerDni()     ,
        this.CargarMotivos()
        
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
          this.lstMaquinas = resp;
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

  if (sTipo === 'INI')
  {
    this.formulario.get('horaIni')?.setValue(horaCompleta);
  }else {
    this.formulario.get('horaFin')?.setValue(horaCompleta);
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
    const sFecTerminado = String(new Date());
    this.formulario.get('Fec_Terminado')?.setValue(sFecTerminado);
    
  }
  onCancelar(){
  }
  onRegistrar(){

    console.log('this.formulario.get(datefecreg)?.value', this.formulario.get('datefecreg')?.value);

    //Registrar Tiempo Improductivo
    Swal.fire({
      title: '¿Desea Registrar Tiempo Improductivo?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result)=>{
      if (result.isConfirmed) {

        const sFechaActual = String(new Date());
        const sCodMaquina = String(this.formulario.get('maquina')?.value);
        const sCodMotivo = String(this.formulario.get('codMotivo')?.value);
        const sHoraIni = String(this.formulario.get('horaIni')?.value); 
        const sHoraFin = String(this.formulario.get('horaFin')?.value); 
        const sObservaciones = String(this.formulario.get('observacion')?.value);
        const sDni = String(this.formulario.get('dni')?.value)

        this.sFec_Registro  = sFechaActual;
        this.sCod_Maquina   = sCodMaquina;
        this.sCod_Motivo    = sCodMotivo;
        this.sHini          = sHoraIni;
        this.sHfin          = sHoraFin;
        this.sObservaciones = sObservaciones;
        this.sTitulo        = '';
        this.sFec_Fin       = this.bFlgTerminado === true?sFechaActual:"";
        this.sFec_Inicio    = sFechaActual;
        this.sDni_tejedor   = sDni;        
        

        //return;
        //PENDIENTE DE AGREGAR LA FUNCION DE INSERTAR 
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
              this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', {
                duration: 3000,
              })
              //this.dialog.closeAll();
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                duration: 3000,
              })
            }
          } else {
            this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', {
              duration: 3000,
            })
          }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

      }
    });   

  }
  onHistorial(){
  }
  onRowClick(row: any) {
    this.selectedRow = row;

    const maquina = this.formulario.get('maquina')?.value;
    const horaInicio = this.formulario.get('horaIni')?.value;

    if(maquina){
      //Asigna valor a Texto
        if (horaInicio == "00:00"){
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
      this.formulario.get('horaIni')?.setValue('00:00');
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
      // Si escogió una máquina → habilitar
      this.formulario.get('codMotivo')?.enable();
    } else {
      // Si dejas máquina vacía → deshabilitar y limpiar
      this.formulario.get('codMotivo')?.reset();
      this.formulario.get('codMotivo')?.disable();
    }
  }


}

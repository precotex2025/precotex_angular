import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolicitudMntoCreateComponent } from './dialog-solicitud-mnto-create/dialog-solicitud-mnto-create.component';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SolicitudMantenimientoService } from 'src/app/services/SolicitudMantenimiento/solicitud-mantenimiento.service';
import { DialogSolicitudMntoInformeComponent } from './dialog-solicitud-mnto-informe/dialog-solicitud-mnto-informe.component';
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';
import { ToastrService } from 'ngx-toastr';
import { ExceljsService } from 'src/app/services/exceljs.service';

interface data_det {
  cod_Solicitud   : string,
  cod_Area        : string,
  area            : string,
  cod_Maquina     : string,
  maquina         : string,
  observacion     : string,
  paro_Maquina    : string,
  paro_Maquina_Descripcion: string,
  prioridad    : string,
  fec_Registro : string,
  hora_Inicio   : string,
  t1_Tiempo_Espera_Min  : string,
  cod_Usuario_Supervisor: string,
  supervisor  : string,
  estado      : string
}

export interface SolicitudMantenimiento {
  area: string;
  maquina: string;
  observacion: string;
  paroMaquina: boolean;
  prioridad: string;
  fecha: string;
  hora: string;
  tiempoTranscurrido: string;
  supervisor: string;
  estado: string;
  cod_Estado_Mant: string;
}

@Component({
  selector: 'app-solicitud-mantenimiento-maquina',
  templateUrl: './solicitud-mantenimiento-maquina.component.html',
  styleUrls: ['./solicitud-mantenimiento-maquina.component.scss']
})
export class SolicitudMantenimientoMaquinaComponent implements OnInit {

  displayedColumns: string[] = [
    'acciones'    ,
    'codigo'      ,
    'area'        , 
    'maquina'     , 
    'observacion' , 
    'paroMaquina' , 
    'prioridad'   ,
    'fecha'       , 
    'tiempoTranscurrido', 
    'supervisor', 
    'estado'    , 
  ];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  dataListadoSolicitudMatenimiento: Array<any> = []; 

  dataListadoExportar: Array<any> = []; 
  dataForExcel: any = [];
  dataSourceExcel: any = [];     

  constructor(
    private dialog            : MatDialog             ,
    private formBuilder       : FormBuilder           ,
    private serviceMemorandum : MemorandumGralService ,
    private serviceSolicitudMnto: SolicitudMantenimientoService, 
    private matSnackBar       : MatSnackBar           ,
    private SpinnerService    : NgxSpinnerService     ,
    private registromantemaquinastej: RegistroManteMaquinasTejService   ,
    private toastr            : ToastrService ,
    private exceljsService    : ExceljsService
  ) { }

  sCod_Trabajador = GlobalVariable.vcodtra;
  sTip_Trabajador = GlobalVariable.vtiptra;
  sUsuario        = GlobalVariable.vusu;

  sCod_Usuario = "";
  sNom_Usuario = "";
  sCod_Planta  = "";
  sCod_Espe    = "";

  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });      

  ngOnInit(): void {
    this.getInfoUsuarios();
    this.mostrarTejedor();
    this.ObtieneSedeByUser();
  }



  formulario = this.formBuilder.group({
    Num_Requerimiento: ['']
  });  

  Flg_ShowBotonNuevo   : boolean = true;

  //METODOS O FUNCIONES
  onGetSolicitudes(){

    const sFecIni       : string =  this.range.get('start').value ;
    const sFecFin       : string =  this.range.get('end').value   ;
    const sCod_Usuario  : string = GlobalVariable.vusu;    

    if (sFecIni == '' || sFecFin == ''){
      this.matSnackBar.open("Seleccione Rango de Fechas.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;                 
    }   
    
    this.SpinnerService.show();
    this.dataListadoSolicitudMatenimiento = [];   
    
    this.serviceSolicitudMnto.getObtieneInformacionSolicitudMantenimiento(sFecIni, sFecFin, sCod_Usuario).subscribe({
      next: (response: any)=> {
        
        if(response.success){
          if (response.totalElements > 0){
              console.log('Data Source Solicitud Mnto', response.elements);
              this.dataListadoSolicitudMatenimiento = response.elements;
              this.dataSource.data = this.dataListadoSolicitudMatenimiento;

              //Adicionalmente llenamos DataSource para el exportar .
              this.dataListadoExportar = response.elements;

              this.SpinnerService.hide();
          }
          else{
            this.dataListadoSolicitudMatenimiento = [];
            this.dataSource.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataListadoSolicitudMatenimiento = [];
          this.dataSource.data = [];
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
  } 
  
  onCreate(){
    let dialogRef = this.dialog.open(DialogSolicitudMntoCreateComponent,{
      width:'500px',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "Nuevo",
        Accion : "I",
        sCod_Usuario : this.sCod_Usuario,
        sNom_Usuario : this.sNom_Usuario,
        sCod_Planta  : this.sCod_Planta,
        Datos  : null
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.onGetSolicitudes()
    });
  }

  onExportar(){
    this.CreateExcel();
  }

  CreateExcel(){
    //this.SpinnerService.show();

    this.dataForExcel = [];
    this.dataSourceExcel = [];

    if (this.dataListadoExportar.length > 0) {

        this.dataListadoExportar.forEach((item: any) => {

          let fechaCreacion = this.formatearFechaValida(item.fec_Registro);
          let datos = {
            ['Solicitud']     : item.cod_Solicitud,
            ['Area']          : item.area         ,
            ['Maquina']       : item.maquina      ,
            ['Observación']   : item.observacion  ,
            ['Paro Maquina']  : item.paro_Maquina_Descripcion,
            ['Prioridad']     : item.prioridad     ,
            ['Fecha Hora']    : fechaCreacion      ,
            ['Tiempo']        : item.t1_Tiempo_Espera_Min_Des,
            ['Supervisor']    : item.supervisor    ,
            ['Estado']        : item.estado        ,
          };
          this.dataForExcel.push(datos);
      });


      if (this.dataForExcel.length > 0) {
        this.dataForExcel.forEach((row: any) => {
          this.dataSourceExcel.push(Object.values(row))
        })

        let reportData = {
          title: 'REPORTE DE SOLICITUD DE MANTENIMIENTO DE MAQUINA',
          data: this.dataSourceExcel,
          headers: Object.keys(this.dataForExcel[0])
        }

        this.exceljsService.exportExcelReporteMntoSolicitudes(reportData);
        
      } else {
        this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.SpinnerService.hide();
      }      



    } else {
      this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.SpinnerService.hide();
    } 

    this.SpinnerService.hide();    
  }

  getInfoUsuarios(){
    this.serviceMemorandum.getUsuario(this.sCod_Trabajador, this.sTip_Trabajador).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.sCod_Usuario = result.elements[0].cod_Usuario;
          this.sNom_Usuario = result.elements[0].nom_Usuario;
          //this.sCod_Planta  = result.elements[0].cod_Planta;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))        
  }  

  // onEditar(element: SolicitudMantenimiento) {
  //   this.dialog.open(DialogSolicitudMntoCreateComponent, {
  //     width: '450px',
  //     data: element
  //   });
  // }

  onInforme(element: SolicitudMantenimiento){

    //SOLO A LOS TECNICOS LES MUESTRA ESTE MENSAJE
    if (this.sCod_Espe != '23'){
        if (element.cod_Estado_Mant == '03' || element.cod_Estado_Mant == '04'){
          this.matSnackBar.open("La solicitud se encuentra en estado Pendiente de V.B (Supervisor) ó Cerrada..!!", 'Cerrar', 
            { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 });
            return;
        }
    }

    let dialogRef = this.dialog.open(DialogSolicitudMntoInformeComponent,{
      //width:'500px',
      width: '90vw',     // 90% del ancho del viewport
      height: '90vh',    // 90% del alto del viewport
      maxWidth: '95vw',  // evita que se corte en pantallas pequeñas

      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "Nuevo",
        Accion : "I"    ,
        sCod_Usuario : this.sCod_Usuario,
        sNom_Usuario : this.sNom_Usuario,
        sCod_Planta  : this.sCod_Planta,
        sCod_Espe    : this.sCod_Espe,
        Datos  : element
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.onGetSolicitudes()
    });
  }

  onVer(element: SolicitudMantenimiento){

  }

  mostrarTejedor() {

    //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
    let Cod_Trabajador=GlobalVariable.vcodtra;
    let Tip_Trabajador=GlobalVariable.vtiptra;
    //if (dni_tejedor.length===8) {
      console.log(Cod_Trabajador.length);
      this.registromantemaquinastej.traerTejedorTra(Cod_Trabajador, Tip_Trabajador).subscribe(
        (result: any) => {
          console.log(result);
           if (result[0].Respuesta == 'OK') {
            this.CargarEspecialidad(String(result[0].Nro_DocIde));
           }
         },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    //}
  }  

  CargarEspecialidad(dni: string) 
  {

    this.registromantemaquinastej.ListarEspecialidad(dni).subscribe(
      (result: any) => {
        this.sCod_Espe = result[0].Cod_Espe;

        //Alos tecnicos no se les muestra el boton nuevo
        if(this.sCod_Espe == '15' || this.sCod_Espe == '17'){
          this.Flg_ShowBotonNuevo = false;
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }  

  ObtieneSedeByUser(){

    this.SpinnerService.show();
    this.registromantemaquinastej.getListaUsuarioSedeByUser().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.sCod_Planta = response.elements[0].num_Planta;
            this.SpinnerService.hide();
          }
          else{
            //Deshabilita los botones
            this.toastr.warning("Usuario sin configuración de SEDE.", 'Cerrar', {
            timeOut: 2500,
             });            
             this.SpinnerService.hide();
          }
        }        
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }   
  
  //Adicionales
  formatearFechaValida(fecha: string): string {
    if (!fecha || fecha.startsWith('1900-01-01T00:00:00')) {
      return '';
    }

    const f = new Date(fecha);

    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    const anio = f.getFullYear();

    const horas = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }  
  
  getEstadoClass(estado: string): string {
  switch (estado.trim().toLowerCase()) {
    case '01':
      return 'estado-reportado';
    case '02':
      return 'estado-atencion';
    case '03':
      return 'estado-pendiente';
    case '04':
      return 'estado-cerrado';
    case '05':
      return 'estado-rechazado';
    default:
      return '';
    }
  }

  getPrioridadClass(prioridad: string): string {
    switch (prioridad?.trim()) {
      case 'Alta':
        return 'prioridad-alta';
      case 'Media':
        return 'prioridad-media';
      case 'Baja':
        return 'prioridad-baja';
      default:
        return '';
    }
  }  

  getParoMaquinaClass(valor: number): string {
    return valor === 1 ? 'paro-activo' : 'paro-inactivo';
  }

}

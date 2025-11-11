
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SolicitudMantenimientoService } from 'src/app/services/SolicitudMantenimiento/solicitud-mantenimiento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolicitudMntoInformeComponent } from '../dialog-solicitud-mnto-informe/dialog-solicitud-mnto-informe.component';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';
import { ToastrService } from 'ngx-toastr';


interface data_visor{
  cod_Solicitud: number,
  cod_Area: string,
  cod_Maquina: string,
  observacion: string,
  paro_Maquina: string,
  prioridad: string,
  fec_Registro: string,
  hora_Reporte: string,
  hora_Inicio: string,
  t1_Tiempo_Espera_Min: string,
  t2_Tiempo_Interv_Min: string,

  usu_Registro: string,
  cod_Usuario_Tecnico: string,
  ruta_Fotografia: string,
  cod_Estado_Mant: string,
  nombre_Estado: string,
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
}

@Component({
  selector: 'app-solicitud-mantenimiento-maquina-visor',
  templateUrl: './solicitud-mantenimiento-maquina-visor.component.html',
  styleUrls: ['./solicitud-mantenimiento-maquina-visor.component.scss']
})
export class SolicitudMantenimientoMaquinaVisorComponent implements OnInit {
  

  //RUTA -> SolicitudMantenimientoMaquinaVisor
  @ViewChild(MatSort) sort!: MatSort;  
  constructor(
    public solicitudService   : SolicitudMantenimientoService,
    private serviceMemorandum : MemorandumGralService,
    private SpinnerService : NgxSpinnerService,
    private exceljsService : ExceljsService   ,
    private dialog         : MatDialog        ,
    private matSnackBar    : MatSnackBar      ,
    private registromantemaquinastej: RegistroManteMaquinasTejService   ,
    private toastr      : ToastrService ,
  ) { }

  sCod_Trabajador = GlobalVariable.vcodtra;
  sTip_Trabajador = GlobalVariable.vtiptra;

  sCod_Usuario = "";
  sNom_Usuario = "";
  sCod_Planta  = "";
  sCod_Espe    = "";

  intervalId: any;

  ngOnInit(): void {
    
    this.getInfoUsuarios()  ;
    this.mostrarTejedor()   ;
    this.ObtieneSedeByUser();
    this.ObtenerDatosVisor();

    // 🔁 Refrescar cada 30 segundos (30000 ms)
    this.intervalId = setInterval(() => {
      console.log('🔄 Refrescando bandeja...');
      this.ObtenerDatosVisor();
    }, 30000);    

  }
  
  dataSource: MatTableDataSource<data_visor> = new MatTableDataSource();
  displayedColumns: string[] = [
    'cod_Solicitud' , 
    'cod_Area'      , 
    'cod_Maquina'   , 
    'tipo_tarea',     //Nuevo
    'tipo_falla',     //Nuevo
    //'observacion'   , 
    'paro_Maquina'  , 
    'prioridad'     ,
    'fec_Registro'  , 
    // 'hora_Reporte'  , 
    'hora_Inicio'   , 
    't1_Tiempo_Espera_Min_Des', 
    't2_Tiempo_Interv_Min_Des',
    't3_Tiempo_VB_Min_Des'    ,
    // 'usu_Registro', 
    //'cod_Usuario_Tecnico', 
    'des_Usuario_Tecnico' ,
    'ruta_Fotografia'     , 
    'nombre_Estado'       ,
    'atender'
  ];

  exportarExcel() {
    this.onExportarExcel();
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

  solicitudesLst = [];
  ObtenerDatosVisor(): void{
    this.SpinnerService.show();
    this.solicitudService.getObtieneInformacionSolicitudesVisor().subscribe({
      next: (response: any) => {
        if(response.success){
          this.solicitudesLst = response.elements.map((item: any) => ({
            ...item,
            paro_Maquina: item.paro_Maquina ? 'SI' : 'NO'
          }));
          this.dataSource.data = this.solicitudesLst;
          this.dataSource.sort = this.sort;
          this.SpinnerService.hide();

          // Ocultar la columna 'atender' si el perfil es 23
          if (this.sCod_Espe === "23") {
            this.displayedColumns = this.displayedColumns.filter(c => c !== 'atender');
          }            

        }else{
          this.solicitudesLst = [];
          this.dataSource.data = [];
          this.SpinnerService.hide();
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });
  }

  dataForExcel = [];
  solicitudesLstExcel = [];
  onExportarExcel() {
    this.dataForExcel = [];
    this.solicitudesLstExcel = [];
    this.SpinnerService.show();
  
    this.solicitudService.getObtieneInformacionSolicitudesVisor().subscribe({
      next: (response: any) => {
        
          this.solicitudesLstExcel = response.elements;
          
          this.dataForExcel = this.solicitudesLstExcel.map((item: any) => ({
            ['Id']          : item.cod_Solicitud,
            ['Area']        : item.area,
            ['Maquina']     : item.cod_Maquina,
            ['Observacion'] : item.observacion,
            ['Paro Maquina']: item.paro_Maquina?'SI':'NO',
            ['Prioridad']   : item.prioridad_Des ,
            ['Fecha Registro']: item.fec_Registro,
            ['Hora Reporte']: item.hora_Reporte,
            ['Hora Inicio'] : item.hora_Inicio,
            ['Tiempo T1 (Requerimiento)'] : item.t1_Tiempo_Espera_Min_Des,
            ['Tiempo T2 (Intervencion)']  : item.t2_Tiempo_Interv_Min_Des,
            ['Tiempo T3 (Validación)']    : item.t3_Tiempo_VB_Min_Des,
            ['Nombre Solicitante']  : item.supervisor,
            ['Nombre Tecnico']      : item.des_Usuario_Tecnico,
            ['Foto']: item.ruta_Fotografia,
            ['Estado']: item.nombre_Estado
          }));

          const reportData = {
            title: 'REPORTE SOLICITUD DE MANTENIMIENTO MAQUINAS',
            data: this.dataForExcel,
            headers: Object.keys(this.dataForExcel[0]),
            Num_Requerimiento: 0
          };
  
          this.exceljsService.exportExcel4(reportData);
  
        this.SpinnerService.hide();
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.error('Error al obtener datos:', error.error.message);
      }
    });
  }

  onInforme(element: SolicitudMantenimiento){

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
        sCod_Planta  : this.sCod_Planta ,
        sCod_Espe    : this.sCod_Espe   ,
        Datos        : element
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.ObtenerDatosVisor();
    });    

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


}

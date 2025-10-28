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
}

@Component({
  selector: 'app-solicitud-mantenimiento-maquina',
  templateUrl: './solicitud-mantenimiento-maquina.component.html',
  styleUrls: ['./solicitud-mantenimiento-maquina.component.scss']
})
export class SolicitudMantenimientoMaquinaComponent implements OnInit {

  displayedColumns: string[] = [
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
    'acciones'
  ];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  dataListadoSolicitudMatenimiento: Array<any> = []; 

  constructor(
    private dialog            : MatDialog             ,
    private formBuilder       : FormBuilder           ,
    private serviceMemorandum : MemorandumGralService ,
    private serviceSolicitudMnto: SolicitudMantenimientoService, 
    private matSnackBar       : MatSnackBar           ,
    private SpinnerService    : NgxSpinnerService     ,
  ) { }

  sCod_Trabajador = GlobalVariable.vcodtra;
  sTip_Trabajador = GlobalVariable.vtiptra;
  sUsuario        = GlobalVariable.vusu;

  sCod_Usuario = "";
  sNom_Usuario = "";
  sCod_Planta  = "";

  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });      

  ngOnInit(): void {
    this.getInfoUsuarios();
  }



  formulario = this.formBuilder.group({
    Num_Requerimiento: ['']
  });  


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

              this.dataListadoSolicitudMatenimiento = response.elements;
              this.dataSource.data = this.dataListadoSolicitudMatenimiento;

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
  }

  getInfoUsuarios(){
    this.serviceMemorandum.getUsuario(this.sCod_Trabajador, this.sTip_Trabajador).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.sCod_Usuario = result.elements[0].cod_Usuario;
          this.sNom_Usuario = result.elements[0].nom_Usuario;
          this.sCod_Planta  = result.elements[0].cod_Planta;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))        
  }  

  onEditar(element: SolicitudMantenimiento) {
    this.dialog.open(DialogSolicitudMntoCreateComponent, {
      width: '450px',
      data: element
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
        sCod_Planta  : this.sCod_Planta,
        Datos  : element
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.onGetSolicitudes()
    });
  }

  onVer(element: SolicitudMantenimiento){

  }

}

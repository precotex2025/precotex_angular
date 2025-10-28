
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SolicitudMantenimientoService } from 'src/app/services/SolicitudMantenimiento/solicitud-mantenimiento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExceljsService } from 'src/app/services/exceljs.service';


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

@Component({
  selector: 'app-solicitud-mantenimiento-maquina-visor',
  templateUrl: './solicitud-mantenimiento-maquina-visor.component.html',
  styleUrls: ['./solicitud-mantenimiento-maquina-visor.component.scss']
})
export class SolicitudMantenimientoMaquinaVisorComponent implements OnInit {
  

  //RUTA -> SolicitudMantenimientoMaquinaVisor
  @ViewChild(MatSort) sort!: MatSort;  
  constructor(
    public solicitudService: SolicitudMantenimientoService,
    private SpinnerService: NgxSpinnerService,
    private exceljsService: ExceljsService,
  ) { }

  ngOnInit(): void {
    this.ObtenerDatosVisor();
  }
  
  dataSource: MatTableDataSource<data_visor> = new MatTableDataSource();
  displayedColumns: string[] = [
    'cod_Solicitud', 
    'cod_Area', 
    'cod_Maquina', 
    'observacion', 
    'paro_Maquina', 
    'prioridad',
    'fec_Registro', 
    'hora_Reporte', 
    'hora_Inicio', 
    't1_Tiempo_Espera_Min', 
    't2_Tiempo_Interv_Min',
    'usu_Registro', 
    'cod_Usuario_Tecnico', 
    'ruta_Fotografia', 
    'nombre_Estado',
    'atender'
  ];


  exportarExcel() {
    this.onExportarExcel();
  }

  solicitudesLst = [];
  ObtenerDatosVisor(): void{
    this.SpinnerService.show();
    this.solicitudService.getObtieneInformacionSolicitudesVisor().subscribe({
      next: (response: any) => {
        console.log('ENTRA AL RESPONSE');
        if(response.success){
          console.log('ENTRA AL SUCCESS')
          console.log('los valores del response any son: ', response.elements);
          this.solicitudesLst = response.elements.map((item: any) => ({
            ...item,
            paro_Maquina: item.paro_Maquina ? 'Sí' : 'No'
          }));
          this.dataSource.data = this.solicitudesLst;
          this.dataSource.sort = this.sort;
          this.SpinnerService.hide();

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
            ['Id']: item.cod_Solicitud,
            ['Area']: item.cod_Area,
            ['Maquina']: item.cod_Maquina,
            ['Observacion']: item.observacion,
            ['Paro Maquina']: item.paro_Maquina ? 'Sí' : 'No',
            ['Prioridad']: item.prioridad,
            ['Fecha Registro']: item.fec_Registro,
            ['Hora Reporte']: item.hora_Reporte,
            ['Hora Inicio']: item.hora_Inicio,
            ['Tiempo T1 (Requerimiento)']: item.t1_Tiempo_Espera_Min,
            ['Tiempo T2 (Intervencion)']: item.t2_Tiempo_Interv_Min,
            ['Nombre Solicitante']: item.usu_Registro,
            ['Nombre Tecnico']: item.cod_Usuario_Tecnico,
            ['Foto']: item.ruta_Fotografia,
            ['Estado']: item.nombre_Estado
          }));

          const reportData = {
            title: 'REPORTE',
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


}

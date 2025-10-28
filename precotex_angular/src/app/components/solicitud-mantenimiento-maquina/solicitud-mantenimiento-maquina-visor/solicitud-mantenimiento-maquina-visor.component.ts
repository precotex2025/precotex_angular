
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SolicitudMantenimientoService } from 'src/app/services/SolicitudMantenimiento/solicitud-mantenimiento.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface data_visor{
  cod_Solicitud: number,
  cod_Area: string,
  cod_Maquina: string,
  observacion: string,
  paro_Maquina: boolean,
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
    private solicitudService: SolicitudMantenimientoService,
    private SpinnerService: NgxSpinnerService
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
    console.log('Exportar a Excel');
  }

  solicitudesLst = [];
  ObtenerDatosVisor(): void{
    this.SpinnerService.show();
    this.solicitudService.getObtieneInformacionSolicitudesVisor().subscribe({
      next: (response: any) => {
        console.log('ENTRA AL RESPONSE');
        if(response.success){
          console.log('ENTRA AL SUCCESS')
          if(response.elements > 0){
            console.log('los valores del response any son: ', response.elements);
            this.solicitudesLst = response.elements;
            this.dataSource.data = this.solicitudesLst;
            this.dataSource.sort = this.sort;
          }else{
            this.solicitudesLst = [];
            this.dataSource.data = [];
            this.SpinnerService.hide();
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


}

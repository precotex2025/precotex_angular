import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';
import { UbicacionesService } from 'src/app/services/tintoreria/ubicaciones.service';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-crear-agrupamiento',
  templateUrl: './crear-agrupamiento.component.html',
  styleUrls: ['./crear-agrupamiento.component.scss']
})
export class CrearAgrupamientoComponent implements OnInit {

  Cod_Almacen: string = 'Q2';
  operario: string = GlobalVariable.vusu;

  Fec_Creacion = new Date();
  Codigo_Barra_Grupo = '';

  displayedColumns: string[] = ['codigo_Barra_Grupo', 'cantidad_Bultos', 'capacidad_Maxima', 'estado_Descripcion'];
  columnLabels: { [key: string]: string } = {
    codigo_Barra_Grupo: 'Grupos',
    cantidad_Bultos: 'Bultos',
    capacidad_Maxima: 'Capacidad',
    estado_Descripcion: 'Estado'
  };
  dataSource = new MatTableDataSource<any>();

  constructor(
    private router: Router,
    private ubicacionesService: UbicacionesService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buscarAgrupamientos();
  }

  buscarAgrupamientos() {
    const sFecCreacion = _moment(this.Fec_Creacion).isValid() ? _moment(this.Fec_Creacion).format('MM/DD/YYYY') : '';

    this.spinnerService.show();
    this.ubicacionesService.getListaAgrupamientosDelDia(sFecCreacion, this.Codigo_Barra_Grupo).subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        if (response.success && response.totalElements > 0) {
          this.dataSource.data = response.elements;
        } else {
          this.dataSource.data = [];
          this.toastr.info('No existen agrupamientos para los filtros seleccionados', '', { timeOut: 2000 });
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        this.dataSource.data = [];
        this.toastr.error(error.error?.message || 'Error al consultar agrupamientos', '', { timeOut: 2500 });
      }
    });
  }

  crearGrupoNuevo() {
    this.router.navigate(['/DetalleAgrupamiento']);
  }

  abrirGrupo(row: any) {
    this.router.navigate(['/DetalleAgrupamiento'], {
      queryParams: {
        Id_Agrupamiento: row.id_Agrupamiento,
        Cod_Almacen: row.Cod_Almacen,
        Codigo_Barra_Grupo: row.codigo_Barra_Grupo
      }
    });
  }

  volverAUbicaciones() {
    this.router.navigate(['/Ubicaciones']);
  }

}

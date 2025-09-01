import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroCalidadTejeduriaService } from 'src/app/services/registro-calidad-tejeduria.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService }  from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusquedaRollosPartidaService } from 'src/app/services/busqueda-rollos-partida.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Auditor } from 'src/app/models/Auditor';
import { Restriccion } from 'src/app/models/Restriccion';
import { GlobalVariable } from '../../VarGlobals';
import { MatPaginator } from '@angular/material/paginator';
import { allowedNodeEnvironmentFlags } from 'process';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatCheckboxModule } from '@angular/material/checkbox';



interface data_det {
  Cliente: string,
  Cliente_tex: string,
  Cod_ordtra_manufactura: string,
  Cod_Color: string,
  Nombre_Color: string,
  Fec_Creacion: string,
  Orden_Compra: string,
  Observacion: string,
  Maquina: string,
  Partida_Cliente: string,
  Reproceso: string,
  Partida_Original: string,
  Guia: string,
  Cod_grupoTex: string,
  Opcion: string,
  Retencion: string,
  Rel_Bano_Litros: string,
  Rel_Bano_Kilos: string,
  Proveedor: string,
  Lote_Hilado: string,
  Nro_Partidas: string,
  Gots: string,

}


interface data_det_2 {
  Rollo: string,
  Tela: string,
  Comb: string,
  Talla: string,
  Kgs_Progr: string,
  Uni_Progr: string,
  Kgs_Asign: string,
  Uni_Asign: string,
  OT_Tejeduria: string,
  Tela_Comb: string,
  Talla_OT: string,
  Nombre_Tela: string,
  Kgs_Despachados: string,
  Uni_Despachados: string,
  Calidad: string,
  Fec_Produccion: string,
  Proveedor_Tej: string,
  Observaciones: string,
  Num_Secuencia_Tinto: string,
  Barra: string,
  Tejedor: string,
  Maquina_Tejeduria: string,
  Calidad_Auditada: string,
  Cod_Restriccion: string,
  Obs_Control_Calidad: string,
  Restriccion: string,
  Fallas_Tejeduria: string,
  Lote_Hilado: string,

}

@Component({
  selector: 'app-busqueda-rollos-partida',
  templateUrl: './busqueda-rollos-partida.component.html',
  styleUrls: ['./busqueda-rollos-partida.component.scss']
})
export class BusquedaRollosPartidaComponent implements OnInit {

  formulario = this.formBuilder.group({
    Ct_Partida:                ['']
  });

  displayedColumns_cab: string[] = 
  [
    'Cliente',
    'Cliente_tex',
    'Cod_ordtra_manufactura',
    'Cod_Color',
    'Nombre_Color',
    'Fec_Creacion',
    'Orden_Compra',
    'Observacion',
    'Maquina',
    'Partida_Cliente',
    'Reproceso',
    'Partida_Original',
    'Guia',
    'Cod_grupoTex',
    'Opcion',
    'Retencion',
    'Rel_Bano_Litros',
    'Rel_Bano_Kilos',
    'Proveedor',
    'Lote_Hilado',
    'Nro_Partidas',
    'Gots',
  ]

  displayedColumns_Det: string[] = 
  [
    'Rollo',
    'Tela',
    'Comb',
    'Talla',
    'Kgs_Progr',
    'Uni_Progr',
    'Kgs_Asign',
    'Uni_Asign',
    'OT_Tejeduria',
    'Tela_Comb',
    'Talla_OT',
    'Nombre_Tela',
    'Kgs_Despachados',
    'Uni_Despachados',
    'Calidad',
    'Fec_Produccion',
    'Proveedor_Tej',
    'Observaciones',
    'Num_Secuencia_Tinto',
    'Barra',
    'Tejedor',
    'Maquina_Tejeduria',
    'Calidad_Auditada',
    'Cod_Restriccion',
    'Obs_Control_Calidad',
    'Restriccion',
    'Fallas_Tejeduria',
    'Lote_Hilado',
  ]

  dataSource: MatTableDataSource<data_det>;
  dataSource_Det: MatTableDataSource<data_det_2>;

  @ViewChild('inpPartida') inputPartida!: ElementRef;

  constructor
  (
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar,   
    private dialog: MatDialog,
    private BusquedaRollosPartidaService : BusquedaRollosPartidaService,
    private router: Router
  ) 
    {
     this.dataSource = new MatTableDataSource();
     this.dataSource_Det = new MatTableDataSource();
    }


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  ngOnInit(): void {

   


  }

  ngAfterViewInit() {
    

    this.dataSource_Det.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };


    this.inputPartida.nativeElement.focus() // hace focus sobre "myInput"

  }


  showMostrarpartida() {
    this.BusquedaRollosPartidaService.showMostrarPartida(this.formulario.get('Ct_Partida')?.value).subscribe(
      (result: any) => {
        this.dataSource.data = result
        this.showMostrarpartidaRollos();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  
  showMostrarpartidaRollos() {
    this.BusquedaRollosPartidaService.showMostrarPartidaDetalle(this.formulario.get('Ct_Partida')?.value).subscribe(
      (result: any) => {
        this.dataSource_Det.data = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  Funcion_Cancelar(){
    this.router.navigate(['/']);
  }



}

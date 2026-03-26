import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesarConfirmacionModalComponent } from './procesar-confirmacion-modal/procesar-confirmacion-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimerapartidaService } from 'src/app/services/tintoreria/primerapartida.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-control-primera-partida',
  templateUrl: './control-primera-partida.component.html',
  styleUrls: ['./control-primera-partida.component.scss']
})
export class ControlPrimeraPartidaComponent implements OnInit {
  filaSeleccionada: any[] = [];
  filtro: string = '';
  displayedColumns: string[] = ['cliente', 'grupo', 'primeraPartida', 'codigoTela', 'descripcionTela', 'color', 'combo', 'talla',
                                'g1_Estado', 'g1_Responsable'  , 'g1_FechaHora'  ,
                                'g2_Estado', 'g2_Responsable'  , 'g2_FechaHora'  ,
                                'g3_Estado', 'g3_Inspeccionado', 'g3_Supervisado', 'g3_FechaHora', 'g3_Observacion',
                                'g4_Estado', 'g4_Responsable'  , 'g4_FechaHora'  , 'g4_Kgs'      , 'g4_Comentario' , 'g4_NuevaPartida',
                                'partidasAsociadas', 'kgs_Totales', 'primeraFechaEntrega'];  

  dataSource = new MatTableDataSource<any>();
  dataListadoPrimeraPartida: Array<any> = [];
  
  filtroControl = new FormControl('');
  range = new FormGroup({
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });      

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  constructor(
    private dialog              : MatDialog           ,
    private SpinnerService      : NgxSpinnerService     ,
    private servicioPrimeraPartida : PrimerapartidaService,
    private toastr              : ToastrService         ,
  ) { }

  ngOnInit(): void {
    this.onListado();


    // Suscribirse al cambio del input
    this.filtroControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value || '';
    });    
  }

  aplicarFiltro() {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  verDetalle(row: any) {
    console.log('Detalle:', row);
  }  

  seleccionarFila(row: any) {
    this.filaSeleccionada = row;
    console.log('Fila seleccionada:', row);
  }  

  onListado(){

    const sFecIni       : string =  this.range.get('start').value ;
    const sFecFin       : string =  this.range.get('end').value   ;

    this.SpinnerService.show();
    this.servicioPrimeraPartida.getListaPrimeraPartida(sFecIni, sFecFin).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            console.log('Total de elementos', response);
            this.dataSource.data = response.elements;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;            
            this.SpinnerService.hide();
          }
          else{
            this.dataSource.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataSource.data = [];
        }
      },  
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
          });
      }          
    });     

/*
this.dataSource = new MatTableDataSource<any>
([
    { cliente: 'Cliente A', grupo: 'Orden 001', primeraPartida: 'N8585', codigoTela: 'JE003280', descripcionTela: 'JERSEY  30/1 X 2 NE 240 - 0 GRM ALG 100% CLAROS', color: 'NEGRO 190303 TPX', combo: '',
      g1_Estado: 'Aprobado',  g1_Responsable: 'FMEJIA', g1_FechaHora: '22/02/2026',
      g2_Estado: 'Aprobado',  g2_Responsable: 'FMONTEJO', g2_FechaHora: '23/03/2026',
      g3_Estado: 'Aprobado',  g3_Inspeccionado: 'FMEJIA', g3_Supervisado: 'HMEDINA', g3_FechaHora: '22/02/2026', g3_Observacion:'Luha por tus sueños pe',
      g4_Estado: 'Rechazado', g4_Responsable: 'CRAMIREZ', g4_FechaHora: '23/03/2026', g4_Kgs: '25.36', g4_Comentario: 'Prueba de Sistemas numero 1', g4_NuevaPartida: 'N5858',
      partidasAsociadas: 'N8585, N9696, N8595, N9696, N8784, M6595', kgs_Totales: '25.63', primeraFechaEntrega: '01/01/2026'
     },

    { cliente: 'Cliente B', grupo: 'Orden 001', primeraPartida: 'N8585', codigoTela: 'T001', descripcionTela: 'Algodón', color: 'Rojo', combo: '',
      g1_Estado: 'Aprobado',  g1_Responsable: 'FMEJIA', g1_FechaHora: '22/02/2026',
      g2_Estado: 'Aprobado',  g2_Responsable: 'FMONTEJO', g2_FechaHora: '23/03/2026',
      g3_Estado: 'Aprobado',  g3_Inspeccionado: 'FMEJIA', g3_Supervisado: 'HMEDINA', g3_FechaHora: '22/02/2026', g3_Observacion:'Luha por tus sueños pe',
      g4_Estado: 'Rechazado', g4_Responsable: 'CRAMIREZ', g4_FechaHora: '23/03/2026', g4_Kgs: '25.36', g4_Comentario: 'Prueba de Sistemas numero 2', g4_NuevaPartida: 'N5858',
      partidasAsociadas: 'N8585, N9696, N8595, N9696, N8784, M6595', kgs_Totales: '25.63', primeraFechaEntrega: '01/01/2026'
     },

    { cliente: 'Cliente C', grupo: 'Orden 001', primeraPartida: 'N8585', codigoTela: 'T001', descripcionTela: 'Algodón', color: 'Rojo', combo: '',
      g1_Estado: 'Aprobado',  g1_Responsable: 'FMEJIA', g1_FechaHora: '22/02/2026',
      g2_Estado: 'Aprobado',  g2_Responsable: 'FMONTEJO', g2_FechaHora: '23/03/2026',
      g3_Estado: 'Aprobado',  g3_Inspeccionado: 'FMEJIA', g3_Supervisado: 'HMEDINA', g3_FechaHora: '22/02/2026', g3_Observacion:'Luha por tus sueños pe',
      g4_Estado: 'Rechazado', g4_Responsable: 'CRAMIREZ', g4_FechaHora: '23/03/2026', g4_Kgs: '25.36', g4_Comentario: 'Prueba de Sistemas  numero 3', g4_NuevaPartida: 'N5858',
      partidasAsociadas: 'N8585, N9696, N8595, N9696, N8784, M6595', kgs_Totales: '25.63', primeraFechaEntrega: '01/01/2026'
     },

    { cliente: 'Cliente D', grupo: 'Orden 001', primeraPartida: 'N8585', codigoTela: 'JE003280', descripcionTela: 'JERSEY  30/1 X 2 NE 240 - 0 GRM ALG 100% CLAROS', color: 'NEGRO 190303 TPX', combo: '',
      g1_Estado: 'Aprobado',  g1_Responsable: 'FMEJIA', g1_FechaHora: '22/02/2026',
      g2_Estado: 'Aprobado',  g2_Responsable: 'FMONTEJO', g2_FechaHora: '23/03/2026',
      g3_Estado: 'Aprobado',  g3_Inspeccionado: 'FMEJIA', g3_Supervisado: 'HMEDINA', g3_FechaHora: '22/02/2026', g3_Observacion:'Luha por tus sueños pe',
      g4_Estado: 'Rechazado', g4_Responsable: 'CRAMIREZ', g4_FechaHora: '23/03/2026', g4_Kgs: '25.36', g4_Comentario: 'Prueba de Sistemas numero 1', g4_NuevaPartida: 'N5858',
      partidasAsociadas: 'N8585, N9696, N8595, N9696, N8784, M6595', kgs_Totales: '25.63', primeraFechaEntrega: '01/01/2026'
     },    
     
    { cliente: 'Cliente E', grupo: 'Orden 001', primeraPartida: 'N8585', codigoTela: 'JE003280', descripcionTela: 'JERSEY  30/1 X 2 NE 240 - 0 GRM ALG 100% CLAROS', color: 'NEGRO 190303 TPX', combo: '',
      g1_Estado: 'Aprobado',  g1_Responsable: 'FMEJIA', g1_FechaHora: '22/02/2026',
      g2_Estado: 'Aprobado',  g2_Responsable: 'FMONTEJO', g2_FechaHora: '23/03/2026',
      g3_Estado: 'Aprobado',  g3_Inspeccionado: 'FMEJIA', g3_Supervisado: 'HMEDINA', g3_FechaHora: '22/02/2026', g3_Observacion:'Luha por tus sueños pe',
      g4_Estado: 'Rechazado', g4_Responsable: 'CRAMIREZ', g4_FechaHora: '23/03/2026', g4_Kgs: '25.36', g4_Comentario: 'Prueba de Sistemas numero 1', g4_NuevaPartida: 'N5858',
      partidasAsociadas: 'N8585, N9696, N8595, N9696, N8784, M6595', kgs_Totales: '25.63', primeraFechaEntrega: '01/01/2026'
     },     

    { cliente: 'Cliente F', grupo: 'Orden 001', primeraPartida: 'N8585', codigoTela: 'JE003280', descripcionTela: 'JERSEY  30/1 X 2 NE 240 - 0 GRM ALG 100% CLAROS', color: 'NEGRO 190303 TPX', combo: '',
      g1_Estado: 'Aprobado',  g1_Responsable: 'FMEJIA', g1_FechaHora: '22/02/2026',
      g2_Estado: 'Aprobado',  g2_Responsable: 'FMONTEJO', g2_FechaHora: '23/03/2026',
      g3_Estado: 'Aprobado',  g3_Inspeccionado: 'FMEJIA', g3_Supervisado: 'HMEDINA', g3_FechaHora: '22/02/2026', g3_Observacion:'Luha por tus sueños pe',
      g4_Estado: 'Rechazado', g4_Responsable: 'CRAMIREZ', g4_FechaHora: '23/03/2026', g4_Kgs: '25.36', g4_Comentario: 'Prueba de Sistemas numero 1', g4_NuevaPartida: 'N5858',
      partidasAsociadas: 'N8585, N9696, N8595, N9696, N8784, M6595', kgs_Totales: '25.63', primeraFechaEntrega: '01/01/2026'
     },   
     
    { cliente: 'Cliente G', grupo: 'Orden 001', primeraPartida: 'N8585', codigoTela: 'JE003280', descripcionTela: 'JERSEY  30/1 X 2 NE 240 - 0 GRM ALG 100% CLAROS', color: 'NEGRO 190303 TPX', combo: '',
      g1_Estado: 'Aprobado',  g1_Responsable: 'FMEJIA', g1_FechaHora: '22/02/2026',
      g2_Estado: 'Aprobado',  g2_Responsable: 'FMONTEJO', g2_FechaHora: '23/03/2026',
      g3_Estado: 'Aprobado',  g3_Inspeccionado: 'FMEJIA', g3_Supervisado: 'HMEDINA', g3_FechaHora: '22/02/2026', g3_Observacion:'Luha por tus sueños pe',
      g4_Estado: 'Rechazado', g4_Responsable: 'CRAMIREZ', g4_FechaHora: '23/03/2026', g4_Kgs: '25.36', g4_Comentario: 'Prueba de Sistemas numero 1', g4_NuevaPartida: 'N5858',
      partidasAsociadas: 'N8585, N9696, N8595, N9696, N8784, M6595', kgs_Totales: '25.63', primeraFechaEntrega: '01/01/2026'
     },        

  ]);   
  */  
    
  }

  onProcesar(){

    const sPrimeraPartida = this.filaSeleccionada["primeraPartida"] || '';
    const sEstadoEvaluacion = this.filaSeleccionada["g4_Estado"] || '';

    if(sEstadoEvaluacion === "APROBADO"){
      this.toastr.info('El registro seleccionado ya fue Evaluado', '', {
        timeOut: 2500,
      });      
      this.filaSeleccionada = [];
      return;
    }

    if (sPrimeraPartida!)
    {
      let dialogRef = this.dialog.open(ProcesarConfirmacionModalComponent, {
      width: '30vw',   // viewport width
      height: '90vh',  // viewport height
      maxWidth: '100vw',
      maxHeight: '100vh',
        disableClose: true,
        panelClass: 'my-class',
        data: {
          Title  : "Procesar - 1RA(Partida) - " + this.filaSeleccionada["primeraPartida"],
          SubTitle : "Tela: " + this.filaSeleccionada["codigoTela"], 
          Accion : "U",
          Datos  : this.filaSeleccionada
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        //this.filaSeleccionada = [];
        this.onListado();
      });    
    }  else {
      this.toastr.info('Seleccione un registro para Evaluar', '', {
        timeOut: 2500,
      });
    }

  }

  onBuscar(){
    this.onListado();
  }

  onExportar(){
    
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'APROBADO':
        return 'estado-aaprobado';
      case 'RECHAZADO':
        return 'estado-rechazado';
      case 'DESAPROBADO':
        return 'estado-rechazado';        
      default:
        return '';
    }
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }  


}

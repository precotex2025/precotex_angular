import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-status-req-almacen',
  templateUrl: './status-req-almacen.component.html',
  styleUrls: ['./status-req-almacen.component.scss']
})
export class StatusReqAlmacenComponent implements OnInit {

  filtroDepartamento = ''; 
  filtroEstado = ''; 
  departamentos = ['SISTEMAS', 'LOGISTICA', 'MANTENIMIENTO'];  

  displayedColumns: string[] = [ 'estado', 'responsable', 'usuario', 'numero', 'fecha', 'item', 
                                 'cantidad', 'stock', 'flgReqCompra', 'flgEnviado', 'flgAprobacion', 
                                 'estadoLogistica', 'aprobacionLogistica', 'fechaIngreso', 'flgIngresoAlmacen', 'flgEntregadoMante'  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();  

  
  constructor() { }

  ngOnInit(): void {

   this.dataSource = new MatTableDataSource([ { estado: '🔴', 
                                                responsable: 'Pedro Abad / Victor Sanchez', 
                                                usuario: 'SISTEMAS', 
                                                numero: 1, 
                                                fecha: new Date('2026-01-13'), 
                                                item: 'ITEM 1', 
                                                cantidad: 2, 
                                                stock: false,
                                                flgReqCompra:   'SI', 
                                                flgEnviado:     'NO', 
                                                flgAprobacion:  'NO',
                                                estadoLogistica: 'Sin OC',
                                                aprobacionLogistica: '2/3',
                                                fechaIngreso: new Date('2026-01-13'),
                                                flgIngresoAlmacen: true,
                                                flgEntregadoMante: '🔴'
                                              }, 
{
  estado: '🔴', 
                                                responsable: 'Pedro Abad / Victor Sanchez', 
                                                usuario: 'SISTEMAS', 
                                                numero: 1, 
                                                fecha: new Date('2026-01-13'), 
                                                item: 'ITEM 1', 
                                                cantidad: 2, 
                                                stock: false,
                                                flgReqCompra:   'SI', 
                                                flgEnviado:     'NO', 
                                                flgAprobacion:  'NO',
                                                estadoLogistica: 'Sin OC',
                                                aprobacionLogistica: '2/3',
                                                fechaIngreso: new Date('2026-01-13'),
                                                flgIngresoAlmacen: true,
                                                flgEntregadoMante: '🔴'
                                              },
                                              
{
  estado: '🔴', 
                                                responsable: 'Pedro Abad / Victor Sanchez', 
                                                usuario: 'SISTEMAS', 
                                                
                                                numero: 1, 
                                                fecha: new Date('2026-01-13'), 
                                                item: 'ITEM 1', 
                                                cantidad: 2, 
                                                stock: false,
                                                flgReqCompra:   'SI', 
                                                flgEnviado:     'NO', 
                                                flgAprobacion:  'NO',
                                                estadoLogistica: 'Sin OC',
                                                aprobacionLogistica: '2/3',
                                                fechaIngreso: new Date('2026-01-13'),
                                                flgIngresoAlmacen: true,
                                                flgEntregadoMante: '🔴'
                                              },                                              
                                            
                                            ]);

  }

  verDetalle(item: any){

  }

}

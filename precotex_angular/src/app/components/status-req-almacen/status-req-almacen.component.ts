import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistroQuejasReclamosService } from 'src/app/services/quejas-reclamos.service';
import { VisoresGeneralesService } from 'src/app/services/visores/visores-generales.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-status-req-almacen',
  templateUrl: './status-req-almacen.component.html',
  styleUrls: ['./status-req-almacen.component.scss']
})
export class StatusReqAlmacenComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //filtroDepartamento = ''; 
  //filtroEstado = ''; 
  departamentos = ['SISTEMAS', 'LOGISTICA', 'MANTENIMIENTO'];  

  displayedColumns: string[] = [ 'estado', 'responsable', 'usuario', 'numero', 'fecha', 'item', 
                                 'cantidad', 'stock', 'flgReqCompra', 'flgEnviado', 'flgAprobacion', 
                                 'estadoLogistica', 'aprobacionLogistica', 'fechaIngreso', 'flgIngresoAlmacen', 'flgEntregadoMante'  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();  
  dataListadoStatus: Array<any> = []; 

  formulario = this.formBuilder.group({
    ctrolEstado:         [''],
    txtGenerales:        [''],
  });  

  constructor(
    private formBuilder            : FormBuilder       ,
    private visoresGeneralesService: VisoresGeneralesService  ,
    private SpinnerService         : NgxSpinnerService ,
  
  ) { }

  ngOnInit(): void {
    const Estado: string = this.formulario.get('ctrolEstado')?.value || '';
    this.verDetalle('*');

    this.formulario.get('txtGenerales')!.valueChanges
      .subscribe(valor => {
        this.dataSource.filter = valor.trim().toLowerCase();
    });    
  }

  onEstadoSeleccionado(object: any){
    this.verDetalle(object);
  }

  verDetalle(sEstado: string){
    //Captura Estado
    this.SpinnerService.show();
    this.dataListadoStatus = [];
    this.visoresGeneralesService.getEstatusRequerimientoAlmacen(sEstado).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataListadoStatus = response.elements;
              console.log('Listado de Status, Logistico', response.elements);
              this.dataSource.data        = this.dataListadoStatus;
              this.dataSource.paginator   = this.paginator;
              this.SpinnerService.hide();
          }
          else{
            this.dataListadoStatus = [];
            this.dataSource.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataListadoStatus = [];
          this.dataSource.data = [];
        }
      },  
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }        
    })
  }

  getColor(estado: string): string {
    switch (estado) {
      case 'A': return '#FBC02D';   // 🟡
      case 'G': return '#616161';     // ⚪
      case 'R': return '#D32F2F';      // 🔴
      case 'V': return '#388E3C';    // 🟢
      default:  return 'black';    // por defecto
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado.trim()) {
      case 'Rechazado':
        return 'estado-CI-rechazado';
      case 'Sin Aprobación':
        return 'estado-cerrado';
      case 'Aprobado':
        return 'estado-CI-aprobado ';               
      default:
        return '';
    
    }
  }

  getReqCompraClass(valor: string): string {
    return valor === "SI" ? 'paro-activo' : 'paro-inactivo';
  }
  

}

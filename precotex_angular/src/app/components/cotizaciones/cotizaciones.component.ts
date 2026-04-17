import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CotizacionesService } from 'src/app/services/cotizaciones/cotizaciones.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Console } from 'console';
import { MatSort } from '@angular/material/sort';

interface Costeo {
    unidadNegocio: string;
    tipo: string;
    cliente: string;
    codigoTela: string;
    idRuta: string;
    color: string;

    materiales: {
      codigoHilo: string;
      descripcion: string;
      porcentaje: number;
      precioKg: number;
      subtotal: number;
    }[];

    procesos: {
      nombre: string;
      receta?: string;
      proceso?: string;
      factor: number;
      costoKg: number;
      ajuste?: number;
      cotizacion: number;
    }[];

    precioMateriales: number;
    precioMaterialesAjustado: number;
    merma: number;
    costoSinUtilidad: number;
    utilidadPorcentaje: number;
    utilidadValor: number;
    gastosPorcentaje: number;
    gastosValor: number;
    total: number;
    totalAjustado: number;
    precioFinalCliente: number;
    rentabilidad: number;
  }

//   interface Proceso {
//   proceso: string;
//   factor: number;
//   costoKg: number;
//   totalTeorico: number;
//   totalComercial: number;
//   ajuste: number;
//   cotizacion: number;
// }

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  
//////////////////////////////////////////////////////////////////////

  unidadNegocio = '';
  tipo = '';
  cliente = '';
  codigoTela = '';
  descripcionTela = '';
  //rutaSeleccionada = '';
  codigoRutaTela = '';
  RutaXCodTela: {codigo: string, nombre: string}[] = [];
  RutaXCodTelaDetalle = [];
  codigoColor = '';
  descripcionColor = '';
  centroCosto: {codigo: number, nombre: string}[] = [];
  
  constructor(
    private SpinnerService: NgxSpinnerService,
    private service: CotizacionesService,
    private toastr: ToastrService,
    private formBuilder           : FormBuilder         ,
  ){}

  //dataSource: MatTableDataSource<Proceso> = new MatTableDataSource();

  dataSource = new MatTableDataSource<any>();
  dataSourceFooter = new MatTableDataSource<any>();

  dataSource_VT = new MatTableDataSource<any>();
  dataSourceFooter_VT = new MatTableDataSource<any>();

  dataSource_Servicio = new MatTableDataSource<any>();
  dataSourceFooter_Servicio = new MatTableDataSource<any>();  

  dataSource_VT_Estampado = new MatTableDataSource<any>();
  dataSourceFooter_VT_Estampado = new MatTableDataSource<any>();  

  dataSource_VT_Servicio = new MatTableDataSource<any>();
  dataSourceFooter_VT_Servicio = new MatTableDataSource<any>();  

  unidades = ['Textil', 'Confección', 'Exportación'];
  tipos = ['Regular', 'Urgente', 'Muestra'];
  clientes = ['Cliente A', 'Cliente B', 'Cliente C'];
  codigosTela = ['TELA001', 'TELA002', 'TELA003'];
  rutas = ['Ruta 1', 'Ruta 2', 'Ruta 3'];
  expandedRows: Set<string> = new Set(); // usamos el pro_Hover como clave

  displayedColumns: string[] = [
    'hover',
    'descripcion',
    'factor',
    'cosKg',
    'total',
    'totalComercial',
    'ajuste',
    'cotizacion'
  ];

  displayedColumnsFooter: string[] = [
    'hover',
    'descripcion',
    'factor',
    'cosKg',
    'total',
    'totalComercial',
    'ajuste',
    'cotizacion'
  ];

  displayedColumns_SV_Estampado: string[] = [
    'hover',
    'descripcion',
    'factor',
    'cosKg',
    'totalComercial',    
    'total',
    'ajuste',
    'cotizacion'
  ];

  formulario = this.formBuilder.group({
    unidadNegocio   :[''],
    tipo            :[''],
    cliente         :[''],
    codigoTela      :[''],
    descripcionTela :[''],
    codigoRutaTela  :['']
  });  

  //procesos: Proceso[] = [];

  ngOnInit(): void {
    // this.getRutaXCodTela('JE003177');
    // this.getRutaXCodTelaDetalle('JE003177', '01');
    this.getListaCentroCosto();
  }
  
  toggleExpand(row: any) {
    if (row.isParent) {
      if (this.expandedRows.has(row.pro_Hover)) {
        this.expandedRows.delete(row.pro_Hover); // colapsar
      } else {
        this.expandedRows.add(row.pro_Hover); // expandir
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////

  buscarDescripcionTela() { 
    //console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    const sCodTela = this.formulario.get('codigoTela')?.value! || '';

    if (sCodTela) { 
      this.service.getListaTelas(sCodTela).subscribe({
        next: (response: any) => {
          if (response.success){
            if (response.totalElements > 0){
              //this.descripcionTela = response.elements[0].des_Tela;
              this.formulario.get('descripcionTela')?.setValue(response.elements[0].des_Tela); 
              console.log('------', this.descripcionTela);
              if (this.descripcionTela != null || this.descripcionTela != ''){
                this.getRutaXCodTela(sCodTela);
              }
            }
          }
        },
        error: (error: any) => {
          this.toastr.error(error.message, 'Cerrar', {
            timeOut: 2500
          });
          this.SpinnerService.hide();
        }
      });
      
    } 
  }

  mostrarRutaDetalle(rutaSeleccionada: any): void {
    console.log('objeto:', rutaSeleccionada)
    this.codigoRutaTela = rutaSeleccionada;
    //this.codigoRutaTela = rutaSeleccionada;
    // this.getRutaXCodTelaDetalle(this.codigoTela, rutaSeleccionada);
    this.getListarProcesosExportacion(Number(this.unidadNegocio));
    //this.getListarProcesosExportacionFooter(1);
  }




  getRutaXCodTela(Cod_Tela: string): void {
    this.SpinnerService.show();
    this.service.getRutaXCodTela(Cod_Tela).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.RutaXCodTela = response.elements.map((r: any) => ({
              codigo: r.cod_Ruta,
              nombre: r.descripcion
            }));
          }
        }
        this.SpinnerService.hide();
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500
        });
        this.SpinnerService.hide();
      }
    });
  }


  // getRutaXCodTelaDetalle(Cod_Tela: string, Cod_Ruta: string): void {
  //   this.SpinnerService.show();
  //   this.service.getRutaXCodTelaDetalle(Cod_Tela, Cod_Ruta).subscribe({
  //     next: (response: any) => {
  //       if(response.success){
  //         if (response.totalElements > 0){
  //           console.log('DETALLE RUTAS: --', response.elements);
  //           this.RutaXCodTelaDetalle = response.elements;
  //           this.dataSource.data = response.elements;
  //           this.dataSource.sort = this.sort;
  //         }
  //       }
  //       this.SpinnerService.hide();
  //     },
  //     error: (error: any) => {
  //       this.toastr.error(error.message, 'Cerrar', {
  //         timeOut: 2500
  //       });
  //       this.SpinnerService.hide();
  //     }
  //   });
  // }


  recalcular(row: any) {
    if (row.pro_Aju == null || row.pro_Aju === 0) {
      row.pro_Cotizacion = row.pro_Tot;
    } else {
      row.pro_Cotizacion = row.pro_Aju;
    }
  }


  getListaCentroCosto(): void {
    this.service.getListaCentroCosto().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.centroCosto = response.elements.map((c: any) => ({
              codigo: c.cen_Cos_Cod,
              nombre: c.cen_Cos_Des
            }));
          }
        }
      },
      error: (error: any) => {}
    });
  }

  getListarProcesosExportacion(Pro_Cen_Cos: number): void {
    this.SpinnerService.show();
    this.service.getListarProcesosExportacion(Pro_Cen_Cos).subscribe({
      next: (response: any) => {
        if (response.success && response.totalElements > 0) {
          const planos = response.elements;
          console.log(':::::::::::::::::::::::::::::::::::.', planos);
          const planosConFlags = planos.map((p: any) => {
            if (!p.pro_Hover.includes('.')) {
              p.isParent = true;
              p.isChild = false;
              p.tieneHijos = planos.some(x => x.pro_Hover.startsWith(p.pro_Hover + '.'));
            } else {
              p.isChild = true;
              p.isParent = false;
              p.padreKey = p.pro_Hover.split('.')[0];
            }
            return p;
          });

          if(Pro_Cen_Cos === 1){
            this.dataSource.data = planosConFlags;
            this.dataSource.sort = this.sort;
          }else if(Pro_Cen_Cos === 2){
            this.dataSource_VT.data = planosConFlags;
            this.dataSource_VT.sort = this.sort;
          }else if(Pro_Cen_Cos === 3){
            this.dataSource_Servicio.data = planosConFlags;
            this.dataSource_Servicio.sort = this.sort;
          }else if(Pro_Cen_Cos === 4){
            this.dataSource_VT_Estampado.data = planosConFlags;
            this.dataSource_VT_Estampado.sort = this.sort;
          }else if(Pro_Cen_Cos === 5){
            this.dataSource_VT_Servicio.data = planosConFlags;
            this.dataSource_VT_Servicio.sort = this.sort;
          }

        }
        this.SpinnerService.hide();
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
        this.SpinnerService.hide();
      }
    });
  }  

  chgUnidadNegocio(){
    this.codigoRutaTela = '';
    this.formulario.get('tipo')?.setValue(''); 
    this.formulario.get('cliente')?.setValue(''); 
    this.formulario.get('codigoTela')?.setValue(''); 
    this.formulario.get('descripcionTela')?.setValue(''); 
    this.formulario.get('codigoRutaTela')?.setValue(''); 
    this.unidadNegocio = this.formulario.get('unidadNegocio')?.value! || '';

  }
}

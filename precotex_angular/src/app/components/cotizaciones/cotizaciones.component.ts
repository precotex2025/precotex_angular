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

  interface Proceso {
  proceso: string;
  factor: number;
  costoKg: number;
  totalTeorico: number;
  totalComercial: number;
  ajuste: number;
  cotizacion: number;
}

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
  RutaXCodTela = [];
  RutaXCodTelaDetalle = [];
  codigoColor = '';
  descripcionColor = '';

  constructor(
    private SpinnerService: NgxSpinnerService,
    private service: CotizacionesService,
    private toastr: ToastrService
  ){}

  dataSource: MatTableDataSource<Proceso> = new MatTableDataSource();
  unidades = ['Textil', 'Confección', 'Exportación'];
  tipos = ['Regular', 'Urgente', 'Muestra'];
  clientes = ['Cliente A', 'Cliente B', 'Cliente C'];
  codigosTela = ['TELA001', 'TELA002', 'TELA003'];
  rutas = ['Ruta 1', 'Ruta 2', 'Ruta 3'];

  displayedColumns: string[] = [
    'proceso',
    'factor',
    'costoKg',
    'totalTeorico',
    'totalComercial',
    'ajuste',
    'cotizacion'
  ];

  procesos: Proceso[] = [];

  ngOnInit(): void {
    // this.getRutaXCodTela('JE003177');
    // this.getRutaXCodTelaDetalle('JE003177', '01');
  }

  // actualizarRuta() {
  //   // Aquí simulas datos según la ruta seleccionada
  //   if (this.rutaSeleccionada === 'Ruta 1') {
  //     this.procesos = [
  //       { factor: 1, costoKg: 0.58, totalTeorico: 0.58, totalComercial: 0.58, ajuste: 0, cotizacion: 0 },
  //       { factor: 1, costoKg: 1.20, totalTeorico: 1.20, totalComercial: 1.20, ajuste: 0, cotizacion: 0 }
  //     ];
  //   } else if (this.rutaSeleccionada === 'Ruta 2') {
  //     this.procesos = [
  //       { factor: 1, costoKg: 0.15, totalTeorico: 0.15, totalComercial: 0.15, ajuste: 0, cotizacion: 0 }
  //     ];
  //   } else {
  //     this.procesos = [];
  //   }
  // }








  ///////////////////////////////////////////////////////////////////////////


  buscarDescripcionTela() { 
    console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    if (this.codigoTela) { 
      this.service.getListaTelas(this.codigoTela).subscribe({
        next: (response: any) => {
          if (response.success){
            if (response.totalElements > 0){
              this.descripcionTela = response.elements[0].des_Tela;
              console.log('------', this.descripcionTela);
              if (this.descripcionTela != null || this.descripcionTela != ''){
                this.getRutaXCodTela(this.codigoTela);
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

  mostrarRutaDetalle(rutaSeleccionada: string): void {
    this.codigoRutaTela = rutaSeleccionada;
    this.getRutaXCodTelaDetalle(this.codigoTela, rutaSeleccionada);
  }




  getRutaXCodTela(Cod_Tela: string): void {
    this.SpinnerService.show();
    this.service.getRutaXCodTela(Cod_Tela).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.RutaXCodTela = response.elements;
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


  getRutaXCodTelaDetalle(Cod_Tela: string, Cod_Ruta: string): void {
    this.SpinnerService.show();
    this.service.getRutaXCodTelaDetalle(Cod_Tela, Cod_Ruta).subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            console.log('DETALLE RUTAS: --', response.elements);
            this.RutaXCodTelaDetalle = response.elements;
            this.dataSource.data = response.elements;
            this.dataSource.sort = this.sort;
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


  recalcular(proceso: any) {
    if (proceso.ajuste && proceso.ajuste !== 0) {
      proceso.cotizacion = proceso.ajuste;
    } else {
      proceso.cotizacion = proceso.totalComercial;
    }
  }


  
}

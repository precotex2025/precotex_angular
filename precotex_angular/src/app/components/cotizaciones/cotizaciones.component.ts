import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CotizacionesService } from 'src/app/services/cotizaciones/cotizaciones.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

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


@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit {

  


  form: FormGroup;

  // Columnas para tablas
  displayedColumnsMateriales = ['codigoHilo','descripcion','porcentaje','precioKg','subtotal'];
  displayedColumnsProcesos = ['codigo','nombre','factor','costoKg','total','ajuste','cotizacion'];

  constructor(
    public fb: FormBuilder,
    private SpinnerService: NgxSpinnerService,
    private cotizacionesService: CotizacionesService
  ) {
    this.form = this.fb.group({
      // Datos generales
      unidadNegocio: ['EXPORTACIÓN'],
      tipo: ['VENTA DE TELA ACABADA - EXPORTACIÓN'],
      cliente: ['NCS BRANDS SAS'],
      codigoTela: [''],
      idRuta: [''],
      color: [''],

      // Materiales
      materiales: this.fb.array([
        this.fb.group({ codigoHilo: 'APT501PEINA', descripcion: 'Algodón Pima 501/Peinado NA 100', porcentaje: 0.3, precioKg: 8.02, subtotal: 7.46 }),
        this.fb.group({ codigoHilo: 'SPT020FINA', descripcion: 'Pandex 20 Denier Filamento NA 100', porcentaje: 0.07, precioKg: 19.90, subtotal: 1.39 }),
      ]),

      procesos: this.fb.array([]),
      // Procesos (código jerárquico: 1 principal, 1.1 submenú, etc.)
      // procesos: this.fb.array([
      //   this.fb.group({ codigo: '1', nombre: 'HILADO', factor: 1, costoKg: 8.85, total: 8.85, ajuste: null, cotizacion: 8.85 }),
      //   this.fb.group({ codigo: '2', nombre: 'TEÑIDO', factor: 1, costoKg: 2.80, total: 2.80, ajuste: 2.80, cotizacion: 2.80 }),
      //   this.fb.group({ codigo: '2.1', nombre: 'Receta teñido', factor: 1, costoKg: 0.70, total: 0.70 }),
      //   this.fb.group({ codigo: '2.2', nombre: 'Proceso teñido', factor: 9, costoKg: 0.15, total: 1.35 }),
      //   this.fb.group({ codigo: '3', nombre: 'RAMA', factor: 1, costoKg: 0.50, total: 1.50, ajuste: 0.40, cotizacion: 0.40 }),
      //   this.fb.group({ codigo: '3.1', nombre: 'Receta acabado', factor: 1, costoKg: 0.50, total: 0.50 }),
      //   this.fb.group({ codigo: '3.2', nombre: 'Proceso rama', factor: 2, costoKg: 0.50, total: 1.00 }),
      //   this.fb.group({ codigo: '4', nombre: 'CAUCHO', factor: 1, costoKg: 0.50, total: 0.50, ajuste: 0.40, cotizacion: 0.40 }),
      //   this.fb.group({ codigo: '5', nombre: 'ESMERILADO' }),
      //   this.fb.group({ codigo: '6', nombre: 'PERCHADO' }),
      // ]),

      // Resumen
      precioMateriales: [13.80],
      precioMaterialesAjustado: [13.35],
      mermaPorcentaje: [10],
      mermaValor: [1.38],
      mermaValorAjustado: [1.34],
      costoSinUtilidad: [15.18],
      costoSinUtilidadAjustado: [14.69],
      utilidadPorcentaje: [10],
      utilidadValor: [1.52],
      utilidadValorAjustado: [1.47],
      gastosPorcentaje: [2],
      gastosValor: [0.30],
      gastosValorAjustado: [0.29],
      total: [17.00],
      totalAjustado: [16.45],
      precioFinalCliente: [17.50],
      rentabilidad: [13]
    });
  }

  // Getters
  get materiales(): FormArray {
    return this.form.get('materiales') as FormArray;
  }
  get procesos(): FormArray {
    return this.form.get('procesos') as FormArray;
  }

  // Acciones materiales
  addMaterial(): void {
    this.materiales.push(this.fb.group({
      codigoHilo: '',
      descripcion: '',
      porcentaje: 0,
      precioKg: 0,
      subtotal: 0
    }));
  }
  removeMaterial(index: number): void {
    this.materiales.removeAt(index);
  }

  // Acciones procesos
  addProceso(): void {
    this.procesos.push(this.fb.group({
      codigo: '',
      nombre: '',
      factor: 1,
      costoKg: 0,
      total: 0,
      ajuste: null,
      cotizacion: null
    }));
  }
  removeProceso(index: number): void {
    this.procesos.removeAt(index);
  }

  // Form actions
  onSubmit(): void {
    console.log('Formulario enviado:', this.form.value);
  }
  onReset(): void {
    this.form.reset();
  }

  ngOnInit(): void {
    this.cargarDatosExportacion();
  }

  cargarDatosExportacion() {
  this.cotizacionesService.getListarProcesosExportacion('EXPORTACION')
    .subscribe((response: any) => {
      const procesosApi = response.elements ?? [];
      console.log('Procesos obtenidos de la API:', procesosApi);

      this.procesos.clear();

      procesosApi.forEach((p: any) => {
        this.procesos.push(this.fb.group({
          codigo: (p.pro_Hover ?? '').trim(),
          nombre: p.pro_Des ?? '',
          factor: p.pro_Factor ?? 0,
          costoKg: p.pro_Cos_Kg ?? 0,
          total: p.pro_Tot ?? 0,
          ajuste: p.pro_Aju ?? 0,
          cotizacion: p.pro_Cotizacion ?? 0
        }));
      });

      console.log('Procesos cargados en el formulario:', this.procesos.value);
    });
  }
  
}

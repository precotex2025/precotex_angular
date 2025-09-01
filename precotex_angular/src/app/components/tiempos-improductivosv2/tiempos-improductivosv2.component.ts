import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogTiemposImproductivosService } from 'src/app/services/dialog-tiempos-improductivos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { CalificacionRollosProcesoService } from 'src/app/services/calificacion-rollos-proceso.service';
import { Maquina } from './registro-desglose.model';
import { ModalEditarDesgloseComponent } from '../tiempos-improductivosv2/modal-editar-desglose/modal-editar-desglose.component';
import { ConfirmDialogComponent } from '../tiempos-improductivosv2/confirm-dialog/confirm-dialog.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-tiempos-improductivosv2',
  templateUrl: './tiempos-improductivosv2.component.html',
  styleUrls: ['./tiempos-improductivosv2.component.scss']
})

export class TiemposImproductivosv2Component implements OnInit {
  desgloseForm!: FormGroup;

  proveedoresList: Maquina[] = [];
  datosLista: any[] = [];

    // Simuladores para formulario
    selectedProveedores: string = '';
    sCod_Usuario = GlobalVariable.vusu;

    PartidaCab = {
      partida: '',
      descripcion: '',
      metros: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      total: 0,
      colitas: 0,
      usuario: '',
      auditor: '',
      proveedor: '',

    };

    filtro = {
      fechaInicio: '',
      fechaFin: '',
      partida: ''
    };

    datosDesglose = [];
    datosDesglosefiltro: any[] = [];

  constructor(private formBuilder: FormBuilder,
      private matSnackBar: MatSnackBar,
      private dialog: MatDialog,
      private CalificacionRollosProcesoService: CalificacionRollosProcesoService,
      private despachoTelaCrudaService: DialogTiemposImproductivosService,
      private fb: FormBuilder,
      private snackBar: MatSnackBar,
      ) { }

  @ViewChild('dnitejedor',{ static: false }) dnitejedor: ElementRef;

  ngOnInit(): void {

    this.desgloseForm = this.fb.group({
      proveedor: ['', Validators.required],
      partida: ['', Validators.required],
      fechaInicio: [this.obtenerFechaActual()],
      fechaFin: [this.obtenerFechaActual()],
      auditor: [''],
      total: [0],
      colitas: [0],
      usuarioCrea: [this.sCod_Usuario],
      items: this.fb.array([]) // arreglo de ítems
    });
    this.desgloseForm.get('auditor')?.disable();
    this.desgloseForm.get('total')?.disable();
    this.cargarProveedores();
    this.obtenerDni();
    this.listarDesglose();

    const hoy = new Date().toISOString().split('T')[0]; // formato: YYYY-MM-DD

    this.filtro.fechaInicio = hoy;
    this.filtro.fechaFin = hoy;

  }

  get items(): FormArray {
    return this.desgloseForm.get('items') as FormArray;
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  obtenerFechaActual(): string {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset();
    const local = new Date(ahora.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  }

  obtenerDni() {

    this.CalificacionRollosProcesoService.obtenerDni(this.sCod_Usuario).subscribe({
      next: (response) => {
        this.PartidaCab.usuario = response.elements;
        this.mostrarTejedor1(this.PartidaCab.usuario);
      },
      error: (err) => {
        console.error('Error al sCod_Usuario', err);
      }
    });

   }

   mostrarTejedor1(dni: string) {
    const dni_tejedor = dni;

    this.despachoTelaCrudaService.traerTejedor(dni_tejedor).subscribe(
      (result: any) => {
        console.log(result);

        if (result[0].Respuesta === 'OK') {
          this.desgloseForm.get('auditor')?.setValue(result[0].Nombres);
          console.log('Auditor cargado:', result[0].Nombres);
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500
        });
      }
    );
  }


  cargarProveedores() {

    this.CalificacionRollosProcesoService.obtenerProveedores().subscribe({
      next: (response) => {
        this.proveedoresList = response.elements;

        console.log('proveedoresList:', this.proveedoresList);
      },
      error: (err) => {
        console.error('Error al proveedoresList', err);
      }
    });
  }

  buscar(): void {

    this.limpiarItems();
    const partida = this.desgloseForm.get('partida')?.value;

    this.CalificacionRollosProcesoService.buscarPartida(partida).subscribe({
      next: (data) => {

        console.log('Items actualizadosddddd:', data.elements);


        data.elements.forEach((element: any) => {
          this.items.push(this.fb.group({
            id_desglose: [0],
            descripcion: [{ value: element.descripcion, disabled: true }],
            metros: [element.metros]
          }));
        });

        console.log('Items actualizados:', this.items.value);
      },
      error: (err) => {
        console.error('Error al buscar partida:', err);
      }
    });

  }

  calcularTotal(): void {
    const total = this.items.value.reduce((sum: number, item: any) => sum + +item.metros, 0);
    this.desgloseForm.patchValue({ total });
  }

  registrar(): void {
    this.desgloseForm.patchValue({
      usuarioCrea: this.sCod_Usuario
    });
    const datos = this.desgloseForm.getRawValue();

    console.log('Datos para enviar:', datos);

    if (!this.desgloseForm.valid) {
      this.snackBar.open('⚠️ Por favor, complete todos los campos obligatorios.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    this.CalificacionRollosProcesoService.registrarDesglose(datos).subscribe({
      next: (data) => {
        console.log('registrarDesglose:', data);
        this.listarDesglose();
        this.limpiarItems();
        this.obtenerDni();
        this.desgloseForm.reset();

        // ✅ Mostrar mensaje de éxito
        this.snackBar.open('✅ Desglose registrado con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error('Error al registrarDesglose partida:', err);
      }
    });
  }


  limpiarItems() {
    const items = this.desgloseForm.get('items') as FormArray;
    while (items.length !== 0) {
      items.removeAt(0);
    }
  }

  listarDesglose() {

    this.CalificacionRollosProcesoService.listarDesglose().subscribe({
      next: (response) => {
        this.datosDesglose = response.elements;
        this.datosDesglosefiltro = [...response.elements]; // Copia para visualización
        console.log('listarDesglose:', this.datosDesglose);
      },
      error: (err) => {
        console.error('Error al listarDesglose', err);
      }
    });
  }

  filtrar(): void {
    const { fechaInicio, fechaFin, partida } = this.filtro;

  this.datosDesglosefiltro = this.datosDesglose.filter(item => {
    const fechaItem = new Date(item.fechaInicio); // Puedes usar item.fechaFin también

    const cumpleFechaInicio = fechaInicio ? new Date(fechaInicio) <= fechaItem : true;
    const cumpleFechaFin = fechaFin ? new Date(fechaFin) >= fechaItem : true;
    const cumplePartida = partida ? item.cod_Ordtra?.toLowerCase().includes(partida.toLowerCase()) : true;

      return cumpleFechaInicio && cumpleFechaFin && cumplePartida;
    });
  }

  editar(item: any): void {

    this.CalificacionRollosProcesoService.listarDesgloseItem(item.id_Desglose).subscribe({
      next: (response) => {
        item.items = response.elements;
        console.log('listarDesgloseItem:', response.elements);

        const dialogRef = this.dialog.open(ModalEditarDesgloseComponent, {
          width: '90vw',          // Ocupa el 90% del ancho de la pantalla
          maxWidth: '600px',      // Máximo 600px
          minWidth: '300px',      // Mínimo 300px
          data: { ...item } // enviar copia de item
        });
        console.log("item");
        console.log(item);

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Actualiza el item en datosDesglosefiltro
            const index = this.datosDesglosefiltro.findIndex(d => d.id_Desglose === result.id_Desglose);
            if (index !== -1) {

              this.datosDesglosefiltro[index] = result;
              console.log('this.datosDesglosefiltro[index]...' + result);
              this.listarDesglose();
            }
          }
        });

      },
      error: (err) => {
        console.error('Error al listarDesgloseItem', err);
      }
    });

  }

  exportarExcel(): void {
    const datosFormateados = this.datosDesglosefiltro.map(item => ({
      ...item,
      fechaInicio: this.formatearFechaHora(item.fechaInicio),
      fechaFin: this.formatearFechaHora(item.fechaFin)
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosFormateados);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Desglose');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    FileSaver.saveAs(data, 'desglose.xlsx');
  }

  formatearFechaHora(fecha: string | Date): string {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }

  eliminar(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: '¿Estás seguro de que deseas eliminar?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Llama a tu servicio para eliminar
        this.CalificacionRollosProcesoService.eliminarDesglose(item.id_Desglose).subscribe({
          next: () => {
            this.datosDesglosefiltro = this.datosDesglosefiltro.filter(i => i.id_Desglose !== item.id_Desglose);
          },
          error: err => console.error('Error al eliminar', err)
        });
      }
    });
  }


}

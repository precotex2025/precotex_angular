import { Component, OnInit } from '@angular/core';
import { Estados, MotivoReclamo, ReclamoCliente, UnidadNegocio, UsuarioResponsable,  } from './quejas-reclamosv2.model';
import { Cliente, RegistroQuejasReclamosv2Service } from 'src/app/services/quejas-reclamosv2.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-quejas-reclamosv2',
  templateUrl: './quejas-reclamosv2.component.html',
  styleUrls: ['./quejas-reclamosv2.component.scss']
})


export class QuejasReclamosv2Component implements OnInit {

  nuevoReclamo: Partial<ReclamoCliente> = {};
  reclamos: any[] = [];
  clientes: Cliente[] = [];
  estados: Estados[] = [];
  tipoRegistro: Estados[] = [];
  unidadNegocio: UnidadNegocio[] = [];
  responsable: UsuarioResponsable[] = [];
  filtro: any[] = [];
  motivoReclamo: MotivoReclamo[] = [];

  ActivarFormulario: boolean = true;
  esNuvoReclamo: boolean = true; // o false, según lo que necesites
  cargando: boolean = false; // estado de carga
  sCod_Usuario = GlobalVariable.vusu;

  currentPage: number = 1;
  itemsPorPagina: number = 20;

  //clienteFormControl = new FormControl('');
  //filteredOptions: Observable<Cliente[]>;

  clienteInput: string = '';
  clientesFiltrados: any[] = [];

  motivoInput: string = '';
  motivoFiltrados: any[] = [];

  constructor(private registroQuejasReclamosv2Service: RegistroQuejasReclamosv2Service,private matSnackBar: MatSnackBar,) { }

  ngOnInit(): void {

    this.buscar();

    const fechaHoy = new Date();

    const primerDiaMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1);
    this.nuevoReclamo.fechaInicio = this.formatearFecha(primerDiaMes);

    const lastDay = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 0); // último día del mes actual
    this.nuevoReclamo = {
      ...this.nuevoReclamo,
      fechaFin: lastDay.toISOString().substring(0, 10) // formato YYYY-MM-DD
    };

    this.registroQuejasReclamosv2Service.obtenerEstados().subscribe({
      next: (response) => {
        this.estados = response.elements.filter((estado: any) => estado.acronimo === 'EQ');
        this.tipoRegistro = response.elements.filter((tipo: any) => tipo.acronimo === 'US');

        console.log('Estados:', this.estados);
      },
      error: (err) => {
        console.error('Error al obtener Estados', err);
      }
    });

    this.registroQuejasReclamosv2Service.obtenerUsuarioResponsable().subscribe({
      next: (response) => {
        this.responsable = response.elements;
        console.log('obtenerUsuarioResponsable:', this.responsable);
      },
      error: (err) => {
        console.error('Error al obtenerUsuarioResponsable', err);
      }
    });
  }

  archivoAdjuntoSeleccionado: File | null = null;

  verificarPartida(NroCaso: string) {

    if (NroCaso.length === 5) {
      this.registroQuejasReclamosv2Service.obtenerClienteArticulo(NroCaso).subscribe({
        next: (resp) => {
          if (resp.success) {
            this.filtro = resp.elements;
            console.log('obtenerReclamos:', this.filtro);
          } else {
            console.warn('No se encontraron datos.');
          }
        },
        error: (err) => {
          console.error('Error al buscar reclamos:', err);
        }
      });
    }
  }

  onArchivoSeleccionado(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('input.files:', input.files);
      const archivo = input.files[0];
      console.log('archivo:', archivo);
      this.reclamos[index].archivoAdjuntoSeleccionado = archivo;
      this.reclamos[index].archivoAdjunto = archivo;
      //this.reclamos[index].nombreArchivo = archivo.name;
    }
    console.log('AgregarReclamo:', this.reclamos);
  }

  agregarReclamo() {
    console.log("agregarReclamo inicio" + this.nuevoReclamo);
    console.log(this.clientesFiltrados);

    if (1==1) {
      const reclamo: ReclamoCliente = {
        //cliente: this.clienteFormControl.value.nom_Cliente,
        cliente: this.nuevoReclamo.cliente,
        tipoRegistro: this.nuevoReclamo.tipoRegistro,
        responsable: this.nuevoReclamo.responsable,
        estadoSolicitud: this.nuevoReclamo.estadoSolicitud || 'Abierto',
        observacion: this.nuevoReclamo.observacion,
        unidadNegocio: this.nuevoReclamo.unidadNegocio,
        motivoRegistro: this.nuevoReclamo.motivoRegistro,
        usuarioRegistro: this.sCod_Usuario,
        partida: this.nuevoReclamo.partida

      };
      this.reclamos.push(reclamo);
      console.log('AgregarReclamo:', reclamo);
      this.esNuvoReclamo = true;
    } else {
      console.warn('Por favor, completa todos los campos requeridos.');
      this.matSnackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }
  }

  private campoValido(valor: any): boolean {
    return valor !== null && valor !== undefined && valor !== '';
  }

  private camposRequeridosCompletos(): boolean {
    console.log('camposRequeridosCompletos:');
    const r = this.nuevoReclamo;
    return (
      //this.campoValido(this.clienteFormControl.value.nom_Cliente) &&
      this.campoValido(r.cliente) &&
      this.campoValido(r.tipoRegistro) &&
      this.campoValido(r.responsable) &&
      this.campoValido(r.estadoSolicitud) &&
      this.campoValido(r.observacion) &&
      this.campoValido(r.unidadNegocio) &&
      this.campoValido(r.motivoRegistro) &&
      this.campoValido(r.motivoRegistro)
    );

  }


  guardar() {

    this.cargando = true;
    setTimeout(() => {
      // Aquí iría tu lógica real
      this.cargando = false;
    }, 2000);

    if (this.reclamos.length === 0) {
      alert('⚠️ No hay reclamos para enviar.');
      return;
    }

    const formData = new FormData();

    this.reclamos.forEach((reclamo, index) => {
      formData.append(`reclamos[${index}][id]`, reclamo.id);
      formData.append(`reclamos[${index}][nroCaso]`, reclamo.nroCaso);
      formData.append(`reclamos[${index}][cliente]`, reclamo.cliente);
      formData.append(`reclamos[${index}][tipoRegistro]`, reclamo.tipoRegistro);
      formData.append(`reclamos[${index}][unidadNegocio]`, reclamo.unidadNegocio || '');
      formData.append(`reclamos[${index}][usuarioRegistro]`, reclamo.usuarioRegistro);
      formData.append(`reclamos[${index}][responsable]`, reclamo.responsable || '');
      formData.append(`reclamos[${index}][motivoRegistro]`, reclamo.motivoRegistro || '');
      formData.append(`reclamos[${index}][estadoSolicitud]`, reclamo.estadoSolicitud || 'Abierto');
      formData.append(`reclamos[${index}][observacion]`, reclamo.observacion);
      formData.append(`reclamos[${index}][archivoAdjunto]`, reclamo.archivoAdjunto);
      /*if (reclamo.archivoAdjunto) {
        formData.append(`reclamos[${index}][archivoAdjunto]`, this.nuevoReclamo.archivoAdjunto);
      }*/
    });
    this.registroQuejasReclamosv2Service.enviarReclamo(formData).subscribe({
      next: () => {
        alert('✅ Todos los reclamos fueron enviados correctamente.');
        this.reclamos = []; // Limpiar lista si quieres
        this.nuevoReclamo = {};
        this.buscar()
        this.ActivarFormulario = true;

      },
      error: (err) => {
        console.error('❌ Error al enviar reclamos:', err);
        alert('Error al enviar los reclamos.');
      }
    });
  }

  eliminarReclamo(index: number) {
    this.reclamos.splice(index, 1);
  }

  buscar() {

    this.registroQuejasReclamosv2Service.obtenerReclamos(this.nuevoReclamo).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.filtro = resp.elements;
          console.log('obtenerReclamos:', this.filtro);
        } else {
          console.warn('No se encontraron datos.');
        }
      },
      error: (err) => {
        console.error('Error al buscar reclamos:', err);
      }
    });

  }

  nuevo(){

    this.ActivarFormulario = false;
    this.esNuvoReclamo == true;

    this.nuevoReclamo = {};
    this.reclamos = []; // Limpiar lista si quieres
    this.responsable = [];
    this.clientes = [];
    this.unidadNegocio = [];
    this.motivoReclamo = [];

    this.registroQuejasReclamosv2Service.obtenerClientes().subscribe({
      next: (response) => {
        this.clientes = response.elements;
        this.clientesFiltrados = this.clientes; // Inicialmente, todos
        /*this.filteredOptions = this.clienteFormControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );*/
        console.log('Clientes:', this.clientes);
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });

    this.registroQuejasReclamosv2Service.obtenerUnidadNegocio().subscribe({
      next: (response) => {
        this.unidadNegocio = response.elements;

        console.log('Unidad Negocio:', this.estados);
      },
      error: (err) => {
        console.error('Error al obtener Unidad Negocio', err);
      }
    });

    this.registroQuejasReclamosv2Service.obtenerEstados().subscribe({
      next: (response) => {
        this.estados = response.elements.filter((estado: any) => estado.acronimo === 'EQ');
        //this.tipoRegistro = response.elements.filter((tipo: any) => tipo.acronimo === 'TQ');
        // Si hay uno activo, seleccionarlo por defecto
        if (this.estados.length > 0) {
          this.nuevoReclamo.estadoSolicitud = this.estados[0].estado;
        }
        if (this.tipoRegistro.length > 0) {
          this.nuevoReclamo.tipoRegistro = this.tipoRegistro[0].estado;
        }

        console.log('Estados:', this.estados);
      },
      error: (err) => {
        console.error('Error al obtener Estados', err);
      }
    });

    this.registroQuejasReclamosv2Service.obtenerUsuarioResponsable().subscribe({
      next: (response) => {
        this.responsable = response.elements;
        if (this.responsable.length > 0) {
          this.nuevoReclamo.responsable = this.responsable[0].nombreArea;
        }
        console.log('responsable:', this.responsable);
      },
      error: (err) => {
        console.error('Error al responsable', err);
      }
    });

    this.registroQuejasReclamosv2Service.obtenerMotivoReclamo().subscribe({
      next: (response) => {
        this.motivoReclamo = response.elements;
        console.log('motivoReclamo:', this.motivoReclamo);
      },
      error: (err) => {
        console.error('Error al obtener motivoReclamo', err);
      }
    });

  }

  editar(item: any) {
    this.nuevoReclamo = { ...item }; // Copia los datos del reclamo seleccionado

    this.registroQuejasReclamosv2Service.obtenerClientes().subscribe({
      next: (response) => {
        this.clientes = response.elements;
        console.log('Clientes:', this.clientes);
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });

    forkJoin({
      unidadNegocio: this.registroQuejasReclamosv2Service.obtenerUnidadNegocio(),
      reclamos: this.registroQuejasReclamosv2Service.obtenerDetReclamos(this.nuevoReclamo)
    }).subscribe({
      next: ({ unidadNegocio, reclamos }) => {
        this.unidadNegocio = unidadNegocio.elements;
        this.reclamos = reclamos.elements;
        console.log('this.reclamosfgfgfgfg:', this.reclamos);

        // Suponiendo que solo es un reclamo para editar:
        if (this.reclamos.length > 0) {
          const reclamo = this.reclamos[0]; // o el que necesites
          this.nuevoReclamo = { ...reclamo }; // clonar si es necesario

          // Como ambos usan la descripción, puedes asignar directamente
          this.nuevoReclamo.unidadNegocio = reclamo.unidadNegocio;
        }

        console.log('Unidad seleccionada:', this.nuevoReclamo.unidadNegocio);
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });


    this.registroQuejasReclamosv2Service.obtenerEstados().subscribe({
      next: (response) => {
        this.estados = response.elements.filter((estado: any) => estado.acronimo === 'EQ');

        if (this.estados.length > 0) {
          this.nuevoReclamo.estadoSolicitud = this.estados[0].estado;
        }

        console.log('Estados:', this.estados);
      },
      error: (err) => {
        console.error('Error al obtener Estados', err);
      }
    });

    this.registroQuejasReclamosv2Service.obtenerUsuarioResponsable().subscribe({
      next: (response) => {
        this.responsable = response.elements;

        console.log('obtenerUsuarioResponsable:', this.responsable);
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });

    this.ActivarFormulario = false;   // Asegura que el formulario esté visible
    this.esNuvoReclamo = false;
  }

  eliminar(item: any) {

    // O si tienes también una llamada al backend:
    if (confirm(`¿Eliminar el caso Nro ${item.nroCaso}?`)) {
      this.registroQuejasReclamosv2Service.eliminarReclamo(item.nroCaso).subscribe(() => {
        this.filtro = this.filtro.filter(r => r.nroCaso !== item.nroCaso);
      });
    }
    this.buscar();
  }

  // Convierte la fecha al formato yyyy-MM-dd para el input date
  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  verArchivo(nombreArchivo: string) {
      this.registroQuejasReclamosv2Service.verArchivo(nombreArchivo);
  }
  atras(): void {
    this.ActivarFormulario = true;
    this.esNuvoReclamo = true;
    this.nuevoReclamo.nroCaso = '';
    this.nuevoReclamo.tipoRegistro = '';
    this.nuevoReclamo.estadoSolicitud = '';
    this.nuevoReclamo.cliente = '';
    this.nuevoReclamo.responsable = '';
    const fechaHoy = new Date();
    const primerDiaMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1);
    this.nuevoReclamo.fechaInicio = this.formatearFecha(primerDiaMes);

    const lastDay = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 0); // último día del mes actual
    this.nuevoReclamo = {
      ...this.nuevoReclamo,
      fechaFin: lastDay.toISOString().substring(0, 10) // formato YYYY-MM-DD
    };
  }

  reiniciarEstado() {
    setTimeout(() => {
      this.nuevoReclamo.tipoRegistro = '';
      this.nuevoReclamo.estadoSolicitud = '';
      this.nuevoReclamo.responsable = '';
    }, 5000);
  }

  // EXPORTAR
  exportarExcel(): void {
    const dataExport = this.filtro.map(item => ({
      'Nro. Caso': item.nroCaso,
      'Fecha Registro': item.fechaRegistro,
      'Cliente': item.cliente,
      'Tipo Registro': item.tipoRegistro,
      'Usuario Registro': item.usuarioRegistro,
      'Estado Solicitud': item.estadoSolicitud
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Reclamos': worksheet }, SheetNames: ['Reclamos'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'reclamos.xlsx');
  }

  isOlderThan(fechaRegistro: string, hours: number): boolean {
    const registrationDate = new Date(fechaRegistro);
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - registrationDate.getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    //alert("isOlderThan differenceInHours " + differenceInHours);
    //alert("isOlderThan hours " + hours);
    console.log("isOlderThan differenceInHours " + differenceInHours);
    console.log("isOlderThan hours " + hours);
    return differenceInHours > hours;
  }

  isYoungerThan(fechaRegistro: string, hours: number): boolean {
    return !this.isOlderThan(fechaRegistro, hours);
  }

  isBetween(fechaRegistro: string, lowerHours: number, upperHours: number): boolean {
    const registrationDate = new Date(fechaRegistro);
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - registrationDate.getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    //alert("isBetween differenceInHours " + differenceInHours);
    //alert("isBetween lowerHours " + lowerHours);
    console.log("isBetween differenceInHours " + differenceInHours);
    console.log("isBetween lowerHours " + lowerHours);
    return differenceInHours > lowerHours && differenceInHours < upperHours;
  }

  _filter(value: string): Cliente[] {
    const filterValue = value.toLowerCase();
    return this.clientes.filter(cliente =>
      cliente.nom_Cliente.toLowerCase().includes(filterValue)
    );
  }


  actualizarMotivoDesdeInput() {
    const coincidencia = this.motivoReclamo.find(c =>
      c.descripcion.toLowerCase().includes(this.motivoInput.toLowerCase())
    );

    if (coincidencia) {
      this.nuevoReclamo.motivoRegistro = coincidencia.descripcion;
    } else {
      this.nuevoReclamo.motivoRegistro = ''; // o mantener el último válido
    }
  }
}

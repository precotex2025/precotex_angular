import { Component, OnInit } from '@angular/core';
import { Estados, EstadosOficial, MotivoReclamo, ReclamoCliente, UnidadNegocio, UnidadNegocio2, UsuarioResponsable,  } from './quejas-reclamos.model';
import { Cliente, RegistroQuejasReclamosService } from 'src/app/services/quejas-reclamos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ModalSeleccionPartidaQrComponent } from './modal-seleccion-partida-qr/modal-seleccion-partida-qr.component';
import { ModalInformeComponent } from './modal-informe/modal-informe.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalInformeCierreComponent } from './modal-informe-cierre/modal-informe-cierre.component';
import { _ } from 'ag-grid-community';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-quejas-reclamos',
  templateUrl: './quejas-reclamos.component.html',
  styleUrls: ['./quejas-reclamos.component.scss']
})


export class QuejasReclamosComponent implements OnInit {

  nuevoReclamo: Partial<ReclamoCliente> = {};
  reclamos: any[] = [];
  clientes: Cliente[] = [];
  //estados: Estados[] = [];
  estados: EstadosOficial[] = [];
  tipoRegistro: Estados[] = [];
  unidadNegocio: UnidadNegocio[] = [];
  responsable: UsuarioResponsable[] = [];
  filtro: any[] = [];
  motivoReclamo: MotivoReclamo[] = [];
  unidadNegocio2: UnidadNegocio2[] = [];

  ActivarFormulario: boolean = true;
  esNuvoReclamo: boolean = true; // o false, según lo que necesites
  cargando: boolean = false; // estado de carga
  sCod_Usuario = GlobalVariable.vusu;
  sCodTrabajador = GlobalVariable.vcodtra;

  currentPage: number = 1;
  itemsPorPagina: number = 20;

  //clienteFormControl = new FormControl('');
  //filteredOptions: Observable<Cliente[]>;

  clienteInput: string = '';
  clientesFiltrados: any[] = [];

  motivoInput: string = '';
  motivoFiltrados: any[] = [];
  arrayArticulos: any[] = [];

  idReclamo: number = 0;
  codArea: string = ""; //01 - Comercial; 02 - Calidad

  dataExportar: any[] = [];

  constructor(
      private registroQuejasReclamosService: RegistroQuejasReclamosService,
      private matSnackBar: MatSnackBar      ,
      private dialog            : MatDialog ,
      private toastr            : ToastrService          ,
      private SpinnerService    : NgxSpinnerService                ,
    ) { }

  ngOnInit(): void {
    this.onObtieneUsuarioArea(this.sCodTrabajador);
    this.buscar();

    const fechaHoy = new Date();

    const primerDiaMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1);
    this.nuevoReclamo.fechaInicio = this.formatearFecha(primerDiaMes);

    const lastDay = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 0); // último día del mes actual
    this.nuevoReclamo = {
      ...this.nuevoReclamo,
      fechaFin: lastDay.toISOString().substring(0, 10) // formato YYYY-MM-DD
    };

    /*REEMPLAZADO POR NUEVOS ESTADO*/ 
    
    this.registroQuejasReclamosService.obtenerEstados().subscribe({
      next: (response) => {
        //this.estados = response.elements.filter((estado: any) => estado.acronimo === 'EQ');
        this.tipoRegistro = response.elements.filter((tipo: any) => tipo.acronimo === 'US');
      },
      error: (err) => {
        console.error('Error al obtener Estados', err);
      }
    });
    

    this.registroQuejasReclamosService.ListaEstadosOficial().subscribe({
      next: (response) => {
        if(response.success){
            if (response.totalElements > 0) {
                this.estados = response.elements;
                console.log('Estados', this.estados);
            }
            else {
              this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
        }

      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });  



    this.registroQuejasReclamosService.obtenerUsuarioResponsable().subscribe({
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

  onObtieneUsuarioArea(sCodTrabajador: string){

    this.registroQuejasReclamosService.ObtieneUsuarioArea(sCodTrabajador).subscribe({
      next: (response) => {
        if(response.success){
            if (response.totalElements > 0) {
                this.codArea = response.elements[0].cod_Area;
                
            }
            else {
              this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
        }

      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });    

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
    console.log("agregarReclamo inicio" + this.nuevoReclamo.motivoRegistro);
    console.log(this.clientesFiltrados);



    if(!this.nuevoReclamo.cadenaCodOrdtra){
       this.mostrarAdvertencia('⚠ Atención: Ingrese datos de Partidas.');
       return;
    }


    //Recorrer los Articulos Seleccionados
    if (1==1) {
    this.arrayArticulos.forEach(element => {
      console.log('this.arrayArticulos-element', element);
      //debugger;

      let codTela = String(element.cod_Tela);
      let desTela = String(element.des_Tela);
      let codColor = String(element.cod_Color);
      let desColor = String(element.des_Color);
      let numSecuencia = Number(element.num_Secuencia);

      const reclamoReg: ReclamoCliente = {
        id: 0,
        cliente: this.nuevoReclamo.cliente,
        tipoRegistro: this.nuevoReclamo.tipoRegistro,
        responsable: this.nuevoReclamo.responsable,
        estadoSolicitud: this.nuevoReclamo.estadoSolicitud || 'Abierto',
        observacion: this.nuevoReclamo.observacion || '',
        unidadNegocio: this.nuevoReclamo.unidadNegocio,
        motivoRegistro: this.nuevoReclamo.motivoRegistro,
        usuarioRegistro: this.sCod_Usuario,

        //Campos Nuevos
        cadenaCodOrdtra : '',
        cod_Ordtra       : this.nuevoReclamo.cod_Ordtra,    
        cod_Tela        : codTela,
        des_Tela        : desTela,
        cod_Color       : codColor,
        des_Color       : desColor,
        num_Secuencia   :     numSecuencia,
        cod_Unidad_Negocio  : this.nuevoReclamo.cod_Unidad_Negocio,
        des_Unidad_Negocio  : this.nuevoReclamo.des_Unidad_Negocio,//cuando tegresoses mostrar la descripcion da la unidad de negocio.
        cod_Cliente_Tex     : this.nuevoReclamo.cod_Cliente_Tex,
        cod_Motivo          : this.nuevoReclamo.cod_Motivo,
      };
      this.reclamos.push(reclamoReg);
      this.esNuvoReclamo = true;
    });    

    console.log('agregarReclamo - this.reclamos', this.reclamos);

    //Limpia 
    this.nuevoReclamo.cod_Ordtra = '';
    this.nuevoReclamo.cadenaCodOrdtra = '';
    //this.nuevoReclamo.cliente = null;
    this.nuevoReclamo.cod_Cliente_Tex = null;
    this.nuevoReclamo.responsable = null;
    this.nuevoReclamo.tipoRegistro = null;
    this.motivoInput = '';
    this.nuevoReclamo.motivoRegistro = null;
    this.nuevoReclamo.unidadNegocio = null;
    this.nuevoReclamo.observacion = '';
    this.nuevoReclamo.cod_Unidad_Negocio = null;
    this.nuevoReclamo.cod_Motivo = null;


    /*
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

        //Nuevos Campos
        codOrdtra: this.nuevoReclamo.codOrdtra,
        //cadenaCodOrdtra: "",

      };
      this.reclamos.push(reclamo);
      console.log('AgregarReclamo:', reclamo);
      this.esNuvoReclamo = true;
      */
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
    console.log('guardar this.reclamos',this.reclamos);
    this.reclamos.forEach((reclamo, index) => {

      //CAMBIAMOS VALORES  
      let sCodMotivoFinal     : string;
      let sAreaResponsable    : string;
      let sUsuarioResponsable : string;
      let sObservacion        : string;
      let sCodUnidadNegocio   : string;

      //sirve solo cuando esta en MODO de EDICIÓN
      if (!this.esNuvoReclamo) {
        //1. Cod Motivo
        sCodMotivoFinal = (this.nuevoReclamo.cod_Motivo !== reclamo.cod_Motivo)
          ? this.nuevoReclamo.cod_Motivo
          : reclamo.cod_Motivo;

        //2. Area Responsable
        sUsuarioResponsable = (this.nuevoReclamo.tipoRegistro !== reclamo.tipoRegistro)
          ? this.nuevoReclamo.tipoRegistro
          : reclamo.tipoRegistro

        //3. Usuario Responsable
        sAreaResponsable = (this.nuevoReclamo.responsable !== reclamo.responsable)
          ? this.nuevoReclamo.responsable
          : reclamo.responsable          

        //4. Observación
        sObservacion = (this.nuevoReclamo.observacion !== reclamo.observacion)
          ? this.nuevoReclamo.observacion
          : reclamo.observacion     
        
        //5. Cod Unidad Negocios
        sCodUnidadNegocio = String(this.nuevoReclamo.cod_Unidad_Negocio);


      } else {
        sCodMotivoFinal = reclamo.cod_Motivo;
        sAreaResponsable = reclamo.responsable;
        sUsuarioResponsable = reclamo.tipoRegistro;
        sObservacion = reclamo.observacion;
        sCodUnidadNegocio = reclamo.cod_Unidad_Negocio;
      }      
      console.log('sAreaResponsable', sAreaResponsable);

      formData.append(`reclamos[${index}][id]`, reclamo.id);
      formData.append(`reclamos[${index}][nroCaso]`, reclamo.nroCaso);
      formData.append(`reclamos[${index}][cliente]`, reclamo.cliente);
      //formData.append(`reclamos[${index}][tipoRegistro]`, reclamo.tipoRegistro);
      formData.append(`reclamos[${index}][tipoRegistro]`, sUsuarioResponsable);
      formData.append(`reclamos[${index}][unidadNegocio]`, reclamo.unidadNegocio || '');
      formData.append(`reclamos[${index}][usuarioRegistro]`, reclamo.usuarioRegistro);
      //formData.append(`reclamos[${index}][responsable]`, reclamo.responsable || '');
      formData.append(`reclamos[${index}][responsable]`, sAreaResponsable || '');
      formData.append(`reclamos[${index}][motivoRegistro]`, reclamo.motivoRegistro || '');
      formData.append(`reclamos[${index}][estadoSolicitud]`, reclamo.estadoSolicitud || 'Abierto');
      //formData.append(`reclamos[${index}][observacion]`, reclamo.observacion);
      formData.append(`reclamos[${index}][observacion]`, sObservacion);   
      formData.append(`reclamos[${index}][archivoAdjunto]`, reclamo.archivoAdjunto);
      /*if (reclamo.archivoAdjunto) {
        formData.append(`reclamos[${index}][archivoAdjunto]`, this.nuevoReclamo.archivoAdjunto);
      }*/

      //CAMPOS NUEVOS
      formData.append(`reclamos[${index}][cod_Cliente_Tex]`, reclamo.cod_Cliente_Tex);
      formData.append(`reclamos[${index}][cod_Ordtra]`      , reclamo.cod_Ordtra);
      formData.append(`reclamos[${index}][cod_Tela]`       , reclamo.cod_Tela);
      formData.append(`reclamos[${index}][cod_Color]`      , reclamo.cod_Color);
      formData.append(`reclamos[${index}][cod_Unidad_Negocio]`, sCodUnidadNegocio);
      //formData.append(`reclamos[${index}][cod_Unidad_Negocio]`, this.nuevoReclamo.cod_Unidad_Negocio);
      formData.append(`reclamos[${index}][cod_Motivo]`        , sCodMotivoFinal);
      //formData.append(`reclamos[${index}][cod_Motivo]`        , reclamo.cod_Motivo);
    });
    this.registroQuejasReclamosService.enviarReclamo(formData).subscribe({
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

    console.log('buscar-obtenerReclamos', this.nuevoReclamo);

    this.registroQuejasReclamosService.obtenerReclamos(this.nuevoReclamo).subscribe({
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
    this.unidadNegocio2 = [];

    this.registroQuejasReclamosService.obtenerClientes().subscribe({
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

    /*COMENTADO PORQUE NO ES LA LISTA DE UNIDAD DE NEGOCIO*/
    /*
    this.registroQuejasReclamosService.obtenerUnidadNegocio().subscribe({
      next: (response) => {
        this.unidadNegocio = response.elements;

        console.log('Unidad Negocio:', this.estados);
      },
      error: (err) => {
        console.error('Error al obtener Unidad Negocio', err);
      }
    });
    */

    /*
    this.registroQuejasReclamosService.obtenerEstados().subscribe({
      next: (response) => {

        //console.log('nuevo - obtenerEstados',response);
        //this.estados = response.elements.filter((estado: any) => estado.acronimo === 'EQ');
        this.tipoRegistro = response.elements.filter((tipo: any) => tipo.acronimo === 'TQ');
        //Si hay uno activo, seleccionarlo por defecto
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
    */

    this.registroQuejasReclamosService.ListaEstadosOficial().subscribe({
      next: (response) => {
        if(response.success){
            if (response.totalElements > 0) {
                this.estados = response.elements;
                console.log('Estados', this.estados);
            }
            else {
              this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
        }

      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });  


    this.registroQuejasReclamosService.obtenerUsuarioResponsable().subscribe({
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

    this.registroQuejasReclamosService.obtenerMotivoReclamo().subscribe({
      next: (response) => {
        this.motivoReclamo = response.elements;
        console.log('motivoReclamo:', this.motivoReclamo);
      },
      error: (err) => {
        console.error('Error al obtener motivoReclamo', err);
      }
    });

    this.registroQuejasReclamosService.ListaUnidadNegocio().subscribe({
      next: (response) => {
        this.unidadNegocio2 = response.elements;
        this.nuevoReclamo.cod_Unidad_Negocio = null;
      },
      error: (err) => {
        console.error('Error al obtener Unidad Negocio', err);
      }
    });
  }

  editar(item: any) {

    console.log('item editar', item);

    this.nuevoReclamo = { ...item }; // Copia los datos del reclamo seleccionado

    console.log('nuevo rewclamo - editar', this.nuevoReclamo);



    forkJoin({
      cliente: this.registroQuejasReclamosService.obtenerClientes(),
      //unidadNegocio: this.registroQuejasReclamosService.obtenerUnidadNegocio(),
      unidadNegocio: this.registroQuejasReclamosService.ListaUnidadNegocio(),
      motivo: this.registroQuejasReclamosService.obtenerMotivoReclamo(),
      reclamos: this.registroQuejasReclamosService.obtenerDetReclamos(this.nuevoReclamo)
    }).subscribe({
      next: ({ unidadNegocio, reclamos, cliente, motivo }) => {
        this.clientes        = cliente.elements;
        this.unidadNegocio2  = unidadNegocio.elements;
        this.motivoReclamo   = motivo.elements;
        this.reclamos        = reclamos.elements;

        console.log('');
        console.log('reclamos', reclamos);
        this.clientes.filter(item => item.cod_Cliente_Tex == String(reclamos.elements[0].cod_Cliente_Tex));

        //Mostrar los datos a mostrar
        this.nuevoReclamo.cod_Ordtra          = String(reclamos.elements[0].cod_Ordtra);  
        this.nuevoReclamo.cod_Cliente_Tex             = String(reclamos.elements[0].cod_Cliente_Tex);
        this.nuevoReclamo.cod_Unidad_Negocio  = String(reclamos.elements[0].id_Unidad_NegocioKey);
        this.nuevoReclamo.cod_Motivo          = String(reclamos.elements[0].cod_Motivo);
        this.nuevoReclamo.responsable         = String(reclamos.elements[0].responsable);
        this.nuevoReclamo.observacion         = String(reclamos.elements[0].observacion);
        this.nuevoReclamo.tipoRegistro        = String(reclamos.elements[0].tipoRegistro);

        // Suponiendo que solo es un reclamo para editar: 
        /*
        if (this.reclamos.length > 0) {
          const reclamo = this.reclamos[0]; // o el que necesites
          this.nuevoReclamo = { ...reclamo }; // clonar si es necesario

          // Como ambos usan la descripción, puedes asignar directamente
          this.nuevoReclamo.unidadNegocio = reclamo.unidadNegocio;
        }
        */

        console.log('Unidad seleccionada:', this.nuevoReclamo.cod_Unidad_Negocio);
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  
    this.registroQuejasReclamosService.ListaEstadosOficial().subscribe({
      next: (response) => {
        if(response.success){
            if (response.totalElements > 0) {
                this.estados = response.elements;
                console.log('Estados', this.estados);
            }
            else {
              this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
        }

      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });      

    /*
    this.registroQuejasReclamosService.obtenerEstados().subscribe({
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
    */

    this.registroQuejasReclamosService.obtenerUsuarioResponsable().subscribe({
      next: (response) => {
        this.responsable = response.elements;

        console.log('obtenerUsuarioResponsable:', this.responsable);
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });


    //nueva validacion si es cod Area realiza el proceso de RECEPCIONADO
    if (this.codArea.trim() == '02' && item.cod_Estado == '01'){
      this.avanzaEstadoReclamo(item.id);
      this.nuevoReclamo.cod_Estado = '02'; //Cambia el estado a 02 porque el area de calidad ingreso y lo toma como recepcionado
    }
    console.log('cod_area', this.codArea);

  
    

    this.ActivarFormulario = false;   // Asegura que el formulario esté visible
    this.esNuvoReclamo = false;
  }

  eliminar(item: any) {

    // O si tienes también una llamada al backend:
    if (confirm(`¿Eliminar el caso Nro ${item.nroCaso}?`)) {
      this.registroQuejasReclamosService.eliminarReclamo(item.nroCaso).subscribe(() => {
        this.filtro = this.filtro.filter(r => r.nroCaso !== item.nroCaso);
      });
    }
    this.buscar();
  }

  informe(item: any){
    console.log('modal informe', item);
    const dialogRef = this.dialog.open(ModalInformeComponent, {
      width: '550px',
      data: {
        Datos  : item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.buscar();
    });     
  
  }

  cerrarCaso(item: any){
    console.log('modal informe', item);
    const dialogRef = this.dialog.open(ModalInformeCierreComponent, {
      width: '450px',
      data: {
        Datos  : item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.buscar();
    });     
  }


  // Convierte la fecha al formato yyyy-MM-dd para el input date
  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  verArchivo(nombreArchivo: string) {
      this.registroQuejasReclamosService.verArchivo(nombreArchivo);
  }
  atras(): void {
    this.ActivarFormulario = true;
    this.esNuvoReclamo = true;
    this.nuevoReclamo.nroCaso = '';
    this.nuevoReclamo.tipoRegistro = '';
    this.nuevoReclamo.estadoSolicitud = '';
    this.nuevoReclamo.cliente = '';
    this.nuevoReclamo.responsable = '';
    this.nuevoReclamo.cod_Ordtra = '';
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

    this.getExportarExcel();

    /*
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
    */
  }

  isOlderThan(fechaRegistro: string, hours: number): boolean {
    const registrationDate = new Date(fechaRegistro);
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - registrationDate.getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    //alert("isOlderThan differenceInHours " + differenceInHours);
    //alert("isOlderThan hours " + hours);
    //console.log("isOlderThan differenceInHours " + differenceInHours);
    //console.log("isOlderThan hours " + hours);
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
    //console.log("isBetween differenceInHours " + differenceInHours);
    //console.log("isBetween lowerHours " + lowerHours);
    return differenceInHours > lowerHours && differenceInHours < upperHours;
  }

  _filter(value: string): Cliente[] {
    const filterValue = value.toLowerCase();
    return this.clientes.filter(cliente =>
      cliente.nom_Cliente.toLowerCase().includes(filterValue)
    );
  }

  actualizarClienteDesdeInput() {
    const coincidencia = this.clientes.find(c =>
      c.nom_Cliente.toLowerCase().includes(this.clienteInput.toLowerCase())
    );

    if (coincidencia) {
      this.nuevoReclamo.cliente = coincidencia.nom_Cliente;
    } else {
      this.nuevoReclamo.cliente = ''; // o mantener el último válido
    }
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

  /* NUEVOS METODOS */
  buscarTelasXPartida(){

    this.arrayArticulos = [];

     const sCodOrdtra = this.nuevoReclamo.cod_Ordtra;
     this.registroQuejasReclamosService.buscarPorPartida(sCodOrdtra).subscribe({
      next: (data) => {
        //console.log('buscarTelasXPartida', data);
        if (data.elements.length > 0){

          const dialogRef = this.dialog.open(ModalSeleccionPartidaQrComponent, {
            width: '550px',
            data: data.elements
          });
          dialogRef.afterClosed().subscribe(result => {

            if (result){
              console.log('result', result);
              //Agregamos la lista obtenida a nuestro array
              this.arrayArticulos.push(...result);

              const sArticulos: any[] = [];
              result.forEach(element => {
                let codArticulo = String(element.cod_Tela).substring(0, 8);
                sArticulos.push(codArticulo);
              });
              //Une los articulos en una sola linea separado por coma(,)
              const articulosConcatenados = sArticulos.join(",");
              
              //Asigna Valores de los articuloes seleccionados
              this.nuevoReclamo.cadenaCodOrdtra = articulosConcatenados;
              this.nuevoReclamo.cliente =   String(result[0].nom_Cliente);
              this.nuevoReclamo.cod_Unidad_Negocio = String(result[0].id_Unidad_NegocioKey);
              this.nuevoReclamo.des_Unidad_Negocio = String(result[0].des_Unidad_NegocioKey);
              console.log('cliente', result[0].cod_Cliente_Tex);
              this.nuevoReclamo.cod_Cliente_Tex = result[0].cod_Cliente_Tex;
              //Falta Obtenerla Unidad de Medida

              
              console.log('this.arrayArticulos', this.arrayArticulos);

            }
      
          });          

        }

      },
      error: (err) => {
        // this.isLoading = false;
        // this.sinResultados = true;
        console.error('Error al buscar partida:', err);
      }      
     });
  };  

// recepcionar(){
//   var sId = Number(this.nuevoReclamo.id);

//   Swal.fire({
//     title: '¿Desea recepcionar el reclamo?, Confirme',
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Sí',
//     cancelButtonText: 'No'
//   }).then((result) => {  

//     if (result.isConfirmed) {

//       this.SpinnerService.show();
//       this.registroQuejasReclamosService.AvanzaEstadoReclamo(sId).subscribe({
//         next: (response: any) => {
//               if(response.success){
//                 if (response.codeResult == 200){
//                   this.toastr.success(response.message, '', {
//                     timeOut: 2500,
//                   });

//                   this.reclamos = []; // Limpiar lista si quieres
//                   this.nuevoReclamo = {};
//                   this.buscar()
//                   this.ActivarFormulario = true;                

//                 }else if(response.codeResult == 201){
//                   this.toastr.info(response.message, '', {
//                     timeOut: 2500,
//                   });
//                 }
//                 this.SpinnerService.hide();
//               }else{
//                 this.toastr.error(response.message, 'Cerrar', {
//                   timeOut: 2500,
//                 });
//                 this.SpinnerService.hide();
//               }

//         },
//         error: (err) => {
//           console.error('❌ Error al enviar reclamos:', err);
//           alert('Error al enviar los reclamos.');
//         }
//       });       
//     }    

//   });

// }  

avanzaEstadoReclamo(id: Number){
  console.log('obtuve el ID', id);
      this.SpinnerService.show();
      this.registroQuejasReclamosService.AvanzaEstadoReclamo(Number(id)).subscribe({
        next: (response: any) => {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });

                  this.buscar()        

                }else if(response.codeResult == 201){
                  this.toastr.info(response.message, '', {
                    timeOut: 2500,
                  });
                }
                this.SpinnerService.hide();
              }else{
                this.toastr.error(response.message, 'Cerrar', {
                  timeOut: 2500,
                });
                this.SpinnerService.hide();
              }

        },
        error: (err) => {
          console.error('❌ Al intentar cambiar de estado recepcionado:', err);
          alert('Error ❌ Al intentar cambiar de estado recepcionado.');
        }
      }); 
}

actualizarDescripcionMotivo(codigo: string): void {
  const motivo = this.motivoReclamo.find(m => m.cod_Motivo === codigo);
  this.nuevoReclamo.cod_Motivo = codigo;
  this.nuevoReclamo.motivoRegistro = motivo ? motivo.descripcion : '';
}  

mostrarAdvertencia(mensaje: string) {
  this.matSnackBar.open(mensaje, 'Cerrar', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['warning-snackbar']
  });
}  

mostrarBotonInforme(item: any): boolean {
  try {
    // Calidad (02) -> siempre ve el botón
    if (this.codArea.trim() === '02' && item.cod_Estado.trim() === '02') {
      return true;
    }

    // Comercial (01) -> solo si el estado es PROCESO
    if ((this.codArea.trim() === '01' || this.codArea.trim() === '02') && (item.cod_Estado.trim() === '03' || item.cod_Estado.trim() === '04')) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }  
}

mostrarBotonCerrar(item: any): boolean {
  try {
    // Comercial (01) -> solo si el estado es ATENDIDO (ejemplo: cod_Estado = '04')
    if (this.codArea.trim() === '01' && item.cod_Estado.trim() === '03') {
      return true;
    }

        // Comercial (01) -> solo si el estado es PROCESO
    if ((this.codArea.trim() === '01' || this.codArea.trim() === '02') && (item.cod_Estado.trim() === '04' || item.cod_Estado.trim() === '05')) {
      return true;
    }

    /*
    if (this.codArea.trim() === '01' && item.cod_Estado.trim() === '04') {
      return false;
    }    

    if (this.codArea.trim() === '02' && item.cod_Estado.trim() === '03') {
      return false;
    }

    if (this.codArea.trim() === '02' && item.cod_Estado.trim() === '04') {
      return true;
    }    
*/

    return false;
  } catch (error) {
    return false;
  }     
}

mostrarBotonEliminar(item: any): boolean {
    try {
    // Boton eliminar muestra solo al area de Comercial y Cuando el estado es 01
    if (this.codArea.trim() === '01' && item.cod_Estado.trim() === '01') {
      return true;
    }


    return false;
  } catch (error) {
    return false;
  }   
}

getExportarExcel(){

  this.SpinnerService.show();
  this.registroQuejasReclamosService.ExportarReclamo(this.nuevoReclamo).subscribe(
    (result: any) => {
      if (result.totalElements > 0) {
        this.dataExportar = result.elements;

        console.log('getExportarExcel', result.elements);

        /**************EXPORTAR EXCEL ***************/
        
        const dataExport = this.dataExportar.map(item => ({

                    'NRO. CASO':item.nroCaso,					
                      'FCH. REG.':item.fechaRegistro,			
                      'UNIDAD DE NEGOCIO ':item.nombreUnidadNegocio,		
                      'PARTIDA':item.cod_Ordtra,				
                      'CLIENTE':item.cliente,					
                      'TELA':item.cod_Tela,				
                      'DESCRIPCION TELA ':item.des_Tela,			
                      'COLOR ':item.cod_Color,				
                      'DESCRIPCION COLOR ':item.des_Color,				
                      'KGR ASIGNADOS':item.kgr_Asignados,			
                      'N° ROLLOS DESPACHADOS':item.nro_Rollos_Despachados,	
                      'OCOMPRA':item.orden_Compra,			
                      'ÁREA RESPONSABLE':item.area_Responsable,		
                      'USUARIO RESPONSABLE':item.usuario_Responsable,		
                      'MOTIVO DEL RECLAMO':item.motivoReclamo,			
                      'OBSERVACION':item.observacion,				
                      'ESTADO SOLICITUD':item.estado,					
                      'CONSECUENCIA PRINCIPAL':item.consecuencia_Principal,	
                      'SUBTIPO DE DEVOLUCION':item.tipo_Devolucion,			
                      'NOTA DE CREDITO':item.nota_Credito			
        }));
        
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
        const workbook: XLSX.WorkBook = { Sheets: { 'Reclamos': worksheet }, SheetNames: ['Reclamos'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(data, 'reclamos.xlsx');        
        this.SpinnerService.hide();
      }
      else {
        this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.SpinnerService.hide();
      }
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 1500,
    }))
    this.SpinnerService.hide();       
  }
}

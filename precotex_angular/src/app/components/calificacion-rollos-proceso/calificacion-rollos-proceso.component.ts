import { Component, OnInit } from '@angular/core';
import { Defecto, DefectoRegistrado, ProcesoAuditado, Supervisor,Auditor,Maquina, UnidadNegocio, EstadoPartida, Calificacion, Turno, PartidaItem, PartidaCabecera, EstadoProceso } from './calificacion-rollos-proceso.model';
import { CalificacionRollosProcesoService } from 'src/app/services/calificacion-rollos-proceso.service';
import { ModalSeleccionPartidaComponent } from './modal-seleccion-partida.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ModalMetrosComponent } from './modal-metros.component';

@Component({
  selector: 'app-calificacion-rollos-proceso',
  templateUrl: './calificacion-rollos-proceso.component.html',
  styleUrls: ['./calificacion-rollos-proceso.component.scss']
})


export class CalificacionRollosProcesoComponent implements OnInit {
  [x: string]: any;

  nuevoDefecto: Partial<Defecto> = {};
  defectoList: Defecto [] = [];
  defectosRegistrados: DefectoRegistrado[] = [];
  maquinaList: Maquina[] = [];
  supervisorList: Supervisor[] = [];
  auditorList: Auditor[] = [];
  partidaItemList: PartidaItem[] = [];
  partidaCabList: PartidaCabecera[] = [] ;

  turnoList: Turno[] = [];
  unidadNegocioList: UnidadNegocio[] = [];
  estadoPartidaList: EstadoPartida[] = [];
  procesoAuditadoaList: ProcesoAuditado[] = [];
  calificacionList: Calificacion[] = [];
  estadoProcesoList: EstadoProceso[] = [];
  resultadoBusqueda: any[] = [];

  // Simuladores para formulario
  selectedMaquina: string = '';
  selectedAuditor: string = '';
  selectedSupervisor: string = '';
  selectedTurno: string = '';
  datosPartida: string = '';
  datosTela: string = '';
  datosCliente: string = '';
  datosObservaciones: string = '';
  isLoading: boolean = false;
  sinResultados: boolean = false;
  ultimoCaracter: string = "";
  secuencia: string = "";
  ultimoItemSeleccionado: any = null;
  isSaving: boolean = false;
  mensajeExito: string = '';

  pagedPartidaItemList: any[] = [];
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;
  p: number = 1; // Página actual

  sAncho: string = '';
  sDensidad: string = '';
  sboolean: boolean = true;

  showOptionsPopup = false;
  selectedCodMotivo: string | null = null;
  sCod_Usuario = GlobalVariable.vusu;
  totalItems: number = 0;
  selectedCategoria: string = '';
  primerosDos: string = '';

  PartidaCab = {
    usuario: '',
    auditor: '',
    supervisor: '',
    maquina: '',
    turno: '',
    unidadNegocio: '',
    estadoPartida: '',
    estadoProceso: '',
    procesoAuditado:'',
    calificacion: '',
    observaciones: '',
    datosPartida: '',
    datosTela: '',
    datosCliente: '',
    detPartida: [] as any[],  // 👈 lista de detalles seleccionados
    detDefecto: [] as any[],
    detRectilineo: [] as any[]
  };

  defectoPorPartida: boolean = false;
  checkboxSeleccionado: boolean = false;

  constructor(private CalificacionRollosProcesoService: CalificacionRollosProcesoService, private dialog: MatDialog) {

   }

  ngOnInit(): void {

    this.cargarMaquina();
    this.cargarAuditor();
    this.cargarSupervisor();
    this.cargarTurno();
    this.cargarUnidadNegocio();
    this.cargarEstadoPartida();
    this.cargarCalificacion();
    this.cargarEstadoProceso();
    this.cargarProcesoAuditado();
    //this.primerosDos = 'RE';//this.textoOriginal.substring(0, 2);
  }

  cargarDefectos(nuevoDefecto: string) {

    this.selectedCategoria = nuevoDefecto;

    this.nuevoDefecto.coD_MOTIVO = nuevoDefecto;
    this.CalificacionRollosProcesoService.ObtenerDefecto(this.nuevoDefecto).subscribe({
      next: (response) => {
        this.defectoList = response.elements;
        //this.setPageB(1);

      },
      error: (err) => {
        console.error('Error al ObtenerDefecto', err);
      }
    });
  }

  cargarMaquina() {

    this.CalificacionRollosProcesoService.obtenerMaquina().subscribe({
      next: (response) => {
        this.maquinaList = response.elements;

        if (this.maquinaList.length > 0) {
          this.PartidaCab.maquina = this.maquinaList[0].acronimo.toString();
        }
        console.log('maquinaList:', this.maquinaList);
      },
      error: (err) => {
        console.error('Error al maquinaList', err);
      }
    });
  }

  cargarSupervisor() {

    this.CalificacionRollosProcesoService.obtenerSupervisor().subscribe({
      next: (response) => {
        this.supervisorList = response.elements;
        console.log('supervisorList:', this.supervisorList);
        if (this.supervisorList.length > 0) {
          this.PartidaCab.supervisor = this.supervisorList[0].acronimo.toString();
        }
        console.log('supervisorList:', this.supervisorList);
      },
      error: (err) => {
        console.error('Error al supervisorList', err);
      }
    });
  }

  cargarAuditor() {

    this.CalificacionRollosProcesoService.obtenerAuditor().subscribe({
      next: (response) => {
        this.auditorList = response.elements;
        if (this.auditorList.length > 0) {
          this.PartidaCab.auditor = this.auditorList[0].acronimo.toString();
        }
        console.log('auditorList:', this.auditorList);
      },
      error: (err) => {
        console.error('Error al auditorList', err);
      }
    });
  }

  cargarTurno() {

    this.CalificacionRollosProcesoService.obtenerTurno().subscribe({
      next: (response) => {
        this.turnoList = response.elements;

        if (this.turnoList.length > 0) {
          this.PartidaCab.turno = this.turnoList[0].acronimo.toString();
        }
        console.log('turnoList:', this.turnoList);
      },
      error: (err) => {
        console.error('Error al turnoList', err);
      }
    });
  }

  cargarUnidadNegocio() {

    this.CalificacionRollosProcesoService.obtenerUnidadNegocio().subscribe({
      next: (response) => {
        this.unidadNegocioList = response.elements;

        if (this.unidadNegocioList.length > 0) {
          this.PartidaCab.unidadNegocio = this.unidadNegocioList[0].acronimo.toString();
        }
        console.log('unidadNegociorList:', this.unidadNegocioList);
      },
      error: (err) => {
        console.error('Error al unidadNegociorList', err);
      }
    });
  }

  cargarEstadoPartida() {

    this.CalificacionRollosProcesoService.obtenerEstadoPartida().subscribe({
      next: (response) => {
        this.estadoPartidaList = response.elements;

        if (this.estadoPartidaList.length > 0) {
          this.PartidaCab.estadoPartida = this.estadoPartidaList[0].acronimo.toString();
        }
        console.log('estadoPartidaList:', this.estadoPartidaList);
      },
      error: (err) => {
        console.error('Error al estadoPartidaList', err);
      }
    });
  }

  cargarProcesoAuditado() {

    this.CalificacionRollosProcesoService.obtenerProcesoAuditado().subscribe({
      next: (response) => {
        this.procesoAuditadoaList = response.elements;

        if (this.procesoAuditadoaList.length > 0) {
          this.PartidaCab.procesoAuditado = this.procesoAuditadoaList[0].acronimo.toString();
        }
        console.log('obtenerProcesoAuditado:', this.procesoAuditadoaList);
      },
      error: (err) => {
        console.error('Error al obtenerProcesoAuditado', err);
      }
    });
  }

  cargarCalificacion() {

    this.CalificacionRollosProcesoService.obtenerCalificacion().subscribe({
      next: (response) => {
        this.calificacionList = response.elements;

        if (this.calificacionList.length > 0) {
          this.PartidaCab.calificacion = this.calificacionList[0].acronimo.toString();
        }
        console.log('calificacionList:', this.calificacionList);
      },
      error: (err) => {
        console.error('Error al calificacionList', err);
      }
    });
  }

  cargarEstadoProceso() {
    this.CalificacionRollosProcesoService.obtenerEstadoProceso().subscribe({
      next: (response) => {
        this.estadoProcesoList = response.elements;

        if (this.estadoProcesoList.length > 0) {
          this.PartidaCab.estadoProceso = this.estadoProcesoList[0].acronimo.toString();
        }
        console.log('estadoProcesoList:', this.estadoProcesoList);
      },
      error: (err) => {
        console.error('Error al estadoProcesoList', err);
      }
    });
  }

  buscar(): void {
    const codOrdTra = this.PartidaCab.datosPartida;

    this.isLoading = true;
    this.sinResultados = false;
    this.resultadoBusqueda = [];

    this.CalificacionRollosProcesoService.buscarPorPartida(codOrdTra).subscribe({
      next: (data) => {
        this.isLoading = false;
        console.log('data buscarPorPartida:', data);
        if (!data || data.length === 0) {
          this.sinResultados = true;
          return;
        }

        const dialogRef = this.dialog.open(ModalSeleccionPartidaComponent, {
          width: '400px',
          data: data.elements

        });


        dialogRef.afterClosed().subscribe(result => {

          if (result >= 0 && result != null) {

            this.PartidaCab.datosTela =  data.elements[result].articulo;
            this.PartidaCab.datosCliente =  data.elements[result].descripcion;

            const index = result + 1;
            this.secuencia = index;

            this.primerosDos = this.PartidaCab.datosTela.substring(0, 2);

            console.log('Seleccionaste:', result);
            this.CalificacionRollosProcesoService.buscarRolloPorPartidaDetalle(codOrdTra, index).subscribe({
              next: (response) => {
                this.partidaItemList = response.elements;

                this.setPage(1);
                console.log('partidaItemList:', this.partidaItemList);
              },
              error: (err) => {
                console.error('Error al partidaItemList', err);
              }
            });
            this.cargarDefectos("");
          }
          else{
            this.currentPage = 1;
            this.totalPages = 1;
          }
        });

      },
      error: (err) => {
        this.isLoading = false;
        this.sinResultados = true;
        console.error('Error al buscar partida:', err);
      }
    });

  }

  setPage(page: number): void {
    this.currentPage = page;

    this.totalPages = Math.ceil(
      this.partidaItemList.length / this.pageSize
    );
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize,
      this.partidaItemList.length
    );
    this.pagedPartidaItemList = this.partidaItemList.slice(startIndex, endIndex);
    this.totalItems = this.partidaItemList.length;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  toggleSeleccion(item: any, index: number): void {
    // Desmarcar todos los demás
    this.pagedPartidaItemList.forEach(el => el.sel = false);

    // Marcar solo el actual
    item.sel = true;
    this.ultimoItemSeleccionado = item;

    // Eliminar anteriores
    this.PartidaCab.detPartida = this.PartidaCab.detPartida.filter(p => p.rollo !== item.rollo);

    if (item.sel) {
      // ✅ Si tiene archivo, se incluye con el item automáticamente
      //this.PartidaCab.detPartida.push({ ...item }); // copia completa del item con archivo incluido
    }
  }

  eliminarDefecto(defecto: any, index: number): void {
    this.defectosRegistrados.splice(index, 1);
  }

  trackByFn(index: number, item: any): any {
    return item.id; // Or a unique identifier for each item
  }

  isAllSelected(): boolean {
    return this.pagedPartidaItemList.every(item => item.sel);
  }

  toggleSeleccionTodos(event: Event): void {
    //const checked = (event.target as HTMLInputElement).checked;
    //this.pagedPartidaItemList.forEach(item => (item.sel = checked));

    const checkbox = event.target as HTMLInputElement;
    this.checkboxSeleccionado = checkbox.checked;

    // Limpiar listas asociadas
    this.defectosRegistrados = [];
    this.pagedPartidaItemList = [];
    this.defectoList = [];

    const codOrdTra = this.PartidaCab.datosPartida;

    if (this.checkboxSeleccionado) {
      this.CalificacionRollosProcesoService.buscarArticuloPorPartida(codOrdTra).subscribe({
        next: (data) => {
          this.isLoading = false;
          console.log('data buscarArticuloPorPartida:', data);
          if (!data || data.length === 0) {
            this.sinResultados = true;
            return;
          }

          this.PartidaCab.datosTela = data.elements[0].articulo;
          this.PartidaCab.datosCliente = data.elements[0].descripcion.split('|')[0].trim();

          const index = '1';

          this.CalificacionRollosProcesoService.buscarRolloPorPartidaDetalle(codOrdTra, index).subscribe({
            next: (response) => {
              this.partidaItemList = response.elements;
              //this.setPage(1);
              console.log('partidaItemList:', this.partidaItemList);
            },
            error: (err) => {
              console.error('Error al partidaItemList', err);
            }
          });

          this.cargarDefectos("");
          this.PartidaCab.detPartida.push({ partidaItemList: this.partidaItemList }); // copia completa del item con archivo incluido

        },
        error: (err) => {
          this.isLoading = false;
          this.sinResultados = true;
          console.error('Error al buscar partida:', err);
        }
      });
    }

    else{

      this.PartidaCab.datosTela = '';
      this.PartidaCab.datosCliente = '';
      this.totalItems = 0;
    }

  }

  openOptionsPopup(codMotivo: string) {
    this.selectedCodMotivo = codMotivo;
    this.showOptionsPopup = true;
    this.selectedOptions = ['']; // Resetear las selecciones al abrir
  }

  closeOptionsPopup() {
    this.showOptionsPopup = false;
    this.selectedCodMotivo = null;
  }

  selectOption(index: number, value: string) {
    this.selectedOptions[index - 1] = value;
    if (this.selectedCodMotivo !== null) {
        this.captureOptions();
        this.closeOptionsPopup();

    }
  }

  captureOptions() {

    if(!this.checkboxSeleccionado){
      if (this.selectedCodMotivo !== null && this.selectedOptions[0] && this.ultimoItemSeleccionado) {
        const codMot = this.selectedCodMotivo;
        this.dialog.open(ModalMetrosComponent, {
          width: '300px'
        }).afterClosed().subscribe((metrosIngresados: number) => {
          if (metrosIngresados !== undefined && !isNaN(metrosIngresados)) {
            const nuevoDefecto = {
              codTela: this.PartidaCab.datosTela.split('-')[0].trim(),
              codRollo: this.ultimoItemSeleccionado.rollo,
              codMotivo: codMot,
              grado: this.selectedOptions[0],
              metros: metrosIngresados,
              sel: false
            };

            this.defectosRegistrados.push(nuevoDefecto);
            console.log('✅ Defecto registrado con metros:', nuevoDefecto);
          } else {
            console.warn('❗ Ingreso de metros cancelado o inválido.');
          }
        });
      } else {
        console.warn('⚠️ Seleccione un grado y una fila antes de continuar.');
      }
    }
    else{

      const codMot = this.selectedCodMotivo;
      const nuevoDefecto = {
        codTela: this.PartidaCab.datosTela.split('-')[0].trim(),
        codRollo: this.PartidaCab.datosPartida,
        codMotivo: codMot,
        grado: this.selectedOptions[0],
        metros: 0,
        sel: false
      };
      this.defectosRegistrados.push(nuevoDefecto);

    }
  }

  registrar() {
    this.isSaving = true;
    this.mensajeExito = '';
    console.log('this.defectosRegistrados:', this.defectosRegistrados);
    this.defectosRegistrados.forEach(defecto => {
      this.PartidaCab.detDefecto.push(defecto);
    });

    this.PartidaCab.usuario = this.sCod_Usuario;

    this.CalificacionRollosProcesoService.guardarPartida(this.PartidaCab).subscribe(
      (response) => {
        console.log('✅ Data saved successfully:', response);
        this.isSaving = false;
        this.mensajeExito = '✅ Partida registrada correctamente 🎉';

        this.resetFormulario();
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          this.mensajeExito = '';
        }, 5000);
      },
      (error) => {
        console.error('❌ Error saving data:', error);
        this.isSaving = false;
        this.mensajeExito = '❌ Ocurrió un error al guardar los datos.';

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          this.mensajeExito = '';
        }, 5000);
      }
    );
  }

  //LIMPIA LOS FORMULARIOS
  resetFormulario(): void {
    // Limpiar datos de cabecera
    this.PartidaCab = {

      usuario: '',
      auditor: '',
      supervisor: '',
      maquina: '',
      turno: '',
      unidadNegocio: '',
      estadoPartida: '',
      procesoAuditado: '',
      estadoProceso: '',
      calificacion: '',
      observaciones: '',
      datosPartida: '',
      datosTela: '',
      datosCliente: '',
      detPartida: [],
      detDefecto: [],
      detRectilineo: [] as any[]
      // Agrega cualquier otro campo si corresponde
    };

    // Limpiar listas asociadas
    this.defectosRegistrados = [];
    this.pagedPartidaItemList = [];
    this.defectoList = [];

    // Limpiar selección
    this.selectedCodMotivo = null;
    this.selectedOptions = [];
    this.ultimoItemSeleccionado = null;
    this.totalItems = 0;

    this.cargarMaquina();
    this.cargarAuditor();
    this.cargarSupervisor();
    this.cargarTurno();
    this.cargarUnidadNegocio();
    this.cargarEstadoPartida();
    this.cargarCalificacion();
    this.cargarEstadoProceso();
    this.cargarProcesoAuditado();

  }

  limpiar(){
    this.resetFormulario();
  }

  editarItem(item: any): void {
    // Desactivar edición en todos los demás
    //this.pagedPartidaItemList.forEach(i => i.isEditing = false);

    // Activar solo en el item actual
    item.isEditing = true;

  }

  guardarEdicion(item: any) {

    if(this.sboolean){
      this.sAncho = item.ancho;
      this.sDensidad = item.densidad;
      this.sboolean = false;
    }
    item.ancho = this.sAncho;
    item.densidad = this.sDensidad;

    this.pagedPartidaItemList.forEach(i => i.isEditing = false);
    this.PartidaCab.detPartida.push({ ...item }); // copia completa del item con archivo incluido

    /*if (item.mtrsAuditados > 0 && item.ancho > 0 && item.densidad > 0) {
      this.pagedPartidaItemList.forEach(i => i.isEditing = false);
      this.PartidaCab.detPartida.push({ ...item }); // copia completa del item con archivo incluido
    } else {
      alert('Debes completar los tres campos antes de guardar.');
    }*/
  }

  onFileSelected(event: Event, item: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      item.archivoNombre = file.name;
      item.archivo = file;

      this.PartidaCab.detPartida = this.PartidaCab.detPartida.filter(p => p.rollo !== item.rollo);
      this.PartidaCab.detPartida.push({ ...item });

      this.CalificacionRollosProcesoService.subirArchivo(file).subscribe({
        next: (res) => {
          console.log('✅ Archivo subido con éxito:', res);
        },
        error: (err) => {
          console.error('❌ Error al subir archivo:', err);
        }
      });
    }
  }

}

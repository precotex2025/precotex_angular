import { Component, OnInit } from '@angular/core';
import { Defecto, DefectoRegistrado, ProcesoAuditado, Supervisor,Auditor,Maquina, UnidadNegocio, EstadoPartida, Calificacion, Turno, PartidaItem, PartidaCabecera, EstadoProceso, UnionRollosCabecera, GuardarUnionRollos } from './calificacion-rollos-final.model';
import { CalificacionRollosFinalService } from 'src/app/services/calificacion-rollos-final.service';
import { ModalSeleccionPartidaFComponent } from './modal-seleccion-partida.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ModalMetrosFComponent } from './modal-metros.component';
import { Console } from 'node:console';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calificacion-rollos-final',
  templateUrl: './calificacion-rollos-final.component.html',
  styleUrls: ['./calificacion-rollos-final.component.scss']
})
export class CalificacionRollosFinalComponent implements OnInit {
  
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
    unionRollosList: UnionRollosCabecera[] = [];
    nuevoUnionRollos: Partial<UnionRollosCabecera> = {};
    guardarUnionRollos: Partial<GuardarUnionRollos> = {};

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

    //sprim5mts: string = '';
    //spedio: string = '';
    //splt5mts: string = '';
    //sancho: string = '';
    //sdensidad: string = '';
    //sboolean: boolean = true;

    showOptionsPopup = false;
    selectedCodMotivo: string | null = null;
    sCod_Usuario = GlobalVariable.vusu;
    totalItems: number = 0;
    selectedCategoria: string = '';
    primerosDos: string = '';

    mostrarModalRectilineo = false;
    itemSeleccionado: any = null;
    rolloSeleccionado: string | null = null;

    isAuditorDisabled: boolean = true;

    nuevoDato = {
      partida: '',
      codTalla: '',
      cantidad: 0,
      calidad: 0,

    };

    listaRectilineos: any[] = [];

    cantRollos: number = 0;
    calidad: string = '';

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
      ancho: '',
      densidad: '',
      detPartida: [] as any[],  // 👈 lista de detalles seleccionados
      detDefecto: [] as any[],
      detRectilineo: [] as any[],
      detRollosTotal: [] as any[], // 👈 lista de rollos totales
    };

    rollo2Bloqueado: boolean = true;
    mostrarModal = false;
    rollo1 = {
      codigo: '',
      kilos: 0,
      talla: '',
      unidades: 0,
      ot_tejeduria:''
    };
    rollo2 = {
      codigo: '',
      kilos: 0,
      talla: '',
      unidades: 0,
      ot_tejeduria:''
    };

    dataListadoDefectos: Array<any> = [];
    anchoGral: number = 0;
    codTelaGral: string = '';


    constructor(private CalificacionRollosFinalService: CalificacionRollosFinalService, 
                private dialog            : MatDialog,
                private SpinnerService    : NgxSpinnerService) {

     }

  ngOnInit(): void {        

    this.cargarAuditor();
    this.cargarSupervisor();
    this.cargarMaquina();
    this.cargarTurno();
    this.cargarUnidadNegocio();
    this.cargarEstadoPartida();
    this.cargarCalificacion();
    this.cargarEstadoProceso();
    this.cargarProcesoAuditado();

    //Deshabilita los controles Generales
    this.isHeadDisabled = true;
  }

  cargarDefectos(nuevoDefecto: string) {

    this.selectedCategoria = nuevoDefecto;

    this.nuevoDefecto.coD_MOTIVO = nuevoDefecto;
    this.CalificacionRollosFinalService.ObtenerDefecto(this.nuevoDefecto).subscribe({
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

    this.CalificacionRollosFinalService.obtenerMaquina().subscribe({
      next: (response) => {
        this.maquinaList = response.elements;

        // if (this.maquinaList.length > 0) {
        //   this.PartidaCab.maquina = this.maquinaList[0].acronimo.toString();
        // }
      },
      error: (err) => {
        console.error('Error al maquinaList', err);
      }
    });
  }

  cargarSupervisor() {

      this.CalificacionRollosFinalService.obtenerSupervisor().subscribe({
        next: (response) => {
          this.supervisorList = response.elements;
          // if (this.supervisorList.length > 0) {
          //   this.PartidaCab.supervisor = this.supervisorList[0].acronimo.toString();
          // }
        },
        error: (err) => {
          console.error('Error al supervisorList', err);
        }
      });
    }

    cargarAuditor() {

      this.CalificacionRollosFinalService.obtenerAuditor().subscribe({
        next: (response) => {
          this.auditorList = response.elements;
          // if (this.auditorList.length > 0) {
          //   this.PartidaCab.auditor = this.auditorList[0].acronimo.toString();
          // }
        },
        error: (err) => {
          console.error('Error al auditorList', err);
        }
      });
    }

    cargarTurno() {

      this.CalificacionRollosFinalService.obtenerTurno().subscribe({
        next: (response) => {
          this.turnoList = response.elements;

          if (this.turnoList.length > 0) {
            this.PartidaCab.turno = this.turnoList[0].acronimo.toString();
          }
        },
        error: (err) => {
          console.error('Error al turnoList', err);
        }
      });
    }

    cargarUnidadNegocio() {

      this.CalificacionRollosFinalService.obtenerUnidadNegocio().subscribe({
        next: (response) => {
          this.unidadNegocioList = response.elements;

          if (this.unidadNegocioList.length > 0) {
            this.PartidaCab.unidadNegocio = this.unidadNegocioList[0].acronimo.toString();
          }
        },
        error: (err) => {
          console.error('Error al unidadNegociorList', err);
        }
      });
    }

    cargarEstadoPartida() {

      this.CalificacionRollosFinalService.obtenerEstadoPartida().subscribe({
        next: (response) => {
          this.estadoPartidaList = response.elements;

          if (this.estadoPartidaList.length > 0) {
            this.PartidaCab.estadoPartida = this.estadoPartidaList[0].acronimo.toString();
          }
        },
        error: (err) => {
          console.error('Error al estadoPartidaList', err);
        }
      });
    }

    cargarProcesoAuditado() {

      this.CalificacionRollosFinalService.obtenerProcesoAuditado().subscribe({
        next: (response) => {
          this.procesoAuditadoaList = response.elements;

          if (this.procesoAuditadoaList.length > 0) {
            this.PartidaCab.procesoAuditado = this.procesoAuditadoaList[0].acronimo.toString();
          }
        },
        error: (err) => {
          console.error('Error al obtenerProcesoAuditado', err);
        }
      });
    }

    cargarCalificacion() {

      this.CalificacionRollosFinalService.obtenerCalificacion().subscribe({
        next: (response) => {
          this.calificacionList = response.elements;

          if (this.calificacionList.length > 0) {
            this.PartidaCab.calificacion = this.calificacionList[0].acronimo.toString();
          }
        },
        error: (err) => {
          console.error('Error al calificacionList', err);
        }
      });
    }

    cargarEstadoProceso() {
      this.CalificacionRollosFinalService.obtenerEstadoProceso().subscribe({
        next: (response) => {
          this.estadoProcesoList = response.elements;

          if (this.estadoProcesoList.length > 0) {
            this.PartidaCab.estadoProceso = this.estadoProcesoList[0].acronimo.toString();
          }
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
      this.pagedPartidaItemList = [];

      this.CalificacionRollosFinalService.buscarPorPartida(codOrdTra).subscribe({
        next: (data) => {
          this.isLoading = false;
          if (!data || data.length === 0) {
            this.sinResultados = true;
            return;
          }

          this.dataListadoDefectos = [];//nUEVO lISTADO DE DEFECTOS

          const dialogRef = this.dialog.open(ModalSeleccionPartidaFComponent, {
            width: '400px',
            data: data.elements
          });

          dialogRef.afterClosed().subscribe(result => {
            
            if (result >= 0 && result != null) {
              console.log('result', result);
              //NuevO Habilita los controles generales
              this.isHeadDisabled = false;

              this.PartidaCab.datosTela =  data.elements[result].articulo;
              this.PartidaCab.datosCliente =  data.elements[result].descripcion;
              this.PartidaCab.ancho = String(data.elements[result].ancho) == "0"? "": String(data.elements[result].ancho);
              console.log('ancho', data.elements[result].ancho);
              //Nuevas  
              this.PartidaCab.auditor = data.elements[result].inspector;              
              this.PartidaCab.supervisor =     data.elements[result].responsable;

              //OBSERVACION
              const obs : string = "";
              if (data && data.elements && data.elements[result] && data.elements[result].observacion) {
                //console.log('OBSERVACION',data.elements[result].observacion);
                this.obs = data.elements[result].observacion
              } else {
                //console.log("No tiene observación");
                this.obs = ""
              }
              this.PartidaCab.observaciones = this.obs;
              //this.PartidaCab.observaciones = String(data.elements[result].observacion) == "0"?"":data.elements[result].observacion;
              
              //Se envia el ancho gral a una variable para la retencion
              const sArticuloLargo = data.elements[result].articulo;
              this.anchoGral = data.elements[result].ancho;
              
              const sArticulo = sArticuloLargo.substring(0, 8);
              this.codTelaGral = sArticulo;

              const index = result + 1;
              this.secuencia = index;

              this.primerosDos = this.PartidaCab.datosTela.substring(0, 2);

              //Nuevas Variables
              const sObs:string     = ' ';//this.PartidaCab.observaciones.trim() || ' ';
              const sCodUsu:string  = GlobalVariable.vusu;
              const sReco:string    = ' ';
              const sIns:string     = ' ';//this.PartidaCab.supervisor;
              const sResDig:string  = ' ';//this.PartidaCab.auditor;
              const sObsRec:string  = ' ';

              const sCodTela:string = String(this.PartidaCab.datosTela.substring(0,8)); 
              const sCodCali: string = ' ';//tring(data.elements[result].calidad);
              
              
              this.CalificacionRollosFinalService.buscarRolloPorPartidaDetalle(codOrdTra, index, 

                sObs    ,
                sCodUsu ,
                sReco   ,
                sIns    ,
                sResDig ,
                sObsRec ,
                sCodCali,
                sCodTela

              ).subscribe({
                next: (response) => {
                  this.partidaItemList = response.elements;
                  //console.log('buscar',this.partidaItemList);

                  console.log('this.PartidaCab - buscar', this.PartidaCab);
                  
                  
                  //Agrega todos los rollos al detalle
                  this.PartidaCab.detRollosTotal = [];
                  this.partidaItemList.forEach(defecto => {
                    this.PartidaCab.detRollosTotal.push({"rollo" : defecto.rollo});
                  });

                  console.log('Inicial - this.PartidaCab.detRollosTotal', this.PartidaCab.detRollosTotal);

      
                  this.setPage(1);
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

      console.log('verifica hasta qui que contiene PartidaCab', this.PartidaCab.detPartida);
      
      if (item.sel) {
        // ✅ Si tiene archivo, se incluye con el item automáticamente
        this.rolloSeleccionado = item.rollo;
        this.PartidaCab.detPartida.push({ ...item }); // copia completa del item con archivo incluido
      }
      
      //Listar los defectos del rollo
      const sCodOrdTra        =  this.PartidaCab.datosPartida;
      const sPrefijoMaquina   = item.rollo.split('-')[0]; // "08"
      const sCodigoRollo      = item.rollo.split('-')[1]; // "BO355" o "BO355B"      

      if (item.rollo.length > 19){
        this.getObtenerDefectosRegistradosPorRollo(sCodOrdTra, "", item.rollo);
      }else {
        if (!sCodigoRollo){
          this.getObtenerDefectosRegistradosPorRollo(sCodOrdTra, "", sPrefijoMaquina);
        }else {
          this.getObtenerDefectosRegistradosPorRollo(sCodOrdTra, sPrefijoMaquina, sCodigoRollo);
        }
      }

      
      //this.PartidaCab.detPartida.push({ ...item });

    }

    eliminarDefecto(defecto: any, index: number): void {

      Swal.fire({
        title: '¿Esta seguro de eliminar el Defecto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {

          const sCodOrdTra        = this.PartidaCab.datosPartida;
          const sCodRollo         = defecto.codigo_Rollo;
          const sCodMotivo        = defecto.cod_Motivo;

          //Proceso de registrar
          let data: any = {
            Codigo_Rollo: (sCodRollo.length>19?sCodRollo:!sCodRollo.split('-')[1]?sCodRollo:sCodRollo.split('-')[1]),
            Cod_Motivo  : sCodMotivo,
            Cod_OrdTra  : sCodOrdTra
          }             
          
          //Eliminar
          this.SpinnerService.show();
          this.CalificacionRollosFinalService.postEliminarDefectoRollo(data).subscribe({
              next: (response: any)=> {
                if(response.success){
                  if (response.codeResult == 200){

                    this.mensajeExito = response.message;
                    setTimeout(() => {
                      this.mensajeExito = '';
                    }, 5000);                    

                    const sPrefijoMaquina   = sCodRollo.split('-')[0]; // "08"
                    const sCodigoRollo      = sCodRollo.split('-')[1]; // "BO355" o "BO355B"                          
                    //Listar 
                    this.getObtenerDefectosRegistradosPorRollo(sCodOrdTra, sPrefijoMaquina ,sCodigoRollo);

                  }else if(response.codeResult == 201){
                    this.mensajeExito = response.message;
                    setTimeout(() => {
                      this.mensajeExito = '';
                    }, 5000);     
                    this.SpinnerService.hide();
                  }
                  this.SpinnerService.hide();
                }else{
                    this.mensajeExito = response.message;
                    setTimeout(() => {
                      this.mensajeExito = '';
                    }, 5000);  
                  this.SpinnerService.hide();
                }
              },
              error: (error) => {
                this.SpinnerService.hide();
                this.mensajeExito = error.message;
                setTimeout(() => {
                  this.mensajeExito = '';
                }, 5000);  
              }
            });        
          

        }else{
            //Verifica si obtiene version
            //this.getObtieneVersionArranque(data, Cod_Ordtra, Num_Secuencia);
        }
      });            




      //Antes
      //this.defectosRegistrados.splice(index, 1);
    }

    trackByFn(index: number, item: any): any {
      return item.id; // Or a unique identifier for each item
    }

    isAllSelected(): boolean {
      return this.pagedPartidaItemList.every(item => item.sel);
    }

    toggleSeleccionTodos(event: Event): void {
      const checked = (event.target as HTMLInputElement).checked;
      this.pagedPartidaItemList.forEach(item => (item.sel = checked));
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
      //Limpia el contenedor de defecto
      this.PartidaCab.detDefecto = [];

      this.selectedOptions[index - 1] = value;
      if (this.selectedCodMotivo !== null) {
        //Capturar datos de Motivo
        this.captureOptions();
        //this.registrarDefectosPartidas();
        //this.closeOptionsPopup();
      }
    }

    captureOptions() {
      if (this.selectedCodMotivo !== null && this.selectedOptions[0] && this.ultimoItemSeleccionado) {
        const codMot = this.selectedCodMotivo;

        this.dialog.open(ModalMetrosFComponent, {
          width: '300px'
        }).afterClosed().subscribe((result) => {

          //Obtiene la informacion desde el Dialog o Modal
          const iMetros = result.metros;
          const iCantidad = result?.cantidad ?? 0;; 

          const nuevoDefecto = {
            codTela: this.PartidaCab.datosTela.split('-')[0].trim(),
            codRollo: this.ultimoItemSeleccionado.rollo,
            codMotivo: codMot,
            grado: this.selectedOptions[0],
            cantidad: iCantidad, //Nuevo
            metros: iMetros,
            sel: false
          };

          //Agregado por Henry Medina - 23/07/2025
          this.PartidaCab.detDefecto.push(nuevoDefecto);

          //Aqui guardamos el defecto
          this.registrarDefectosPartidas(this.ultimoItemSeleccionado.rollo);

            //Comentado por hmedina 23/07/2025
            //this.defectosRegistrados.push(nuevoDefecto);

            console.log('✅ Defecto registrado con metros:', nuevoDefecto);
            
          });
        } else {
          console.warn('⚠️ Seleccione un grado y una fila antes de continuar.');
        }
      }

      registrarDefectosPartidas(sRollo: string) {
        this.isSaving = true;
        this.mensajeExito = '';
        this.PartidaCab.usuario = this.sCod_Usuario;
          
        this.CalificacionRollosFinalService.postGuardarDefectosPartida(this.PartidaCab).subscribe(
          (response) => {
            console.log('✅ Data saved successfully:', response);
            this.isSaving = false;
            this.mensajeExito = '✅ Defecto Registrado Correctamente 🎉';

            //Cierra el modal
            this.closeOptionsPopup();

            //YA NO LIMPIA 
            //this.resetFormulario();

            const sCodOrdTra        =  this.PartidaCab.datosPartida;
          const sPrefijoMaquina   = sRollo.split('-')[0]; // "08"
          const sCodigoRollo      = sRollo.split('-')[1]; // "BO355" o "BO355B"                
          this.getObtenerDefectosRegistradosPorRollo(sCodOrdTra,sPrefijoMaquina,sCodigoRollo);

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


    registrar() {
      this.isSaving = true;
      this.mensajeExito = '';

      this.defectosRegistrados.forEach(defecto => {
        this.PartidaCab.detDefecto.push(defecto);
      });

      console.log('Fin - this.PartidaCab.detRollosTotal', this.PartidaCab.detRollosTotal);

      this.PartidaCab.usuario = this.sCod_Usuario;
      this.CalificacionRollosFinalService.guardarPartida(this.PartidaCab).subscribe(
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
        ancho:'',
        densidad:'',
        detPartida: [],
        detDefecto: [],
        detRectilineo: [],
        detRollosTotal: [],
        // Agrega cualquier otro campo si corresponde
      };

      // Limpiar listas asociadas
      this.defectosRegistrados = [];
      this.pagedPartidaItemList = [];
      this.defectoList = [];
      this.dataListadoDefectos = [];//nUEVO lISTADO DE DEFECTOS

      // Limpiar selección
      this.selectedCodMotivo = null;
      this.selectedOptions = [];
      this.ultimoItemSeleccionado = null;
      this.totalItems = 0;

      //limpiar 
      this.maquinaList = [];
      this.auditorList = [];
      this.supervisorList = [];

      this.cargarMaquina();
      this.cargarAuditor();
      this.cargarSupervisor();
      this.cargarTurno();
      this.cargarUnidadNegocio();
      this.cargarEstadoPartida();
      this.cargarCalificacion();
      this.cargarEstadoProceso();
      this.cargarProcesoAuditado();

      //Deshabilita los controles Generales
      this.isHeadDisabled = true;

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

      //if(this.sboolean){
      
        //this.sprim5mts= item.prim5mts;
        //this.smedio = item.medio;
        //this.sult5mts= item.ult5mts;
        //this.sancho = item.ancho;
        //this.sdensidad = item.densidad;
        //this.sboolean = false;
      //}

      //item.prim5mts = this.sprim5mts;
      //item.medio = this.smedio;
      //item.ult5mts = this.sult5mts;
      //item.ancho = this.sancho;
      //item.densidad = this.sdensidad;

      /*AQUI VALIDAR SI EXISTE EL ROLLO DEBE DE QUITAR PORQUE QUIZAS FUE SELECCIONADO ANTES PARA AGREGAR UN DEFECTO*/

      const sRollo = String(item.rollo);
      // 1. Buscar si ya existe en la lista
      const index = this.PartidaCab.detPartida.findIndex(x => x.rollo === sRollo);
      // 2. Si existe, eliminarlo
      if (index !== -1) {
        this.PartidaCab.detPartida.splice(index, 1);
      }      


      this.pagedPartidaItemList.forEach(i => i.isEditing = false);
      this.PartidaCab.detPartida.push({ ...item }); // copia completa del item con archivo incluido
      /*if (item.mtrsAuditados > 0 && item.ancho > 0 && item.densidad > 0) {
        this.pagedPartidaItemList.forEach(i => i.isEditing = false);
        this.PartidaCab.detPartida.push({ ...item }); // copia completa del item con archivo incluido
      } else {
        alert('Debes completar los tres campos antes de guardar.');
      }*/

      console.log('boton guardar que tiene hasta aqui', this.PartidaCab.detPartida);
    }

    onFileSelected(event: Event, item: any): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];

        item.archivoNombre = file.name;
        item.archivo = file;

        this.PartidaCab.detPartida = this.PartidaCab.detPartida.filter(p => p.rollo !== item.rollo);
        //this.PartidaCab.detPartida.push({ ...item });

        this.CalificacionRollosFinalService.subirArchivo(file).subscribe({
          next: (res) => {
            console.log('✅ Archivo subido con éxito:', res);
          },
          error: (err) => {
            console.error('❌ Error al subir archivo:', err);
          }
        });
      }
    }

    declararRectilineo(item: any) {

      this.itemSeleccionado = item;
      this.mostrarModalRectilineo = true;
      this.nuevoDato.codTalla = item.med_Std.charAt(0);
      this.nuevoDato.partida = this.PartidaCab.datosPartida;
    }

    cerrarModal() {
      this.mostrarModalRectilineo = false;
      this.nuevoDato = { partida: '',codTalla: '', cantidad: 0, calidad: 0 };
    }

    agregarRectilineo() {
        if (this.nuevoDato.codTalla.trim() !== '' && this.nuevoDato.cantidad > 0 && this.nuevoDato.calidad !== 0 ) {
          this.listaRectilineos.push({
              partida : this.nuevoDato.partida,
              codTalla: this.nuevoDato.codTalla,
              cantidad: this.nuevoDato.cantidad,
              calidad: this.nuevoDato.calidad
          });
          // Agregar una copia del contenido a PartidaCab.detRectilineo
          if (!this.PartidaCab.detRectilineo) {
            this.PartidaCab.detRectilineo = [];

          }

          this.PartidaCab.detRectilineo = [...this.listaRectilineos];

          console.log('✅ Rectilineos actualizados:', this.listaRectilineos);
          console.log('✅ Archivo subido con éxito:fffffffffffffffffffffff', this.istaRectilineos);
          // Limpieza
          this.nuevoDato = { partida: '',codTalla: this.nuevoDato.codTalla, cantidad: 0 , calidad: 0};

      }
    }

    guardarRectilineo() {
        this.mostrarModalRectilineo = false;
        //console.log(this.listaRectilineos)
    }

    eliminarFila(index: number) {
      this.listaRectilineos.splice(index, 1);
    }

    abrirModalUnirRollos(item: any) {
      this.rollo1 = {
        codigo: item.rollo,
        kilos: item.kgs_Crudo,
        talla: item.med_Std, // o como venga el dato
        unidades: item.und_Crudo || 0, // si tienes esta info
        ot_tejeduria: item.ot_Tejeduria,
      };

      this.rollo2 = {
        codigo: '',
        kilos: 0,
        talla: '', // o como venga el dato
        unidades: 0, // si tienes esta info
        ot_tejeduria: item.ot_Tejeduria,
      };



      this.nuevoUnionRollos.cod_Ordtra = this.PartidaCab.datosPartida;
      this.nuevoUnionRollos.calidad = 5;
      this.nuevoUnionRollos.rollo = item.rollo;
      this.nuevoUnionRollos.med_std = item.med_Std;
      this.nuevoUnionRollos.tela_comb = item.tela_Comb;

      //console.log('this.nuevoUnionRollosdddddddddd:', this.this.nuevoUnionRollos);

      this.CalificacionRollosFinalService.obtenerDatosUnionRollos(this.nuevoUnionRollos).subscribe({
        next: (response) => {
          this.unionRollosList = response.elements;
        },
        error: (err) => {
          console.error('Error al unionRollosList', err);
        }
      });


      //this.rollo2 = { codigo: '', kilos: 0, talla: '', unidades: 0 };
      this.mostrarModal = true;

    }

    cerrarModal2() {
      this.mostrarModal = false;
      this.unionRollosList = [];
    }

    unirRollo() {

      this.guardarUnionRollos.usuario = this.sCod_Usuario;
      this.guardarUnionRollos.ot_tejeduria = this.rollo2.ot_tejeduria;
      this.guardarUnionRollos.rollo1 = this.rollo1.codigo;
      this.guardarUnionRollos.rollo2 = this.rollo2.codigo;

      this.CalificacionRollosFinalService.guardarDatosUnionRollos(this.guardarUnionRollos).subscribe({
        next: (response) => {
          this.unionRollosList = response.elements;
          console.log('guardarDatosUnionRollos:', this.unionRollosList);
        },
        error: (err) => {
          console.error('Error al guardarDatosUnionRollos', err);
        }
      });
      this.cerrarModal2();
    }

    seleccionarFila(dato: any): void {
      this.rollo2.codigo = dato.rollo || '';
      this.rollo2.kilos = dato.kgs_crudo || 0;
      this.rollo2.talla = dato.med_std || '';
      this.rollo2.unidades = dato.und_crudo || 0;
      this.rollo2Bloqueado = true;
    }


    getObtenerDefectosRegistradosPorRollo(Cod_OrdTra  : string, PrefijoMaquina: string, CodigoRollo: string){
      this.SpinnerService.show();
      this.dataListadoDefectos = [];
      const sCodTela = this.codTelaGral;


      this.CalificacionRollosFinalService.getObtenerDefectosRegistradosPorRollo(Cod_OrdTra, sCodTela, PrefijoMaquina, CodigoRollo).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.totalElements > 0){

              this.dataListadoDefectos = response.elements;
              //this.dataSource.data = this.dataListadoColgadores;

              this.SpinnerService.hide();
            }
            else{
              this.SpinnerService.hide();
              //this.dataSource.data = [];
              this.dataListadoDefectos = [];
            };
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          console.log(error.error.message, 'Cerrar', {
          timeOut: 2500,
          });
        }
      });  
    }
}

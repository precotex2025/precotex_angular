import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GlobalVariable } from '../../VarGlobals';
import { NoConformidadesService } from '../../services/no-conformidades.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { forkJoin, of, firstValueFrom } from 'rxjs';

export interface ArticuloPartida {
  id?: number;
  tipo: string;
  nombre: string;
  codTela: string;
  talla: string;
  kgCrudo: string;
  rollos: number;
}

export interface DefectoItem {
  motivo: string;
  isOtro: boolean;
  descripcionOtro: string;
  area: string;
  areaOtro: string;
  evidencia: { name: string; dataUrl: string }[];
  comentario?: string;
  open?: boolean;
}

export interface ArticuloSeleccionado {
  id?: number | string;
  tipo: string;
  nombre: string;
  codTela: string;
  talla: string;
  kgCrudo: string;
  rollos: number;
  cantidad: number | string;
  defectos: DefectoItem[];
  checked?: boolean;
  open?: boolean;
}

export interface HistorialItem {
  fecha: string;
  usuario: string;
  accion: string;
}

export interface NoConformidad {
  id: string;
  numero?: string;
  estado: string;
  status: string;
  proceso: string;
  fecha: string;
  registradoPor: string;
  partida: string;
  cliente: string;
  codCliente?: string;
  color: string;
  codColor?: string;
  peso: string;
  fechaPartida: string;
  area?: string;
  areas?: string;
  articulos: ArticuloSeleccionado[];
  articulosPartida?: ArticuloPartida[];
  comentario: string;
  historial: HistorialItem[];
  anulacion?: { motivo: string; usuario: string; fecha: string } | null;
}

export interface DefectoPendiente {
  descripcion: string;
  ncId: string;
  partida: string;
  articulo: string;
  fecha: string;
  usuario: string;
}

@Component({
  selector: 'app-no-conformidades',
  templateUrl: './no-conformidades.html',
  styleUrls: ['./no-conformidades.scss']
})
export class NoConformidadesComponent implements OnInit, AfterViewInit {

  // MatTable para lista de NCs
  @ViewChild('sortNc') sortNc!: MatSort;
  @ViewChild('paginatorNc') paginatorNc!: MatPaginator;
  @ViewChild('cameraVideo') cameraVideo!: ElementRef<HTMLVideoElement>;
  dataSourceNc = new MatTableDataSource<NoConformidad>();
  displayedColumnsNc: string[] = ['id', 'fecha', 'partida', 'cliente', 'color', 'areas', 'acciones'];

  // Cámara en tiempo real
  cameraModal = {
    open: false,
    target: 'grupo' as 'grupo' | 'modal',
    stream: null as MediaStream | null,
    error: ''
  };

  // Usuario actual
  sUsuario = GlobalVariable.vusu || 'J. Ramirez';
  
  // Vistas disponibles: 'inicio', 'paso1', 'paso2', 'paso3', 'detalle', 'defectosPendientes', 'revisarDefectoNuevo', 'grabarMotivo', 'evolutivo'
  currentScreen: string = 'inicio';

  // Base de datos de Partidas
  PARTIDAS_DB: { [key: string]: { cliente: string; color: string; peso: string; fecha: string; articulos: ArticuloPartida[] } } = {
    "07825": {
      cliente: "TEXTIL DORITEX",
      color: "CELESTE MEGO II",
      peso: "199.2 kg",
      fecha: "11/08/2026",
      articulos: [
        { id: 1, tipo: "Cuerpo", nombre: "Jersey Solido 20/1", codTela: "JE003285", talla: "-", kgCrudo: "191.1", rollos: 9 },
        { id: 2, tipo: "Complemento", nombre: "Rib 1x1 20/1", codTela: "RI001815", talla: "-", kgCrudo: "8.1", rollos: 1 }
      ]
    },
    "05796": {
      cliente: "Psyco Bunny",
      color: "BARITONE BLUE RECT",
      peso: "141.8 kg",
      fecha: "10/08/2026",
      articulos: [
        { id: 1, tipo: "Cuerpo", nombre: "Pique Lacoste PY ME", codTela: "PI000361", talla: "-", kgCrudo: "141.77", rollos: 8 }
      ]
    },
    "03181": {
      cliente: "VELASQUEZ TEXTILES",
      color: "DIVINO",
      peso: "120.0 kg",
      fecha: "10/08/2026",
      articulos: [
        { id: 1, tipo: "Cuerpo", nombre: "Algodon Pima 30/1", codTela: "AP004521", talla: "-", kgCrudo: "120.0", rollos: 6 }
      ]
    }
  };

  // Catálogos
  MOTIVOS: string[] = [
    "HI001 - ANILLADO POR HILO GRUESO/DELGADO",
    "HI002 - ANILLOSPOR LOTES DE HILO (UV)",
    "HI003 - BARRADO POR HILO TEÑIDO",
    "HI004 - BAJA RESISTENCIA",
    "HI005 - CONTAMINACIÓN DE POLIP.",
    "HI006 - CONTAMINACIÓN DE CASCARILLA",
    "HI007 - CONTAMINACIÓN DE FIBRAS MUERTAS",
    "HI008 - CONT. MALA MEZCLA DE MELANGE",
    "HI009 - HILO VETADO",
    "HI010 - IRREGULARIDAD DE HILO",
    "HI011 - MEZCLA DE LOTES Y/O BARRADO",
    "HI012 - NEPS NOTORIO",
    "HI013 - TRAMO GRUESO / DELGADO",
    "HI014 - TORSIÓN ELEVADA",
    "HI015 - VARIACIÓN DE TÍTULO",
    "HI016 - % DE FIBRA F/STD",
    "HI017 - MOTAS DE HILADO",
    "HI018 - METAMERIA",
    "HI019 - BARRADO",
    "HI020 - CONT. AMBIENTE",
    "HI023 - MIGRACIÓN DE HILO",
    "HI024 - MALA SOLIDEZ",
    "TEJ021 - AGUJEROS MENORES A 1CM",
    "TEJ022 - ANILLOS POR MEZCLA DE TÍTULOS",
    "TEJ023 - ANILLOS POR TENSIÓN DE MÁQUINA",
    "TEJ024 - CORDONES DE HILOS DOBLES",
    "TEJ025 - CONT. FIBRILLA HILO COLOR",
    "TEJ026 - CONTAMINACIÓN DE COLITAS",
    "TEJ027 - CONTAMINACIÓN DE AMBIENTE",
    "TEJ028 - CAÍDAS DE TEJIDO",
    "TEJ029 - DISEÑO DE RAPPORT EQUIVOCADO",
    "TEJ030 - ESCAPE DE LYCRA",
    "TEJ031 - FUGAS DE PUNTO",
    "TEJ032 - FALLA DE AGUJA ROTA",
    "TEJ033 - FLOTANTES SUELTOS",
    "TEJ034 - LYCRA ROTA",
    "TEJ035 - LÍNEAS DE ACEITE",
    "TEJ036 - LÍNEAS VERTICALES DE PLATINA",
    "TEJ037 - LONGITUD DE MALLA F/ STD",
    "TEJ038 - MANCHAS EN GOTAS DE ACEITE",
    "TEJ039 - MARCA DE DOBLES DE CHUCO",
    "TEJ040 - MANCHAS DE GRASA",
    "TEJ041 - PATA DE GALLO (AGUJA FORZADA)",
    "TEJ042 - RAPPORT F/STD",
    "TEJ043 - TRASPASO O ANILLOS DE HILO ROTO",
    "TEJ044 - MOTAS DE TEJIDO",
    "TEJ045 - CARRETE DIRECTO",
    "TEJ046 - MARCA DE AGUJA",
    "TEJ047 - ARAÑONES",
    "TEJ048 - ANILLADO POR LYCRA ROTA",
    "TEJ049 - LYCRA NO VANIZADA (JALONES)",
    "TEJ050 - PARADA DE MÁQUINA",
    "TEJ051 - SEGUNDA DE TELA",
    "TEJ052 - MANCHAS DE MARCADOR DE TELA",
    "TEJ053 - CABO FALTANTE",
    "TEJ054 - BARRADO DE MÁQUINA",
    "TEJ055 - AGLOBADO",
    "TEJ056 - QUEBRADURAS",
    "TEJ058 - DISEÑO DE TEJIDO INCORRECTO",
    "TEJ059 - DESPACHO DE TELA INCORRECTA",
    "TEJ060 - ERROR DE DESPACHO DE TELA CRUDA",
    "TIN051 - BAJA RESISTENCIA",
    "TIN052 - DEGRADÉ",
    "TIN053 - FUERA DE TONO",
    "TIN054 - FUERA DE MATCHING",
    "TIN055 - HUECOS POR PROCESO",
    "TIN056 - JALADURAS",
    "TIN057 - MANCHAS DE COLORANTE",
    "TIN058 - MANCHAS DE SUCIEDAD",
    "TIN059 - MALA SOLIDEZ AL LAVADO",
    "TIN060 - MALA SOLIDEZ AL AGUA",
    "TIN061 - MALA SOLIDEZ A LA TRANSPIRACIÓN",
    "TIN062 - MALA SOLIDEZ AL FROTE SECO",
    "TIN063 - MALA SOLIDEZ AL FROTE HÚMEDO",
    "TIN064 - MALA IGUALACIÓN",
    "TIN065 - MAL DESMONTADO",
    "TIN066 - MANCHAS BLANCAS",
    "TIN067 - MANCHAS DE ÓPTICO",
    "TIN068 - ÓXIDO METÁLICO",
    "TIN069 - PH FUERA DE STD",
    "TIN070 - PUNTOS DE SILICONA",
    "TIN071 - PILLING ELEVADO",
    "TIN072 - QUEBRADURAS",
    "TIN073 - RASPADURAS",
    "TIN074 - REMALLES",
    "TIN075 - TEÑIDO VETEADO",
    "TIN076 - LÍNEAS GIRATORIAS",
    "TIN077 - PICADURAS",
    "TIN078 - PUNTOS DE COLORANTE",
    "TIN079 - MANCHAS DE PRODUCTO",
    "TIN080 - LÍNEA VERTICAL",
    "TIN081 - MIGRACIÓN",
    "TIN082 - BORDES REVENTADOS",
    "TIN083 - RECT. DEFORMADOS",
    "TIN084 - INCREMENTO DE PEDIDO",
    "TIN085 - MAL ANÁLISIS TEXTIL",
    "TIN087 - COMBINACIÓN NO APROBADA POR CLIENTE",
    "TIN088 - RECETA INCORRECTA",
    "TIN089 - COD COLOR INCORRECTO",
    "TIN090 - NO DESCARGA DISCHARGE",
    "ACA081 - ANCHO F/STD",
    "ACA082 - APARIENCIA F/STD",
    "ACA083 - BAJA RESISTENCIA",
    "ACA084 - CALAMINADO",
    "ACA085 - DENSIDAD F/STD",
    "ACA086 - ENCOGIMIENTO F/STD",
    "ACA087 - EMPALMES",
    "ACA088 - HUECOS POR PROCESO",
    "ACA089 - JALADURAS",
    "ACA090 - LÍNEAS VERTICALES DE ESMERILADO",
    "ACA091 - LYCRA QUEMADA",
    "ACA092 - MAL OLOR",
    "ACA093 - MANCHAS DE SUAVIZANTE",
    "ACA094 - MAL ESMERILADO",
    "ACA095 - MALA HIDROFILIDAD",
    "ACA096 - MAL CORTE DE ORILLOS",
    "ACA097 - MAL ENROLLADO",
    "ACA098 - MARCAS DE AGUJA DE RAMA",
    "ACA099 - MIGRACIÓN",
    "ACA100 - MAL PERCHADO",
    "ACA101 - MAL ABIERTO",
    "ACA102 - MANCHAS DE GRASA",
    "ACA103 - MAL ESTAMPADO (SERVICIO)",
    "ACA104 - MORDEDURAS",
    "ACA105 - ÓXIDO",
    "ACA106 - PUNTOS DE SILICONA",
    "ACA107 - PARADA DE MÁQ",
    "ACA108 - MAL SECADO",
    "ACA109 - REVIRADO F/STD",
    "ACA110 - RAPPORT F/STD",
    "ACA111 - REMALLE",
    "ACA112 - TACTO ÁSPERO",
    "ACA113 - TRAMA DISTORSIONADA",
    "ACA114 - TELA QUEMADA",
    "ACA115 - VARIACIÓN DE ANCHOS",
    "ACA116 - MANCHAS DE CONDENSADO",
    "ACA117 - MANCHAS DE ÓPTICO",
    "ACA118 - MANCHAS DE SUCIEDAD",
    "ACA119 - MANCHAS BLANCAS",
    "ACA120 - LÍNEA SESGADA EN LOS BORDES",
    "ACA121 - MARCA DE BASTIDOR",
    "ACA122 - AUREOLAS",
    "ACA123 - MEDIA LUNA CADENA DE RAMA",
    "ACA124 - MANCHAS DE MARCADO DE TELA",
    "ACA125 - MORDEDURAS DE FOULARD",
    "ACA126 - PICADURAS DE ESMERILADO",
    "ACA127 - MALA APARIENCIA",
    "ACA128 - DOBLE LÍNEA DE COMPACTADO",
    "ACA129 - SOLEADO",
    "ACA130 - MANCHAS DE PRODUCTO",
    "ACA131 - PUNTOS BLANCOS",
    "ACA132 - CONTAMINACIÓN DE PELUSA",
    "ACA133 - PÉRDIDA DE PARTIDA",
    "ACA134 - AGUJEROS",
    "ACA135 - BORDE DESGARRADO",
    "ACA136 - LÍNEA DE FRICCIÓN"
  ];

  AREAS: string[] = [
    "ACABADOS", "BORDADO", "CALIDAD MANUFACTURA", "CALIDAD TEXTIL", "COMERCIAL", "CORTE",
    "ESTAMPADO DIGITAL", "LAVANDERÍA", "PCP ACABADO", "PCP ESTAMPADO DIGITAL", "PCP MANUFACTURA",
    "PCP TEJEDURÍA", "PCP TINTORERÍA", "PLANEAMIENTO TEXTIL", "TEJEDURÍA", "TINTORERÍA"
  ];

  mapaCodigosArea: { [key: string]: string } = {
    'ACABADOS': 'ACA',
    'HILOS': 'HIL',
    'TEJEDURIA': 'TEJ',
    'TEJEDURÍA': 'TEJ',
    'TINTORERIA': 'TIN',
    'TINTORERÍA': 'TIN',
    'CORTE': 'COR',
    'COSTURA': 'COS',
    'CALIDAD': 'CAL',
    'CALIDAD TEXTIL': 'CAT',
    'CALIDAD MANUFACTURA': 'CMA',
    'ALMACEN': 'ALM',
    'BORDADO': 'BOR',
    'ESTAMPADO': 'EST',
    'ESTAMPADO DIGITAL': 'ESD',
    'LAVANDERIA': 'LAV',
    'LAVANDERÍA': 'LAV',
    'LABORATORIO TINTO': 'LAB'
  };

  OTRA_AREA: string = "OTRA / ESPECIFICAR";
  DEFECTO_NUEVO: string = "DEFECTO NUEVO / NO REGISTRADO";
  MOTIVOS_ANULACION: string[] = ["Partida incorrecta", "NC duplicada", "Otros"];

  MOTIVOS_EDICION: string[] = [
    "Defecto incorrecto",
    "Cantidad de rollos incorrecta",
    "Artículo incorrecto (Cuerpo/Complemento/Otro)",
    "Error de digitación",
    "Área responsable incorrecta",
    "Otros"
  ];

  // Lista de NCs
  ncs: NoConformidad[] = [];
  nextNum: number = 5;

  // Filtros de Inicio
  inicioFilters = { nc: '', ini: '', fin: '', resp: '' };
  inicioResults: NoConformidad[] | null = null;

  // Estado del Borrador (Wizard de Registro / Edición)
  draft: {
    ncPreview: string;
    fechaRegistro: string;
    partida: string;
    cliente: string;
    color: string;
    peso: string;
    fechaPartida: string;
    articulosDisponibles: ArticuloPartida[];
    seleccion: { [index: number]: { checked: boolean; cantidad: number | string; open: boolean; defectos: DefectoItem[] } };
    comentario: string;
    grupoDefecto: {
      seleccion: { [index: number]: boolean };
      motivo: string;
      isOtro: boolean;
      descripcionOtro: string;
      area: string;
      areaOtro: string;
      evidencia: { name: string; dataUrl: string }[];
      errors: { [key: string]: string };
    };
  } | null = null;

  wizardEditMode: boolean = false;
  editingId: string | null = null;
  errors: { [key: string]: string } = {};

  // Detalle de NC
  detalleNC: NoConformidad | null = null;
  detalleOpen = { general: true, articulos: true, defectos: true, historial: false };

  // Defectos Pendientes
  defectosPendientesCatalogo: DefectoPendiente[] = [];
  revisarDefecto = { pendIndex: 0, editing: false, codigo: '', error: '' };
  grabarMotivo = { pendIndex: 0, motivo: '', isOtro: false, descripcionOtro: '', area: '', areaOtro: '', errors: {} as { [key: string]: string } };

  // Evolutivo
  evoPeriod: 'Año' | 'Mes' | 'Semanas' | 'Días' = 'Mes';
  evoPeriodos: ('Año' | 'Mes' | 'Semanas' | 'Días')[] = ['Año', 'Mes', 'Semanas', 'Días'];
  evoSelectedYear: number = 2026;
  evoAvailableYears: number[] = [2026, 2025, 2024];
  evoSelectedWeek: number = 37;
  evoDiasModo: 'semana' | 'ultimos7' = 'semana';
  evolutivoRawData: any[] = [];
  loadingEvolutivo: boolean = false;

  // Modales
  anularModal = { open: false, ncId: '', motivo: '', otro: '', error: '' };
  motivoEdicionModal = { open: false, motivo: '', otro: '', error: '' };
  photoViewModal = { open: false, photos: [] as { name: string; dataUrl: string }[], index: 0 };
  draftDefModal = {
    open: false,
    artIdx: 0,
    defIdx: null as number | null,
    motivo: '',
    isOtro: false,
    descripcionOtro: '',
    area: '',
    areaOtro: '',
    evidencia: [] as { name: string; dataUrl: string }[],
    comentario: '',
    errors: {} as { [key: string]: string }
  };

  // Autocomplete para Motivos de Rechazo
  filtroGrupoMotivo: string = '';
  motivosFiltradosGrupo: string[] = [];

  filtroModalMotivo: string = '';
  motivosFiltradosModal: string[] = [];

  filtroGrabarMotivo: string = '';
  motivosFiltradosGrabar: string[] = [];

  loadingNc: boolean = false;

  constructor(private ncService: NoConformidadesService) { }

  ngOnInit(): void {
    this.cargarInformesCabecera();
    this.cargarCatalogos();
    this.cargarEvolutivo();
    this.filtrarMotivosGrupo('');
    this.filtrarMotivosModal('');
    this.filtrarMotivosGrabar('');
  }

  cargarInformesCabecera(numInforme: string = '', fIni: string = '', fFin: string = '', partida: string = ''): void {
    this.loadingNc = true;
    this.ncService.getInformesCabecera(numInforme, fIni, fFin, partida).subscribe({
      next: (data: any[]) => {
        this.loadingNc = false;
        if (data && Array.isArray(data)) {
          this.ncs = data.map((item: any) => {
            const ncId = item.numeroNC || (item.numero ? `NC - ${item.numero}` : '');
            const existing = (this.ncs || []).find(x => x.id === ncId || x.numero === item.numero);
            const historial = (existing && existing.historial && existing.historial.length > 1)
              ? existing.historial
              : [{ fecha: item.fecha || '', usuario: item.responsable || item.usuario || 'SISTEMAS', accion: 'Creación de NC' }];

            return {
              id: ncId,
              numero: item.numero || '',
              estado: (existing && existing.estado) ? existing.estado : 'Registrada',
              status: (existing && existing.status) ? existing.status : 'Rechazado',
              proceso: 'PRODUCCIÓN',
              fecha: item.fecha || '',
              registradoPor: item.responsable || item.usuario || '',
              partida: item.partida || '',
              cliente: item.cliente || '',
              codCliente: item.codCliente || '',
              color: item.color || '',
              codColor: item.codColor || '',
              peso: (existing && existing.peso) ? existing.peso : '',
              fechaPartida: item.fecha || '',
              area: item.area ? item.area.replace(/,$/, '').trim() : '',
              areas: item.area ? item.area.replace(/,$/, '').trim() : '',
              articulos: (existing && existing.articulos && existing.articulos.length > 0) ? existing.articulos : [],
              comentario: (existing && existing.comentario) ? existing.comentario : '',
              anulacion: existing?.anulacion || null,
              historial: historial
            };
          });
          this.dataSourceNc.data = this.ncs;
        } else {
          this.ncs = [];
          this.dataSourceNc.data = [];
        }
      },
      error: (err) => {
        this.loadingNc = false;
        console.error('Error al cargar informes cabecera:', err);
        this.inicializarDatosEjemplo();
      }
    });
  }

  cargarCatalogos(): void {
    this.ncService.getDatosInformeCalidad('A').subscribe({
      next: (data: any[]) => {
        if (data && Array.isArray(data) && data.length > 0) {
          data.forEach((x: any) => {
            const cod = (x.Codigo || x.Cod_Area || x.Cod_Area_CC || '').trim();
            const desc = (x.Descripcion || x.Nom_Area || x.Area || x.DES_AREA || '').trim();
            if (cod && desc) {
              this.mapaCodigosArea[desc.toUpperCase()] = cod;
              this.mapaCodigosArea[cod.toUpperCase()] = cod;
            }
          });
          const areasDb = data.map((x: any) => (x.Descripcion || x.Nom_Area || x.Area || x.DES_AREA || '').trim()).filter(Boolean);
          if (areasDb.length > 0) {
            this.AREAS = Array.from(new Set(areasDb));
          }
        }
      },
      error: (e) => console.log('Usando áreas locales:', e)
    });

    this.ncService.getDatosInformeCalidad('M').subscribe({
      next: (data: any[]) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const motivosDb = data.map((x: any) => {
            const cod = (x.Cod_Motivo || x.Codigo || '').trim();
            const desc = (x.Nom_Motivo || x.Descripcion || x.Motivo || '').trim();
            return cod && desc ? `${cod} - ${desc}` : (desc || cod);
          }).filter(Boolean);
          if (motivosDb.length > 0) {
            this.MOTIVOS = Array.from(new Set(motivosDb));
            this.filtrarMotivosGrupo(this.filtroGrupoMotivo);
            this.filtrarMotivosModal(this.filtroModalMotivo);
            this.filtrarMotivosGrabar(this.filtroGrabarMotivo);
          }
        }
      },
      error: (e) => console.log('Usando motivos locales:', e)
    });
  }

  cargarEvolutivo(): void {
    this.loadingEvolutivo = true;
    this.ncService.getEvolutivo().subscribe({
      next: (data: any[]) => {
        this.loadingEvolutivo = false;
        if (data && Array.isArray(data)) {
          this.evolutivoRawData = data;
          const distinctYears = Array.from(new Set(
            data.map(r => r.CC_Fec_Crea ? new Date(r.CC_Fec_Crea).getFullYear() : null).filter(y => y && !isNaN(y) && y >= 2020)
          )) as number[];
          if (distinctYears.length > 0) {
            distinctYears.sort((a, b) => b - a);
            this.evoAvailableYears = distinctYears;
            if (!this.evoAvailableYears.includes(this.evoSelectedYear)) {
              this.evoSelectedYear = this.evoAvailableYears[0];
            }
          }
          this.evoSelectedWeek = this.getISOWeek(new Date());
        }
      },
      error: (e) => {
        this.loadingEvolutivo = false;
        console.warn('Error al cargar datos evolutivos:', e);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceNc.sort = this.sortNc;
    this.dataSourceNc.paginator = this.paginatorNc;
  }

  // Generar ID
  ncId(n: number): string {
    return 'NC-' + String(n).padStart(6, '0');
  }

  inicializarDatosEjemplo(): void {
    const samplePhotos = [
      'assets/images/sample1.png',
      'assets/images/sample2.png'
    ];

    this.ncs = [
      {
        id: this.ncId(4),
        estado: 'Registrada',
        status: 'Rechazado',
        proceso: 'PRODUCCIÓN',
        fecha: '11/08/2026 10:32',
        registradoPor: 'J. Ramirez',
        partida: '07825',
        cliente: 'TEXTIL DORITEX',
        color: 'CELESTE MEGO II',
        peso: '199.2 kg',
        fechaPartida: '11/08/2026',
        articulos: [
          {
            tipo: 'Cuerpo',
            nombre: 'Jersey Solido 20/1',
            codTela: 'JE003285',
            talla: '-',
            kgCrudo: '191.1',
            rollos: 9,
            cantidad: 9,
            defectos: [
              { motivo: 'TIN072 - QUEBRADURAS', isOtro: false, descripcionOtro: '', area: 'TINTORERÍA', areaOtro: '', evidencia: [{ name: 'foto1.jpg', dataUrl: '' }] },
              { motivo: 'TIN057 - MANCHAS DE COLORANTE', isOtro: false, descripcionOtro: '', area: 'TINTORERÍA', areaOtro: '', evidencia: [{ name: 'foto2.jpg', dataUrl: '' }] }
            ]
          },
          {
            tipo: 'Complemento',
            nombre: 'Rib 1x1 20/1',
            codTela: 'RI001815',
            talla: '-',
            kgCrudo: '8.1',
            rollos: 1,
            cantidad: 1,
            defectos: [
              { motivo: 'TEJ056 - QUEBRADURAS', isOtro: false, descripcionOtro: '', area: 'TEJEDURÍA', areaOtro: '', evidencia: [] }
            ]
          }
        ],
        comentario: 'Manchas de tintura irregulares en el lote, turno noche.',
        historial: [{ fecha: '11/08/2026 10:32', usuario: 'J. Ramirez', accion: 'Creación de NC' }]
      },
      {
        id: this.ncId(3),
        estado: 'Registrada',
        status: 'Rechazado',
        proceso: 'PRODUCCIÓN',
        fecha: '10/08/2026 09:10',
        registradoPor: 'A. Perez',
        partida: '05796',
        cliente: 'Psyco Bunny',
        color: 'BARITONE BLUE RECT',
        peso: '141.8 kg',
        fechaPartida: '10/08/2026',
        articulos: [
          {
            tipo: 'Cuerpo',
            nombre: 'Pique Lacoste PY ME',
            codTela: 'PI000361',
            talla: '-',
            kgCrudo: '141.77',
            rollos: 8,
            cantidad: 3,
            defectos: [
              { motivo: 'TEJ043 - TRASPASO O ANILLOS DE HILO ROTO', isOtro: false, descripcionOtro: '', area: 'TEJEDURÍA', areaOtro: '', evidencia: [] }
            ]
          }
        ],
        comentario: 'Rotura de hilo en telar 3.',
        historial: [{ fecha: '10/08/2026 09:10', usuario: 'A. Perez', accion: 'Creación de NC' }]
      },
      {
        id: this.ncId(2),
        estado: 'Registrada',
        status: 'Rechazado',
        proceso: 'PRODUCCIÓN',
        fecha: '10/08/2026 08:40',
        registradoPor: 'A. Perez',
        partida: '03181',
        cliente: 'VELASQUEZ TEXTILES',
        color: 'DIVINO',
        peso: '120.0 kg',
        fechaPartida: '10/08/2026',
        articulos: [
          {
            tipo: 'Cuerpo',
            nombre: 'Algodon Pima 30/1',
            codTela: 'AP004521',
            talla: '-',
            kgCrudo: '120.0',
            rollos: 6,
            cantidad: 5,
            defectos: [
              { motivo: 'ACA086 - ENCOGIMIENTO F/SIO', isOtro: false, descripcionOtro: '', area: 'ACABADOS', areaOtro: '', evidencia: [] }
            ]
          }
        ],
        comentario: 'Encogimiento fuera de rango.',
        historial: [{ fecha: '10/08/2026 08:40', usuario: 'A. Perez', accion: 'Creación de NC' }]
      },
      {
        id: this.ncId(1),
        estado: 'Registrada',
        status: 'Rechazado',
        proceso: 'PRODUCCIÓN',
        fecha: '09/08/2026 16:05',
        registradoPor: 'M. Rios',
        partida: '07825',
        cliente: 'TEXTIL DORITEX',
        color: 'CELESTE MEGO II',
        peso: '199.2 kg',
        fechaPartida: '09/08/2026',
        articulos: [
          {
            tipo: 'Cuerpo',
            nombre: 'Jersey Solido 20/1',
            codTela: 'JE003285',
            talla: '-',
            kgCrudo: '191.1',
            rollos: 9,
            cantidad: 2,
            defectos: [
              { motivo: '', isOtro: true, descripcionOtro: 'Olor extraño no catalogado en producto terminado', area: 'TINTORERÍA', areaOtro: '', evidencia: [] }
            ]
          }
        ],
        comentario: 'Tono levemente distinto al estándar.',
        historial: [{ fecha: '09/08/2026 16:05', usuario: 'M. Rios', accion: 'Creación de NC' }]
      }
    ];

    // Extraer defectos nuevos
    this.defectosPendientesCatalogo = [];
    this.ncs.forEach(nc => {
      nc.articulos.forEach(a => {
        a.defectos.forEach(d => {
          if (d.isOtro) {
            this.defectosPendientesCatalogo.push({
              descripcion: d.descripcionOtro,
              ncId: nc.id,
              partida: nc.partida,
              articulo: a.nombre,
              fecha: nc.fecha,
              usuario: nc.registradoPor
            });
          }
        });
      });
    });
    // Actualizar dataSource de la tabla de NCs
    this.dataSourceNc.data = this.ncs;
  }

  // Navegación
  goTo(screen: string): void {
    this.currentScreen = screen;
    this.errors = {};
    if (screen === 'paso2') {
      this.filtroGrupoMotivo = this.draft?.grupoDefecto?.isOtro ? this.DEFECTO_NUEVO : (this.draft?.grupoDefecto?.motivo || '');
      this.filtrarMotivosGrupo(this.filtroGrupoMotivo);
    }
    if (screen === 'evolutivo' && (!this.evolutivoRawData || this.evolutivoRawData.length === 0)) {
      this.cargarEvolutivo();
    }
    window.scrollTo(0, 0);
  }

  nowStr(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  parseDMY(s: any): Date | null {
    if (!s) return null;
    if (s instanceof Date) return s;
    if (typeof s === 'string') {
      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s.trim());
      if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  // Búsqueda en Inicio
  inicioBuscar(): void {
    const f = this.inicioFilters;
    const ncQuery = (f.nc || '').trim().toLowerCase();
    const respQuery = (f.resp || '').trim().toLowerCase();
    const iniD = this.parseDMY(f.ini);
    const finD = this.parseDMY(f.fin);

    this.inicioResults = this.ncs.filter(x => {
      if (ncQuery && !x.id.toLowerCase().includes(ncQuery) && !x.partida.toLowerCase().includes(ncQuery)) return false;
      if (respQuery && !x.registradoPor.toLowerCase().includes(respQuery)) return false;
      const d = this.parseDMY(x.fecha.split(' ')[0]);
      if (iniD && d && d < iniD) return false;
      if (finD && d && d > finD) return false;
      return true;
    });
    // Actualizar dataSource con los resultados filtrados
    this.dataSourceNc.data = this.inicioResults;
  }

  inicioLimpiarFiltros(): void {
    this.inicioFilters = { nc: '', ini: '', fin: '', resp: '' };
    this.inicioResults = null;
    this.dataSourceNc.data = this.ncs;
  }

  ncHasArea(nc: NoConformidad, area: string): boolean {
    return (nc.articulos || []).some(a => (a.defectos || []).some(d => this.defectoAreaFinal(d) === area));
  }

  ncAreasResumen(nc: NoConformidad): string {
    if (nc.areas && nc.areas.trim() !== '' && nc.areas !== '-') return nc.areas;
    if (nc.area && nc.area.trim() !== '' && nc.area !== '-') return nc.area;
    const areas: string[] = [];
    (nc.articulos || []).forEach(a => (a.defectos || []).forEach(d => {
      const ar = this.defectoAreaFinal(d);
      if (ar && !areas.includes(ar)) areas.push(ar);
    }));
    if (areas.length === 0) return '-';
    return areas.join(', ');
  }

  defectoAreaFinal(d: DefectoItem): string {
    return d.area === this.OTRA_AREA ? (d.areaOtro || '(sin especificar)') : (d.area || '(sin área)');
  }

  defectoLabel(d: DefectoItem): string {
    return d.isOtro ? (d.descripcionOtro || '(sin descripción)') : (d.motivo || '(sin motivo)');
  }

  // Iniciar registro de nueva NC
  startNuevaNC(): void {
    this.draft = {
      ncPreview: this.ncId(this.nextNum),
      fechaRegistro: this.nowStr(),
      partida: '',
      cliente: '',
      color: '',
      peso: '',
      fechaPartida: '',
      articulosDisponibles: [],
      seleccion: {},
      comentario: '',
      grupoDefecto: {
        seleccion: {},
        motivo: '',
        isOtro: false,
        descripcionOtro: '',
        area: '',
        areaOtro: '',
        evidencia: [],
        errors: {}
      }
    };
    this.wizardEditMode = false;
    this.editingId = null;
    this.filtroGrupoMotivo = '';
    this.filtrarMotivosGrupo('');
    this.goTo('paso1');
  }

  // Wizard Paso 1
  onPartidaInput(val: string): void {
    val = (val || '').trim();
    if (!this.draft) return;
    this.draft.partida = val;
    this.errors = {};

    if (!val) {
      this.draft.cliente = '';
      this.draft.color = '';
      this.draft.peso = '';
      this.draft.fechaPartida = '';
      this.draft.articulosDisponibles = [];
      this.draft.seleccion = {};
      return;
    }

    // 1. Obtener datos de cabecera de la partida (Cliente, Color, Peso)
    this.ncService.getPartida(val).subscribe({
      next: (data: any[]) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const p = data[0];
          this.draft!.cliente = p.Nom_Cliente || p.nom_Cliente || p.Cliente || '';
          this.draft!.color = p.Des_Color || p.des_Color || p.Color || '';
          this.draft!.peso = (p.KGS_CRUDO || p.kgs_Crudo || p.peso || '0') + ' kg';
          this.draft!.fechaPartida = this.nowStr().split(' ')[0];
        } else if (this.PARTIDAS_DB[val]) {
          const p = this.PARTIDAS_DB[val];
          this.draft!.cliente = p.cliente;
          this.draft!.color = p.color;
          this.draft!.peso = p.peso;
          this.draft!.fechaPartida = p.fecha;
        }
      }
    });

    // 2. Obtener la lista completa de artículos/telas de la partida (UP_CC_Muestra_Informe_Calidad_Detalle '', partida)
    this.ncService.getInformeDetalle('', val).subscribe({
      next: (resp: any) => {
        const articulosRaw = resp?.articulos || (Array.isArray(resp) ? resp : []);
        if (Array.isArray(articulosRaw) && articulosRaw.length > 0) {
          this.draft!.articulosDisponibles = articulosRaw.map((a: any, idx: number) => ({
            id: a.Num_Secuencia !== undefined && a.Num_Secuencia !== null ? Number(a.Num_Secuencia) : (a.num_Secuencia !== undefined && a.num_Secuencia !== null ? Number(a.num_Secuencia) : (a.Item || (idx + 1))),
            tipo: (a.Talla || a.talla || '').trim() && (a.Talla || a.talla || '').trim() !== '-' ? 'Complemento' : 'Cuerpo',
            nombre: (a.Tela || a.tela || a.CodTela || `Artículo ${idx + 1}`).trim(),
            codTela: (a.CodTela || a.codTela || '').trim(),
            talla: (a.Talla || a.talla || '-').trim() || '-',
            kgCrudo: String(a.Kgs || a.kgs || '0'),
            rollos: Number(a.Rollos || a.rollos || 0)
          }));

          this.draft!.seleccion = {};
          this.draft!.articulosDisponibles.forEach((_, idx) => {
            this.draft!.seleccion[idx] = {
              checked: false,
              cantidad: '',
              open: true,
              defectos: []
            };
          });
        } else if (this.PARTIDAS_DB[val]) {
          const p = this.PARTIDAS_DB[val];
          this.draft!.articulosDisponibles = p.articulos;
          this.draft!.seleccion = {};
          p.articulos.forEach((_, idx) => {
            this.draft!.seleccion[idx] = {
              checked: false,
              cantidad: '',
              open: true,
              defectos: []
            };
          });
        }
      },
      error: () => {
        if (this.PARTIDAS_DB[val]) {
          const p = this.PARTIDAS_DB[val];
          this.draft!.articulosDisponibles = p.articulos;
          this.draft!.seleccion = {};
          p.articulos.forEach((_, idx) => {
            this.draft!.seleccion[idx] = {
              checked: false,
              cantidad: '',
              open: true,
              defectos: []
            };
          });
        }
      }
    });
  }

  toggleArticulo(idx: number): void {
    if (!this.draft) return;
    const cur = this.draft.seleccion[idx] || { checked: false, cantidad: '', open: true, defectos: [] };
    cur.checked = !cur.checked;
    cur.open = cur.checked;
    if (cur.checked && !cur.defectos) {
      cur.defectos = [];
    }
    this.draft.seleccion[idx] = cur;
  }

  sonTodosArticulosSeleccionados(): boolean {
    if (!this.draft || !this.draft.articulosDisponibles || this.draft.articulosDisponibles.length === 0) {
      return false;
    }
    return this.draft.articulosDisponibles.every((_, idx) => this.draft!.seleccion[idx]?.checked);
  }

  toggleTodosArticulos(): void {
    if (!this.draft || !this.draft.articulosDisponibles || this.draft.articulosDisponibles.length === 0) {
      return;
    }
    const nuevoEstado = !this.sonTodosArticulosSeleccionados();
    this.draft.articulosDisponibles.forEach((_, idx) => {
      const cur = this.draft!.seleccion[idx] || { checked: false, cantidad: '', open: true, defectos: [] };
      cur.checked = nuevoEstado;
      cur.open = nuevoEstado;
      if (nuevoEstado && !cur.defectos) {
        cur.defectos = [];
      }
      this.draft!.seleccion[idx] = cur;
    });

    if (nuevoEstado && this.errors['articulos']) {
      delete this.errors['articulos'];
    }
  }

  toggleArticuloOpen(idx: number): void {
    if (!this.draft || !this.draft.seleccion[idx]) return;
    this.draft.seleccion[idx].open = !this.draft.seleccion[idx].open;
  }

  removeArticuloEdicion(idx: number): void {
    if (!this.draft) return;
    const nombre = this.draft.articulosDisponibles[idx]?.nombre || 'este artículo';
    Swal.fire({
      title: '¿Eliminar artículo?',
      text: `Se eliminará "${nombre}" de la edición. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.isConfirmed && this.draft) {
        this.draft.articulosDisponibles.splice(idx, 1);
        const newSeleccion: { [index: number]: { checked: boolean; cantidad: number | string; open: boolean; defectos: DefectoItem[] } } = {};
        this.draft.articulosDisponibles.forEach((_, i) => {
          const oldIdx = i >= idx ? i + 1 : i;
          newSeleccion[i] = this.draft!.seleccion[oldIdx] || { checked: false, cantidad: '', open: true, defectos: [] };
        });
        this.draft.seleccion = newSeleccion;
      }
    });
  }

  validatePaso1(): void {
    if (!this.draft) return;
    this.errors = {};
    if (!this.draft.partida) {
      this.errors['partida'] = 'Ingrese el número de partida.';
      return;
    }
    if (!this.draft.cliente && this.draft.articulosDisponibles.length === 0) {
      this.errors['partida'] = 'Partida no encontrada en el sistema. Verifique el número ingresado.';
      return;
    }
    const checkedIndices = Object.keys(this.draft.seleccion).filter(k => this.draft!.seleccion[Number(k)].checked);
    if (checkedIndices.length === 0) {
      this.errors['articulos'] = 'Seleccione al menos un artículo afectado.';
      return;
    }
    let ok = true;
    checkedIndices.forEach(k => {
      const idx = Number(k);
      const sel = this.draft!.seleccion[idx];
      const a = this.draft!.articulosDisponibles[idx];
      const n = Number(sel.cantidad);
      if (!sel.cantidad || isNaN(n) || n <= 0) {
        this.errors[`art_${idx}`] = 'Ingrese una cantidad válida.';
        ok = false;
        sel.open = true;
      } else if (n > a.rollos) {
        this.errors[`art_${idx}`] = `Máximo disponible: ${a.rollos} rollos.`;
        ok = false;
        sel.open = true;
      }
    });
    if (!ok) {
      this.errors['articulos'] = 'Corrija las cantidades marcadas en rojo.';
      return;
    }
    this.goTo('paso2');
  }

  // Wizard Paso 2: Grupo de defectos
  getArticulosChequeadosPaso1(): number {
    if (!this.draft || !this.draft.articulosDisponibles) return 0;
    return this.draft.articulosDisponibles.filter((_, i) => !!this.draft!.seleccion[i]?.checked).length;
  }

  sonTodosGrupoArticulosSeleccionados(): boolean {
    if (!this.draft || !this.draft.articulosDisponibles) return false;
    const checkedIndices = this.draft.articulosDisponibles
      .map((_, i) => i)
      .filter(i => !!this.draft!.seleccion[i]?.checked);
    if (checkedIndices.length === 0) return false;
    return checkedIndices.every(i => !!this.draft!.grupoDefecto.seleccion[i]);
  }

  toggleTodosGrupoArticulos(): void {
    if (!this.draft || !this.draft.articulosDisponibles) return;
    const nuevoEstado = !this.sonTodosGrupoArticulosSeleccionados();
    this.draft.articulosDisponibles.forEach((_, i) => {
      if (this.draft!.seleccion[i]?.checked) {
        this.draft!.grupoDefecto.seleccion[i] = nuevoEstado;
      }
    });
    if (nuevoEstado && this.draft.grupoDefecto.errors['seleccion']) {
      delete this.draft.grupoDefecto.errors['seleccion'];
    }
  }

  toggleGrupoArticulo(idx: number): void {
    if (!this.draft) return;
    this.draft.grupoDefecto.seleccion[idx] = !this.draft.grupoDefecto.seleccion[idx];
    if (this.draft.grupoDefecto.seleccion[idx] && this.draft.grupoDefecto.errors['seleccion']) {
      delete this.draft.grupoDefecto.errors['seleccion'];
    }
  }

  onGrupoMotivoChange(val: string): void {
    if (!this.draft) return;
    if (val === this.DEFECTO_NUEVO) {
      this.draft.grupoDefecto.motivo = '';
      this.draft.grupoDefecto.isOtro = true;
    } else {
      this.draft.grupoDefecto.motivo = val;
      this.draft.grupoDefecto.isOtro = false;
    }
  }

  // ============================================================
  // AUTOCOMPLETE MOTIVOS DE RECHAZO (Búsqueda predictiva y escritura)
  // ============================================================
  normalizarTexto(texto: string): string {
    return (texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  // Paso 2 - Asignación Defecto
  filtrarMotivosGrupo(texto?: string): void {
    const query = this.normalizarTexto(texto !== undefined ? texto : (this.filtroGrupoMotivo || ''));
    if (!query) {
      this.motivosFiltradosGrupo = this.MOTIVOS.slice(0, 100);
    } else {
      this.motivosFiltradosGrupo = this.MOTIVOS
        .filter(m => this.normalizarTexto(m).includes(query))
        .slice(0, 100);
    }
  }

  onGrupoMotivoFocus(trigger: any): void {
    this.filtrarMotivosGrupo(this.filtroGrupoMotivo);
    if (trigger && typeof trigger.openPanel === 'function') {
      setTimeout(() => trigger.openPanel(), 0);
    }
  }

  toggleGrupoMotivoPanel(trigger: any, event: MouseEvent): void {
    event.stopPropagation();
    if (trigger) {
      if (trigger.panelOpen) {
        trigger.closePanel();
      } else {
        this.filtrarMotivosGrupo(this.filtroGrupoMotivo);
        trigger.openPanel();
      }
    }
  }

  onGrupoMotivoInput(val: string): void {
    if (!this.draft) return;
    this.filtroGrupoMotivo = val;
    this.filtrarMotivosGrupo(val);

    const cleanVal = (val || '').trim();
    if (cleanVal === this.DEFECTO_NUEVO) {
      this.draft.grupoDefecto.motivo = '';
      this.draft.grupoDefecto.isOtro = true;
    } else {
      const match = this.MOTIVOS.find(m => this.normalizarTexto(m) === this.normalizarTexto(cleanVal));
      this.draft.grupoDefecto.motivo = match || cleanVal;
      this.draft.grupoDefecto.isOtro = false;
    }

    if (cleanVal && this.draft.grupoDefecto.errors['motivo']) {
      delete this.draft.grupoDefecto.errors['motivo'];
    }
  }

  onGrupoMotivoSelected(val: string): void {
    if (!this.draft) return;
    if (val === this.DEFECTO_NUEVO) {
      this.filtroGrupoMotivo = this.DEFECTO_NUEVO;
      this.draft.grupoDefecto.motivo = '';
      this.draft.grupoDefecto.isOtro = true;
    } else {
      this.filtroGrupoMotivo = val;
      this.draft.grupoDefecto.motivo = val;
      this.draft.grupoDefecto.isOtro = false;
    }
    if (this.draft.grupoDefecto.errors['motivo']) {
      delete this.draft.grupoDefecto.errors['motivo'];
    }
  }

  limpiarGrupoMotivo(event?: MouseEvent, trigger?: any): void {
    if (event) event.stopPropagation();
    this.filtroGrupoMotivo = '';
    if (this.draft) {
      this.draft.grupoDefecto.motivo = '';
      this.draft.grupoDefecto.isOtro = false;
      this.draft.grupoDefecto.descripcionOtro = '';
    }
    this.filtrarMotivosGrupo('');
    if (trigger && typeof trigger.openPanel === 'function') {
      setTimeout(() => trigger.openPanel(), 0);
    }
  }

  // Modal Defecto (Edición o Creación Individual)
  filtrarMotivosModal(texto?: string): void {
    const query = this.normalizarTexto(texto !== undefined ? texto : (this.filtroModalMotivo || ''));
    if (!query) {
      this.motivosFiltradosModal = this.MOTIVOS.slice(0, 100);
    } else {
      this.motivosFiltradosModal = this.MOTIVOS
        .filter(m => this.normalizarTexto(m).includes(query))
        .slice(0, 100);
    }
  }

  onModalMotivoFocus(trigger: any): void {
    this.filtrarMotivosModal(this.filtroModalMotivo);
    if (trigger && typeof trigger.openPanel === 'function') {
      setTimeout(() => trigger.openPanel(), 0);
    }
  }

  toggleModalMotivoPanel(trigger: any, event: MouseEvent): void {
    event.stopPropagation();
    if (trigger) {
      if (trigger.panelOpen) {
        trigger.closePanel();
      } else {
        this.filtrarMotivosModal(this.filtroModalMotivo);
        trigger.openPanel();
      }
    }
  }

  onModalMotivoInput(val: string): void {
    this.filtroModalMotivo = val;
    this.filtrarMotivosModal(val);

    const cleanVal = (val || '').trim();
    if (cleanVal === this.DEFECTO_NUEVO) {
      this.draftDefModal.isOtro = true;
      this.draftDefModal.motivo = '';
    } else {
      const match = this.MOTIVOS.find(m => this.normalizarTexto(m) === this.normalizarTexto(cleanVal));
      this.draftDefModal.isOtro = false;
      this.draftDefModal.motivo = match || cleanVal;
    }

    if (cleanVal && this.draftDefModal.errors['motivo']) {
      delete this.draftDefModal.errors['motivo'];
    }
  }

  onModalMotivoSelected(val: string): void {
    if (val === this.DEFECTO_NUEVO) {
      this.filtroModalMotivo = this.DEFECTO_NUEVO;
      this.draftDefModal.isOtro = true;
      this.draftDefModal.motivo = '';
    } else {
      this.filtroModalMotivo = val;
      this.draftDefModal.isOtro = false;
      this.draftDefModal.motivo = val;
    }
    if (this.draftDefModal.errors['motivo']) {
      delete this.draftDefModal.errors['motivo'];
    }
  }

  limpiarModalMotivo(event?: MouseEvent, trigger?: any): void {
    if (event) event.stopPropagation();
    this.filtroModalMotivo = '';
    this.draftDefModal.motivo = '';
    this.draftDefModal.isOtro = false;
    this.draftDefModal.descripcionOtro = '';
    this.filtrarMotivosModal('');
    if (trigger && typeof trigger.openPanel === 'function') {
      setTimeout(() => trigger.openPanel(), 0);
    }
  }

  // Grabar Motivo Pendiente
  filtrarMotivosGrabar(texto?: string): void {
    const query = this.normalizarTexto(texto !== undefined ? texto : (this.filtroGrabarMotivo || ''));
    if (!query) {
      this.motivosFiltradosGrabar = this.MOTIVOS.slice(0, 100);
    } else {
      this.motivosFiltradosGrabar = this.MOTIVOS
        .filter(m => this.normalizarTexto(m).includes(query))
        .slice(0, 100);
    }
  }

  onGrabarMotivoFocus(trigger: any): void {
    this.filtrarMotivosGrabar(this.filtroGrabarMotivo);
    if (trigger && typeof trigger.openPanel === 'function') {
      setTimeout(() => trigger.openPanel(), 0);
    }
  }

  toggleGrabarMotivoPanel(trigger: any, event: MouseEvent): void {
    event.stopPropagation();
    if (trigger) {
      if (trigger.panelOpen) {
        trigger.closePanel();
      } else {
        this.filtrarMotivosGrabar(this.filtroGrabarMotivo);
        trigger.openPanel();
      }
    }
  }

  onGrabarMotivoInput(val: string): void {
    this.filtroGrabarMotivo = val;
    this.filtrarMotivosGrabar(val);
    const cleanVal = (val || '').trim();
    const match = this.MOTIVOS.find(m => this.normalizarTexto(m) === this.normalizarTexto(cleanVal));
    this.grabarMotivo.motivo = match || cleanVal;
    if (cleanVal && this.grabarMotivo.errors['motivo']) {
      delete this.grabarMotivo.errors['motivo'];
    }
  }

  onGrabarMotivoSelected(val: string): void {
    this.filtroGrabarMotivo = val;
    this.grabarMotivo.motivo = val;
    if (this.grabarMotivo.errors['motivo']) {
      delete this.grabarMotivo.errors['motivo'];
    }
  }

  limpiarGrabarMotivo(event?: MouseEvent, trigger?: any): void {
    if (event) event.stopPropagation();
    this.filtroGrabarMotivo = '';
    this.grabarMotivo.motivo = '';
    this.filtrarMotivosGrabar('');
    if (trigger && typeof trigger.openPanel === 'function') {
      setTimeout(() => trigger.openPanel(), 0);
    }
  }

  handleGrupoFiles(files: FileList | null): void {
    if (!files || !files.length || !this.draft) return;
    Array.from(files).forEach(f => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.draft!.grupoDefecto.evidencia.push({ name: f.name, dataUrl: e.target.result });
      };
      reader.readAsDataURL(f);
    });
  }

  // Métodos de Cámara en Tiempo Real (WebRTC)
  async openCameraModal(target: 'grupo' | 'modal'): Promise<void> {
    this.cameraModal = { open: true, target, stream: null, error: '' };
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.cameraModal.error = 'Su navegador o conexión no soporta la cámara directa. Use "Subir Fotos".';
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      this.cameraModal.stream = stream;
      setTimeout(() => {
        if (this.cameraVideo && this.cameraVideo.nativeElement) {
          this.cameraVideo.nativeElement.srcObject = stream;
          this.cameraVideo.nativeElement.play();
        }
      }, 150);
    } catch (err: any) {
      console.error('Error accediendo a la cámara:', err);
      this.cameraModal.error = 'No se pudo abrir la cámara. Verifique que otorgó permisos de cámara a la aplicación.';
    }
  }

  captureCameraPhoto(): void {
    if (!this.cameraVideo || !this.cameraVideo.nativeElement) return;
    const video = this.cameraVideo.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const photoName = `foto_camara_${new Date().getTime()}.jpg`;
      if (this.cameraModal.target === 'grupo' && this.draft) {
        this.draft.grupoDefecto.evidencia.push({ name: photoName, dataUrl });
      } else if (this.cameraModal.target === 'modal') {
        this.draftDefModal.evidencia.push({ name: photoName, dataUrl });
      }
    }
    this.closeCameraModal();
  }

  closeCameraModal(): void {
    if (this.cameraModal.stream) {
      this.cameraModal.stream.getTracks().forEach(track => track.stop());
    }
    this.cameraModal = { open: false, target: 'grupo', stream: null, error: '' };
  }

  removeGrupoEvidencia(pi: number): void {
    if (!this.draft) return;
    this.draft.grupoDefecto.evidencia.splice(pi, 1);
  }

  aplicarGrupoDefecto(): void {
    if (!this.draft) return;
    const g = this.draft.grupoDefecto;
    g.errors = {};
    let ok = true;
    const selectedIdxs = Object.keys(g.seleccion).filter(k => g.seleccion[Number(k)]);
    if (selectedIdxs.length === 0) {
      g.errors['seleccion'] = 'Seleccione al menos un artículo para aplicar los datos.';
      ok = false;
    }
    if (g.isOtro) {
      if (!g.descripcionOtro || !g.descripcionOtro.trim()) {
        g.errors['desc'] = 'Describa el defecto nuevo.';
        ok = false;
      }
    } else if (!g.motivo) {
      g.errors['motivo'] = 'Seleccione o escriba el motivo de rechazo.';
      ok = false;
    }
    if (!g.area) {
      g.errors['area'] = 'Seleccione el área responsable.';
      ok = false;
    } else if (g.area === this.OTRA_AREA && !(g.areaOtro || '').trim()) {
      g.errors['areaOtro'] = 'Especifique el área responsable.';
      ok = false;
    }
    if (!g.evidencia || g.evidencia.length === 0) {
      g.errors['evidencia'] = 'Debe adjuntar al menos una foto de evidencia fotográfica (subir o tomar foto).';
      ok = false;
    }

    if (!ok) return;

    selectedIdxs.forEach(k => {
      const idx = Number(k);
      const sel = this.draft!.seleccion[idx];
      if (sel) {
        if (!sel.defectos) {
          sel.defectos = [];
        }
        // Limpiar defectos vacíos/iniciales sin motivo asignado
        sel.defectos = sel.defectos.filter(d => (d.motivo && d.motivo.trim() !== '') || (d.isOtro && d.descripcionOtro && d.descripcionOtro.trim() !== ''));

        const nuevoDefecto: DefectoItem = {
          motivo: g.isOtro ? '' : g.motivo,
          isOtro: g.isOtro,
          descripcionOtro: g.descripcionOtro || '',
          area: g.area,
          areaOtro: g.areaOtro || '',
          evidencia: [...g.evidencia],
          comentario: this.draft!.comentario || '',
          open: false
        };

        // Agregar el nuevo defecto a la lista del artículo
        sel.defectos.push(nuevoDefecto);
        sel.checked = true;
        sel.open = true;
      }
    });

    // Limpiar el formulario de 'Asignación Defecto' para permitir ingresar una nueva asignación
    this.draft.grupoDefecto = {
      seleccion: {},
      motivo: '',
      isOtro: false,
      descripcionOtro: '',
      area: '',
      areaOtro: '',
      evidencia: [],
      errors: {}
    };
    this.filtroGrupoMotivo = '';
    this.filtrarMotivosGrupo('');
    this.draft.comentario = '';

    Swal.fire({
      icon: 'success',
      title: 'Defecto asignado',
      text: 'Se aplicó el defecto a los artículos seleccionados. El formulario quedó libre para asignar otros defectos.',
      timer: 1600,
      showConfirmButton: false
    });
  }

  // Modal para editar/agregar un defecto específico
  openDraftDefectoModal(artIdx: number, defIdx: number | null): void {
    if (!this.draft) return;
    if (defIdx === null) {
      this.draftDefModal = {
        open: true,
        artIdx,
        defIdx: null,
        motivo: '',
        isOtro: false,
        descripcionOtro: '',
        area: '',
        areaOtro: '',
        evidencia: [],
        comentario: '',
        errors: {}
      };
      this.filtroModalMotivo = '';
      this.filtrarMotivosModal('');
    } else {
      const def = this.draft.seleccion[artIdx].defectos[defIdx];
      this.draftDefModal = {
        open: true,
        artIdx,
        defIdx,
        motivo: def.motivo,
        isOtro: def.isOtro,
        descripcionOtro: def.descripcionOtro || '',
        area: def.area || '',
        areaOtro: def.areaOtro || '',
        evidencia: def.evidencia.map(f => ({ ...f })),
        comentario: def.comentario || '',
        errors: {}
      };
      this.filtroModalMotivo = def.isOtro ? this.DEFECTO_NUEVO : (def.motivo || '');
      this.filtrarMotivosModal(this.filtroModalMotivo);
    }
  }

  saveDraftDefectoModal(): void {
    const m = this.draftDefModal;
    m.errors = {};
    let ok = true;
    if (m.isOtro) {
      if (!m.descripcionOtro || !m.descripcionOtro.trim()) {
        m.errors['desc'] = 'Describa el defecto encontrado.';
        ok = false;
      }
    } else if (!m.motivo) {
      m.errors['motivo'] = 'Seleccione el motivo de rechazo.';
      ok = false;
    }
    if (!m.area) {
      m.errors['area'] = 'Seleccione el área responsable.';
      ok = false;
    } else if (m.area === this.OTRA_AREA && !(m.areaOtro || '').trim()) {
      m.errors['areaOtro'] = 'Especifique el área responsable.';
      ok = false;
    }

    if (!ok || !this.draft) return;

    const arr = this.draft.seleccion[m.artIdx].defectos;
    const data: DefectoItem = {
      motivo: m.isOtro ? '' : m.motivo,
      isOtro: m.isOtro,
      descripcionOtro: m.descripcionOtro,
      area: m.area,
      areaOtro: m.areaOtro,
      evidencia: m.evidencia,
      comentario: m.comentario,
      open: false
    };

    if (m.defIdx === null) {
      arr.push(data);
    } else {
      arr[m.defIdx] = data;
    }
    this.draftDefModal.open = false;
  }

  removeDefecto(artIdx: number, defIdx: number): void {
    if (!this.draft) return;
    this.draft.seleccion[artIdx].defectos.splice(defIdx, 1);
  }

  handleModalFiles(files: FileList | null): void {
    if (!files || !files.length) return;
    Array.from(files).forEach(f => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.draftDefModal.evidencia.push({ name: f.name, dataUrl: e.target.result });
      };
      reader.readAsDataURL(f);
    });
  }

  removeModalEvidencia(pi: number): void {
    this.draftDefModal.evidencia.splice(pi, 1);
  }

  validatePaso2(): void {
    if (!this.draft) return;
    this.errors = {};
    const checkedIdx = Object.keys(this.draft.seleccion).filter(k => this.draft!.seleccion[Number(k)].checked);
    let faltanDefectos = false;

    checkedIdx.forEach(k => {
      const sel = this.draft!.seleccion[Number(k)];
      if (!sel.defectos || sel.defectos.length === 0) {
        faltanDefectos = true;
      } else {
        sel.defectos.forEach(d => {
          if ((!d.motivo && !d.isOtro) || (d.isOtro && !d.descripcionOtro) || !d.area) {
            faltanDefectos = true;
          }
        });
      }
    });

    if (faltanDefectos) {
      this.errors['summary'] = 'Complete el motivo y área responsable para cada artículo seleccionado.';
      return;
    }

    this.goTo('paso3');
  }

  // Wizard Paso 3: Confirmación
  getArticulosResumenDraft(): ArticuloSeleccionado[] {
    if (!this.draft) return [];
    const isEditMode = this.currentScreen === 'editar' || this.wizardEditMode || !!this.editingId;
    const list: ArticuloSeleccionado[] = [];
    Object.keys(this.draft.seleccion).forEach(k => {
      const idx = Number(k);
      const sel = this.draft!.seleccion[idx];
      const a = this.draft!.articulosDisponibles[idx];
      if (!a || !sel) return;

      const isIncluded = isEditMode
        ? (Number(sel.cantidad) > 0 || (sel.defectos && sel.defectos.length > 0) || sel.checked)
        : sel.checked;

      if (isIncluded) {
        list.push({
          tipo: a.tipo,
          nombre: a.nombre,
          codTela: a.codTela,
          talla: a.talla,
          kgCrudo: a.kgCrudo,
          rollos: a.rollos,
          cantidad: sel.cantidad,
          defectos: sel.defectos
        });
      }
    });
    return list;
  }

  calcularKgAfectados(a: { kgCrudo: string; rollos: number; cantidad: number | string }): string {
    const kg = parseFloat(a.kgCrudo);
    const rollos = Number(a.rollos);
    const cant = Number(a.cantidad);
    if (!kg || !rollos || isNaN(cant)) return '0.00';
    return (kg * (cant / rollos)).toFixed(2);
  }

  calcularPesoTotalAfectado(articulos: { kgCrudo: string; rollos: number; cantidad: number | string }[]): string {
    if (!articulos || articulos.length === 0) return '0.00';
    const total = articulos.reduce((sum, a) => {
      const kgAf = parseFloat(this.calcularKgAfectados(a));
      return sum + (isNaN(kgAf) ? 0 : kgAf);
    }, 0);
    return total.toFixed(2);
  }

  tieneDefectoNuevoDraft(): boolean {
    if (!this.draft) return false;
    return Object.values(this.draft.seleccion).some(s => s.checked && (s.defectos || []).some(d => d.isOtro));
  }

  buildMensajeWhatsApp(): string {
    if (!this.draft) return '';
    const arts = this.getArticulosResumenDraft();
    const areas = this.getAreasDraft();
    const motivos = this.getMotivosDraft();
    let msg = `🔴 *NUEVA NO CONFORMIDAD*\nN° NC: ${this.draft.ncPreview}\nPartida: ${this.draft.partida} | Cliente: ${this.draft.cliente}\nColor: ${this.draft.color}\nÁrea(s): ${areas}\nMotivo(s): ${motivos}\nRegistrado por: ${this.sUsuario}\nFecha: ${this.draft.fechaRegistro}`;
    if (this.tieneDefectoNuevoDraft()) {
      msg += `\n\n⚠️ *ALERTA:* Contiene defecto nuevo pendiente de validación por Calidad. No se envía a SIGE hasta su revisión.`;
    }
    return msg;
  }

  buildMensajeSIGE(): string {
    if (!this.draft || this.tieneDefectoNuevoDraft()) return '';
    const areas = this.getAreasDraft();
    const arts = this.getArticulosResumenDraft();
    let detalle = '';
    arts.forEach(a => {
      a.defectos.forEach(d => {
        detalle += `  • ${a.nombre} (Talla ${a.talla}, ${a.cantidad} de ${a.rollos} rollos): ${this.defectoLabel(d)} — Área: ${this.defectoAreaFinal(d)}\n`;
      });
    });
    return `REGISTRO SIGE\nNC: ${this.draft.ncPreview} | ESTADO: Registrada | PROCESO: PRODUCCIÓN\nPARTIDA: ${this.draft.partida} | CLIENTE: ${this.draft.cliente}\nCOLOR: ${this.draft.color} | PESO: ${this.draft.peso}\nÁREA(S): ${areas}\nDETALLE POR ARTÍCULO:\n${detalle}FECHA: ${this.draft.fechaRegistro}`;
  }

  getAreasDraft(): string {
    const areas: string[] = [];
    this.getArticulosResumenDraft().forEach(a => a.defectos.forEach(d => {
      const ar = this.defectoAreaFinal(d);
      if (ar && !areas.includes(ar)) areas.push(ar);
    }));
    return areas.join(', ') || '-';
  }

  getMotivosDraft(): string {
    const list: string[] = [];
    this.getArticulosResumenDraft().forEach(a => a.defectos.forEach(d => {
      list.push(this.defectoLabel(d));
    }));
    return list.join('; ') || '-';
  }

  solicitarMotivoEdicion(): void {
    if (!this.draft) return;

    // Obtener los artículos seleccionados / afectados
    const artsAfectados: { a: any, sel: any, idx: number }[] = [];
    Object.keys(this.draft.seleccion).forEach(k => {
      const idx = Number(k);
      const a = this.draft!.articulosDisponibles[idx];
      const sel = this.draft!.seleccion[idx];
      if (a && sel && (sel.checked || (Number(sel.cantidad) > 0) || (sel.defectos && sel.defectos.length > 0))) {
        artsAfectados.push({ a, sel, idx });
      }
    });

    if (artsAfectados.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Seleccione al menos un artículo e indique la cantidad afectada y sus motivos de rechazo.'
      });
      return;
    }

    // Validar que cada artículo afectado tenga cantidad > 0 y defectos válidos
    for (const item of artsAfectados) {
      const cant = Number(item.sel.cantidad);
      const maxRollos = Number(item.a.rollos) || 0;
      if (isNaN(cant) || cant <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Cantidad requerida',
          text: `Debe ingresar una cantidad afectada mayor a 0 para el artículo: "${item.a.nombre}".`
        });
        item.sel.checked = true;
        item.sel.open = true;
        return;
      }
      if (maxRollos > 0 && cant > maxRollos) {
        Swal.fire({
          icon: 'warning',
          title: 'Cantidad excedida',
          text: `La cantidad afectada (${cant}) no puede superar los rollos disponibles (${maxRollos}) para el artículo: "${item.a.nombre}".`
        });
        item.sel.checked = true;
        item.sel.open = true;
        return;
      }
      if (!item.sel.defectos || item.sel.defectos.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Defecto requerido',
          text: `Debe asignar al menos un motivo de rechazo y área responsable para el artículo: "${item.a.nombre}".`
        });
        item.sel.checked = true;
        item.sel.open = true;
        return;
      }
      const tieneDefInvalido = item.sel.defectos.some((d: DefectoItem) => 
        (!d.motivo && !d.isOtro) || (d.isOtro && !d.descripcionOtro?.trim()) || !d.area?.trim()
      );
      if (tieneDefInvalido) {
        Swal.fire({
          icon: 'warning',
          title: 'Defecto incompleto',
          text: `Complete el motivo y área responsable en todos los defectos del artículo: "${item.a.nombre}".`
        });
        item.sel.checked = true;
        item.sel.open = true;
        return;
      }
    }

    this.motivoEdicionModal = {
      open: true,
      motivo: '',
      otro: '',
      error: ''
    };
  }

  confirmarEdicionConMotivo(): void {
    if (!this.draft || !this.editingId) return;
    const m = this.motivoEdicionModal;
    m.error = '';

    if (!m.motivo) {
      m.error = 'Seleccione el motivo por el cual está modificando esta No Conformidad.';
      return;
    }

    if (m.motivo === 'Otros' && !(m.otro || '').trim()) {
      m.error = 'Especifique el motivo de edición.';
      return;
    }

    const motivoFinal = m.motivo === 'Otros' ? m.otro.trim() : m.motivo;
    const articulos = this.getArticulosResumenDraft();
    const ncIndex = this.ncs.findIndex(x => x.id === this.editingId);
    const numInfClean = (this.editingId || '').replace(/^NC\s*-\s*/i, '').trim();

    // Calcular resumen de cambios realizados
    const originalNC = ncIndex > -1 ? this.ncs[ncIndex] : null;
    const cambiosList: string[] = [];
    if (originalNC && originalNC.articulos) {
      articulos.forEach(art => {
        const origArt = (originalNC.articulos || []).find(x =>
          (x.id && art.id && String(x.id) === String(art.id)) ||
          (x.nombre && art.nombre && x.nombre.trim().toUpperCase() === art.nombre.trim().toUpperCase() && (x.talla || '-').trim() === (art.talla || '-').trim())
        );
        if (origArt) {
          const origDef = origArt.defectos?.[0];
          const newDef = art.defectos?.[0];

          const extractCode = (mStr: string) => {
            if (!mStr) return '';
            const mMatch = mStr.match(/^([A-Z0-9]+)/i);
            return mMatch ? mMatch[1].trim() : mStr.trim();
          };

          const origCant = Number(origArt.cantidad) || 0;
          const newCant = Number(art.cantidad) || 0;
          const cantCambio = origCant !== newCant;

          const origMotivo = origDef ? (origDef.motivo || '') : '';
          const newMotivo = newDef ? (newDef.motivo || '') : '';
          const defCambio = origDef && newDef && origMotivo !== newMotivo;

          const defCod = extractCode(newMotivo || origMotivo || '');
          const origCod = extractCode(origMotivo);
          const newCod = extractCode(newMotivo);

          if (cantCambio && defCambio) {
            cambiosList.push(`Modificación el defecto: ${origCod} -> ${newCod} y la (Cantidad rechazada: ${origCant} -> ${newCant})`);
          } else if (cantCambio) {
            cambiosList.push(`Modificación el defecto: ${defCod || 'general'} y la (Cantidad rechazada: ${origCant} -> ${newCant})`);
          } else if (defCambio) {
            cambiosList.push(`Modificación el defecto: ${origCod} -> ${newCod}`);
          } else if (origDef && newDef && origDef.area !== newDef.area) {
            cambiosList.push(`Modificación el defecto: ${defCod} (Área: ${origDef.area} -> ${newDef.area})`);
          }
        }
      });
    }
    if (cambiosList.length === 0) {
      cambiosList.push(motivoFinal ? `Modificación de NC: ${motivoFinal}` : 'Modificación de NC');
    }
    const detalleCambios = cambiosList.join('\n');

    const kgTotalAfectado = parseFloat(this.calcularPesoTotalAfectado(articulos));
    if (kgTotalAfectado > 0) {
      this.draft.peso = `${kgTotalAfectado.toFixed(2)} kg`;
    }
    const kgTotalFinal = kgTotalAfectado > 0
      ? kgTotalAfectado
      : (parseFloat((this.draft.peso || '').replace(/[^0-9.]/g, '')) || 0);

    const payload = {
      accion: 'U',
      num_Informe: numInfClean,
      cod_OrdPro: this.draft.partida,
      cod_Cli: '',
      nom_Cli: this.draft.cliente,
      cod_Color: '',
      color: this.draft.color,
      kg_Total: kgTotalFinal,
      observacion: this.draft.comentario || '',
      cod_Usuario: this.sUsuario || GlobalVariable.vusu || 'SISTEMAS',
      nom_Usuario: this.sUsuario || GlobalVariable.vusu || 'SISTEMAS',
      motivo_Edicion: motivoFinal,
      detalle_Cambios: detalleCambios,
      articulos: Object.keys(this.draft.seleccion)
        .filter(k => {
          const sel = this.draft!.seleccion[Number(k)];
          return sel && (sel.checked || (Number(sel.cantidad) > 0) || (sel.defectos && sel.defectos.length > 0));
        })
        .filter(k => {
          const sel = this.draft!.seleccion[Number(k)];
          return (Number(sel.cantidad) || 0) > 0;
        })
        .map(k => {
          const idx = Number(k);
          const a = this.draft!.articulosDisponibles[idx];
          const sel = this.draft!.seleccion[idx];
          const itemSec = (a.id !== undefined && a.id !== null) ? String(a.id) : String(idx + 1);
          const cantRech = Number(sel.cantidad) || 0;
          const rollosAsig = Number(a.rollos) || 0;
          const kgsVal = parseFloat(a.kgCrudo) || 0;

          return {
            accion: 'U',
            item: itemSec,
            cod_Tela: a.codTela || '',
            nom_Tela: a.nombre || a.codTela || '',
            comb: '',
            cod_Color: '',
            talla: a.talla === '-' ? '' : (a.talla || ''),
            kgs: kgsVal,
            rollos: rollosAsig,
            cant_Rollos_Rech: cantRech,
            defectos: (sel.defectos || []).map(d => {
              const matchMotivo = (d.motivo || '').match(/^([A-Z0-9]+)\s*-\s*(.*)$/);
              const codMotivo = matchMotivo ? matchMotivo[1] : (d.motivo || '');
              const desMotivo = matchMotivo ? matchMotivo[2].trim() : (d.motivo || '');
              const matchArea = (d.area || '').match(/^([A-Z0-9]+)\s*-\s*(.*)$/);
              let rawArea = matchArea ? matchArea[1] : (d.area === this.OTRA_AREA ? (d.areaOtro || '') : d.area);
              const codArea = this.mapaCodigosArea[(rawArea || '').trim().toUpperCase()] || rawArea || '';
              const nomArea = (d.area === this.OTRA_AREA ? (d.areaOtro || '') : (matchArea ? matchArea[2].trim() : d.area)) || '';

              const fotosBase64 = (d.evidencia || [])
                .map(f => f.dataUrl)
                .filter(url => url && url.startsWith('data:image'));

              return {
                accion: 'I',
                item: itemSec,
                cod_Area: codArea,
                nom_Area: nomArea || '',
                cod_Motivo: codMotivo || '',
                des_Motivo: desMotivo || '',
                observacion: d.isOtro ? d.descripcionOtro : (d.comentario || ''),
                fotosBase64: fotosBase64
              };
            })
          };
        })
    };

    m.open = false;

    Swal.fire({
      title: 'Actualizando No Conformidad...',
      text: 'Por favor espere mientras se guardan los cambios.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.ncService.guardarInforme(payload).subscribe({
      next: (resp: any) => {
        Swal.close();
        if (resp && resp.success) {
          if (ncIndex > -1) {
            this.ncs[ncIndex].articulos = articulos;
            this.ncs[ncIndex].comentario = this.draft!.comentario;
            this.ncs[ncIndex].historial.push({
              fecha: this.nowStr(),
              usuario: this.sUsuario,
              accion: detalleCambios.replace(/\n/g, ', ')
            });
            this.dataSourceNc.data = [...this.ncs];
          }

          Swal.fire({
            icon: 'success',
            title: '¡No Conformidad Actualizada!',
            text: `La ${this.editingId} fue modificada exitosamente.`,
            timer: 2000,
            showConfirmButton: false
          });

          this.draft = null;
          this.editingId = null;
          this.cargarInformesCabecera();
          this.goTo('inicio');
        } else {
          Swal.fire('Error', resp?.message || 'No se pudo actualizar.', 'error');
        }
      },
      error: (err: any) => {
        Swal.close();
        console.error('Error al actualizar informe:', err);
        const msj = err?.error?.message || (typeof err?.error === 'string' ? err.error : 'Error desconocido al actualizar.');
        Swal.fire('Error al actualizar', msj, 'error');
      }
    });
  }

  confirmarRegistroNC(): void {
    if (!this.draft) return;
    const articulos = this.getArticulosResumenDraft();

    if (this.editingId) {
      this.solicitarMotivoEdicion();
      return;
    }

    // Construir Payload para el Backend
    const kgTotalAfectado = parseFloat(this.calcularPesoTotalAfectado(articulos));
    if (kgTotalAfectado > 0) {
      this.draft.peso = `${kgTotalAfectado.toFixed(2)} kg`;
    }
    const kgTotalFinal = kgTotalAfectado > 0
      ? kgTotalAfectado
      : (parseFloat((this.draft.peso || '').replace(/[^0-9.]/g, '')) || 0);

    const payload = {
      accion: 'I',
      num_Informe: '',
      cod_OrdPro: this.draft.partida,
      cod_Cli: '',
      nom_Cli: this.draft.cliente,
      cod_Color: '',
      color: this.draft.color,
      kg_Total: kgTotalFinal,
      observacion: this.draft.comentario || '',
      cod_Usuario: this.sUsuario || GlobalVariable.vusu || 'SISTEMAS',
      nom_Usuario: this.sUsuario || GlobalVariable.vusu || 'SISTEMAS',
      articulos: Object.keys(this.draft.seleccion)
        .filter(k => this.draft!.seleccion[Number(k)].checked)
        .map(k => {
          const idx = Number(k);
          const a = this.draft!.articulosDisponibles[idx];
          const sel = this.draft!.seleccion[idx];
          const itemSec = (a.id !== undefined && a.id !== null) ? String(a.id) : String(idx + 1);
          const cantRech = Number(sel.cantidad) || 0;
          const rollosAsig = Number(a.rollos) || 0;
          const kgsVal = parseFloat(a.kgCrudo) || 0;

          return {
            accion: 'U',
            item: itemSec,
            cod_Tela: a.codTela || '',
            nom_Tela: a.nombre || a.codTela || '',
            comb: '',
            cod_Color: '',
            talla: a.talla === '-' ? '' : (a.talla || ''),
            kgs: kgsVal,
            rollos: rollosAsig,
            cant_Rollos_Rech: cantRech,
            defectos: (sel.defectos || []).map(d => {
              const matchMotivo = (d.motivo || '').match(/^([A-Z0-9]+)\s*-\s*(.*)$/);
              const codMotivo = matchMotivo ? matchMotivo[1] : (d.motivo || '');
              const desMotivo = matchMotivo ? matchMotivo[2].trim() : (d.motivo || '');
              const matchArea = (d.area || '').match(/^([A-Z0-9]+)\s*-\s*(.*)$/);
              let rawArea = matchArea ? matchArea[1] : (d.area === this.OTRA_AREA ? (d.areaOtro || '') : d.area);
              const codArea = this.mapaCodigosArea[(rawArea || '').trim().toUpperCase()] || rawArea || '';
              const nomArea = (d.area === this.OTRA_AREA ? (d.areaOtro || '') : (matchArea ? matchArea[2].trim() : d.area)) || '';

              const fotosBase64 = (d.evidencia || []).map(f => f.dataUrl).filter(Boolean);

              return {
                accion: 'I',
                item: itemSec,
                cod_Area: codArea,
                nom_Area: nomArea || '',
                cod_Motivo: codMotivo || '',
                des_Motivo: desMotivo || '',
                observacion: d.isOtro ? d.descripcionOtro : (d.comentario || ''),
                fotosBase64: fotosBase64
              };
            })
          };
        })
    };

    Swal.fire({
      title: 'Guardando No Conformidad...',
      text: 'Por favor espere mientras se registra en la base de datos.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.ncService.guardarInforme(payload).subscribe({
      next: (resp: any) => {
        Swal.close();
        if (resp && resp.success) {
          const numGenerado = resp.num_Informe || '';
          Swal.fire({
            icon: 'success',
            title: '¡No Conformidad Registrada!',
            text: numGenerado ? `Se generó exitosamente el informe N° ${numGenerado}.` : 'Informe registrado exitosamente.',
            confirmButtonText: 'Aceptar'
          });

          this.draft = null;
          this.editingId = null;
          this.cargarInformesCabecera();
          this.goTo('inicio');
        } else {
          Swal.fire('Error', resp?.message || 'No se pudo registrar la No Conformidad.', 'error');
        }
      },
      error: (err: any) => {
        Swal.close();
        console.error('Error al guardar informe:', err);
        const msj = err?.error?.message || (typeof err?.error === 'string' ? err.error : JSON.stringify(err?.error || err?.message || 'Error desconocido'));
        Swal.fire('Error al guardar', msj, 'error');
      }
    });
  }

  cancelWizard(): void {
    Swal.fire({
      title: '¿Descartar registro?',
      text: 'Se perderán los datos ingresados en el formulario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, descartar',
      cancelButtonText: 'Continuar editando'
    }).then(res => {
      if (res.isConfirmed) {
        this.draft = null;
        this.editingId = null;
        this.goTo('inicio');
      }
    });
  }

  mapearArticulosYDefectos(articulosRaw: any[], motivosRaw: any[]): ArticuloSeleccionado[] {
    if (!Array.isArray(articulosRaw) || articulosRaw.length === 0) return [];

    // Filtrar para mostrar únicamente los registros afectados (rollos rechazados > 0 o con defectos asignados)
    const itemsAfectados = articulosRaw.filter((a: any) => {
      const rech = a.Rollos_Rechazados !== undefined ? Number(a.Rollos_Rechazados) : (a.rollos_Rechazados !== undefined ? Number(a.rollos_Rechazados) : null);
      if (rech !== null && !isNaN(rech)) {
        return rech > 0;
      }
      const sec = a.Num_Secuencia !== undefined && a.Num_Secuencia !== null ? Number(a.Num_Secuencia) : (a.num_Secuencia !== undefined && a.num_Secuencia !== null ? Number(a.num_Secuencia) : a.Item);
      const aCodTela = (a.CodTela || a.codTela || '').trim().toUpperCase();
      const hasDef = (motivosRaw || []).some((m: any) => {
        const mSec = m.Num_Secuencia !== undefined && m.Num_Secuencia !== null ? Number(m.Num_Secuencia) : (m.num_Secuencia !== undefined && m.num_Secuencia !== null ? Number(m.num_Secuencia) : m.Item);
        if (mSec !== undefined && mSec !== null && mSec !== '') {
          return String(mSec) === String(sec);
        }
        const mCodTela = (m.Cod_Tela || m.cod_Tela || '').trim().toUpperCase();
        return mCodTela && aCodTela && mCodTela === aCodTela;
      });
      return hasDef;
    });

    const listaAProcesar = itemsAfectados.length > 0 ? itemsAfectados : articulosRaw;

    return listaAProcesar.map((a: any, idx: number) => {
      const sec = a.Num_Secuencia !== undefined && a.Num_Secuencia !== null ? Number(a.Num_Secuencia) : (a.num_Secuencia !== undefined && a.num_Secuencia !== null ? Number(a.num_Secuencia) : (a.Item || (idx + 1)));
      const aCodTela = (a.CodTela || a.codTela || '').trim().toUpperCase();

      const defs = (motivosRaw || []).filter((m: any) => {
        const mSec = m.Num_Secuencia !== undefined && m.Num_Secuencia !== null ? Number(m.Num_Secuencia) : (m.num_Secuencia !== undefined && m.num_Secuencia !== null ? Number(m.num_Secuencia) : m.Item);
        if (mSec !== undefined && mSec !== null && mSec !== '') {
          return String(mSec) === String(sec);
        }
        const mCodTela = (m.Cod_Tela || m.cod_Tela || '').trim().toUpperCase();
        return mCodTela && aCodTela && mCodTela === aCodTela;
      }).map((m: any) => {
        const fotosList: string[] = m.Fotos || m.fotos || [];
        const evidencia = fotosList.map((fotoName: string) => ({
          name: fotoName,
          dataUrl: this.ncService.getUrlImagen(fotoName)
        }));

        return {
          motivo: m.Motivo || m.motivo || m.Des_Motivo || m.Cod_Motivo || '',
          isOtro: false,
          descripcionOtro: m.Observacion || m.observacion || '',
          area: m.Area || m.area || m.Nom_Area || m.Cod_Area || '',
          areaOtro: '',
          evidencia: evidencia,
          comentario: m.Observacion || m.observacion || '',
          open: false
        };
      });

      const talla = (a.Talla || a.talla || '-').trim() || '-';
      const tipo = talla !== '-' ? 'Complemento' : 'Cuerpo';
      const cantAfectada = Number(a.Rollos_Rechazados !== undefined ? a.Rollos_Rechazados : (a.rollos_Rechazados !== undefined ? a.rollos_Rechazados : (a.Rollos || 0)));

      return {
        id: sec,
        tipo: tipo,
        nombre: (a.Tela || a.tela || a.CodTela || `Artículo ${sec}`).trim(),
        codTela: (a.CodTela || a.codTela || '').trim(),
        talla: talla,
        kgCrudo: String(a.Kgs || a.kgs || '0'),
        rollos: Number(a.Rollos || a.rollos || 0),
        cantidad: cantAfectada,
        defectos: defs
      };
    });
  }

  // Detalle de NC
  openDetalle(id: string): void {
    const nc = this.ncs.find(x => x.id === id || x.numero === id);
    if (!nc) return;
    this.detalleNC = nc;
    this.detalleOpen = { general: true, articulos: true, defectos: true, historial: false };

    const numInforme = (nc.numero || nc.id || '').replace(/^NC\s*-\s*/i, '').trim();
    if (numInforme) {
      this.ncService.getInformeDetalle(numInforme, nc.partida).subscribe({
        next: (res: any) => {
          const articulosRaw = res?.articulos || (Array.isArray(res) ? res : []);
          const motivosRaw = res?.motivos || [];
          const historialRaw = res?.historial || [];
          
          if (Array.isArray(articulosRaw) && articulosRaw.length > 0) {
            nc.articulos = this.mapearArticulosYDefectos(articulosRaw, motivosRaw);
            const totalKg = parseFloat(this.calcularPesoTotalAfectado(nc.articulos));
            if (totalKg > 0) {
              nc.peso = `${totalKg.toFixed(2)} kg`;
            }
            if (!nc.comentario) {
              const obs = (motivosRaw || []).find((m: any) => m.Observacion || m.observacion);
              if (obs) nc.comentario = (obs.Observacion || obs.observacion || '').trim();
            }
          }

          if (Array.isArray(historialRaw) && historialRaw.length > 0) {
            nc.historial = historialRaw
              .filter((h: any) => {
                const acc = (h.accion || '').toLowerCase();
                return !acc.startsWith('se registr') && !acc.includes('se registró defecto');
              })
              .map((h: any) => ({
                fecha: h.fecha || '',
                usuario: h.usuario || h.cod_usuario || 'SISTEMAS',
                accion: h.accion || ''
              }));
          }
        },
        error: (err) => console.error('Error cargando detalle de NC:', err)
      });
    }

    // Cargar la lista completa de artículos de la partida para "Peso por artículo"
    if (nc.partida && (!nc.articulosPartida || nc.articulosPartida.length === 0)) {
      this.ncService.getInformeDetalle('', nc.partida).subscribe({
        next: (res: any) => {
          const articulosPartidaRaw = res?.articulos || (Array.isArray(res) ? res : []);
          if (Array.isArray(articulosPartidaRaw) && articulosPartidaRaw.length > 0) {
            nc.articulosPartida = articulosPartidaRaw.map((a: any, idx: number) => ({
              id: a.Num_Secuencia !== undefined && a.Num_Secuencia !== null ? Number(a.Num_Secuencia) : (a.num_Secuencia !== undefined && a.num_Secuencia !== null ? Number(a.num_Secuencia) : (a.Item || (idx + 1))),
              tipo: (a.Talla || a.talla || '').trim() && (a.Talla || a.talla || '').trim() !== '-' ? 'Complemento' : 'Cuerpo',
              nombre: (a.Tela || a.tela || a.CodTela || `Artículo ${idx + 1}`).trim(),
              codTela: (a.CodTela || a.codTela || '').trim(),
              talla: (a.Talla || a.talla || '-').trim() || '-',
              kgCrudo: String(a.Kgs || a.kgs || '0'),
              rollos: Number(a.Rollos || a.rollos || 0)
            }));
          } else if (this.PARTIDAS_DB[nc.partida]) {
            nc.articulosPartida = this.PARTIDAS_DB[nc.partida].articulos;
          }
        },
        error: () => {
          if (this.PARTIDAS_DB[nc.partida]) {
            nc.articulosPartida = this.PARTIDAS_DB[nc.partida].articulos;
          }
        }
      });
    }

    this.goTo('detalle');
  }

  getArticulosPartidaDetalle(): ArticuloPartida[] {
    if (!this.detalleNC) return [];
    if (this.detalleNC.articulosPartida && this.detalleNC.articulosPartida.length > 0) {
      return this.detalleNC.articulosPartida;
    }
    return (this.detalleNC.articulos || []).map(a => ({
      id: typeof a.id === 'number' ? a.id : (a.id ? Number(a.id) : undefined),
      tipo: a.tipo,
      nombre: a.nombre,
      codTela: a.codTela,
      talla: a.talla,
      kgCrudo: a.kgCrudo,
      rollos: a.rollos
    }));
  }

  formatearKg(kg: string | number | undefined): string {
    if (kg === undefined || kg === null || kg === '') return '0 kg';
    const s = String(kg).trim();
    return s.endsWith('kg') ? s : `${s} kg`;
  }

  cancelarEdicion(): void {
    this.draft = null;
    this.editingId = null;
    this.goTo('inicio');
  }

  getTotalDefectosCount(nc: NoConformidad | null): number {
    if (!nc || !nc.articulos) return 0;
    let count = 0;
    nc.articulos.forEach(a => {
      if (a.defectos) count += a.defectos.length;
    });
    return count;
  }

  editarNC(nc: NoConformidad): void {
    const numInforme = (nc.numero || nc.id || '').replace(/^NC\s*-\s*/i, '').trim();

    const needAfectados = (!nc.articulos || nc.articulos.length === 0) && !!numInforme;
    const needPartida = nc.partida && (!nc.articulosPartida || nc.articulosPartida.length === 0);

    if (needAfectados || needPartida) {
      Swal.fire({
        title: 'Cargando datos...',
        text: 'Obteniendo los artículos de la No Conformidad y partida.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const reqAfectados = needAfectados ? this.ncService.getInformeDetalle(numInforme, nc.partida) : of(null);
      const reqPartida = needPartida ? this.ncService.getInformeDetalle('', nc.partida) : of(null);

      forkJoin({ afectados: reqAfectados, partida: reqPartida }).subscribe({
        next: ({ afectados, partida }: any) => {
          Swal.close();
          if (afectados) {
            const articulosRaw = afectados?.articulos || (Array.isArray(afectados) ? afectados : []);
            const motivosRaw = afectados?.motivos || [];
            if (Array.isArray(articulosRaw) && articulosRaw.length > 0) {
              nc.articulos = this.mapearArticulosYDefectos(articulosRaw, motivosRaw);
              if (!nc.comentario) {
                const obs = (motivosRaw || []).find((m: any) => m.Observacion || m.observacion);
                if (obs) nc.comentario = (obs.Observacion || obs.observacion || '').trim();
              }
            }
          }

          if (partida) {
            const articulosPartidaRaw = partida?.articulos || (Array.isArray(partida) ? partida : []);
            if (Array.isArray(articulosPartidaRaw) && articulosPartidaRaw.length > 0) {
              nc.articulosPartida = articulosPartidaRaw.map((a: any, idx: number) => ({
                id: a.Num_Secuencia !== undefined && a.Num_Secuencia !== null ? Number(a.Num_Secuencia) : (a.num_Secuencia !== undefined && a.num_Secuencia !== null ? Number(a.num_Secuencia) : (a.Item || (idx + 1))),
                tipo: (a.Talla || a.talla || '').trim() && (a.Talla || a.talla || '').trim() !== '-' ? 'Complemento' : 'Cuerpo',
                nombre: (a.Tela || a.tela || a.CodTela || `Artículo ${idx + 1}`).trim(),
                codTela: (a.CodTela || a.codTela || '').trim(),
                talla: (a.Talla || a.talla || '-').trim() || '-',
                kgCrudo: String(a.Kgs || a.kgs || '0'),
                rollos: Number(a.Rollos || a.rollos || 0)
              }));
            } else if (this.PARTIDAS_DB[nc.partida]) {
              nc.articulosPartida = this.PARTIDAS_DB[nc.partida].articulos;
            }
          }

          this.iniciarEdicion(nc);
        },
        error: (err) => {
          Swal.close();
          console.error('Error cargando detalle para edición:', err);
          this.iniciarEdicion(nc);
        }
      });
      return;
    }

    this.iniciarEdicion(nc);
  }

  iniciarEdicion(nc: NoConformidad): void {
    const dbArticulos = (nc.articulosPartida && nc.articulosPartida.length > 0)
      ? nc.articulosPartida
      : this.PARTIDAS_DB[nc.partida]?.articulos;

    const articulosDisponibles = (dbArticulos && dbArticulos.length > 0)
      ? dbArticulos
      : (nc.articulos || []).map((a, i) => ({
        id: i + 1,
        tipo: a.tipo || 'Cuerpo',
        nombre: a.nombre,
        codTela: a.codTela,
        talla: a.talla,
        kgCrudo: a.kgCrudo,
        rollos: a.rollos
      }));

    this.draft = {
      ncPreview: nc.id,
      fechaRegistro: nc.fecha,
      partida: nc.partida,
      cliente: nc.cliente,
      color: nc.color,
      peso: nc.peso,
      fechaPartida: nc.fechaPartida,
      articulosDisponibles: articulosDisponibles,
      seleccion: {},
      comentario: nc.comentario || '',
      grupoDefecto: {
        seleccion: {},
        motivo: '',
        isOtro: false,
        descripcionOtro: '',
        area: '',
        areaOtro: '',
        evidencia: [],
        errors: {}
      }
    };

    let firstDefecto: DefectoItem | null = null;

    // Prellenar selección y datos de defecto
    if (this.draft.articulosDisponibles.length) {
      this.draft.articulosDisponibles.forEach((a, idx) => {
        const matching = (nc.articulos || []).find(x => 
          (x.id && a.id && String(x.id) === String(a.id)) ||
          (x.nombre && a.nombre && x.nombre.trim().toUpperCase() === a.nombre.trim().toUpperCase() && (x.talla || '-').trim() === (a.talla || '-').trim()) ||
          (x.codTela && a.codTela && x.codTela.trim().toUpperCase() === a.codTela.trim().toUpperCase() && (x.talla || '-').trim() === (a.talla || '-').trim())
        );
        if (matching) {
          this.draft!.seleccion[idx] = {
            checked: true,
            cantidad: matching.cantidad,
            open: true,
            defectos: (matching.defectos || []).map(d => ({ ...d, evidencia: [...(d.evidencia || [])] }))
          };
          this.draft!.grupoDefecto.seleccion[idx] = true;
          if (!firstDefecto && matching.defectos && matching.defectos.length > 0) {
            firstDefecto = matching.defectos[0];
          }
        } else {
          this.draft!.seleccion[idx] = {
            checked: false,
            cantidad: '',
            open: true,
            defectos: []
          };
          this.draft!.grupoDefecto.seleccion[idx] = false;
        }
      });
    }

    if (firstDefecto) {
      const fd: DefectoItem = firstDefecto;
      this.draft.grupoDefecto.motivo = fd.motivo || '';
      this.draft.grupoDefecto.isOtro = !!fd.isOtro;
      this.draft.grupoDefecto.descripcionOtro = fd.descripcionOtro || '';
      this.draft.grupoDefecto.area = fd.area || '';
      this.draft.grupoDefecto.areaOtro = fd.areaOtro || '';
      this.draft.grupoDefecto.evidencia = fd.evidencia ? fd.evidencia.map(f => ({ ...f })) : [];
      this.filtroGrupoMotivo = this.draft.grupoDefecto.isOtro ? this.DEFECTO_NUEVO : (this.draft.grupoDefecto.motivo || '');
      this.filtrarMotivosGrupo(this.filtroGrupoMotivo);
    }

    this.editingId = nc.id;
    this.wizardEditMode = true;
    this.goTo('editar');
  }

  abrirAnularModal(ncId: string): void {
    this.anularModal = { open: true, ncId, motivo: '', otro: '', error: '' };
  }

  confirmarAnulacion(): void {
    const m = this.anularModal;
    if (!m.motivo) {
      m.error = 'Seleccione el motivo de anulación.';
      return;
    }
    if (m.motivo === 'Otros' && !(m.otro || '').trim()) {
      m.error = 'Especifique el motivo de anulación.';
      return;
    }
    const motivoFinal = m.motivo === 'Otros' ? (m.otro || 'Otros').trim() : m.motivo;
    const nc = this.ncs.find(x => x.id === m.ncId);
    if (!nc) {
      this.anularModal.open = false;
      return;
    }

    const numInfClean = (nc.numero || nc.id || '').replace(/^NC\s*-\s*/i, '').trim();

    // Resumen de artículos para la notificación WhatsApp
    let detalleArticulos = '';
    if (nc.articulos && nc.articulos.length > 0) {
      detalleArticulos = nc.articulos.map(a => {
        const def = a.defectos?.[0];
        const nomMotivo = def?.motivo || 'No especificado';
        const nomArea = def?.area || 'PRODUCCIÓN';
        const talla = a.talla || '-';
        const rech = a.cantidad || 0;
        const tot = a.rollos || 0;
        return `• ${a.nombre} (Talla ${talla}, ${rech} de ${tot} rollos) — Motivo: ${nomMotivo} — Área: ${nomArea}`;
      }).join('\n');
    } else {
      detalleArticulos = `• Partida ${nc.partida}`;
    }

    let totalKgAfectado = 0;
    if (nc.articulos && nc.articulos.length > 0) {
      totalKgAfectado = parseFloat(this.calcularPesoTotalAfectado(nc.articulos));
    }
    const pesoVal = totalKgAfectado > 0
      ? totalKgAfectado.toFixed(2)
      : ((nc.peso || '').replace(/[^0-9.]/g, '') || '0');

    if (totalKgAfectado > 0) {
      nc.peso = `${totalKgAfectado.toFixed(2)} kg`;
    }

    const payload = {
      num_Informe: numInfClean,
      cod_OrdTra: nc.partida,
      cod_Usuario: this.sUsuario || GlobalVariable.vusu || 'SISTEMAS',
      nom_Usuario: this.sUsuario || GlobalVariable.vusu || 'SISTEMAS',
      nom_Cli: nc.cliente || '',
      color: nc.color || '',
      peso: pesoVal,
      detalle_Articulo: detalleArticulos,
      motivo_Anula: motivoFinal
    };

    m.open = false;

    Swal.fire({
      title: 'Anulando No Conformidad...',
      text: 'Por favor espere mientras se procesa la anulación en el sistema.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.ncService.anularInforme(payload).subscribe({
      next: (resp: any) => {
        Swal.close();
        if (resp && resp.success) {
          nc.estado = 'Anulada';
          nc.status = 'Anulado';
          nc.anulacion = {
            motivo: motivoFinal,
            usuario: this.sUsuario,
            fecha: this.nowStr()
          };
          nc.historial.push({
            fecha: this.nowStr(),
            usuario: this.sUsuario,
            accion: `Anulación de NC: ${motivoFinal}`
          });

          this.dataSourceNc.data = [...this.ncs];

          Swal.fire({
            icon: 'success',
            title: 'NC Anulada',
            text: `La ${nc.id} ha sido anulada exitosamente.`,
            timer: 2000,
            showConfirmButton: false
          });

          this.cargarInformesCabecera();
          this.goTo('inicio');
        } else {
          Swal.fire('Error', resp?.message || 'No se pudo anular la No Conformidad.', 'error');
        }
      },
      error: (err: any) => {
        Swal.close();
        console.error('Error al anular informe:', err);
        const msj = err?.error?.message || (typeof err?.error === 'string' ? err.error : 'Error al anular la No Conformidad.');
        Swal.fire('Error al anular', msj, 'error');
      }
    });
  }

  // Visor de fotos
  getFotoUrl(photo: { name: string; dataUrl: string }): string {
    if (!photo) return '';
    if (photo.dataUrl && photo.dataUrl.trim().startsWith('data:image')) {
      return photo.dataUrl;
    }
    if (photo.name) {
      return this.ncService.getUrlImagen(photo.name);
    }
    return photo.dataUrl || '';
  }

  viewPhotos(photos: { name: string; dataUrl: string }[], index: number): void {
    if (!photos || photos.length === 0) return;
    const resolved = photos.map(p => ({
      name: p.name,
      dataUrl: this.getFotoUrl(p)
    }));
    this.photoViewModal = { open: true, photos: resolved, index };
  }

  photoPrev(): void {
    const pv = this.photoViewModal;
    pv.index = (pv.index - 1 + pv.photos.length) % pv.photos.length;
  }

  photoNext(): void {
    const pv = this.photoViewModal;
    pv.index = (pv.index + 1) % pv.photos.length;
  }

  // Gestión de Calidad: Defectos Pendientes
  abrirRevisarDefecto(index: number): void {
    const item = this.defectosPendientesCatalogo[index];
    const nc = item ? this.ncs.find(x => x.id === item.ncId) : null;
    let defArea = '';
    if (nc) {
      nc.articulos.forEach(a => a.defectos.forEach(d => {
        if (d.isOtro && d.descripcionOtro === item.descripcion) {
          defArea = this.defectoAreaFinal(d);
        }
      }));
    }

    this.grabarMotivo = {
      pendIndex: index,
      motivo: '',
      isOtro: false,
      descripcionOtro: item ? item.descripcion : '',
      area: defArea || 'TINTORERÍA',
      areaOtro: '',
      errors: {}
    };
    this.filtroGrabarMotivo = '';
    this.filtrarMotivosGrabar('');
    this.goTo('grabarMotivo');
  }

  guardarGrabarMotivo(): void {
    const gm = this.grabarMotivo;
    gm.errors = {};
    if (!gm.motivo) {
      gm.errors['motivo'] = 'Seleccione o ingrese un motivo de rechazo.';
    }
    if (!gm.area) {
      gm.errors['area'] = 'Seleccione el área responsable.';
    }
    if (Object.keys(gm.errors).length > 0) return;

    const item = this.defectosPendientesCatalogo[gm.pendIndex];
    if (item) {
      const nc = this.ncs.find(x => x.id === item.ncId);
      if (nc) {
        nc.articulos.forEach(a => a.defectos.forEach(d => {
          if (d.isOtro && d.descripcionOtro === item.descripcion) {
            d.isOtro = false;
            d.motivo = gm.motivo;
            d.area = gm.area;
          }
        }));
        nc.historial.push({
          fecha: this.nowStr(),
          usuario: this.sUsuario,
          accion: `Calidad asignó motivo "${gm.motivo}" y área "${gm.area}".`
        });
      }
      this.defectosPendientesCatalogo.splice(gm.pendIndex, 1);
      Swal.fire({
        icon: 'success',
        title: 'Motivo Guardado',
        text: 'Se actualizó la No Conformidad con el catálogo seleccionado.',
        timer: 2000,
        showConfirmButton: false
      });
    }
    this.goTo('defectosPendientes');
  }

  guardarCodigoDefectoNuevo(): void {
    this.guardarGrabarMotivo();
  }

  // Evolutivo & Reportes
  setEvoPeriod(p: 'Año' | 'Mes' | 'Semanas' | 'Días'): void {
    this.evoPeriod = p;
    if (p === 'Semanas') {
      this.scrollToCurrentWeek();
    }
  }

  onEvoYearChange(): void {
    const currentYear = new Date().getFullYear();
    if (this.evoSelectedYear === currentYear) {
      this.evoSelectedWeek = this.getISOWeek(new Date());
    } else {
      this.evoSelectedWeek = 1;
    }
    if (this.evoPeriod === 'Semanas') {
      this.scrollToCurrentWeek();
    }
  }

  getISOWeeksInYear(year: number): number {
    const d = new Date(year, 11, 31);
    let w = this.getISOWeek(d);
    if (w === 1) {
      w = this.getISOWeek(new Date(year, 11, 24));
    }
    return w;
  }

  getMondayOfWeek(year: number, week: number): Date {
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = (jan4.getDay() + 6) % 7;
    const mondayWeek1 = new Date(year, 0, 4 - dayOfWeek);
    return new Date(mondayWeek1.getTime() + (week - 1) * 7 * 24 * 3600 * 1000);
  }

  prevEvoWeek(): void {
    if (this.evoSelectedWeek > 1) {
      this.evoSelectedWeek--;
    }
  }

  nextEvoWeek(): void {
    const maxW = this.getISOWeeksInYear(this.evoSelectedYear);
    if (this.evoSelectedWeek < maxW) {
      this.evoSelectedWeek++;
    }
  }

  getEvoWeekDateRangeLabel(): string {
    const mon = this.getMondayOfWeek(this.evoSelectedYear, this.evoSelectedWeek);
    const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(mon.getDate())}/${p(mon.getMonth() + 1)} - ${p(sun.getDate())}/${p(sun.getMonth() + 1)}/${sun.getFullYear()}`;
  }

  scrollToCurrentWeek(): void {
    const currentYear = new Date().getFullYear();
    const currentWeekNum = this.getISOWeek(new Date());
    setTimeout(() => {
      const targetWeek = this.evoSelectedYear === currentYear ? currentWeekNum : 1;
      const el = document.getElementById(`week-col-Sem${targetWeek}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 150);
  }

  onWeekBarClick(label: string): void {
    const match = /Sem\s*(\d+)/i.exec(label);
    if (match) {
      this.evoSelectedWeek = parseInt(match[1], 10);
      this.evoDiasModo = 'semana';
      this.setEvoPeriod('Días');
    }
  }

  isCurrentWeek(label: string): boolean {
    const currentYear = new Date().getFullYear();
    if (this.evoSelectedYear !== currentYear) return false;
    const currentWeekNum = this.getISOWeek(new Date());
    return label === `Sem ${currentWeekNum}`;
  }

  isCurrentDay(dayLabel: string): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    if (this.evoSelectedYear !== currentYear) return false;
    const DIAS_ABR = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const todayLabel = `${DIAS_ABR[now.getDay()]} ${now.getDate()}`;
    return dayLabel.startsWith(todayLabel) || dayLabel === todayLabel;
  }

  parseFechaHora(s: string): Date | null {
    if (!s) return null;
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?/.exec(s.trim());
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0));
  }

  startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  daysAgo(n: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return this.startOfDay(d);
  }

  getISOWeek(d: Date): number {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = date.getTime();
    date.setUTCMonth(0, 1);
    if (date.getUTCDay() !== 4) date.setUTCMonth(0, 1 + ((4 - date.getUTCDay()) + 7) % 7);
    return 1 + Math.round((firstThursday - date.getTime()) / (7 * 24 * 3600 * 1000));
  }

  getAllEvolutivoRecords(): { nc: string; date: Date; area: string; motivo: string }[] {
    const list: { nc: string; date: Date; area: string; motivo: string }[] = [];
    const seen = new Set<string>();

    // 1. Datos históricos desde la base de datos (UP_CC_Muestra_Informe_Calidad_Evolutivo)
    if (this.evolutivoRawData && this.evolutivoRawData.length > 0) {
      this.evolutivoRawData.forEach(r => {
        if (r.CC_Fec_Crea) {
          const d = new Date(r.CC_Fec_Crea);
          if (!isNaN(d.getTime())) {
            const nc = (r.CC_Numero_Informe || '').trim();
            const area = (r.Area || r.Cod_Area_CC || '').trim();
            const motivo = (r.Motivo || r.Cod_Motivo || '').trim();
            list.push({ nc, date: d, area, motivo });
            if (nc) seen.add(nc);
          }
        }
      });
    }

    // 2. Incluir NCs de la sesión local si no estaban aún en la base de datos
    (this.ncs || []).forEach(nc => {
      const ncNum = (nc.numero || nc.id || '').replace(/^NC\s*-\s*/i, '').trim();
      if (ncNum && !seen.has(ncNum)) {
        const d = this.parseFechaHora(nc.fecha);
        if (d && !isNaN(d.getTime())) {
          let countAdded = 0;
          (nc.articulos || []).forEach(a => {
            (a.defectos || []).forEach(def => {
              const area = this.defectoAreaFinal(def);
              const motivo = this.defectoLabel(def);
              list.push({ nc: ncNum, date: d, area, motivo });
              countAdded++;
            });
          });
          if (countAdded === 0) {
            const area = (nc.area || nc.areas || '').trim();
            list.push({ nc: ncNum, date: d, area, motivo: '' });
          }
          seen.add(ncNum);
        }
      }
    });

    return list;
  }

  countUniqueInformes(items: { nc: string; date: Date; area: string; motivo: string }[]): number {
    const set = new Set<string>();
    let countWithoutNc = 0;
    for (const r of items) {
      if (r.nc) {
        set.add(r.nc);
      } else {
        countWithoutNc++;
      }
    }
    return set.size + countWithoutNc;
  }

  getEvoData(): [string, number][] {
    const records = this.getAllEvolutivoRecords();
    const now = new Date();

    if (this.evoPeriod === 'Año') {
      // 2 años antes del 2024 al 2026 (2024, 2025, 2026) - Se cuentan Informes únicos
      const targetYears = [2024, 2025, 2026];
      return targetYears.map(y => {
        const items = records.filter(r => r.date.getFullYear() === y);
        return [String(y), this.countUniqueInformes(items)];
      });
    }

    if (this.evoPeriod === 'Mes') {
      // Completar de Enero a Diciembre para el año seleccionado (por Informe único)
      const MESES_ABR = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const year = this.evoSelectedYear;
      const buckets: [string, number][] = [];
      for (let m = 0; m < 12; m++) {
        const items = records.filter(r => r.date.getFullYear() === year && r.date.getMonth() === m);
        buckets.push([MESES_ABR[m], this.countUniqueInformes(items)]);
      }
      return buckets;
    }

    if (this.evoPeriod === 'Semanas') {
      // Todas las semanas del año seleccionado (por Informe único)
      const year = this.evoSelectedYear;
      const maxWeeks = this.getISOWeeksInYear(year);

      const weekSets: { [week: number]: Set<string> } = {};
      const weekNoNcCounts: { [week: number]: number } = {};
      records.forEach(r => {
        if (r.date.getFullYear() === year) {
          const w = this.getISOWeek(r.date);
          if (r.nc) {
            if (!weekSets[w]) weekSets[w] = new Set<string>();
            weekSets[w].add(r.nc);
          } else {
            weekNoNcCounts[w] = (weekNoNcCounts[w] || 0) + 1;
          }
        }
      });

      const buckets: [string, number][] = [];
      for (let w = 1; w <= maxWeeks; w++) {
        const count = (weekSets[w] ? weekSets[w].size : 0) + (weekNoNcCounts[w] || 0);
        buckets.push([`Sem ${w}`, count]);
      }
      return buckets;
    }

    if (this.evoPeriod === 'Días') {
      if (this.evoDiasModo === 'semana') {
        // Días de Lunes a Domingo de la semana seleccionada (por Informe único)
        const DIAS_ABR = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const mon = this.getMondayOfWeek(this.evoSelectedYear, this.evoSelectedWeek);
        const buckets: [string, number][] = [];

        for (let i = 0; i < 7; i++) {
          const d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
          const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
          const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).getTime();
          const items = records.filter(r => {
            const t = r.date.getTime();
            return t >= start && t <= end;
          });
          const label = `${DIAS_ABR[i]} ${d.getDate()}`;
          buckets.push([label, this.countUniqueInformes(items)]);
        }
        return buckets;
      } else {
        // Modo: Últimos 7 días (por Informe único)
        const DIAS_ABR = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const baseDate = this.evoSelectedYear === now.getFullYear() ? now : new Date(this.evoSelectedYear, 11, 31);
        const buckets: [string, number][] = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - i);
          const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
          const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).getTime();
          const items = records.filter(r => {
            const t = r.date.getTime();
            return t >= start && t <= end;
          });
          const label = `${DIAS_ABR[d.getDay()]} ${d.getDate()}`;
          buckets.push([label, this.countUniqueInformes(items)]);
        }
        return buckets;
      }
    }

    return [];
  }

  getEvoMax(): number {
    const data = this.getEvoData();
    const maxVal = Math.max(1, ...data.map(d => d[1]));
    return maxVal * 1.15;
  }

  getEvoAreaData(): [string, number][] {
    const records = this.getAllEvolutivoRecords();
    const year = this.evoSelectedYear;

    if (records.length === 0) {
      // Fallback local
      const counts: { [key: string]: number } = {};
      this.ncs.forEach(nc => {
        (nc.articulos || []).forEach(a => (a.defectos || []).forEach(d => {
          const ar = this.defectoAreaFinal(d);
          if (ar) counts[ar] = (counts[ar] || 0) + 1;
        }));
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    }

    const counts: { [key: string]: number } = {};
    const filteredRecords = this.evoPeriod === 'Año' ? records : records.filter(r => r.date.getFullYear() === year);

    filteredRecords.forEach(r => {
      const ar = (r.area || '').replace(/^\/+|\/+$/g, '').trim();
      if (ar && ar !== '-' && ar !== '/') {
        counts[ar] = (counts[ar] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }

  getEvoAreaMax(): number {
    const data = this.getEvoAreaData();
    const maxVal = Math.max(1, ...data.map(d => d[1]));
    return maxVal * 1.15;
  }

  getTotalKgAfectados(): string {
    let sum = 0;
    this.ncs.forEach(nc => {
      nc.articulos.forEach(a => {
        sum += parseFloat(this.calcularKgAfectados(a));
      });
    });
    return sum.toFixed(2);
  }

  getTotalRollosAfectados(): number {
    let sum = 0;
    this.ncs.forEach(nc => {
      nc.articulos.forEach(a => {
        sum += Number(a.cantidad) || 0;
      });
    });
    return sum;
  }

  async loadLogoImageBase64(): Promise<string | null> {
    try {
      const response = await fetch('assets/logo.jpg');
      if (!response.ok) return null;
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  }

  // ============================================================================
  // REPORTE GENERAL NO CONFORME (EXCEL)
  // ============================================================================
  formatDateForApi(d: any): string {
    if (!d) return '';
    if (d instanceof Date && !isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    if (typeof d === 'string') {
      const trimmed = d.trim();
      if (!trimmed) return '';
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return trimmed;
    }
    return '';
  }

  formatDateForDisplay(d: any, defaultVal: string = ''): string {
    if (!d) return defaultVal;
    if (d instanceof Date && !isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const y = d.getFullYear();
      return `${day}/${m}/${y}`;
    }
    if (typeof d === 'string') {
      const trimmed = d.trim();
      if (!trimmed) return defaultVal;
      const ym = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(trimmed);
      if (ym) {
        return `${ym[3].padStart(2, '0')}/${ym[2].padStart(2, '0')}/${ym[1]}`;
      }
      return trimmed;
    }
    return defaultVal;
  }

  async descargarReporteGeneral(): Promise<void> {
    Swal.fire({
      title: 'Generando reporte...',
      text: 'Consultando datos de No Conformidades en el sistema...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const fIni = this.formatDateForApi(this.inicioFilters.ini);
    const fFin = this.formatDateForApi(this.inicioFilters.fin);

    try {
      let dbRows: any[] = [];
      try {
        const res = await firstValueFrom(this.ncService.getReporteNoConformidad(fIni, fFin));
        if (res && Array.isArray(res)) {
          dbRows = res;
        }
      } catch (apiErr) {
        console.warn('No se pudo obtener el reporte desde la base de datos, usando registros locales:', apiErr);
      }

      // Filtrar filas de detalle afectadas de la base de datos (ORDEN 1)
      let filteredDbRows = dbRows.filter(r =>
        r.ORDEN === 1 && (
          (Number(r.Rollos_Rechazados) > 0) ||
          (r.Motivo_Rechazo && r.Motivo_Rechazo !== '/' && String(r.Motivo_Rechazo).replace(/\//g, '').trim() !== '')
        )
      );

      // Si el usuario aplicó filtro por NC o Partida
      if (this.inicioFilters.nc && this.inicioFilters.nc.trim() !== '') {
        const q = this.inicioFilters.nc.trim().toLowerCase();
        filteredDbRows = filteredDbRows.filter(r =>
          (r.Numero && String(r.Numero).toLowerCase().includes(q)) ||
          (r.Partida && String(r.Partida).toLowerCase().includes(q))
        );
      }

      // Si el usuario aplicó filtro por Responsable / Área
      if (this.inicioFilters.resp && this.inicioFilters.resp.trim() !== '') {
        const rq = this.inicioFilters.resp.trim().toLowerCase();
        filteredDbRows = filteredDbRows.filter(r =>
          (r.Area_Responsable && String(r.Area_Responsable).toLowerCase().includes(rq))
        );
      }

      const listToExport = (this.inicioResults && this.inicioResults.length > 0) ? this.inicioResults : this.ncs;

      if (filteredDbRows.length === 0 && (!listToExport || listToExport.length === 0)) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'No hay registros de No Conformidades para exportar.'
        });
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const logoBase64 = await this.loadLogoImageBase64();
      let logoId: number | null = null;
      if (logoBase64) {
        logoId = workbook.addImage({ base64: logoBase64, extension: 'jpeg' });
      }

      this.buildStyledNoConformeGeneralSheet(workbook, logoId, filteredDbRows, listToExport);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const timestamp = new Date().getTime();
      saveAs(blob, `Reporte_No_Conforme_${timestamp}.xlsx`);

      const totalExportados = filteredDbRows.length > 0 ? filteredDbRows.length : listToExport.length;
      Swal.fire({
        icon: 'success',
        title: 'Reporte generado',
        text: `Se descargó el reporte con ${totalExportados} registros de No Conformidades exitosamente.`,
        timer: 2500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error generando reporte Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al generar el archivo Excel.'
      });
    }
  }

  buildStyledNoConformeGeneralSheet(
    workbook: ExcelJS.Workbook,
    logoId: number | null,
    dbRows: any[],
    fallbackList: NoConformidad[] = []
  ): void {
    const sheet = workbook.addWorksheet('NO CONFORME', {
      views: [{ showGridLines: true }]
    });

    const today = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    const fechaActual = `${p(today.getDate())}/${p(today.getMonth() + 1)}/${today.getFullYear()}`;
    const fechaInicial = this.formatDateForDisplay(this.inicioFilters.ini, `01/${p(today.getMonth() + 1)}/${today.getFullYear()}`);
    const fechaFinal = this.formatDateForDisplay(this.inicioFilters.fin, fechaActual);

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };

    // Fila 1: Logo Precotex opcional
    sheet.getRow(1).height = 42;
    if (logoId !== null) {
      sheet.addImage(logoId, { tl: { col: 0, row: 0 }, ext: { width: 190, height: 42 } });
    }
    sheet.addRow([]);

    // Fila 2: Título centrado "NO CONFORME" (Columnas A hasta AC = 29 columnas)
    sheet.mergeCells('A2:AC2');
    const titleCell = sheet.getCell('A2');
    titleCell.value = 'NO CONFORME';
    titleCell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }
    };
    titleCell.border = thinBorder;
    sheet.getRow(2).height = 24;

    // Filas 3, 4, 5: Fechas a la izquierda
    const dateRows = [
      ['FECHA ACTUAL', fechaActual],
      ['FECHA INICIAL', fechaInicial],
      ['FECHA FINAL', fechaFinal]
    ];

    dateRows.forEach((rData, i) => {
      const rNum = 3 + i;
      const cLabel = sheet.getCell(`A${rNum}`);
      const cVal = sheet.getCell(`B${rNum}`);

      cLabel.value = rData[0];
      cLabel.font = { name: 'Calibri', size: 9.5, bold: true };
      cLabel.border = thinBorder;
      cLabel.alignment = { vertical: 'middle', horizontal: 'left' };

      cVal.value = rData[1];
      cVal.font = { name: 'Calibri', size: 9.5 };
      cVal.border = thinBorder;
      cVal.alignment = { vertical: 'middle', horizontal: 'center' };

      sheet.getRow(rNum).height = 18;
    });

    // Fila 6: Vacía
    sheet.addRow([]);

    // Fila 7: Cabeceras exactas (29 columnas)
    const headers = [
      'Area Responsable',
      'Orden',
      'Numero',
      'Fecha de Tejido',
      'Fecha Informe',
      'Fecha Entrega Tela Fin',
      'Dias en Planta',
      'Tipo Partida',
      'Partida',
      'Cliente',
      'Cod Color',
      'Color',
      'Cod Tel',
      'Articulo',
      'Rollos Asig',
      'KG',
      'Rollos Rechaz',
      'KG Afectad',
      'Motivo de Rechaz',
      'Situacion',
      'Area Responsable',
      'Asunto Técnico',
      'Proceso',
      'Acción',
      'Talla',
      'Status Partida',
      'Grupo Textil',
      'Lote Hilado',
      'OC'
    ];

    const headerRow = sheet.getRow(7);
    headerRow.height = 32;

    headers.forEach((h, colIdx) => {
      const cell = headerRow.getCell(colIdx + 1);
      cell.value = h;
      cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF000000' } };

      // Columnas destacadas en azul/gris (#BDD7EE) vs celeste claro (#C4EEFC)
      const isDarkerHeader = [26, 27, 28].includes(colIdx);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isDarkerHeader ? 'FFBDD7EE' : 'FFC4EEFC' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = thinBorder;
    });

    // Auto-filtro en la cabecera
    sheet.autoFilter = 'A7:AC7';

    // Ancho de columnas
    const colWidths = [
      18, // Area Responsable
      10, // Orden
      14, // Numero
      15, // Fecha de Tejido
      14, // Fecha Informe
      20, // Fecha Entrega Tela Fin
      14, // Dias en Planta
      14, // Tipo Partida
      12, // Partida
      24, // Cliente
      12, // Cod Color
      18, // Color
      14, // Cod Tel
      24, // Articulo
      12, // Rollos Asig
      12, // KG
      14, // Rollos Rechaz
      14, // KG Afectad
      28, // Motivo de Rechaz
      18, // Situacion
      18, // Area Responsable
      16, // Asunto Técnico
      14, // Proceso
      12, // Acción
      10, // Talla
      16, // Status Partida
      14, // Grupo Textil
      14, // Lote Hilado
      12  // OC
    ];
    colWidths.forEach((w, idx) => {
      sheet.getColumn(idx + 1).width = w;
    });

    // Filas de datos
    let currentRow = 8;
    let ordenCount = 1;

    const cleanArea = (val: any) => {
      if (!val) return '';
      return String(val).replace(/^\/+|\/+$/g, '').replace(/\/+/g, ' / ').trim();
    };

    const cleanMotivo = (val: any) => {
      if (!val) return '';
      return String(val).replace(/^\/+|\/+$/g, '').replace(/\/+/g, ' / ').trim();
    };

    const formatCellDate = (val: any): string => {
      if (!val) return '';
      if (val instanceof Date && !isNaN(val.getTime())) {
        const dd = String(val.getDate()).padStart(2, '0');
        const mm = String(val.getMonth() + 1).padStart(2, '0');
        const yy = val.getFullYear();
        return `${dd}/${mm}/${yy}`;
      }
      const s = String(val).trim();
      if (!s) return '';
      if (s.includes(' ')) {
        const dPart = s.split(' ')[0];
        if (dPart.includes('/')) return dPart;
        if (dPart.includes('-')) {
          const parts = dPart.split('-');
          if (parts.length === 3 && parts[0].length === 4) {
            return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
          }
        }
      }
      if (s.includes('T')) {
        const dPart = s.split('T')[0];
        const parts = dPart.split('-');
        if (parts.length === 3) {
          return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
        }
      }
      return s;
    };

    // Caso A: Datos directos de la base de datos (UP_CC_Reporte_Informe_No_Conformidad)
    if (dbRows && dbRows.length > 0) {
      dbRows.forEach(row => {
        const r = sheet.getRow(currentRow);
        r.height = 20;

        const rollosAsig = Number(row.Rollos) || 0;
        const kilosTotal = Number(row.Kilos) || 0;
        const rollosRech = Number(row.Rollos_Rechazados) || 0;
        let kilosAfec = Number(row.Kilos_Afectados) || 0;
        if (kilosAfec <= 0 && rollosAsig > 0 && rollosRech > 0) {
          kilosAfec = +((kilosTotal / rollosAsig) * rollosRech).toFixed(2);
        }

        const areaResp = cleanArea(row.Area_Responsable);
        const motivoRech = cleanMotivo(row.Motivo_Rechazo);

        const rowValues = [
          areaResp,                                                               // 0: Area Responsable
          ordenCount,                                                             // 1: Orden
          row.Numero ? String(row.Numero).trim() : '',                            // 2: Numero
          formatCellDate(row.Fecha_Proceso_Tenido),                               // 3: Fecha de Tejido
          formatCellDate(row.Fecha_Informe),                                      // 4: Fecha Informe
          formatCellDate(row.FECHA_FIN),                                          // 5: Fecha Entrega Tela Fin
          row.Dias_En_Planta != null ? row.Dias_En_Planta : '',                   // 6: Dias en Planta
          row.TIPO_PARTIDA && String(row.TIPO_PARTIDA).trim() ? String(row.TIPO_PARTIDA).trim() : 'TINTORERÍA', // 7: Tipo Partida
          row.Partida ? String(row.Partida).trim() : '',                          // 8: Partida
          row.Cliente ? String(row.Cliente).trim() : '',                          // 9: Cliente
          row.Cod_Color ? String(row.Cod_Color).trim() : '',                      // 10: Cod Color
          row.Color ? String(row.Color).trim() : '',                              // 11: Color
          row.Cod_Tela ? String(row.Cod_Tela).trim() : '',                        // 12: Cod Tel
          row.Articulo ? String(row.Articulo).trim() : '',                        // 13: Articulo
          rollosAsig,                                                             // 14: Rollos Asig
          kilosTotal,                                                             // 15: KG
          rollosRech,                                                             // 16: Rollos Rechaz
          kilosAfec,                                                              // 17: KG Afectad
          motivoRech,                                                             // 18: Motivo de Rechaz
          row.Situacion ? String(row.Situacion).trim() : 'Registrada',            // 19: Situacion
          areaResp,                                                               // 20: Area Responsable
          row.Acciones_Correctivas ? String(row.Acciones_Correctivas).trim() : '', // 21: Asunto Técnico
          row.Proceso && String(row.Proceso).trim() ? String(row.Proceso).trim() : 'PRODUCCIÓN', // 22: Proceso
          row.Accion ? String(row.Accion).trim() : '',                            // 23: Acción
          row.Cod_Talla && String(row.Cod_Talla).trim() ? String(row.Cod_Talla).trim() : '-', // 24: Talla
          row.Status_Partida && String(row.Status_Partida).trim() ? String(row.Status_Partida).trim() : 'Rechazado', // 25: Status Partida
          row.Cod_GrupTextil && String(row.Cod_GrupTextil).trim() ? String(row.Cod_GrupTextil).trim() : '', // 26: Grupo Textil
          row.Lote_Hilado ? String(row.Lote_Hilado).trim() : '',                  // 27: Lote Hilado
          row.OC ? String(row.OC).trim() : ''                                     // 28: OC
        ];

        rowValues.forEach((val, colIdx) => {
          const cell = r.getCell(colIdx + 1);
          cell.value = val;
          cell.font = { name: 'Calibri', size: 9 };
          cell.border = thinBorder;

          // Formatos numéricos
          if ([14, 16].includes(colIdx)) {
            cell.numFmt = '#,##0';
          } else if ([15, 17].includes(colIdx)) {
            cell.numFmt = '#,##0.00';
          }

          // Alineaciones según el tipo de dato
          if ([1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 22, 23, 24, 25, 26, 27, 28].includes(colIdx)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else if ([14, 15, 16, 17].includes(colIdx)) {
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          } else {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          }
        });

        currentRow++;
        ordenCount++;
      });
    } else {
      // Caso B: Fallback con lista local si la base de datos no retornó filas
      fallbackList.forEach(nc => {
        (nc.articulos || []).forEach(a => {
          (a.defectos || []).forEach(d => {
            const r = sheet.getRow(currentRow);
            r.height = 20;

            const rowValues = [
              this.defectoAreaFinal(d),                                     // Area Responsable
              ordenCount,                                                   // Orden
              nc.id,                                                        // Numero
              nc.fechaPartida || (nc.fecha ? nc.fecha.split(' ')[0] : ''),  // Fecha de Tejido
              nc.fecha ? nc.fecha.split(' ')[0] : '',                       // Fecha Informe
              '',                                                           // Fecha Entrega Tela Fin
              '',                                                           // Dias en Planta
              'TINTORERÍA',                                                 // Tipo Partida
              nc.partida,                                                   // Partida
              nc.cliente,                                                   // Cliente
              '',                                                           // Cod Color
              nc.color,                                                     // Color
              a.codTela,                                                    // Cod Tel
              a.nombre,                                                     // Articulo
              a.rollos,                                                     // Rollos Asig
              parseFloat(a.kgCrudo) || a.kgCrudo,                           // KG
              a.cantidad,                                                   // Rollos Rechaz
              parseFloat(this.calcularKgAfectados(a)) || this.calcularKgAfectados(a), // KG Afectad
              this.defectoLabel(d),                                         // Motivo de Rechaz
              nc.estado || 'Registrada',                                    // Situacion
              this.defectoAreaFinal(d),                                     // Area Responsable
              '',                                                           // Asunto Técnico
              nc.proceso || 'PRODUCCIÓN',                                   // Proceso
              '',                                                           // Acción
              a.talla || '-',                                               // Talla
              nc.status || 'Rechazado',                                     // Status Partida
              a.tipo || 'Cuerpo',                                           // Grupo Textil
              '',                                                           // Lote Hilado
              ''                                                            // OC
            ];

            rowValues.forEach((val, colIdx) => {
              const cell = r.getCell(colIdx + 1);
              cell.value = val;
              cell.font = { name: 'Calibri', size: 9 };
              cell.border = thinBorder;

              if ([14, 16].includes(colIdx)) {
                cell.numFmt = '#,##0';
              } else if ([15, 17].includes(colIdx)) {
                cell.numFmt = '#,##0.00';
              }

              if ([1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 22, 23, 24, 25, 26, 27, 28].includes(colIdx)) {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              } else if ([14, 15, 16, 17].includes(colIdx)) {
                cell.alignment = { vertical: 'middle', horizontal: 'right' };
              } else {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              }
            });

            currentRow++;
            ordenCount++;
          });
        });
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../../VarGlobals';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

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
  estado: string;
  status: string;
  proceso: string;
  fecha: string;
  registradoPor: string;
  partida: string;
  cliente: string;
  color: string;
  peso: string;
  fechaPartida: string;
  articulos: ArticuloSeleccionado[];
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
export class NoConformidadesComponent implements OnInit {

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
    "HI001 - ANILLADO POR HILO GRUESO/DELGADO", "HI002 - ANILLOSPOR LOTES DE HILO (UV)", "HI003 - BARRADO POR HILO TEÑIDO",
    "HI004 - BAJA RESISTENCIA", "HI005 - CONTAMINACIÓN DE POLP.", "HI006 - CONTAMINACIÓN DE CASCARILLA",
    "HI007 - CONTAMINACIÓN DE FIBRAS MUERTAS", "HI008 - CONT. MALA MEZCLA DE MELANGE", "HI009 - HILO VETADO",
    "HI010 - IRREGULARIDAD DE HILO", "HI011 - MEZCLA DE LOTES Y/O BARRADO", "HI012 - NEPS NOTORIO",
    "HI013 - TRAMO GRUESO / DELGADO", "HI014 - TORSIÓN ELEVADA", "HI015 - VARIACIÓN DE TÍTULO",
    "HI016 - % DE FIBRA F/HILO", "HI017 - MOTAS DE HILADO", "HI018 - METAMERIA", "HI019 - BARRADO",
    "HI020 - CONT. AMBIENTE", "HI023 - MIGRACIÓN DE HILO", "HI024 - MALA SOLIDEZ",
    "TEJ021 - AGUJEROS MENORES A 1CM", "TEJ022 - ANILLOS POR MEZCLA DE TÍTULOS", "TEJ023 - ANILLOS POR TENSIÓN DE MÁQUINA",
    "TEJ024 - CORDONES DE HILO DOBLES", "TEJ025 - CONT. FIBRILLA HILO COLOR", "TEJ026 - CONTAMINACIÓN DE COLITAS",
    "TEJ027 - CONTAMINACIÓN DE AMBIENTE", "TEJ028 - CAÍDAS DE TEJIDO", "TEJ029 - DISEÑO DE RAPPORT EQUIVOCADO",
    "TEJ030 - ESCAPE DE LYCRA", "TEJ031 - FUGAS DE PUNTO", "TEJ032 - FALLA DE AGUJA ROTA",
    "TEJ033 - FLOTANTES SUELTOS", "TEJ034 - LYCRA ROTA", "TEJ035 - LÍNEAS DE ACEITE",
    "TEJ036 - LÍNEAS VERTICALES DE PLATINA", "TEJ037 - LONGITUD DE MALLA / STP", "TEJ038 - MANCHAS EN GOTAS DE ACEITE",
    "TEJ039 - MARCA DE DOBLES DE CHUCO", "TEJ040 - MANCHAS DE GRASA", "TEJ041 - PATA DE GALLO (AGUJA FORZADA)",
    "TEJ042 - RAPPORT F/STO", "TEJ043 - TRASPASO O ANILLOS DE HILO ROTO", "TEJ044 - MOTAS DE TEJIDO",
    "TEJ045 - CAPOTE DIRECTO", "TEJ046 - MARCA DE AGUJA", "TEJ047 - ARAÑONES", "TEJ048 - ANILLADO POR LYCRA ROTA",
    "TEJ049 - LYCRA NO YANIZADA (TALONES)", "TEJ050 - PARADA DE MÁQUINA", "TEJ051 - SEGUNDA DE TELA",
    "TEJ052 - MANCHAS DE MARCADOR DE TELA", "TEJ053 - CABO FALTANTE", "TEJ054 - BARRADO DE MÁQUINA",
    "TEJ055 - AGLOMERADO", "TEJ056 - QUEBRADURAS", "TEJ058 - DISEÑO DE TEJIDO INCORRECTO",
    "TEJ059 - DESPACHO DE TELA INCORRECTA", "TEJ060 - ERROR DE DESPACHO DE TELA CRUDA",
    "TIN051 - BAJA RESISTENCIA", "TIN052 - DEGRADE", "TIN053 - FUERA DE TONO", "TIN054 - FUERA DE MATCHING",
    "TIN055 - HUECOS POR PROCESO", "TIN056 - JALADURAS", "TIN057 - MANCHAS DE COLORANTE", "TIN058 - MANCHAS DE SUCIEDAD",
    "TIN059 - MALA SOLIDEZ AL LAVADO", "TIN060 - MALA SOLIDEZ AL AGUA", "TIN061 - MALA SOLIDEZ A LA TRANSPIRACIÓN",
    "TIN062 - MALA SOLIDEZ AL FROTE SECO", "TIN063 - MALA SOLIDEZ AL FROTE HÚMEDO", "TIN064 - MALA IGUALACIÓN",
    "TIN065 - MAL DESMONTADO", "TIN066 - MANCHAS BLANCAS", "TIN067 - MANCHAS DE ÓPTICO", "TIN068 - ÓXIDO METÁLICO",
    "TIN069 - PH FUERA DE STD", "TIN070 - PUNTOS DE SILICONA", "TIN071 - PILLING ELEVADO", "TIN072 - QUEBRADURAS",
    "TIN073 - RASPADURAS", "TIN074 - REMALLES", "TIN075 - TENIDO VETEADO", "TIN076 - LÍNEAS GIRATORIAS",
    "TIN077 - PICADURAS", "TIN078 - PUNTOS DE COLORANTE", "TIN079 - MANCHAS DE PRODUCTO", "TIN080 - LÍNEA VERTICAL",
    "TIN081 - MIGRACIÓN", "TIN082 - BORDES REVENTADOS", "TIN083 - RECT. DEFORMADOS", "TIN084 - INCREMENTO DE PEDIDO",
    "TIN085 - MAL ANÁLISIS TEXTIL", "TIN087 - COMBINACIÓN NO APROBADA POR CLIENTE", "TIN088 - RECETA INCORRECTA",
    "TIN089 - COOLOR INCORRECTO", "TIN090 - NO DESCARGA / DISCHARGE",
    "ACA081 - ANCHO F/SIO", "ACA082 - APARIENCIA F/SIO", "ACA083 - BAJA RESISTENCIA", "ACA084 - CALAMINADO",
    "ACA085 - DENSIDAD F/SIO", "ACA086 - ENCOGIMIENTO F/SIO", "ACA087 - EMPALMES", "ACA088 - HUECOS POR PROCESO",
    "ACA089 - JALADURAS", "ACA090 - TINEAS VERTICALES DE ESTIRADO", "ACA091 - LYCRA QUEMADA", "ACA092 - MAL OLOR",
    "ACA093 - MANCHAS DE SUAVIZANTE", "ACA094 - MAL ESTAMPADO", "ACA095 - MALA HIDROFILIDAD", "ACA096 - MAL CORTE DE ORILLOS",
    "ACA097 - MAL ENROLLADO", "ACA098 - MARCAS DE AGUJA DE RAMA", "ACA099 - MIGRACIÓN", "ACA100 - MAL PERCHADO",
    "ACA101 - MAL ASERTO", "ACA102 - MANCHAS DE GRASA", "ACA103 - MAL ESTAMPADO (SERVICIO)", "ACA104 - MORDEDURAS",
    "ACA105 - OXIDO", "ACA106 - PUNTOS DE SILICONA", "ACA107 - PARADA DE MÁQUINA", "ACA108 - MAL SECADO",
    "ACA109 - REVENTADO F/SIO", "ACA110 - RAPPORT F/SIO", "ACA111 - REMALLE", "ACA112 - TACTO ÁSPERO",
    "ACA113 - TRAMA DESCORRIDA", "ACA114 - TELA ONDEADA", "ACA115 - VARIACIÓN DE ANCHO", "ACA116 - MANCHAS DE CONDENSADO",
    "ACA117 - MANCHAS DE ÓPTICO", "ACA118 - MANCHAS DE SUDOR", "ACA119 - MANCHAS PLANAS",
    "ACA120 - LÍNEA SECCIONADA EN (DOBLECES)", "ACA121 - MARCA DE PLATINA", "ACA122 - ATRIBUCIÓN",
    "ACA123 - DESALINEACIÓN DE MÁQUINA", "ACA124 - MANCHAS DE HUMEDAD", "ACA125 - MANCHAS DE PRODUCTO QUÍMICO",
    "ACA126 - POROSIDAD DE TEJIDO", "ACA127 - MALA REGULACIÓN", "ACA128 - CONTAMINACIÓN DE CORROSIVOS",
    "ACA129 - RECHAZO", "ACA130 - MANCHAS DE PERÓXIDO", "ACA131 - MANCHAS DE PASO", "ACA132 - MANCHAS DE ACEITE",
    "ACA133 - PANTY ROTO", "ACA134 - DOBLADO / DOBLEZ DE TELA", "ACA135 - DOBLEZ DE TELA", "ACA136 - DEFECTO DE PLANCHADO",
    "ACA137 - MARCA DE ESTAMPADO", "ACA138 - MAL ACABADO", "ACA139 - MANCHA DE TINTA"
  ];

  AREAS: string[] = [
    "ACABADOS", "BORDADO", "CALIDAD MANUFACTURA", "CALIDAD TEXTIL", "COMERCIAL", "CORTE",
    "ESTAMPADO DIGITAL", "LAVANDERÍA", "PCP ACABADO", "PCP ESTAMPADO DIGITAL", "PCP MANUFACTURA",
    "PCP TEJEDURÍA", "PCP TINTORERÍA", "PLANEAMIENTO TEXTIL", "TEJEDURÍA", "TINTORERÍA"
  ];

  OTRA_AREA: string = "OTRA / ESPECIFICAR";
  DEFECTO_NUEVO: string = "DEFECTO NUEVO / NO REGISTRADO";
  MOTIVOS_ANULACION: string[] = ["Partida incorrecta", "NC duplicada", "Otros"];

  // Lista de NCs
  ncs: NoConformidad[] = [];
  nextNum: number = 5;

  // Filtros de Inicio
  inicioFilters = { nc: '', ini: '', fin: '', area: '', resp: '' };
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
  evoPeriod: 'Año' | 'Mes' | '4 semanas' | '7 días' = 'Año';
  evoPeriodos: ('Año' | 'Mes' | '4 semanas' | '7 días')[] = ['Año', 'Mes', '4 semanas', '7 días'];

  // Modales
  anularModal = { open: false, ncId: '', motivo: '', otro: '', error: '' };
  photoViewModal = { open: false, photos: [] as { name: string; dataUrl: string }[], index: 0 };
  reporteModal = {
    open: false,
    sel: { nc1: false, nc2: false, informeCalidad: false },
    error: ''
  };
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

  ngOnInit(): void {
    this.inicializarDatosEjemplo();
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
  }

  // Navegación
  goTo(screen: string): void {
    this.currentScreen = screen;
    this.errors = {};
    window.scrollTo(0, 0);
  }

  nowStr(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  parseDMY(s: string): Date | null {
    if (!s) return null;
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((s || '').trim());
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1]);
  }

  // Búsqueda en Inicio
  inicioBuscar(): void {
    const f = this.inicioFilters;
    const ncQuery = (f.nc || '').trim().toLowerCase();
    const areaQuery = f.area;
    const respQuery = (f.resp || '').trim().toLowerCase();
    const iniD = this.parseDMY(f.ini);
    const finD = this.parseDMY(f.fin);

    this.inicioResults = this.ncs.filter(x => {
      if (ncQuery && !x.id.toLowerCase().includes(ncQuery) && !x.partida.toLowerCase().includes(ncQuery)) return false;
      if (areaQuery && !this.ncHasArea(x, areaQuery)) return false;
      if (respQuery && !x.registradoPor.toLowerCase().includes(respQuery)) return false;
      const d = this.parseDMY(x.fecha.split(' ')[0]);
      if (iniD && d && d < iniD) return false;
      if (finD && d && d > finD) return false;
      return true;
    });
  }

  inicioLimpiarFiltros(): void {
    this.inicioFilters = { nc: '', ini: '', fin: '', area: '', resp: '' };
    this.inicioResults = null;
  }

  ncHasArea(nc: NoConformidad, area: string): boolean {
    return (nc.articulos || []).some(a => (a.defectos || []).some(d => this.defectoAreaFinal(d) === area));
  }

  ncAreasResumen(nc: NoConformidad): string {
    const areas: string[] = [];
    (nc.articulos || []).forEach(a => (a.defectos || []).forEach(d => {
      const ar = this.defectoAreaFinal(d);
      if (ar && !areas.includes(ar)) areas.push(ar);
    }));
    if (areas.length === 0) return '-';
    if (areas.length === 1) return areas[0];
    return `${areas[0]} (+${areas.length - 1} más)`;
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
    this.goTo('paso1');
  }

  // Wizard Paso 1
  onPartidaInput(val: string): void {
    val = (val || '').trim();
    if (!this.draft) return;
    this.draft.partida = val;
    this.errors = {};

    if (val && this.PARTIDAS_DB[val]) {
      const p = this.PARTIDAS_DB[val];
      this.draft.cliente = p.cliente;
      this.draft.color = p.color;
      this.draft.peso = p.peso;
      this.draft.fechaPartida = p.fecha;
      this.draft.articulosDisponibles = p.articulos;
      this.draft.seleccion = {};
      p.articulos.forEach((a, idx) => {
        this.draft!.seleccion[idx] = {
          checked: true,
          cantidad: a.rollos,
          open: true,
          defectos: [{
            motivo: '',
            isOtro: false,
            descripcionOtro: '',
            area: '',
            areaOtro: '',
            evidencia: [],
            open: true
          }]
        };
      });
    } else {
      this.draft.cliente = '';
      this.draft.color = '';
      this.draft.peso = '';
      this.draft.fechaPartida = '';
      this.draft.articulosDisponibles = [];
      this.draft.seleccion = {};
    }
  }

  toggleArticulo(idx: number): void {
    if (!this.draft) return;
    const cur = this.draft.seleccion[idx] || { checked: false, cantidad: '', open: true, defectos: [] };
    cur.checked = !cur.checked;
    cur.open = true;
    if (cur.checked && (!cur.defectos || cur.defectos.length === 0)) {
      cur.defectos = [{ motivo: '', isOtro: false, descripcionOtro: '', area: '', areaOtro: '', evidencia: [], open: true }];
    }
    this.draft.seleccion[idx] = cur;
  }

  toggleArticuloOpen(idx: number): void {
    if (!this.draft || !this.draft.seleccion[idx]) return;
    this.draft.seleccion[idx].open = !this.draft.seleccion[idx].open;
  }

  validatePaso1(): void {
    if (!this.draft) return;
    this.errors = {};
    if (!this.draft.partida) {
      this.errors['partida'] = 'Ingrese el número de partida.';
      return;
    }
    if (!this.PARTIDAS_DB[this.draft.partida]) {
      this.errors['partida'] = 'Partida no encontrada. Verifique el número (Ej: 07825, 05796, 03181).';
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
  toggleGrupoArticulo(idx: number): void {
    if (!this.draft) return;
    this.draft.grupoDefecto.seleccion[idx] = !this.draft.grupoDefecto.seleccion[idx];
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

    if (!ok) return;

    selectedIdxs.forEach(k => {
      const idx = Number(k);
      const sel = this.draft!.seleccion[idx];
      if (sel) {
        sel.defectos = [{
          motivo: g.isOtro ? '' : g.motivo,
          isOtro: g.isOtro,
          descripcionOtro: g.descripcionOtro,
          area: g.area,
          areaOtro: g.areaOtro,
          evidencia: [...g.evidencia],
          open: false
        }];
      }
    });

    Swal.fire({
      icon: 'success',
      title: 'Datos aplicados',
      text: 'Se asignaron los defectos y evidencias a los artículos seleccionados.',
      timer: 1500,
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
    const list: ArticuloSeleccionado[] = [];
    Object.keys(this.draft.seleccion).forEach(k => {
      const idx = Number(k);
      const sel = this.draft!.seleccion[idx];
      if (sel.checked) {
        const a = this.draft!.articulosDisponibles[idx];
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

  confirmarRegistroNC(): void {
    if (!this.draft) return;
    const articulos = this.getArticulosResumenDraft();

    if (this.editingId) {
      // Modificar existente
      const ncIndex = this.ncs.findIndex(x => x.id === this.editingId);
      if (ncIndex > -1) {
        this.ncs[ncIndex].partida = this.draft.partida;
        this.ncs[ncIndex].cliente = this.draft.cliente;
        this.ncs[ncIndex].color = this.draft.color;
        this.ncs[ncIndex].peso = this.draft.peso;
        this.ncs[ncIndex].articulos = articulos;
        this.ncs[ncIndex].comentario = this.draft.comentario;
        this.ncs[ncIndex].historial.push({
          fecha: this.nowStr(),
          usuario: this.sUsuario,
          accion: 'Modificación de NC'
        });
      }
      Swal.fire({
        icon: 'success',
        title: '¡No Conformidad Actualizada!',
        text: `La ${this.editingId} fue modificada exitosamente.`,
        timer: 2000,
        showConfirmButton: false
      });
      this.openDetalle(this.editingId);
    } else {
      // Crear nueva
      const newNC: NoConformidad = {
        id: this.draft.ncPreview,
        estado: 'Registrada',
        status: 'Rechazado',
        proceso: 'PRODUCCIÓN',
        fecha: this.draft.fechaRegistro,
        registradoPor: this.sUsuario,
        partida: this.draft.partida,
        cliente: this.draft.cliente,
        color: this.draft.color,
        peso: this.draft.peso,
        fechaPartida: this.draft.fechaPartida,
        articulos: articulos,
        comentario: this.draft.comentario,
        historial: [{ fecha: this.draft.fechaRegistro, usuario: this.sUsuario, accion: 'Creación de NC' }]
      };

      this.ncs.unshift(newNC);
      this.nextNum++;

      // Registrar pendientes si hay defecto nuevo
      articulos.forEach(a => a.defectos.forEach(d => {
        if (d.isOtro) {
          this.defectosPendientesCatalogo.unshift({
            descripcion: d.descripcionOtro,
            ncId: newNC.id,
            partida: newNC.partida,
            articulo: a.nombre,
            fecha: newNC.fecha,
            usuario: newNC.registradoPor
          });
        }
      }));

      Swal.fire({
        icon: 'success',
        title: '¡No Conformidad Registrada!',
        text: `Se generó exitosamente la ${newNC.id}.`,
        timer: 2000,
        showConfirmButton: false
      });

      this.openDetalle(newNC.id);
    }

    this.draft = null;
    this.editingId = null;
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

  // Detalle de NC
  openDetalle(id: string): void {
    const nc = this.ncs.find(x => x.id === id);
    if (!nc) return;
    this.detalleNC = nc;
    this.goTo('detalle');
  }

  editarNC(nc: NoConformidad): void {
    this.draft = {
      ncPreview: nc.id,
      fechaRegistro: nc.fecha,
      partida: nc.partida,
      cliente: nc.cliente,
      color: nc.color,
      peso: nc.peso,
      fechaPartida: nc.fechaPartida,
      articulosDisponibles: this.PARTIDAS_DB[nc.partida]?.articulos || [],
      seleccion: {},
      comentario: nc.comentario,
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

    // Prellenar selección
    if (this.draft.articulosDisponibles.length) {
      this.draft.articulosDisponibles.forEach((a, idx) => {
        const matching = nc.articulos.find(x => x.nombre === a.nombre);
        if (matching) {
          this.draft!.seleccion[idx] = {
            checked: true,
            cantidad: matching.cantidad,
            open: true,
            defectos: matching.defectos.map(d => ({ ...d, evidencia: [...d.evidencia] }))
          };
        } else {
          this.draft!.seleccion[idx] = {
            checked: false,
            cantidad: a.rollos,
            open: true,
            defectos: []
          };
        }
      });
    }

    this.editingId = nc.id;
    this.wizardEditMode = true;
    this.goTo('paso1');
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
    const nc = this.ncs.find(x => x.id === m.ncId);
    if (nc) {
      nc.estado = 'Anulada';
      nc.status = 'Anulado';
      nc.anulacion = {
        motivo: m.motivo === 'Otros' ? (m.otro || 'Otros') : m.motivo,
        usuario: this.sUsuario,
        fecha: this.nowStr()
      };
      nc.historial.push({
        fecha: this.nowStr(),
        usuario: this.sUsuario,
        accion: `Anulación de NC: ${nc.anulacion.motivo}`
      });

      Swal.fire({
        icon: 'success',
        title: 'NC Anulada',
        text: `La ${nc.id} ha sido anulada.`,
        timer: 2000,
        showConfirmButton: false
      });
    }
    this.anularModal.open = false;
  }

  // Visor de fotos
  viewPhotos(photos: { name: string; dataUrl: string }[], index: number): void {
    this.photoViewModal = { open: true, photos, index };
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
  setEvoPeriod(p: 'Año' | 'Mes' | '4 semanas' | '7 días'): void {
    this.evoPeriod = p;
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

  getEvoData(): [string, number][] {
    const fechas = this.ncs.map(nc => this.parseFechaHora(nc.fecha)).filter(Boolean) as Date[];
    const now = new Date();

    if (this.evoPeriod === '7 días') {
      const DIAS_SEM = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
      const buckets: [string, number][] = [];
      for (let i = 6; i >= 0; i--) {
        const day = this.daysAgo(i);
        const count = fechas.filter(d => this.startOfDay(d).getTime() === day.getTime()).length;
        buckets.push([DIAS_SEM[day.getDay()], count]);
      }
      return buckets;
    }

    if (this.evoPeriod === '4 semanas') {
      const buckets: [string, number][] = [];
      for (let w = 3; w >= 0; w--) {
        const finDia = this.daysAgo(w * 7);
        const inicioDia = this.daysAgo(w * 7 + 6);
        const count = fechas.filter(d => {
          const dd = this.startOfDay(d).getTime();
          return dd >= inicioDia.getTime() && dd <= finDia.getTime();
        }).length;
        const label = `Sem ${this.getISOWeek(inicioDia)}`;
        buckets.push([label, count]);
      }
      return buckets;
    }

    if (this.evoPeriod === 'Mes') {
      const MESES_ABR = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const year = now.getFullYear();
      const buckets: [string, number][] = [];
      for (let m = 0; m <= now.getMonth(); m++) {
        const count = fechas.filter(d => d.getFullYear() === year && d.getMonth() === m).length;
        buckets.push([MESES_ABR[m], count]);
      }
      return buckets;
    }

    // 'Año'
    const years = [...new Set(fechas.map(d => d.getFullYear()))].sort();
    if (years.length === 0) years.push(now.getFullYear());
    return years.map(y => [String(y), fechas.filter(d => d.getFullYear() === y).length]);
  }

  getEvoMax(): number {
    const data = this.getEvoData();
    const maxVal = Math.max(1, ...data.map(d => d[1]));
    return maxVal * 1.2;
  }

  getEvoAreaData(): [string, number][] {
    const counts: { [key: string]: number } = {};
    this.ncs.forEach(nc => {
      (nc.articulos || []).forEach(a => (a.defectos || []).forEach(d => {
        const ar = this.defectoAreaFinal(d);
        if (ar) counts[ar] = (counts[ar] || 0) + 1;
      }));
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }

  getEvoAreaMax(): number {
    const data = this.getEvoAreaData();
    const maxVal = Math.max(1, ...data.map(d => d[1]));
    return maxVal * 1.2;
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

  exportarReporteExcel(): void {
    const rows: any[] = [];
    rows.push(['REPORTE DE NO CONFORMIDADES — PRECOTEX']);
    rows.push(['Fecha de Generación:', this.nowStr()]);
    rows.push([]);
    const headers = [
      'N° NC', 'Fecha', 'Partida', 'Cliente', 'Color', 'Artículo', 'Cód. Tela',
      'Rollos Asignados', 'Kg Crudo', 'Rollos Rechazados', 'Kg Afectados Estimados',
      'Motivo Rechazo', 'Área Responsable', 'Registrado Por', 'Estado', 'Status'
    ];
    rows.push(headers);

    this.ncs.forEach(nc => {
      nc.articulos.forEach(a => {
        a.defectos.forEach(d => {
          rows.push([
            nc.id,
            nc.fecha,
            nc.partida,
            nc.cliente,
            nc.color,
            a.nombre,
            a.codTela,
            a.rollos,
            a.kgCrudo,
            a.cantidad,
            this.calcularKgAfectados(a),
            this.defectoLabel(d),
            this.defectoAreaFinal(d),
            nc.registradoPor,
            nc.estado,
            nc.status
          ]);
        });
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'No Conformidades');
    XLSX.writeFile(wb, `Reporte_No_Conformidades_${new Date().getTime()}.xlsx`);
  }

  // Métodos del Modal de Reportes
  openReporteModal(): void {
    this.reporteModal = {
      open: true,
      sel: { nc1: false, nc2: false, informeCalidad: false },
      error: ''
    };
  }

  closeReporteModal(): void {
    this.reporteModal.open = false;
  }

  toggleReporteSel(key: 'nc1' | 'nc2' | 'informeCalidad'): void {
    this.reporteModal.sel[key] = !this.reporteModal.sel[key];
    this.reporteModal.error = '';
  }

  confirmDescargarReportes(): void {
    const sel = this.reporteModal.sel;
    if (!sel.nc1 && !sel.nc2 && !sel.informeCalidad) {
      this.reporteModal.error = 'Seleccione al menos un reporte para descargar.';
      return;
    }

    const wb = XLSX.utils.book_new();

    if (sel.nc1) {
      const rows1 = this.buildReporteNoConforme1Rows();
      const ws1 = XLSX.utils.aoa_to_sheet(rows1);
      XLSX.utils.book_append_sheet(wb, ws1, 'No Conforme 1');
    }

    if (sel.nc2) {
      const rows2 = this.buildReporteNoConforme2Rows();
      const ws2 = XLSX.utils.aoa_to_sheet(rows2);
      XLSX.utils.book_append_sheet(wb, ws2, 'No Conforme 2');
    }

    if (sel.informeCalidad) {
      const rows3 = this.buildReporteInformeCalidadRows();
      const ws3 = XLSX.utils.aoa_to_sheet(rows3);
      XLSX.utils.book_append_sheet(wb, ws3, 'Informe Calidad');
    }

    const timestamp = new Date().getTime();
    XLSX.writeFile(wb, `Reportes_No_Conformidades_${timestamp}.xlsx`);

    this.closeReporteModal();

    Swal.fire({
      icon: 'success',
      title: 'Reportes generados',
      text: 'Se descargaron los reportes seleccionados exitosamente.',
      timer: 2000,
      showConfirmButton: false
    });
  }

  buildReporteNoConforme1Rows(): any[][] {
    const rows: any[][] = [];
    rows.push(['NO CONFORME 1']);
    rows.push(['Fecha actual:', this.nowStr()]);
    rows.push([]);
    const headers = [
      'Número', 'Fecha de Teñido', 'Fecha Informe', 'Fecha Entrega Tela Fin',
      'Días en Planta', 'Tipo Partida', 'Partida', 'Cliente', 'Cod Color', 'Color',
      'Cod Tela', 'Artículo', 'Rollos Asignado', 'KG', 'Rollos Rechazados',
      'KG Afectados', 'Motivo de Rechazo', 'Situación', 'Área Responsable',
      'Asunto Técnico', 'Proceso', 'Acción', 'Talla', 'Status Partida'
    ];
    rows.push(headers);
    this.ncs.forEach(nc => {
      nc.articulos.forEach(a => {
        a.defectos.forEach(d => {
          rows.push([
            nc.id, '', nc.fecha, '', '', '', nc.partida, nc.cliente, '', nc.color,
            a.codTela, a.nombre, a.rollos, a.kgCrudo, a.cantidad,
            this.calcularKgAfectados(a), this.defectoLabel(d), nc.estado,
            this.defectoAreaFinal(d), '', nc.proceso || 'PRODUCCIÓN', '', a.talla,
            nc.status || 'Rechazado'
          ]);
        });
      });
    });
    return rows;
  }

  buildReporteNoConforme2Rows(): any[][] {
    const rows: any[][] = [];
    rows.push(['NO CONFORME 2']);
    rows.push(['Fecha actual:', this.nowStr()]);
    rows.push([]);
    const headers = [
      'Fecha de Teñido', 'Fecha Informe', 'Fecha Entrega Tela Fin', 'Días en Planta',
      'Tipo Partida', 'Partida', 'Cliente', 'Cod Color', 'Color', 'Cod Tela',
      'Artículo', 'Rollos Asignado', 'KG', 'Rollos Rechazados', 'KG Afectados',
      'Motivo de Rechazo', 'Situación', 'Área Responsable', 'Asunto Técnico',
      'Proceso', 'Acción', 'Grupo Textil', 'Lote Hilado', 'OC'
    ];
    rows.push(headers);
    this.ncs.forEach(nc => {
      nc.articulos.forEach(a => {
        a.defectos.forEach(d => {
          rows.push([
            '', nc.fecha, '', '', '', nc.partida, nc.cliente, '', nc.color, a.codTela,
            a.nombre, a.rollos, a.kgCrudo, a.cantidad, this.calcularKgAfectados(a),
            this.defectoLabel(d), nc.estado, this.defectoAreaFinal(d), '',
            nc.proceso || 'PRODUCCIÓN', '', '', '', ''
          ]);
        });
      });
    });
    return rows;
  }

  buildReporteInformeCalidadRows(): any[][] {
    const rows: any[][] = [];
    rows.push(['REPORTE INFORME CALIDAD']);
    rows.push(['Fecha actual:', this.nowStr()]);
    rows.push([]);
    const headers = [
      'Área Responsable', 'Fecha Informe', 'N° Partida', 'Cliente', 'Color',
      'Artículo', 'Kilos Afectados', 'Motivo Rechazo', 'Situación', 'Proceso'
    ];
    rows.push(headers);
    this.ncs.forEach(nc => {
      nc.articulos.forEach(a => {
        a.defectos.forEach(d => {
          rows.push([
            this.defectoAreaFinal(d), nc.fecha, nc.partida, nc.cliente, nc.color,
            a.nombre, this.calcularKgAfectados(a), this.defectoLabel(d),
            nc.estado, nc.proceso || 'PRODUCCIÓN'
          ]);
        });
      });
    });
    return rows;
  }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ControlUbicacionesService } from 'src/app/services/control-ubicaciones.service';

@Component({
    selector: 'app-control-ubicacion',
    templateUrl: './control-ubicacion.component.html',
    styleUrls: ['./control-ubicacion.component.scss']
})
export class ControlUbicacionComponent implements OnInit, AfterViewInit {

    @ViewChild('sortNc') sortNc!: MatSort;
    @ViewChild('inputScan') inputScan!: ElementRef;
    @ViewChild('inputGuia') inputGuia!: ElementRef;
    @ViewChild('inputBulto') inputBulto!: ElementRef;

    currentScreen: string = 'inicio';
    displayedColumns: string[] = ['rollo', 'partida', 'color', 'peso'];
    dataSourceNc = new MatTableDataSource<any>([]);

    // Escaneo de código de barra
    codigoEscaneado: string = '';
    rolloResaltado: string = '';
    infoEscaneo: any = null;

    // Objeto temporal para el formulario de ubicación o reubicación
    draft: any = {};

    constructor(
        private controlUbicacionesService: ControlUbicacionesService,
        private matSnackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.enfocarScan();
    }

    // Mantener el cursor activo en el input para lectura continua con el PDA
    enfocarScan(): void {
        setTimeout(() => {
            if (this.inputScan && this.inputScan.nativeElement) {
                this.inputScan.nativeElement.focus();
            }
        }, 120);
    }

    limpiarEscaneo(): void {
        this.codigoEscaneado = '';
        this.enfocarScan();
    }

    // Acción ejecutada al presionar Enter o gatillar el lector de barras del PDA
    onScanCodigo(): void {
        const codigo = (this.codigoEscaneado || '').trim();
        if (!codigo) {
            return;
        }

        // Detectar si el código escaneado es una ubicación (ej: R20A01-01 o R01A02-02) o un rollo (ej: 2603001576)
        const matchUbicacion = codigo.match(/^R(\d+)([A-Za-z])(\d+)-(\d+)$/i);
        let desUbicacion = '';
        let idRollo = '';
        let tipoLect = 'rollo';

        if (matchUbicacion) {
            desUbicacion = codigo.toUpperCase();
            tipoLect = 'ubicación';
        } else {
            idRollo = codigo;
            tipoLect = 'rollo';
        }

        this.controlUbicacionesService.obtenerDetalleUbicacion(desUbicacion, idRollo).subscribe({
            next: (res) => {
                if (res && res.success && res.element) {
                    const data = res.element;
                    const resumen = data.resumen;
                    const detalle = data.detalle || [];

                    const codUbic = (resumen?.des_Ubicacion || desUbicacion || '').trim();
                    const descUbic = this.formatearDescripcionUbicacion(codUbic);

                    this.infoEscaneo = {
                        tipoLectura: tipoLect,
                        mensaje: tipoLect === 'rollo' ? 'Rollo leído resaltado en la lista' : 'Ubicación seleccionada',
                        codigoUbicacion: codUbic || 'N/A',
                        descripcionUbicacion: descUbic,
                        rollosActuales: resumen?.tot_Bulto ?? detalle.length,
                        pesoTotal: this.formatearPeso(resumen?.tot_Peso_Neto)
                    };

                    this.rolloResaltado = idRollo;

                    const listaRollos = detalle.map(d => ({
                        rollo: d.iD_Rollo_X_Anio,
                        partida: d.cod_Ordtra,
                        color: d.des_Color,
                        peso: this.formatearPeso(d.peso_Neto)
                    }));

                    this.dataSourceNc = new MatTableDataSource(listaRollos);
                    if (this.sortNc) {
                        this.dataSourceNc.sort = this.sortNc;
                    }

                    if (listaRollos.length === 0) {
                        this.matSnackBar.open('No se encontraron rollos para esta consulta', 'Cerrar', { duration: 3000 });
                    }
                } else {
                    this.matSnackBar.open(res?.message || 'No se encontró información', 'Cerrar', { duration: 3000 });
                }

                this.codigoEscaneado = '';
                this.enfocarScan();
            },
            error: (err) => {
                console.error(err);
                const msg = err.error?.message || err.message || 'Error al conectar con el servidor';
                this.matSnackBar.open('Error: ' + msg, 'Cerrar', { duration: 4000 });
                this.codigoEscaneado = '';
                this.enfocarScan();
            }
        });
    }

    formatearDescripcionUbicacion(codigo: string): string {
        const match = (codigo || '').trim().match(/^R(\d+)([A-Za-z])(\d+)-(\d+)$/i);
        if (match) {
            return `Rack ${match[1]} · Nivel ${match[2].toUpperCase()} · Nicho ${match[3]} · Pos ${match[4]}`;
        }
        return codigo ? `Ubicación ${codigo}` : 'Sin ubicación asignada';
    }

    formatearPeso(val: any): string {
        if (val === null || val === undefined || val === '') {
            return '0.000';
        }
        const num = Number(val);
        return isNaN(num) ? String(val) : num.toFixed(3);
    }

    // Pantalla Ubicar Bultos (Datos y Métodos)
    guiaRemision: string = '';
    totEnviados: number = 0;
    totUbicados: number = 0;
    totPendientes: number = 0;
    totPesoGuia: number = 0;

    inputBultoScan: string = '';
    ubicacionDestino: string = '';

    bultosLecturados: Array<{
        bulto: string;
        partida: string;
        kg: string;
    }> = [];

    get totalKgLecturados(): string {
        if (this.totPesoGuia > 0) {
            return this.totPesoGuia.toFixed(1);
        }
        const sum = this.bultosLecturados.reduce((acc, curr) => acc + (Number(curr.kg) || 0), 0);
        return sum.toFixed(1);
    }

    // Pantalla Reubicar Bultos (Datos y Métodos)
    @ViewChild('inputBultoReubicar') inputBultoReubicar!: ElementRef;
    inputBultoReubicarScan: string = '';
    nuevaUbicacionDestino: string = '';
    ultimoBultoReubicado: {
        bulto: string;
        ubicacionActual: string;
        partida: string;
        peso: string;
    } | null = null;

    bultosReubicar: Array<{
        bulto: string;
        partida: string;
        kg: string;
        ubicacionActual?: string;
    }> = [];

    get totalKgReubicar(): string {
        const sum = this.bultosReubicar.reduce((acc, curr) => acc + (Number(curr.kg) || 0), 0);
        return sum.toFixed(1);
    }

    private scanGuiaTimer: any = null;
    private scanBultoTimer: any = null;

    enfocarInputGuia(): void {
        setTimeout(() => {
            if (this.inputGuia && this.inputGuia.nativeElement) {
                this.inputGuia.nativeElement.focus();
            } else {
                const el = document.getElementById('inputGuia');
                if (el) el.focus();
            }
        }, 120);
    }

    enfocarInputBulto(): void {
        setTimeout(() => {
            if (this.inputBulto && this.inputBulto.nativeElement) {
                this.inputBulto.nativeElement.focus();
            } else {
                const el = document.getElementById('inputBulto');
                if (el) el.focus();
            }
        }, 120);
    }

    onGuiaInputChange(): void {
        if (this.scanGuiaTimer) {
            clearTimeout(this.scanGuiaTimer);
        }
        const val = (this.guiaRemision || '').trim();
        if (!val) return;

        this.scanGuiaTimer = setTimeout(() => {
            this.consultarGuiaActual();
        }, 250);
    }

    consultarGuiaActual(): void {
        if (this.scanGuiaTimer) {
            clearTimeout(this.scanGuiaTimer);
            this.scanGuiaTimer = null;
        }

        const guia = (this.guiaRemision || '').trim().replace(/\s+/g, '-');
        if (!guia) {
            this.matSnackBar.open('Ingrese o escanee el N.° de Guía', 'Cerrar', { duration: 2500 });
            return;
        }

        this.guiaRemision = guia;
        this.controlUbicacionesService.consultarGuia(guia).subscribe({
            next: (res) => {
                if (res && res.element) {
                    const data = res.element;
                    this.totEnviados = data.totales?.tot_Enviados ?? 0;
                    this.totUbicados = data.totales?.tot_Ubicados ?? 0;
                    this.totPendientes = data.totales?.tot_Pendientes ?? 0;
                    this.totPesoGuia = data.totales?.tot_Peso_Neto ?? 0;

                    this.bultosLecturados = (data.bultos || []).map(b => ({
                        bulto: b.iD_Rollo_X_Anio || '',
                        partida: b.cod_Ordtra || '',
                        kg: this.formatearPeso(b.peso_Neto)
                    }));

                    if (this.totEnviados > 0) {
                        this.matSnackBar.open(`Guía cargada: ${this.totEnviados} bultos enviados`, 'OK', { duration: 2500 });
                        this.enfocarInputBulto();
                    } else {
                        this.matSnackBar.open('La guía no registra movimientos de almacén', 'Cerrar', { duration: 3000 });
                    }
                } else {
                    this.matSnackBar.open(res?.message || 'No se pudo consultar la guía', 'Cerrar', { duration: 3000 });
                }
            },
            error: (err) => {
                console.error(err);
                const msg = err.error?.message || err.message || 'Error al consultar la guía';
                this.matSnackBar.open('Error: ' + msg, 'Cerrar', { duration: 3500 });
            }
        });
    }

    // Detección automática al escanear desde celular/cámara/PDA sin necesidad de dar clic ni presionar Enter
    onBultoInputChange(): void {
        if (this.scanBultoTimer) {
            clearTimeout(this.scanBultoTimer);
        }
        const val = (this.inputBultoScan || '').trim();
        if (!val) return;

        // Un lector de código de barras o cámara de celular ingresa la cadena de golpe o en pocos milisegundos.
        // Con 220ms de pausa se procesa automáticamente al terminar la lectura sin tocar la pantalla
        this.scanBultoTimer = setTimeout(() => {
            this.onScanBulto();
        }, 220);
    }

    forzarScanBulto(): void {
        if (this.scanBultoTimer) {
            clearTimeout(this.scanBultoTimer);
            this.scanBultoTimer = null;
        }
        this.onScanBulto();
    }

    onScanBulto(): void {
        if (this.scanBultoTimer) {
            clearTimeout(this.scanBultoTimer);
            this.scanBultoTimer = null;
        }

        const codigo = (this.inputBultoScan || '').trim();
        if (!codigo) return;

        const guia = (this.guiaRemision || '').trim().replace(/\s+/g, '-');
        if (!guia) {
            this.matSnackBar.open('Primero debe escanear o ingresar el N.° de Guía', 'Cerrar', { duration: 3000 });
            this.enfocarInputGuia();
            return;
        }

        const yaExiste = this.bultosLecturados.some(b => b.bulto.toUpperCase() === codigo.toUpperCase());
        if (yaExiste) {
            this.matSnackBar.open('El bulto ya fue lecturado en esta guía', 'Cerrar', { duration: 2500 });
            this.inputBultoScan = '';
            this.enfocarInputBulto();
            return;
        }

        this.controlUbicacionesService.insertarBultoGuia({
            numGuia: guia,
            idRollo: codigo
        }).subscribe({
            next: (res) => {
                if (res && res.element) {
                    const data = res.element;
                    this.totEnviados = data.totales?.tot_Enviados ?? this.totEnviados;
                    this.totUbicados = data.totales?.tot_Ubicados ?? this.totUbicados;
                    this.totPendientes = data.totales?.tot_Pendientes ?? this.totPendientes;
                    this.totPesoGuia = data.totales?.tot_Peso_Neto ?? 0;

                    this.bultosLecturados = (data.bultos || []).map(b => ({
                        bulto: b.iD_Rollo_X_Anio || '',
                        partida: b.cod_Ordtra || '',
                        kg: this.formatearPeso(b.peso_Neto)
                    }));

                    if (data.cod === 1) {
                        // Lectura e inserción exitosa
                    } else {
                        // Mensaje de validación del Stored Procedure
                        this.matSnackBar.open(data.msg || res.message || 'No se pudo lecturar el bulto', 'Cerrar', { duration: 3500 });
                    }
                } else if (!res.success) {
                    this.matSnackBar.open(res.message || 'No se pudo lecturar el bulto', 'Cerrar', { duration: 3500 });
                }

                this.inputBultoScan = '';
                this.enfocarInputBulto();
            },
            error: (err) => {
                console.error(err);
                const msg = err.error?.message || err.message || 'Error al registrar el bulto';
                this.matSnackBar.open('Error: ' + msg, 'Cerrar', { duration: 3500 });
                this.inputBultoScan = '';
                this.enfocarInputBulto();
            }
        });
    }

    removeBulto(index: number): void {
        this.matSnackBar.open('Eliminación individual no disponible por el momento', 'Cerrar', { duration: 2500 });
        this.enfocarInputBulto();
    }

    vaciarBultos(): void {
        this.controlUbicacionesService.limpiarTemporalGuia().subscribe({
            next: () => {
                this.bultosLecturados = [];
                this.totPesoGuia = 0;
                this.matSnackBar.open('Listado vaciado correctamente', 'OK', { duration: 2000 });
                this.enfocarInputBulto();
            },
            error: () => {
                this.bultosLecturados = [];
                this.totPesoGuia = 0;
                this.enfocarInputBulto();
            }
        });
    }

    guardarUbicacion(): void {
        const guia = (this.guiaRemision || '').trim();
        const ubicacion = (this.ubicacionDestino || '').trim().toUpperCase();

        if (!guia) {
            this.matSnackBar.open('Ingrese o escanee el N.° de Guía', 'Cerrar', { duration: 2500 });
            this.enfocarInputGuia();
            return;
        }
        if (this.bultosLecturados.length === 0) {
            this.matSnackBar.open('Debe escanear al menos un bulto para ubicar', 'Cerrar', { duration: 2500 });
            this.enfocarInputBulto();
            return;
        }
        if (!ubicacion) {
            this.matSnackBar.open('Ingrese la ubicación de destino', 'Cerrar', { duration: 2500 });
            return;
        }

        this.controlUbicacionesService.guardarUbicacionGuia({
            numGuia: guia,
            desUbicacion: ubicacion
        }).subscribe({
            next: (res) => {
                if (res && res.element) {
                    const data = res.element;
                    if (data.cod === 1) {
                        this.totEnviados = data.totales?.tot_Enviados ?? this.totEnviados;
                        this.totUbicados = data.totales?.tot_Ubicados ?? this.totUbicados;
                        this.totPendientes = data.totales?.tot_Pendientes ?? this.totPendientes;
                        this.totPesoGuia = data.totales?.tot_Peso_Neto ?? 0;
                        this.bultosLecturados = [];
                        this.ubicacionDestino = '';

                        this.matSnackBar.open(`Bultos guardados correctamente en la ubicación ${ubicacion}`, 'OK', { duration: 3500 });
                        this.enfocarInputBulto();
                    } else {
                        this.matSnackBar.open(data.msg || res.message || 'No se pudo guardar la ubicación', 'Cerrar', { duration: 3500 });
                    }
                } else {
                    this.matSnackBar.open(res?.message || 'Error al guardar la ubicación', 'Cerrar', { duration: 3500 });
                }
            },
            error: (err) => {
                console.error(err);
                const msg = err.error?.message || err.message || 'Error al conectar con el servidor';
                this.matSnackBar.open('Error: ' + msg, 'Cerrar', { duration: 3500 });
            }
        });
    }

    // Cambiar de pantalla / vista
    goTo(screen: string): void {
        this.currentScreen = screen;
        if (screen === 'inicio') {
            this.enfocarScan();
        } else if (screen === 'ubicar') {
            if (!this.guiaRemision) {
                this.enfocarInputGuia();
            } else {
                this.enfocarInputBulto();
            }
        } else if (screen === 'reubicar') {
            this.enfocarInputBultoReubicar();
        }
    }

    // Formatear fecha y hora actual
    nowStr(): string {
        const now = new Date();
        return now.toLocaleDateString('es-PE') + ' ' + now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    }

    // Iniciar registro de nueva ubicación
    startNuevaUbicacion(): void {
        this.controlUbicacionesService.limpiarTemporalGuia().subscribe({
            next: () => {
                this.resetearDatosGuia();
                this.goTo('ubicar');
            },
            error: () => {
                this.resetearDatosGuia();
                this.goTo('ubicar');
            }
        });
    }

    resetearDatosGuia(): void {
        this.guiaRemision = '';
        this.totEnviados = 0;
        this.totUbicados = 0;
        this.totPendientes = 0;
        this.totPesoGuia = 0;
        this.inputBultoScan = '';
        this.ubicacionDestino = '';
        this.bultosLecturados = [];
    }

    // Iniciar reubicación
    startReubicacion(): void {
        this.inputBultoReubicarScan = '';
        this.nuevaUbicacionDestino = '';
        this.ultimoBultoReubicado = null;
        this.bultosReubicar = [];
        this.goTo('reubicar');
    }

    enfocarInputBultoReubicar(): void {
        setTimeout(() => {
            if (this.inputBultoReubicar && this.inputBultoReubicar.nativeElement) {
                this.inputBultoReubicar.nativeElement.focus();
            } else {
                const el = document.getElementById('inputBultoReubicar');
                if (el) el.focus();
            }
        }, 120);
    }

    onBultoReubicarInputChange(): void {
        if (this.scanBultoTimer) {
            clearTimeout(this.scanBultoTimer);
        }
        const val = (this.inputBultoReubicarScan || '').trim();
        if (!val) return;

        this.scanBultoTimer = setTimeout(() => {
            this.onScanBultoReubicar();
        }, 220);
    }

    forzarScanBultoReubicar(): void {
        if (this.scanBultoTimer) {
            clearTimeout(this.scanBultoTimer);
            this.scanBultoTimer = null;
        }
        this.onScanBultoReubicar();
    }

    onScanBultoReubicar(): void {
        const codigo = (this.inputBultoReubicarScan || '').trim();
        if (!codigo) return;

        const yaExiste = this.bultosReubicar.some(b => b.bulto.toUpperCase() === codigo.toUpperCase());
        if (yaExiste) {
            this.matSnackBar.open('El bulto ya fue lecturado en esta lista', 'Cerrar', { duration: 2500 });
            this.inputBultoReubicarScan = '';
            this.enfocarInputBultoReubicar();
            return;
        }

        // Consultar detalle del rollo actual para mostrar su ubicación de origen, partida y peso
        this.controlUbicacionesService.obtenerDetalleUbicacion('', codigo).subscribe({
            next: (res) => {
                if (res && res.element) {
                    const data = res.element;
                    const resumen = data.resumen;
                    const detalle = data.detalle || [];
                    const itemDetalle = detalle.find(d => (d.iD_Rollo_X_Anio || '').trim() === codigo) || detalle[0];

                    const ubicacion = (resumen?.des_Ubicacion || '').trim() || 'Sin ubicación';
                    const partida = (itemDetalle?.cod_Ordtra || '').trim() || '---';
                    const peso = itemDetalle?.peso_Neto ? this.formatearPeso(itemDetalle.peso_Neto) : '0.000';

                    this.ultimoBultoReubicado = {
                        bulto: codigo,
                        ubicacionActual: ubicacion,
                        partida: partida,
                        peso: peso
                    };

                    this.bultosReubicar.unshift({
                        bulto: codigo,
                        partida: partida,
                        kg: peso,
                        ubicacionActual: ubicacion
                    });

                    this.inputBultoReubicarScan = '';
                    this.enfocarInputBultoReubicar();
                } else {
                    this.matSnackBar.open('No se encontró información del bulto ' + codigo, 'Cerrar', { duration: 3000 });
                    this.inputBultoReubicarScan = '';
                    this.enfocarInputBultoReubicar();
                }
            },
            error: (err) => {
                console.error(err);
                this.matSnackBar.open('Error al consultar el bulto', 'Cerrar', { duration: 3000 });
                this.inputBultoReubicarScan = '';
                this.enfocarInputBultoReubicar();
            }
        });
    }

    removeBultoReubicar(index: number): void {
        this.bultosReubicar.splice(index, 1);
        if (this.bultosReubicar.length > 0) {
            const primero = this.bultosReubicar[0];
            this.ultimoBultoReubicado = {
                bulto: primero.bulto,
                ubicacionActual: primero.ubicacionActual || '',
                partida: primero.partida,
                peso: primero.kg
            };
        } else {
            this.ultimoBultoReubicado = null;
        }
        this.enfocarInputBultoReubicar();
    }

    vaciarBultosReubicar(): void {
        this.bultosReubicar = [];
        this.ultimoBultoReubicado = null;
        this.matSnackBar.open('Lista de reubicación vaciada', 'OK', { duration: 2000 });
        this.enfocarInputBultoReubicar();
    }

    guardarReubicacion(): void {
        const ubicacion = (this.nuevaUbicacionDestino || '').trim().toUpperCase();
        if (this.bultosReubicar.length === 0) {
            this.matSnackBar.open('Debe escanear al menos un bulto para reubicar', 'Cerrar', { duration: 2500 });
            this.enfocarInputBultoReubicar();
            return;
        }
        if (!ubicacion) {
            this.matSnackBar.open('Ingrese la nueva ubicación', 'Cerrar', { duration: 2500 });
            return;
        }

        this.matSnackBar.open(`Reubicación lista para procesar en ${ubicacion} (${this.bultosReubicar.length} bultos)`, 'OK', { duration: 3500 });
    }

}

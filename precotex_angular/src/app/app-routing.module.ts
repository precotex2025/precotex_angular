import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';

import { AuditoriaLineaCosturaComponent } from './components/auditoria-calidad/auditoria-linea-costura/auditoria-linea-costura.component';
import { SeguridadControlGuiaComponent } from  './components/seguridad/seguridad-control-guia/seguridad-control-guia.component';
import { SeguridadControlGuiaAccionComponent} from './components/seguridad/seguridad-control-guia/seguridad-control-guia-accion/seguridad-control-guia-accion.component';
import { SeguridadControlGuiaSalidaComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-salida/seguridad-control-guia-salida.component'
import { SeguridadControlGuiaInternoComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-interno/seguridad-control-guia-interno.component'
import { SeguridadControlGuiaExternoComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-externo/seguridad-control-guia-externo.component'
import { SeguridadControlGuiaHistorialComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-historial/seguridad-control-guia-historial.component'
import { SeguridadControlMemorandumComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-memorandum/seguridad-control-memorandum.component';
import { SeguridadControlMemorandumDetalleComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-memorandum/seguridad-control-memorandum-detalle/seguridad-control-memorandum-detalle.component';
import { DespachoTelaCrudaComponent } from './components/despacho-tela-cruda/despacho-tela-cruda.component'
import { DespachoTelaCrudaDetalleComponent } from './components/despacho-tela-cruda/despacho-tela-cruda-detalle/despacho-tela-cruda-detalle.component'
import { PrincipalComponent } from './components/principal/principal.component';

import { SeguridadControlVehiculoComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo.component';
import { SeguridadControlVehiculoAccionComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-accion/seguridad-control-vehiculo-accion.component';
import { SeguridadControlVehiculoIngresoComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-ingreso/seguridad-control-vehiculo-ingreso.component';
import { SeguridadControlVehiculoSalidaComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-salida/seguridad-control-vehiculo-salida.component';
import { SeguridadControlVehiculoHistorialComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-historial/seguridad-control-vehiculo-historial.component';
import { SeguridadControlVehiculoRegistroVehiculoComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-registro-vehiculo/seguridad-control-vehiculo-registro-vehiculo.component';
import { SeguridadControlVehiculoReporteComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-reporte/seguridad-control-vehiculo-reporte.component';
import { SeguridadControlVehiculoRegistroConductorComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-registro-conductor/seguridad-control-vehiculo-registro-conductor.component';
import { ConsultaRequisitoriaComponent } from './components/seguridad/consulta-requisitoria/consulta-requisitoria.component'
import { SeguridadControlJabasComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas.component';
import { SeguridadControlJabasAccionComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-accion/seguridad-control-jabas-accion.component';
import { SeguridadControlJabasSalidaComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-salida/seguridad-control-jabas-salida.component';
import { SeguridadControlJabasInternoComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-interno/seguridad-control-jabas-interno.component';
import { SeguridadControlJabasExternoComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-externo/seguridad-control-jabas-externo.component';
import { SeguridadControlJabasHistorialComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-historial/seguridad-control-jabas-historial.component';
import { SeguridadActivoFijoReporteComponent } from './components/seguridad-activo-fijo-reporte/seguridad-activo-fijo-reporte.component';
import { TiemposImproductivosComponent } from './components/tiempos-improductivos/tiempos-improductivos.component';
//import { TiemposImproductivosv2Component } from './components/tiempos-improductivosv2/tiempos-improductivosv2.component';

import { DefectosAlmacenDerivadosComponent } from './components/auditoria-calidad/defectos-almacen-derivados/defectos-almacen-derivados.component';
import { ReporteDefectosAlmacenDerivadosComponent } from './components/auditoria-calidad/defectos-almacen-derivados/reporte-almacen-derivado/reporte-defectos-almacen-derivados/reporte-defectos-almacen-derivados.component';
import { ReporteDefectosTotalesDerivadosComponent} from  './components/auditoria-calidad/defectos-almacen-derivados/reporte-almacen-derivado/reporte-defectos-totales-derivados/reporte-defectos-totales-derivados.component'
import { AuditoriaDefectoDerivadoComponent} from './components/auditoria-calidad/auditoria-defecto-derivado/auditoria-defecto-derivado.component'

import { MovimientoInspeccionComponent } from './components/inspeccion/movimiento-inspeccion/movimiento-inspeccion.component';
import { AuditoriaInspeccionCosturaComponent } from './components/auditoria-calidad/auditoria-inspeccion-costura/auditoria-inspeccion-costura.component';

import { IngresoRolloTejidoComponent} from './components/ingreso-rollo-tejido/ingreso-rollo-tejido.component'
import { IngresoRolloTejidoDetalleComponent} from './components/ingreso-rollo-tejido/ingreso-rollo-tejido-detalle/ingreso-rollo-tejido-detalle.component';

import { AuditoriaHojaMedidaComponent} from './components/auditoria-calidad/auditoria-hoja-medida/auditoria-hoja-medida.component'
import { AuditoriaHojaMedidaDetalleComponent } from './components/auditoria-calidad/auditoria-hoja-medida/auditoria-hoja-medida-detalle/auditoria-hoja-medida-detalle.component';

import { SeguridadControlJabaComponent} from './components/seguridad/seguridad-control-jaba/seguridad-control-jaba.component'
import { RegistrarSeguridadControlJabaComponent} from './components/seguridad/seguridad-control-jaba/registrar-seguridad-control-jaba/registrar-seguridad-control-jaba.component'
import { RegistrarDetalleSeguridadControlJabaComponent} from './components/seguridad/seguridad-control-jaba/registrar-detalle-seguridad-control-jaba/registrar-detalle-seguridad-control-jaba.component'
import { SeguridadControlMovimientosJabasComponent} from './components/seguridad/seguridad-control-movimientos-jabas/seguridad-control-movimientos-jabas.component'
import { SeguridadControlMovimientosJabasAccionComponent} from './components/seguridad/seguridad-control-movimientos-jabas/seguridad-control-movimientos-jabas-accion/seguridad-control-movimientos-jabas-accion.component'

import { DespachoOpIncompletaComponent} from './components/despacho-op-incompleta/despacho-op-incompleta.component'

import { ControlActivoFijoComponent} from './components/control-activo-fijo/control-activo-fijo.component'

import { InspeccionPrendaComponent} from './components/inspeccion/inspeccion-prenda/inspeccion-prenda.component'
import { ReinspeccionPrendaComponent} from './components/inspeccion/reinspeccion-prenda/reinspeccion-prenda.component'
import { InspeccionPrendaHabilitadorComponent} from './components/inspeccion/inspeccion-prenda-habilitador/inspeccion-prenda-habilitador.component'
import { DerivadoInspeccionPrendaComponent} from './components/auditoria-calidad/derivado-inspeccion-prenda/derivado-inspeccion-prenda.component'

import { PermitirGiradoOpComponent} from './components/confecciones/permitir-girado-op/permitir-girado-op.component'
import { RegistrarPermisosComponent } from './components/seguridad/registrar-permisos/registrar-permisos.component'
import { TiposPermisosComponent } from './components/seguridad/registrar-permisos/tipos-permisos/tipos-permisos.component'

//huachipa
import { ReprocesoPartidaComponent } from './components/reproceso-partida/reproceso-partida.component';
import { TelasComponent } from './components/telas/telas.component';

import { CortesEncogimientoComponent } from './components/cortes-encogimiento/cortes-encogimiento.component';

//mantenimiento general web - rol- opciones- usuarios
import { MantenimientoWebComponent} from './components/mantenimiento-web/mantenimiento-web.component'
import { AccesosUsuariosComponent} from './components/accesos-usuarios/accesos-usuarios.component'
import { ActivarSalidaComponent } from './components/control-activos-fijo/activar-salida/activar-salida.component';
import { ValidarSalidaComponent } from './components/control-activos-fijo/validar-salida/validar-salida.component';

//dashboard estilos por liquidar
import {EstilosLiquidarComponent} from './components/estilos-liquidar/estilos-liquidar.component'
import { DialogIngresoEmpleadoComponent } from './components/seguridad/registrar-permisos/form-permisos/dialog-ingreso-empleado/dialog-ingreso-empleado.component'
import { DialogIngresoEmpleadoComisionComponent } from './components/seguridad/registrar-permisos/form-comisiones/dialog-ingreso-empleado-comision/dialog-ingreso-empleado-comision.component'
import { DialogIngresoEmpleadorefrigerioComponent } from './components/seguridad/registrar-permisos/form-refrigerio/dialog-ingreso-empleadorefrigerio/dialog-ingreso-empleadorefrigerio.component'

//mantenimiento de jabas
import { MantenimientoJabasComponent} from './components/mantenimiento-jabas/mantenimiento-jabas.component'
import { DialogTiemposImproductivosComponent } from './components/tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { DialogModificaTiemposImproductivosComponent } from './components/tiempos-improductivos/dialog-modifica-tiempos-improductivos/dialog-modifica-tiempos-improductivos.component';
import { DialogModificaTelasComponent } from './components/confecciones/liquidacion-corte/dialog-modifica-telas/dialog-modifica-telas.component';
import { EficienciaMaquinaTurnoComponent } from './components/eficiencia-maquina-turno/eficiencia-maquina-turno.component';
import { LiquidacionCorteComponent } from './components/confecciones/liquidacion-corte/liquidacion-corte.component';
import { FormPermisosComponent } from './components/seguridad/registrar-permisos/form-permisos/form-permisos.component';
import { FormComisionesComponent } from './components/seguridad/registrar-permisos/form-comisiones/form-comisiones.component';
import { FormRefrigerioComponent } from './components/seguridad/registrar-permisos/form-refrigerio/form-refrigerio.component';
import { PruebasComponent } from './components/pruebas/pruebas.component';
import { LecturaPermisosComponent } from './components/seguridad/lectura-permisos/lectura-permisos.component';
import { InspeccionLiberacionPaqueteComponent } from './components/inspeccion/inspeccion-liberacion-paquete/inspeccion-liberacion-paquete.component';
import { LecturaComisionesComponent } from './components/seguridad/lectura-comisiones/lectura-comisiones.component';
import { SeleccionarSedeComponent } from './components/seguridad/seleccionar-sede/seleccionar-sede.component';
import { SeleccionarSedeAccionComponent } from './components/seguridad/seleccionar-sede/seleccionar-sede-accion/seleccionar-sede-accion.component';
import { UbicacionHilosAlmacenComponent } from './components/ubicacion-hilos-almacen/ubicacion-hilos-almacen.component';
import { LecturaBultosAlmacenComponent } from './components/lectura-bultos-almacen/lectura-bultos-almacen.component';
import { SeguimientoOrdenesAtencionComponent } from './components/seguimiento-ordenes-atencion/seguimiento-ordenes-atencion.component';
import { ReporteLecturaPermisosComponent } from './components/seguridad/reporte-lectura-permisos/reporte-lectura-permisos.component';
import { LecturaRefrigerioComponent } from './components/seguridad/lectura-refrigerio/lectura-refrigerio.component';
import { RegistroManteMaquinasHilosComponent } from './components/registro-mante-maquinas-hilos/registro-mante-maquinas-hilos.component';
import { SaldoDevolverComponent } from './components/confecciones/saldo-devolver/saldo-devolver.component';
import { SaldoDevolverIndicadorComponent } from './components/confecciones/saldo-devolver-indicador/saldo-devolver-indicador.component';
import { VerAvancesComponent } from './components/confecciones/liquidacion-corte/ver-avances/ver-avances.component';
import { VerRatioConsumoComponent } from './components/confecciones/liquidacion-corte/ver-ratio-consumo/ver-ratio-consumo.component';
import { ConfeccionesAperturaTextilComponent } from './components/confecciones/confecciones-apertura-textil/confecciones-apertura-textil.component';
import { RegistroCalidadTejeduriaComponent } from './components/registro-calidad-tejeduria/registro-calidad-tejeduria.component';

import { LaboratorioLecturaRecetasComponent } from './components/laboratorio-lectura-recetas/laboratorio-lectura-recetas.component';
import { SeguimientoToberaComponent } from './components/seguimiento-tobera/seguimiento-tobera.component';

import { AsignarAreasUsuariosPermisosComponent } from './components/asignar-areas-usuarios-permisos/asignar-areas-usuarios-permisos.component';
import { OperatividadFichaTecnicaComponent } from './components/operatividad-ficha-tecnica/operatividad-ficha-tecnica.component';
import { DetallesOperatividadFichaComponent } from './components/operatividad-ficha-tecnica/detalles-operatividad-ficha/detalles-operatividad-ficha.component';
import { RolesUsuarioWebComponent } from './components/accesos-usuarios/roles-usuario-web/roles-usuario-web.component';
import { AsignarRolesUsuarioComponent } from './components/accesos-usuarios/asignar-roles-usuario/asignar-roles-usuario.component';
import { ReportesInspeccionPrendaComponent } from './components/inspeccion/reportes-inspeccion-prenda/reportes-inspeccion-prenda.component';
import { MantenimientosCorreosComponent } from './components/comedor/mantenimientos-correos/mantenimientos-correos.component';
import { ReporteInspeccionAuditoriaComponent } from './components/inspeccion/reporte-inspeccion-auditoria/reporte-inspeccion-auditoria.component';
import { ProgramacionVacacionesComponent } from './components/vacaciones/programacion-vacaciones/programacion-vacaciones.component';
import { HistorialVacacionesComponent } from './components/vacaciones/programacion-vacaciones/historial-vacaciones/historial-vacaciones.component';
import { RecursosProgramacionVacacionesComponent } from './components/vacaciones/recursos-programacion-vacaciones/recursos-programacion-vacaciones.component';
import { HistorialVacacionesRecursosComponent } from './components/vacaciones/recursos-programacion-vacaciones/historial-vacaciones-recursos/historial-vacaciones-recursos.component';
import { ClaseActivosComponent } from './components/clase-activos/clase-activos.component';
import { ColorActivosComponent } from './components/color-activos/color-activos.component';
import { ControlActivosFijoComponent } from './components/control-activos-fijo/control-activos-fijo.component';
import { HistorialControlActivosComponent } from './components/historial-control-activos/historial-control-activos.component';
import { ActualizarActivoFijoComponent } from './components/control-activos-fijo/actualizar-activo-fijo/actualizar-activo-fijo.component';
import { RegistroMermaComponent } from './components/registro-merma/registro-merma.component';
import { ControlMermaComponent } from './components/control-merma/control-merma.component';
import { AgregarRegistroMermaComponent } from './components/registro-merma/agregar-registro-merma/agregar-registro-merma.component';
import { ActualizarControlInternoComponent } from './components/control-merma/actualizar-control-interno/actualizar-control-interno.component';
import { ActasAcuerdoComponent } from './components/actas-acuerdo/actas-acuerdo.component';
import { CrearNuevoActaComponent } from './components/actas-acuerdo/crear-nuevo-acta/crear-nuevo-acta.component';
import { CrearParticipantesActaComponent } from './components/actas-acuerdo/crear-participantes-acta/crear-participantes-acta.component';
import { MemoddtComponent } from './components/memoddt/memoddt.component';
import { InspeccionLecturaDerivadosComponent } from './components/inspeccion/inspeccion-lectura-derivados/inspeccion-lectura-derivados.component';
import { ComercialCargaImagenesComponent } from './components/comercial-carga-imagenes/comercial-carga-imagenes.component';
import { ComercialImgHuachipaComponent } from './components/comercial-img-huachipa/comercial-img-huachipa.component';
import { FormatoCheckListComponent } from './components/formato-check-list/formato-check-list.component';
import { AuditoriaHojaMedidaInspComponent } from './components/auditoria-calidad/auditoria-hoja-medida-insp/auditoria-hoja-medida-insp.component';
import { AuditoriaHojaMedidaDetalleInspComponent } from './components/auditoria-calidad/auditoria-hoja-medida-insp/auditoria-hoja-medida-detalle-insp/auditoria-hoja-medida-detalle-insp.component';
import { LiquidacionPendientesComponent } from './components/confecciones/liquidacion-pendientes/liquidacion-pendientes.component';
import { GestionVisitasComponent } from './components/gestion-visitas/gestion-visitas.component';
import { ReporteVisitasComponent } from './components/reporte-visitas/reporte-visitas.component';
import { SeleccionarTipoVisitaComponent } from './components/gestion-visitas/seleccionar-tipo-visita/seleccionar-tipo-visita.component';
import { CrearVisitaComponent } from './components/gestion-visitas/crear-visita/crear-visita.component';
import { ConsultaVisitaComponent } from './components/gestion-visitas/consulta-visita/consulta-visita.component';
import { ComedorEncuestaUsuarioComponent } from './components/comedor/comedor-encuesta-usuario/comedor-encuesta-usuario.component';
import { FormPermisoDiaComponent } from './components/seguridad/registrar-permisos/form-permiso-dia/form-permiso-dia.component';
import { FormAprobacionPermisosComponent } from './components/seguridad/registrar-permisos/form-aprobacion-permisos/form-aprobacion-permisos.component';
import { FormTrabajadoresPermisosComponent } from './components/seguridad/registrar-permisos/form-aprobacion-permisos/form-trabajadores-permisos/form-trabajadores-permisos.component';
import { MantenimientoPreguntasDetComponent } from './components/comedor/mantenimientos-correos/mantenimiento-preguntas-det/mantenimiento-preguntas-det.component';
import { ReporteEncuestaComponent } from './components/comedor/reporte-encuesta/reporte-encuesta.component';
import { GuiaContingenciaComponent } from './components/guia-contingencia/guia-contingencia.component';
import { SeguridadRecalcularBonosComponent } from './components/seguridad/seguridad-recalcular-bonos/seguridad-recalcular-bonos.component';
import { HistorialReposicionComponent } from './components/reposiciones/historial-reposicion/historial-reposicion.component';
import { AprobacionReposicionComponent } from './components/reposiciones/aprobacion-reposicion/aprobacion-reposicion.component';
import { AprobacionReposicionCorteComponent } from './components/reposiciones/aprobacion-reposicion-corte/aprobacion-reposicion-corte.component';
import { AprobacionReposicionCalidadComponent } from './components/reposiciones/aprobacion-reposicion-calidad/aprobacion-reposicion-calidad.component';
import { GenerarDespachoComponent } from './components/reposiciones/generar-despacho/generar-despacho.component';
import { LecturaReposicionComponent } from './components/reposiciones/lectura-reposicion/lectura-reposicion.component';
import { PantallaReposicionesComponent } from './components/reposiciones/pantalla-reposiciones/pantalla-reposiciones.component';
import { RegistrarTransitoCosturaComponent } from './components/reposiciones/registrar-transito-costura/registrar-transito-costura.component';
import { RegistrarTransitoCorteComponent } from './components/reposiciones/registrar-transito-corte/registrar-transito-corte.component';
import { AlmacenTelasCorteComponent } from './components/reposiciones/almacen-telas-corte/almacen-telas-corte.component';
import { AprobacionCalidadCorteComponent } from './components/reposiciones/aprobacion-calidad-corte/aprobacion-calidad-corte.component';
import { AprobControlInternoComponent } from './components/reposiciones/aprob-control-interno/aprob-control-interno.component';
//import { LecturaRegistroQrComponent } from './components/lectura-registro-qr/lectura-registro-qr.component';
import { ModularInspeccionPrendaComponent } from './components/modular/modular-inspeccion-prenda/modular-inspeccion-prenda.component';
import { ModularInspeccionRecuperacionComponent } from './components/modular/modular-inspeccion-recuperacion/modular-inspeccion-recuperacion.component';
import { ModularAuditoriaModuloComponent } from './components/modular/modular-auditoria-modulo/modular-auditoria-modulo.component';
import { ModularAuditoriaSalidaComponent } from './components/modular/modular-auditoria-salida/modular-auditoria-salida.component';
import { ModularInspeccionHabilitadorComponent } from './components/modular/modular-inspeccion-habilitador/modular-inspeccion-habilitador.component';
import { ModularTicketHabilitadorComponent } from './components/modular/modular-ticket-habilitador/modular-ticket-habilitador.component';
import { ModularLiquidadorTransitoComponent } from './components/modular/modular-liquidador-transito/modular-liquidador-transito.component';
import { ModularMantInspectorasComponent } from './components/modular/modular-mant-inspectoras/modular-mant-inspectoras.component';
import { ModularInspeccionManualComponent } from './components/modular/modular-inspeccion-manual/modular-inspeccion-manual.component';
import { FormatosRhComponent } from './components/vacaciones/formatos-rh/formatos-rh.component';
import { ModularTicketRecuperacionComponent } from './components/modular/modular-ticket-recuperacion/modular-ticket-recuperacion.component';
import { ModalRecuperacionRecojoComponent } from './components/modular/modal-recuperacion-recojo/modal-recuperacion-recojo.component';
import { ModularDerivadosControlComponent } from './components/modular/modular-derivados-control/modular-derivados-control.component';
import { ModularDisgregarPrendaComponent } from './components/modular/modular-disgregar-prenda/modular-disgregar-prenda.component';
import { MantMaestroBolsaComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa.component';
import { MantMaestroBolsaItemComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item/mant-maestro-bolsa-item.component';
import { MantMaestroBolsaItemDetComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item-det/mant-maestro-bolsa-item-det.component';
import { LiberarOpComponent } from './components/confecciones/liberar-op/liberar-op.component';
import { ModularLiquidacionAdicionalComponent } from './components/modular/modular-liquidacion-adicional/modular-liquidacion-adicional.component';
import { HipocampoComponent } from './components/hipocampo/hipocampo.component';
import { AprobacionmuestraateComponent } from './components/aprobacionmuestraate/aprobacionmuestraate.component';

import { ModularLiberarPaqueteComponent } from './components/modular/modular-liberar-paquete/modular-liberar-paquete.component';
import { ModularReimpresionTicketComponent } from './components/modular/modular-reimpresion-ticket/modular-reimpresion-ticket.component';
import { ModularReporteInspeccionComponent } from './components/modular/modular-reporte-inspeccion/modular-reporte-inspeccion.component';
import { ModularReporteAuditoriaComponent } from './components/modular/modular-reporte-auditoria/modular-reporte-auditoria.component';

import { FabriccardComponent } from './components/fabriccard/fabriccard.component';
import { ArranquetejeduriaComponent } from './components/arranquetejeduria/arranquetejeduria.component';
import { MantLecturaTicketComponent } from './components/mant-lectura-ticket/mant-lectura-ticket.component';
import { MantenimientoJabaCocheComponent } from './components/seguridad/mantenimiento-jaba-coche/mantenimiento-jaba-coche.component';
import { ControlJabaCochesComponent } from './components/seguridad/control-jaba-coches/control-jaba-coches.component';
import { SeguridadControlJabaService } from './services/seguridad-control-jaba.service';
import { CtrlJabaServicioComponent } from './components/seguridad/ctrl-jaba-servicio/ctrl-jaba-servicio.component';
import { RegistroParaMaqTinto } from './components/registro-paramaq-tinto/registro-paramaq-tinto';
import { AuditoriaLineaExternaComponent } from './components/auditoria-externa/auditoria-linea-externa/auditoria-linea-externa.component';
import { AuditoriaFinalExternaComponent } from './components/auditoria-externa/auditoria-final-externa/auditoria-final-externa.component';
import { AuditoriaMedidaDetalleExtComponent } from './components/auditoria-externa/auditoria-hoja-media-ext/auditoria-medida-detalle-ext/auditoria-medida-detalle-ext.component';
import { AuditoriaHojaMediaExtComponent } from './components/auditoria-externa/auditoria-hoja-media-ext/auditoria-hoja-media-ext.component';
import { PartidasPendientesEstadoRefComponent } from './components/huachipa-acabados/partidas-pendientes-estadoref/partidas-pendientes-estadoref.component';
import { PackingJabaGuiaComponent } from './components/seguridad/seguridad-control-guia/packing-jaba-guia/packing-jaba-guia.component';
import { HistorialPackJabaComponent } from './components/seguridad/seguridad-control-guia/packing-jaba-guia/historial-pack-jaba/historial-pack-jaba.component';
import { SolicitudAgujasComponent } from './components/tejeduria/solicitud-agujas.component';
import { CalificacionRolloCalComponent } from './components/calificacion-rollo-cal/calificacion-rollo-cal.component';
import { ProduccionArtesListComponent } from './components/produccion-artes-list/produccion-artes-list.component';
import { DialogProduccionArtesCrearComponent } from './components/produccion-artes-list/dialog-produccion-artes-crear/dialog-produccion-artes-crear.component';
import { ProduccionInspeccionListComponent } from './components/produccion-inspeccion-list/produccion-inspeccion-list.component';
import { DialogProduccionInspeccionCrearComponent } from './components/produccion-inspeccion-list/dialog-produccion-inspeccion-crear/dialog-produccion-inspeccion-crear.component';
import { MantenimientoHoraComponent } from './components/mantenimiento-hora/mantenimiento-hora.component';
import { ModularReporteAuditoriaTicketComponent } from './components/modular/modular-reporte-auditoria-ticket/modular-reporte-auditoria-ticket.component';
import { ParticionRolloCalComponent } from './components/particion-rollo-cal/particion-rollo-cal.component';
import { LiquidacionAviosCosturaComponent } from './components/movimientos/liquidacion-avios-costura/liquidacion-avios-costura.component';
import { ModularReportesInspeccionDefectoPrendaComponent } from './components/modular/modular-reporte-inspeccion-defecto-prenda/modular-reporte-inspeccion-defecto-prenda.component';
import { RegistroCalidadOtComponent } from './components/registro-calidad-ot/registro-calidad-ot.component';
import { ModularReportesAuditoriaSalidaInspeccionComponent } from './components/modular/modular-reporte-auditoria-salida-inspeccion/modular-reporte-auditoria-salida-inspeccion.component';
import { ModularReportesAuditoriaProcesoInspeccionComponent } from './components/modular/modular-reporte-auditoria-proceso-inspeccion/modular-reporte-auditoria-proceso-inspeccion.component';
import { ProduccionInspeccionSalidaListComponent } from './components/produccion-inspeccion-salida-list/produccion-inspeccion-salida-list.component';
import { DialogProduccionInspeccionSalidaCrearComponent } from './components/produccion-inspeccion-salida-list/dialog-produccion-inspeccion-salida-crear/dialog-produccion-inspeccion-salida-crear.component';

import { ReversionAuditoriaFinalExternaComponent } from './components/auditoria-externa/reversion-auditoria-final-externa/reversion-auditoria-final-externa.component';
import { LiberarPartidaCalidadComponent } from './components/liberar-partida-calidad/liberar-partida-calidad.component';
import { ModularPaqueteParticionComponent } from './components/modular/modular-paquete-particion/modular-paquete-particion.component';
import { HojaIngenieriaOperacionListComponent } from './components/hoja-ingenieria-operacion-list/hoja-ingenieria-operacion-list.component';
import { ReporteBolsasArteComponent } from './components/reporte-bolsas-arte/reporte-bolsas-arte.component';
import { LecturaRolloExportacionComponent } from './components/lectura-rollo-exportacion/lectura-rollo-exportacion.component';
import { LecturaRolloDespachoComponent } from './components/lectura-rollo-despacho/lectura-rollo-despacho.component';
import { ReporteKardexJabasComponent } from './components/seguridad/reporte-kardex-jabas/reporte-kardex-jabas.component';
import { CheckListIngresoCosturaComponent } from './components/check-list-ingreso-costura/check-list-ingreso-costura.component'
import { ReporteJabasOpComponent } from './components/reporte-jabas-op/reporte-jabas-op.component';
import { ReporteAlmacenArteComponent } from './components/reporte-almacen-arte/reporte-almacen-arte.component';
import { AuditoriaIngresoCorteComponent } from './components/auditoria-corte/auditoria-ingreso-corte/auditoria-ingreso-corte.component';
import { AuditoriaProcesoCorteComponent } from './components/auditoria-corte/auditoria-proceso-corte/auditoria-proceso-corte.component';
import { AuditoriaFinalCorteComponent } from './components/auditoria-corte/auditoria-final-corte/auditoria-final-corte.component';
import { AuditoriaAcabadosComponent } from './components/auditoria-calidad/auditoria-acabados/auditoria-acabados.component';
import { AuditoriaAcabadosDetalleComponent } from './components/auditoria-calidad/auditoria-acabados/auditoria-acabados-detalle/auditoria-acabados-detalle.component';
import { ProdTejeRectilineoComponent } from './components/tejeduria/prod-teje-rectilineo';
import { ProdTejeRectilineoRegistroComponent } from './components/tejeduria/prod-teje-rectilineo-registro/prod-teje-rectilineo-registro';
import { DigitalizacionFichasComponent } from './components/digitalizacion-fichas/digitalizacion-fichas.component';
import { CapacidadesComponent } from './components/tintoreria/capacidades.component';
import { AuditoriaModuloAcabadoComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/auditoria-modulo-acabado.component';
import { AuditoriaVaporizadoAcabadoComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/auditoria-vaporizado-acabado.component';
import { RegistroFirmasAuditoriaComponent } from './components/auditoria-externa/registro-firmas-auditoria/registro-firmas-auditoria.component';
import { BusquedaRollosPartidaComponent } from './components/busqueda-rollos-partida/busqueda-rollos-partida.component';
import { LecturaQ2H4Component } from './components/lectura-q2-h4/lectura-q2-h4.component';
import { ProgramaEmpastadoComponent } from './components/estampado-digital/programa-empastado.component';

import { AuditoriaSalidaAcabadoComponent } from './components/auditoria-calidad/auditoria-salida-acabado/auditoria-salida-acabado.component';
import { AuditoriaEmpaqueAcabadoComponent } from './components/auditoria-calidad/auditoria-empaque-acabado/auditoria-empaque-acabado.component';
import { AuditoriaEmpaqueCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/auditoria-empaque-cajas.component';

import { AuditoriaHojaMoldeComponent } from './components/auditoria-calidad/auditoria-hoja-molde/auditoria-hoja-molde.component';
import { AuditoriaHojaMoldeFinalComponent } from './components/auditoria-calidad/auditoria-hoja-molde-final/auditoria-hoja-molde-final.component';

import { EncogimientoPrendaComponent } from './components/confecciones/encogimiento-prenda/encogimiento-prenda.component';

import { ProgramacionAuditoriaComponent } from './components/auditoria-calidad/programacion-auditoria/programacion-auditoria.component';
import { ProgramacionAuditoriaSeguimientoComponent } from './components/auditoria-calidad/programacion-auditoria-seguimiento/programacion-auditoria-seguimiento.component';

import { EstatusControlTenidoComponent } from './components/estatus-control-tenido/estatus-control-tenido.component';
import { CargaEstructuraTejidoComponent } from './components/tejeduria/carga-estructura-tejido/carga-estructura-tejido.component';
import { RegistroPartidaParihuelaComponent } from './components/registro-partida-parihuela/registro-partida-parihuela.component';
import { RealizarDespachoComponent } from './components/realizar-despacho/realizar-despacho.component';
//import { QuejasReclamosv2Component } from './components/quejas-reclamosv2/quejas-reclamosv2.component';
import { QuejasReclamosComponent } from './components/quejas-reclamos/quejas-reclamos.component'; // version 1
import { CalificacionRollosProcesoComponent } from './components/calificacion-rollos-proceso/calificacion-rollos-proceso.component';
import { LecturaRollosEmbalajeComponent } from './components/lectura-rollos-embalaje/lectura-rollos-embalaje.component';
import { ArranquetejeduriaVersionHistComponent } from './components/arranquetejeduria-version-hist/arranquetejeduria-version-hist.component';
import { CnfRegistroColgadoresComponent } from './components/cnf-registro-colgadores/cnf-registro-colgadores.component';
import { CnfRegistroUbicacionesComponent } from './components/cnf-registro-ubicaciones/cnf-registro-ubicaciones.component';
import { CnfRegistroPresentacionComponent } from './components/cnf-registro-presentacion/cnf-registro-presentacion.component';
import { CnfRegistroColgadoresIngresoComponent } from './components/cnf-registro-colgadores-ingreso/cnf-registro-colgadores-ingreso.component';
import { CnfRegistroColgadoresIngresoDetalleComponent } from './components/cnf-registro-colgadores-ingreso/cnf-registro-colgadores-ingreso-detalle/cnf-registro-colgadores-ingreso-detalle.component';
import { CnfReubicacionColgadoresComponent } from './components/cnf-registro-colgadores-ingreso/cnf-reubicacion-colgadores/cnf-reubicacion-colgadores.component';
import { CnfReubicacionCajasComponent } from './components/cnf-registro-colgadores-ingreso/cnf-reubicacion-cajas/cnf-reubicacion-cajas.component';
import { CalificacionRollosFinalComponent } from './components/calificacion-rollos-final/calificacion-rollos-final.component';
import { LecturaRergistroQreComponent } from './components/lectura-rergistro-qre/lectura-rergistro-qre.component';
//Eventos
import { RegistroFirmasComponent } from './components/eventos/registro-firmas/registro-firmas.component';
import { RegistroEventosComponent } from './components/eventos/registro-eventos/registro-eventos.component';
import { EntregaEventosComponent } from './components/eventos/entrega-eventos/entrega-eventos.component';

import { RegistroRondasComponent } from './components/seguridad/registro-rondas/registro-rondas.component';
import { MemorandumGralComponent } from './components/memorandum-gral/memorandum-gral.component';
import { ComiteEmergenciaComponent } from './components/actas/comite-emergencia/comite-emergencia.component';

import { ValidaCorteDespachoComponent } from './components/auditoria-corte/valida-corte-despacho/valida-corte-despacho.component';
import { LiberaOpColorComponent } from './components/auditoria-corte/libera-op-color/libera-op-color.component';
import { SalidaTiendaComponent } from './components/seguridad/salida-tienda/salida-tienda.component';

const routes: Routes = [
  { path: "root", component: AppComponent },
  { path: "principal", component: PrincipalComponent },
  { path: "menu", component: MenuComponent },

  { path: "AuditoriaLineaCostura", component: AuditoriaLineaCosturaComponent },
  { path: "ReportesInspeccionPrenda", component: ReportesInspeccionPrendaComponent },
  { path: "ReporteInspeccionAuditoria", component: ReporteInspeccionAuditoriaComponent },
  { path: "AuditoriaAcabados", component: AuditoriaAcabadosComponent },
  { path: "AuditoriaAcabadosDetalle", component: AuditoriaAcabadosDetalleComponent },
  { path: "AuditoriaModuloAcabados", component: AuditoriaModuloAcabadoComponent },
  { path: "AuditoriaVaporizadoAcabados", component: AuditoriaVaporizadoAcabadoComponent },
  { path: "AuditoriaSalidaAcabados", component: AuditoriaSalidaAcabadoComponent },
  { path: "AuditoriaEmpaqueAcabados", component: AuditoriaEmpaqueAcabadoComponent },
  { path: "AuditoriaEmpaqueCajas", component: AuditoriaEmpaqueCajasComponent },

  { path: "SeguridadControlGuia", component: SeguridadControlGuiaComponent },
  { path: "SeguridadControlGuiaAccion", component: SeguridadControlGuiaAccionComponent },
  { path: "SeguridadControlGuiaSalida", component: SeguridadControlGuiaSalidaComponent },
  { path: "SeguridadControlGuiaInterno", component: SeguridadControlGuiaInternoComponent },
  { path: "SeguridadControlGuiaExterno", component: SeguridadControlGuiaExternoComponent },
  { path: "SeguridadControlMemorandum", component: SeguridadControlMemorandumComponent },
  { path: "SeguridadControlMemorandumDetalle", component: SeguridadControlMemorandumDetalleComponent },
  { path: "SeguridadControlGuiaHistorial", component: SeguridadControlGuiaHistorialComponent },

  { path: "DespachoTelaCruda", component: DespachoTelaCrudaComponent },
  { path: "DespachoTelaCrudaDetalle", component: DespachoTelaCrudaDetalleComponent},

  { path: "SeguridadControlVehiculo", component: SeguridadControlVehiculoComponent},
  { path: "SeguridadControlVehiculoAccion", component: SeguridadControlVehiculoAccionComponent},
  { path: "SeguridadControlVehiculoIngreso", component: SeguridadControlVehiculoIngresoComponent},
  { path: "SeguridadControlVehiculoSalida", component: SeguridadControlVehiculoSalidaComponent},
  { path: "SeguridadControlVehiculoHistorial", component: SeguridadControlVehiculoHistorialComponent},
  { path: "SeguridadControlVehiculoRegistroVehiculo", component: SeguridadControlVehiculoRegistroVehiculoComponent},
  { path: "SeguridadControlVehiculoRegistroConductor", component: SeguridadControlVehiculoRegistroConductorComponent},
  { path: "SeguridadControlVehiculoReporte", component: SeguridadControlVehiculoReporteComponent},
  { path: "ConsultaRequisitoria", component: ConsultaRequisitoriaComponent},
  { path: "SeguridadControlJabas", component: SeguridadControlJabasComponent},
  { path: "SeguridadControlJabaAccion", component:  SeguridadControlJabasAccionComponent},
  { path: "SeguridadControlJabaSalida", component:  SeguridadControlJabasSalidaComponent},
  { path: "SeguridadControlJabaInterno", component: SeguridadControlJabasInternoComponent},
  { path: "SeguridadControlJabaExterno", component: SeguridadControlJabasExternoComponent},
  { path: "SeguridadControlJabaHistorial", component: SeguridadControlJabasHistorialComponent},

  { path: "DefectosAlamacenDerivados", component:DefectosAlmacenDerivadosComponent},
  { path: "ReporteDefectosAlmacenDerivados", component:ReporteDefectosAlmacenDerivadosComponent},
  { path: "ReporteDefectosTotalesDerivados", component:ReporteDefectosTotalesDerivadosComponent},
  { path: "AuditoriaDefectoDerivado", component: AuditoriaDefectoDerivadoComponent},

  { path: "MovimientoInspeccion" , component:MovimientoInspeccionComponent},
  { path: "AuditoriaInspeccionCostura", component: AuditoriaInspeccionCosturaComponent},

  { path: "IngresoRolloTejido", component: IngresoRolloTejidoComponent},
  { path: "IngresoRolloTejidoDetalle", component: IngresoRolloTejidoDetalleComponent},

  { path: "AuditoriaHojaMedida", component: AuditoriaHojaMedidaComponent},
  { path: "AuditoriaHojaMedidaDetalle", component: AuditoriaHojaMedidaDetalleComponent},
  { path: "AuditoriaHojaMedidaDetalleInsp", component: AuditoriaHojaMedidaDetalleInspComponent},

  { path: "SeguridadControlJaba", component: SeguridadControlJabaComponent},
  { path: "RegistrarSeguridadControlJaba", component: RegistrarSeguridadControlJabaComponent},
  { path: "RegistrarDetalleSeguridadControlJaba", component: RegistrarDetalleSeguridadControlJabaComponent},
  { path: "SeguridadControlMovimientosJabas", component: SeguridadControlMovimientosJabasComponent},
  { path: "SeguridadControlMovimientosJabasAccion", component: SeguridadControlMovimientosJabasAccionComponent},

  { path: "GiradoPartidaIncompleta", component: DespachoOpIncompletaComponent},
  { path: "ControlActivoFijo", component: ControlActivoFijoComponent},

  { path: "ComiteEmergencia", component: ComiteEmergenciaComponent},

  {path: "InspeccionPrenda", component: InspeccionPrendaComponent},
  {path: "InspeccionLecturaDerivados", component: InspeccionLecturaDerivadosComponent},
  {path: "AuditoriainspeccionPrenda", component: ReinspeccionPrendaComponent},
  {path: "InspeccionPrendaHabilitador", component: InspeccionPrendaHabilitadorComponent},
  {path: "DerivadoInspeccionPrenda", component: DerivadoInspeccionPrendaComponent},
  {path: "InspeccionPrendaLiberacionPaquete", component: InspeccionLiberacionPaqueteComponent},

  { path: "PermitirGiradoOp", component: PermitirGiradoOpComponent},
  { path: "ConfeccionesAperturaTextil", component: ConfeccionesAperturaTextilComponent},
  { path: "ver-avances", component: VerAvancesComponent},
  { path: "ver-ratio-consumo", component: VerRatioConsumoComponent},

  { path: "SaldoDevolver", component: SaldoDevolverComponent},
  { path: "SaldoDevolverIndicador", component: SaldoDevolverIndicadorComponent},
  { path: "liquidacionesPendientes", component: LiquidacionPendientesComponent},
  { path: "FormatoCheckList", component: FormatoCheckListComponent},
  { path: "AuditoriaMedida", component: AuditoriaHojaMedidaInspComponent},
  { path: "ProduccionArtesList", component: ProduccionArtesListComponent},
  { path: "DialogProduccionArtesCrear", component: DialogProduccionArtesCrearComponent},
  { path: "ProduccionInspeccionList", component: ProduccionInspeccionListComponent},
  { path: "DialogProduccionInspeccionCrear", component: DialogProduccionInspeccionCrearComponent},
  { path: "ProduccionInspeccionSalidaList", component: ProduccionInspeccionSalidaListComponent},
  { path: "DialogProduccionInspeccionSalidaCrear", component: DialogProduccionInspeccionSalidaCrearComponent},

  { path: "SeguridadActivoFijoReporte", component: SeguridadActivoFijoReporteComponent},
  { path: "TiemposImproductivos", component: TiemposImproductivosComponent},
  //{ path: "TiemposImproductivosv2", component: TiemposImproductivosv2Component},
  { path: "DialogTiemposImproductivos", component: DialogTiemposImproductivosComponent},
  { path: "DialogModificaTiemposImproductivos", component: DialogModificaTiemposImproductivosComponent},
  { path: "DialogModificaTelas", component: DialogModificaTelasComponent},

  { path: "eficienciaMaquinaTurno", component: EficienciaMaquinaTurnoComponent},
  { path: "LiquidacionCorte", component: LiquidacionCorteComponent},
  { path: "RegistrarPermisos", component: RegistrarPermisosComponent},
  { path: "TiposPermisos" ,component:TiposPermisosComponent},
  { path: 'LecturaPermisos', component: SeleccionarSedeComponent},
  { path: 'ReporteLecturaPermisos', component: ReporteLecturaPermisosComponent},
  { path: 'LecturaPermisosAccion', component: LecturaPermisosComponent},
  { path: 'LecturaRefrigerioAccion', component: LecturaRefrigerioComponent},
  { path: 'LecturaComisionesAccion', component: LecturaComisionesComponent},
  { path: 'SeleccionarSedeAccion', component: SeleccionarSedeAccionComponent},
  { path: 'SeguimientoOrdenesAtencion', component: SeguimientoOrdenesAtencionComponent},
  { path: "FormPermisos" ,component:FormPermisosComponent},
  { path: "FormPermisoDia" ,component:FormPermisoDiaComponent},

  { path: "FormAprobacionPermisos" ,component:FormAprobacionPermisosComponent},
  { path: "FormTrabajadoresPermisos" ,component:FormTrabajadoresPermisosComponent},

  { path: "DialogIngresoEmpleado",component:DialogIngresoEmpleadoComponent},
  { path: "DialogIngresoEmpleadoComision",component:DialogIngresoEmpleadoComisionComponent},
  { path: "DialogIngresoEmpleadorefrigerio",component:DialogIngresoEmpleadorefrigerioComponent},
  { path: "AsignarAreasUsuariosPermisos",component: AsignarAreasUsuariosPermisosComponent},
  { path: "OperatividadFichaMuestreo",component: OperatividadFichaTecnicaComponent},
  { path: "DetallesOperatividadFicha",component: DetallesOperatividadFichaComponent},

  { path: "Memoddt",component: MemoddtComponent},

  { path: "rolesUsuarioWeb",component: RolesUsuarioWebComponent},
  { path: "asignarRolesUsuario",component: AsignarRolesUsuarioComponent},

  { path: "FormComisiones",component:FormComisionesComponent},
  { path: "FormRefrigerio",component:FormRefrigerioComponent},

  { path: "ProgramacionVacaciones",component:ProgramacionVacacionesComponent},
  { path: "historial-vacaciones",component:HistorialVacacionesComponent},

  { path: "RProgramacionVacaciones",component:RecursosProgramacionVacacionesComponent},
  { path: "Rhistorial-vacaciones",component:HistorialVacacionesRecursosComponent},
  { path: "formatosRh",component:FormatosRhComponent},

  { path: "ClaseActivos",component:ClaseActivosComponent},
  { path: "ColorActivos",component:ColorActivosComponent},
  { path: "ControlActivosFijo",component:ControlActivosFijoComponent},
  { path: "ActualizarActivosFijo",component:ActualizarActivoFijoComponent},
  { path: "HistorialActivosFijos",component:HistorialControlActivosComponent},

  { path: "RegistroMerma",component:RegistroMermaComponent},
  { path: "ControlMerma",component:ControlMermaComponent},
  { path: "AgregarRegistroMerma",component:AgregarRegistroMermaComponent},
  { path: "ActualizarControlMerma",component:ActualizarControlInternoComponent},

  { path: "ActasAcuerdo",component:ActasAcuerdoComponent},
  { path: "CrearActasAcuerdo",component:CrearNuevoActaComponent},
  { path: "CrearParticipantesActas",component:CrearParticipantesActaComponent},

  //COMERCIAL
  {path: "CargaFotosEstilo",component:ComercialCargaImagenesComponent},
  {path: "GrupoTextilImagenes",component:ComercialImgHuachipaComponent},
  {path: "AprobacionMuestraAte",component:AprobacionmuestraateComponent},
  {path: "ValidaCorteDespacho",component:ValidaCorteDespachoComponent},
  {path: "LiberaOPColor",component:LiberaOpColorComponent},

  //huachipa
  {path:'proceso1', component:TelasComponent},
  {path:'reprocesopartida', component:ReprocesoPartidaComponent},
  {path:'ubicacionalmacenhilos', component:UbicacionHilosAlmacenComponent},
  {path:'lecturaubicacionbultos', component:LecturaBultosAlmacenComponent},
  {path:'mantemaquinastej', component: RegistroManteMaquinasHilosComponent},
  {path:'calidadtejeduria', component: RegistroCalidadTejeduriaComponent},
  {path:'guiacontingencia', component: GuiaContingenciaComponent},
  {path: 'hipocampo',component:HipocampoComponent},
  {path: 'fabriccard',component:FabriccardComponent},
  {path: 'arranquetejeduria',component:ArranquetejeduriaComponent},
  {path: 'regparamaqtinto',component:RegistroParaMaqTinto},
  {path: 'pendestref',component:PartidasPendientesEstadoRefComponent},
  {path: 'CalificacionRolloCalidad',component:CalificacionRolloCalComponent},
  {path: "solicitudagujas", component:SolicitudAgujasComponent},
  {path: "particionrollos", component:ParticionRolloCalComponent},
  {path: "registrocalidadot", component:RegistroCalidadOtComponent},
  {path: "liberarpartidacalidad", component:LiberarPartidaCalidadComponent},
  {path: "lecturarolloexportacion", component:LecturaRolloDespachoComponent},
  {path: "ProdTejeRectilineo", component:ProdTejeRectilineoComponent},
  {path: "ProdTejeRectilineoRegistro", component:ProdTejeRectilineoRegistroComponent},
  {path: "Capacidades", component:CapacidadesComponent},
  {path: "rollospartida", component:BusquedaRollosPartidaComponent},

  //Cortes Encogimiento EIQ
  {path:"CortesEncogimiento",component:CortesEncogimientoComponent},
  {path:"RegistroPartidas",component:RegistroPartidaParihuelaComponent},
  {path:"RealizarDespacho",component:RealizarDespachoComponent},
  //{path:"QuejasReclamos",component:QuejasReclamosv2Component}, // version 2
  {path:"QuejasReclamos",component:QuejasReclamosComponent}, // version 1
  {path:"CalificacionRollosEnProceso",component:CalificacionRollosProcesoComponent},
  {path:"LecturaRolloEmbalaje",component:LecturaRollosEmbalajeComponent},
  {path:"CalificacionRollosFinal",component:CalificacionRollosFinalComponent},
  //{path:"lecturaregistroqr",component:LecturaRergistroQreComponent},

  //Movimientos
  {path: "lecturaq2h4", component:LecturaQ2H4Component},

  //Estampado Digital
  {path:'ProgramaEmpastado', component:ProgramaEmpastadoComponent},

  //mantenimiento general web - rol- opciones- usuarios
  { path: 'MantenimientoWeb', component: MantenimientoWebComponent},
  { path: 'AccesosUsuarios', component: AccesosUsuariosComponent},
  { path: 'ActivarSalida', component: ActivarSalidaComponent},
  { path: 'ValidarSalida', component: ValidarSalidaComponent},

 //dashboard estilos por liquidar
 { path: 'EstilosLiquidar', component: EstilosLiquidarComponent},

 //mantenimiento jabas
 { path: 'MantenimientoJabas', component: MantenimientoJabasComponent},

 //laboratorio
 {path:'lecturarecetas', component:LaboratorioLecturaRecetasComponent},

 //Seguimiento de toberas
 {path:'seguimientotobera', component:SeguimientoToberaComponent},

  //SEGURIDAD
  {path:'gestionVisitas', component:GestionVisitasComponent},
  {path:'reporteVisitas', component:ReporteVisitasComponent},
  {path:'seleccionarTipoVisita', component:SeleccionarTipoVisitaComponent},
  {path:'registroRondas', component:RegistroRondasComponent},
  {path:'crearVisita', component:CrearVisitaComponent},
  {path:'consultaVisita', component:ConsultaVisitaComponent},
  {path:'reporteKardexJabas', component:ReporteKardexJabasComponent},
  {path:'SalidaTienda', component:SalidaTiendaComponent},

  //COMEDOR
  { path: 'MantenimientoCorreos', component: MantenimientosCorreosComponent},
  { path: 'mantenimiento-preguntas-det', component: MantenimientoPreguntasDetComponent },
  { path: 'comedor-encuesta', component: ComedorEncuestaUsuarioComponent},
  { path: 'reporteComedorEncuesta', component: ReporteEncuestaComponent},
  { path: 'bonosSeguridad', component: SeguridadRecalcularBonosComponent},

  //REPOSICIONES
  { path: 'historialReposicion', component: HistorialReposicionComponent},
  { path: 'aprobacionReposicion', component: AprobacionReposicionComponent},
  { path: 'aprobacionCalidad', component: AprobacionReposicionCalidadComponent},
  { path: 'aprobacionCorte', component: AprobacionReposicionCorteComponent},
  { path: 'generarDespacho', component: GenerarDespachoComponent},
  { path: 'lecturaReposiciones', component: LecturaReposicionComponent},
  { path: 'pantallaReposiciones', component: PantallaReposicionesComponent},
  { path: 'registroTransitoCostura', component: RegistrarTransitoCosturaComponent},
  { path: 'registroTransitoCorte', component: RegistrarTransitoCorteComponent},
  { path: 'registroAlmacenTelas', component: AlmacenTelasCorteComponent},
  { path: 'aprobacionCalidadCorte', component: AprobacionCalidadCorteComponent},
  { path: 'resposicionControlInterno', component: AprobControlInternoComponent},

  //MODULAR
  { path: 'modularInspeccionPrenda', component: ModularInspeccionPrendaComponent },
  { path: 'modularInspeccionRecuperacion', component: ModularInspeccionRecuperacionComponent },
  { path: 'modularAuditoriaModulo', component: ModularAuditoriaModuloComponent },
  { path: 'modularAuditoriaSalida', component: ModularAuditoriaSalidaComponent },
  { path: 'modularInspeccionHabilitador', component: ModularInspeccionHabilitadorComponent },
  { path: 'modularInspeccionTicket', component: ModularTicketHabilitadorComponent },
  { path: 'modularLiquidadorTransito', component: ModularLiquidadorTransitoComponent },
  { path: 'modularLiquidarAdicional', component: ModularLiquidacionAdicionalComponent },

  { path: 'modularMantInspectoras', component: ModularMantInspectorasComponent },
  { path: 'modularInspManual', component: ModularInspeccionManualComponent },
  { path: 'modularRecuperacionHabilitador', component: ModularTicketRecuperacionComponent },
  { path: 'recuperarcionPrendaHabilt', component: ModalRecuperacionRecojoComponent },
  { path: 'modularControlDerivado', component: ModularDerivadosControlComponent },
  { path: 'modularDisgregarPrenda', component: ModularDisgregarPrendaComponent },
  { path: 'reporteModularInspeccion', component: ModularReporteInspeccionComponent },
  { path: 'reporteModularAuditoria', component: ModularReporteAuditoriaComponent },
  { path: 'reporteModularAuditoriaTicket', component: ModularReporteAuditoriaTicketComponent },
  { path: 'reporteModularInspeccionDefectos', component: ModularReportesInspeccionDefectoPrendaComponent },
  { path: 'reporteModularSalidaInspeccion', component: ModularReportesAuditoriaSalidaInspeccionComponent },
  { path: 'reporteModularProcesoInspeccion', component: ModularReportesAuditoriaProcesoInspeccionComponent },
  { path: 'particionPaqueteModular', component: ModularPaqueteParticionComponent },
  { path: 'hojaIngenieriaList', component: HojaIngenieriaOperacionListComponent },
  { path: 'reporteBolsasArte', component: ReporteBolsasArteComponent },

  //BOLSA - PROYECTO ARTES
  {path:"MantMaestroBolsa", component: MantMaestroBolsaComponent },
  {path:"MantMaestroBolsaItem", component: MantMaestroBolsaItemComponent },
  {path:"MantMaestroBolsaItem", component: MantMaestroBolsaItemComponent },
  {path:"MantMaestroBolsaItemDet", component: MantMaestroBolsaItemDetComponent },
  {path:"LiberarPaqueteMod", component: ModularLiberarPaqueteComponent },
  {path:"ReimpresionModular", component: ModularReimpresionTicketComponent },
  {path:"mantlecturaticket", component: MantLecturaTicketComponent },
  {path:"reporteBarraOp", component: ReporteJabasOpComponent },
  {path:"reporteAlmacenArte", component: ReporteAlmacenArteComponent },

  //JABAS - COCHES
  { path:"mantenimiento-jabas-coches", component: MantenimientoJabaCocheComponent },
  { path:"controlJabasCoches", component: ControlJabaCochesComponent  },
  { path:"controlJabaServicio", component: CtrlJabaServicioComponent },
  { path:"packingControlJaba", component: PackingJabaGuiaComponent },
  { path:"historialPackingJaba", component: HistorialPackJabaComponent },

  //AUDITORIA LINEA EXTERNA
  { path:"auditoriaLineaExterna", component: AuditoriaLineaExternaComponent },
  { path:"auditoriaFInalExterno", component: AuditoriaFinalExternaComponent },
  { path:"reversionAuditoriaFInalExterna", component: ReversionAuditoriaFinalExternaComponent },

  { path:"auditoriaMedidaServicios", component: AuditoriaHojaMediaExtComponent },
  { path:"AuditoriaHojaMedidaDetalleExt", component: AuditoriaMedidaDetalleExtComponent },

  { path:"RegistroFirmasAuditoria", component: RegistroFirmasAuditoriaComponent},

  //MANTENIMIENTO HORA
  { path:"MantenimientoHora", component: MantenimientoHoraComponent },
  { path:"liquidacionAviosCostura", component: LiquidacionAviosCosturaComponent },

  //AUDITORIA CORTE
  { path:"AuditoriaIngresoCorte", component: AuditoriaIngresoCorteComponent },
  { path:"AuditoriaProcesoCorte", component: AuditoriaProcesoCorteComponent },
  { path:"AuditoriaFinalCorte", component: AuditoriaFinalCorteComponent },

  //AUDITORIA MOLDES
  { path:"HojaMedidaMolde", component: AuditoriaHojaMoldeComponent },
  { path:"HojaMedidaMoldeFinal", component: AuditoriaHojaMoldeFinalComponent },
  { path:"EncogimientoPrenda", component: EncogimientoPrendaComponent},

  // PROGRAMACION AUDITORIAS
  { path:"ProgramarAuditoria/:id", component: ProgramacionAuditoriaComponent },
  { path:"SeguimientoAuditoria", component: ProgramacionAuditoriaSeguimientoComponent },
  { path:"DigitalizacionFichas", component: DigitalizacionFichasComponent },

  //EVENTOS
  { path:"RegistroFirmaEventos", component: RegistroFirmasComponent },
  { path:"RegistroEventos", component: RegistroEventosComponent },
  { path:"LecturaEntregaEventos", component: EntregaEventosComponent},

  //ESTATUS CONTROL TEÑIDO - 03122024 - HMEDINA
  { path: "EstatusControlTenido", component: EstatusControlTenidoComponent },

  //CARGA  DE ESTRUCTURA DE TEJIDO RECTILINIUOS - 06022025 - HMEDINA
  { path: "CargaEstructuraTejido", component: CargaEstructuraTejidoComponent },

  //LISTADO DE HISTORIAL DE ARRANQUE DE TEJEDURIA
  { path: "ArranquetejeduriaVersionHist", component: ArranquetejeduriaVersionHistComponent },

  //COLGADORES
  { path: "CnfRegistroColgadores", component: CnfRegistroColgadoresComponent },
  { path: "CnfRegistroUbicaciones", component: CnfRegistroUbicacionesComponent },
  { path: "CnfRegistroPresentacion", component: CnfRegistroPresentacionComponent },
  { path: "CnfRegistroColgadoresIngreso", component: CnfRegistroColgadoresIngresoComponent },
  { path: "CnfRegistroColgadoresIngresoDetalle", component: CnfRegistroColgadoresIngresoDetalleComponent },
  { path: "CnfReubicacionColgadores", component: CnfReubicacionColgadoresComponent },
  { path: "CnfReubicacionCajas", component: CnfReubicacionCajasComponent },

  //MEMORANDUM GRAL
  { path: "MemorandumGral", component: MemorandumGralComponent },

  //LIBERAR OP TENDIDO
  { path: 'liberacionOP', component: LiberarOpComponent },
  { path:"checkListIngresoCostura", component: CheckListIngresoCosturaComponent },
  { path: "", redirectTo: "/", pathMatch: "full" },// Cuando es la raíz
  //{ path: "**", component: AuditoriaLineaCosturaComponent }
  { path: "**", redirectTo: "/principal" }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routing = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });

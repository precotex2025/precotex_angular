import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

import { MaterialModule } from '../app/material.module';
import { MenuComponent } from './components/menu/menu.component';
import { AuditoriaLineaCosturaComponent } from './components/auditoria-calidad/auditoria-linea-costura/auditoria-linea-costura.component';
import { PrincipalComponent } from './components/principal/principal.component'
import { FilterByValuePipe } from './pipes/filter-by-value.pipe';

import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MY_DATE_FORMATS } from '../app/my-date-formats';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SeguridadControlGuiaComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia.component';
import { SeguridadControlGuiaSalidaComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-salida/seguridad-control-guia-salida.component';
import { SeguridadControlGuiaAccionComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-accion/seguridad-control-guia-accion.component';
import { SeguridadControlGuiaInternoComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-interno/seguridad-control-guia-interno.component';
import { SeguridadControlGuiaExternoComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-externo/seguridad-control-guia-externo.component';
import { SeguridadControlGuiaHistorialComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-historial/seguridad-control-guia-historial.component';
import { DespachoTelaCrudaComponent } from './components/despacho-tela-cruda/despacho-tela-cruda.component';
import { TextMaskModule } from 'angular2-text-mask';
import { DespachoTelaCrudaDetalleComponent } from './components/despacho-tela-cruda/despacho-tela-cruda-detalle/despacho-tela-cruda-detalle.component';
import { SeguridadControlMemorandumComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-memorandum/seguridad-control-memorandum.component';
import { SeguridadControlMemorandumDetalleComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-memorandum/seguridad-control-memorandum-detalle/seguridad-control-memorandum-detalle.component';
import { SeguridadControlVehiculoComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo.component';
import { SeguridadControlVehiculoAccionComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-accion/seguridad-control-vehiculo-accion.component';
import { SeguridadControlVehiculoIngresoComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-ingreso/seguridad-control-vehiculo-ingreso.component';
import { SeguridadControlVehiculoHistorialComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-historial/seguridad-control-vehiculo-historial.component';
import { SeguridadControlVehiculoSalidaComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-salida/seguridad-control-vehiculo-salida.component';
import { SeguridadControlJabasComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas.component';
import { SeguridadControlJabasAccionComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-accion/seguridad-control-jabas-accion.component';
import { SeguridadControlJabasSalidaComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-salida/seguridad-control-jabas-salida.component';
import { SeguridadControlJabasExternoComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-externo/seguridad-control-jabas-externo.component';
import { SeguridadControlJabasInternoComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-interno/seguridad-control-jabas-interno.component';
import { DialogJabaComponent } from './components/seguridad/seguridad-control-jabas/dialog-jaba/dialog-jaba.component';
import { SeguridadControlJabasHistorialComponent } from './components/seguridad/seguridad-control-jabas/seguridad-control-jabas-historial/seguridad-control-jabas-historial.component';
import { DefectosAlmacenDerivadosComponent } from './components/auditoria-calidad/defectos-almacen-derivados/defectos-almacen-derivados.component';
import { DialogDerivadosComponent } from './components/auditoria-calidad/defectos-almacen-derivados/dialog-almacen-derivado/dialog-derivados/dialog-derivados.component';

import { DialogEliminarComponent } from './components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { DialogDerivadosModificarComponent } from './components/auditoria-calidad/defectos-almacen-derivados/dialog-almacen-derivado/dialog-derivados-modificar/dialog-derivados-modificar.component';
import { SeguridadControlVehiculoRegistroVehiculoComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-registro-vehiculo/seguridad-control-vehiculo-registro-vehiculo.component';
import { SeguridadControlVehiculoRegistroConductorComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-registro-conductor/seguridad-control-vehiculo-registro-conductor.component';
import { DialogVehiculoRegistrarComponent } from './components/seguridad/seguridad-control-vehiculo/dialog-vehiculo/dialog-vehiculo-registrar/dialog-vehiculo-registrar.component';
import { ReporteDefectosAlmacenDerivadosComponent } from './components/auditoria-calidad/defectos-almacen-derivados/reporte-almacen-derivado/reporte-defectos-almacen-derivados/reporte-defectos-almacen-derivados.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { DialogConfirmacionComponent } from './components/dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { DialogVehiculoRegistrarVehiculoComponent } from './components/seguridad/seguridad-control-vehiculo/dialog-vehiculo/dialog-vehiculo-registrar-vehiculo/dialog-vehiculo-registrar-vehiculo.component';
import { DialogDerivadosTotalComponent } from './components/auditoria-calidad/defectos-almacen-derivados/dialog-almacen-derivado/dialog-derivados-total/dialog-derivados-total.component';
import { MovimientoInspeccionComponent } from './components/inspeccion/movimiento-inspeccion/movimiento-inspeccion.component';
import { ReporteDefectosTotalesDerivadosComponent } from './components/auditoria-calidad/defectos-almacen-derivados/reporte-almacen-derivado/reporte-defectos-totales-derivados/reporte-defectos-totales-derivados.component';
import { DialogDerivadosObservacionComponent } from './components/auditoria-calidad/defectos-almacen-derivados/dialog-almacen-derivado/dialog-derivados-observacion/dialog-derivados-observacion.component';
import { DialogDerivadosReportexdiaComponent } from './components/auditoria-calidad/defectos-almacen-derivados/dialog-almacen-derivado/dialog-derivados-reportexdia/dialog-derivados-reportexdia.component';
import { AuditoriaInspeccionCosturaComponent } from './components/auditoria-calidad/auditoria-inspeccion-costura/auditoria-inspeccion-costura.component';
import { DialogRegistrarCabeceraComponent } from './components/auditoria-calidad/auditoria-inspeccion-costura/dialog-auditoria-inspeccion-costura/dialog-registrar-cabecera/dialog-registrar-cabecera.component';
import { DialogRegistrarDetalleComponent } from './components/auditoria-calidad/auditoria-inspeccion-costura/dialog-auditoria-inspeccion-costura/dialog-registrar-detalle/dialog-registrar-detalle.component';
import { DialogListaDetalleComponent } from './components/auditoria-calidad/auditoria-inspeccion-costura/dialog-auditoria-inspeccion-costura/dialog-lista-detalle/dialog-lista-detalle.component';
import { AuditoriaDefectoDerivadoComponent } from './components/auditoria-calidad/auditoria-defecto-derivado/auditoria-defecto-derivado.component';
import { DialogListaSubDetalleComponent } from './components/auditoria-calidad/auditoria-inspeccion-costura/dialog-auditoria-inspeccion-costura/dialog-lista-sub-detalle/dialog-lista-sub-detalle.component';
import { DialogRegistrarSubDetalleComponent } from './components/auditoria-calidad/auditoria-inspeccion-costura/dialog-auditoria-inspeccion-costura/dialog-registrar-sub-detalle/dialog-registrar-sub-detalle.component';
import { SeguridadControlVehiculoReporteComponent } from './components/seguridad/seguridad-control-vehiculo/seguridad-control-vehiculo-reporte/seguridad-control-vehiculo-reporte.component';
import { IngresoRolloTejidoComponent } from './components/ingreso-rollo-tejido/ingreso-rollo-tejido.component';
import { IngresoRolloTejidoDetalleComponent } from './components/ingreso-rollo-tejido/ingreso-rollo-tejido-detalle/ingreso-rollo-tejido-detalle.component';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { AuditoriaHojaMedidaComponent } from './components/auditoria-calidad/auditoria-hoja-medida/auditoria-hoja-medida.component';
import { AuditoriaHojaMedidaDetalleComponent } from './components/auditoria-calidad/auditoria-hoja-medida/auditoria-hoja-medida-detalle/auditoria-hoja-medida-detalle.component';
import { SeguridadControlJabaComponent } from './components/seguridad/seguridad-control-jaba/seguridad-control-jaba.component';
import { DialogRegistrarCabeceraJabaComponent} from './components/seguridad/seguridad-control-jaba/dialog-seguridad-control-jaba/dialog-registrar-cabecera-jaba/dialog-registrar-cabecera-jaba.component';
import { RegistrarSeguridadControlJabaComponent } from './components/seguridad/seguridad-control-jaba/registrar-seguridad-control-jaba/registrar-seguridad-control-jaba.component';
import { RegistrarDetalleSeguridadControlJabaComponent } from './components/seguridad/seguridad-control-jaba/registrar-detalle-seguridad-control-jaba/registrar-detalle-seguridad-control-jaba.component';
import { DialogColorRegistrarDetalleComponent } from './components/seguridad/seguridad-control-jaba/dialog-seguridad-control-jaba/dialog-color-registrar-detalle/dialog-color-registrar-detalle.component';
import { DialogTallaRegistrarDetalleComponent } from './components/seguridad/seguridad-control-jaba/dialog-seguridad-control-jaba/dialog-talla-registrar-detalle/dialog-talla-registrar-detalle.component';
import { DialogCantidadRegistrarDetalleComponent } from './components/seguridad/seguridad-control-jaba/dialog-seguridad-control-jaba/dialog-cantidad-registrar-detalle/dialog-cantidad-registrar-detalle.component';
import { DialogAdicionalComponent } from './components/dialogs/dialog-adicional/dialog-adicional.component';
import { SeguridadControlMovimientosJabasComponent } from './components/seguridad/seguridad-control-movimientos-jabas/seguridad-control-movimientos-jabas.component';

import { ToastrModule } from 'ngx-toastr';
import { HttpErrorInterceptor } from './interceptors/http-error-response.service';
import { SeguridadControlMovimientosJabasAccionComponent } from './components/seguridad/seguridad-control-movimientos-jabas/seguridad-control-movimientos-jabas-accion/seguridad-control-movimientos-jabas-accion.component';
import { DialogRegistrarEstadoControlMovmientosJabasComponent } from './components/seguridad/seguridad-control-movimientos-jabas/dialog-seguridad-control-movimientos-jabas/dialog-registrar-estado-control-movmientos-jabas/dialog-registrar-estado-control-movmientos-jabas.component';

import { AgGridModule} from 'ag-grid-angular';
import { DialogRegistroHojaMedidaComponent } from './components/auditoria-calidad/auditoria-hoja-medida/dialog-auditoria-hoja-medida/dialog-registro-hoja-medida/dialog-registro-hoja-medida.component';
import { DialogObservacionHojaMedidaComponent } from './components/auditoria-calidad/auditoria-hoja-medida/dialog-auditoria-hoja-medida/dialog-observacion-hoja-medida/dialog-observacion-hoja-medida.component';
import { ControlActivoFijoComponent } from './components/control-activo-fijo/control-activo-fijo.component';
import { DespachoOpIncompletaComponent } from './components/despacho-op-incompleta/despacho-op-incompleta.component';
import { DialogDespachoOpIncompletaComponent } from './components/despacho-op-incompleta/dialog-despacho-op-incompleta/dialog-despacho-op-incompleta.component';
import { InspeccionPrendaComponent } from './components/inspeccion/inspeccion-prenda/inspeccion-prenda.component';
import { DialogDefectoComponent } from './components/inspeccion/inspeccion-prenda/dialog-inspeccion-prenda/dialog-defecto/dialog-defecto.component';
import { DialogModificarComponent } from './components/dialogs/dialog-modificar/dialog-modificar.component';
import { PermitirGiradoOpComponent } from './components/confecciones/permitir-girado-op/permitir-girado-op.component';
import { DialogRegistrarGiradoOpComponent } from './components/confecciones/permitir-girado-op/dialog-registrar-girado-op/dialog-registrar-girado-op.component';
import { InspeccionPrendaHabilitadorComponent } from './components/inspeccion/inspeccion-prenda-habilitador/inspeccion-prenda-habilitador.component';
import { ReinspeccionPrendaComponent } from './components/inspeccion/reinspeccion-prenda/reinspeccion-prenda.component';
import { DialogHabilitadorComponent } from './components/inspeccion/inspeccion-prenda-habilitador/dialog-inspeccion-prenda-habilitador/dialog-habilitador/dialog-habilitador.component';
import { DialogDefectoAudiComponent } from './components/inspeccion/reinspeccion-prenda/dialog-reinspeccion-prenda/dialog-defecto-audi/dialog-defecto-audi.component';
import { ReprocesoPartidaComponent } from './components/reproceso-partida/reproceso-partida.component';
import { TelasComponent } from './components/telas/telas.component';
import { TiempoImproductivoComponent } from './components/tiempo-improductivo/tiempo-improductivo.component';
import { DialogConfirmacion2Component } from './components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DerivadoInspeccionPrendaComponent } from './components/auditoria-calidad/derivado-inspeccion-prenda/derivado-inspeccion-prenda.component';
import { MantenimientoWebComponent } from './components/mantenimiento-web/mantenimiento-web.component';
import { AccesosUsuariosComponent } from './components/accesos-usuarios/accesos-usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { EstilosLiquidarComponent } from './components/estilos-liquidar/estilos-liquidar.component';
import { DialogVehiculoModificarKmComponent } from './components/seguridad/seguridad-control-vehiculo/dialog-vehiculo/dialog-vehiculo-modificar-km/dialog-vehiculo-modificar-km.component';
import { MantenimientoJabasComponent } from './components/mantenimiento-jabas/mantenimiento-jabas.component';
import { SeguridadActivoFijoReporteComponent } from './components/seguridad-activo-fijo-reporte/seguridad-activo-fijo-reporte.component';
import { TiemposImproductivosComponent } from './components/tiempos-improductivos/tiempos-improductivos.component';
import { DialogTiemposImproductivosComponent } from './components/tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { EficienciaMaquinaTurnoComponent } from './components/eficiencia-maquina-turno/eficiencia-maquina-turno.component';
import { DialogModificaTiemposImproductivosComponent } from './components/tiempos-improductivos/dialog-modifica-tiempos-improductivos/dialog-modifica-tiempos-improductivos.component';
import { LiquidacionCorteComponent } from './components/confecciones/liquidacion-corte/liquidacion-corte.component';
import { DialogModificaTelasComponent } from './components/confecciones/liquidacion-corte/dialog-modifica-telas/dialog-modifica-telas.component';
import { DialogDetallesCorteComponent } from './components/confecciones/liquidacion-corte/dialog-detalles-corte/dialog-detalles-corte.component';
import { RegistrarPermisosComponent } from './components/seguridad/registrar-permisos/registrar-permisos.component';
import { TiposPermisosComponent } from './components/seguridad/registrar-permisos/tipos-permisos/tipos-permisos.component';
import { FormPermisosComponent } from './components/seguridad/registrar-permisos/form-permisos/form-permisos.component';
import { DialogIngresoEmpleadoComponent } from './components/seguridad/registrar-permisos/form-permisos/dialog-ingreso-empleado/dialog-ingreso-empleado.component';
import { FormComisionesComponent } from './components/seguridad/registrar-permisos/form-comisiones/form-comisiones.component';
import { DialogIngresoEmpleadoComisionComponent } from './components/seguridad/registrar-permisos/form-comisiones/dialog-ingreso-empleado-comision/dialog-ingreso-empleado-comision.component';
import { FormRefrigerioComponent } from './components/seguridad/registrar-permisos/form-refrigerio/form-refrigerio.component';
import { DialogIngresoEmpleadorefrigerioComponent } from './components/seguridad/registrar-permisos/form-refrigerio/dialog-ingreso-empleadorefrigerio/dialog-ingreso-empleadorefrigerio.component';
import { PruebasComponent } from './components/pruebas/pruebas.component';
import { LecturaPermisosComponent } from './components/seguridad/lectura-permisos/lectura-permisos.component';
import { DialogRegistroUsuariosComponent } from './components/accesos-usuarios/dialog-registro-usuarios/dialog-registro-usuarios.component';
import { InspeccionLiberacionPaqueteComponent } from './components/inspeccion/inspeccion-liberacion-paquete/inspeccion-liberacion-paquete.component';
import { LecturaComisionesComponent } from './components/seguridad/lectura-comisiones/lectura-comisiones.component';
import { SeleccionarSedeComponent } from './components/seguridad/seleccionar-sede/seleccionar-sede.component';
import { SeleccionarSedeAccionComponent } from './components/seguridad/seleccionar-sede/seleccionar-sede-accion/seleccionar-sede-accion.component';

import { UbicacionHilosAlmacenComponent } from './components/ubicacion-hilos-almacen/ubicacion-hilos-almacen.component';
import { DialogUbicacionRegistrarComponent } from './components/ubicacion-hilos-almacen/dialog-ubicacion/dialog-ubicacion-registrar/dialog-ubicacion-registrar.component';
import { LecturaBultosAlmacenComponent } from './components/lectura-bultos-almacen/lectura-bultos-almacen.component';
import { DialogLecturaBultosComponent } from './components/lectura-bultos-almacen/dialog-lectura-bultos/dialog-lectura-bultos.component';
import { DialogTranferBultosComponent } from './components/lectura-bultos-almacen/dialog-tranfer-bultos/dialog-tranfer-bultos.component';
import { SeguimientoOrdenesAtencionComponent } from './components/seguimiento-ordenes-atencion/seguimiento-ordenes-atencion.component';
import { DetalleSeguimientoOrdenComponent } from './components/seguimiento-ordenes-atencion/detalle-seguimiento-orden/detalle-seguimiento-orden.component';
import { ReporteLecturaPermisosComponent } from './components/seguridad/reporte-lectura-permisos/reporte-lectura-permisos.component';
import { RegistroManteMaquinasHilosComponent } from './components/registro-mante-maquinas-hilos/registro-mante-maquinas-hilos.component';
import { DialogMantMaquiHiComponent } from './components/registro-mante-maquinas-hilos/dialog-mant-maqui-hi/dialog-mant-maqui-hi.component';
import { LecturaRefrigerioComponent } from './components/seguridad/lectura-refrigerio/lectura-refrigerio.component';


import { NgSelectModule } from '@ng-select/ng-select';
import { DialogDetalleTrabajadoresComponent } from './components/seguridad/registrar-permisos/dialog-detalle-trabajadores/dialog-detalle-trabajadores.component';
import { DialogModificaMantMaquiHiComponent } from './components/registro-mante-maquinas-hilos/dialog-modifica-mant-maqui-hi/dialog-modifica-mant-maqui-hi.component';
import { DialogObservacionesCorteComponent } from './components/confecciones/liquidacion-corte/dialog-observaciones-corte/dialog-observaciones-corte.component';
import { SaldoDevolverIndicadorComponent } from './components/confecciones/saldo-devolver-indicador/saldo-devolver-indicador.component';
import { SaldoDevolverComponent } from './components/confecciones/saldo-devolver/saldo-devolver.component';
import { VerAvancesComponent } from './components/confecciones/liquidacion-corte/ver-avances/ver-avances.component';
import { VerRatioConsumoComponent } from './components/confecciones/liquidacion-corte/ver-ratio-consumo/ver-ratio-consumo.component';
import { ConfeccionesAperturaTextilComponent } from './components/confecciones/confecciones-apertura-textil/confecciones-apertura-textil.component';
import { DialogObservacionAperturaComponent } from './components/confecciones/confecciones-apertura-textil/dialog-observacion-apertura/dialog-observacion-apertura.component';
import { RegistroCalidadTejeduriaComponent } from './components/registro-calidad-tejeduria/registro-calidad-tejeduria.component';
import { DialogCuatroPuntosComponent } from './components/registro-calidad-tejeduria/dialog-cuatro-puntos/dialog-cuatro-puntos.component';
import { LaboratorioLecturaRecetasComponent } from './components/laboratorio-lectura-recetas/laboratorio-lectura-recetas.component';
import { AsignarAreasUsuariosPermisosComponent } from './components/asignar-areas-usuarios-permisos/asignar-areas-usuarios-permisos.component';
import { DialogAsignarAreasComponent } from './components/asignar-areas-usuarios-permisos/dialog-asignar-areas/dialog-asignar-areas.component';
import { OperatividadFichaTecnicaComponent } from './components/operatividad-ficha-tecnica/operatividad-ficha-tecnica.component';
import { DetallesOperatividadFichaComponent } from './components/operatividad-ficha-tecnica/detalles-operatividad-ficha/detalles-operatividad-ficha.component';
import { DialogSelectUsuarioComponent } from './components/accesos-usuarios/dialog-select-usuario/dialog-select-usuario.component';
import { RolesUsuarioWebComponent } from './components/accesos-usuarios/roles-usuario-web/roles-usuario-web.component';
import { DetalleRolUsuarioComponent } from './components/accesos-usuarios/roles-usuario-web/detalle-rol-usuario/detalle-rol-usuario.component';
import { DialogCrearRolWebComponent } from './components/accesos-usuarios/roles-usuario-web/dialog-crear-rol-web/dialog-crear-rol-web.component';
import { AsignarRolesUsuarioComponent } from './components/accesos-usuarios/asignar-roles-usuario/asignar-roles-usuario.component';
import { ReportesInspeccionPrendaComponent } from './components/inspeccion/reportes-inspeccion-prenda/reportes-inspeccion-prenda.component';
import { CrearNuevoRolUsuarioComponent } from './components/accesos-usuarios/asignar-roles-usuario/crear-nuevo-rol-usuario/crear-nuevo-rol-usuario.component';
import { ModificarUsuarioWebComponent } from './components/accesos-usuarios/modificar-usuario-web/modificar-usuario-web.component';
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
import { AgregarParticipanteActaComponent } from './components/actas-acuerdo/crear-nuevo-acta/agregar-participante-acta/agregar-participante-acta.component';
import { CrearParticipantesActaComponent } from './components/actas-acuerdo/crear-participantes-acta/crear-participantes-acta.component';
import { MemoddtComponent } from './components/memoddt/memoddt.component';
import { DialogMemoddtComponent } from './components/memoddt/dialog-memoddt/dialog-memoddt.component';
import { DialogActasParticipantesComponent } from './components/actas-acuerdo/dialog-actas-participantes/dialog-actas-participantes.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DialogAgregarDescripcionComponent } from './components/control-activos-fijo/dialog-agregar-descripcion/dialog-agregar-descripcion.component';
import { WebcamModule } from 'ngx-webcam';
import { InspeccionLecturaDerivadosComponent } from './components/inspeccion/inspeccion-lectura-derivados/inspeccion-lectura-derivados.component';
import { ComercialCargaImagenesComponent } from './components/comercial-carga-imagenes/comercial-carga-imagenes.component';
import { DialogCargarMostrarImgComponent } from './components/comercial-carga-imagenes/dialog-cargar-mostrar-img/dialog-cargar-mostrar-img.component';
import { DialogMostrarImgComponent } from './components/comercial-carga-imagenes/dialog-cargar-mostrar-img/dialog-mostrar-img/dialog-mostrar-img.component';
import { ComercialImgHuachipaComponent } from './components/comercial-img-huachipa/comercial-img-huachipa.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogCrearImagenesComponent } from './components/comercial-carga-imagenes/dialog-crear-imagenes/dialog-crear-imagenes.component';
import { DialogTransferirImagenesComponent } from './components/comercial-carga-imagenes/dialog-transferir-imagenes/dialog-transferir-imagenes.component';
import { FormatoCheckListComponent } from './components/formato-check-list/formato-check-list.component';
import { DialogCrearCheckComponent } from './components/formato-check-list/dialog-crear-check/dialog-crear-check.component';
import { DialogEditarCheckComponent } from './components/formato-check-list/dialog-editar-check/dialog-editar-check.component';
import { DialogCheckRechazoComponent } from './components/formato-check-list/dialog-check-rechazo/dialog-check-rechazo.component';
import { DialogCheckInspeccionAudiComponent } from './components/formato-check-list/dialog-check-inspeccion-audi/dialog-check-inspeccion-audi.component';
import { AuditoriaHojaMedidaInspComponent } from './components/auditoria-calidad/auditoria-hoja-medida-insp/auditoria-hoja-medida-insp.component';
import { DialogObservacionHojaMedidaInspComponent } from './components/auditoria-calidad/auditoria-hoja-medida-insp/dialog-observacion-hoja-medida-insp/dialog-observacion-hoja-medida-insp.component';
import { DialogRegistroHojaMedidaInspComponent } from './components/auditoria-calidad/auditoria-hoja-medida-insp/dialog-registro-hoja-medida-insp/dialog-registro-hoja-medida-insp.component';
import { AuditoriaHojaMedidaDetalleInspComponent } from './components/auditoria-calidad/auditoria-hoja-medida-insp/auditoria-hoja-medida-detalle-insp/auditoria-hoja-medida-detalle-insp.component';
import { DialogDetalleReprocesoComponent } from './components/formato-check-list/dialog-detalle-reproceso/dialog-detalle-reproceso.component';
import { DialogCrearReprocesoComponent } from './components/formato-check-list/dialog-crear-reproceso/dialog-crear-reproceso.component';

import { SeguimientoToberaComponent } from './components/seguimiento-tobera/seguimiento-tobera.component';
import { LiquidacionPendientesComponent } from './components/confecciones/liquidacion-pendientes/liquidacion-pendientes.component';
import { GestionVisitasComponent } from './components/gestion-visitas/gestion-visitas.component';
import { ReporteVisitasComponent } from './components/reporte-visitas/reporte-visitas.component';
import { SeleccionarTipoVisitaComponent } from './components/gestion-visitas/seleccionar-tipo-visita/seleccionar-tipo-visita.component';
import { CrearVisitaComponent } from './components/gestion-visitas/crear-visita/crear-visita.component';
import { ConsultaVisitaComponent } from './components/gestion-visitas/consulta-visita/consulta-visita.component';
import { ComedorEncuestaUsuarioComponent } from './components/comedor/comedor-encuesta-usuario/comedor-encuesta-usuario.component';
import { FormPermisoDiaComponent } from './components/seguridad/registrar-permisos/form-permiso-dia/form-permiso-dia.component';
import { FormMiPermisoComponent } from './components/seguridad/registrar-permisos/form-mi-permiso/form-mi-permiso.component';
import { DialogPermisoDiaComponent } from './components/seguridad/registrar-permisos/form-permiso-dia/dialog-permiso-dia/dialog-permiso-dia.component';
import { FormAprobacionPermisosComponent } from './components/seguridad/registrar-permisos/form-aprobacion-permisos/form-aprobacion-permisos.component';
import { FormTrabajadoresPermisosComponent } from './components/seguridad/registrar-permisos/form-aprobacion-permisos/form-trabajadores-permisos/form-trabajadores-permisos.component';
import { DialogCrearTrabajadorComponent } from './components/seguridad/registrar-permisos/form-aprobacion-permisos/form-trabajadores-permisos/dialog-crear-trabajador/dialog-crear-trabajador.component';
import { CrearPreguntasComedorComponent } from './components/comedor/mantenimientos-correos/crear-preguntas-comedor/crear-preguntas-comedor.component';
import { MantenimientoPreguntasComponent } from './components/mantenimiento-preguntas/mantenimiento-preguntas.component';
import { CrearCabPreguntasComponent } from './components/comedor/mantenimientos-correos/crear-cab-preguntas/crear-cab-preguntas.component';
import { MantenimientoPreguntasDetComponent } from './components/comedor/mantenimientos-correos/mantenimiento-preguntas-det/mantenimiento-preguntas-det.component';
import { ReporteEncuestaComponent } from './components/comedor/reporte-encuesta/reporte-encuesta.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SeguridadRecalcularBonosComponent } from './components/seguridad/seguridad-recalcular-bonos/seguridad-recalcular-bonos.component';
import { DialogVerImagenComponent } from './components/comercial-carga-imagenes/dialog-cargar-mostrar-img/dialog-mostrar-img/dialog-ver-imagen/dialog-ver-imagen.component';
import { GuiaContingenciaComponent } from './components/guia-contingencia/guia-contingencia.component';

import { HistorialReposicionComponent } from './components/reposiciones/historial-reposicion/historial-reposicion.component';
import { AprobacionReposicionComponent } from './components/reposiciones/aprobacion-reposicion/aprobacion-reposicion.component';
import { AprobacionReposicionCalidadComponent } from './components/reposiciones/aprobacion-reposicion-calidad/aprobacion-reposicion-calidad.component';
import { AprobacionReposicionCorteComponent } from './components/reposiciones/aprobacion-reposicion-corte/aprobacion-reposicion-corte.component';
import { LecturaReposicionComponent } from './components/reposiciones/lectura-reposicion/lectura-reposicion.component';
import { GenerarDespachoComponent } from './components/reposiciones/generar-despacho/generar-despacho.component';
import { DialogCrearReposicionComponent } from './components/reposiciones/historial-reposicion/dialog-crear-reposicion/dialog-crear-reposicion.component';
import { DialogAprobacionReposicionComponent } from './components/reposiciones/aprobacion-reposicion/dialog-aprobacion-reposicion/dialog-aprobacion-reposicion.component';
import { DialogGenerarDespachoComponent } from './components/reposiciones/generar-despacho/dialog-generar-despacho/dialog-generar-despacho.component';
import { DialogDetalleReposicionComponent } from './components/reposiciones/historial-reposicion/dialog-detalle-reposicion/dialog-detalle-reposicion.component';
import { DialogRecepcionReposicionComponent } from './components/reposiciones/historial-reposicion/dialog-recepcion-reposicion/dialog-recepcion-reposicion.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PantallaReposicionesComponent } from './components/reposiciones/pantalla-reposiciones/pantalla-reposiciones.component';
import { RegistrarTransitoCosturaComponent } from './components/reposiciones/registrar-transito-costura/registrar-transito-costura.component';
import { RegistrarTransitoCorteComponent } from './components/reposiciones/registrar-transito-corte/registrar-transito-corte.component';
import { AlmacenTelasCorteComponent } from './components/reposiciones/almacen-telas-corte/almacen-telas-corte.component';
import { AprobacionCalidadCorteComponent } from './components/reposiciones/aprobacion-calidad-corte/aprobacion-calidad-corte.component';
import { VistaPreviaCheckComponent } from './components/formato-check-list/vista-previa-check/vista-previa-check.component';
import { DialogEditarReposicionComponent } from './components/reposiciones/historial-reposicion/dialog-editar-reposicion/dialog-editar-reposicion.component';
import { AprobControlInternoComponent } from './components/reposiciones/aprob-control-interno/aprob-control-interno.component';
import { DialogCheckOpComponent } from './components/formato-check-list/dialog-check-op/dialog-check-op.component';
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
import { DialogConfirmarHabilitadorComponent } from './components/modular/modular-inspeccion-habilitador/dialog-confirmar-habilitador/dialog-confirmar-habilitador.component';
import { FormatosRhComponent } from './components/vacaciones/formatos-rh/formatos-rh.component';
import { DialogDefectosModularComponent } from './components/modular/modular-inspeccion-prenda/dialog-defectos-modular/dialog-defectos-modular.component';
import { DialogConfirmacionEstampadoComponent } from './components/dialogs/dialog-confirmacion-estampado/dialog-confirmacion-estampado.component';

//import { ZXingScannerModule } from '@zxing/ngx-scanner'; //EIQ-2025-06-25
// import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
//import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';

// LOAD_WASM().subscribe((res: any) => console.log('LOAD_WASM', res));

import { DialogAprobRechOpComponent } from './components/formato-check-list/dialog-aprob-rech-op/dialog-aprob-rech-op.component';
import { DialigDefectosAuditoriaComponent } from './components/modular/modular-auditoria-modulo/dialig-defectos-auditoria/dialig-defectos-auditoria.component';
import { DialogDefectosRecuperacionComponent } from './components/modular/modular-inspeccion-recuperacion/dialog-defectos-recuperacion/dialog-defectos-recuperacion.component';
import { ModularTicketRecuperacionComponent } from './components/modular/modular-ticket-recuperacion/modular-ticket-recuperacion.component';
import { ModalRecuperacionRecojoComponent } from './components/modular/modal-recuperacion-recojo/modal-recuperacion-recojo.component';
import { ModularDerivadosControlComponent } from './components/modular/modular-derivados-control/modular-derivados-control.component';
import { ModularDisgregarPrendaComponent } from './components/modular/modular-disgregar-prenda/modular-disgregar-prenda.component';
import { MantMaestroBolsaComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa.component';
import { MantMaestroBolsaItemComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item/mant-maestro-bolsa-item.component';
import { MantMaestroBolsaItemDetComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item-det/mant-maestro-bolsa-item-det.component';
import { DialogMaestroBolsaItemComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item/dialog-maestro-bolsa-item/dialog-maestro-bolsa-item.component';
import { DialogMantenimientoComponent } from './components/modular/modular-mant-inspectoras/dialog-mantenimiento/dialog-mantenimiento.component';
import { DialogGenerarPaqueteComponent } from './components/modular/modular-liquidador-transito/dialog-generar-paquete/dialog-generar-paquete.component';
import { DialogMuestraPaquetesComponent } from './components/modular/modular-liquidador-transito/dialog-generar-paquete/dialog-muestra-paquetes/dialog-muestra-paquetes.component';
import { DialogImprimirTicketComponent } from './components/modular/modular-liquidador-transito/dialog-imprimir-ticket/dialog-imprimir-ticket.component';
import { LiberarOpComponent } from './components/confecciones/liberar-op/liberar-op.component';
import { ModularLiquidacionAdicionalComponent } from './components/modular/modular-liquidacion-adicional/modular-liquidacion-adicional.component';
import { DialogMaestroBolsaTransComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item/dialog-maestro-bolsa-trans/dialog-maestro-bolsa-trans.component';
import { HipocampoComponent } from './components/hipocampo/hipocampo.component';
import { AprobacionmuestraateComponent } from './components/aprobacionmuestraate/aprobacionmuestraate.component';
//import { LecturacodigosComponent } from './components/lecturacodigos/lecturacodigos.component';



import { ModularReimpresionTicketComponent } from './components/modular/modular-reimpresion-ticket/modular-reimpresion-ticket.component';
import { ModularLiberarPaqueteComponent } from './components/modular/modular-liberar-paquete/modular-liberar-paquete.component';
import { ModularReporteInspeccionComponent } from './components/modular/modular-reporte-inspeccion/modular-reporte-inspeccion.component';
import { ModularReporteAuditoriaComponent } from './components/modular/modular-reporte-auditoria/modular-reporte-auditoria.component';

import { FabriccardComponent } from './components/fabriccard/fabriccard.component';
import { DialogAprobFabriccardComponent } from './components/fabriccard/dialog-aprob-fabriccard/dialog-aprob-fabriccard.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { ArranquetejeduriaComponent } from './components/arranquetejeduria/arranquetejeduria.component';
import { DialogCreararranqueComponent } from './components/arranquetejeduria/dialog-creararranque/dialog-creararranque.component';
import { DialogModificararranqueComponent } from './components/arranquetejeduria/dialog-modificararranque/dialog-modificararranque.component';
import { DialogRecepFabriccardComponent } from './components/fabriccard/dialog-recep-fabriccard/dialog-recep-fabriccard.component';
import { MantLecturaTicketComponent } from './components/mant-lectura-ticket/mant-lectura-ticket.component';
import { DialogMaestroBolsaModificarComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item-det/dialog-maestro-bolsa-modificar/dialog-maestro-bolsa-modificar.component';
import { DialogAgregarTallaComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item-det/dialog-maestro-bolsa-modificar/dialog-agregar-talla/dialog-agregar-talla.component';
import { DialogMaestroBolsaIteDetModificarComponent } from './components/mant-maestro-bolsa/mant-maestro-bolsa-item-det/dialog-maestro-bolsa-modificar/dialog-maestro-bolsa-ite-det-modificar/dialog-maestro-bolsa-ite-det-modificar.component';
import { MantenimientoJabaCocheComponent } from './components/seguridad/mantenimiento-jaba-coche/mantenimiento-jaba-coche.component';
import { DialogJabasCochesComponent } from './components/seguridad/mantenimiento-jaba-coche/dialog-jabas-coches/dialog-jabas-coches.component';
import { DialogAddUbicacionComponent } from './components/seguridad/mantenimiento-jaba-coche/dialog-jabas-coches/dialog-add-ubicacion/dialog-add-ubicacion.component';
import { ControlJabaCochesComponent } from './components/seguridad/control-jaba-coches/control-jaba-coches.component';
import { CtrlJabaServicioComponent } from './components/seguridad/ctrl-jaba-servicio/ctrl-jaba-servicio.component';





import { MatFormFieldModule } from '@angular/material/form-field';
import { RegistroParaMaqTinto } from './components/registro-paramaq-tinto/registro-paramaq-tinto';
import { AuditoriaLineaExternaComponent } from './components/auditoria-externa/auditoria-linea-externa/auditoria-linea-externa.component';
import { AuditoriaFinalExternaComponent } from './components/auditoria-externa/auditoria-final-externa/auditoria-final-externa.component';
import { DialogAuditoriaExternoComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-auditoria-externo.component';
import { DialogDetalleExternoComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-detalle-externo/dialog-detalle-externo.component';
import { DialogSubDetalleExternoComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-sub-detalle-externo/dialog-sub-detalle-externo.component';
import { DialogCabeceraExternoComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-cabecera-externo/dialog-cabecera-externo.component';
import { DialogRegistrarDetalleExtComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-registrar-detalle-ext/dialog-registrar-detalle-ext.component';
import { DialogRegistrarSubdetalleExtComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-registrar-subdetalle-ext/dialog-registrar-subdetalle-ext.component';
import { AuditoriaHojaMediaExtComponent } from './components/auditoria-externa/auditoria-hoja-media-ext/auditoria-hoja-media-ext.component';
import { AuditoriaMedidaDetalleExtComponent } from './components/auditoria-externa/auditoria-hoja-media-ext/auditoria-medida-detalle-ext/auditoria-medida-detalle-ext.component';
import { DialogAuditoriaMedidaExtComponent } from './components/auditoria-externa/auditoria-hoja-media-ext/dialog-auditoria-medida-ext/dialog-auditoria-medida-ext.component';
import { PartidasPendientesEstadoRefComponent } from './components/huachipa-acabados/partidas-pendientes-estadoref/partidas-pendientes-estadoref.component';
import { PackingJabaGuiaComponent } from './components/seguridad/seguridad-control-guia/packing-jaba-guia/packing-jaba-guia.component';
import { HistorialPackJabaComponent } from './components/seguridad/seguridad-control-guia/packing-jaba-guia/historial-pack-jaba/historial-pack-jaba.component';
import { DialogDetallePackComponent } from './components/seguridad/seguridad-control-guia/packing-jaba-guia/historial-pack-jaba/dialog-detalle-pack/dialog-detalle-pack.component';
import { DialogDetalleIngresoPackComponent } from './components/seguridad/control-jaba-coches/dialog-detalle-ingreso-pack/dialog-detalle-ingreso-pack.component';
import { DialogDetalleExternoCrearImagenesComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-detalle-externo-crear-imagenes/dialog-detalle-externo-crear-imagenes.component';
import { DialogDetalleExternoMostrarImagenesComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-detalle-externo-mostrar-imagenes/dialog-detalle-externo-mostrar-imagenes.component';
import { DialogVerImgenJabaComponent } from './components/seguridad/seguridad-control-guia/packing-jaba-guia/historial-pack-jaba/dialog-ver-imagen-jaba/dialog-ver-imagen-jaba.component';
import { CalificacionRolloCalComponent } from './components/calificacion-rollo-cal/calificacion-rollo-cal.component';
import { ProduccionArtesListComponent } from './components/produccion-artes-list/produccion-artes-list.component';
import { DialogProduccionArtesCrearComponent } from './components/produccion-artes-list/dialog-produccion-artes-crear/dialog-produccion-artes-crear.component';
import { ProduccionInspeccionListComponent } from './components/produccion-inspeccion-list/produccion-inspeccion-list.component';
import { DialogProduccionInspeccionCrearComponent } from './components/produccion-inspeccion-list/dialog-produccion-inspeccion-crear/dialog-produccion-inspeccion-crear.component';
import { SolicitudAgujasComponent } from './components/tejeduria/solicitud-agujas.component';
import { DialogAddSolicitudAgujasComponent } from './components/tejeduria/dialog-solicitud-agujas/dialog-add-solicitud-agujas.component';
import { MantenimientoHoraComponent } from './components/mantenimiento-hora/mantenimiento-hora.component';
import { DialogCabeceraHoraComponent } from './components/mantenimiento-hora/dialog-cabecera-hora/dialog-cabecera-hora.component';
import { ModularReporteAuditoriaTicketComponent } from './components/modular/modular-reporte-auditoria-ticket/modular-reporte-auditoria-ticket.component';
import { ParticionRolloCalComponent } from './components/particion-rollo-cal/particion-rollo-cal.component';

import { LiquidacionAviosCosturaComponent } from './components/movimientos/liquidacion-avios-costura/liquidacion-avios-costura.component';
import { DialogCabeceraLiquidacionComponent } from './components/movimientos/liquidacion-avios-costura/dialog-cabecera-liquidacion/dialog-cabecera-liquidacion.component';
import { DialogDetalleLiquidacionComponent } from './components/movimientos/liquidacion-avios-costura/dialog-detalle-liquidacion/dialog-detalle-liquidacion.component';
import { DialogRegistrarDetalleLiquidacionComponent } from './components/movimientos/liquidacion-avios-costura/dialog-registrar-detalle-liquidacion/dialog-registrar-detalle-liquidacion.component';
import { ModularReportesInspeccionDefectoPrendaComponent } from './components/modular/modular-reporte-inspeccion-defecto-prenda/modular-reporte-inspeccion-defecto-prenda.component';

import { RegistroCalidadOtComponent } from './components/registro-calidad-ot/registro-calidad-ot.component';
import { DialogAuditoriaRegistroCalidadOtComponent } from './components/registro-calidad-ot/dialog-auditoria-registro-calidad-ot/dialog-auditoria-registro-calidad-ot.component';
import { ModularReportesAuditoriaSalidaInspeccionComponent } from './components/modular/modular-reporte-auditoria-salida-inspeccion/modular-reporte-auditoria-salida-inspeccion.component';
import { DialogParticionTicketHabilitadorComponent } from './components/modular/modular-paquete-particion/dialog-particion-ticket-habilitador/dialog-particion-ticket-habilitador.component';
import { ModularReportesAuditoriaProcesoInspeccionComponent } from './components/modular/modular-reporte-auditoria-proceso-inspeccion/modular-reporte-auditoria-proceso-inspeccion.component';
import { DialogModificalongitudmallaComponent } from './components/arranquetejeduria/dialog-modificalongitudmalla/dialog-modificalongitudmalla.component';
import { DialogModificalongitudmalla2Component } from './components/arranquetejeduria/dialog-modificalongitudmalla2/dialog-modificalongitudmalla2.component';
import { ProduccionInspeccionSalidaListComponent } from './components/produccion-inspeccion-salida-list/produccion-inspeccion-salida-list.component';
import { DialogProduccionInspeccionSalidaCrearComponent } from './components/produccion-inspeccion-salida-list/dialog-produccion-inspeccion-salida-crear/dialog-produccion-inspeccion-salida-crear.component';
import { DialogVerImagenInspeccionComponent} from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-ver-imagen-inspeccion/dialog-ver-imagen-inspeccion.component';
import { VistaPreviaAuditoriaExternaComponent  } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/vista-previa-auditoria-externa/vista-previa-auditoria-externa.component';
import { DialogCrearImagenesAuditoriaFinalComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-crear-imagenes-auditoria-final/dialog-crear-imagenes-auditoria-final.component';
import { DialogVerAuditoriaFinalComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-ver-auditoria-final/dialog-ver-auditoria-final.component';
import { DialogRegistrarDespachoComponent } from './components/auditoria-externa/auditoria-final-externa/dialog-auditoria-externo/dialog-registrar-despacho/dialog-registrar-despacho.component';
import { ReversionAuditoriaFinalExternaComponent } from './components/auditoria-externa/reversion-auditoria-final-externa/reversion-auditoria-final-externa.component';
import { DialogReversionDetalleExternoComponent } from './components/auditoria-externa/reversion-auditoria-final-externa/dialog-reversion-detalle-externo/dialog-reversion-detalle-externo.component';
import { DialogActualizaReversionComponent } from './components/auditoria-externa/reversion-auditoria-final-externa/dialog-reversion-detalle-externo/dialog-actualiza-reversion/dialog-actualiza-reversion.component';
import { LiberarPartidaCalidadComponent } from './components/liberar-partida-calidad/liberar-partida-calidad.component';
import { ModularPaqueteParticionComponent } from './components/modular/modular-paquete-particion/modular-paquete-particion.component';
import { HojaIngenieriaOperacionListComponent } from './components/hoja-ingenieria-operacion-list/hoja-ingenieria-operacion-list.component';
import { DialogHojaIngenieriaOperacionCrearComponent } from './components/hoja-ingenieria-operacion-list/dialog-hoja-ingenieria-operacion-crear/dialog-hoja-ingenieria-operacion-crear.component';
import { ReporteBolsasArteComponent } from './components/reporte-bolsas-arte/reporte-bolsas-arte.component';
import { LecturaRolloExportacionComponent } from './components/lectura-rollo-exportacion/lectura-rollo-exportacion.component';
import { LecturaRolloDespachoComponent } from './components/lectura-rollo-despacho/lectura-rollo-despacho.component';
import { DialogBuscaclienteComponent } from './components/lectura-rollo-despacho/dialog-buscacliente/dialog-buscacliente.component';
import { DialogCargaPrepackingComponent } from './components/lectura-rollo-despacho/dialog-carga-prepacking/dialog-carga-prepacking.component';
import { DialogDetallePartidaRollosComponent } from './components/lectura-rollo-despacho/dialog-detalle-partida-rollos/dialog-detalle-partida-rollos.component';

import { ReporteKardexJabasComponent } from './components/seguridad/reporte-kardex-jabas/reporte-kardex-jabas.component';
import { DialogVerPendientesComponent } from './components/lectura-rollo-despacho/dialog-ver-pendientes/dialog-ver-pendientes.component';
import { CheckListIngresoCosturaComponent } from './components/check-list-ingreso-costura/check-list-ingreso-costura.component';
import { DialogCabeceraChecklistCosturaComponent } from './components/check-list-ingreso-costura/dialog-cabecera-checklist-costura/dialog-cabecera-checklist-costura.component';
import { DialogDetalleChecklistCosturaComponent } from './components/check-list-ingreso-costura/dialog-detalle-checklist-costura/dialog-detalle-checklist-costura.component';
import { DialogRegistrarDetalleChecklistComponent } from './components/check-list-ingreso-costura/dialog-registrar-detalle-checklist/dialog-registrar-detalle-checklist.component';
import { DialogChecklistDefectosCosturaComponent } from './components/check-list-ingreso-costura/dialog-checklist-defectos-costura/dialog-checklist-defectos-costura.component';
import { DialogRegistrarDefectosCosturaComponent } from './components/check-list-ingreso-costura/dialog-registrar-defectos-costura/dialog-registrar-defectos-costura.component';
import { DialogRegistrarDatosIngresoComponent } from './components/check-list-ingreso-costura/dialog-registrar-datos-ingreso/dialog-registrar-datos-ingreso.component';
import { VistaPreviaChecklistDefectosComponent  } from './components/check-list-ingreso-costura/vista-previa-checklist-defectos/vista-previa-checklist-defectos.component';
import { ReporteJabasOpComponent } from './components/reporte-jabas-op/reporte-jabas-op.component';
import { ReporteAlmacenArteComponent } from './components/reporte-almacen-arte/reporte-almacen-arte.component';
import { DialogHojaIngenieriaOperacionVerComponent } from './components/hoja-ingenieria-operacion-list/dialog-hoja-ingenieria-operacion-ver/dialog-hoja-ingenieria-operacion-ver.component';
import { AuditoriaIngresoCorteComponent } from './components/auditoria-corte/auditoria-ingreso-corte/auditoria-ingreso-corte.component';
import { DialogAuditoriaIngresoCorteCabeceraComponent } from './components/auditoria-corte/auditoria-ingreso-corte/dialog-auditoria-ingreso-corte-cabecera/dialog-auditoria-ingreso-corte-cabecera.component';
import { AuditoriaAcabadosComponent } from './components/auditoria-calidad/auditoria-acabados/auditoria-acabados.component';
import { AuditoriaAcabadosDetalleComponent } from './components/auditoria-calidad/auditoria-acabados/auditoria-acabados-detalle/auditoria-acabados-detalle.component';
import { DialogObservacionAcabadosMedidaComponent } from './components/auditoria-calidad/auditoria-acabados/dialog-auditoria-acabados-medida/dialog-observacion-acabados-medida/dialog-observacion-acabados-medida.component';
import { DialogRegistroAcabadosMedidaComponent } from './components/auditoria-calidad/auditoria-acabados/dialog-auditoria-acabados-medida/dialog-registro-acabados-medida/dialog-registro-acabados-medida.component';
import { ProdTejeRectilineoComponent} from './components/tejeduria/prod-teje-rectilineo';
import { ProdTejeRectilineoRegistroComponent } from './components/tejeduria/prod-teje-rectilineo-registro/prod-teje-rectilineo-registro';
import { DialogAddProdTejeRectilineoComponent } from './components/tejeduria/prod-teje-rectilineo-registro/dialog-add-prod-teje-rectilineo-registro/dialog-add-prod-teje-rectilineo-registro';
import { DigitalizacionFichasComponent } from './components/digitalizacion-fichas/digitalizacion-fichas.component';
import { DialogVisorFichasComponent } from './components/digitalizacion-fichas/dialog-visor-fichas/dialog-visor-fichas.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { CapacidadesComponent } from './components/tintoreria/capacidades.component';
import { DialogAddCapacidadesComponent } from './components/tintoreria/dialog-capacidades/dialog-add-capacidades.component';
import { AuditoriaModuloAcabadoComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/auditoria-modulo-acabado.component';
import { DialogCabeceraModuloAcabadoComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/dialog-cabecera-modulo-acabado/dialog-cabecera-modulo-acabado.component';
import { DialogDetalleModuloAcabadoComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/dialog-detalle-modulo-acabado/dialog-detalle-modulo-acabado.component';
import { DialogRegistrarDetalleModuloAcabadoComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/dialog-registrar-detalle-modulo-acabado/dialog-registrar-detalle-modulo-acabado.component';
import { DialogModuloDefectosComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/dialog-modulo-defectos/dialog-modulo-defectos.component';
import { DialogRegistrarModuloDefectosComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/dialog-registrar-modulo-defectos/dialog-registrar-modulo-defectos.component';
import { VistaPreviaModuloDefectosComponent } from './components/auditoria-calidad/auditoria-modulo-acabado/vista-previa-modulo-defectos/vista-previa-modulo-defectos.component';
import { AuditoriaVaporizadoAcabadoComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/auditoria-vaporizado-acabado.component';
import { DialogCabeceraVaporizadoAcabadoComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/dialog-cabecera-vaporizado-acabado/dialog-cabecera-vaporizado-acabado.component';
import { DialogDetalleVaporizadoAcabadoComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/dialog-detalle-vaporizado-acabado/dialog-detalle-vaporizado-acabado.component';
import { DialogRegistrarDetalleVaporizadoAcabadoComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/dialog-registrar-detalle-vaporizado-acabado/dialog-registrar-detalle-vaporizado-acabado.component';
import { DialogVaporizadoDefectosComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/dialog-vaporizado-defectos/dialog-vaporizado-defectos.component';
import { DialogRegistrarVaporizadoDefectosComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/dialog-registrar-vaporizado-defectos/dialog-registrar-vaporizado-defectos.component';
import { VistaPreviaVaporizadoDefectosComponent } from './components/auditoria-calidad/auditoria-vaporizado-acabado/vista-previa-vaporizado-defectos/vista-previa-vaporizado-defectos.component';
import { RegistroFirmasAuditoriaComponent } from './components/auditoria-externa/registro-firmas-auditoria/registro-firmas-auditoria.component';
import { DialogRegistroFirmasComponent } from './components/auditoria-externa/registro-firmas-auditoria/dialog-registro-firmas/dialog-registro-firmas.component';
import { DialogCambioJabaComponent } from './components/seguridad/seguridad-control-guia/seguridad-control-guia-salida/dialog-cambio-jaba/dialog-cambio-jaba.component';
import { ProgramaEmpastadoComponent } from './components/estampado-digital/programa-empastado.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogProgramaEmpastadoComponent } from './components/estampado-digital/dialog-programa-empastado/dialog-programa-empastado.component';
import { BusquedaRollosPartidaComponent } from './components/busqueda-rollos-partida/busqueda-rollos-partida.component';
import { LecturaQ2H4Component } from './components/lectura-q2-h4/lectura-q2-h4.component';

import { AuditoriaSalidaAcabadoComponent } from './components/auditoria-calidad/auditoria-salida-acabado/auditoria-salida-acabado.component';
import { DialogDefectosSalidaAcabadoComponent } from './components/auditoria-calidad/auditoria-salida-acabado/dialog-defectos-salida-acabado/dialog-defectos-salida-acabado.component';
import { DialogRegistrarSalidaAcabadoComponent } from './components/auditoria-calidad/auditoria-salida-acabado/dialog-registrar-salida-acabado/dialog-registrar-salida-acabado.component';
import { DialogRegistrarDefectoSalidaAcabadoComponent } from './components/auditoria-calidad/auditoria-salida-acabado/dialog-registrar-defecto-salida-acabado/dialog-registrar-defecto-salida-acabado.component';
import { DialogVistaSalidaAcabadoComponent } from './components/auditoria-calidad/auditoria-salida-acabado/dialog-vista-salida-acabado/dialog-vista-salida-acabado.component';
import { AuditoriaEmpaqueAcabadoComponent } from './components/auditoria-calidad/auditoria-empaque-acabado/auditoria-empaque-acabado.component';
import { DialogVistaEmpaqueAcabadoComponent } from './components/auditoria-calidad/auditoria-empaque-acabado/dialog-vista-empaque-acabado/dialog-vista-empaque-acabado.component';
import { DialogDefectosEmpaqueAcabadoComponent } from './components/auditoria-calidad/auditoria-empaque-acabado/dialog-defectos-empaque-acabado/dialog-defectos-empaque-acabado.component';
import { DialogRegistarDefectoEmpaqueAcabadoComponent } from './components/auditoria-calidad/auditoria-empaque-acabado/dialog-registar-defecto-empaque-acabado/dialog-registar-defecto-empaque-acabado.component';
import { DialogRegistarEmpaqueAcabadoComponent } from './components/auditoria-calidad/auditoria-empaque-acabado/dialog-registar-empaque-acabado/dialog-registar-empaque-acabado.component';
import { DialogFirmaDigitalComponent } from './components/auditoria-externa/registro-firmas-auditoria/dialog-firma-digital/dialog-firma-digital.component';
import { AuditoriaEmpaqueCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/auditoria-empaque-cajas.component';
import { DialogRegistroEmpaqueCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/dialog-registro-empaque-cajas/dialog-registro-empaque-cajas.component';
import { DialogDefectosEmpaqueCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/dialog-defectos-empaque-cajas/dialog-defectos-empaque-cajas.component';
import { DialogCantidadDefectosCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/dialog-cantidad-defectos-cajas/dialog-cantidad-defectos-cajas.component';
import { DialogImagenEmpaqueCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/dialog-imagen-empaque-cajas/dialog-imagen-empaque-cajas.component';
import { DialogResumenEmpaqueCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/dialog-resumen-empaque-cajas/dialog-resumen-empaque-cajas.component';
import { AuditoriaProcesoCorteComponent } from './components/auditoria-corte/auditoria-proceso-corte/auditoria-proceso-corte.component';
import { DialogAuditoriaProcesoCorteRegistroComponent } from './components/auditoria-corte/auditoria-proceso-corte/dialog-auditoria-proceso-corte-registro/dialog-auditoria-proceso-corte-registro.component';
import { AuditoriaFinalCorteComponent } from './components/auditoria-corte/auditoria-final-corte/auditoria-final-corte.component';
import { DialogAuditoriaFinalCorteRegistroComponent } from './components/auditoria-corte/auditoria-final-corte/dialog-auditoria-final-corte-registro/dialog-auditoria-final-corte-registro.component';



import { EstatusControlTenidoComponent } from './components/estatus-control-tenido/estatus-control-tenido.component';
import { DialogCatalogoToberasComponent } from './components/estatus-control-tenido/dialog-catalogo-toberas/dialog-catalogo-toberas.component';
import { DialogVisorImageComponent } from './components/estatus-control-tenido/dialog-visor-image/dialog-visor-image.component';
import { DialogVisorPdfComponent } from './components/estatus-control-tenido/dialog-visor-pdf/dialog-visor-pdf.component';
import { AuditoriaHojaMoldeComponent } from './components/auditoria-calidad/auditoria-hoja-molde/auditoria-hoja-molde.component';
import { DialogAuditoriaHojaMoldeRegistroComponent } from './components/auditoria-calidad/auditoria-hoja-molde/dialog-auditoria-hoja-molde-registro/dialog-auditoria-hoja-molde-registro.component';
import { DialogAuditoriaHojaMoldeMedidasComponent } from './components/auditoria-calidad/auditoria-hoja-molde/dialog-auditoria-hoja-molde-medidas/dialog-auditoria-hoja-molde-medidas.component';
import { AuditoriaHojaMoldeFinalComponent } from './components/auditoria-calidad/auditoria-hoja-molde-final/auditoria-hoja-molde-final.component';
import { DialogAuditoriaHojaFinalRegistroComponent } from './components/auditoria-calidad/auditoria-hoja-molde-final/dialog-auditoria-hoja-final-registro/dialog-auditoria-hoja-final-registro.component';
import { DialogAuditoriaHojaFinalMedidasComponent } from './components/auditoria-calidad/auditoria-hoja-molde-final/dialog-auditoria-hoja-final-medidas/dialog-auditoria-hoja-final-medidas.component';
import { ProgramacionAuditoriaComponent } from './components/auditoria-calidad/programacion-auditoria/programacion-auditoria.component';
import { DialogProgramacionAuditoriaRegistroComponent } from './components/auditoria-calidad/programacion-auditoria/dialog-programacion-auditoria-registro/dialog-programacion-auditoria-registro.component';
import { ProgramacionAuditoriaSeguimientoComponent } from './components/auditoria-calidad/programacion-auditoria-seguimiento/programacion-auditoria-seguimiento.component';
import { DialogProgramacionAuditoriaMotivoComponent } from './components/auditoria-calidad/programacion-auditoria-seguimiento/dialog-programacion-auditoria-motivo/dialog-programacion-auditoria-motivo.component';
import { DialogProgramacionAuditoriaReprogamaComponent } from './components/auditoria-calidad/programacion-auditoria-seguimiento/dialog-programacion-auditoria-reprogama/dialog-programacion-auditoria-reprogama.component';
import { DialogProgramacionAuditoriaFechaComponent } from './components/auditoria-calidad/programacion-auditoria/dialog-programacion-auditoria-fecha/dialog-programacion-auditoria-fecha.component';
import { DialogPendienteEmpaqueCajasComponent } from './components/auditoria-calidad/auditoria-empaque-cajas/dialog-pendiente-empaque-cajas/dialog-pendiente-empaque-cajas.component';

import { DialogCombinacionComponent } from './components/arranquetejeduria/dialog-combinacion/dialog-combinacion.component';
import { DialogAgregarpasadaComponent } from './components/arranquetejeduria/dialog-agregarpasada/dialog-agregarpasada.component';
import { CargaEstructuraTejidoComponent } from './components/tejeduria/carga-estructura-tejido/carga-estructura-tejido.component';
import { ArranquetejeduriaVersionHistComponent } from './components/arranquetejeduria-version-hist/arranquetejeduria-version-hist.component';


//Cortes Encogimiento EIQ
import { CortesEncogimientoComponent } from './components/cortes-encogimiento/cortes-encogimiento.component';
import { CortesMedidasComponent } from './components/cortes-encogimiento/cortes-medidas/cortes-medidas.component';
import { RegistroPartidaParihuelaComponent } from './components/registro-partida-parihuela/registro-partida-parihuela.component';
import { RealizarDespachoComponent } from './components/realizar-despacho/realizar-despacho.component';
import { QuejasReclamosComponent } from './components/quejas-reclamos/quejas-reclamos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CalificacionRollosProcesoComponent } from './components/calificacion-rollos-proceso/calificacion-rollos-proceso.component';
import { ModalSeleccionPartidaComponent } from './components/calificacion-rollos-proceso/modal-seleccion-partida.component';
import { ModalSeleccionPartidaFComponent } from './components/calificacion-rollos-final/modal-seleccion-partida.component';
import {ModalMetrosComponent} from './components/calificacion-rollos-proceso/modal-metros.component';
import {ModalMetrosFComponent} from './components/calificacion-rollos-final/modal-metros.component';
import { LecturaRollosEmbalajeComponent } from './components/lectura-rollos-embalaje/lectura-rollos-embalaje.component'
import { DialogVisorRegComponent } from './components/estatus-control-tenido/dialog-visor-reg/dialog-visor-reg.component';
import { EncogimientoPrendaComponent } from './components/confecciones/encogimiento-prenda/encogimiento-prenda.component';
import { DialogEncogimientoPrendaRegistroComponent } from './components/confecciones/encogimiento-prenda/dialog-encogimiento-prenda-registro/dialog-encogimiento-prenda-registro.component';
import { DialogEncogimientoPrendaMedidasComponent } from './components/confecciones/encogimiento-prenda/dialog-encogimiento-prenda-medidas/dialog-encogimiento-prenda-medidas.component';
import { DialogEncogimientoPrendaValorComponent } from './components/confecciones/encogimiento-prenda/dialog-encogimiento-prenda-valor/dialog-encogimiento-prenda-valor.component';

//Eventos
import { RegistroFirmasComponent } from './components/eventos/registro-firmas/registro-firmas.component';
import { RegistroEventosComponent } from './components/eventos/registro-eventos/registro-eventos.component';
import { DialogRegistroComponent } from './components/eventos/registro-eventos/dialog-registro/dialog-registro.component';
import { ConsultaRequisitoriaComponent } from './components/seguridad/consulta-requisitoria/consulta-requisitoria.component';
import { EntregaEventosComponent } from './components/eventos/entrega-eventos/entrega-eventos.component';

//Rondas
import { RegistroRondasComponent } from './components/seguridad/registro-rondas/registro-rondas.component';
import { DialogDetalleOcurrenciaComponent } from './components/seguridad/registro-rondas/dialog-detalle-ocurrencia/dialog-detalle-ocurrencia.component';
import { DialogRegistoOcurrenciaComponent } from './components/seguridad/registro-rondas/dialog-registo-ocurrencia/dialog-registo-ocurrencia.component';
import { ActivarSalidaComponent } from './components/control-activos-fijo/activar-salida/activar-salida.component';
import { ValidarSalidaComponent } from './components/control-activos-fijo/validar-salida/validar-salida.component';
import { ComiteEmergenciaComponent } from './components/actas/comite-emergencia/comite-emergencia.component';
import { DialogRegistarActaComponent } from './components/actas/comite-emergencia/dialog-registar-acta/dialog-registar-acta.component';
import { ValidaCorteDespachoComponent } from './components/auditoria-corte/valida-corte-despacho/valida-corte-despacho.component';
import { SalidaTiendaComponent } from './components/seguridad/salida-tienda/salida-tienda.component';
//Colgadores
import { CnfRegistroColgadoresComponent } from './components/cnf-registro-colgadores/cnf-registro-colgadores.component';
import { DialogRegistrarColgadoresComponent } from './components/cnf-registro-colgadores/dialog-registrar-colgadores/dialog-registrar-colgadores.component';
import { CnfRegistroUbicacionesComponent } from './components/cnf-registro-ubicaciones/cnf-registro-ubicaciones.component';
import { DialogRegistrarUbicacionesComponent } from './components/cnf-registro-ubicaciones/dialog-registrar-ubicaciones/dialog-registrar-ubicaciones.component';
import { CnfRegistroPresentacionComponent } from './components/cnf-registro-presentacion/cnf-registro-presentacion.component';
import { CnfRegistroColgadoresIngresoComponent } from './components/cnf-registro-colgadores-ingreso/cnf-registro-colgadores-ingreso.component';
import { CnfRegistroColgadoresIngresoDetalleComponent } from './components/cnf-registro-colgadores-ingreso/cnf-registro-colgadores-ingreso-detalle/cnf-registro-colgadores-ingreso-detalle.component';
import { CnfReubicacionColgadoresComponent } from './components/cnf-registro-colgadores-ingreso/cnf-reubicacion-colgadores/cnf-reubicacion-colgadores.component';
import { CnfReubicacionCajasComponent } from './components/cnf-registro-colgadores-ingreso/cnf-reubicacion-cajas/cnf-reubicacion-cajas.component';
import { CalificacionRollosFinalComponent } from './components/calificacion-rollos-final/calificacion-rollos-final.component';
import { LecturaRergistroQreComponent } from './components/lectura-rergistro-qre/lectura-rergistro-qre.component';
import { TiemposImproductivosv2Component } from './components/tiempos-improductivosv2/tiempos-improductivosv2.component';
import { ModalEditarDesgloseComponent } from './components/tiempos-improductivosv2/modal-editar-desglose/modal-editar-desglose.component';
import { ConfirmDialogComponent } from './components/tiempos-improductivosv2/confirm-dialog/confirm-dialog.component';
import { MemorandumGralComponent } from './components/memorandum-gral/memorandum-gral.component';
import { DialogMemorandumGralComponent } from './components/memorandum-gral/dialog-memorandum-gral/dialog-memorandum-gral.component';
import { QuejasReclamosv2Component } from './components/quejas-reclamosv2/quejas-reclamosv2.component';
import { DialogMemorandumGralEditComponent } from './components/memorandum-gral/dialog-memorandum-gral-edit/dialog-memorandum-gral-edit.component';
import { DialogMemorandumGralAddDetalleComponent } from './components/memorandum-gral/dialog-memorandum-gral-add-detalle/dialog-memorandum-gral-add-detalle.component';
import { DialogMemorandumSeguimientoComponent } from './components/memorandum-gral/dialog-memorandum-seguimiento/dialog-memorandum-seguimiento.component';
import { ModalSeleccionPartidaQrComponent } from './components/quejas-reclamos/modal-seleccion-partida-qr/modal-seleccion-partida-qr.component';
import { DialogMemorandumPlantaComponent } from './components/memorandum-gral/dialog-memorandum-planta/dialog-memorandum-planta.component';
import { LiberaOpColorComponent } from './components/auditoria-corte/libera-op-color/libera-op-color.component';
import { DialogColorComponent } from './components/auditoria-corte/libera-op-color/dialog-color/dialog-color.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AuditoriaLineaCosturaComponent,
    PrincipalComponent,
    SeguridadControlGuiaComponent,
    SeguridadControlGuiaSalidaComponent,
    SeguridadControlGuiaAccionComponent,
    SeguridadControlGuiaInternoComponent,
    SeguridadControlGuiaExternoComponent,
    SeguridadControlGuiaHistorialComponent,
    DespachoTelaCrudaComponent,
    DespachoTelaCrudaDetalleComponent,
    SeguridadControlMemorandumComponent,
    SeguridadControlMemorandumDetalleComponent,
    SeguridadControlVehiculoComponent,
    SeguridadControlVehiculoAccionComponent,
    SeguridadControlVehiculoIngresoComponent,
    SeguridadControlVehiculoHistorialComponent,
    SeguridadControlVehiculoSalidaComponent,
    SeguridadControlJabasComponent,
    SeguridadControlJabasAccionComponent,
    SeguridadControlJabasSalidaComponent,
    SeguridadControlJabasExternoComponent,
    SeguridadControlJabasInternoComponent,
    DialogJabaComponent,
    SeguridadControlJabasHistorialComponent,
    DefectosAlmacenDerivadosComponent,
    DialogDerivadosComponent,
    DialogEliminarComponent,
    DialogDerivadosModificarComponent,
    SeguridadControlVehiculoRegistroVehiculoComponent,
    SeguridadControlVehiculoRegistroConductorComponent,
    DialogVehiculoRegistrarComponent,
    ReporteDefectosAlmacenDerivadosComponent,
    DialogConfirmacionComponent,
    DialogVehiculoRegistrarVehiculoComponent,
    DialogDerivadosTotalComponent,
    MovimientoInspeccionComponent,
    ReporteDefectosTotalesDerivadosComponent,
    DialogDerivadosObservacionComponent,
    DialogDerivadosReportexdiaComponent,
    AuditoriaInspeccionCosturaComponent,
    DialogRegistrarCabeceraComponent,
    DialogRegistrarDetalleComponent,
    DialogListaDetalleComponent,
    AuditoriaDefectoDerivadoComponent,
    DialogListaSubDetalleComponent,
    DialogRegistrarSubDetalleComponent,
    SeguridadControlVehiculoReporteComponent,
    IngresoRolloTejidoComponent,
    IngresoRolloTejidoDetalleComponent,
    MenuItemComponent,
    AuditoriaHojaMedidaComponent,
    AuditoriaHojaMedidaDetalleComponent,
    SeguridadControlJabaComponent,
    DialogRegistrarCabeceraJabaComponent,
    RegistrarSeguridadControlJabaComponent,
    RegistrarDetalleSeguridadControlJabaComponent,
    DialogColorRegistrarDetalleComponent,
    DialogTallaRegistrarDetalleComponent,
    DialogCantidadRegistrarDetalleComponent,
    DialogAdicionalComponent,
    SeguridadControlMovimientosJabasComponent,
    SeguridadControlMovimientosJabasAccionComponent,
    DialogRegistrarEstadoControlMovmientosJabasComponent,
    DialogRegistroHojaMedidaComponent,
    DialogObservacionHojaMedidaComponent,
    ControlActivoFijoComponent,
    DespachoOpIncompletaComponent,
    DialogDespachoOpIncompletaComponent,
    InspeccionPrendaComponent,
    DialogDefectoComponent,
    DialogModificarComponent,
    PermitirGiradoOpComponent,
    DialogRegistrarGiradoOpComponent,
    InspeccionPrendaHabilitadorComponent,
    ReinspeccionPrendaComponent,
    DialogHabilitadorComponent,
    DialogDefectoAudiComponent,
    ReprocesoPartidaComponent,
    TelasComponent,
    TiempoImproductivoComponent,
    DialogConfirmacion2Component,
    DerivadoInspeccionPrendaComponent,
    MantenimientoWebComponent,
    AccesosUsuariosComponent,
    LoginComponent,
    EstilosLiquidarComponent,
    DialogVehiculoModificarKmComponent,
    MantenimientoJabasComponent,
    SeguridadActivoFijoReporteComponent,
    TiemposImproductivosComponent,
    DialogTiemposImproductivosComponent,
    EficienciaMaquinaTurnoComponent,
    DialogModificaTiemposImproductivosComponent,
    LiquidacionCorteComponent,
    DialogModificaTelasComponent,
    DialogDetallesCorteComponent,
    RegistrarPermisosComponent,
    TiposPermisosComponent,
    FormPermisosComponent,
    DialogIngresoEmpleadoComponent,
    FormComisionesComponent,
    DialogIngresoEmpleadoComisionComponent,
    FormRefrigerioComponent,
    DialogIngresoEmpleadorefrigerioComponent,
    PruebasComponent,
    LecturaPermisosComponent,
    DialogRegistroUsuariosComponent,
    InspeccionLiberacionPaqueteComponent,
    LecturaComisionesComponent,
    SeleccionarSedeComponent,
    SeleccionarSedeAccionComponent,
    //HUACHIPA
    UbicacionHilosAlmacenComponent,
    DialogUbicacionRegistrarComponent,
    LecturaBultosAlmacenComponent,
    DialogLecturaBultosComponent,
    DialogTranferBultosComponent,
    SeguimientoOrdenesAtencionComponent,
    DetalleSeguimientoOrdenComponent,
    ReporteLecturaPermisosComponent,
    RegistroManteMaquinasHilosComponent,
    DialogMantMaquiHiComponent,
    LecturaRefrigerioComponent,
    DialogDetalleTrabajadoresComponent,
    DialogModificaMantMaquiHiComponent,
    DialogObservacionesCorteComponent,
    SaldoDevolverIndicadorComponent,
    SaldoDevolverComponent,
    DialogObservacionesCorteComponent,
    VerAvancesComponent,
    VerRatioConsumoComponent,
    ConfeccionesAperturaTextilComponent,
    DialogObservacionAperturaComponent,
    RegistroCalidadTejeduriaComponent,
    DialogCuatroPuntosComponent,
    LaboratorioLecturaRecetasComponent,
    AsignarAreasUsuariosPermisosComponent,
    DialogAsignarAreasComponent,
    OperatividadFichaTecnicaComponent,
    DetallesOperatividadFichaComponent,
    DialogSelectUsuarioComponent,
    RolesUsuarioWebComponent,
    DetalleRolUsuarioComponent,
    DialogCrearRolWebComponent,
    AsignarRolesUsuarioComponent,
    ReportesInspeccionPrendaComponent,
    CrearNuevoRolUsuarioComponent,
    ModificarUsuarioWebComponent,
    MantenimientosCorreosComponent,
    ReporteInspeccionAuditoriaComponent,
    ProgramacionVacacionesComponent,
    HistorialVacacionesComponent,
    RecursosProgramacionVacacionesComponent,
    HistorialVacacionesRecursosComponent,
    ClaseActivosComponent,
    ColorActivosComponent,
    ControlActivosFijoComponent,
    HistorialControlActivosComponent,
    ActualizarActivoFijoComponent,
    RegistroMermaComponent,
    ControlMermaComponent,
    AgregarRegistroMermaComponent,
    ActualizarControlInternoComponent,
    ActasAcuerdoComponent,
    CrearNuevoActaComponent,
    AgregarParticipanteActaComponent,
    CrearParticipantesActaComponent,
    MemoddtComponent,
    DialogMemoddtComponent,
    DialogActasParticipantesComponent,
    DialogAgregarDescripcionComponent,
    InspeccionLecturaDerivadosComponent,
    ComercialCargaImagenesComponent,
    DialogCargarMostrarImgComponent,
    DialogMostrarImgComponent,
    ComercialImgHuachipaComponent,
    DialogCrearImagenesComponent,
    DialogTransferirImagenesComponent,
    FormatoCheckListComponent,
    DialogCrearCheckComponent,
    DialogEditarCheckComponent,
    DialogCheckRechazoComponent,
    DialogCheckInspeccionAudiComponent,
    AuditoriaHojaMedidaInspComponent,
    DialogObservacionHojaMedidaInspComponent,
    DialogRegistroHojaMedidaInspComponent,
    AuditoriaHojaMedidaDetalleInspComponent,
    DialogDetalleReprocesoComponent,
    DialogCrearReprocesoComponent,
    SeguimientoToberaComponent,
    LiquidacionPendientesComponent,
    GestionVisitasComponent,
    ReporteVisitasComponent,
    SeleccionarTipoVisitaComponent,
    CrearVisitaComponent,
    ConsultaVisitaComponent,
    ComedorEncuestaUsuarioComponent,
    FormPermisoDiaComponent,
    FormMiPermisoComponent,
    DialogPermisoDiaComponent,
    FormAprobacionPermisosComponent,
    FormTrabajadoresPermisosComponent,
    DialogCrearTrabajadorComponent,
    CrearPreguntasComedorComponent,
    MantenimientoPreguntasComponent,
    CrearCabPreguntasComponent,
    MantenimientoPreguntasDetComponent,
    ReporteEncuestaComponent,
    SeguridadRecalcularBonosComponent,
    DialogVerImagenComponent,
    GuiaContingenciaComponent,
    HistorialReposicionComponent,
    AprobacionReposicionComponent,
    AprobacionReposicionCalidadComponent,
    AprobacionReposicionCorteComponent,
    LecturaReposicionComponent,
    GenerarDespachoComponent,
    DialogCrearReposicionComponent,
    DialogAprobacionReposicionComponent,
    DialogGenerarDespachoComponent,
    DialogDetalleReposicionComponent,
    DialogRecepcionReposicionComponent,
    PantallaReposicionesComponent,
    RegistrarTransitoCosturaComponent,
    RegistrarTransitoCorteComponent,
    AlmacenTelasCorteComponent,
    AprobacionCalidadCorteComponent,
    VistaPreviaCheckComponent,
    DialogEditarReposicionComponent,
    AprobControlInternoComponent,
    DialogCheckOpComponent,
    //LecturaRegistroQrComponent,
    ModularInspeccionPrendaComponent,
    ModularInspeccionRecuperacionComponent,
    ModularAuditoriaModuloComponent,
    ModularAuditoriaSalidaComponent,
    ModularInspeccionHabilitadorComponent,
    ModularTicketHabilitadorComponent,
    ModularLiquidadorTransitoComponent,
    ModularMantInspectorasComponent,
    ModularInspeccionManualComponent,
    DialogConfirmarHabilitadorComponent,
    FormatosRhComponent,
    DialogDefectosModularComponent,
    DialogAprobRechOpComponent,
    DialigDefectosAuditoriaComponent,
    DialogDefectosRecuperacionComponent,
    ModularTicketRecuperacionComponent,
    ModalRecuperacionRecojoComponent,
    ModularDerivadosControlComponent,
    ModularDisgregarPrendaComponent,
    MantMaestroBolsaComponent,
    MantMaestroBolsaItemComponent,
    MantMaestroBolsaItemDetComponent,
    DialogMaestroBolsaItemComponent,
    DialogMantenimientoComponent,
    DialogGenerarPaqueteComponent,
    DialogMuestraPaquetesComponent,
    DialogImprimirTicketComponent,
    DialogMantenimientoComponent,
    LiberarOpComponent,
    ModularLiquidacionAdicionalComponent,
    DialogMaestroBolsaTransComponent,
    HipocampoComponent,
    AprobacionmuestraateComponent,
    //LecturacodigosComponent
    ModularReimpresionTicketComponent,
    ModularLiberarPaqueteComponent,
    ModularReporteInspeccionComponent,
    ModularReporteAuditoriaComponent,
    RegistroParaMaqTinto,
    FabriccardComponent,
    DialogAprobFabriccardComponent,
    ArranquetejeduriaComponent,
    DialogCreararranqueComponent,
    DialogModificararranqueComponent,
    DialogRecepFabriccardComponent,
    MantLecturaTicketComponent,
    DialogMaestroBolsaModificarComponent,
    DialogAgregarTallaComponent,
    DialogMaestroBolsaIteDetModificarComponent,
    MantenimientoJabaCocheComponent,
    DialogJabasCochesComponent,
    DialogAddUbicacionComponent,
    ControlJabaCochesComponent,
    CtrlJabaServicioComponent,
    AuditoriaLineaExternaComponent,
    AuditoriaFinalExternaComponent,
    DialogAuditoriaExternoComponent,
    DialogDetalleExternoComponent,
    DialogSubDetalleExternoComponent,
    DialogCabeceraExternoComponent,
    DialogRegistrarDetalleExtComponent,
    DialogRegistrarSubdetalleExtComponent,
    AuditoriaHojaMediaExtComponent,
    AuditoriaMedidaDetalleExtComponent,
    DialogAuditoriaMedidaExtComponent,
    PartidasPendientesEstadoRefComponent,
    PackingJabaGuiaComponent,
    HistorialPackJabaComponent,
    DialogDetallePackComponent,
    DialogConfirmacionEstampadoComponent,
    DialogDetalleIngresoPackComponent,
    DialogDetalleExternoCrearImagenesComponent,
    DialogDetalleExternoMostrarImagenesComponent,
    DialogVerImgenJabaComponent,
    CalificacionRolloCalComponent,
    ProduccionArtesListComponent,
    DialogProduccionArtesCrearComponent,
    ProduccionInspeccionListComponent,
    DialogProduccionInspeccionCrearComponent,
    DialogDetallePackComponent,
    SolicitudAgujasComponent,
    DialogAddSolicitudAgujasComponent,
    MantenimientoHoraComponent,
    DialogCabeceraHoraComponent,
    ModularReporteAuditoriaTicketComponent,
    FilterByValuePipe,
    ParticionRolloCalComponent,
    LiquidacionAviosCosturaComponent,
    DialogCabeceraLiquidacionComponent,
    DialogDetalleLiquidacionComponent,
    DialogRegistrarDetalleLiquidacionComponent,
    ModularReportesInspeccionDefectoPrendaComponent,
    RegistroCalidadOtComponent,
    DialogAuditoriaRegistroCalidadOtComponent,
    ModularReportesAuditoriaSalidaInspeccionComponent,
    DialogParticionTicketHabilitadorComponent,
    ModularReportesAuditoriaProcesoInspeccionComponent,
    DialogModificalongitudmallaComponent,
    DialogModificalongitudmalla2Component,
    ProduccionInspeccionSalidaListComponent,
    DialogProduccionInspeccionSalidaCrearComponent,
    DialogVerImagenInspeccionComponent,
    VistaPreviaAuditoriaExternaComponent,
    DialogCrearImagenesAuditoriaFinalComponent,
    DialogVerAuditoriaFinalComponent,
    DialogRegistrarDespachoComponent,
    ReversionAuditoriaFinalExternaComponent,
    DialogReversionDetalleExternoComponent,
    DialogActualizaReversionComponent,
    LiberarPartidaCalidadComponent,
    ModularPaqueteParticionComponent,
    HojaIngenieriaOperacionListComponent,
    DialogHojaIngenieriaOperacionCrearComponent,
    ReporteBolsasArteComponent,
    LecturaRolloExportacionComponent,
    LecturaRolloDespachoComponent,
    DialogBuscaclienteComponent,
    DialogCargaPrepackingComponent,
    DialogDetallePartidaRollosComponent,
    ReporteKardexJabasComponent,
    DialogVerPendientesComponent,
    CheckListIngresoCosturaComponent,
    DialogCabeceraChecklistCosturaComponent,
    DialogDetalleChecklistCosturaComponent,
    DialogRegistrarDetalleChecklistComponent,
    DialogChecklistDefectosCosturaComponent,
    DialogRegistrarDefectosCosturaComponent,
    DialogRegistrarDatosIngresoComponent,
    VistaPreviaChecklistDefectosComponent,
    ReporteJabasOpComponent,
    ReporteAlmacenArteComponent,
    DialogHojaIngenieriaOperacionVerComponent,
    AuditoriaIngresoCorteComponent,
    DialogAuditoriaIngresoCorteCabeceraComponent,
    AuditoriaAcabadosComponent,
    AuditoriaAcabadosDetalleComponent,
    DialogObservacionAcabadosMedidaComponent,
    DialogRegistroAcabadosMedidaComponent,
    DigitalizacionFichasComponent,
    DialogVisorFichasComponent,
    SafeUrlPipe,
    ProdTejeRectilineoComponent,
    ProdTejeRectilineoRegistroComponent,
    DialogAddProdTejeRectilineoComponent,
    CapacidadesComponent,
    DialogAddCapacidadesComponent,
    AuditoriaModuloAcabadoComponent,
    DialogCabeceraModuloAcabadoComponent,
    DialogDetalleModuloAcabadoComponent,
    DialogRegistrarDetalleModuloAcabadoComponent,
    DialogModuloDefectosComponent,
    DialogRegistrarModuloDefectosComponent,
    VistaPreviaModuloDefectosComponent,
    AuditoriaVaporizadoAcabadoComponent,
    DialogCabeceraVaporizadoAcabadoComponent,
    DialogDetalleVaporizadoAcabadoComponent,
    DialogRegistrarDetalleVaporizadoAcabadoComponent,
    DialogVaporizadoDefectosComponent,
    DialogRegistrarVaporizadoDefectosComponent,
    VistaPreviaVaporizadoDefectosComponent,
    RegistroFirmasAuditoriaComponent,
    DialogRegistroFirmasComponent,
    DialogCambioJabaComponent,
    BusquedaRollosPartidaComponent,
    LecturaQ2H4Component,
    ProgramaEmpastadoComponent,
    DialogProgramaEmpastadoComponent,
    BusquedaRollosPartidaComponent,
    AuditoriaSalidaAcabadoComponent,
    DialogRegistrarSalidaAcabadoComponent,
    DialogDefectosSalidaAcabadoComponent,
    DialogRegistrarDefectoSalidaAcabadoComponent,
    DialogVistaSalidaAcabadoComponent,
    AuditoriaEmpaqueAcabadoComponent,
    DialogVistaEmpaqueAcabadoComponent,
    DialogDefectosEmpaqueAcabadoComponent,
    DialogRegistarDefectoEmpaqueAcabadoComponent,
    DialogRegistarEmpaqueAcabadoComponent,
    DialogFirmaDigitalComponent,
    EstatusControlTenidoComponent,
    DialogCatalogoToberasComponent,
    DialogVisorImageComponent,
    DialogVisorPdfComponent,
    DialogVisorRegComponent,
    AuditoriaEmpaqueCajasComponent,
    DialogRegistroEmpaqueCajasComponent,
    DialogDefectosEmpaqueCajasComponent,
    DialogCantidadDefectosCajasComponent,
    DialogImagenEmpaqueCajasComponent,
    DialogResumenEmpaqueCajasComponent,
    AuditoriaProcesoCorteComponent,
    DialogAuditoriaProcesoCorteRegistroComponent,
    AuditoriaFinalCorteComponent,
    DialogAuditoriaFinalCorteRegistroComponent,
    DialogCombinacionComponent,
    DialogAgregarpasadaComponent,
    CargaEstructuraTejidoComponent,
    AuditoriaHojaMoldeComponent,
    DialogAuditoriaHojaMoldeRegistroComponent,
    DialogAuditoriaHojaMoldeMedidasComponent,
    AuditoriaHojaMoldeFinalComponent,
    DialogAuditoriaHojaFinalRegistroComponent,
    DialogAuditoriaHojaFinalMedidasComponent,
    ProgramacionAuditoriaComponent,
    DialogProgramacionAuditoriaRegistroComponent,
    ProgramacionAuditoriaSeguimientoComponent,
    DialogProgramacionAuditoriaMotivoComponent,
    DialogProgramacionAuditoriaReprogamaComponent,
    DialogProgramacionAuditoriaFechaComponent,
    CortesEncogimientoComponent,
    CortesMedidasComponent,
    RegistroPartidaParihuelaComponent, RealizarDespachoComponent,
    QuejasReclamosComponent,
    CalificacionRollosProcesoComponent,
    ModalSeleccionPartidaComponent,
    ModalMetrosComponent,
    ModalMetrosFComponent,
    ModalSeleccionPartidaFComponent,
    LecturaRollosEmbalajeComponent,

    CortesEncogimientoComponent, //Cortes Encogimiento EIQ
    ArranquetejeduriaVersionHistComponent,//Historial de Arranque de tejeduria Versión
    CnfRegistroColgadoresComponent,//Bandeja de configuracion de colgadores
    DialogRegistrarColgadoresComponent, //Dialogo de Crear Colgadores
    CnfRegistroUbicacionesComponent,//Bandeja y configuracion de Tipos de Ubicaciones
    DialogRegistrarUbicacionesComponent,
    CnfRegistroPresentacionComponent,//Presentacion MOBILE para colgadores.
    CnfRegistroColgadoresIngresoComponent,
    CnfRegistroColgadoresIngresoDetalleComponent,
    CnfReubicacionColgadoresComponent,
    CnfReubicacionCajasComponent,

    EncogimientoPrendaComponent,
    DialogEncogimientoPrendaRegistroComponent,
    CalificacionRollosFinalComponent,
    LecturaRergistroQreComponent,
    TiemposImproductivosv2Component,
    DialogEncogimientoPrendaMedidasComponent, DialogEncogimientoPrendaValorComponent, RegistroFirmasComponent, RegistroEventosComponent, DialogRegistroComponent, ConsultaRequisitoriaComponent,
    CalificacionRollosFinalComponent, EntregaEventosComponent, RegistroRondasComponent, DialogDetalleOcurrenciaComponent, DialogRegistoOcurrenciaComponent, ModalEditarDesgloseComponent, ConfirmDialogComponent,

    //Memorandum en GRAL
    MemorandumGralComponent,
    DialogMemorandumGralComponent,
    DialogMemorandumGralEditComponent,
    DialogMemorandumGralAddDetalleComponent,
    DialogMemorandumSeguimientoComponent,
    DialogMemorandumPlantaComponent,
    //Quejas y reclamos V2
    ModalSeleccionPartidaQrComponent,
    CalificacionRollosFinalComponent, EntregaEventosComponent, RegistroRondasComponent, DialogDetalleOcurrenciaComponent, DialogRegistoOcurrenciaComponent, ModalEditarDesgloseComponent, ConfirmDialogComponent, QuejasReclamosv2Component,
    ActivarSalidaComponent, ValidarSalidaComponent, ComiteEmergenciaComponent, DialogRegistarActaComponent, ValidaCorteDespachoComponent, SalidaTiendaComponent,
    DialogPendienteEmpaqueCajasComponent, 
    EncogimientoPrendaComponent, 
    DialogEncogimientoPrendaRegistroComponent, 
    DialogEncogimientoPrendaMedidasComponent, DialogEncogimientoPrendaValorComponent, RegistroFirmasComponent, RegistroEventosComponent, DialogRegistroComponent, ConsultaRequisitoriaComponent, EntregaEventosComponent, RegistroRondasComponent, DialogDetalleOcurrenciaComponent, DialogRegistoOcurrenciaComponent, ActivarSalidaComponent, ValidarSalidaComponent, ComiteEmergenciaComponent, DialogRegistarActaComponent, ValidaCorteDespachoComponent, SalidaTiendaComponent, LiberaOpColorComponent, DialogColorComponent 
  ],
  entryComponents: [DialogJabaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TextMaskModule,
    WebcamModule,
    NgSelectModule,
    AgGridModule,
    MatTooltipModule,
    NgxSpinnerModule,
    NgxChartsModule,
    MatSlideToggleModule,
    NgxImageZoomModule, // <-- Add this line
    //EditorModule,
    AngularEditorModule,
    ImageCropperModule,
    MatTooltipModule,
    BrowserModule,
    //ZXingScannerModule, //EIQ-2025-06-25
    BrowserModule,
    MatTableModule,
    MatIconModule,
    DragDropModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true

    }),
  ],


  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
    DatePipe
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

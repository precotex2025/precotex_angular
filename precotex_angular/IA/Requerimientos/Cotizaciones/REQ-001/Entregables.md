# Entregables

## Archivos modificados

- `src/app/components/cotizaciones/cotizaciones.component.scss` — paleta de tokens
  (`:host`), geometría de campo (radio 4px, alto 44px), toolbar, panel de criterios,
  tarjetas de resumen, tabla de costeo, panel de historial, barra de versión, botones
  (`.btn-azul/.btn-danger/.btn-success/.btn-ghost`), action bar flotante y modal de
  ajuste.
- `src/app/components/cotizaciones/cotizaciones.component.html` — toolbar simplificada
  (icono directo, sin círculo degradado) y `h3.cot-section-title` nuevo en el panel de
  criterios.
- `src/styles.scss` — valores del bloque `:root` de tokens compartidos del módulo
  (`--c-indigo-*`, `--c-neutral-*`, `--c-success/danger/warning/orange-*`, `--row-*`) y
  tema `.cot-swal-*` de SweetAlert, recoloreados a la paleta azul del ERP.

## Qué quedó fuera

- No se tocó `cotizaciones.component.ts`, services, interfaces ni models.
- La tabla de procesos y el diálogo de ajuste se recolorearon pero no se re-maquetaron
  (mismo markup, misma lógica de expandir/colapsar).
- Campos ocultos del formulario (detectados en Notas.md) siguen sin validar con el
  usuario — no se tocaron.
- No se creó paleta global nueva: los tokens siguen viviendo en el módulo, solo se
  recolorearon los valores de los tokens compartidos que ya existían en `styles.scss`.

## Verificación

- `npx tsc --noEmit -p tsconfig.app.json` — limpio.
- `npx ng build --configuration production` — limpio (exit code 0).
- Pendiente: revisión visual en navegador (filtros, tabla, historial, diálogo de ajuste,
  SweetAlert, responsive) — no se hizo `ng serve` en esta sesión.

## 16/08/2026 — Buscador de Clientes: limpieza, tipado y coherencia Cliente→Color

Rama `feature-jcalle-cotizaciones-buscador-clientes`.

### Archivos modificados

- `src/app/components/cotizaciones/cotizaciones.component.ts` — reordenado en bloques por
  concepto (Unidad de Negocio, Cliente, Recetas Antipilling, Color, todos debajo de
  `ngOnInit`); código muerto eliminado (`ClientesFiltrada`, `ColoresFiltrada`,
  `usarClientes()`, `filtrarClientes()`, `filtrarColores()`, controles `filtro`/
  `filtroColores`, propiedades sueltas sin uso); `dataClientes` tipado con
  `ClienteComboItem[]`; nuevo helper `limpiarSeleccionPrecio()` reutilizado por
  `onChangeColor()` y `reiniciaControles()`; `onChangeCliente()` ahora limpia Color,
  `listaCodigoColor` y el precio/SDC seleccionado al cambiar o limpiar el cliente;
  `reiniciaControles()` también limpia `listaCodigoColor`; `onBuscar()` valida los 6
  criterios con `Swal` antes de consultar; `validaCodigoColor()` pasa de `MatSnackBar` a
  `Swal` (`MostrarAdvertencia`); errores de precarga de Unidad, Tipo, Cliente, Recetas y
  Colores-por-cliente pasan de `console.log` a `MatSnackBar`.

### Archivos nuevos

- `src/app/interfaces/cotizaciones/response/obtiene-informacion-cliente-colgador.response.ts`
  — envelope tipado del endpoint `getObtieneInformacionClienteColgador`.
- `src/app/models/cotizaciones/cliente-combo.model.ts` — forma del item del `<ng-select>`
  Cliente (incluye `label`).
- Alta de ambos en `interfaces/cotizaciones/response/index.ts` y
  `models/cotizaciones/index.ts`.

### Qué quedó fuera

- `ProcesoColgadoresService` no se tocó (decisión del usuario: es compartido con
  `cnf-registro-colgadores`); el tipado del response se hace del lado del componente con
  `as ObtieneInformacionClienteColgadorResponse`.
- `getListaCentroCosto()`, `getLoadIntensidad()` y el combo de receta (`dataRecetas`) quedan
  igual — están reportados como posible código muerto en `Notas.md`, pendientes de confirmar
  con el usuario, no se tocaron en este cierre.
- `cotizaciones.component.html` no se modificó — el `<ng-select>` de Cliente ya estaba
  correcto.

### Verificación

- `npx tsc --noEmit -p tsconfig.app.json` — limpio.
- `npx ng build` — limpio (exit code 0; warnings preexistentes de SCSS de otro módulo y
  dependencias CommonJS de `canvg`, ajenos a este cambio).
- Pendiente: prueba manual en navegador (buscar con criterios incompletos, cambiar/limpiar
  Cliente y verificar que Color/precio se limpian, guardar con `cod_Cliente_Tex` correcto).

# Notas

## 05/08/2026

El mockup utiliza Bootstrap, pero el proyecto usa Angular Material.

---

El diseñador utilizó iconos FontAwesome.

En el ERP usamos Material Icons.

---

El JavaScript del mockup contiene animaciones.

No serán implementadas porque el cliente no las solicitó.

---

Se detectó que el formulario actual tiene muchos campos ocultos.

Pendiente validarlo con el usuario.

## 14/08/2026

Diseño anterior usaba paleta propia (violeta `#514f6b` + escala indigo/slate tipo
Tailwind) que no existe en ningún otro módulo del ERP.

Se cambió a la paleta que ya usa el resto del sistema: `#3f51b5` (primary del tema
Material prebuilt `indigo-pink`) y `#337ab7` (bordes/líneas de estructura). Superficies
`#ffffff` / `#f5f6fa`, texto `#212121`, bordes `#e0e0e0`, radio base 4px. Se descartaron
los gradientes decorativos (el ERP no los usa) y los `color-mix()` del SCSS (requerían
Chrome 111+, ya no hacían falta con hex fijos).

Se tomó como referencia de estructura `accesos-usuarios/registro-usuario-laboratorio`
("Estándar B" del proyecto): header con fondo de marca, cuerpo `#f5f6fa`, secciones en
card blanca con título uppercase 13px/600 en color de marca, footer de acciones con
`border-top` y botones de 42px / radio 6px.

Se agregó `h3.cot-section-title` ("Criterios de búsqueda") al panel de filtros, siguiendo
el patrón `.section-title` del estándar. Tabla, panel de historial y diálogo de ajuste se
recolorearon con los mismos tokens pero no se re-maquetaron.

Los tokens de la paleta viven solo en `cotizaciones.component.scss` (`:host`), no se creó
paleta global nueva — se mantuvieron los nombres de los tokens compartidos
(`--c-indigo-*`, `--row-*`, etc.) en `src/styles.scss` pero con los valores de la paleta
azul, para no romper los ~1800 usos existentes en el SCSS del módulo.

## 16/08/2026

Análisis del buscador de Cliente a pedido del usuario: se revisó `LoadClientes` (precarga
en `ngOnInit`, endpoint `getObtieneInformacionClienteColgador` de `ProcesoColgadoresService`,
no de `CotizacionesService`) y cómo `dataClientes` se reutiliza en todo el componente
(`<ng-select>`, `resumenCriterios`, guardado). Se detectaron tres defectos y bastante código
muerto heredado de una implementación previa con `mat-select` + filtro manual, migrada a
`<ng-select>` sin limpiar los restos.

Decisiones confirmadas con el usuario antes de tocar código:

- No se toca `ProcesoColgadoresService` (es compartido con `cnf-registro-colgadores`); el
  tipado del combo Cliente se hace del lado del componente con una interface/model nuevos.
- Al cambiar o limpiar el Cliente se limpian sus dependencias: Color, `listaCodigoColor` y
  el precio/SDC elegido (antes quedaban con datos del cliente anterior).
- `onBuscar()` ahora valida los 6 criterios (unidad, tipo, cliente, tela, ruta, color) antes
  de consultar; antes buscaba con el formulario vacío.
- Validaciones de formulario van con `Swal` (`MostrarAdvertencia`, ya existente). Los
  fallos de precarga de los combos del `ngOnInit` (Unidad, Tipo, Cliente, Recetas, Colores
  por cliente) van con `MatSnackBar`, para no interrumpir el arranque de la pantalla con un
  modal. El `Swal` de comunicación con el service en Buscar/Guardar no se tocó.
- El usuario pidió reordenar `cotizaciones.component.ts` en bloques por concepto, empezando
  por los 4 combos que se precargan en `ngOnInit`: cada bloque agrupa el método que precarga
  seguido de sus eventos/dependencias, con una cabecera de separador. Orden final:
  **UNIDAD DE NEGOCIO** → **CLIENTE** → **RECETAS ANTIPILLING** → **COLOR**, todo pegado
  debajo de `ngOnInit`. El resto del archivo (búsqueda, borrador, grilla, cálculo, guardado,
  helpers Swal) no se reordenó.

Código muerto eliminado: `ClientesFiltrada`, `ColoresFiltrada`, `usarClientes()`,
`filtrarClientes()`, `filtrarColores()`, controles `filtro`/`filtroColores` del `FormGroup`,
propiedades sueltas nunca leídas (`cliente`, `tipo`, `codigoTela`, `codigoColor`,
`descripcionColor`), y el parámetro `codigoCliente` de `LoadClientes` (nunca se invocaba con
valor).

**No se tocó** (reportado, no confirmado como pendiente real): `getListaCentroCosto()` y
`getLoadIntensidad()` no los llama nadie y no están en el HTML; `loadRecetas()` sí se llama
en `ngOnInit` pero `dataRecetas` tampoco se pinta en el HTML — el combo de receta no existe
hoy en la pantalla, aunque `global_CodReceta` sí viaja al guardar. Queda para una
conversación aparte con el usuario sobre si es funcionalidad pendiente o resto muerto.

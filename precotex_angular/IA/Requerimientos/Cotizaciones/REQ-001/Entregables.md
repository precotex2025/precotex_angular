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

Proyecto ERP.

Angular 13.

Arquitectura basada en componentes.

Los módulos están dentro de

app/components

Se utiliza Angular Material.

No utilizar Bootstrap.

No modificar componentes compartidos sin aprobación.

Mantener la apariencia del ERP.

---

# Stack

| Tecnología | Versión |
|---|---|
| Angular | 13.3.1 |
| Angular Material / CDK | 13.3.2 / 13.3.9 |
| RxJS | 7.5.5 |
| TypeScript | 4.6.3 |

Librerías en uso: sweetalert2 11, ngx-toastr 14.3, ngx-spinner 13.1, @ng-select 8.3,
ag-grid-angular 27.3, exceljs 4.3, moment 2.29, ngx-mask 13.1.

Compatibilidad con Angular 13 obligatoria. No uses APIs de versiones posteriores
(standalone components, `inject()`, signals, control flow `@if`).

---

# Configuración

`strict` de TypeScript está en **false**.

`strictTemplates` de Angular está en **true** — los desajustes de tipos en el HTML sí fallan.

No hay alias de rutas. Los imports son absolutos: `src/app/...`.

Las URLs del backend están en `src/app/VarGlobals.ts` (`GlobalVariable`), no en
`src/environments`.

---

# Restricciones

No agregar dependencias nuevas sin aprobación.

No modificar APIs, contratos ni reglas de negocio salvo que el requerimiento lo pida.

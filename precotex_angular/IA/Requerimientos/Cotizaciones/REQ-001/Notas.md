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

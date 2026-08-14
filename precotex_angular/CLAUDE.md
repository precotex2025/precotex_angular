# Precotex ERP — Frontend Angular

ERP textil. Angular 13. La carpeta `IA/` contiene el contexto de trabajo obligatorio.

## Antes de responder cualquier requerimiento

Lee siempre, en este orden:

| Archivo | Contiene | Cuándo leerlo |
|---|---|---|
| `IA/00-PROMPT-BASE.md` | Rol y forma de trabajar | Siempre |
| `IA/01-PROYECTO.md` | Stack, versiones, restricciones | Siempre |
| `IA/02-UX-RULES.md` | Reglas visuales y de UX | Si se toca HTML o SCSS |
| `IA/03-ARQUITECTURA.md` | Estructura de carpetas, interfaces, services, tipado | Si se toca TypeScript |

No asumas el contenido de estos archivos: léelos. Cambian.

## Barriles

Los módulos con varias interfaces o models se agrupan con `index.ts` (`export * from`).
Antes de importar algo de `interfaces/<modulo>/` o `models/<modulo>/`, revisa si ya existe
un barril e impórtalo desde la carpeta, no archivo por archivo. Detalle completo y ejemplo
en `IA/03-ARQUITECTURA.md`.

## Requerimientos

Cada requerimiento vive en:

```
IA/Requerimientos/<Modulo>/REQ-00X/
├── REQ.md          ← objetivo, alcance, restricciones
├── Notas.md        ← decisiones y hallazgos durante el desarrollo
├── Entregables.md  ← qué se entregó al cerrar
├── Capturas/       ← estado actual y propuesta
└── Mockup/         ← referencia visual (HTML/CSS/JS)
```

Cuando se mencione un `REQ-00X`: lista la carpeta, lee lo que exista y **mira las imágenes**
de `Capturas/` y `Mockup/` con la herramienta Read (lee imágenes directamente).

### Requerimientos incompletos

Muchos REQ llegan con lo mínimo — a veces **solo una captura y ninguna descripción**. Es lo
normal, no un error. En ese caso:

1. Lee las imágenes disponibles y describe **lo que entiendes** del requerimiento.
2. Redacta un borrador de `REQ.md` con esa interpretación: objetivo, alcance, restricciones.
3. **Preséntalo y espera aprobación antes de escribir código.**
4. Con el visto bueno, guarda el `REQ.md` en la carpeta del requerimiento y recién ahí implementa.

Nunca deduzcas reglas de negocio de una imagen. Colores, orden de campos y espaciado sí se
infieren de una captura; qué hace un botón o cuándo se habilita, no. Eso se pregunta.

Usa `IA/Requerimientos/_PLANTILLA/REQ.md` como base.

### Mockups

Son **referencia visual**, no código a copiar. Suelen venir en Bootstrap y FontAwesome; hay
que traducirlos a Angular Material y Material Icons. Las animaciones no se implementan salvo
que el requerimiento las pida.

### Al cerrar

Actualiza `Notas.md` (decisiones tomadas, hallazgos, pendientes) y `Entregables.md`
(qué archivos se tocaron, qué quedó fuera).

## Cómo se trabaja un requerimiento

1. **Leer** — los archivos de `IA/` que apliquen, más la carpeta del REQ completa.
2. **Analizar** — leer el código real que se va a tocar. No suponer cómo está escrito.
3. **Proponer** — plan por fases, cada una compilando por su cuenta. Esperar aprobación.
4. **Implementar** — en una rama nueva, nunca directo sobre la rama en curso.
5. **Verificar** — `npx tsc --noEmit -p tsconfig.app.json` limpio.
6. **Cerrar** — actualizar `Notas.md` y `Entregables.md`. El merge lo hace el usuario a mano.

## Git

El trabajo va **siempre en una rama nueva**, nunca directo sobre la rama en curso:

```bash
git checkout -b feature-jcalle-<tema>
```

Commitea solo los archivos del requerimiento, nombrándolos uno por uno. Nunca `git add .`
ni `git add -A` — el working tree suele tener trabajo de otra tarea sin commitear.

Verifica con `git status` antes de cada commit. El merge lo hace el usuario a mano.

## Verificación

```bash
npx tsc --noEmit -p tsconfig.app.json   # type-check rápido, es la comprobación principal
npx ng build                            # build completo
```

`strictTemplates` está activo: un desajuste entre tipos del `.ts` y el `.html` sale como
error de build. En cambio `strict` de TypeScript está en `false`, así que un `null` mal
tipado **no** dará error — revísalo a ojo.

`tsconfig.spec.json` tiene 4 errores preexistentes en otros módulos (`app.component.spec.ts`,
`vista-previa-auditoria-externa`, `dialog-maestro-bolsa-item.service`,
`lectura-registro-qre.service`). No son tuyos; no intentes arreglarlos salvo que se pida.

## Reglas duras

- No romper funcionalidad existente.
- **En archivos que ya existen, el código nuevo va al final del archivo**, no intercalado.
- No modificar APIs, contratos ni reglas de negocio salvo que el requerimiento lo pida.
- No tocar componentes compartidos sin aprobación.
- No introducir Bootstrap. El proyecto usa Angular Material.
- No agregar dependencias nuevas sin aprobación.
- Analizar antes de escribir código. Identificar riesgos primero.

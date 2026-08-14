# Arquitectura y convenciones de código

## Estructura de carpetas

Cada módulo se replica con el mismo nombre en las cuatro carpetas raíz:

```
src/app/
├── components/<modulo>/     ← .component.ts | .html | .scss | .spec.ts
├── services/<modulo>/       ← <modulo>.service.ts
├── interfaces/<modulo>/     ← contratos de API
│   ├── request/             ← lo que sale hacia el backend
│   └── response/            ← lo que llega del backend
└── models/<modulo>/         ← modelos que solo viven en la UI
```

**Interfaces vs models** — la regla práctica:

> Si el tipo desaparecería al cambiar de backend → `interfaces/`.
> Si sobreviviría → `models/`.

`interfaces/` refleja el contrato tal cual llega, incluido el casing raro del backend
(`corR_CARTA`, `preC_TINTO`, `pro_Hover`). No lo normalices ahí.
`models/` contiene estado de pantalla y datos ya normalizados.

**Naming:** `<endpoint-kebab>.request.ts`, `<endpoint-kebab>.response.ts`, `<nombre>.model.ts`.

## Barriles (index.ts)

Cada módulo usa barriles para agrupar sus interfaces y models — evita imports profundos
repetidos en cada componente/service que consume el módulo.

- Un `index.ts` por carpeta hoja (`interfaces/<modulo>/request/`, `interfaces/<modulo>/response/`,
  `models/<modulo>/`) con `export * from './archivo'`, uno por archivo, orden alfabético.
- Un `index.ts` combinado en `interfaces/<modulo>/` que reexporta `request` + `response`, para
  que el consumidor pida ambos con un solo import.
- `services/<modulo>/` y `components/<modulo>/` **no** llevan barril — normalmente es un solo
  archivo por módulo, un `index.ts` ahí no agrupa nada.

Import correcto: `from 'src/app/interfaces/<modulo>'` (la carpeta resuelve el `index.ts` sola).
**Nunca** escribas el sufijo `/index` explícito en el import — es ruido, y si el barril cambia
de nombre de archivo, ese import no lo notaría de la misma forma.

Antes de fusionar dos barriles con `export *`, confirma que no hay nombres de tipo repetidos
entre ambas carpetas — con `export *` una colisión no es error de compilación, es un tipo que
gana silenciosamente sobre el otro.

Referencia viva: `src/app/interfaces/cotizaciones/` y `src/app/models/cotizaciones/`.

**Sin alias de rutas.** `tsconfig.json` tiene `baseUrl: "./"` y ningún `paths`.
Los imports van absolutos desde la raíz: `import { X } from 'src/app/...'`.

Referencia viva: el módulo `cotizaciones` (`src/app/interfaces/cotizaciones/`,
`src/app/models/cotizaciones/`) y `accesos-usuarios/registro-usuario-laboratorio`.

## Código nuevo en archivos existentes

Cuando el componente, service o interface **ya existe**, el código nuevo va **al final del
archivo**, no intercalado entre lo que ya está.

- Métodos nuevos: al final de la clase.
- Propiedades nuevas: al final del bloque de propiedades.
- Interfaces nuevas en un archivo existente: al final del archivo.

Motivo: mantiene el diff pequeño y localizado, y evita conflictos de merge cuando varias
personas tocan el mismo archivo. Reordenar o reagrupar código existente solo si el
requerimiento lo pide de forma explícita.

## Interfaces

Una response por endpoint. Cada archivo exporta el ítem y el envelope explícito:

```ts
export interface PrecioXColorItem {
  corR_CARTA: string;
  preC_TINTO: number;
}

export interface ListaPrecioXColorResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: PrecioXColorItem[];
}
```

**No usar `ApiResponse<T>` genérico.** Cada response declara su envelope. Es más verboso,
pero cuando un endpoint cambia se ve exactamente a quién afecta.

Request interface solo para métodos con 2 o más parámetros. Un GET de un parámetro recibe
el primitivo directamente.

Si el contrato no está confirmado, declara los campos que el componente realmente consume
y marca los dudosos como opcionales, con un comentario que diga que está pendiente.

## Services

```ts
@Injectable({ providedIn: 'root' })
export class MiService {
  private readonly baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  private readonly endpoint = 'txMiModulo';
  private readonly headers = new HttpHeaders({ 'Content-type': 'application/json' });

  constructor(private readonly http: HttpClient) {}

  private readonly handleError = (error: HttpErrorResponse): Observable<never> =>
    throwError(() => new Error(
      error?.error?.message ?? error.message ?? 'Error de comunicación con el servidor'
    ));

  private buildParams(request: Record<string, string | number | boolean>): HttpParams {
    let params = new HttpParams();
    Object.entries(request).forEach(([key, value]) => { params = params.append(key, value); });
    return params;
  }

  getAlgo(request: AlgoRequest): Observable<AlgoResponse> {
    const params = this.buildParams({ ...request });
    return this.http
      .get<AlgoResponse>(`${this.baseUrlTinto}${this.endpoint}/getAlgo`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }
}
```

Reglas:

- Todo método devuelve `Observable<XxxResponse>` tipado. Nunca `Observable<Object>`.
- **Mismo pipe en todos los métodos**: `retry(1), catchError(this.handleError)`.
  En POST omite el `retry` — no se reintenta una escritura.
- `throwError(() => ...)` es la forma de RxJS 7. No uses la firma vieja.
- Las URLs base salen de `GlobalVariable` en `src/app/VarGlobals.ts`.
- El service no muestra mensajes ni spinners. Eso es del componente.

Referencia: `src/app/services/cotizaciones/cotizaciones.service.ts`.

## Componentes

- Tipa los campos que tengan interfaz. Los residuales pueden quedar en `any` — es preferible
  a inventar un tipo que no refleje la realidad.
- Las interfaces **no** se declaran dentro del `.component.ts`. Van en `interfaces/` o `models/`.
- Feedback al usuario con **SweetAlert2** (`Swal.fire`). Es lo que se usa en los módulos nuevos.
- No dejes bloques de código comentado. Si no se usa, se borra: para eso está git.

## Antes de dar por terminado

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Debe salir limpio. Si tocaste HTML, `strictTemplates` lo valida ahí mismo.

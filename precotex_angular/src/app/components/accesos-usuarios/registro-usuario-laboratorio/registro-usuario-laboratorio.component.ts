import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { switchMap, finalize, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RegistroUsuarioLaboratorioService } from 'src/app/services/accesos-usuarios/registro-usuario-laboratorio/registro-usuario-laboratorio.service';
import { UsuarioLabDialogData, UsuarioLabFila } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/request/usuario-lab-dialog.data';
import { AccionMantenimiento, MantenimientoUsuarioLabRequest } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/request/mantenimiento-usuario-lab.request';
import { AsignarPerfilUsuarioLabRequest } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/request/asignar-perfil-usuario-lab.request';
import { ListarPerfilesLabResponse, PerfilLab, PerfilLabItem } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/response/listar-perfiles-lab.response';

const MSG = {
  ERROR_LISTAR_PERFILES: 'No se pudo obtener la lista de perfiles',
  ERROR_MANTENIMIENTO: 'No se pudo registrar el usuario en seguridad',
  ERROR_ASIGNAR: 'No se pudo asignar el perfil de laboratorio',
  EXITO_ASIGNAR: 'Usuario asignado al Laboratorio correctamente',
  PERFIL_REQUERIDO: 'Debes seleccionar un Perfil de Laboratorio',
  USUARIO_INACTIVO: 'El usuario está inactivo. No se puede asignar ni actualizar el perfil de laboratorio.'
} as const;

@Component({
  selector: 'app-registro-usuario-laboratorio',
  templateUrl: './registro-usuario-laboratorio.component.html',
  styleUrls: ['./registro-usuario-laboratorio.component.scss']
})
export class RegistroUsuarioLaboratorioComponent implements OnInit, OnDestroy {

  codUsuario: string = '';
  nomUsuario: string = '';
  codTrabajador: string = '';
  empresa: string = '';
  flgActivo: number = 0;
  tipTrabajador: string = '';
  password: string = '';

  perfilSeleccionado: string | null = null;
  guardando: boolean = false;

  // Array público normalizado: alimenta el combo y el chip de estado del título
  perfiles: PerfilLab[] = [];
  perfilAsignadoInicial: string | null = null;
  perfilAsignadoDescripcion: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<RegistroUsuarioLaboratorioComponent>,
    private readonly registroUsuarioLaboratorioService: RegistroUsuarioLaboratorioService,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioLabDialogData
  ) { }

  ngOnInit(): void {
    this.cargarDatosUsuario(this.data?.data);
    this.onListarPerfilesLab();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cerrarCargando();
  }

  private cargarDatosUsuario(fila: UsuarioLabFila | string | undefined): void {
    if (typeof fila === 'string') {
      this.codUsuario = fila;
      return;
    }
    if (!fila) {
      return;
    }
    this.codUsuario = fila.Cod_Usuario || '';
    this.nomUsuario = fila.Nom_usuario || '';
    this.codTrabajador = fila.Cod_Trabajador || '';
    this.empresa = fila.Empresa || '';
    this.flgActivo = this.aFlagActivo(fila.Flg_Activo);
    this.tipTrabajador = fila.Tip_Trabajador || '';
    this.password = fila.Password || '';
    this.perfilAsignadoInicial = fila.Cod_PerfilUsuarioLab ?? null;
  }

  // Contrato del backend: Flg_Activo siempre es 0 ó 1. Vacío/null/undefined se lee como inactivo (0).
  private aFlagActivo(valor: unknown): number {
    return Number(valor) === 1 ? 1 : 0;
  }

  // El contrato exacto del endpoint no está confirmado: se toleran distintas convenciones de nombre.
  // Uso interno solo al normalizar la respuesta (una vez), no desde el template.
  private codPerfil(p: PerfilLabItem): string {
    return String(p?.Cod_PerfilUsuarioLab ?? p?.cod_PerfilUsuarioLab ?? p?.codigo ?? p?.id ?? '').trim();
  }

  private desPerfil(p: PerfilLabItem): string {
    return String(p?.Des_PerfilUsuarioLab ?? p?.des_PerfilUsuarioLab ?? p?.descripcion ?? p?.nombre ?? '').trim();
  }

  private normalizarPerfiles(respuesta: ListarPerfilesLabResponse): PerfilLab[] {
    const elementos = respuesta.totalElements > 0 ? respuesta.elements : [];
    return elementos.map(p => ({
      codigo: this.codPerfil(p),
      descripcion: this.desPerfil(p)
    }));
  }

  private aplicarPerfilAsignado(): void {
    const asignado = this.perfiles.find(p =>
      p.codigo === String(this.perfilAsignadoInicial ?? '').trim());
    if (asignado) {
      this.perfilSeleccionado = asignado.codigo;
      this.perfilAsignadoDescripcion = asignado.descripcion;
    }
  }

  private mensajeDeError(err: HttpErrorResponse | Error, respaldo: string): string {
    if (err instanceof HttpErrorResponse) {
      return err.error?.message || respaldo;
    }
    return err.message || respaldo;
  }

  get iniciales(): string {
    const partes = (this.nomUsuario || '').trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '--';
    return partes.length === 1
      ? partes[0].substring(0, 2).toUpperCase()
      : (partes[0][0] + partes[1][0]).toUpperCase();
  }

  get estaAsignado(): boolean {
    return !!this.perfilAsignadoDescripcion;
  }

  get esActivo(): boolean {
    return this.flgActivo === 1;
  }

  // Usuario inactivo: modo solo-consulta, ninguna escritura permitida.
  get bloqueado(): boolean {
    return !this.esActivo;
  }

  /* ---------- SweetAlert2: helpers de feedback ---------- */

  private mostrarCargando(titulo = 'Cargando...', texto = 'Por favor espere.'): void {
    Swal.fire({
      title: titulo,
      text: texto,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
  }

  private cerrarCargando(): void {
    if (Swal.isVisible()) {
      Swal.close();
    }
  }

  private mostrarExito(mensaje: string): void {
    Swal.fire({ icon: 'success', title: 'Listo', text: mensaje, timer: 2000, showConfirmButton: false });
  }

  private mostrarError(mensaje: string): void {
    Swal.fire({ icon: 'error', title: 'Error', text: mensaje, confirmButtonColor: '#3085d6' });
  }

  onListarPerfilesLab(): void {
    this.mostrarCargando('Cargando perfiles...', 'Por favor espere.');

    this.registroUsuarioLaboratorioService.getListarPerfilesLab()
      .pipe(
        finalize(() => this.cerrarCargando()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: respuesta => {
          if (!respuesta.success) {
            this.perfiles = [];
            this.mostrarError(respuesta.message || MSG.ERROR_LISTAR_PERFILES);
            return;
          }
          this.perfiles = this.normalizarPerfiles(respuesta);
          this.aplicarPerfilAsignado();
        },
        error: (err: HttpErrorResponse) => {
          this.perfiles = [];
          this.mostrarError(this.mensajeDeError(err, MSG.ERROR_LISTAR_PERFILES));
        }
      });
  }

  cancelar(): void {
    if (this.guardando) {
      return;
    }
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.bloqueado) {
      this.mostrarError(MSG.USUARIO_INACTIVO);
      return;
    }
    if (!this.perfilSeleccionado) {
      this.mostrarError(MSG.PERFIL_REQUERIDO);
      return;
    }

    const yaAsignado = !!String(this.perfilAsignadoInicial ?? '').trim();

    const requestRegistro: MantenimientoUsuarioLabRequest = {
      Accion: yaAsignado ? AccionMantenimiento.Actualizar : AccionMantenimiento.Insertar,
      Cod_Usuario: this.codUsuario,
      Nom_Usuario: this.nomUsuario,
      Password: this.password,
      Tip_Trabajador: this.tipTrabajador,
      Cod_Trabajador: this.codTrabajador,
      Acc_Cod: this.perfilSeleccionado
    };

    const mantenimiento$ = yaAsignado
      ? this.registroUsuarioLaboratorioService.putMantenimientoUsuarioLab(requestRegistro)
      : this.registroUsuarioLaboratorioService.postMantenimientoUsuarioLab(requestRegistro);

    this.mostrarCargando('Guardando...', 'Asignando perfil de laboratorio.');
    this.guardando = true;

    mantenimiento$
      .pipe(
        switchMap(respMantenimiento => {
          if (!respMantenimiento.success) {
            return throwError(() => new Error(respMantenimiento.message || MSG.ERROR_MANTENIMIENTO));
          }
          const dataAsignar: AsignarPerfilUsuarioLabRequest = {
            Cod_Usuario: this.codUsuario,
            Cod_PerfilUsuarioLab: this.perfilSeleccionado as string
          };
          return this.registroUsuarioLaboratorioService.putAsignarPerfilUsuarioLab(dataAsignar);
        }),
        finalize(() => {
          this.cerrarCargando();
          this.guardando = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: respAsignar => {
          if (!respAsignar.success) {
            this.mostrarError(respAsignar.message || MSG.ERROR_ASIGNAR);
            return;
          }
          this.mostrarExito(respAsignar.message || MSG.EXITO_ASIGNAR);
          this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse | Error) => this.mostrarError(this.mensajeDeError(err, MSG.ERROR_ASIGNAR))
      });
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistroUsuarioLaboratorioService } from 'src/app/services/accesos-usuarios/registro-usuario-laboratorio.service';

interface data {
  data: any
}

interface RegistrarUsuarioLabRequest {
  Accion: string;
  Cod_Usuario: string;
  Nom_Usuario: string;
  Password: string;
  Tip_Trabajador: string;
  Cod_Trabajador: string;
  Acc_Cod: string;
}

export interface PerfilLab {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-registro-usuario-laboratorio',
  templateUrl: './registro-usuario-laboratorio.component.html',
  styleUrls: ['./registro-usuario-laboratorio.component.scss']
})
export class RegistroUsuarioLaboratorioComponent implements OnInit {

  codUsuario: string = '';
  nomUsuario: string = '';
  codTrabajador: string = '';
  empresa: string = '';
  flgActivo: number | null = null;
  tipTrabajador: string = '';
  password: string = '';

  perfilSeleccionado: string | null = null;
  guardando: boolean = false;

  // Array público normalizado: alimenta el combo y el chip de estado del título
  perfiles: PerfilLab[] = [];
  perfilAsignadoInicial: string | null = null;
  perfilAsignadoDescripcion: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<RegistroUsuarioLaboratorioComponent>,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private registroUsuarioLaboratorioService: RegistroUsuarioLaboratorioService,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) { }

  ngOnInit(): void {
    const fila = this.data?.data;

    if (typeof fila === 'string') {
      this.codUsuario = fila;
    } else if (fila) {
      this.codUsuario = fila.Cod_Usuario || '';
      this.nomUsuario = fila.Nom_usuario || '';
      this.codTrabajador = fila.Cod_Trabajador || '';
      this.empresa = fila.Empresa || '';
      this.flgActivo = fila.Flg_Activo !== null && fila.Flg_Activo !== undefined ? Number(fila.Flg_Activo) : null;
      this.tipTrabajador = fila.Tip_Trabajador || '';
      this.password = fila.Password || '';
      this.perfilAsignadoInicial = fila.Cod_PerfilUsuarioLab ?? null;
    }

    this.onListarPerfilesLab();
  }

  // El contrato exacto del endpoint no está confirmado: se toleran distintas convenciones de nombre.
  // Uso interno solo al normalizar la respuesta (una vez), no desde el template.
  private codPerfil(p: any) {
    return p?.Cod_PerfilUsuarioLab ?? p?.cod_PerfilUsuarioLab ?? p?.codigo ?? p?.id;
  }

  private desPerfil(p: any) {
    return p?.Des_PerfilUsuarioLab ?? p?.des_PerfilUsuarioLab ?? p?.descripcion ?? p?.nombre;
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

  onListarPerfilesLab() {
    this.spinnerService.show();
    this.registroUsuarioLaboratorioService.getListarPerfilesLab().subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        if (response.success) {
          const elements = response.totalElements > 0 ? response.elements : [];
          this.perfiles = elements.map((p: any) => ({
            codigo: String(this.codPerfil(p) ?? '').trim(),
            descripcion: String(this.desPerfil(p) ?? '').trim()
          }));
          const asignado = this.perfiles.find(p =>
            p.codigo === String(this.perfilAsignadoInicial ?? '').trim());
          if (asignado) {
            this.perfilSeleccionado = asignado.codigo;
            this.perfilAsignadoDescripcion = asignado.descripcion;
          }
        } else {
          this.perfiles = [];
          this.matSnackBar.open(response.message || 'No se pudo obtener la lista de perfiles', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.perfiles = [];
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  guardar() {
    if (!this.perfilSeleccionado) {
      this.matSnackBar.open('Debes seleccionar un Perfil de Laboratorio', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      return;
    }

    const yaAsignado = !!String(this.perfilAsignadoInicial ?? '').trim();

    const requestRegistro: RegistrarUsuarioLabRequest = {
      Accion: yaAsignado ? 'U' : 'I',
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

    this.guardando = true;
    this.spinnerService.show();
    mantenimiento$.subscribe({
      next: (registroResponse: any) => {
        if (!registroResponse.success) {
          this.spinnerService.hide();
          this.guardando = false;
          this.matSnackBar.open(registroResponse.message || 'No se pudo registrar el usuario en seguridad', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          return;
        }

        const dataAsignar: any = {
          "Cod_Usuario": this.codUsuario,
          "Cod_PerfilUsuarioLab": this.perfilSeleccionado,
        };

        this.registroUsuarioLaboratorioService.putAsignarPerfilUsuarioLab(dataAsignar).subscribe({
          next: (asignarResponse: any) => {
            this.spinnerService.hide();
            this.guardando = false;
            if (asignarResponse.success) {
              this.matSnackBar.open(asignarResponse.message || 'Usuario asignado al Laboratorio correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
              this.dialogRef.close(true);
            } else {
              this.matSnackBar.open(asignarResponse.message || 'No se pudo asignar el perfil de laboratorio', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            }
          },
          error: (err: HttpErrorResponse) => {
            this.spinnerService.hide();
            this.guardando = false;
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.guardando = false;
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      }
    });
  }

}

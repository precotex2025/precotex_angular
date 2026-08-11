import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistroUsuarioLaboratorioService } from 'src/app/services/accesos-usuarios/registro-usuario-laboratorio.service';

interface data {
  data: any
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

  perfilSeleccionado: string | null = null;
  observaciones: string = '';
  guardando: boolean = false;

  perfiles: any[] = [];

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
    }

    this.onListarPerfilesLab();
  }

  // El contrato exacto del endpoint no está confirmado: se toleran distintas convenciones de nombre.
  codPerfil(p: any) {
    return p?.Cod_PerfilUsuarioLab ?? p?.cod_PerfilUsuarioLab ?? p?.codigo ?? p?.id;
  }

  desPerfil(p: any) {
    return p?.Des_PerfilUsuarioLab ?? p?.des_PerfilUsuarioLab ?? p?.descripcion ?? p?.nombre;
  }

  onListarPerfilesLab() {
    this.spinnerService.show();
    this.registroUsuarioLaboratorioService.getListarPerfilesLab().subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        if (response.success) {
          this.perfiles = response.totalElements > 0 ? response.elements : [];
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
    
    let data: any = {
      "Cod_Usuario": this.codUsuario,
      "Cod_PerfilUsuarioLab"          : this.perfilSeleccionado,
    };

    this.guardando = true;
    this.spinnerService.show();
    this.registroUsuarioLaboratorioService.putAsignarPerfilUsuarioLab(data).subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        this.guardando = false;
        if (response.success) {
          this.matSnackBar.open(response.message || 'Usuario asignado al Laboratorio correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          this.dialogRef.close(true);
        } else {
          this.matSnackBar.open(response.message || 'No se pudo asignar el perfil de laboratorio', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.guardando = false;
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      }
    });
  }

}

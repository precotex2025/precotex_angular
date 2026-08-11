import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  perfilSeleccionado: number | null = null;
  observaciones: string = '';

  perfiles = [
    { id: 1, nombre: 'Analista de Laboratorio' },
    { id: 2, nombre: 'Supervisor de Laboratorio' },
    { id: 3, nombre: 'Consulta' },
    { id: 4, nombre: 'Administrador de Laboratorio' }
  ];

  constructor(
    private dialogRef: MatDialogRef<RegistroUsuarioLaboratorioComponent>,
    private matSnackBar: MatSnackBar,
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
  }

  cancelar() {
    this.dialogRef.close();
  }

  guardar() {
    if (!this.perfilSeleccionado) {
      this.matSnackBar.open('Debes seleccionar un Perfil de Laboratorio', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      return;
    }

    // TODO: reemplazar por llamada al servicio cuando exista el endpoint de asignación de usuario a BD de laboratorio.
    const payload = {
      codUsuario: this.codUsuario,
      perfil: this.perfilSeleccionado,
      observaciones: this.observaciones
    };

    this.matSnackBar.open('Usuario asignado al Laboratorio correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
    this.dialogRef.close(payload);
  }

}

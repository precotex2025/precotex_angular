import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-metros',
  template: `
    <h2 mat-dialog-title>Ingresar metros</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Metros</mat-label>
        <input matInput type="text" [(ngModel)]="metros" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-button color="primary" (click)="confirmar()">Aceptar</button>
    </mat-dialog-actions>
  `
})
export class ModalMetrosComponent {
  metros: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalMetrosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancelar(): void {
    this.dialogRef.close();
  }

  confirmar(): void {
    this.dialogRef.close(this.metros);
  }
}

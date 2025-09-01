import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-metros',
  template: `
    <h2 mat-dialog-title>Ingresar metros</h2>
    <mat-dialog-content [formGroup]="formulario">

      <!-- Campo Metros -->
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Metros</mat-label>
        <input matInput type="number" formControlName="metros" />
        <mat-error *ngIf="formulario.get('metros')?.hasError('required')">
          Este campo es obligatorio.
        </mat-error>
      </mat-form-field>

      <!-- Campo Cantidad -->
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Cant. Defectos</mat-label>
        <input matInput type="number" formControlName="cantidad" />
        <mat-error *ngIf="formulario.get('cantidad')?.hasError('required')">
          Este campo es obligatorio.
        </mat-error>
      </mat-form-field>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-button color="primary" (click)="confirmar()">Aceptar</button>
    </mat-dialog-actions>
  `
})
export class ModalMetrosFComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalMetrosFComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
        // Crear formulario con validaciones
    this.formulario = this.fb.group({
      metros: [null, Validators.required],
      cantidad: [null, Validators.required]
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  confirmar(): void {
    // Validar formulario
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // Marca todos los campos para mostrar errores
      return;
    }else {
      //Si es válido, enviamos los datos al padre
      this.dialogRef.close(this.formulario.value);
    }
  }
}

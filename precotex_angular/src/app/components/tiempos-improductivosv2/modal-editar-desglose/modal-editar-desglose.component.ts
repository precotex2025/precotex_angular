import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalificacionRollosProcesoService } from 'src/app/services/calificacion-rollos-proceso.service';

@Component({
  selector: 'app-modal-editar-desglose',
  templateUrl: './modal-editar-desglose.component.html',
  styleUrls: ['./modal-editar-desglose.component.scss']
})
export class ModalEditarDesgloseComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalEditarDesgloseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private CalificacionRollosProcesoService: CalificacionRollosProcesoService,
  ) {}

  ngOnInit(): void {
    this.calcularTotal();
  }

  guardar() {
    console.log("this.data");
    console.log(this.data);
    this.CalificacionRollosProcesoService.actualizarDesglose(this.data).subscribe({
      next: (res) => {
        console.log('Desglose actualizado con éxito:', res);
        this.dialogRef.close(this.data); // devolver los datos actualizados al padre
      },
      error: (err) => {
        console.error('Error al actualizar desglose:', err);
      }
    });
  }

  cancelar() {
    this.dialogRef.close(); // cierra sin devolver nada
  }
  calcularTotal(): void {
    if (this.data.items && Array.isArray(this.data.items)) {
      this.data.total = this.data.items.reduce((sum, item) => sum + Number(item.metros || 0), 0);
    }
  }


}

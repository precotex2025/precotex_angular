import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface data {
  Title       : string;
  Datos       : any   ;
}

@Component({
  selector: 'app-dialog-memorandum-gral-add-detalle',
  templateUrl: './dialog-memorandum-gral-add-detalle.component.html',
  styleUrls: ['./dialog-memorandum-gral-add-detalle.component.scss']
})
export class DialogMemorandumGralAddDetalleComponent implements OnInit {

  formulario = this.formBuilder.group({
    ctrol_glosa: [''],
    ctrol_cantidad: [''],
  })

  constructor(
    private formBuilder       : FormBuilder                     ,
    private matSnackBar       : MatSnackBar                     ,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
    public dialogRef: MatDialogRef<DialogMemorandumGralAddDetalleComponent>,
  ) { }

  ngOnInit(): void {

  }

  onAddMaterial(){

    const sGlosa       = this.formulario.get('ctrol_glosa')?.value;
    const sCantMaterial = this.formulario.get('ctrol_cantidad')?.value || 0;

    if (!sGlosa || sGlosa.trim() === '') {
      this.matSnackBar.open("¡Importante Ingresar el descripción de lo requerido !", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;      
    }    

    if (!sCantMaterial || sCantMaterial == 0) {
      this.matSnackBar.open("¡Importante Ingresar Cantidad Material!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    //Arma la traza del  
    const MyArticulo: any = {
      glosa: sGlosa,
      cantidad: sCantMaterial
    };    

    this.dialogRef.close(MyArticulo);
  }
}

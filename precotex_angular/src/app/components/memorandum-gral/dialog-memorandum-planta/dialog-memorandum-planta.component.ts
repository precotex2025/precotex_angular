import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';


interface data {
  Title       : string;
}

@Component({
  selector: 'app-dialog-memorandum-planta',
  templateUrl: './dialog-memorandum-planta.component.html',
  styleUrls: ['./dialog-memorandum-planta.component.scss']
})
export class DialogMemorandumPlantaComponent implements OnInit {

  formulario = this.formBuilder.group({
    ctrol_planta_ori: ['']
  });      

  dataPlantas   : Array<any> = [];  

  constructor(
    private formBuilder       : FormBuilder                     ,
    private serviceMemorandum : MemorandumGralService           ,
    private matSnackBar       : MatSnackBar                     ,
    public dialogRef: MatDialogRef<DialogMemorandumPlantaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
  ) { }

  ngOnInit(): void {
      this.getPlantas();
  }

  getPlantas(){
    this.serviceMemorandum.getPlantas().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataPlantas = result.elements;

          //this.formulario.get('ctrol_user_ori')?.setValue(this.data.sNom_Usuario);
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))    
  }   

  onSelectPlanta(event: any) {
    const value = event.value; // obtiene num_Planta
    this.dialogRef.close(value); // cierra el modal y envía el valor al padre
  }  



}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { AprofabriccardService } from 'src/app/services/aprofabriccard.service';
import { GlobalVariable } from '../../../VarGlobals';


interface data {
  boton: string,
  title: string,
  Opcion: string,
  Datos: any;
}



@Component({
  selector: 'app-dialog-recep-fabriccard',
  templateUrl: './dialog-recep-fabriccard.component.html',
  styleUrls: ['./dialog-recep-fabriccard.component.scss']
})
export class DialogRecepFabriccardComponent implements OnInit {


        sAccion = ''
        NumFab=''
        Cod_OrdTra=''
        Secuencia=''
        Comentarios=''
        Aprob=''
        Color=''
        Tela=''
        Cliente=''


  formulario = this.formBuilder.group({
    
  });
  

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private aprofabriccardservice : AprofabriccardService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogRecepFabriccardComponent> ) {  }

  ngOnInit(): void {
    this.NumFab=this.data.Datos.NUM_FABRIC_CARD
    this.Cod_OrdTra=this.data.Datos.COD_ORDTRA
    this.Secuencia=this.data.Datos.SEC
  }

  Limpiar() {
    this.NumFab = '';
    this.Cod_OrdTra = '';
    this.Secuencia = '';
    
   
  }




  RecepcionarFabricard() {

    console.log(this.formulario.get('ope')?.value)
    this.sAccion = 'U'

 
      this.spinnerService.show();
      const formData = new FormData();
      formData.append('Num_Fabric', this.NumFab);
      formData.append('Partida', this.Cod_OrdTra);
      formData.append('Secuencia', this.Secuencia);
      formData.append('Cod_Usuario', GlobalVariable.vusu);
      formData.append('Flg_Recep', 'SI');

      this.aprofabriccardservice.RecepcionarFabricard(
        formData).subscribe(

          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.spinnerService.hide();
              this.matSnackBar.open('Se recepciono correctamente!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.Limpiar()
              this.dialogRef.close();
            }
            else {
              this.spinnerService.hide();
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.spinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

          })

    
  }





}

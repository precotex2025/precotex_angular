import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { AprofabriccardService } from 'src/app/services/aprofabriccard.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { TejeduriaService } from 'src/app/services/tejeduria.service';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component';

interface data {
  Cod_Ordtra: string,
  Num_Secuencia: string,
  Sec_Maquina: string,
  Cod_Trabajador: string;  
}

@Component({
  selector: 'app-dialog-add-prod-teje-rectilineo-registro',
  templateUrl: './dialog-add-prod-teje-rectilineo-registro.html',
  styleUrls: ['./dialog-add-prod-teje-rectilineo-registro.scss']
})
export class DialogAddProdTejeRectilineoComponent implements OnInit {
    [x: string]: any;
 
    Und_Ingresar = '';


  formulario = this.formBuilder.group({
    Und_Ingresar:  ['', Validators.required],
    Und_Fallado:   [''],
    kilospartida: [''],
    comentarios:  ['-'],
    ope: [''],
    
  });
  Opcion: string;
 
  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,   
    private TejeduriaService: TejeduriaService, 
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogAddProdTejeRectilineoComponent>,  ) { }

  ngOnInit(): void {

}



Limpiar() {
  this.formulario.reset()  
//   this.NumFab = '';
  
}


RegistrarProd() { 
    this.Und_Ingresar = this.formulario.get('Und_Ingresar')?.value;    
    if (this.Und_Ingresar == null || this.Und_Ingresar == '' || this.Und_Ingresar == undefined) 
    {
      this.matSnackBar.open('Ingrese Und por Ingresar!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else 
    {
    
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });    
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {    
        this.Und_Ingresar = this.formulario.get('Und_Ingresar')?.value;
        if (this.Und_Ingresar == null || this.Und_Ingresar == '' || this.Und_Ingresar == undefined) 
        {
            this.matSnackBar.open('Ingrese Und por Ingresar!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            return;
        }        
        this.SpinnerService.show();        
        this.Opcion = 'I'         
        this.Cod_Ordtra = this.data.Cod_Ordtra
        this.Num_Secuencia = this.data.Num_Secuencia
        this.Sec_Maquina = this.data.Sec_Maquina
        this.Uni_Producido = (this.formulario.get('Und_Ingresar')?.value).toString();
        this.Uni_Fallado = (this.formulario.get('Und_Fallado')?.value).toString();
        this.Tip_Trabajador = ''
        this.Cod_Trabajador = this.data.Cod_Trabajador
        this.Id = ''           
        this.TejeduriaService.MantProduccionRectilineo(
        this.Opcion,
        this.Cod_Ordtra,
        this.Num_Secuencia,
        this.Sec_Maquina,
        this.Uni_Producido,
        this.Uni_Fallado,
        this.Tip_Trabajador,
        this.Cod_Trabajador,
        this.Id
        ).subscribe(     
          (result: any) => {
            if(result[0].Resultado == 'OK'){     
              //this.BuscarOT()  
              this.matSnackBar.open("Se grabó correctamente.", 'Cerrar',
                { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
                this.dialog.closeAll();                
            }
            else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
      
      }
    })
  } 
}

}
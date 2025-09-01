import { Component, OnInit } from '@angular/core';
import { GuiacontingenciaService } from 'src/app/services/guiacontingencia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-guia-contingencia',
  templateUrl: './guia-contingencia.component.html',
  styleUrls: ['./guia-contingencia.component.scss']
})
export class GuiaContingenciaComponent implements OnInit {

  formulario = this.formBuilder.group({
   flag:         ['si'],
      
  }) 

  constructor(private guiacontingencia:GuiacontingenciaService, private matSnackBar: MatSnackBar, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  submit(formDirective) :void {
    
    this.guiacontingencia.grabaAutorizacionguiacontingencia(this.formulario.get('flag')?.value
      ).subscribe(
      (result: any) => {
        console.log("Resultadoooooooo:" + result);
        // if (result) {
        //   if (result.Mensaje == 'Ok') {
        //     this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
        //   } else {
        //     this.matSnackBar.open(result.Mensaje, 'Cerrar', {
        //       duration: 3000,
        //     })
        //   }
        // } else {
        //   this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
        // }
        this.matSnackBar.open('SE REGISTRO CORRECTAMENTE !!', 'Cerrar', {
          duration: 1500,
        });
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

    }



}

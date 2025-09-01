import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';


interface data{
  Id: number
  Km: number
  
}

@Component({
  selector: 'app-dialog-vehiculo-modificar-km',
  templateUrl: './dialog-vehiculo-modificar-km.component.html',
  styleUrls: ['./dialog-vehiculo-modificar-km.component.scss']
})
export class DialogVehiculoModificarKmComponent implements OnInit {

 
  Cod_Accion    = ''
  Id = 0
  Km = 0


  formulario = this.formBuilder.group({
  Km:          [''],
  }) 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private seguridadControlVehiculoService: SeguridadControlVehiculoService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

    this.formulario = formBuilder.group({
      Km:          ['', Validators.required],
    });
  }



  ngOnInit(): void {
   
   this.formulario.controls['Km'].setValue(this.data.Km)
  }

  submit(formDirective) :void {
    this.Km = this.formulario.get('Km')?.value
     
    this.seguridadControlVehiculoService.Modificar_Km_Vehiculo(
      this.data.Id,
      this.Km
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 }))
    }
   
    
    


  

}

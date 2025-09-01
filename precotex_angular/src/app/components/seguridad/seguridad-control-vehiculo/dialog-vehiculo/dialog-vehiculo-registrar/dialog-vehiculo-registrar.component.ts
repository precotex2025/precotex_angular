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
  Cod_Conductor: string
  Nro_DocIde: string
}



@Component({
  selector: 'app-dialog-vehiculo-registrar',
  templateUrl: './dialog-vehiculo-registrar.component.html',
  styleUrls: ['./dialog-vehiculo-registrar.component.scss']
})
export class DialogVehiculoRegistrarComponent implements OnInit {
  
  Cod_Accion    = ''
  Cod_Conductor = ''
  Dni           = ''
  Apep          = ''
  Apem          = ''
  Nom           = ''
  Numlic        = ''
  Cat           = ''
  Fec_Fin_Lic   = ''
  Flg_Status    = ''
  Titulo        = ''
  

  
  /*myControl = new FormControl();
  fec_registro = new FormControl(new Date())*/

  formulario = this.formBuilder.group({
    Dni:          [''],
    Apep:         [''],
    Apem:         [''],
    Nom:          [''],
    Numlic:       [''],
    Cat:          [''],
    Fec_Fin_Lic:  ['']
  }) 

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private seguridadControlVehiculoService: SeguridadControlVehiculoService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

    this.formulario = formBuilder.group({
      Dni:          ['', Validators.required],
      Apep:         ['', Validators.required],
      Apem:         ['', Validators.required],
      Nom:          ['', Validators.required],
      Numlic:       ['', Validators.required],
      Cat:          ['', Validators.required],
      Fec_Fin_Lic:  ['', Validators.required],
    });
  }
  ngOnInit(): void {
   this.Titulo  = this.data.Nro_DocIde
   this.Dni     = this.data.Nro_DocIde
   if(this.Titulo != undefined){
      this.CompletarDatosModificarRegistro()
     
   }




  }

  CompletarDatosModificarRegistro(){
    this.Cod_Accion = 'L'
    this.seguridadControlVehiculoService.mantenimientoConductorService(
    this.Cod_Accion,
    this.Cod_Conductor,
    this.Dni,
    this.Nom,
    this.Apep,
    this.Apem,
    this.Numlic,
    this.Cat,
    this.Fec_Fin_Lic,
    this.Flg_Status).subscribe(
      (result: any) => {
          console.log(result)
          this.formulario.controls['Dni'].setValue(result[0].Nro_DocIde)
          this.formulario.controls['Apep'].setValue(result[0].Apellido_Paterno)
          this.formulario.controls['Apem'].setValue(result[0].Apellido_Materno)
          this.formulario.controls['Nom'].setValue(result[0].Nombre)
          this.formulario.controls['Numlic'].setValue(result[0].Num_Licencia_Cond)
          this.formulario.controls['Cat'].setValue(result[0].Categoria_Licencia)
          this.formulario.get('Fec_Fin_Lic').setValue(result[0].Fec_Fin_Licencia2['date'])

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    )
  }

  submit(formDirective) :void {
    if (this.formulario.valid) {
      this.Cod_Accion   = 'I'
      if(this.Titulo != undefined){
        this.Cod_Accion = 'U'
      }
      
      this.Dni          = this.formulario.get('Dni')?.value
      this.Apep         = this.formulario.get('Apep')?.value
      this.Apem         = this.formulario.get('Apem')?.value
      this.Nom          = this.formulario.get('Nom')?.value
      this.Numlic       = this.formulario.get('Numlic')?.value
      this.Cat          = this.formulario.get('Cat')?.value
      this.Fec_Fin_Lic  = this.formulario.get('Fec_Fin_Lic')?.value
      this.Flg_Status   = 'S'

      this.seguridadControlVehiculoService.mantenimientoConductorService(
        this.Cod_Accion,
        this.Cod_Conductor,
        this.Dni,
        this.Nom,
        this.Apep,
        this.Apem,
        this.Numlic,
        this.Cat,
        this.Fec_Fin_Lic,
        this.Flg_Status).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              
              if(this.Titulo == undefined){
                this.limpiar()
                formDirective.resetForm();
                this.formulario.reset();
              }
              

            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
              
            }
            else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        )
    }
    else {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }


  limpiar(){
    this.formulario.controls['Dni'].setValue('')
    this.formulario.controls['Apep'].setValue('')
    this.formulario.controls['Apem'].setValue('')
    this.formulario.controls['Nom'].setValue('')
    this.formulario.controls['Numlic'].setValue('')
    this.formulario.controls['Cat'].setValue('')
    this.formulario.controls['Fec_Fin_Lic'].setValue('')
    
  }

}

import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UbicacionHilosAlmacenService } from 'src/app/services/ubicacion-hilos-almacen.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';

interface data{
  Id_Num: number
}


@Component({
  selector: 'app-dialog-ubicacion-registrar',
  templateUrl: './dialog-ubicacion-registrar.component.html',
  styleUrls: ['./dialog-ubicacion-registrar.component.scss']
})
export class DialogUbicacionRegistrarComponent implements OnInit {

  Cod_Accion      = ''
  nIdNum          = 0
  nRack           = 0
  nPiso           = ''
  nNicho          = 0
  nCodigo         = ''
  nTubica         =''
  
  

  
  /*myControl = new FormControl();
  fec_registro = new FormControl(new Date())*/

  formulario = this.formBuilder.group({
    nIdNum:         [0],
    nRack:          [0],
    nPiso:          [''],
    nNicho:         [0],
    nCodigo:        [''],
    nTubica:        ['']

  }) 



constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private UbicacionHilosAlmacenService: UbicacionHilosAlmacenService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

    this.formulario = formBuilder.group({
      nIdNum:        [0],
      nRack:         ['', Validators.required],
      nPiso:         ['', Validators.required],
      nNicho:        ['', Validators.required],
      nCodigo:       ['', Validators.required],
      nTubica:       ['R', Validators.required],
    });
  }


  ngOnInit(): void {
    this.nIdNum  = this.data.Id_Num
    console.log(this.data.Id_Num)
   if(this.nIdNum != undefined){
      this.CompletarDatosModificarRegistro()
     
   }
  }


  CompletarDatosModificarRegistro(){
    this.Cod_Accion = 'L'
    this.UbicacionHilosAlmacenService.mantenimientoBultoService(
    this.Cod_Accion,
    this.nIdNum,
    this.nRack,
    this.nPiso,
    this.nNicho,
    this.nCodigo).subscribe(
      (result: any) => {
          console.log(result)
          this.formulario.controls['nIdNum'].setValue(result[0].Id_Num)
          this.formulario.controls['nRack'].setValue(result[0].Rack_ubicacion)
          this.formulario.controls['nPiso'].setValue(result[0].Piso_ubicacion)
          this.formulario.controls['nNicho'].setValue(result[0].Nicho_ubicacion)
          this.formulario.controls['nCodigo'].setValue(result[0].Cod_ubicacion)
          
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    )
  }








  submit(formDirective) :void {
    if (this.formulario.valid) {
        this.Cod_Accion   = 'I'
      if(this.nIdNum != undefined){
        this.Cod_Accion = 'U'
      }
      
      this.nIdNum          = this.formulario.get('nIdNum')?.value
      this.nRack          = this.formulario.get('nRack')?.value
      this.nPiso         = this.formulario.get('nPiso')?.value
      this.nNicho         = this.formulario.get('nNicho')?.value
      this.nCodigo          = this.formulario.get('nCodigo')?.value
      
      

      this.UbicacionHilosAlmacenService.mantenimientoBultoService(
        this.Cod_Accion,
        this.nIdNum,
        this.nRack,
        this.nPiso,
        this.nNicho,
        this.nCodigo
        ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              
              if(this.nIdNum == undefined){
                this.limpiar()
                formDirective.resetForm();
                this.formulario.reset();
                
             }
              
            console.log(this.nIdNum)
            this.matSnackBar.open('Proceso Correcto._ !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
              
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
    this.formulario.controls['nIdNum'].setValue(0)
    this.formulario.controls['nRack'].setValue('')
    this.formulario.controls['nPiso'].setValue('')
    this.formulario.controls['nNicho'].setValue('')
    this.formulario.controls['nCodigo'].setValue('')
    this.formulario.controls['nTubica'].setValue('')

    
  }



    concatenar(){

      this.formulario.patchValue({
        'nCodigo':this.formulario.get('nTubica').value+this.formulario.get('nRack').value+this.formulario.get('nPiso').value+this.formulario.get('nNicho').value
      })
      



    }



}

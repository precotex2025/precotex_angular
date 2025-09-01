import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';

import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

import { SeguridadControlGuiaService } from '../../../../../services/seguridad-control-guia.service';

interface data_det {
  Id: string;
  Codigo_Barra: string;
  Cod_Barra_Anterior: string;
  Num_Guia: string;
  Origen: string;
  Ubicacion: string;
  Cod_Almacen: string;
}

@Component({
  selector: 'app-dialog-cambio-jaba',
  templateUrl: './dialog-cambio-jaba.component.html',
  styleUrls: ['./dialog-cambio-jaba.component.scss']
})
export class DialogCambioJabaComponent implements OnInit {

  formulario = this.formBuilder.group({
    Id: [0, Validators.required],
    Codigo_Barra: ['', Validators.required],
    Cod_Barra_Anterior: ['', Validators.required],
    Num_Guia: [],
    Origen: [],
    Destino: [],
    Cod_Almacen: [],
    Cod_Usuario: []
  }) 

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: data_det, 
    private seguridadControlGuiaService: SeguridadControlGuiaService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    let sCod_Usuario = GlobalVariable.vusu;
    console.log(this.data)

    this.formulario.reset();
    this.formulario.patchValue({
      Id: this.data.Id,
      Codigo_Barra: this.data.Codigo_Barra,
      Cod_Barra_Anterior: this.data.Codigo_Barra,
      Num_Guia: this.data.Num_Guia,
      Origen: this.data.Origen,
      Destino: this.data.Ubicacion,
      Cod_Almacen: this.data.Cod_Almacen,
      Cod_Usuario: sCod_Usuario
    });
  }

  submit(formDirective) :void{
    /*
    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Num_Guia', this.formulario.get('Num_Guia')?.value);
    formData.append('Codigo_Barra', this.formulario.get('Codigo_Barra')?.value);
    formData.append('Origen', this.formulario.get('Origen')?.value);
    formData.append('Destino', this.formulario.get('Cod_Barra_Anterior')?.value);
    formData.append('Cod_Usuario', sCod_Usuario);
    formData.append('Cod_Almacen', this.formulario.get('Cod_Almacen')?.value);
    formData.append('Id', this.formulario.get('Id')?.value);
    */
    console.log("this.formulario.value")
    console.log(this.formulario.value)
    this.SpinnerService.show();
    this.seguridadControlGuiaService.packingReemplazaJaba(
      this.formulario.value
    ).subscribe(
      (result: any) => {
        console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("La java se reemplazó correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        this.SpinnerService.hide();
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      });

  }

}

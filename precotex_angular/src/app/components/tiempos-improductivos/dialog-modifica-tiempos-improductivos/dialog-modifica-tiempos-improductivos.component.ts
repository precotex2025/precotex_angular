import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
//import { DialogTiemposImproductivosComponent } from '../tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { startWith, map,Observable } from 'rxjs';
import { DialogTiemposImproductivosService } from '../../../services/dialog-tiempos-improductivos.service';
import { GlobalVariable } from '../../../VarGlobals'; //<==== this one

interface data{
  sFec_Registro: string
  cod_maquina: string
  cod_motivo: string
  finicio: string
  ffin: string
  observaciones: string
  Titulo: string
  sFec_Creacion: string
}

interface maquinas {
  Codigo: string,
  Descripcion: string,
}

interface motivos {
  Codigo: string,
  Descripcion: string,
}

@Component({
  selector: 'app-dialog-modifica-tiempos-improductivos',
  templateUrl: './dialog-modifica-tiempos-improductivos.component.html',
  styleUrls: ['./dialog-modifica-tiempos-improductivos.component.scss']
})
export class DialogModificaTiemposImproductivosComponent implements OnInit {
  num_guiaMascara = [/[0-2]/, /\d/,':',/[0-5]/, /\d/];
  datefecreg = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

  Cod_Accion    = ''
  Fec_Registro  = ''
  Cod_Maquina   = ''
  Cod_Motivo    = ''
  hini          = ''
  hfin          = ''
  observaciones = ''
  Titulo        = ''
  Fec_Fin       = ''
  Fec_Inicio    = ''
  Fec_Crea      = ''

  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];

  listar_operacionConductor:  maquinas[] = [];
  filtroOperacionConductor:   Observable<maquinas[]> | undefined;

  listar_operacionmotivos:  motivos[] = [];
  filtroMotivos:   Observable<motivos[]> | undefined;

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({Cod_Maquina: [''],Cod_Motivo: [''],hini: ['00:00'],hfin: ['00:00'],Fec_Registro: [new Date()],Fec_Inicio: [new Date()],Fec_Fin: [new Date()],observaciones:[''],dnitejedor:[''],nomtejedor:['']})


  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private despachoTelaCrudaService: DialogTiemposImproductivosService
    , @Inject(MAT_DIALOG_DATA) public data: data
    ) {

   }

  ngOnInit(): void {
    this.CargarMaquinas();
    this.CargarMotivos();
    this.CompletarDatosModificarRegistro();
    this.formulario.get('Fec_Registro').disable();
    this.formulario.get('Cod_Motivo').disable();
    this.formulario.get('Cod_Maquina').disable();
    this.formulario.get('dnitejedor').disable();
    this.formulario.get('nomtejedor').disable();
    console.log(this.Fec_Crea);
  }
  CompletarDatosModificarRegistro(){
     console.log(this.data)
    //this.datefecreg = new FormControl(this.data.sFec_Registro);
    this.formulario.get('Fec_Registro')?.setValue(this.data.sFec_Registro)
    this.formulario.get('Cod_Maquina')?.setValue(this.data.cod_maquina)
    this.formulario.get('Cod_Motivo')?.setValue(this.data.cod_motivo)
    this.formulario.get('dnitejedor')?.setValue(this.data.Titulo)
    //this.formulario.get('feccrea')?.setValue(this.data.sFec_Creacion)
    this.mostrarTejedor()


    var splittedfini = this.data.finicio.split(' ',2);
    this.formulario.get('Fec_Inicio').setValue(splittedfini[0])
    this.formulario.get('hini').setValue(splittedfini[1])
    var splittedffin = this.data.ffin.split(' ',2);

    if (splittedffin[0]!=='01/01/1900') { this.formulario.get('Fec_Fin').setValue(splittedffin[0]) }
    else { this.formulario.get('Fec_Fin').setValue('') }

    this.formulario.get('hfin').setValue(splittedffin[1])
    this.formulario.get('observaciones')?.setValue(this.data.observaciones)
  }

pasarfecha() {
this.Fec_Registro=this.formulario.get('Fec_Registro')?.value;
this.formulario.get('Fec_Inicio').setValue(this.Fec_Registro);
//this.formulario.get('Fec_Inicio').disable();
this.formulario.get('Fec_Fin').setValue(this.Fec_Registro);
}


CargarMaquinas() {
this.despachoTelaCrudaService.mantenimientoConductorService().subscribe(
(result: any) => {
  this.listar_operacionConductor = result
  console.log(this.listar_operacionConductor);
},
(err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}

CargarMotivos() {
this.despachoTelaCrudaService.listadoMotivosTiemposImproductivos().subscribe(
(result: any) => {
  this.listar_operacionmotivos = result
  console.log(this.listar_operacionmotivos);
},
(err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}

mostrarTejedor() {

  let dni_tejedor=this.formulario.get('dnitejedor')?.value;
  if (dni_tejedor.length===8) {
    console.log(dni_tejedor.length);
    this.despachoTelaCrudaService.traerTejedor(dni_tejedor).subscribe(
      (result: any) => {
        console.log(result);
        if (result[0].Respuesta == 'OK') {
          this.formulario.get('nomtejedor')?.setValue(result[0].Nombres);
        }
        //this.dialog.closeAll();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


}

/*GuardarRegistro() {
//console.log(this.RegistroAuditoriaForm.get('fec_reg_auditoria')?.value)
console.log(this.formulario);
this.despachoTelaCrudaService.ingresaTiempóimproductivo(this.formulario.get('Fec_Registro')?.value,
this.formulario.get('Cod_Maquina')?.value,
this.formulario.get('Cod_Motivo')?.value,
this.formulario.get('hini')?.value,
this.formulario.get('hfin')?.value,
this.formulario.get('observaciones')?.value).subscribe(
  (result: any) => {
    console.log(result);
  },
  (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
    duration: 1500,
  }))
}*/

submit(formDirective) :void {
if (this.formulario.valid) {
this.Cod_Accion   = 'I'
if(this.Titulo != undefined){
  this.Cod_Accion = 'U'
}
this.Fec_Registro=this.formulario.get('Fec_Registro')?.value,
this.Cod_Maquina=this.formulario.get('Cod_Maquina')?.value,
this.Cod_Motivo=this.formulario.get('Cod_Motivo')?.value,
this.Fec_Inicio=this.formulario.get('Fec_Inicio')?.value,
this.hini=this.formulario.get('hini')?.value,
this.Fec_Fin=this.formulario.get('Fec_Fin')?.value,
this.hfin=this.formulario.get('hfin')?.value,
this.observaciones=this.formulario.get('observaciones')?.value
this.Titulo=this.formulario.get('dnitejedor')?.value
this.Fec_Crea=this.data.sFec_Creacion

console.log(this.Fec_Crea);

  this.despachoTelaCrudaService.modificaTiempóimproductivo(this.Fec_Registro,
    this.Cod_Maquina,
    this.Cod_Motivo,
    this.Fec_Inicio,
    this.hini,
    this.Fec_Fin,
    this.hfin,
    this.observaciones,
    this.Titulo,
    this.Fec_Crea).subscribe(
    (result: any) => {
      console.log(result);
      //this.dialog.closeAll();
      this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', {
        duration: 3000,
      })
      this.dialog.closeAll();

    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))




}
else {
this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
}
}

}

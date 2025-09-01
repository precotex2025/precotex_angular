import { Component, OnInit, ViewChild,ElementRef, Inject } from '@angular/core';
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
import { CalificacionRollosProcesoService } from 'src/app/services/calificacion-rollos-proceso.service';


interface data{
  sFec_Registro: string
  cod_maquina: string
  cod_motivo: string
  finicio: string
  ffin: string
  observaciones: string
  Titulo: string
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
  selector: 'app-dialog-tiempos-improductivos',
  templateUrl: './dialog-tiempos-improductivos.component.html',
  styleUrls: ['./dialog-tiempos-improductivos.component.scss']
})
export class DialogTiemposImproductivosComponent implements OnInit {
  num_guiaMascara = [/[0-2]/, /\d/,':',/[0-5]/, /\d/];
  datefecreg = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  isShown=false; // hidden by default

  Cod_Accion    = ''
  Fec_Registro  = ''
  Cod_Maquina   = ''
  Cod_Motivo   = ''
  hini          = ''
  hfin          = ''
  observaciones = ''
  Titulo        = ''
  Fec_Fin       = ''
  Fec_Inicio    = ''
  dni_tejedor   = ''

  sCod_Usuario = GlobalVariable.vusu;
  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];

  listar_operacionConductor:  maquinas[] = [];
  filtroOperacionConductor:   Observable<maquinas[]> | undefined;

  listar_operacionmotivos:  motivos[] = [];
  filtroMotivos:   Observable<motivos[]> | undefined;
  dni:string = '';

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({Cod_Maquina: [''],Cod_Motivo: [''],hini: ['00:00'],hfin: ['00:00'],Fec_Registro: [new Date()],Fec_Inicio: [new Date()],Fec_Fin: [''],observaciones:[''],dnitejedor:[''],nomtejedor:['']})

   //displayedColumns_cab: string[] = ['Fec_Registro','Cod_Maquina','Des_Maquina_Tejeduria','Tip_Trabajador_Tejedor','Cod_Trabajador_Tejedor','Nombres','Cod_Motivo','Des_Motivo','Fec_Hora_Inicio','Fec_Hora_Fin','Observacion','Fec_Creacion','Cod_Usuario']
  //dataSource: MatTableDataSource<data_det>;
  //columnsToDisplay: string[] = this.displayedColumns_cab.slice();


  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private despachoTelaCrudaService: DialogTiemposImproductivosService
    ,private CalificacionRollosProcesoService: CalificacionRollosProcesoService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) { }
  @ViewChild('dnitejedor',{ static: false }) dnitejedor: ElementRef;
  ngOnInit(): void {
    this.CargarMaquinas();
    this.CargarMotivos();
    this.obtenerDni();
    //this.CompletarDatosModificarRegistro();
    this.formulario.get('Fec_Inicio').disable();
    this.formulario.get('nomtejedor').disable();
    this.formulario.get('Fec_Registro')?.setValue(this.data.sFec_Registro)
    this.formulario.get('Cod_Maquina')?.setValue(this.data.cod_maquina)

    this.dnitejedor.nativeElement.focus()

    this.isShown = false



  }


  CompletarDatosModificarRegistro(){

          //this.datefecreg = new FormControl(this.data.sFec_Registro);
          this.formulario.get('Fec_Registro')?.setValue(this.data.sFec_Registro)
          this.formulario.get('Cod_Maquina')?.setValue(this.data.cod_maquina)
          this.formulario.get('Cod_Motivo')?.setValue(this.data.cod_motivo)
          this.formulario.get('Fec_Inicio').setValue(this.data.finicio)
          this.formulario.get('Fec_Fin').setValue(this.data.ffin)
          this.formulario.get('observaciones')?.setValue(this.data.observaciones)
  }

  pasarfecha() {
    this.Fec_Registro=this.formulario.get('Fec_Registro')?.value;
    this.formulario.get('Fec_Inicio').setValue(this.Fec_Registro);
    this.formulario.get('Fec_Inicio').disable();
    //this.formulario.get('Fec_Fin').setValue(this.Fec_Registro);
  }

  obtenerDni() {

    this.CalificacionRollosProcesoService.obtenerDni(this.sCod_Usuario).subscribe({
      next: (response) => {
        this.formulario.get('dnitejedor')?.setValue(response.elements);
        this.dni = response.elements;
        this.mostrarTejedor1(this.dni);
      },
      error: (err) => {
        console.error('Error al sCod_Usuario', err);
      }
    });

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

mostrarTejedor1(dni: string) {

    let dni_tejedor= dni;
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

  toggleShow(a) {
    this.isShown = !this.isShown;
    // a.disable();
    //this.elfocus()
    // this.formulario.get('Fec_Registro').disable();
    this.formulario.controls['Fec_Registro'].disable();
    this.formulario.controls['Cod_Motivo'].disable();
    this.formulario.controls['Cod_Maquina'].disable();
    this.formulario.controls['Fec_Fin'].disable();
    this.formulario.controls['observaciones'].disable();
  }

  activarControles() {
    this.isShown = !this.isShown;
    this.formulario.controls['Fec_Registro'].enable();
    this.formulario.controls['Cod_Motivo'].enable();
    this.formulario.controls['Cod_Maquina'].enable();
    this.formulario.controls['Fec_Fin'].enable();
    this.formulario.controls['observaciones'].enable();
  }

  elfocus() {
    //this.formulario.controls['dnitejedor'][0].focus();
    //this.formulario.get('nomtejedor').disabled;
    //this.formulario.get('dnitejedor').setValue('');
    //this.dnitejedor.nativeElement.focus()
      this.dnitejedor.nativeElement.focus();
        this.formulario.controls['nomtejedor'].disable();
  }

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
      this.dni_tejedor=this.formulario.get('dnitejedor')?.value;
      console.log(this.Titulo);

      //var cantidad =  prompt('Ingrese DNI del Tejedor!!');
    // nos aseguramos que es un múmero

          this.despachoTelaCrudaService.ingresaTiempóimproductivo(this.Fec_Registro,
            this.Cod_Maquina,
            this.Cod_Motivo,
            this.Fec_Inicio,
            this.hini,
            this.Fec_Fin,
            this.hfin,
            this.observaciones,
            this.dni_tejedor).subscribe(
            (result: any) => {
              console.log(result);
              //this.dialog.closeAll();
              if (result[0]) {
                if (result[0].Respuesta == 'OK') {
                  this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', {
                    duration: 3000,
                  })
                  //this.dialog.closeAll();
                } else {
                  this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                    duration: 3000,
                  })
                }
              } else {
                this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', {
                  duration: 3000,
                })
              }

            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    }
    else {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  EliminarRegistro() {

    let dialogRef = this.dialog.open(DialogTiemposImproductivosComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Fec_Registro=this.formulario.get('Fec_Registro')?.value,
        this.Cod_Maquina=this.formulario.get('Cod_Maquina')?.value,
        this.Cod_Motivo=this.formulario.get('Cod_Motivo')?.value,
        this.Fec_Inicio=this.formulario.get('Fec_Inicio')?.value,
        //this.hini=this.formulario.get('hini')?.value,
        this.Fec_Fin=this.formulario.get('Fec_Fin')?.value,
        this.hfin=this.formulario.get('hfin')?.value,
        this.observaciones=this.formulario.get('observaciones')?.value

        this.despachoTelaCrudaService.eliminarTiempoimproductivo(
          this.Fec_Registro,
        this.Cod_Maquina,
        this.Cod_Motivo,
        this.Fec_Inicio,
        //this.hini,
        this.Fec_Fin
        //this.hfin,
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              //this.MostrarCabeceraConductor()
              this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })
  }



}

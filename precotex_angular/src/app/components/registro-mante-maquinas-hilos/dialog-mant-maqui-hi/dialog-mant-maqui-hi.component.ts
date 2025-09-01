import { Component, OnInit, ViewChild,ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as _moment from 'moment';
import { FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
//import { DialogTiemposImproductivosComponent } from '../tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { startWith, map,Observable } from 'rxjs';
import { DialogTiemposImproductivosService } from '../../../services/dialog-tiempos-improductivos.service';
import { GlobalVariable } from '../../../VarGlobals'; //<==== this one
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';


interface maquinas {
  Codigo: string,
  Descripcion: string,
}


interface TAREA {
  Cod_Tarea: string,
  Nombre_Tarea: string,
}

interface OT {
  Cod_TipOrdTra: string,
  OT: string,
}



interface data{
  sFec_Registro: string
  cod_maquina: string
  cod_motivo: string
  finicio: string
  ffin: string
  observaciones: string
  Titulo: string
}


@Component({
  selector: 'app-dialog-mant-maqui-hi',
  templateUrl: './dialog-mant-maqui-hi.component.html',
  styleUrls: ['./dialog-mant-maqui-hi.component.scss']
})
export class DialogMantMaquiHiComponent implements OnInit {

  num_guiaMascara = [/[0-2]/, /\d/,':',/[0-5]/, /\d/];
  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];


  datefecreg = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  isShown=false; // hidden by default

  listar_operacionMaquina:  maquinas[] = [];
  listar_operacionOt:    OT [] = [];
  listar_operacionTarea:    TAREA [] = [];

  filtroOperacionMaquina:   Observable<maquinas[]> | undefined;
  filtroOperacionOt:        Observable<OT []> | undefined;
  filtroOperacionTarea:     Observable<TAREA []> | undefined;
  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

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
  Cod_Trabajador= ''
  Tip_Trabajador= ''

  
  Cod_TipOrdTra="";
  Cod_Tarea="";
  Cod_OrdTra="";
  


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
                Cod_Maquina: ['' ,[Validators.required]],
                Cod_Tarea: [''],
                Cod_OrdTra: [''],
                hini: ['00:00'],
                hfin: ['00:00'],
                Fec_Registro: [new Date()],
                Fec_Inicio: [new Date()],
                Fec_Fin: [''],
                observaciones:[''],
                dnitejedor:[''],
                nomtejedor:[''],
                sOt: [''],
                sTarea: ['']
})


  constructor( private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private despachoTelaCrudaService: DialogTiemposImproductivosService,  
    private registromantemaquinastej: RegistroManteMaquinasTejService,
     @Inject(MAT_DIALOG_DATA) public data: data)
      { 
      //this.dataSource = new MatTableDataSource();
      }

    @ViewChild('dnitejedor',{ static: false }) dnitejedor: ElementRef;

  ngOnInit(): void {

    this.CargarMaquinas();
    //this.CargarOts();
    this.CargarTareas();
    GlobalVariable.num_movdespacho = '';
    var actual = new Date();
    var hora = _moment(actual.valueOf()).format('HH:mm');
    var weight = hora.split(':')
    this.formulario.get('Fec_Registro').disable();
    this.formulario.get('hini').setValue(weight[0]+':'+weight[1]);
    this.formulario.get('sTarea')?.setValue("1")
    this.formulario.get('Fec_Inicio').disable();
    this.formulario.get('hini').disable();
    this.formulario.get('Fec_Fin').disable();
    this.formulario.get('hfin').disable();
    this.formulario.get('dnitejedor').disable();
    this.formulario.get('nomtejedor').disable();

    //this.dnitejedor.nativeElement.focus()
    //this.isShown = false

   //this.formulario.get('dnitejedor')?.setValue(GlobalVariable.vcodtra);
   this.mostrarTejedor();
   //console.log(GlobalVariable.vcodtra);


  }

  CargarMaquinas() {
    this.despachoTelaCrudaService.mantenimientoConductorService().subscribe(
      (result: any) => {
        this.listar_operacionMaquina = result
        console.log(this.listar_operacionMaquina);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  CargarTareas(){
    this.registromantemaquinastej.listadoDatosService("LT","","","","", "").subscribe(
      (result: any) => {
        this.listar_operacionTarea = result
        this.RecargarOperacionTareas()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  RecargarOperacionTareas(){
    this.filtroOperacionTarea = this.formulario.controls['sTarea'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionTarea(option) : this.listar_operacionTarea.slice())),
    );
    
  }


  private _filterOperacionTarea(value: string): TAREA[] {
    if (value == null || value == undefined ) {
      value = ''
      
    }
    const filterValue = value.toLowerCase();
    return this.listar_operacionTarea.filter(option => option.Nombre_Tarea.toLowerCase().includes(filterValue));
  }

  CambiarValorTarea(Cod_Tarea: string, Nombre_Tarea: string){
    this.Cod_Tarea = Cod_Tarea
  }

  pasarfecha() {
    this.Fec_Registro=this.formulario.get('Fec_Registro')?.value;
    this.formulario.get('Fec_Inicio').setValue(this.Fec_Registro);
    this.formulario.get('Fec_Inicio').disable();
    //this.formulario.get('Fec_Fin').setValue(this.Fec_Registro);
  }



  CargarOts(){
    this.registromantemaquinastej.listadoDatosService("LO","","","","", "").subscribe(
      (result: any) => {
        this.listar_operacionOt = result
        console.log(this.listar_operacionOt)
        this.RecargarOperacionOt()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  RecargarOperacionOt(){
    this.filtroOperacionOt = this.formulario.controls['sOt'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionOt(option) : this.listar_operacionOt.slice())),
    );
    
  }


  private _filterOperacionOt(value: string): OT[] {
    if (value == null || value == undefined ) {
      value = ''
      
    }
    const filterValue = value.toLowerCase();
    return this.listar_operacionOt.filter(option => option.OT.toLowerCase().includes(filterValue));
  }

  CambiarValorOt(Cod_TipOrdTra: string, OT: string){
    this.Cod_TipOrdTra = Cod_TipOrdTra
  }


  mostrarTejedor() {

    //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
    let Cod_Trabajador=GlobalVariable.vcodtra;
    let Tip_Trabajador=GlobalVariable.vtiptra;
    //if (dni_tejedor.length===8) {
      console.log(Cod_Trabajador.length);
      this.registromantemaquinastej.traerTejedorTra(Cod_Trabajador, Tip_Trabajador).subscribe(
        (result: any) => {
          console.log(result);
           if (result[0].Respuesta == 'OK') {
            this.formulario.get('dnitejedor')?.setValue(result[0].Nro_DocIde); 
            this.formulario.get('nomtejedor')?.setValue(result[0].Nombres);
           }
         },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    //}


  }



  submit(formDirective) :void {
    console.log(this.formulario.valid)
    if (this.formulario.valid) {
      this.Cod_Accion   = 'I'
      if(this.Titulo != undefined){
        this.Cod_Accion = 'U'
      }
      this.Fec_Registro=this.formulario.get('Fec_Registro')?.value,
      this.Cod_Maquina=this.formulario.get('Cod_Maquina')?.value,
      this.Cod_Tarea=this.formulario.get('sTarea')?.value,
      this.Cod_OrdTra=this.formulario.get('sOt')?.value,
      this.Fec_Inicio=this.formulario.get('Fec_Inicio')?.value,
      this.hini=this.formulario.get('hini')?.value,
      this.Fec_Fin=this.formulario.get('Fec_Fin')?.value,
      this.hfin=this.formulario.get('hfin')?.value,
      this.observaciones=this.formulario.get('observaciones')?.value
      this.dni_tejedor=this.formulario.get('dnitejedor')?.value;
      console.log(this.Titulo);

      //var cantidad =  prompt('Ingrese DNI del Tejedor!!');
    // nos aseguramos que es un múmero

          this.registromantemaquinastej.ingresaTareaManteMaquina(
            this.Fec_Registro,
            this.Cod_Maquina,
            this.Cod_Tarea,
            this.Cod_OrdTra,
            this.Fec_Inicio,
            this.hini,
            this.Fec_Fin,
            this.hfin,
            this.observaciones,
            this.dni_tejedor).subscribe(
            (result: any) => {
              console.log(result);
              this.dialog.closeAll();
              //  if (result[0]) {
                if (result[0].Respuesta == 'OK') {
                  this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', {
                    duration: 3000,
                  })
                  this.dialog.closeAll();
                } else {
                  this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                    duration: 3000,
                  })
                }
              // } else {
              //   this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', {
              //     duration: 3000,
              //   })
              // }

            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

      }
    else 
      {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }



  


 








  

}

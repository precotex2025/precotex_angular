import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstampadoDigitalService } from 'src/app/services/estampado-digital.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { TejeduriaService } from 'src/app/services/tejeduria.service';
import { MaqTejeduria } from 'src/app/models/Tejeduria/maquinatejeduria';
import { Tipo_Aguja } from 'src/app/models/Tejeduria/tipoaguja';
import { FamArticulo } from 'src/app/models/Tintoreria/FamArticulo';
import { Cliente } from 'src/app/models/Cliente';
import { TipAncho } from 'src/app/models/Tintoreria/TipAncho';
import { TintoreriaService } from 'src/app/services/tintoreria.service';
import { Gama } from 'src/app/models/Tintoreria/Gama';
import { DialogEliminarComponent } from '../../dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Console } from 'console';
import { TipPasta } from 'src/app/models/Estampado/ProgramaEmpastado';


@Component({
  selector: 'app-dialog-programa-empastado',
  templateUrl: './dialog-programa-empastado.component.html',
  styleUrls: ['./dialog-programa-empastado.component.scss']
})
export class DialogProgramaEmpastadoComponent implements OnInit {
  

  filtroTipPasta:  Observable<TipPasta[]> | undefined;
  listar_TipPasta: TipPasta[] = [];

  Tip_Pasta: string;

  KgsProg:string;
  Obs: string;
  Cod_Ordtra: string;  
  /******************************/
  Opcion = ''
  Tipo = ''
  Num_Secuencia = ''
  Id_Programa = ''
  Version_B = ''

  formulario = this.formBuilder.group({
    sCodTipPasta:[''],
    nKgsProg:[''],
    sObs:    ['']
  }) 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private EstampadoDigitalService: EstampadoDigitalService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any)
  {

    this.formulario = this.formBuilder.group({
      sCodTipPasta:[''],
      nKgsProg: [''],
      sObs:    ['']      
    });
  }

  ngOnInit(): void {
  this.MuestraTipPasta()
  this.Opcion = "O"
  this.formulario.get('nKgsProg')?.setValue(Number((this.data.datos.Kgs_Progr).replace(',', '.')));
  this.formulario.get('sObs')?.setValue(this.data.datos.Observaciones); 
  this.formulario.get('sCodTipPasta')?.setValue(this.data.datos.Cod_Tip_Pasta);
  
  }

Guardar( ) {   
  this.Tipo = ''
  this.Cod_Ordtra = this.data.datos.Cod_Ordtra
  this.Num_Secuencia = this.data.datos.Num_Secuencia
  this.Id_Programa = this.data.datos.Id_Programa 
  this.KgsProg = this.formulario.get('nKgsProg')?.value == null ? '' : this.formulario.get('nKgsProg')?.value
  this.Obs = this.formulario.get('sObs')?.value == null ? '' : this.formulario.get('sObs')?.value
  this.Version_B = this.data.version
  this.EstampadoDigitalService.ManProgramaEmpastado(
    this.Opcion,
    this.Tipo,
    this.Cod_Ordtra,
    this.Num_Secuencia,
    this.Id_Programa,
    this.KgsProg,
    this.Obs,
    this.Version_B,
    ''
    ).subscribe(
      (result: any) => {
        this.matSnackBar.open("Se registró correctamente..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))          
      }

      MuestraTipPasta(){
        this.listar_TipPasta = [];    
        this.EstampadoDigitalService.MuestraTipPasta(      
          ).subscribe(data =>
          {
            this.listar_TipPasta = data        
            this.RecargarTipPasta()       
          }
          )
      }
    
      RecargarTipPasta(){
        this.filtroTipPasta = this.formulario.controls['sCodTipPasta'].valueChanges.pipe(
          startWith(''),
          map(option => (option ? this._filterTipPasta(option) : this.listar_TipPasta.slice())),
        );    
      }
    
      private _filterTipPasta(value: string): TipPasta[] {        
        const filterValue = value.toLowerCase();    
        return this.listar_TipPasta.filter(option => String(option.Nom_Tip_Pasta).toLowerCase().indexOf(filterValue ) > -1 || 
        option.Nom_Tip_Pasta.toLowerCase().indexOf(filterValue ) > -1);
      }
    
      CambiarValorTipPasta(Tip_Pasta: string){
        this.Tip_Pasta = Tip_Pasta
      }
    

}


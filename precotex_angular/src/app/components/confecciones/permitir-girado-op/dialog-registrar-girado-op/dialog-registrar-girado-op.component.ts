import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DespachoOpIncompletaService} from 'src/app/services/despacho-op-incompleta.service'
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

interface data{
  Num_Grupo:    number,
  Cod_OrdPro:   string,
  Cod_Present:  number,
  Des_Present:   string,
  Cod_OrdTra:   string,
  Flg_Aprobado: string
}


interface data_det1 {
  Cod_OrdTra: string,
  Tela: string,
  Des_Comb: string,
  Tipo: string,
  Ancho_Acab: number,
  Ancho_Reposo: number,
  Ancho_Acab_T: number,
  Gramaje_Acab: number,
  Gramaje_Reposo: number,
  Gramaje_Acab_T: number,
  Encog_Ancho: number,
  EncogA_Lavado: number,
  Encog_Ancho_T: number,
  Encog_Largo: number,
  EncogL_Lavado: number,
  Encog_largo_T: number,
  Revirado: number,
  Revirado_Lavado: number,
  Revirado_T: number,
  Encogimiento_Tramo_Izquierdo: number,
  Encogimiento_Tramo_Centro: number,
  Encogimiento_Ancho_Derecho: number,
  Gramaje_Lavado: number,
  Nom_Auditor: string,
  Flg_Status_Apro: string,
  Fec_Registro: string,
  Observaciones: string
}

interface Motivo {
  IdMotivo: number;
  Nom_Motivo: string;
}


@Component({
  selector: 'app-dialog-registrar-girado-op',
  templateUrl: './dialog-registrar-girado-op.component.html',
  styleUrls: ['./dialog-registrar-girado-op.component.scss']
})
export class DialogRegistrarGiradoOpComponent implements OnInit {


  listar_operacionMotivo: Motivo[] = [];

  // nuevas variables

  Cod_Accion                = ''
  Num_Grupo                 = 0
  Cod_OrdPro                = ""
  Cod_Present               = 0
  Des_Present               = ""
  Flg_Aprobado              = ""
  Nom_Motivo                = ""
  Cod_Usuario               = ""
  Fec_Creacion              = ""
  Cod_Usuario_Aprobacion    = ""
  Fec_Creacion_Aprobacion   = ""
  Id_Motivo                 = 0
  Cod_OrdTra                = ""
  Flg_visible_button        = true
  Fec_Inicio                = ""
  Fec_Fin                   = ""
  Estado = "P"
  Partida = ""
  formulario = this.formBuilder.group({
    Cod_OrdPro:       [''],
    Cod_Present:      [0],
    Des_Present:      [''],
    Cod_OrdTra:       [''],
    Motivo:           ['']
  })

  dataSource2: MatTableDataSource<data_det1>;
  displayedColumns_cab2: string[] = ['Cod_OrdTra','Tela','Des_Comb','Tipo','Ancho_Acab','Ancho_Reposo','Ancho_Acab_T','Gramaje_Acab','Gramaje_Reposo','Gramaje_Acab_T','Encog_Ancho','EncogA_Lavado','Encog_Ancho_T','Encog_Largo','EncogL_Lavado','Encog_largo_T','Revirado','Revirado_Lavado','Revirado_T','Encogimiento_Tramo_Izquierdo','Encogimiento_Tramo_Centro','Gramaje_Lavado','Nom_Auditor','Flg_Status_Apro','Fec_Registro','Observaciones']


  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar,
              private despachoOpIncompletaService: DespachoOpIncompletaService,
              @Inject(MAT_DIALOG_DATA) public data: data)
  {
    this.dataSource2 = new MatTableDataSource();
    // this.formulario = formBuilder.group({
    //   //Partida:            ['', Validators.required],
    //   Partida:          ['', Validators.required],
    //   Kgacabado:        ['', Validators.required],
    //   Kgtenido:         ['', Validators.required],
    //   Motivo:           ['', Validators.required]
    // });

  }


  ngOnInit(): void {


    this.ListarDatosCabecera()
    this.CargarOperacionMotivo()
    this.formulario.controls['Cod_OrdPro'].setValue(this.data.Cod_OrdPro)
    this.formulario.controls['Cod_Present'].setValue(this.data.Cod_Present)
    this.formulario.controls['Des_Present'].setValue(this.data.Des_Present)
    this.formulario.controls['Cod_OrdTra'].setValue(this.data.Cod_OrdTra)
     this.Num_Grupo = this.data.Num_Grupo
    this.formulario.controls['Cod_OrdPro'].disable()
    this.formulario.controls['Des_Present'].disable()
    this.formulario.controls['Cod_OrdTra'].disable()
    // this.ListarDetalle1()
    this.ListarDetalle2()

    if(this.data.Flg_Aprobado == 'SI'){
      this.Flg_visible_button = false
      this.formulario.controls['Motivo'].disable();
    }
    else if(this.data.Flg_Aprobado == 'NO'){
      this.Flg_visible_button = true
      this.formulario.controls['Motivo'].enable();
    }
  }


  GuardarMotivo(){


    if(this.formulario.get('Motivo')?.value == ''){
      this.matSnackBar.open("No ha seleccionado ningun motivo para guardar..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }else{
    this.Cod_Accion           = 'M'
    this.Num_Grupo            = this.data.Num_Grupo
    this.Cod_OrdPro           = this.data.Cod_OrdPro
    this.Cod_Present          = this.data.Cod_Present
    this.Cod_OrdTra           = this.data.Cod_OrdTra
    this.Id_Motivo            = this.formulario.get('Motivo')?.value

    this.despachoOpIncompletaService.Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2(
      this.Cod_Accion,
      this.Num_Grupo,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_OrdTra,
      this.Id_Motivo,
      this.Fec_Inicio,
      this.Fec_Fin,
      this.Estado
    ).subscribe(
      (result: any) => {

          this.matSnackBar.open("Proceso Correcto!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
    }

  }

/* --------------- REGISTRAR CABECERA ------------------------------------------ */

  submit(formDirective) :void {
    this.Cod_Accion           = 'U'
    this.Num_Grupo            = this.data.Num_Grupo
    this.Cod_OrdPro           = this.data.Cod_OrdPro
    this.Cod_Present          = this.data.Cod_Present
    this.Cod_OrdTra           = this.data.Cod_OrdTra
    this.Id_Motivo            = this.formulario.get('Motivo')?.value
    this.despachoOpIncompletaService.Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2(
      this.Cod_Accion,
      this.Num_Grupo,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_OrdTra,
      this.Id_Motivo,
      this.Fec_Inicio,
      this.Fec_Fin,
      this.Estado
    ).subscribe(
      (result: any) => {

          this.matSnackBar.open("Proceso Correcto!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }

  CargarOperacionMotivo(){
    this.despachoOpIncompletaService.ListarMotivoDespachoOpIncompleta().subscribe(
      (result: any) => {
        console.log(result)
        this.listar_operacionMotivo = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  ListarDetalle2(){
    this.Cod_Accion           = 'T'
    this.Num_Grupo            = this.data.Num_Grupo
    this.Cod_OrdPro           = ""
    this.Cod_Present          = 0
    this.Cod_OrdTra           = ""
    this.Id_Motivo            = 0
    this.despachoOpIncompletaService.Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2(
      this.Cod_Accion,
      this.Num_Grupo,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_OrdTra,
      this.Id_Motivo,
      this.Fec_Inicio,
      this.Fec_Fin,
      this.Estado
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.dataSource2.data = result

        }
        else {
          //this.matSnackBar.open("No se encontraron registros...", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource2.data = []

        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }


  ListarDatosCabecera(){

    this.Cod_Accion           = 'C'
    this.Num_Grupo            = this.data.Num_Grupo
    this.Cod_OrdPro           = this.data.Cod_OrdPro
    this.Cod_Present          = this.data.Cod_Present
    this.Cod_OrdTra           = this.data.Cod_OrdTra
    this.Id_Motivo            = 0
    this.despachoOpIncompletaService.Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2(
      this.Cod_Accion,
      this.Num_Grupo,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_OrdTra,
      this.Id_Motivo,
      this.Fec_Inicio,
      this.Fec_Fin,
      this.Estado
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)

         if(result[0].Id_Motivo != ''){
         this.formulario.controls['Motivo'].setValue(result[0].Id_Motivo);

         }else{
          this.formulario.controls['Motivo'].setValue('');

         }

        }
        else {
          this.matSnackBar.open("No se encontraron registros...", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }



}

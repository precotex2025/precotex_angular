import { Component, OnInit, ViewChild } from '@angular/core';
import { LaboratorioLecturaRecetasService } from 'src/app/services/laboratorio-lectura-recetas.service';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GlobalVariable } from '../../VarGlobals'; //<==== this one
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { startWith, map,debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Auditor } from 'src/app/models/Auditor';
import { Digitador } from 'src/app/models/Digitador';
import { Restriccion } from 'src/app/models/Restriccion';
import { MatPaginator } from '@angular/material/paginator';

interface data_det {
  Num_Corre: string,
  Nom_Analista: string,
  Nom_Cliente: string,
  Clave: string,
  Des_Colcli: string,
  Des_Colorante : string,
  Fec_Programa: string,
  Fec_Termino: string,
  Partidas: string,
  Color:string,
}  



@Component({
  selector: 'app-laboratorio-lectura-recetas',
  templateUrl: './laboratorio-lectura-recetas.component.html',
  styleUrls: ['./laboratorio-lectura-recetas.component.scss']
})
export class LaboratorioLecturaRecetasComponent implements OnInit {

  NgAnalista="";
  NgStiker: string = '';

  NgCliente: string = '';
  NgClave: string = '';
  NgSdColor: string = '';
  NgColorante: string = '';
  NgFecpro: string = '';
  NgFecem: string = '';
  NgPartida: string = '';
  NgColorLab: string = '';

  public data_det = [{
    Num_Corre: "",
    Nom_Analista: "",
    Nom_Cliente: "",
    Clave: "",
    Des_Colcli: "",
    Des_Colorante : "",
    Fec_Programa: "",
    Fec_Termino: "",
    Partidas: "",
    Color:"",
      
    }]
  



  formulario = this.formBuilder.group({
    nsticker:          ['',[Validators.required]],
    nanalista:         [''],
     ncliente:         [''],
     nclave:           [''],
     nsdccolor:       [''],
     ncolorante:       [''],
     nfpro:            [''],
     nfter:           [''],
     npartida:            [''],  
     ncollab:          [''],  
  }) 

  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar,  private dialog: MatDialog, private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService, private exceljsService:ExceljsService, private LaboratorioLecturaRecetas:LaboratorioLecturaRecetasService) 
    {
      this.dataSource = new MatTableDataSource();
     }

  ngOnInit(): void {
    this.formulario.get('nanalista').disable();
    this.formulario.get('ncliente').disable();
    this.formulario.get('nclave').disable();
    this.formulario.get('nsdccolor').disable();
    this.formulario.get('ncolorante').disable();
    this.formulario.get('nfpro').disable();
    this.formulario.get('nfter').disable();
    this.formulario.get('npartida').disable();
    this.formulario.get('ncollab').disable();
    this.onToggle();
  }



  onToggle() {
    if (this.formulario.get('nsticker')?.value.length >= 5) {
        this.showLecturaReceta() ;
        console.log('hola')
    }

  }

  showLecturaReceta() {
    this.LaboratorioLecturaRecetas.showLecturaReceta("R",this.formulario.get('nsticker')?.value).subscribe(
           (result: any) => {
          this.NgAnalista=result[0].Nom_Analista;
          this.NgCliente=result[0].Nom_Cliente;
          this.NgClave=result[0].Clave;
          this.NgSdColor=result[0].Des_Colcli;
          this.NgColorante=result[0].Des_Colorante;
          this.NgFecpro=result[0].Fec_Programa;
          this.NgFecem=result[0].Fec_Termino;
          this.NgPartida=result[0].Partidas;
          this.NgColorLab=result[0].Color;
          
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }



  submit(formDirective) :void {
    
          this.LaboratorioLecturaRecetas.showGrabarLecturaReceta("T",
            this.formulario.get('nsticker')?.value
            ).subscribe(
            (result: any) => {
              console.log(result);
              //this.dialog.closeAll();
              if (result) {
                if (result.Mensaje == 'Ok') {
                  this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
                  this.limpiar()
                } else {
                  this.matSnackBar.open(result.Mensaje, 'Cerrar', {
                    duration: 3000,
                  })
                }
              } else {
                this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
              }

            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

      }


      limpiar(){
        this.formulario.get('nanalista')?.setValue('');
        this.formulario.get('ncliente')?.setValue('');
        this.formulario.get('nclave')?.setValue('');
        this.formulario.get('nsdccolor')?.setValue('');
        this.formulario.get('ncolorante')?.setValue('');
        this.formulario.get('nfpro')?.setValue('');
        this.formulario.get('nfter')?.setValue('');
        this.formulario.get('nmetros')?.setValue('');
        this.formulario.get('npartida')?.setValue('');
        this.formulario.get('ncollab')?.setValue('');
        document.getElementById("nsticker")?.focus();
      }
 




}

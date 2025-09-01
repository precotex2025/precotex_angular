import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroCalidadTejeduriaService } from 'src/app/services/registro-calidad-tejeduria.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService }  from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiberarpartidacalidadService } from 'src/app/services/liberarpartidacalidad.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Auditor } from 'src/app/models/Auditor';
import { Restriccion } from 'src/app/models/Restriccion';
import { GlobalVariable } from '../../VarGlobals';
import { MatPaginator } from '@angular/material/paginator';
import { allowedNodeEnvironmentFlags } from 'process';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThisReceiver } from '@angular/compiler';

interface data_det {
  Partida: string,
  Usuario_Liberacion: string,
  Fecha_Liberacion: string,
  Pc_Liberacion: string,
}



@Component({
  selector: 'app-liberar-partida-calidad',
  templateUrl: './liberar-partida-calidad.component.html',
  styleUrls: ['./liberar-partida-calidad.component.scss']
})
export class LiberarPartidaCalidadComponent implements OnInit {
  Cod_Ordtra = "";

  formulario = this.formBuilder.group({
    l_partida:                [''],
  }); 

  displayedColumns_cab: string[] = 
  ['Partida', 'Usuario_Liberacion', 'Fecha_Liberacion', 'Pc_Liberacion', 'Eliminar']
  dataSource: MatTableDataSource<data_det>;

  @ViewChild('myinputAdd') inputAdd!: ElementRef;
  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar,   
    private dialog: MatDialog, 
    private RegistroCalidadTejeduriaService: RegistroCalidadTejeduriaService,
    //private DialogAuditoriaRegistroCalidadOtComponent: DialogAuditoriaRegistroCalidadOtComponent,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService,
    private router: Router,
    private route: ActivatedRoute,
    private LiberarpartidacalidadService: LiberarpartidacalidadService) { 
      this.dataSource = new MatTableDataSource();
    }


    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.Cod_Ordtra = this.formulario.get('l_partida')?.value;
    this. showMostrarListaPartidas();
    this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
  }

  ngAfterViewInit() {
    this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"

    this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'items por pagina';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1}  - ${endIndex} de ${length}`;
      };
  }


  showMostrarListaPartidas() {
    this.SpinnerService.show();
    
    this.LiberarpartidacalidadService.ShowPartidasLiberadas(this.Cod_Ordtra, "L").subscribe(
      (result: any) => {
        this.dataSource = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  showActualizarListado() {
    this.SpinnerService.show();
    
    this.LiberarpartidacalidadService.ShowPartidasLiberadas(this.Cod_Ordtra, "A").subscribe(
      (result: any) => {
        this.dataSource = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  LiberarPartida() {
    this.SpinnerService.show();
    this.Cod_Ordtra = this.formulario.get('l_partida')?.value;
    if(confirm("Desea liberar partida?")) {
    this.LiberarpartidacalidadService.ShowPartidasLiberadas(this.Cod_Ordtra, "I").subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
        this.dataSource = result
        this. showActualizarListado();
        this.matSnackBar.open('Se libero correctamente!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.formulario.get('l_partida').setValue("");
        this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
      }
      else {
        
        this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.formulario.get('l_partida').setValue("");
        this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
      }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
}


  EliminarPartidaLiberacion(Cod_Ordtra: string) {
    this.SpinnerService.show();
    if(confirm("Desea Eliminar este registro?")) {
    this.LiberarpartidacalidadService.ShowPartidasLiberadas(Cod_Ordtra, "D").subscribe(
      (result: any) => {
      if (result[0].Respuesta == 'OK') {
        this.dataSource = result
        this. showActualizarListado();
        this.matSnackBar.open('Se Elimino correctamente!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.formulario.get('l_partida').setValue("");
        this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
      }
      else {
        this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.formulario.get('l_partida').setValue("");
        this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
      }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  }

  Funcion_Cancelar(){
    this.router.navigate(['/']);
  }


}

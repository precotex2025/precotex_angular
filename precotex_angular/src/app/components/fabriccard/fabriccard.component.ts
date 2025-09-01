import {Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExceljsService } from 'src/app/services/exceljs.service';

import { AprofabriccardService } from 'src/app/services/aprofabriccard.service';
import { DialogAprobFabriccardComponent } from './dialog-aprob-fabriccard/dialog-aprob-fabriccard.component';
import { DialogRecepFabriccardComponent } from './dialog-recep-fabriccard/dialog-recep-fabriccard.component';




interface data_det {
  FechaRegistro: string
  Num_Fabric: string
  Partida : string
  Sec : string
  Cliente : string
  Color   : string
  Tela: string
  Temporada : string
  Estilo_Cliente : string
  Op : string
  Estado: string
  PARTIDA_KGS_ASIGNADOS:string
}



@Component({
  selector: 'app-fabriccard',
  templateUrl: './fabriccard.component.html',
  styleUrls: ['./fabriccard.component.scss']
})
export class FabriccardComponent implements OnInit {
  miFormulario: FormGroup;

  formulario = this.formBuilder.group({
    Partida:   ['']
  })
  @ViewChild('MyPartida') inputPartida!: ElementRef;

  displayedColumns_cab: string[] = [
    'Acciones',
    'FechaRegistro',
    'Num_Fabric',
    'Partida',
    'Sec',
    'Cliente',
    'Color',
    'Tela',
    'Temporada',
    'Estilo_Cliente',
    'Grupo_Textil',
    'Op',
    'Primera_Partida',
    'Estado'
    
  ]


  dataSource: MatTableDataSource<data_det>;
  dataResult:Array<any> = [];
  dataForExcel = [];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private exceljsService: ExceljsService,
    public dialog: MatDialog,
    private aprofabriccardservice : AprofabriccardService,
    private SpinnerService: NgxSpinnerService) 
    
    { this.dataSource = new MatTableDataSource();}
    @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngOnInit(): void {
     //this.MostrarCabeceraFabricC()
  }


  ngAfterViewInit() {
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







  MostrarCabeceraFabricC(partida?: string) {

    this.SpinnerService.show();
    
    const codigoPartida: string = this.formulario.get('Partida')?.value!;
    //console.log(codigoGrupo);

    this.aprofabriccardservice.mantenimientoAprobacionFabricService('',codigoPartida,'','','','').subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
         
          this.dataSource.data = result
          this.dataResult = result;
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }



  generateExcel() {
    this.dataForExcel = [];
    this.dataResult.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: 'ASIGNACION DE AREAS PERMISO',
      data: this.dataForExcel,
      headers: Object.keys(this.dataResult[0])
    }
  
    this.exceljsService.exportExcel(reportData);
  
  }


  buscar(event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}


openDialogModificar(data) {
  let dialogRef = this.dialog.open(DialogAprobFabriccardComponent, {
    disableClose: false,
    panelClass: 'my-class',
    data: {
      boton:'ACTUALIZAR',
      title:'ACTUALIZAR AREA PERMISO',
      Opcion:'U',
      Datos: data
    }
    ,minWidth: '43vh'
  });

  dialogRef.afterClosed().subscribe(result => {
    this.MostrarCabeceraFabricC('');
  })

}


openDialogRecepcionar(data) {
  let dialogRef = this.dialog.open(DialogRecepFabriccardComponent, {
    disableClose: false,
    panelClass: 'my-class',
    data: {
      boton:'RECEPCIONAR',
      title:'RECEPCIONAR',
      Opcion:'U',
      Datos: data
    }
    ,minWidth: '43vh'
  });

  dialogRef.afterClosed().subscribe(result => {
    this.MostrarCabeceraFabricC('');
  })

}


buscarPartida(event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}





}

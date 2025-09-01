import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaProcesoCorteService } from 'src/app/services/auditoria-proceso-corte.service';

@Component({
  selector: 'app-valida-corte-despacho',
  templateUrl: './valida-corte-despacho.component.html',
  styleUrls: ['./valida-corte-despacho.component.scss']
})
export class ValidaCorteDespachoComponent implements OnInit {

  formulario = this.formBuilder.group({
    Cantidad: [0, Validators.required],
    Porcentaje: [0, Validators.required],
    Cod_Usuario: [""]
  });

  displayedColumns: string[] = ['Orden','Cantidad', 'Porcentaje', 'FechaHora', 'Estado', 'Usuario']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private auditoriaProcesoCorteService: AuditoriaProcesoCorteService    
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.onListarRegistros();
  }

  onListarRegistros(){
    this.auditoriaProcesoCorteService.MantenimientValidaCorteDespacho('V', 0, 0, GlobalVariable.vusu)
      .subscribe((result: any) => {
        if(result.length > 0){
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onActualizarRegistro(){
    const formValues = this.formulario.getRawValue();

    if (formValues.Cantidad > 0 && formValues.Porcentaje > 0){
      this.auditoriaProcesoCorteService.MantenimientValidaCorteDespacho('I', formValues.Cantidad, formValues.Porcentaje, GlobalVariable.vusu)
        .subscribe((result: any) => {
          this.onListarRegistros();

          this.formulario.controls['Cantidad'].setValue(0);
          this.formulario.controls['Porcentaje'].setValue(0);
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );
    } else {
      this.matSnackBar.open('Cantidad y/o porcentaje inválidos!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.spinnerService.hide();
    }

  }

}

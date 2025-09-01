import { Component, OnInit, Inject } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalVariable } from '../../../VarGlobals';

interface Formatos {
  Tipo_Ficha: string;
  Nom_Ficha: string;
}

@Component({
  selector: 'app-dialog-visor-fichas',
  templateUrl: './dialog-visor-fichas.component.html',
  styleUrls: ['./dialog-visor-fichas.component.scss']
})

export class DialogVisorFichasComponent implements OnInit {

  displayedColumns: string[] = ['Formato']
  dataSource: MatTableDataSource<Formatos>;
  
  formatos: Formatos[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<DialogVisorFichasComponent>
  ){}

  ngOnInit(): void {
    this.formatos = GlobalVariable.Arr_Medidas;
  }

   
}
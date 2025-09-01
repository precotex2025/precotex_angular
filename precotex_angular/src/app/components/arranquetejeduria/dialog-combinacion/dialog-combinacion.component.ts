import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';

interface data_det {
  //ComboTalla: string
  Combinacion: string,
  Talla: string
}

interface data {
  boton: string;
  title: string;
  CodOrdtra: string;
}

@Component({
  selector: 'app-dialog-combinacion',
  templateUrl: './dialog-combinacion.component.html',
  styleUrls: ['./dialog-combinacion.component.scss']
})
export class DialogCombinacionComponent implements OnInit {

  displayedColumns_cab: string[] = [
    'Combi',
    'Talla',
    'Opciones'
  ]    
  dataSource: MatTableDataSource<data_det>;

  listar_comboTalla:  data_det[] = [];

  constructor(
    private matSnackBar       : MatSnackBar             ,
    private arranquetejeduria : ArranquetejeduriaService,
    @Inject(MAT_DIALOG_DATA) public data: data          ,
    public dialogRef: MatDialogRef<DialogCombinacionComponent> 
  ) { this.dataSource = new MatTableDataSource(); }

  ngOnInit(): void {
    this.MostrarCombinacionesArranque(this.data.CodOrdtra);
  }

  marcarCombo(data:data_det){
    this.dialogRef.close(data);
  }

  MostrarCombinacionesArranque(Cod_Ordtra: string) {
    this.arranquetejeduria
      .obtenerCombinacionesArranque(Cod_Ordtra)
      .subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.listar_comboTalla = result;
          }
        },
        (err: HttpErrorResponse) =>
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
        })
    );
  }
}

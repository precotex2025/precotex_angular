import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService }  from "ngx-spinner";

import { AuditoriaProcesoCorteService } from 'src/app/services/auditoria-proceso-corte.service';

@Component({
  selector: 'app-dialog-color',
  templateUrl: './dialog-color.component.html',
  styleUrls: ['./dialog-color.component.scss']
})
export class DialogColorComponent implements OnInit {

  formulario = this.formBuilder.group({
    Cod_OrdPro: ['', Validators.required],
    Num_Items: [0]
    },{
      validators: this.validarNumItems
  });

  ln_NumItem: number = 0;
  ll_EditItem: boolean = false;
  ll_Pendiente: boolean = true;

  displayedColumns: string[] = ['select','Cod_Present', 'Des_Present']
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private formBuilder: FormBuilder,
    private auditoriaProcesoCorteService: AuditoriaProcesoCorteService,
    public dialogRef: MatDialogRef<DialogColorComponent>,
    //public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    
  }

  onBuscarOp(){
    let codOrdPro = this.formulario.get('Cod_OrdPro')?.value
    if(codOrdPro.length == 0 || codOrdPro.length >= 5){

      this.spinnerService.show();
      this.auditoriaProcesoCorteService.MantenimientLiberaOPColor('C', codOrdPro, '', '')
        .subscribe((result: any) => {
          if(result.length > 0){
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }else{
            this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = []
          }
          this.spinnerService.hide();
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );
    }

  }
  
  validarNumItems(form: FormGroup){
    const numItems = form.get('Num_Items')?.value;
    return numItems > 0 ? null : { mismatch: true };
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.formulario.controls['Num_Items'].setValue(numSelected);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Cod_Present! + 1}`;
  }
  

}

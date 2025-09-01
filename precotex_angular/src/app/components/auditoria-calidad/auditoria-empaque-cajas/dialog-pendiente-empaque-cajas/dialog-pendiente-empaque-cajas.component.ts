import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

interface data_det {
  Num_Caja?: number;
  Num_Packing?: number;
  Des_Cliente?: string;
  Des_Modulo?: string;
  Nom_Auditor?: string;
}

@Component({
  selector: 'app-dialog-pendiente-empaque-cajas',
  templateUrl: './dialog-pendiente-empaque-cajas.component.html',
  styleUrls: ['./dialog-pendiente-empaque-cajas.component.scss']
})
export class DialogPendienteEmpaqueCajasComponent implements OnInit {
  
  displayedColumns: string[] = ['Num_Caja','Num_Packing','Des_Cliente','Des_Modulo','Nom_Auditor'];

  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(@Inject(MAT_DIALOG_DATA) public data: data_det[]) {}

  ngOnInit(): void {
    //console.log(this.data)
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
  }

}

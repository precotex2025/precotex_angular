import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

interface data {
  usuarios: Array<any>
}

export interface PeriodicElement {
  Cod_Trabajador: string;
  Apellidos: string;
  Nombre_Trabajador: number;
  Email: string;
  Nro_DNI: string;
  Tip_Trabajador: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-dialog-select-usuario',
  templateUrl: './dialog-select-usuario.component.html',
  styleUrls: ['./dialog-select-usuario.component.scss']
})
export class DialogSelectUsuarioComponent implements OnInit {
  displayedColumns: string[] = ['Cod_Trabajador', 'Apellidos', 'Nombre_Trabajador', 'Nro_DNI', 'Tip_Trabajador'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<PeriodicElement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(@Inject(MAT_DIALOG_DATA) public data: data,
  private dialogRef: MatDialogRef<DialogSelectUsuarioComponent>,
  private matSnackBar: MatSnackBar) { }
  row:any = "";
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data.usuarios);
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

  agregarColumna(row){
    this.row = row;
  }

  cerrarModal(){
    if(this.row != ''){
      this.dialogRef.close(this.row);
    }else{
      this.matSnackBar.open("Debes seleccionar un registro de la tabla..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closeModal(){
    this.dialogRef.close();
  }
}

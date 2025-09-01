import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { ModularMantenimientoInspectorasService } from 'src/app/services/modular/mantenimiento-inspectoras.service';
import { DialogMantenimientoComponent } from './dialog-mantenimiento/dialog-mantenimiento.component';


interface data_det {
  Cod_Modulo: string,
  Cod_Usuario: string,
  Tip_Trabajador: string,
  Cod_Trabajador: string,
  Fecha_Registro: Date
}

@Component({
  selector: 'app-modular-mant-inspectoras',
  templateUrl: './modular-mant-inspectoras.component.html',
  styleUrls: ['./modular-mant-inspectoras.component.scss']
})

export class ModularMantInspectorasComponent implements OnInit {

  displayedColumns: string[] = [
    'Nom_Usuario',
    'Des_Modulo',
    'Fecha_Registro',
    'acciones'
  ];

  Buscar: String = ''

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private mantenimientoinspectorasService: ModularMantenimientoInspectorasService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.obtenerInspectorasModular();
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

  obtenerInspectorasModular() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.mantenimientoinspectorasService.obtenerModuloInpectoras(
      'L',
      '',
      '',
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
        }else{
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
        })
      })

  }

  openDialogModulos() {
    let dialogRef = this.dialog.open(DialogMantenimientoComponent, {
      disableClose: false,
      minWidth: '800px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: {
        tipo: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result); 
        if(result == undefined) {
          this.obtenerInspectorasModular();
        }
        
    })
  }

  openEditarModulo(data) {
    let dialogRef = this.dialog.open(DialogMantenimientoComponent, {
      disableClose: false,
      minWidth: '800px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: {
        datos: data,
        tipo: 2
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result); 
        if(result == undefined) {
          this.obtenerInspectorasModular();
        }
        
    })
  }

  OpenEliminar(data) {
    console.log(data);
    if (confirm('Esta seguro(a) de eliminar el siguiente registro?')) {
      this.SpinnerService.show();
      this.mantenimientoinspectorasService.obtenerModuloInpectoras(
        'D',
        data.Cod_Usuario,
        '',
        '',
        '',
        ''
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Se elimino el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            this.obtenerInspectorasModular();
          }else{
            this.matSnackBar.open('Ha ocurrido un error al eliminar el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
          })
        })
    }

  }

  applyFilter() {
    console.log(this.Buscar)
    const filterValue = this.Buscar;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

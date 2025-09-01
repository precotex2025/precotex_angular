import { Component, OnInit, AfterViewInit, ViewChild, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';
import { ActivatedRoute, Router } from '@angular/router';

import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MantMaestroBolsaItemComponent } from '../mant-maestro-bolsa-item/mant-maestro-bolsa-item.component';


import { data } from 'jquery';
import { MantMaestroBolsaItemDetService } from 'src/app/services/bolsa/mant-maestro-bolsa-item-det.service';
import { DialogMaestroBolsaModificarComponent } from './dialog-maestro-bolsa-modificar/dialog-maestro-bolsa-modificar.component';
import { DialogMaestroBolsaIteDetModificarComponent } from './dialog-maestro-bolsa-modificar/dialog-maestro-bolsa-ite-det-modificar/dialog-maestro-bolsa-ite-det-modificar.component';

interface data_det {
  Id_Bolsa: number,
  Id_Bolsa_Det: number,
  Id_Barra: number,
  Cod_Barra: string,
  Cod_OrdPro: string,
  Cod_Present: number,
  Des_Present: string,
  Cod_Talla: string,
  Num_SecOrd: number,
  Cod_Item: string,
  Cantidad: number,
  Cod_Usuario_Creacion: string,
  Fecha_Creacion: string,
  Cod_Usuario_Modificacion: string,
  Fecha_Modificacion: string,
  Cod_EstCli: string
}

interface data {
  Id_Bolsa: number,
  Id_Bolsa_Det: number,
  Id_Barra: number,
  Cod_Barra: string,
  Cod_OrdPro: string
}

@Component({
  selector: 'app-mant-maestro-bolsa-item-det',
  templateUrl: './mant-maestro-bolsa-item-det.component.html',
  styleUrls: ['./mant-maestro-bolsa-item-det.component.scss']
})
export class MantMaestroBolsaItemDetComponent implements OnInit {

  Cod_Usuario = GlobalVariable.vusu;
  Id = 0;
  Id_Det = 0;
  Id_Bolsa = 0;
  Id_Bolsa_Det = 0;
  Id_Barra = 0;
  Cod_Barra = 0;
  Cod_OrdPro = '';
  Cod_Present = 0;
  Des_Present = '';
  Num_SecOrd = ''; 
  Flg_Edita: boolean = true;

  displayedColumns: string[] = [
    'Id_Barra',
    'Cod_EstCli',
    'Cod_OrdPro',
    //'Cod_Present',
    'Des_Present',
    'Cod_Talla',
    'Cantidad',
    'Num_SecOrd',
    'Cod_Item',
    'Cod_Usuario_Creacion',
    'Fecha_Creacion',
    'Cod_Usuario_Modificacion',
    'Fecha_Modificacion',
    'acciones'
  ];

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private bolsaitemdetService: MantMaestroBolsaItemDetService
  ) { this.dataSource = new MatTableDataSource();}

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      if (res != null) {
        this.Id = res['Id'];
        this.Id_Det = res['Id_Det'];
        this.Cod_Barra = res['Cod_Barra'];
        this.Flg_Edita = String(res['Flg_Edita']) == "true" ? true : false;
      }
    });
    this.obtenerDatos();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  obtenerDatos() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.bolsaitemdetService.obtenerDatos_D(
      'V',
      this.Id,
      this.Id_Det,
      0,
      '',
      0,
      '',
      '',
      0,
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
          console.log(this.dataSource.data);
        } else {
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

  openDialogOp() {
    let dialogRef = this.dialog.open(DialogMaestroBolsaModificarComponent, {
      disableClose: false,
      minHeight: '30%',
      minWidth: '850px',
      panelClass: 'my-class',
      maxWidth: '95%',
      /*data: {
        Id_Bolsa: this.Id_Bolsa,
        Id_Bolsa_Det: this.Id_Bolsa_Det,
        Cod_OrdPro: this.Cod_OrdPro,
        Cod_Present: this.Cod_Present,
        Des_Present: this.Des_Present,
        Num_Sec_Ord: this.Num_SecOrd
      }*/
    });
    dialogRef.afterClosed().subscribe(result => {
      this.obtenerDatos();
    })
  }

  openDialogEditar(data) {
    let dialogRef = this.dialog.open(DialogMaestroBolsaIteDetModificarComponent, {
      disableClose: false,
      minWidth: '800px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: {
        Id_Bolsa: data.Id_Bolsa,
        Id_Bolsa_Det: data.Id_Bolsa_Det,
        Id_Barra: data.Id_Barra,
        Cod_Present: data.Cod_Present,
        Cod_Talla: data.Cod_Talla.trim(),
        Cod_OrdPro: data.Cod_OrdPro,
        Cantidad: data.Cantidad
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.obtenerDatos();
    })
  }

  Volver() {
    let datos = {
      Id: this.Id,
      Flg_Edita: this.Flg_Edita
    }
    this._router.navigate(['/MantMaestroBolsaItem'], { skipLocationChange: true, queryParams: datos });
  }

  DeleteRegistro(data) {
    if (confirm('Esta seguro(a) de eliminar el siguiente registro?')) {
      this.SpinnerService.show();
      // this.PageIndex = this.dataSource.paginator.pageIndex
      this.bolsaitemdetService.obtenerDatos_D(
        'D',
        data.Id_Bolsa,
        data.Id_Bolsa_Det,
        data.Id_Barra,
        '',
        0,
        '',
        '',
        0
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Se elimino el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            this.obtenerDatos();
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
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

}

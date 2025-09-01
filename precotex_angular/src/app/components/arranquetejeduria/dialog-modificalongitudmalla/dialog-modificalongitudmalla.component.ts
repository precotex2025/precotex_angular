import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  ViewChild,
  ElementRef,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';

import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { DialogModificalongitudmalla2Component } from '../dialog-modificalongitudmalla2/dialog-modificalongitudmalla2.component';

interface data {
  Cod_Ordtra: string;
  Cod_Maquina_Tejeduria: string;
  Num_Secuencia_OrdTra: string;
  Estado: string;
}

interface data_det {
  Cod_Ordtra: string;
  Cod_HilTel: string;
  Long_Malla: number;
  Long_Malla_Real: number;
}

@Component({
  selector: 'app-dialog-modificalongitudmalla',
  templateUrl: './dialog-modificalongitudmalla.component.html',
  styleUrls: ['./dialog-modificalongitudmalla.component.scss'],
})
export class DialogModificalongitudmallaComponent implements OnInit {
  public data_det = [
    {
      Cod_Ordtra: '',
      Cod_HilTel: '',
      Long_Malla: 0,
      Long_Malla_Real: 0,
    },
  ];

  Cod_Ordtra = this.data.Cod_Ordtra;
  Cod_Maquina_Tejeduria = this.data.Cod_Maquina_Tejeduria;
  Num_Secuencia_OrdTra = this.data.Num_Secuencia_OrdTra;
  Estado = this.data.Estado;

  Cod_Accion = '';

  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor: [''],
    fec_registro: [''],
    auditor: [''],
  });

  dataSource: MatTableDataSource<data_det>;
  dataResult: Array<any> = [];
  displayedColumns_cab: string[] = [
    'Codigo_Hilado',
    'Longitud_Malla',
    'Longitud_Malla_Real',
    'Acciones',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private arranquetejeduria: ArranquetejeduriaService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogModificalongitudmalla2Component>
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    console.log(this.data.Estado)
    this.MostrarLongitudMalla();
  }

  MostrarLongitudMalla() {
    this.arranquetejeduria.MostrarLongitudMalla(this.data.Cod_Ordtra).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataSource.data = result;
          this.dataResult = result;
        } else {
          this.matSnackBar.open('No existen registros..!!', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
          this.dataSource.data = [];
          //this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
    );
  }

  ModificarLongitudMalla(Cod_Ordtra: string, Cod_HilTel: string, Long_Malla: string, Long_Malla_Real: string) {
    let dialogRef = this.dialog.open(DialogModificalongitudmalla2Component, {
      disableClose: true,
      data: { Tipo      : 'I',
              Cod_Ordtra: Cod_Ordtra,
              Cod_HilTel: Cod_HilTel,
              Cod_Maquina_Tejeduria : this.Cod_Maquina_Tejeduria,
              Num_Secuencia_OrdTra  : this.Num_Secuencia_OrdTra,
              Long_Malla: Long_Malla,
              Long_Malla_Real: Long_Malla_Real,

            }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.MostrarLongitudMalla()
    })
  }
}

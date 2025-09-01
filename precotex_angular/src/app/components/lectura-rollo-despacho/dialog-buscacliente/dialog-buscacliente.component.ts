import {
  Output,
  EventEmitter,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LecturarollodespachoService } from 'src/app/services/lecturarollodespacho.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { LecturaRolloDespachoComponent } from '../lectura-rollo-despacho.component';

interface data {
  Abreviatura: string;
  Nombre: string;
}

interface data_det {
  Abreviatura: string;
  Nombre: string;
}

@Component({
  selector: 'app-dialog-buscacliente',
  templateUrl: './dialog-buscacliente.component.html',
  styleUrls: ['./dialog-buscacliente.component.scss'],
})
export class DialogBuscaclienteComponent implements OnInit {
  public data_det = [
    {
      Abreviatura: '',
      Nombre: '',
    },
  ];

  formulario = this.formBuilder.group({});

  dataSource: MatTableDataSource<data_det>;
  dataResult: Array<any> = [];
  displayedColumns_cab: string[] = ['Abreviatura', 'Nombre', 'Seleccion'];

  @Output() submitClicked = new EventEmitter<any>();
  @Output() submitClicked2 = new EventEmitter<any>();
  @Output() submitClicked3 = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<LecturaRolloDespachoComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private exceljsService: ExceljsService,
    private router: Router,
    private route: ActivatedRoute,
    private LecturarollodespachoService: LecturarollodespachoService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.MostrarCliente();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };
  }

  MostrarCliente() {
    this.LecturarollodespachoService.ShowListaClienteDespacho('', '').subscribe(
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


  EnviarCliente(Codigo_Cliente, Abreviatura_Cliente, Nombre_Cliente){
  
    this.submitClicked.emit(Codigo_Cliente);
    this.submitClicked2.emit(Abreviatura_Cliente);
    this.submitClicked3.emit(Nombre_Cliente);
    //Codigo_Cliente

    this.dialogRef.close();
    console.log("Codigo_Cliente es :"+Codigo_Cliente)
  }

  buscarCliente(event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}

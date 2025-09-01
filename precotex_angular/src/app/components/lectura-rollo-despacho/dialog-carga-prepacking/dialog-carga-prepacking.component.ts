import { Output, EventEmitter, Component, OnInit, ViewChild, ElementRef , Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService }  from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LecturarollodespachoService } from 'src/app/services/lecturarollodespacho.service';
import { LecturaRolloDespachoComponent } from '../lectura-rollo-despacho.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



interface data {
  Codigo_Cliente: string,
  Codigo: string,
  Rollos: string,
  CodigoPacking: string,
}

interface data_det {
  Codigo: string,
  Rollos: string,
}



@Component({
  selector: 'app-dialog-carga-prepacking',
  templateUrl: './dialog-carga-prepacking.component.html',
  styleUrls: ['./dialog-carga-prepacking.component.scss']
})
export class DialogCargaPrepackingComponent implements OnInit {

  Codigo_Cliente = this.data.Codigo_Cliente;

  public data_det = [
    {
      Codigo: '',
      Rollos: '',
          },
  ];

  dataSource: MatTableDataSource<data_det>;
  dataResult: Array<any> = [];
  displayedColumns_cab: string[] = 
  ['Codigo_PrePackingList', 'Total_Rollos', 'Total_Rollos_Lecturados', 'Total_Rollos_Faltantes', 'Seleccion']

  formulario = this.formBuilder.group({
    iBuscaPrePacking: [''],
  });

  @Output() submitClicked = new EventEmitter<any>();
  @Output() submitClicked2 = new EventEmitter<any>();
  @Output() submitClicked3 = new EventEmitter<any>();
  @Output() submitClicked4 = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<LecturaRolloDespachoComponent>,
    private formBuilder: FormBuilder, private matSnackBar: MatSnackBar,   
    private dialog: MatDialog, 
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService,
    private router: Router,
    private route: ActivatedRoute,
    private LecturarollodespachoService: LecturarollodespachoService,
    @Inject(MAT_DIALOG_DATA) public data: data,) 
    {
      this.dataSource = new MatTableDataSource();
     }

     @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    console.log("Codigo cliente: "+this.Codigo_Cliente)
    this.MostrarPrePacking();

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


  MostrarPrePacking() {
    this.LecturarollodespachoService.ShowListaPrepacking(this.Codigo_Cliente).subscribe(
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

 
 
  EnviarCodPacking(CodPacking, Total_Rollos, Total_Rollos_Lecturados, Total_Rollos_Faltantes){
  
    //this.data.CodigoPacking = CodPacking
    //this.submitClicked.emit(CodPacking);
    this.submitClicked.emit(CodPacking);
    this.submitClicked2.emit(Total_Rollos);
    this.submitClicked3.emit(Total_Rollos_Lecturados);
    this.submitClicked4.emit(Total_Rollos_Faltantes);
    this.dialogRef.close();
    console.log("Codpacking es :"+CodPacking)
  }

  buscarPrePacking(event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  



}

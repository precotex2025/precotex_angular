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
import { LecturaRolloDespachoComponent } from '../lectura-rollo-despacho.component';
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



interface data {
  zzcod_cliente: string;
  zzcod_prepackinglist: string;
  zzcod_ordtra: string;
  zzcodigo_tela: string;
  zzTela:string;

}

interface data_det {
  xNro: string;
  xRollo: string;
  xTela: string;
  xColor: string;
  xTalla: string;
  xPesoNeto: string;
  xPesoBruto: string;
  xUnidades: string;
  xPartida: string;
}





@Component({
  selector: 'app-dialog-ver-pendientes',
  templateUrl: './dialog-ver-pendientes.component.html',
  styleUrls: ['./dialog-ver-pendientes.component.scss']
})
export class DialogVerPendientesComponent implements OnInit {
  dataSource: MatTableDataSource<data_det>;
  dataResult: Array<any> = [];
  displayedColumns_cab: string[] = 
  ['Cl_CodRollo', 'Cl_Peso', 'Cl_PesoBruto','Cl_NumRollo']
  
  formulario = this.formBuilder.group({
    iBuscaPendiente: [''],
  });

  // zzcod_cliente: string;
  // zzcod_prepackinglist: string;
  // zzcod_ordtra: string;

  zzzcod_cliente = this.data.zzcod_cliente;
  zzzcod_prepackinglist = this.data.zzcod_prepackinglist;
  zzzcod_ordtra = this.data.zzcod_ordtra;
  zzzcodigo_tela = this.data.zzcodigo_tela
  NomTela =  this.data.zzTela;

  public data_det = [
    {
      xNumRollo: '',
      xPeso: '',
      xUnidad: '',
      
    },
  ];


  constructor(public dialogRef: MatDialogRef<LecturaRolloDespachoComponent>,
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
    this.ShowPendientes();
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

  
  DetallePendiente(event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ShowPendientes() {
    // zzzcod_cliente = this.data.zzcod_cliente;
    // zzzcod_prepackinglist = this.data.zzcod_prepackinglist;
    // zzzcod_ordtra = this.data.zzcod_ordtra;

    console.log("zzzcod_cliente :"+this.zzzcod_cliente);
    console.log("zzzcod_prepackinglist :"+this.zzzcod_prepackinglist);
    console.log("zzzcod_ordtra :"+this.zzzcod_ordtra);
    console.log("zzzcodigo_tela :"+this.zzzcodigo_tela);
  
    this.LecturarollodespachoService.ShowPendientes(this.zzzcod_cliente, this.zzzcod_prepackinglist, this.zzzcod_ordtra, this.zzzcodigo_tela  ).subscribe(
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

  

}

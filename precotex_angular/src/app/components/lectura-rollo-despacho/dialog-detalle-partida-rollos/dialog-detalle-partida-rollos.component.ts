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
import { DialogVerPendientesComponent } from '../dialog-ver-pendientes/dialog-ver-pendientes.component';
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
  xcod_cliente: string;
  xcod_prepackinglist: string;
  xcod_ordtra: string;
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
  selector: 'app-dialog-detalle-partida-rollos',
  templateUrl: './dialog-detalle-partida-rollos.component.html',
  styleUrls: ['./dialog-detalle-partida-rollos.component.scss'],
})
export class DialogDetallePartidaRollosComponent implements OnInit {
  xxcod_cliente = this.data.xcod_cliente;
  xxcod_prepackinglist = this.data.xcod_prepackinglist;
  xxcod_ordtra = this.data.xcod_ordtra;

  public data_det = [
    {
      xPartida: '',
      xTela: '',
      xColor: '',
      xTotal: '',
      xLeido: '',
      xPendientes: '',
    },
  ];

  dataSource: MatTableDataSource<data_det>;
  dataResult: Array<any> = [];
  displayedColumns_cab: string[] = 
  ['Cl_Partida', 'Cl_Tela', 'Cl_Color','Cl_Total', 'Cl_Leido', 'Cl_Pendientes', 'Cl_VerPendientes']

  formulario = this.formBuilder.group({
    iBuscaPrePacking: [''],
  });


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
      this.ShowDetallePartida();
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

  

  DetallePacking(event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  // xxcod_cliente = this.data.xcod_cliente;
  // xxcod_prepackinglist = this.data.xcod_prepackinglist;
  // xxcod_ordtra = this.data.xcod_ordtra;
  ShowDetallePartida() {

    console.log("xxcod_cliente :"+this.xxcod_cliente);
    console.log("xxcod_prepackinglist :"+this.xxcod_prepackinglist);
    console.log("xxcod_ordtra :"+this.xxcod_ordtra);

    this.LecturarollodespachoService.ShowDetallePartida('1',this.xxcod_cliente, this.xxcod_prepackinglist, this.xxcod_ordtra ).subscribe(
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
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
    );
  }


  
  VerPendientes(Codigo_Ordtra, Codigo_Tela ) {
    let zcod_cliente = this.xxcod_cliente
    let zcod_prepackinglist = this.xxcod_prepackinglist
    let zcod_ordtra = this.xxcod_ordtra
    //console.log("VerDetallePartida :"+this.xCodCliente);
    let dialogRef = this.dialog.open(DialogVerPendientesComponent, {
      disableClose: false,
      minWidth: '85%',
      minHeight: '80%',
      maxHeight: '98%',
      height: '90%',
      panelClass: 'my-class',
      data: {
        zzcod_cliente : zcod_cliente,
        zzcod_prepackinglist : zcod_prepackinglist,
        zzcod_ordtra : Codigo_Ordtra,
        zzcodigo_tela : Codigo_Tela.substr(0,8),
        zzTela :  Codigo_Tela 
      },
      
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });

   
  }




}

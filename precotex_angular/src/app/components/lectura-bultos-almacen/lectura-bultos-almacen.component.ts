
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import { LecturaBultosAlmacenService } from 'src/app/services/lectura-bultos-almacen.service';
import { DialogLecturaBultosComponent } from './dialog-lectura-bultos/dialog-lectura-bultos.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { Ubicacion_Almacen } from 'src/app/models/CodUbicacionAlmacen'
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { DialogEliminarComponent } from '../dialogs/dialog-eliminar/dialog-eliminar.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogTranferBultosComponent } from './dialog-tranfer-bultos/dialog-tranfer-bultos.component';


interface data_det {
  Cod_ubicacion: string
  Num_Corre: string
  Id_Num: number
  MyCodUbica: string
  Id_correlativo: number
  Num_Paleta: string
}


interface data_det_2 {

  Lote: string,
  Hilo: string,
  Num_Conos: string,
}


@Component({
  selector: 'app-lectura-bultos-almacen',
  templateUrl: './lectura-bultos-almacen.component.html',
  styleUrls: ['./lectura-bultos-almacen.component.scss']
})
export class LecturaBultosAlmacenComponent implements OnInit {

  codBarUbicacion: string = '';
  codBarBulto: string = '';
  codigoUbicacion: string = '';
  sCodUbicacion: string = '';

  sNumCorrelativo: string = '';
  Num_Corre: string = '';
  sCodBulto: string = '';
  Id_Num: number = 0;
  Cod_Accion: string = '';

  Cod_Ubicacion: string = '';

  Ubicacion_Almacen: Ubicacion_Almacen = new Ubicacion_Almacen();

  Id_correlativo: number = 0;
  sCodUbicacionOriginal: string = '';
  sPalet: string = '';

  codLote: string = '';
  numPal: string = '';

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    sCodUbicacion: [''],
    sCodBulto: [''],
    //nPalet: ['1'],
    sCodLote: [''],
    sPalet: ['0', [Validators.required]]
  })



  displayedColumns_cab: string[] = ['Cod_ubicacion']

  displayedColumns_cab2: string[] =
    ['select',
      'Id_Correlativo',
      'Num_Correlativo',
      'Palet',
      'Lote',
      'Hilo',
      'Num_Conos',
      'Peso_Bruto',
      'Peso_Neto',
      'Serie_Guia',
      'Num_Guia',
      'Nombre_Hilo',
      'Serie_Orden',
      'Num_Orden',
      'Acciones'

    ]

  dataSource: MatTableDataSource<data_det>;
  dataSource2: MatTableDataSource<data_det_2>;

  selection = new SelectionModel<data_det_2>(true, []);

  constructor(private formBuilder: FormBuilder, private lecturaservices: LecturaBultosAlmacenService, private SpinnerService: NgxSpinnerService,
    private matSnackBar: MatSnackBar, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
  }

  onToggleCodBarUbicacion() {
    if (this.codBarUbicacion.length >= 4) {
      this.MostrarCodigoUbicacion();
      this.MostrarCodigoUbicacion_detalle();
      console.log(this.Id_Num)
    }
  }


  openDialogTranfer() {
    let dialogRef = this.dialog.open(DialogTranferBultosComponent, {

      disableClose: true,
      data: { dataSourceD: this.selection.selected, sCodUbicacionOriginal: this.codBarUbicacion }

    });

    dialogRef.afterClosed().subscribe(result => {
      this.MostrarCodigoUbicacion_detalle()
      this.selection.clear()
    })
    console.log(this.selection.selected)
    console.log(this.codBarUbicacion)

    //this.MostrarCodigoUbicacion_detalle()
  }



  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
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



  MostrarCodigoUbicacion() {
    this.lecturaservices.showUbicacionCod(this.Cod_Accion = 'F', this.codBarUbicacion).subscribe(
      (result: any) => {
        if (result[0].Respuesta == undefined) {
          this.dataSource.data = result
          this.Id_Num = result[0].Id_num
          this.Cod_Ubicacion = result[0].Cod_ubicacion
          this.SpinnerService.hide();
          document.getElementById("sPalet")?.focus();

        }
        else {
          //this.matSnackBar.open("No existe ubicación", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          this.dataSource.data = []
          this.SpinnerService.hide();
          this.codBarUbicacion = '';
          document.getElementById("sPalet")?.focus();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }



  MostrarCodigoUbicacion_detalle() {
    this.lecturaservices.showUbicacionCod(this.Cod_Accion = 'L', this.codBarUbicacion).subscribe(
      (result: any) => {
        if (result[0].Respuesta == undefined) {
          this.dataSource2.data = result
          this.SpinnerService.hide();
          this.newEscaner_Bulto();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          this.dataSource2.data = []
          this.SpinnerService.hide();

        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }



  onToggleCodBarBulto() {
    if (this.codBarBulto.length >= 12) {
      //this.openDialogBulto();
      if (this.numPal=="") {
        this.matSnackBar.open('Debe ingresar Nro de paleta !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
        this.codBarBulto = '';
        document.getElementById("Num_Paleta")?.focus();
          }
          else
          {
      this.Cod_Accion = 'I'
      this.lecturaservices.ManBultoAlmacen(
        this.Cod_Accion,
        this.Id_Num,
        this.codBarBulto,
        this.Id_Num,
        //this.formulario.get('nPalet').value
        this.formulario.get('sPalet').value
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {


            console.log(this.Id_Num)
            console.log(this.Cod_Ubicacion)
            this.matSnackBar.open('Codigo registrado correctamente. !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
            this.MostrarCodigoUbicacion_detalle()
            this.newEscaner_Bulto();
          }
          else 
          {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
            
            //this.newEscaner_Bulto();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
        )
      }
    }
  }


  //   openDialogBulto() {
  //     let dialogRef = this.dialog.open(DialogLecturaBultosComponent, {
  //       disableClose: true,
  //       data: {Num_Corre:this.codBarBulto, Id_Num:this.Id_Num   , Cod_Ubicacion:this.Cod_Ubicacion}

  //     });

  //   dialogRef.afterClosed().subscribe(result => {
  //   this.MostrarCodigoUbicacion_detalle()
  //   })
  //   console.log(this.codBarBulto)
  //   console.log(this.Id_Num)
  //   console.log(this.Cod_Ubicacion)
  //   this.MostrarCodigoUbicacion_detalle()
  // }



  openDialogConsultaLote() {
    var codLote = this.formulario.get('sCodLote').value;
    console.log(codLote);

    this.formulario
    let dialogRef = this.dialog.open(DialogLecturaBultosComponent, {
      disableClose: true,
      data: { CodLote: codLote }

    });

    dialogRef.afterClosed().subscribe(result => {
      this.codLote=""
      document.getElementById("sCodLote")?.focus();
      //this.MostrarCodigoUbicacion_detalle()
    })


  }





  MostrarBultoDatos() {
    this.lecturaservices.showUbicacionCod(this.Cod_Accion = 'L', this.codBarBulto).subscribe(
      (result: any) => {
        if (result[0].Respuesta == undefined) {
          this.sNumCorrelativo = result[0].Num_Correlativo
          this.SpinnerService.hide();
          document.getElementById("Num_Corre")?.focus();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }






  newEscaner_Bulto() {
    this.codBarBulto = '';
    this.numPal = '';
    document.getElementById("Num_Paleta")?.focus();
  }





  EliminarBulto(Id_correlativo: number) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Cod_Accion = 'D'
        //this.Id_Num = 0
        this.Num_Corre = ''
        this.Id_correlativo = Id_correlativo

        this.lecturaservices.ManBultoAlmacen(
          this.Cod_Accion,
          0,
          this.Num_Corre,
          this.Id_correlativo,
          ''
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {

              console.log(this.Id_correlativo)
              this.matSnackBar.open('Proceso Correcto. !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
              this.MostrarCodigoUbicacion_detalle()
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
        )
      }
    })

  }


  isAllSelectedBultos() {
    return this.selection.selected.length == this.dataSource2.data.length;
  }




  toggleAllBultos() {

    if (this.isAllSelectedBultos()) {
      this.selection.clear();
      return;
    } else {
      this.selection.select(...this.dataSource2.data);
    }
  }


  onProcesoSelectedBultos(data_det_2: data_det_2) {
    this.selection.toggle(data_det_2);
  }



  SaveTransferencia() {
    console.log(this.selection.selected)

  }




}

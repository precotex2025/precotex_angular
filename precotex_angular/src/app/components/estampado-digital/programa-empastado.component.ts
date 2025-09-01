import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { TintoreriaService } from 'src/app/services/tintoreria.service';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { Capacidades } from 'src/app/models/Tintoreria/Capacidades';
import { FamArticulo } from 'src/app/models/Tintoreria/FamArticulo';
import { Cliente } from 'src/app/models/Cliente';
import { TipAncho } from 'src/app/models/Tintoreria/TipAncho';
import { ExceljsService } from 'src/app/services/exceljs.service';
// import { ProgramaEmpastado } from 'src/app/models/Estampado/ProgramaEmpastado';
import { EstampadoDigitalService } from 'src/app/services/estampado-digital.service';
import { TipPasta, VersionPrograma } from 'src/app/models/Estampado/ProgramaEmpastado';
import { DialogConfirmacion2Component } from '../dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogConfirmacionComponent } from '../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { DialogProgramaEmpastadoComponent } from './dialog-programa-empastado/dialog-programa-empastado.component';

export interface ProgramaEmpastado {
  Id_Programa: string;
  Cod_Cliente: string;
  Nom_Cliente: string;
  Cod_Ordtra: string;
  Num_Secuencia: string;
  Cod_Diseno: string;
  Cod_Comb: string;
  Cod_Combinacion: string;
  Cod_Tela: string;
  Des_Tela_Abr: string;
  Cod_Color: string;
  Des_Color: string;
  Kgs_Progr: string;
  Engome: string;
  Cod_Ordtra_Transf: string;
  Cod_Und_Negoc: string;
  Des_Und_Negoc: string;
  Observaciones: string;
  Nom_Archivo: string;
  Tipo_OC:string;
  Cod_Tip_Pasta: string;
  Nom_Tip_Pasta: string;
}

// const ELEMENT_DATA: ProgramaEmpastado[] = [];

@Component({
  selector: 'app-programa-empastado',
  templateUrl: './programa-empastado.component.html',
  styleUrls: ['./programa-empastado.component.scss'],
})

export class ProgramaEmpastadoComponent implements OnInit {

  icon: string = 'edit';
  botonDeshabilitado: boolean = false;

  filtroVersion: Observable<VersionPrograma[]> | undefined;
  filtroTipPasta:  Observable<TipPasta[]> | undefined;
  listar_ProgramaEmpastado: ProgramaEmpastado[] = []
  listar_Version: VersionPrograma[] = [];
  listar_TipPasta: TipPasta[] = [];

  Tip_Pasta: string;
  dataForExcel = [];

  public empastado = [{
    Opcion: "",
    Tipo: "",
    Cod_Ordtra: "",
    Num_Secuencia: "",
    Id_Programa: "",
    Obs: "",
  }]

  Opcion = ''
  Tipo = ''
  Cod_Ordtra = ''
  Num_Secuencia = ''
  Id_Programa = ''
  Obs = ''
  Version_B = ''
  Version = ''


  /****************************/
  Tot_Kgs: string = '';


  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Programa: [''],
    Cod_Ordtra: [''],
    Tip_Pasta: ['']
  })

  // displayedColumns: string[] = ['Fec_Creacion', 'Cod_Familia', 'Nom_Cliente', 'Des_Tip_Ancho', 'Des_Gama', 'Eco_Master', 'IMaster', 'TRD', 'ATYC', 'MS','Obs_Eco_Master', 'Obs_IMaster', 'Obs_TRD', 'Obs_ATYC','Obs_MS','Acciones']
  displayedColumns: string[] = ['Nom_Cliente', 'Cod_Ordtra', 'Des_Tela_Abr', 'Des_Color', 'Cod_Diseno', 'Cod_Comb', 'Kgs_Progr', 'Engome', 'Observaciones', 'Nom_Archivo','Tipo_OC','Nom_Tip_Pasta', 'Acciones']

  dataSource: MatTableDataSource<ProgramaEmpastado>;
  tituloDialogo: string;


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private exceljsService: ExceljsService,
    private EstampadoDigitalService: EstampadoDigitalService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource() }


  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('table', { static: true }) table: MatTable<ProgramaEmpastado>;

  ngOnInit(): void {
    this.MostrarProgramaEmpastado()
    this.MuestraVersion()
    this.MuestraTipPasta()

  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.paginator._intl.itemsPerPageLabel = 'items por pagina';
  //   this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
  //     if (length === 0 || pageSize === 0) {
  //       return `0 de ${length}`;
  //     }
  //     length = Math.max(length, 0);
  //     const startIndex = page * pageSize;
  //     const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  //     return `${startIndex + 1}  - ${endIndex} de ${length}`;
  //   };
  // }


  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


  MuestraVersion() {
    this.listar_Version = [];
    this.EstampadoDigitalService.MuestraVersionPrograma(
    ).subscribe(data => {
      this.listar_Version = data
      this.RecargarVersion()
    }
    )
  }

  RecargarVersion() {
    this.filtroVersion = this.formulario.controls['Programa'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterVersion(option) : this.listar_Version.slice())),
    );
  }

  private _filterVersion(value: string): VersionPrograma[] {
    const filterValue = value.toLowerCase();
    return this.listar_Version.filter(option => String(option.Version).toLowerCase().indexOf(filterValue) > -1 ||
      option.Version.toLowerCase().indexOf(filterValue) > -1);
  }

  CambiarVersion(Version: string) {
    this.Version_B = Version
  }

  MuestraTipPasta(){
    this.listar_TipPasta = [];
    this.EstampadoDigitalService.MuestraTipPasta(
      ).subscribe(data =>
      {
        this.listar_TipPasta = data
        this.RecargarTipPasta()
      }
      )
  }

  RecargarTipPasta(){
    this.filtroTipPasta = this.formulario.controls['Tip_Pasta'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterTipPasta(option) : this.listar_TipPasta.slice())),
    );
  }

  private _filterTipPasta(value: string): TipPasta[] {
    const filterValue = value.toLowerCase();
    return this.listar_TipPasta.filter(option => String(option.Nom_Tip_Pasta).toLowerCase().indexOf(filterValue ) > -1 ||
    option.Nom_Tip_Pasta.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarValorTipPasta(Tip_Pasta: string){
    this.Tip_Pasta = Tip_Pasta
  }


  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataSource.data.findIndex(d => d === event.item.data);

    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    // console.log("PartidapreviousIndex",this.dataSource.data[previousIndex].Cod_Ordtra);
    // console.log("IdProgramapreviousIndex",this.dataSource.data[previousIndex].Id_Programa);

    // console.log("PartidacurrentIndex",this.dataSource.data[event.currentIndex].Cod_Ordtra);
    // console.log("IdProgramapreviousIndex",this.dataSource.data[event.currentIndex].Id_Programa);
    this.SaveSecuenciaPrograma(previousIndex.toString(), event.currentIndex.toString())
    this.table.renderRows();
  }


  SaveSecuenciaPrograma(Sec_Origen: string, Sec_Destino: string) {
    try {
      if (Sec_Origen !== Sec_Destino) {

         this.EstampadoDigitalService.saveSecuenciaPrograma(this.Version_B, Sec_Origen, Sec_Destino).subscribe((result2: any) => {
          if (result2) {
            if (result2.Mensaje == 'Ok') {
              this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
              this.MostrarProgramaEmpastado()
            }
          } else {
            this.matSnackBar.open('Error, No Se Pudo Secuenciar.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
          }
        })
      }
    } catch (e) {
      (e: HttpErrorResponse) => this.matSnackBar.open(e.message, 'Cerrar', {
        duration: 1500,
      })
    }
  }


  MostrarProgramaEmpastado() {

    const programa = this.formulario.get('Programa')?.value;

    if (programa.length == 0 || programa.length < 8) {
      this.Opcion = 'C';
      this.Version_B = '';
      this.botonDeshabilitado = false;
    }

    if (programa.length > 7) {
      this.Opcion = 'B';
      this.Version_B = this.formulario.get('Programa')?.value;
      this.botonDeshabilitado = true;
    }

    this.Tipo = ''
    this.Cod_Ordtra = ''
    this.Num_Secuencia = ''
    this.Id_Programa = ''
    this.Obs = ''

    this.EstampadoDigitalService.ManProgramaEmpastado(
      this.Opcion,
      this.Tipo,
      this.Cod_Ordtra,
      this.Num_Secuencia,
      this.Id_Programa,
      '',
      this.Obs,
      this.Version_B,
      this.formulario.get('Tip_Pasta')?.value == null ? '' : this.formulario.get('Tip_Pasta')?.value
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


  EliminarProgramaEmpastado(Cod_Ordtra: string,Id_Programa: string) {
    console.log("Id_Programa",Id_Programa);
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        //this.SpinnerService.show();
        this.Opcion = 'E'
        this.Tipo = ''
        this.Cod_Ordtra = Cod_Ordtra
        this.Num_Secuencia = ''
        this.Id_Programa = Id_Programa
        this.Obs = ''
        this.EstampadoDigitalService.ManProgramaEmpastado(
          this.Opcion,
          this.Tipo,
          this.Cod_Ordtra,
          this.Num_Secuencia,
          this.Id_Programa,
          '',
          this.Obs,
          this.Version_B,
          ''
          ).subscribe(
            (result: any) => {
              this.MostrarProgramaEmpastado()
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            }))
      }
    })
  }

  ConfirmarProgramaEmpastado() {
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open(
        'No existen partidas en el programa',
        'Cerrar',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        }
      );
      return;
    }

    let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {

        this.Opcion = 'G';
        this.Version_B = '';

        this.EstampadoDigitalService.ManProgramaEmpastado(
          this.Opcion,
          this.Tipo,
          this.Cod_Ordtra,
          this.Num_Secuencia,
          this.Id_Programa,
          '',
          this.Obs,
          this.Version_B,
          ''
        ).subscribe(
          (result: any) => {
            if (result.length > 0) {
              this.dataSource.data = result;
              this.SpinnerService.hide();
            } else {
              this.matSnackBar.open('No existen registros..!!', 'Cerrar', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 1500,
              });
              this.dataSource.data = [];
              this.SpinnerService.hide();
            }
            this.MuestraVersion()
          },
          (err: HttpErrorResponse) =>
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
        );
      }
    });
  }

  AgregaItem(Item: string) {

    const partida = this.formulario.get('Cod_Ordtra')?.value;

    if ((partida.length > 0 && partida.length < 6 && Item == 'I') || Item =='L') {

      let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'true') {
          this.Opcion = Item
          this.Tipo = ''
          this.Cod_Ordtra = partida
          this.Num_Secuencia = ''
          this.Id_Programa = ''
          this.Obs = ''
          this.EstampadoDigitalService.ManProgramaEmpastado(
            this.Opcion,
            this.Tipo,
            this.Cod_Ordtra,
            this.Num_Secuencia,
            '',
            this.Id_Programa,
            this.Obs,
            this.Version_B,
            ''
            ).subscribe(
              (result: any) => {
                this.MostrarProgramaEmpastado();
                this.formulario.get('Cod_Ordtra')?.setValue("");
              },
              (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 1500,
              }))
        }
      })
    }
  }

  ModificarObs(data) {
   let dialogRef = this.dialog.open(DialogProgramaEmpastadoComponent, {
      disableClose: true,
      maxWidth: '25vw',
      maxHeight: '70vh',
      position: {
        top: '0px'
      },
      data: {
        datos:data, version:this.formulario.get('Programa')?.value == null ? '' : this.formulario.get('Programa')?.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'false') {
        this.MostrarProgramaEmpastado();
      }
    })
  }

  generateExcel() {

    /*AQUI APLICAMOS LOS FILTROS*/
    const oData: ProgramaEmpastado[] = this.dataSource.data;

    // Seleccionamos solo las columnas que necesitamos
    const columnasSeleccionadas = oData.map(item => ({
      Cliente: item.Nom_Cliente,
      Partida: item.Cod_Ordtra,
      Articulo: item.Des_Tela_Abr,
      Color: item.Des_Color,
      Diseño: item.Cod_Diseno,
      Combo: item.Cod_Comb,
      KG_Prog: (item.Kgs_Progr != "" || item.Kgs_Progr == null) ? parseFloat(item.Kgs_Progr).toFixed(2) : "",
      Engome: item.Engome,
      Observacion: item.Observaciones,
      Imagen: item.Nom_Archivo,
      Tipo_OC: item.Tipo_OC,
      Tipo_Pasta: item.Nom_Tip_Pasta
    }));

    this.dataForExcel = [];
    columnasSeleccionadas.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: 'PROGRAMA DE EMPASTADO',
      data: this.dataForExcel,
      headers: Object.keys(columnasSeleccionadas[0])
      //headers: Object.keys(this.dataSource.data[0])
    }

    //this.exceljsService.exportExcel(reportData);
    this.exceljsService.exportExcel2(reportData);
    this.dataForExcel = []
  }

}


import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogCabeceraHoraComponent } from '../mantenimiento-hora/dialog-cabecera-hora/dialog-cabecera-hora.component';
import { MantenimientoHoraService } from 'src/app/services/mantenimiento-hora.service';

interface data_det {
  Num_Auditoria: number,
  Cod_Supervisor: string,
  Nom_Supervisor: string,
  Cod_Auditor: String,
  Nom_Auditor: string,
  Fecha_Auditoria: string,
  Cod_LinPro: string,
  Observacion: string,
  Flg_Status: string,
  Cod_Usuario: string,
  Cod_Equipo: string,
  Fecha_Reg: string,

}

interface planta {
  num_planta: string,
  des_planta: string
}
 

@Component({
  selector: 'app-mantenimiento-hora.component',
  templateUrl: './mantenimiento-hora.component.html',
  styleUrls: ['./mantenimiento-hora.component.scss']
})
export class MantenimientoHoraComponent implements OnInit {

  listar_planta: planta[] = [];

  public data_det = [{
    Num_Auditoria: 0,
    Cod_Supervisor: "",
    Nom_Supervisor: "",
    Cod_Auditor: "",
    Nom_Auditor: "",
    Fecha_Auditoria: "",
    Cod_LinPro: "",
    Observacion: "",
    Flg_Status: "",
    Cod_Usuario: "",
    Cod_Equipo: "",
    Fecha_Reg: ""
  }]

  Num_Liquidacion = "";
  idplanta = "";


  Cod_Accion = ""
  Num_Auditoria = 0
  Cod_Supervisor = ""
  Nom_Supervisor = ""
  Cod_Auditor = ""
  Nom_Auditor = ""
  Fecha_Auditoria = ""
  Fecha_Auditoria2 = ""
  Cod_LinPro = ""
  Observacion = ""
  Flg_Status = ""
  Cod_Usuario = ""
  Cod_Equipo = ""
  Fecha_Reg = ""
  Cod_OrdPro = ""
  Cod_EstCli = ""
  Can_Lote = 0
  Cod_Motivo = ''


  Opcion = "";
  Id_Liquidacion = "";
  Resp_Liquidacion = "";
  Planta = "";
  Liquidacion = "";
  Fecha = "";
  Usuario = "";
  Area = "";
  Linea = "";
  IdCliente = "";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Fecha_Movimiento: [''],
    Cliente: [''],
    Area: [''],
    Linea: [''],
    Planta: ['']
  })


  displayedColumns_cab: string[] = [
    'IdCambio',
    'IdArea',
    'Cod_Usuario',
    'Nueva_Hora',
    'Motivo',
    'Fecha_Registro']

  dataSource: MatTableDataSource<data_det>;


  listar_Areas = [];
  horaControl = '';
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private mantenimientoHoraService: MantenimientoHoraService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.BuscarArea();
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
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }


  agregarDialog() {
    let dialogRef = this.dialog.open(DialogCabeceraHoraComponent, {
      disableClose: false,
      minWidth: '800px',
      maxWidth: '80wh',
      data: { IdArea: this.formulario.get('Area')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
    
      if (result == 'false') {
        this.MostrarControlBitacora();
      }

    })
  }


  MostrarControlBitacora() {
    const formData = new FormData();
    formData.append('IdArea', this.formulario.get('Area')?.value);

    this.mantenimientoHoraService.MantMostrarControlBitacoraService(
      formData
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

  BuscarArea() {
    this.mantenimientoHoraService.BuscarAreaService().subscribe(
      (result: any) => {

        this.listar_Areas = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
  
  obtieneHoraControl(valor){
   
    const formData = new FormData();
    formData.append('IdArea', valor);

    this.mantenimientoHoraService.BuscarHoraControl(formData).subscribe(
      (result: any) => {
 
        this.horaControl = result[0].hora;      
        valor="";
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

}


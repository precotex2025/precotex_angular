import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActasAcuerdosService } from 'src/app/services/actas-acuerdos.service';
import { AgregarParticipanteActaComponent } from '../crear-nuevo-acta/agregar-participante-acta/agregar-participante-acta.component';

export interface PeriodicElement {
  IdParticipante: string;
  Nombres: string;
  Nombre: string;
  Apellidos: string;
  Telefono: string;
  Correo: string;
  Firma: string;
  Cargo: string;
}


const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-crear-participantes-acta',
  templateUrl: './crear-participantes-acta.component.html',
  styleUrls: ['./crear-participantes-acta.component.scss']
})
export class CrearParticipantesActaComponent implements OnInit {
  fecha: string = '';
  resultado: boolean = false;


  data: any = [];

  sede: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  displayedColumns: string[] = [
    'Nombres',
    'Telefono',
    'Correo',
    'Cargo',
    'Firma',
    'acciones'
  ];

  deshabilitar: boolean = false;

  oc: string = '';
  OP: string = '';
  Fecha_inicio = '';
  Fecha_Fin = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataForExcel = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild('DniSearch') inputDni!: ElementRef;
  fecha_mes = '';
  sCod_Usuario = GlobalVariable.vusu

  Cod_Empresa: string = '';
  dataEmpresas: any = [];

  local = false;
  Sede: any = '';
  Area: any = '';


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private exceljsService: ExceljsService,
    private actasAcuerdosService: ActasAcuerdosService,
    private _router: Router,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.cargarLista();

    var cadena = document.location.href;

    var nueva = cadena.substring(0, 9);
    
    if (nueva == 'http://lo' || nueva == 'http://19') {
      this.local = true;
    } else {
      this.local = false;
    }
  }
  ngAfterViewInit(): void {

  }

  cargarLista() {
    this.actasAcuerdosService.InsertarParticipanteService('M', '', '', '', '', '', '', '').subscribe((res: any) => {
      if (res != null) {
        this.dataSource.data = res;
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    })
  }

  crearNuevoParticipante() {
    let datos = {
      tipo: 1,
      boton: 'Guardar',
      cabecera: 'Crear Nuevo Participante'
    }
    let dialogRef = this.dialog.open(AgregarParticipanteActaComponent, {
      disableClose: true,
      panelClass: 'my-class',
      data: {
        data: datos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista();
    })

  }

  agregarNuevo() {
    let datos = {
      tipo: 1,
      Cabecera: 'Agregar Nuevo',
      boton: 'Guardar'
    }
    this._router.navigate(['CrearActasAcuerdo'], { skipLocationChange: true, queryParams: datos });
  }

  editarOpcion(data) {
    let datos = {
      tipo: 2,
      boton: 'Actualizar',
      cabecera: 'Actualizar Participante',
      data
    }
    let dialogRef = this.dialog.open(AgregarParticipanteActaComponent, {
      disableClose: true,
      panelClass: 'my-class',
      data: {
        data: datos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista();
    })
  }

  onChangeFirma(event, IdParticipante) {
    var file = event.target.files[0];
    const formData = new FormData();
    formData.append('IdParticipante', IdParticipante)
    formData.append('archivo', file)
    this.SpinnerService.show();
    this.actasAcuerdosService.actualizarFirma(formData).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response[0].Respuesta == 'OK') {
          this.matSnackBar.open('Firma actualizada correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
          this.SpinnerService.hide();
          this.cargarLista();
        } else {
          this.matSnackBar.open('Ha ocurrido un error al actualizar la firma.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
          this.SpinnerService.hide();
        }
      },
      error: (error) => {
        console.log(error);
        this.SpinnerService.hide();
        this.matSnackBar.open(error.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


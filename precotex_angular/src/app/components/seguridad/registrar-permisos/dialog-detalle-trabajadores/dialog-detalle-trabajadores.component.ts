import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';

export interface PeriodicElement {
  Fec_Permiso: string;
  Nom_Trabajador: string;
  Inicio: string;
  Termino: string;
  Inicio_Lectura: string;
  Termino_Lectura: string;
  Num_Permiso: string;
  Des_Tipo_Permiso: string;
  Cod_Tipo_Permiso:string;
  Tip_Trabajador:string;
  Cod_Trabajador:string;
  Sede: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];

interface data{
  Permiso: string,
  Fecha:string
}


@Component({
  selector: 'app-dialog-detalle-trabajadores',
  templateUrl: './dialog-detalle-trabajadores.component.html',
  styleUrls: ['./dialog-detalle-trabajadores.component.scss']
})
export class DialogDetalleTrabajadoresComponent implements OnInit {
  displayedColumns: string[] = [
    'Fec_Permiso',
    'Nom_Trabajador',
    'Inicio',
    'Termino',
    'Inicio_Lectura',
    'Termino_Lectura',
    'Des_Tipo_Permiso',
    'Sede',
    'Status'
  ];
  data: any = [];
  deshabilitar: boolean = false;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  fecha_mes:string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,private SeguridadActivoFijoReporteService:RegistroPermisosService, private SpinnerService: NgxSpinnerService,
    private dialogRef: MatDialogRef<DialogDetalleTrabajadoresComponent>,
   @Inject(MAT_DIALOG_DATA) public datos: data) { }

  ngOnInit(): void {

    this.fecha_mes = this.datos.Fecha;
    this.CargarLista();
  }

  closeModal(){
    this.dialogRef.close();
  }

  CargarLista() {

    this.data = [];

    const ELEMENT_DATA: PeriodicElement[] = this.data;
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    this.SeguridadActivoFijoReporteService.muestraPermisoDetalle(this.datos.Permiso).subscribe((result: any) => {
      console.log(result);
      if (result != false) {
        this.data = result;
        console.log(this.data);
        const ELEMENT_DATA: PeriodicElement[] = this.data;

        this.displayedColumns = [ 'Fec_Permiso', 'Nom_Trabajador', 'Inicio', 'Termino', 'Inicio_Lectura',
          'Termino_Lectura', 'Des_Tipo_Permiso', 'Sede', 'Status'];
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        if (this.data[0].Termino_Lectura != '') {
          //this.deshabilitar = true;
        }

      } else {
   
      }
    },
      (err: HttpErrorResponse) => {

        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })

  }

}

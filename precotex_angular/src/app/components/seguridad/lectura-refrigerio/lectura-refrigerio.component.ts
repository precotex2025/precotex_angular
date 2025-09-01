import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export interface PeriodicElement {
  Fec_Permiso: string;
  Nom_Trabajador: string;
  Inicio: string;
  Termino: string;
  Inicio_Lectura: string;
  Termino_Lectura: string;
  Num_Permiso: string;
  Cod_Tipo_Permiso:string;
  Tip_Trabajador:string;
  Cod_Trabajador:string;
  Sede: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-lectura-refrigerio',
  templateUrl: './lectura-refrigerio.component.html',
  styleUrls: ['./lectura-refrigerio.component.scss']
})
export class LecturaRefrigerioComponent implements OnInit {
  fecha: string = '';
  resultado: boolean = false;
  formulario = this.formBuilder.group({
    fec_permiso: [new Date()],
    dni: ['']
  })

  data: any = [];

  sede: string = '';


  displayedColumns: string[] = [
    'select',
    'Fec_Permiso',
    'Nom_Trabajador',
    'Inicio',
    'Termino',
    'Inicio_Lectura',
    'Termino_Lectura',
    'Sede'
  ];
  deshabilitar: boolean = false;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild('DniSearch') inputDni!: ElementRef;
  fecha_mes = '';
  sCod_Usuario = GlobalVariable.vusu

  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private despachoTelaCrudaService: RegistroPermisosService,
    private _router: Router,
    private dialog: MatDialog) {
    console.log(GlobalVariable.num_planta)
    if (GlobalVariable.num_planta == 0) {
      this._router.navigate(['/LecturaPermisos']);
    }

  }

  ngOnInit(): void {
    if (GlobalVariable.num_planta == 1){
      this.sede = 'Santa Maria';
    } else if (GlobalVariable.num_planta == 2){
      this.sede = 'Santa Cecilia';
    } else if (GlobalVariable.num_planta == 3){
      this.sede = 'Huachipa Sede I';
    } else if (GlobalVariable.num_planta == 4){
      this.sede = 'Huachipa Sede II';
    } else if (GlobalVariable.num_planta == 5){
      this.sede = 'Independencia';
    } else if (GlobalVariable.num_planta == 14){
      this.sede = 'Independencia II';
    } else if (GlobalVariable.num_planta == 13){
      this.sede = 'Santa Rosa';
    } else if (GlobalVariable.num_planta == 15){
      this.sede = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.sede = 'Huachipa Sede III'
    } else if (GlobalVariable.num_planta == 11){
      this.sede = 'VyD';
    }


    var actual = new Date();
    var fecha = _moment(actual.valueOf()).format('DD/MM/YYYY HH:mm:ss');
    var fecha_mes = _moment(actual.valueOf()).format('DD/MM/YYYY');

    console.log(fecha);
    this.fecha = fecha;
    this.fecha_mes = fecha_mes;
    this.CargarLista();
  }
  ngAfterViewInit(): void {
    //this.inputDni.nativeElement.focus()
  }

  onProcesoSelectedBultos(data_det_2: PeriodicElement) {
    console.log(data_det_2);
    var actual = new Date();
    var hora = _moment(actual.valueOf()).format('HH:mm');
    var weight = hora.split(':')
    
    var Num_Permiso = data_det_2.Num_Permiso;
    var Fec_Permiso = this.fecha_mes;
    var Cod_Tipo_Permiso = data_det_2.Cod_Tipo_Permiso;
    var Tip_Trabajador = data_det_2.Tip_Trabajador;
    var Cod_Trabajador = data_det_2.Cod_Trabajador;
    var Lectura_Hora = weight[0];
    var Lectura_Minuto = weight[1];
    var Cod_Usuario = this.sCod_Usuario;
    var Tipo = 'I';
    var sede = '';
    if (GlobalVariable.num_planta == 1){
      sede = 'Santa Maria';
    } else if (GlobalVariable.num_planta == 2){
      sede = 'Santa Cecilia';
    } else if (GlobalVariable.num_planta == 3){
      sede = 'Huachipa Sede I';
    } else if (GlobalVariable.num_planta == 4){
      sede = 'Huachipa Sede II';
    } else if (GlobalVariable.num_planta == 5){
      sede = 'Independencia';
    } else if (GlobalVariable.num_planta == 14){
      sede = 'Independencia II';
    } else if (GlobalVariable.num_planta == 13){
      sede = 'Santa Rosa';
    } else if (GlobalVariable.num_planta == 15){
      sede = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      sede = 'Huachipa Sede III'
    } else if (GlobalVariable.num_planta == 11){
      sede = 'VyD';
    }
    this.SpinnerService.show();  
    
    this.despachoTelaCrudaService.insertaPermisoTrabajadorLec(Num_Permiso, Fec_Permiso, Cod_Tipo_Permiso, Tip_Trabajador, Cod_Trabajador, Lectura_Hora, Lectura_Minuto, Cod_Usuario, Tipo, sede
    ).subscribe(
      (res: any) => {
        this.matSnackBar.open('SE REGISTRO CORRECTAMENTE LA LECTURA DEL PERMISO!!', 'Cerrar', {
          duration: 1500,
        });
        console.log(res);

        //this.resultado = false;
        this.SpinnerService.hide();
        this.CargarLista();
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

  limpiarValor() {
    this.formulario.patchValue({
      dni: ''
    });
    this.changeDni(this.formulario.get('dni').value);
  }

  CargarLista() {
    this.resultado = false;
    this.data = [];
    var sede = '';
    if (GlobalVariable.num_planta == 1) {
      sede = 'Santa Maria';
    } else if (GlobalVariable.num_planta == 2) {
      sede = 'Santa Cecilia';
    } else if (GlobalVariable.num_planta == 3) {
      sede = 'Huachipa Sede I';
    } else if (GlobalVariable.num_planta == 4) {
      sede = 'Huachipa Sede II';
    } else if (GlobalVariable.num_planta == 5) {
      sede = 'Independencia';
    } else if (GlobalVariable.num_planta == 14) {
      sede = 'Independencia II';
    } else if (GlobalVariable.num_planta == 13) {
      sede = 'Santa Rosa';
    } else if (GlobalVariable.num_planta == 15) {
      sede = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      sede = 'Huachipa Sede III'
    } else if (GlobalVariable.num_planta == 11) {
      sede = 'VyD';
    }
    const ELEMENT_DATA: PeriodicElement[] = this.data;
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    console.log(this.formulario.value);
    var Dni = this.formulario.get('dni').value;
    var Fecha = this.formulario.get('fec_permiso').value;
    this.despachoTelaCrudaService.muestraPermisoRefrigerioLec(Fecha, sede).subscribe((result: any) => {
      console.log(result);
      if (result != false) {
        this.data = result;
        console.log(this.data);
        const ELEMENT_DATA: PeriodicElement[] = this.data;

        this.displayedColumns = ['select', 'Fec_Permiso', 'Nom_Trabajador', 'Inicio', 'Termino', 'Inicio_Lectura',
          'Termino_Lectura', 'Sede'];
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        if (this.data[0].Termino_Lectura != '') {
          //this.deshabilitar = true;
        }

        this.resultado = true;


      } else {
        this.resultado = false;
        // this.matSnackBar.open('EL PERMISO NO EXISTE O YA FUE REGISTRADO!!', 'Cerrar', {
        //   duration: 1500,
        // })
      }
    },
      (err: HttpErrorResponse) => {
        this.resultado = false;
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })

  }

  changeDni(event) {

    if (this.formulario.get('dni').value == '') {
      this.resultado = false;
      this.data = [];
      const ELEMENT_DATA: PeriodicElement[] = this.data;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.deshabilitar = false;
    }
  }

  keyupDni(event) {
    var dni = this.formulario.get('dni').value
    console.log(dni.length);
    if (dni.length == 0) {
      this.resultado = false;
      this.data = [];
      const ELEMENT_DATA: PeriodicElement[] = this.data;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    } else if (dni.length == 8) {
      this.CargarLista();
    }
  }
  actualizarPermiso() {
    this.CargarLista();
  }

  cargarCompletados() {
    this.resultado = false;
    this.data = [];
    var sede = '';
    if (GlobalVariable.num_planta == 1) {
      sede = 'Santa Maria';
    } else if (GlobalVariable.num_planta == 2) {
      sede = 'Santa Cecilia';
    } else if (GlobalVariable.num_planta == 3) {
      sede = 'Huachipa Sede I';
    } else if (GlobalVariable.num_planta == 4) {
      sede = 'Huachipa Sede II';
    } else if (GlobalVariable.num_planta == 5) {
      sede = 'Independencia';
    } else if (GlobalVariable.num_planta == 14) {
      sede = 'Independencia II';
    } else if (GlobalVariable.num_planta == 13) {
      sede = 'Santa Rosa';
    } else if (GlobalVariable.num_planta == 15) {
      sede = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      sede = 'Huachipa Sede III'
    } else if (GlobalVariable.num_planta == 11) {
      sede = 'VyD';
    }
    const ELEMENT_DATA: PeriodicElement[] = this.data;
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    console.log(this.formulario.value);
    var Dni = this.formulario.get('dni').value;
    var Fecha = this.formulario.get('fec_permiso').value;
    this.despachoTelaCrudaService.muestraPermisoRefrigerioLecturados(Fecha, sede).subscribe((result: any) => {
      console.log(result);
      if (result != false) {
        this.data = result;
        console.log(this.data);
        const ELEMENT_DATA: PeriodicElement[] = this.data;

        this.displayedColumns = ['select', 'Fec_Permiso', 'Nom_Trabajador', 'Inicio', 'Termino', 'Inicio_Lectura',
          'Termino_Lectura', 'Sede'];
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        if (this.data[0].Termino_Lectura != '') {
          //this.deshabilitar = true;
        }

        this.resultado = true;


      } else {
        this.resultado = false;
        this.matSnackBar.open('EL PERMISO NO EXISTE O YA FUE REGISTRADO!!', 'Cerrar', {
          duration: 1500,
        })
      }
    },
      (err: HttpErrorResponse) => {
        this.resultado = false;
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }
}

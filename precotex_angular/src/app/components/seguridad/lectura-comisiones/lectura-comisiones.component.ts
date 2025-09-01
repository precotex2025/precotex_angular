import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { GlobalVariable } from 'src/app/VarGlobals';

export interface PeriodicElement {
  Fec_Permiso: string;
  Nom_Trabajador: string;
  Inicio: string;
  Inicio_Lectura: string;
  Tipo_Lectura: string;
  Sede: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-lectura-comisiones',
  templateUrl: './lectura-comisiones.component.html',
  styleUrls: ['./lectura-comisiones.component.scss']
})
export class LecturaComisionesComponent implements OnInit {
  fecha: string = '';
  resultado: boolean = false;

  formulario = this.formBuilder.group({
    fec_permiso: [new Date()],
    dni: [''],
    Tipo: ['', Validators.required]
  })

  data: any = [];


  sede: string = '';

  displayedColumns: string[] = [
    'Fec_Permiso',
    'Nom_Trabajador',
    'Inicio',
    'Inicio_Lectura',
    'Tipo_Lectura',
    'Sede'
  ];

  deshabilitar: boolean = false;
  sendForm:boolean = false;

  Nom_Trabajador: string = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('DniSearch') inputDni!: ElementRef;
  fecha_mes = '';
  sCod_Usuario = GlobalVariable.vusu

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _router: Router,
    private despachoTelaCrudaService: RegistroPermisosService,
    private dialog: MatDialog) {
    if (GlobalVariable.num_planta == 0) {
      this._router.navigate(['/LecturaPermisos']);
    }


  }

  ngOnInit(): void {
    this.deshabilitar = true;
    var actual = new Date();
    var fecha = _moment(actual.valueOf()).format('DD/MM/YYYY HH:mm:ss');
    var fecha_mes = _moment(actual.valueOf()).format('DD/MM/YYYY');

    if (GlobalVariable.num_planta == 1) {
      this.sede = 'Santa Maria';
    } else if (GlobalVariable.num_planta == 2) {
      this.sede = 'Santa Cecilia';
    } else if (GlobalVariable.num_planta == 3) {
      this.sede = 'Huachipa Sede I';
    } else if (GlobalVariable.num_planta == 4) {
      this.sede = 'Huachipa Sede II';
    } else if (GlobalVariable.num_planta == 5) {
      this.sede = 'Independencia';
    } else if (GlobalVariable.num_planta == 13) {
      this.sede = 'Santa Rosa';
    } else if (GlobalVariable.num_planta == 15) {
      this.sede = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.sede = 'Huachipa Sede III'
    } else if (GlobalVariable.num_planta == 11) {
      this.sede = 'VyD';
    }

    console.log(fecha);
    this.fecha = fecha;
    this.fecha_mes = fecha_mes;

  }
  limpiarValor() {
    this.formulario.patchValue({
      dni: ''
    });

    this.changeDni(this.formulario.get('dni').value);
  }
  ngAfterViewInit(): void {
    this.inputDni.nativeElement.focus()
  }

  CargarLista() {
    if (this.formulario.get('dni').value != '') {
      this.resultado = false;
      this.data = [];
      const ELEMENT_DATA: PeriodicElement[] = this.data;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      console.log(this.formulario.value);
      var Dni = this.formulario.get('dni').value;
      var Fecha = this.formulario.get('fec_permiso').value;
      this.despachoTelaCrudaService.muestraComisionTrabajadorLec(Dni, Fecha).subscribe((result: any) => {
        console.log(result);
        if (result != false) {
          this.data = result;
          console.log(this.data[0].Nom_Trabajador);
          this.Nom_Trabajador= this.data[0].Nom_Trabajador;
          const ELEMENT_DATA: PeriodicElement[] = this.data;

          this.displayedColumns = ['Fec_Permiso', 'Nom_Trabajador', 'Inicio', 'Inicio_Lectura', 'Tipo_Lectura', 'Sede'];
          this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

          this.resultado = true;
          this.matSnackBar.open('SE ENCONTRÓ EL PERMISO!!', 'Cerrar', {
            duration: 1500,
          });

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
    } else {
      this.matSnackBar.open('DEBES INGRESAR UN DNI A LA BÚSQUEDA!!', 'Cerrar', {
        duration: 1500,
      })
    }

  }

  changeDni(event) {

    if (this.formulario.get('dni').value == '') {
      this.resultado = false;
      this.deshabilitar = false;
      this.data = [];
      const ELEMENT_DATA: PeriodicElement[] = this.data;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
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
    } else if (dni.length <= 9) {
      this.CargarLista();
    }
  }
  get f() { return this.formulario.controls; }
  validarTipo(){
    var Tipo = this.formulario.get('Tipo').value;
    if(Tipo != ''){
      this.deshabilitar = false;
    }
  }
  actualizarPermiso() {
    var actual = new Date();
    var hora = _moment(actual.valueOf()).format('HH:mm');
    var weight = hora.split(':')
    this.sendForm = true;
    console.log(hora);
    console.log(weight);
    console.log(this.formulario.controls.Tipo);
    if (this.resultado) {
      var Num_Permiso = this.data[0].Num_Permiso;
      var Fec_Permiso = this.fecha_mes;
      var Cod_Tipo_Permiso = this.data[0].Cod_Tipo_Permiso;
      var Tip_Trabajador = this.data[0].Tip_Trabajador;
      var Cod_Trabajador = this.data[0].Cod_Trabajador;
      var Lectura_Hora = weight[0];
      var Lectura_Minuto = weight[1];
      var Cod_Usuario = this.sCod_Usuario;
      var Tipo = this.formulario.get('Tipo').value;

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

      if(Tipo != ''){
        this.despachoTelaCrudaService.insertaPermisoTrabajadorLec(Num_Permiso, Fec_Permiso, Cod_Tipo_Permiso, Tip_Trabajador, Cod_Trabajador, Lectura_Hora, Lectura_Minuto, Cod_Usuario, Tipo, sede
          ).subscribe(
            (res: any) => {
              this.matSnackBar.open('SE REGISTRO CORRECTAMENTE LA LECTURA DEL PERMISO!!', 'Cerrar', {
                duration: 1500,
              });
              console.log(res);
              //this.resultado = false;
              this.deshabilitar = true;
              this.data = res;
              const ELEMENT_DATA: PeriodicElement[] = this.data;
              // this.formulario.patchValue({
              //   dni: ''
              // })
    
              this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
              //this.inputDni.nativeElement.focus();
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            }))
      }else{
        this.matSnackBar.open('DEBES SELECCIONAR UN TIPO!!', 'Cerrar', {
          duration: 5000,
        });
      }

      
    } else {
      this.matSnackBar.open('DEBES INGRESAR UN DNI A BUSCAR!!', 'Cerrar', {
        duration: 1500,
      });
    }
  }
}

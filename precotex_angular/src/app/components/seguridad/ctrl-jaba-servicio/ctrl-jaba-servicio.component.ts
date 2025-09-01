import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadControlGuiaService } from 'src/app/services/seguridad-control-guia.service';

@Component({
  selector: 'app-ctrl-jaba-servicio',
  templateUrl: './ctrl-jaba-servicio.component.html',
  styleUrls: ['./ctrl-jaba-servicio.component.scss']
})
export class CtrlJabaServicioComponent implements OnInit {

  nNum_Planta = GlobalVariable.num_planta;

  //* Declaramos las variables a usar */
  cod_accion = 'I'
  texto_libre = ''
  texto_libre2 = ''
  des_planta = ''
  origen_select = ''
  nom_entregado = ''
  cod_despachado_select = ''
  nom_despachado = ''
  glosa_select = ''

  Visible_Registro_Personal: boolean = false

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    num_guia: [''],
    cod_proveedor: [''],
    num_planta_origen: [0],
    origen: [''],
    cod_entregado: [''],
    nom_entregado: [''],
    num_bulto: [0],
    num_cantidad: [0],
    num_peso: [0],
    cod_despachado: [''],
    nom_despachado: [''],
    glosa: [''],
    Fecha_Inicio: [''],
    Fecha_Fin: [''],
    Cod_Vehiculo: ['']
  })

  personalForm = this.formBuilder.group({
    num_dni: [''],
    ape_paterno: [''],
    ape_materno: [''],
    nombres: ['']
  })

  msg: string = '';

  displayedColumns: string[] = [
    'Codigo_Barra',
    'Ubicacion',
    'OK',
    'RL',
    '2RL',
    'RT',
    '2RT',
    'G',
    'OUT',
    'RO'
  ];

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataJabas = [];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private seguridadControlGuiaService: SeguridadControlGuiaService) {
    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {
    this.MostrarTitulo()
    //this.ListarGuia()

    this.formulario.get('Cod_Vehiculo').disable();
  }

  MostrarTitulo() {
    if (GlobalVariable.num_planta == 1) {
      this.des_planta = 'SANTA MARIA'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'SANTA CECILIA'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'HUACHIPA SEDE I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'HUACHIPA SEDE II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'INDEPENDENCIA'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'INDEPENDENCIA II'
    } else if (GlobalVariable.num_planta == 13) {
      this.des_planta = 'SANTA ROSA'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'FARADAY'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'Huachipa Sede III'
    } else {
      this.des_planta = ''
    }
  }



  changeRadio(event, Id, valor) {
    if (event.checked) {
      console.log('true')
      this.dataJabas.forEach(element => {

        if (element.Id == Id) {
          if (valor == 'OK') {
            element.OK = 'OK ';
          }

          if (valor == 'RL') {
            element.RL = 'RL ';
          }

          if (valor == '2RL') {
            element['2RL'] = '2RL';
          }

          if (valor == 'RT') {
            element['RT'] = 'RT ';
          }

          if (valor == '2RT') {
            element['2RT'] = '2RT';
          }

          if (valor == 'G') {
            element['G'] = 'G  ';
          }

          if (valor == 'OUT') {
            element['OUT'] = 'OUT';
          }

          if (valor == 'RO') {
            element['RO'] = 'RO ';
          }

        }

      });
    } else {
      console.log('falso')
      this.dataJabas.forEach(element => {
        if (element.Id == Id) {
          if (valor == 'OK') {
            element.OK = '';
          }

          if (valor == 'RL') {
            element.RL = '';
          }

          if (valor == '2RL') {
            element['2RL'] = '';
          }

          if (valor == 'RT') {
            element['RT'] = '';
          }

          if (valor == '2RT') {
            element['2RT'] = '';
          }

          if (valor == 'G') {
            element['G'] = '';
          }

          if (valor == 'OUT') {
            element['OUT'] = '';
          }

          if (valor == 'RO') {
            element['RO'] = '';
          }

        }

      });
    }
  }



  listarJabasExterno(serie, numero) {


    this.seguridadControlGuiaService.ListarGuiaSalidaJabas(serie, numero).subscribe((result: any) => {
      if (result.length > 0) {
        this.dataJabas = result;

        if (this.dataJabas.length > 0) {
          this.dataJabas.forEach(element => {
            if (element.Estado_Actual.trim() == 'OK') {
              element.OK = 'OK'
            }
            if (element.Estado_Actual.trim() == 'RL') {
              element.RL = 'RL'
            }
            if (element.Estado_Actual.trim() == '2RL') {
              element['2RL'] = '2RL'
            }
            if (element.Estado_Actual.trim() == 'RT') {
              element['RT'] = 'RT'
            }
            if (element.Estado_Actual.trim() == '2RT') {
              element['2RT'] = '2RT'
            }
            if (element.Estado_Actual.trim() == 'G') {
              element.G = 'G'
            }
            if (element.Estado_Actual.trim() == 'OUT') {
              element.OUT = 'OUT'
            }
            if (element.Estado_Actual.trim() == 'RO') {
              element.RO = 'RO'
            }
          });
          console.log(this.dataJabas);
          this.dataSource.data = this.dataJabas;

        }
      }
    });
  }




  BuscarNomTrabajador(sTipo: string) {
    if (sTipo == 'E') {
      this.texto_libre = this.formulario.get('cod_entregado')?.value
    } else {
      this.texto_libre = this.formulario.get('cod_despachado')?.value
    }

    if (this.texto_libre == null) {

    } else if (sTipo == 'E' && (this.texto_libre.length < 8 || this.texto_libre.length > 10)) {
      this.nom_entregado = ''
    } else if (sTipo == 'D' && (this.texto_libre.length < 8 || this.texto_libre.length > 10)) {
      this.nom_despachado = ''
    } else {

      this.seguridadControlGuiaService.BuscarNomTrabajadorService(this.texto_libre).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {

            if (sTipo == 'E') {
              this.formulario.patchValue({ nom_entregado: result[0].Nombres })
              this.nom_entregado = result[0].Nombres
            } else {
              this.formulario.patchValue({ nom_despachado: result[0].Nombres })
              this.nom_despachado = result[0].Nombres
            }

          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

            if (sTipo == 'E') {
              this.nom_entregado = ''
            }

            if (sTipo == 'D') {
              this.nom_despachado = ''
            }
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
  }

  enviarJabas() {

    this.seguridadControlGuiaService.packingUpdateJaba(
      this.dataJabas
    ).subscribe(
      (result: any) => {
        if (result.msg == 'OK') {
          this.dataJabas = [];
          this.dataSource.data = this.dataJabas;
          this.matSnackBar.open('Se registro correctamente el estado de la Jaba', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  listarJabas(num_guia) {
    this.seguridadControlGuiaService.Lg_Packing_Select_Jaba('E', '', '', '', '', '', num_guia).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK' && result.length > 0) {
          this.dataJabas = result;
          this.dataJabas.forEach(element => {
            element.Codigo_Barra = element.Codigo_Barra,
              element.Id = element.Id,
              element.Ubicacion = element.Ubicacion,
              element.Opcion = 'X',
              element.Cod_Usuario = GlobalVariable.vusu
          });

          this.dataSource.data = this.dataJabas;
        } else {
          this.dataJabas = [];
          this.dataSource.data = this.dataJabas;
          this.matSnackBar.open('No se encontraron registros', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  Guardar() {
    var conteo = this.dataJabas.length;
    var cuenta = 0;
    this.spinnerService.show();

      this.spinnerService.show();
      this.enviarJabas();
      this.Limpiar()

  }


  changeData() {
    console.log('prueba')
    console.log(this.formulario.get('num_guia').value);
    this.listarJabas(this.formulario.get('num_guia').value)
  }

  Limpiar() {
    this.nom_entregado = ''
    this.cod_despachado_select = ''
    this.nom_despachado = ''
    this.glosa_select = ''
    this.origen_select = ''
    this.formulario.patchValue({
      Cod_Vehiculo: '',
      num_guia: '',
      cod_proveedor: '',
      num_planta_origen: 0,
      origen: '',
      cod_entregado: '',
      nom_entregado: '',
      num_bulto: 0,
      num_cantidad: 0,
      num_peso: 0,
      cod_despachado: '',
      nom_despachado: '',
      glosa: ''
    });
    this.dataJabas = [];
    this.dataSource.data = [];
  }

  // Venta registro personal 
  MostrarVentanaPersonal() {
    this.Visible_Registro_Personal = !this.Visible_Registro_Personal

    this.personalForm.reset()

    this.texto_libre = this.formulario.get('cod_entregado')?.value
    this.texto_libre2 = this.formulario.get('cod_despachado')?.value

    if (this.texto_libre.length == 8 && this.nom_entregado.length == 0) {
      this.personalForm.patchValue({ num_dni: this.texto_libre })
      this.texto_libre2 = ''
    } else if (this.texto_libre2.length == 8 && this.nom_despachado.length == 0) {
      this.personalForm.patchValue({ num_dni: this.texto_libre2 })
      this.texto_libre = ''
    } else {
      this.texto_libre = ''
      this.texto_libre2 = ''
    }
  }

  GuardarRegistroPersonal() {
    this.seguridadControlGuiaService.GuardarPersonalService(
      this.personalForm.get('num_dni')?.value,
      this.personalForm.get('ape_paterno')?.value,
      this.personalForm.get('ape_materno')?.value,
      this.personalForm.get('nombres')?.value).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

            this.Visible_Registro_Personal = !this.Visible_Registro_Personal

            if (this.texto_libre.length == 8) {
              this.BuscarNomTrabajador('E')
            } else if (this.texto_libre2.length == 8) {
              this.BuscarNomTrabajador('D')
            } else {

            }
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
}

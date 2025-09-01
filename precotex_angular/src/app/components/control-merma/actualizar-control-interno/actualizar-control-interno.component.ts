import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-actualizar-control-interno',
  templateUrl: './actualizar-control-interno.component.html',
  styleUrls: ['./actualizar-control-interno.component.scss']
})
export class ActualizarControlInternoComponent implements OnInit {

  data: any = '';

  displayedColumns: string[] = [
    'fec_registro',
    'Trabajador',
    'Cod_Trabajador',
    'Tip_Trabajador',
    'Periodo',
    'Dias',
    'fec_inicio',
    'fec_fin',
    'Cod_Usuario',
    'Flg_Estado',
    'Observaciones',
    'acciones'

  ];
  deshabilitar: boolean = false;

  Cod_Empresa: string = '';
  dataOp: any = [];
  dataDefectos: any = [];
  dataValidacion: any = [];
  OP_Sec: string = '';

  oc: string = '';

  tipo: number;
  cabecera: string = '';
  boton: string = '';
  Defecto_Principal: any;
  Defecto_Principal_Interno: any;

  dataPrendas: Array<any> = [];
  Turno: string = '';
  Merma_Fisica = 0;
  Pzas_Buenas = '';
  IdMerma = 0;

  Prendas_Mercado_Local = '';
  Valor_Mercado = 0;
  Prendas_Recuperadas = '';
  Valor_Recuperadas = 0;

  Peso = 0;
  Validacion: any = '';
  Observaciones = '';
  Dif:any  = '';
  Notas = '';

  dataMermas: any = [];
  Num_Prendas: any = 0;
  Num_Merma: any = 0;
  Porcentaje: any = 0;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private despachoTelaCrudaService: RegistroPermisosService,
    private _router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      if (res != null) {
        this.tipo = res['tipo'];
        this.cabecera = res['Cabecera'];
        this.boton = res['boton'];
        if(this.tipo == 2){
          this.Turno = res['Turno'];
          this.OP_Sec = res['OP_SEC'].trim();
          this.oc = res['OC'];
          console.log(this.OP_Sec);
          this.changeOc();
          this.changeOp();
          this.Defecto_Principal = Number(res['Defecto_Principal']);
          if(res['Defecto_Principal_Interno'] != null){
            this.Defecto_Principal_Interno = Number(res['Defecto_Principal_Interno']);
          }
          
          this.Pzas_Buenas = res['Pzas_Buenas'];
          this.Merma_Fisica = res['Merma_Fisica'];
          this.Prendas_Mercado_Local = res['Prendas_Mercado_Local'];
          this.Valor_Mercado = res['Valor_Mercado'];
          this.Prendas_Recuperadas = res['Prendas_Recuperadas'];
          this.Valor_Recuperadas = res['Valor_Recuperadas'];
          this.Notas = res['Notas'];
          this.IdMerma = res['IdMerma'];
          this.Dif = res['Dif'];
          if(res['Peso'] != null){
            this.Peso = res['Peso'];
          }

          if(res['Validacion'] != null){
            this.Validacion = Number(res['Validacion']);
          }else{
            this.Validacion = '';
          }
          
          if(res['Observaciones'] !=  null){
            this.Observaciones = res['Observaciones'];
          }
          
          this.obtenerMermaPrendasOp();
          this.getValidacion();
        }
      }
    });
  }

  obtenerMermaGeneral(OP){
    this.despachoTelaCrudaService.obtenerMermaGeneralOp(
      OP
    ).subscribe(
      (result: any) => {
        if (result != null) {
          this.dataMermas = result;
          this.Num_Merma = this.dataMermas[0].Num_Mermas;
          this.Num_Prendas = this.dataMermas[0].Num_Prendas;
          this.Porcentaje = this.dataMermas[0].Porcentaje;
        }
        console.log(this.data);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
  ngAfterViewInit(): void {

  }
  obtenerMermaPrendasOp() {
    var Opcion = '';
    var cadena = this.OP_Sec.split('-');
    console.log(cadena);
    var OP = cadena[0];
    var Num_SecOrd = cadena[1];
    if (this.tipo == 1) {
      Opcion = 'N';
    } else {
      Opcion = 'A';
    }
    
    this.despachoTelaCrudaService.obtenerMermaPrendasOp(
      Opcion,
      OP,
      Num_SecOrd,
      this.IdMerma
    ).subscribe(
      (result: any) => {
        if (result != null) {
          console.log(result);
          this.dataPrendas = result;
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
  updateCampo(event, campo, Cod_Talla) {
    console.log(event.target.value)
    var valor = event.target.value;

    if (valor > 0 && valor != '') {
      this.Prendas_Mercado_Local = '';
      this.Prendas_Recuperadas = '';
      this.Valor_Mercado = 0;
      this.Valor_Recuperadas = 0;
      this.dataPrendas.map(element => {
        if (Cod_Talla == element.Cod_Talla) {
          element[campo] = Number(valor);
        }
        if (element.MERCADO_LOCAL > 0) {
          this.Prendas_Mercado_Local += element.MERCADO_LOCAL + '/' + element.Cod_Talla + ', ';
        }

        if (element.RECUPERACION > 0) {
          this.Prendas_Recuperadas += element.RECUPERACION + '/' + element.Cod_Talla + ', ';
        }

        this.Valor_Mercado += element.MERCADO_LOCAL;
        this.Valor_Recuperadas += element.RECUPERACION;

      });

    } else {
      event.target.value = 0;
      this.matSnackBar.open("El campo no debe estar vació, y debes ingresar un valor mayor a 0!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }
    console.log(this.dataPrendas);
  }

  saveRegistro(){
  
  }

  guardarRegistro() {
    if(this.tipo == 1){
      this.saveRegistro();
    }
    if(this.tipo == 2){
      this.updateRegistro();
    }
  }

  updateRegistro(){
    if (this.data != '') {
      if (this.Defecto_Principal != '') {
        if (this.Validacion != '') {

          this.SpinnerService.show();
          this.despachoTelaCrudaService.actualizarRegistroMerma(
            'U',
            this.IdMerma,
            this.Peso,
            this.Defecto_Principal,
            this.Validacion,
            this.Observaciones,
            GlobalVariable.vusu,
            this.Defecto_Principal_Interno
          ).subscribe(
            (result: any) => {
              if (result != false) {

                console.log(result);

                  this.SpinnerService.hide();
                  this._router.navigate(['/ControlMerma']);
                  this.dataPrendas = [];
                  this.matSnackBar.open("Registro Actualizado correctamente!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })

              } else {
                this.SpinnerService.hide();
              }

            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            }))


        } else {
          this.matSnackBar.open("El campo Validación es obligatorio!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        }
      } else {
        this.matSnackBar.open("Debes selecionar el defecto principal!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      }
    } else {
      this.matSnackBar.open("Debes seleccionar una OP Sec!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }
  }

  getDefectos() {
    this.despachoTelaCrudaService.ObtenerAdicionalesMerma(
      'D',
    ).subscribe(
      (result: any) => {
        this.dataDefectos = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  getValidacion() {
    this.despachoTelaCrudaService.ObtenerAdicionalesMerma(
      'V',
    ).subscribe(
      (result: any) => {
        this.dataValidacion = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
  changeOp() {
    if (this.OP_Sec != '') {
      //console.log(this.OP_Sec);
      var cadena = this.OP_Sec.split('-');
      console.log(cadena);
      var OP = cadena[0];
      var Num_SecOrd = cadena[1];
      this.Prendas_Mercado_Local = '';
      this.Prendas_Recuperadas = '';
      this.Valor_Mercado = 0;
      this.Valor_Recuperadas = 0;

      this.getDefectos();
      this.obtenerMermaGeneral(OP);
      this.obtenerMermaPrendasOp();
      this.despachoTelaCrudaService.obtenerDatosPorOp(
        OP,
        Num_SecOrd
      ).subscribe(
        (result: any) => {
          if (result != null) {
            this.data = result;
          }
          console.log(this.data);
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    } else {
      this.matSnackBar.open('Debes seleccionar la OP', 'Cerrar', {
        duration: 1500,
      })
    }
  }

  changeOc() {
    console.log(this.oc);
    if(this.tipo == 1){
      this.data = '';
      this.OP_Sec = '';
    }
    
    if (this.oc != '') {
      this.despachoTelaCrudaService.obtenerOpSec(
        this.oc,
      ).subscribe(
        (result: any) => {
          if (result[0].status == 0) {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          else {
            this.dataOp = result;
            this.matSnackBar.open('Se encontraron registros.', 'Cerrar', {
              duration: 1500,
            })
            this.SpinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    } else {
      this.matSnackBar.open('Debes ingresar la OC', 'Cerrar', {
        duration: 1500,
      })
    }


  }


}


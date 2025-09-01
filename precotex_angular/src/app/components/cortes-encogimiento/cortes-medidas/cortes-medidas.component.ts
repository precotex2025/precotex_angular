
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CortesEncogimientoService } from 'src/app/services/corte-encogimiento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  id_Corte: string;
  nom_Cliente: string;
  cod_Partida: string;
  num_Secuencia: string;
  cod_Tela: string;
  des_Tela: string;
  des_Color: string;
  ancho_Real_cm: number;
  encogimiento_Ancho_Lab: number;
  encogimiento_Largo_Lab: number;
  ancho_Antes_Lav: number;
  alto_Antes_Lav: number;
  ancho_Despues_Lav: number;
  alto_Despues_Lav: number;
  fecha_Creacion: Date;
  sesgadura: number;
  estado_Medida_Antes: boolean;
  estado_Medida_Despues: boolean;
}


@Component({
  selector: 'app-cortes-medidas',
  templateUrl: './cortes-medidas.component.html',
  styleUrls: ['./cortes-medidas.component.scss']
})
export class CortesMedidasComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any ,
    public dialogRef: MatDialogRef<CortesMedidasComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private CortesEncogimientoService: CortesEncogimientoService,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
  ) { this.dataSource = new MatTableDataSource();}

  dataSource: MatTableDataSource<data_det>;
  sCod_Usuario = GlobalVariable.vusu;
  botonHabilitado: boolean = false;
  PerfilUsuario: number;

  displayedColumns_cab: string[] = [
    'Partida',
    //'CodTela',
    'DesTela',
    'Ancho Antes Lavado',
    'Largo Antes Lavado',
    'Ancho Despues Lavado',
    'Largo Despues Lavado',
    'Sesgadura',
  ]



  ngOnInit(): void {
    this.BuscarUsuario();
    this.ListarCorteEncogimientoDet();
  }

  Salir(){
    this.dialogRef.close();
  }


  ListarCorteEncogimientoDet() {
    const sCodPartida      : string = this.data.datos.cod_Partida  ;
    const sNumSecuencia    : string = this.data.datos.num_Secuencia;
    const sOpcion : string = "B";
    this.CortesEncogimientoService.listarCorteEncogimeintoDet(sOpcion, sNumSecuencia, sCodPartida,0,0,0,0,0
    ).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            console.log(response.elements);
            this.dataSource.data = response.elements;
            this.SpinnerService.hide();
            const sAlto_Despues_Lav    : number = this.dataSource.data[0].alto_Despues_Lav;
            if(sAlto_Despues_Lav == null || sAlto_Despues_Lav == 0){
              this.botonHabilitado = 0 == 0;
            }
            //this.data_det.ancho_Antes_Lav = this.dataSource.data[0].ancho_Antes_Lav;
          }
          else{
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = []
            this.SpinnerService.hide();
          }
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
        });
      }
    });
  }

  ActualizarCorteEncogimiento() {

    const sCodPartida      : string = this.dataSource.data[0].cod_Partida;
    const sNumSecuencia    : string = this.dataSource.data[0].num_Secuencia;
    const sOpcion : string = "U";

    const sAncho_Antes_Lav      : number =  this.dataSource.data[0].ancho_Antes_Lav ??= 0;
    const sAlto_Antes_Lav    : number = this.dataSource.data[0].alto_Antes_Lav ??= 0;
    const sAncho_Despues_Lav      : number = this.dataSource.data[0].ancho_Despues_Lav ??= 0;
    const sAlto_Despues_Lav    : number = this.dataSource.data[0].alto_Despues_Lav ??= 0;
    const sSesgadura    : number = this.dataSource.data[0].sesgadura ??= 0;

    this.CortesEncogimientoService.listarCorteEncogimeintoDet(sOpcion, sNumSecuencia, sCodPartida,sAncho_Antes_Lav,sAlto_Antes_Lav,sAncho_Despues_Lav,sAlto_Despues_Lav, sSesgadura
    ).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.matSnackBar.open('Registro Actualizado Corectamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 });
            this.dataSource.data = []
            this.SpinnerService.hide();
            this.Salir();
            this.CortesEncogimientoService.emitirCambio();

          }
          else{
            this.matSnackBar.open("No se Actaulizo Registro..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = []
            this.SpinnerService.hide();
            this.Salir();
          }
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
        });
      }
    });
  }

  onInputChange(data_det: any) {

    this.botonHabilitado = 0 == 0;
    if (data_det.ancho_Antes_Lav > 2.15) {
        data_det.ancho_Antes_Lav = 2.15; // Restringe el valor a 2 si se pasa del límite
        this.matSnackBar.open("El ancho antes lavado debe ser =< 2.15..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.SpinnerService.hide();

    }
  }

  validateDecimal(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
  const charStr = String.fromCharCode(charCode);

  // Permitir números, punto decimal y teclas de control (backspace, tab, enter)
  if (!charStr.match(/^[0-9.]$/) && charCode !== 8 && charCode !== 13 && charCode !== 9) {
    event.preventDefault();
  }

  // Evitar más de un punto decimal
  const input = event.target as HTMLInputElement;
  if (charStr === '.' && input.value.includes('.')) {
    event.preventDefault();
  }
  }

  esDeshabilitadoMedidaAntes(data_det: any): boolean {
    return data_det.estado_Medida_Antes === 0;
  }

  esDeshabilitadoMedidaDespues(data_det: any): boolean {
    return data_det.alto_Antes_Lav === null;
  }
  validarEntero(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Bloquea la entrada de caracteres no numéricos
    }
  }


  BuscarUsuario() {

    this.CortesEncogimientoService.buscarUsuario(this.sCod_Usuario
    ).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.PerfilUsuario = response.elements[0].id_Corte;
          }
          else{
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = []
            this.SpinnerService.hide();
          }
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
        });
      }
    });
  }
}

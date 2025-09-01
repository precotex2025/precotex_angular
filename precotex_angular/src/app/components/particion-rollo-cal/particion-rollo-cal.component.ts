import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroCalidadTejeduriaService } from 'src/app/services/registro-calidad-tejeduria.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Auditor } from 'src/app/models/Auditor';
import { Restriccion } from 'src/app/models/Restriccion';
import { GlobalVariable } from '../../VarGlobals';
import { MatPaginator } from '@angular/material/paginator';
import { allowedNodeEnvironmentFlags } from 'process';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute, Router } from '@angular/router';

interface data_det_Rollo {
  Num_Rollo: String;
  Prefijo_Maquina: string;
  Codigo_Rollo: string;
  Cod_Ordtra: string;
  Cod_Calidad: string;
  Peso_rollo_actual: string;
  Observaciones: string;
}

@Component({
  selector: 'app-particion-rollo-cal',
  templateUrl: './particion-rollo-cal.component.html',
  styleUrls: ['./particion-rollo-cal.component.scss'],
})
export class ParticionRolloCalComponent implements OnInit {
  ruta = '';
  Codigo_Barras = '';
  Inspector = '';

  Cdrollo = '';
  Not = '';
  Digitador = '';
  Restriccion = '';
  Turno = '';
  Cod_Accion = '';
  DpMaquina = '';
  Dobservacion = '';
  DMetrosCuad = 0;
  Total_Puntos = 0;
  DCalidad = 0;

  xCodDefe = '';
  xAncho = 0;
  xDensidad = 0;
  xCalidad = 1;
  xCantDefe = 0;
  xObservaciones = '';

  Tip_Trabajador = '';
  Cod_Trabajador = '';
  xAccion = '';
  xCod_Usuario = '';

  Num_Secuencia = '';
  Unidades_rollo_actual = '';
  Peso_rollo_actual = '';
  Sec_Maquina = '';
  Num_Rollo = '';
  v_Trabajador = '';

  public data_det_Rollo = [
    {
      Num_Rollo: '',
      Prefijo_Maquina: '',
      Codigo_Rollo: '',
      Cod_Ordtra: '',
      Cod_Calidad: '',
      Peso_rollo_actual: '',
      Observaciones: '',
    },
  ];

  formulario = this.formBuilder.group({
    Txt_CodRollo: [''],
    Txt_Ot: [''],
    Txt_Pref_Maquina: [''],
    Txt_Codigo_Rollo: [''],
    Txt_Maquina: [''],
    Txt_Cod_Turno: [''],
    Txt_Peso_Rollo: ['0'],
    Txt_Peso_Rollo_Nuevo: ['', [Validators.required]],
    Txt_Unidades_Metros_Rollo: ['0', [Validators.required]],

    Txt_Ancho: [''],
    Txt_Calidad: [''],
    Txt_Densidad: [''],
    Txt_Metros: [''],
    Txt_Observaciones: [''],
  });

  // Num_Rollo: String,
  // Prefijo_Maquina: string,
  // Codigo_Rollo: string,
  // Cod_Ordtra: string,
  // Cod_Calidad: string,
  // Peso_rollo_actual: string,
  // Observaciones: string,

  dataForExcel = [];

  data_det_Rollo_2: string[] = [
    'Num_Rollo',
    'Prefijo_Maquina',
    'Codigo_Rollo',
    'Cod_Calidad',
    'Peso_rollo_actual',
    'Observaciones',
  ];
  //['Num_Rollo', 'Cod_Ordtra', 'Cod_Calidad','Peso_rollo_actual','Observaciones']

  dataSource: MatTableDataSource<data_det_Rollo>;

  @ViewChild('myinputAdd') inputAdd!: ElementRef;
  @ViewChild('myinputPesoRollo') inputPesoRollo!: ElementRef;
  @ViewChild('myinputPesoRolloNuevo') inputPesoRolloNuevo!: ElementRef;
  @ViewChild('myinputUniMetRoll') inpuUniMetRoll!: ElementRef;
  @ViewChild('myinputObs') inputObs!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private RegistroCalidadTejeduriaService: RegistroCalidadTejeduriaService,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private exceljsService: ExceljsService,
    private router: Router,
    private route: ActivatedRoute,
    private ingresoRolloTejidoService: IngresoRolloTejidoService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.xCod_Usuario = GlobalVariable.vusu;
    this.formulario.get('Txt_Ot').disable();
    this.formulario.get('Txt_Pref_Maquina').disable();
    this.formulario.get('Txt_Codigo_Rollo').disable();
    this.formulario.get('Txt_Maquina').disable();
    this.formulario.get('Txt_Cod_Turno').disable();
    this.formulario.get('Txt_Ancho').disable();
    this.formulario.get('Txt_Calidad').disable();
    this.formulario.get('Txt_Ancho').disable();
    this.formulario.get('Txt_Densidad').disable();
    this.formulario.get('Txt_Metros').disable();
    //this.formulario.get('Txt_Observaciones').disable();

    this.formulario.get('Txt_Peso_Rollo').disable();
    this.mostrarDatosInspector();
  }

  ngAfterViewInit() {
    this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
    // this.dataSource.paginator = this.paginator;
    // this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    // this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    //   if (length === 0 || pageSize === 0) {
    //     return `0 de ${length}`;
    //   }
    //   length = Math.max(length, 0);
    //   const startIndex = page * pageSize;
    //   // If the start index exceeds the list length, do not try and fix the end index to the end.
    //   const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    //   return `${startIndex + 1}  - ${endIndex} de ${length}`;
    // };
  }

  ReproducirError() {
    const audio = new Audio('assets/error.mp3');
    audio.play();
  }

  ReproducirOk() {
    const audio = new Audio('assets/aceptado.mp3');
    audio.play();
  }

  onToggle() {
    if (this.formulario.get('Txt_CodRollo')?.value.length >= 7) {
      this.Codigo_Barras = this.formulario.get('Txt_CodRollo')?.value;
      //console.log("Codigo:"+this.Codigo_Barras)
      this.LecturarBulto();
    }
  }

  AnadirBulto() {
    this.Codigo_Barras = this.formulario.get('Txt_CodRollo')?.value;
    if (this.Codigo_Barras.length >= 5) {
      this.LecturarBulto();
    } else if (this.Codigo_Barras.length > 2) {
      this.ReproducirError();
      this.matSnackBar.open('Rollo Longitud Incorrecta', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
    }
  }

  LecturarBulto() {
    this.ingresoRolloTejidoService
      .BuscarRolloCalificacion(this.Codigo_Barras)
      .subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'Ok') {
            //this.ReproducirOk;
            this.formulario.get('Txt_Ot')?.setValue(result[0].Ot);
            this.formulario
              .get('Txt_Pref_Maquina')
              ?.setValue(result[0].Prefijo_Maquina);
            this.formulario
              .get('Txt_Codigo_Rollo')
              ?.setValue(result[0].Codigo_Rollo);
            this.formulario.get('Txt_Maquina')?.setValue(result[0].Maquina);
            this.formulario.get('Txt_Calidad')?.setValue(result[0].Calidad);
            this.formulario.get('Txt_Cliente')?.setValue(result[0].Cliente);
            this.formulario.get('Txt_Ancho')?.setValue(result[0].Ancho_Tela);
            this.formulario
              .get('Txt_Densidad')
              ?.setValue(result[0].Densidad_Tela);
            // this.formulario.get('Txt_Observaciones')?.setValue(result[0].Observaciones);
            this.formulario
              .get('Txt_Peso_Rollo')
              ?.setValue(result[0].peso_rollo_actual);
            this.showDetalleRolloParticionado();

            this.Num_Secuencia = result[0].Num_Secuencia;
            this.Unidades_rollo_actual = result[0].unidades_rollo_actual;
            this.Peso_rollo_actual = result[0].peso_rollo_actual;
            this.Sec_Maquina = result[0].Sec_Maquina;
            this.Num_Rollo = result[0].Num_Rollo;
            console.log('El nro de rollo es: ' + this.Num_Rollo);

            if (result[0].Densidad_Tela == null) {
              this.formulario.get('Txt_Ancho')?.setValue('0');
            } else {
              this.formulario.get('Txt_Ancho')?.setValue(result[0].Ancho_Tela);
            }

            if (result[0].Densidad_Tela == null) {
              this.formulario.get('Txt_Densidad')?.setValue('0');
            } else {
              this.formulario
                .get('Txt_Densidad')
                ?.setValue(result[0].Densidad_Tela);
            }

            if (result[0].Observaciones == null) {
              this.formulario.get('Txt_Observaciones')?.setValue('');
            } else {
              this.formulario
                .get('Txt_Restriccion')
                ?.setValue(result[0].Observaciones);
            }

            if (result[0].Turno == null) {
              let date = new Date();
              if (date.getHours() > 18) {
                this.formulario.get('Txt_Cod_Turno')?.setValue('2');
              } else {
                this.formulario.get('Txt_Cod_Turno')?.setValue('1');
              }
            } else {
              this.formulario.get('Txt_Cod_Turno')?.setValue(result[0].Turno);
            }

            if (result[0].Cod_Restriccion == null) {
              this.formulario.get('Txt_Restriccion')?.setValue('G');
            } else {
              this.formulario
                .get('Txt_Restriccion')
                ?.setValue(result[0].Cod_Restriccion);
            }

            this.formulario.get('Txt_FacConv')?.setValue('0');
            this.formulario.get('Txt_CodRollo')?.setValue('');
            this.inputPesoRolloNuevo.nativeElement.focus(); // hace focus sobre "myInput"

            var tp = this.v_Trabajador;
            this.Tip_Trabajador = tp.charAt(0);

            var ct = this.v_Trabajador;
            this.Cod_Trabajador = ct.substring(1);

            console.log('tp:' + this.Tip_Trabajador);
            console.log('ct:' + this.Cod_Trabajador);
            //this.showDetalleDefectos();
          } else {
            // this.ReproducirError();

            this.formulario.get('Txt_CodRollo')?.setValue('');
            this.formulario.get('Txt_Ot')?.setValue('');
            this.formulario.get('Txt_Maquina')?.setValue('');
            this.formulario.get('Txt_Cod_Turno')?.setValue('');
            this.formulario.get('Txt_CodDefecto')?.setValue('');
            this.formulario.get('Txt_NomDefecto')?.setValue('');
            this.formulario.get('Txt_Restriccion')?.setValue('G');
            this.formulario.get('Txt_Ancho')?.setValue('0');
            this.formulario.get('Txt_Densidad')?.setValue('0');
            this.formulario.get('Txt_Calidad')?.setValue('');
            this.formulario.get('Txt_CantDef')?.setValue('0');
            this.formulario.get('Txt_FacConv')?.setValue('0');
            this.formulario.get('Txt_Observaciones')?.setValue('');
            this.formulario.get('Txt_Pref_Maquina')?.setValue('');
            this.formulario.get('Txt_Codigo_Rollo')?.setValue('');
            this.formulario.get('Txt_Cliente')?.setValue('');
            //this.showDetalleDefectos();
            this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
            this.dataSource.data = [];
            //this.inputPesoRolloNuevo.nativeElement.focus() // hace focus sobre "myInput"
          }
        },
        (err: HttpErrorResponse) => {
          this.ReproducirError();
          this.matSnackBar.open(err.message, 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
        }
      );
  }

  showDetalleRolloParticionado() {
    this.ingresoRolloTejidoService
      .showDetalleRolloParticionado(
        this.formulario.get('Txt_Ot')?.value,
        this.formulario.get('Txt_Pref_Maquina')?.value,
        this.formulario.get('Txt_Codigo_Rollo')?.value
      )
      .subscribe(
        (result: any) => {
          this.dataSource = result;
        },
        (err: HttpErrorResponse) =>
          this.matSnackBar.open(err.message, 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          })
      );
  }

  GenerarParticion() {
    if (this.formulario.get('Txt_Peso_Rollo_Nuevo')?.value <= 0) {
      this.matSnackBar.open('Kilos deben ser mayor a cero', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
    } else {
      //this.Num_Secuencia
      //this.Unidades_rollo_actual
      //this.Peso_rollo_actual
      //this.Sec_Maquina
      if (confirm('Desea particionar el rollo?')) {
        this.SpinnerService.show();
        const formData = new FormData();

        formData.append('Accion', 'I');
        /*     DEFECTOS DEL ROLLO      */
        formData.append('x_Ot', this.formulario.get('Txt_Ot')?.value);
        formData.append('x_Num_Secuencia', this.Num_Secuencia);
        formData.append('x_Sec_Maquina', this.Sec_Maquina);
        formData.append('x_Num_Rollo', this.Num_Rollo);
        formData.append(
          'x_Peso_Rollo_Nuevo',
          this.formulario.get('Txt_Peso_Rollo_Nuevo')?.value
        );
        formData.append(
          'x_Unidades_Metros_Rollo',
          this.formulario.get('Txt_Unidades_Metros_Rollo')?.value
        );
        formData.append('x_Cod_Usuario', this.xCod_Usuario);
        formData.append('x_Tip_Trabajador', this.Tip_Trabajador);
        formData.append('x_Cod_Trabajador', this.Cod_Trabajador);
        formData.append(
          'x_Observacion',
          this.formulario.get('Txt_Observaciones')?.value
        );

        this.ingresoRolloTejidoService.CrearParticion(formData).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open('Se Registro Correctamente', 'Cerrar', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 1500,
              });
              this.showDetalleRolloParticionado();
              this.SpinnerService.hide();
              this.formulario.get('Txt_CodRollo')?.setValue('');
              this.formulario.get('Txt_Pref_Maquina')?.setValue('');
              this.formulario.get('Txt_Codigo_Rollo')?.setValue('');
              this.formulario.get('Txt_Maquina')?.setValue('');
              this.formulario.get('Txt_Ot')?.setValue('');
              this.formulario.get('Txt_Peso_Rollo_Nuevo')?.setValue('0');
              this.formulario.get('Txt_Peso_Rollo')?.setValue('0');
              this.formulario.get('Txt_Unidades_Metros_Rollo')?.setValue('0');
              this.formulario.get('Txt_Observaciones')?.setValue('');
              this.Tip_Trabajador = '';
              this.Cod_Trabajador = '';
              this.inputAdd.nativeElement.focus(); // hace focus sobre "myInput"
              this.dataSource.data = [];
            } else {
              this.SpinnerService.hide();
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 1500,
              });
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
          }
        );
      }
    }
  }

  validateFormat(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  onKeydown1(event) {
    if (event.key === 'Enter') {
      this.inpuUniMetRoll.nativeElement.focus(); // hace focus sobre "myInput"
    }
  }

  onKeydown2(event) {
    if (event.key === 'Enter') {
      this.inputObs.nativeElement.focus(); // hace focus sobre "myInput"
    }
  }

  Funcion_Cancelar() {
    this.router.navigate(['/']);
  }

  Formato_Particion() {
    this.SpinnerService.show();
  }

  Seleccion_1() {}

  mostrarDatosInspector() {
    //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
    let Cod_Trabajador = GlobalVariable.vcodtra;
    let Tip_Trabajador = GlobalVariable.vtiptra;

    this.RegistroCalidadTejeduriaService.traerDatosInspector(
      Cod_Trabajador,
      Tip_Trabajador
    ).subscribe(
      (result: any) => {
        console.log(result);
        if (result[0].Respuesta == 'OK') {
          //this.formulario.get('dnitejedor')?.setValue(result[0].Nro_DocIde);
          this.v_Trabajador = result[0].Cod_Trabajador;
          console.log('Cod Trabajador:' + result[0].Cod_Trabajador);
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        })
    );
  }
}

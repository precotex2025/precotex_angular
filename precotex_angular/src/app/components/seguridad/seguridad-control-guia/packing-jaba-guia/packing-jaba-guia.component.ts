import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { SeguridadControlGuiaService } from 'src/app/services/seguridad-control-guia.service';

@Component({
  selector: 'app-packing-jaba-guia',
  templateUrl: './packing-jaba-guia.component.html',
  styleUrls: ['./packing-jaba-guia.component.scss']
})
export class PackingJabaGuiaComponent implements OnInit {
  seleccionaFila: any[] = []; 
  row1: any;
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
    Cod_Packing_Jaba: [''],
    Cod_Usuario: [''],
    Num_Planta: [0],
    Num_Planta_Destino: [''],
    Cod_Usuario_Ingreso: [''],
    Codigo_Barra: [''],
    BuscarJabas: ['']
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

  mostrarCreacion = false;
  file: any;
  ultimoNumPaking: string;
  ultimoValor: string;
  datosFiltrados = [];
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private _router: Router,
    private seguridadControlGuiaService: SeguridadControlGuiaService) {
    this.dataSource = new MatTableDataSource();

  }
  @ViewChild('myInput') myInput: any; 
  ngOnInit(): void {
    this.MostrarTitulo();

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
      this.des_planta = 'HUACHIPA SEDE III'
    } else {
      this.des_planta = ''
    }
  }



  changeRadio(event, Id, valor) {
  
    if (event.checked) {
     
      this.dataJabas.forEach(element => {

        if (element.Codigo_Barra == Id) {
          if (valor == 'OK') {
            element.OK = 'OK';
            element.RL = '';
            element['2RL'] = '';
            element['RT'] = '';
            element['2RT'] = '';
            element['G'] = '';
            element['OUT'] = '';
            element['RO'] = ' ';
          }

          if (valor == 'RL') {
            element.RL = 'RL';
            element.OK = '';
          }

          if (valor == '2RL') {
            element['2RL'] = '2RL';
            element.OK = '';
          }

          if (valor == 'RT') {
            element['RT'] = 'RT';
            element.OK = '';
          }

          if (valor == '2RT') {
            element['2RT'] = '2RT';
            element.OK = '';
          }

          if (valor == 'G') {
            element['G'] = 'G';
            element.OK = '';
          }

          if (valor == 'OUT') {
            element['OUT'] = 'OUT';
            element.OK = '';
          }

          if (valor == 'RO') {
            element['RO'] = 'RO';
            element.OK = '';
          }

        }

      });
    } else {
      
      this.dataJabas.forEach(element => {
        if (element.Codigo_Barra == Id) {
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
    this.seleccionarFijo(this.row1);
  }


  agregarJaba() {

    var filtrado = this.dataJabas.filter(element => {
      return element.Codigo_Barra == this.formulario.get('Codigo_Barra').value;
    });
    const nuevoValor = this.formulario.get('Codigo_Barra').value;
    if (filtrado.length == 0  && nuevoValor !== this.ultimoValor) {
      this.seguridadControlGuiaService.Lg_Packing_Select_Jaba('U', this.formulario.get('Codigo_Barra').value, '', '', this.des_planta, '').subscribe(
        (result: any) => {
          if (result.length > 0) {
            let datos = {
              Codigo_Barra: result[0].Codigo_Barra,
              Estado_Actual: result[0].Estado==undefined ? '' : result[0].Estado, 
              Ubicacion: result[0].Ubicacion==undefined ? '' : result[0].Ubicacion, 
              Opcion: 'C',
              Num_Planta: GlobalVariable.num_planta,
              Num_Planta_Destino:'',
              Cod_Usuario: GlobalVariable.vusu,
              Cod_Packing_Jaba: this.formulario.get('Cod_Packing_Jaba').value,
              'OK': result[0]['OK'].trim(),
              'RL': result[0]['RL'].trim(),
              '2RL': result[0]['2RL'].trim(),
              'RT': result[0]['RT'].trim(),
              '2RT': result[0]['2RT'].trim(),
              'G': result[0]['G'].trim(),
              'OUT': result[0]['OUT'].trim(),
              'RO': result[0]['RO'].trim()
            }
            this.formulario.patchValue({
              Codigo_Barra: ''
            });

            this.dataJabas.push(datos);

            this.dataSource.data = this.dataJabas;
            console.log('dataSource.data: ',this.dataSource.data);
          } else {
            this.matSnackBar.open('No se encontraron registros dentro de la Sede', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    } else {
      this.matSnackBar.open('Ya ingresaste el código de Jaba anteriormente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    this.ultimoValor = nuevoValor;
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

    
this.seguridadControlGuiaService.Lg_Man_Packing_Jaba_Web_Post(
      this.dataJabas
    ).subscribe(
      (result: any) => {
        if (result.msg == 'OK') {
          this.dataJabas = [];
          this.dataSource.data = this.dataJabas;
          this.mostrarCreacion = false;
          this.matSnackBar.open('Se registro correctamente el Paking List N° '+this.ultimoNumPaking, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  
    }


  Guardar() {
    var conteo = this.dataJabas.length;
    var cuenta = 0;
    this.spinnerService.show(); 
    this.enviarJabas();
    this.Limpiar()

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

  crearPackingJaba() {
    if (this.des_planta != '') {
      let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
        disableClose: true,
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result == 'true') {
          var Num_Destino = 0;
          if (GlobalVariable.num_planta == 1) {
            Num_Destino = 2;
          } else if (GlobalVariable.num_planta == 2) {
            Num_Destino = 1;
          }
          this.seguridadControlGuiaService.Lg_Man_Packing_Jaba_Web('I', '', GlobalVariable.vusu, GlobalVariable.num_planta, Num_Destino, '', '', '').subscribe(
            (result: any) => {
              if (result[0].Respuesta == 'OK') {
                this.formulario.patchValue({
                  Cod_Packing_Jaba: result[0].Cod_Packing_Jaba
                });
                this.ultimoNumPaking = result[0].Cod_Packing_Jaba;          
                this.mostrarCreacion = true;
              } else {
                this.dataJabas = [];
                this.dataSource.data = this.dataJabas;
                this.matSnackBar.open('Ocurrio un error al realizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

        }
      })
    } else {
      this._router.navigate(['/SeguridadControlGuia']);
    }

  }

  historialPackingJaba() {
    this._router.navigate(['/historialPackingJaba']);
  }


  onChangeFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
     


    }
  }

  eliminarArchivo() {
    this.file = null;
  }

  onJabaAutomatico(){
   
    if (this.formulario.get('Codigo_Barra').value?.length  === 8) { 
       this.agregarJaba();
    }
  }

  seleccionarFila(row: any) { 
    
    
    const index = this.seleccionaFila.indexOf(row);
    this.row1 = row;
    
    if (index === -1) {
      this.seleccionaFila.push(row);  
    } 
    else {
      this.seleccionaFila.splice(index, 1); 
    }
  
  }

  seleccionarFijo(row: any) { 
    
    
    const index = this.seleccionaFila.indexOf(row);
    this.row1 = row;
    
    if (index === -1) {
      this.seleccionaFila.push(row);  
    }  
  
  }

  isSeleccionadaFila(row: any): boolean {
    return this.seleccionaFila.includes(row);
  }

  filtrarDatos(valor: any) {
 
    this.datosFiltrados = this.dataSource.data.filter(item =>
       Object.values(item).some(val => val.toString().includes(valor.target.value ))
     );
    
   }
   
   limpiarBuscarJabas(){
     this.formulario.patchValue({ BuscarJabas: '' });
     this.myInput.nativeElement.focus();
   } 
 
   refreshJabas(){
     this.datosFiltrados = this.dataSource.data.filter(item =>
       Object.values(item).some(val => val.toString().includes(''))
     );
     this.limpiarBuscarJabas();
   }
}
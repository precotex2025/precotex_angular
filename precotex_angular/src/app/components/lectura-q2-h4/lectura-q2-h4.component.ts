import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lecturaq2ah4Service } from 'src/app/services/lecturaq2ah4.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { QueryList } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ChangeDetectorRef } from '@angular/core';

interface data_det_Mov {
  checked: boolean;
  Num_Mov: string;
  Cod_Almacen: string;
  Almacen: string;
  Fec_Mov: string;
  Tipo_Mov: string;
  Usuario: string;
}

interface data_det_Mov_Sel {
  checked: boolean;
  Lote: string;
  Item: string;
  Cant_Mov: string;
  Cod_Almacen: string;
  Almacen: string;
  Num_Mov: string;
  Fec_Mov: string;
  Tipo_Mov: string;
  Usuario: string;
  Cod_Prov: string;
}

interface data_det_Bult {
  checked: boolean;
  Num_Corre: string;
  Peso_Neto: string;
  Num_Bulto: number;
  Cod_Proveedor: string;
  Cod_OrdProv: string;
  Cod_item: string;
  Cod_Almacen: string;
  Num_MovStk: string;
}

let contadorGlobal: number = 0;
let cantidadGlobal: number = 0;

@Component({
  selector: 'app-lectura-q2-h4',
  templateUrl: './lectura-q2-h4.component.html',
  styleUrls: ['./lectura-q2-h4.component.scss'],
})
export class LecturaQ2H4Component implements OnInit {
  Cod_Bar_Bul = '';
  selectedRow: any;
  isRowBlocked: boolean = false;

  filaSeleccionada: any = null;
  tablaBloqueada: boolean = false;

  filaSeleccionada2: any = null;
  tablaBloqueada2: boolean = false;

  filaSeleccionada3: any = null;
  tablaBloqueada3: boolean = false;

  codAlmOrigen: string;
  numMovOrigen: string;
  tipMovOrigen: string;

  seleccionarFila(row: any) {
    this.filaSeleccionada = row;
  }

  seleccionarFila2(row: any) {
    this.filaSeleccionada2 = row;
  }

  seleccionarFila3(row: any) {
    this.filaSeleccionada3 = row;
  }

  bselect = false;
  checked = false;

  @ViewChildren('checkbox') checkboxes: QueryList<MatCheckbox>;
  @ViewChildren('checkboxDetalle') checkboxesDet: QueryList<MatCheckbox>;

  formulario = this.formBuilder.group({
    ct_Cod_Bar_Caja: [''],
    ct_Filtro: [''],
    ct_Peso: [''],
    //miCheckbox1:      [''],
    miCheckbox: [''],
    miCheckboxSel: [''],
  });

  isChecked: boolean = false;

  displayedColumns_cab_mov: string[] = [
    'Num_Mov',
    'Cod_Almacen',
    'Almacen',
    'Fec_Mov',
    'Tipo_Mov',
    'Usuario',
  ];

  displayedColumns_cab_mov_sel: string[] = [
    //'Sel',
    'Lote',
    'Item',
    'Cant_Mov',
    'Cod_Almacen',
    'Almacen',
    'Fec_Mov',
    'Tipo_Mov',
    'Usuario',
    'Cod_Prov',
  ];

  displayedColumns_cab_bulto: string[] = [
     'Sel',
    'Nro_Caja',
    'Peso_Neto',
    'Nro_Bulto',
    'Proveedor',
    'Lote',
    'Item',
  ];

  dataSource_Mov: MatTableDataSource<data_det_Mov>;
  dataSource_Mov_Sel: MatTableDataSource<data_det_Mov_Sel>;
  dataSource_Mov_Bultos: MatTableDataSource<data_det_Bult>;

  @ViewChild('inpCodBarCa') inputCodBarCaja!: ElementRef;
  @ViewChild('inpFiltro') inputFiltro!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private LecturaQ2aH4Service: Lecturaq2ah4Service,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource_Mov = new MatTableDataSource();
    this.dataSource_Mov_Sel = new MatTableDataSource();
    this.dataSource_Mov_Bultos = new MatTableDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.showMostrarPendiente();
    this.Cod_Bar_Bul = this.formulario.get('ct_Cod_Bar_Caja')?.value;
    this.formulario.get('ct_Peso').disable();

    // this.formulario.get('x_isChecked')?.valueChanges.subscribe((value) => {
    //   console.log('Checkbox seleccionado:', value);
    // });
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // this.dataSource_Mov_Bultos.paginator = this.paginator;
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

    this.inputFiltro.nativeElement.focus(); // hace focus sobre "myInput"
  }

  onRowClick(row: any) {
    this.selectedRow = row;
    this.isRowBlocked = true; // Bloquear otras filas
  }

  onCheckboxChange(row: any, index: number) {
    //debugger;
    if (!this.selectedRow || this.selectedRow !== row) {
      this.isRowBlocked = false; // Desbloquear filas si se deselecciona
    }
  }

  showMostrarPendiente() {
    this.LecturaQ2aH4Service.showMostrarPendienteQ2H4(
      'A',
      'H4',
      'Q2',
      '',
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.dataSource_Mov.data = result;
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        })
    );

    this.formulario.get('ct_Filtro').setValue('');
  }

  generarMovimientoQ2H4() {

    
    // this.codAlmOrigen = xDato.Cod_Almacen;
    // this.numMovOrigen = xDato.Num_Mov;

    this.LecturaQ2aH4Service.generarMovimientoQ2H4(
      'I',
      'H4',
      this.codAlmOrigen,
      this.numMovOrigen,
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.dataSource_Mov.data = result;
        this.matSnackBar.open('Se registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 });
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        })
    );

    this.formulario.get('ct_Filtro').setValue('');
  }

  deshabilitarScroll() {
    document.body.style.overflow = 'hidden';
  }
  habilitarScroll() {
    document.body.style.overflow = 'auto';
  }

  showMostrarDetalleMov(xDato: any) {
    if (this.filaSeleccionada === xDato) {
      this.filaSeleccionada = null;
      this.tablaBloqueada = false;
      this.habilitarScroll();
    } else {
      this.filaSeleccionada = xDato;
      this.tablaBloqueada = true;
      this.deshabilitarScroll();
    }

    this.codAlmOrigen = xDato.Cod_Almacen;
    this.numMovOrigen = xDato.Num_Mov;

    console.log(xDato.Item);
    this.LecturaQ2aH4Service.showMostrarPendienteQ2H4(
      'B',
      'H4',
      xDato.Cod_Almacen,
      xDato.Num_Mov,
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.dataSource_Mov_Sel.data = result;
        this.inputCodBarCaja.nativeElement.focus();

        // this.dataSource_Mov_Sel.data.forEach(item =>
        //   {
        //     item.checked ===  'true' ?   this.bselect = true :   this.bselect = false;
        //   }
        //   );
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        })
    );

    cantidadGlobal = xDato.Cant_Mov;
    console.log('Cantidad global:' + cantidadGlobal);
  }

  marcarTodos() {
    this.dataSource_Mov_Sel.data.forEach((row) => (row.checked = true));
  }

  desmarcarTodos() {
    this.dataSource_Mov_Sel.data.forEach((row) => (row.checked = false));
  }

  insertarDatosCabeceraDetalleBultos(
    xTipo,
    xCod_OrdProv,
    xCod_Item,
    xCod_Proveedor,
    xCod_Almacen_Origen,
    xNum_Movstk_Origen,
    xCantidad,
    xCod_TipMovi,
    xNum_Corre
  ) {
    this.LecturaQ2aH4Service.guardarCabDetBultos(
      xTipo,
      xCod_OrdProv,
      xCod_Item,
      xCod_Proveedor,
      xCod_Almacen_Origen,
      xNum_Movstk_Origen,
      xCantidad,
      xCod_TipMovi,
      xNum_Corre
    ).subscribe(
      (result: any) => {
        if (result[0].RPTA == 'AG2') {
          this.matSnackBar.open('Se agrego correctamente!', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
          });
        } else if (result[0].RPTA == 'DEL2') {
          this.matSnackBar.open('Se elimino correctamente!', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
          });
        // } else {
        //   this.matSnackBar.open('', 'Cerrar', {
        //     duration: 3000,
        //   });
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar!!!!!!!!', {
          duration: 3000,
        })
    );
  }

  showMostrarDetalleBultos(xDato: any) {
    if (this.filaSeleccionada2 === xDato) {
      this.filaSeleccionada2 = null;
      this.tablaBloqueada2 = false;
     
      contadorGlobal = 0;
      cantidadGlobal = 0;
      this.formulario.get('ct_Peso').setValue('');
      this.dataSource_Mov_Bultos.data = [];

    } else {


      this.filaSeleccionada2 = xDato;
      this.tablaBloqueada2 = true;

      this.insertarDatosCabeceraDetalleBultos(
        'A',
        xDato.Lote,
        xDato.Item,
        xDato.Cod_Prov,
        xDato.Cod_Almacen,
        xDato.Num_Mov,
        xDato.Cant_Mov,
        xDato.Tipo_Mov,
        ''
      );

      console.log(xDato.Item);
      this.LecturaQ2aH4Service.showMostrarPendienteQ2H4(
        'C',
        'H4',
        xDato.Cod_Almacen,
        xDato.Num_Mov,
        xDato.Item,
        xDato.Cod_Prov,
        xDato.Lote
      ).subscribe(
        (result: any) => {

          this.dataSource_Mov_Bultos.data = result;
          this.inputCodBarCaja.nativeElement.focus();

          // if (result[0].RPTA == '1') {
          //   this.dataSource_Mov_Bultos.data = result;
          //   this.inputCodBarCaja.nativeElement.focus();
          // } else if (result[0].RPTA == '0') {
          //   this.matSnackBar.open(result[0].Mensaje, 'Cerrar', {
          //     horizontalPosition: 'center',
          //     verticalPosition: 'top',
          //     duration: 3000,
          //   });
          //}
        },
        (err: HttpErrorResponse) =>
          this.matSnackBar.open(err.message, 'Cerrar!!!!!!!', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          })
      );

    

    }

    //PARA GUARDAR CABECERA DE SELECCION
    this.codAlmOrigen = xDato.Cod_Almacen;
    this.numMovOrigen = xDato.Num_Mov;
    this.tipMovOrigen = xDato.Tipo_Mov;

    cantidadGlobal = xDato.Cant_Mov;
    this.formulario.get('ct_Peso').setValue(cantidadGlobal);
    console.log('Cantidad global:' + cantidadGlobal);


   
  }


obtenerCantidadGlobal()
{
  for (let i = 0; i < this.dataSource_Mov_Bultos.data.length; i++) 
  { 
  //  if (this.dataSource_Mov_Bultos.data[i].checked == true)
   // {
      console.log("Arreglo de bultos "+`${this.dataSource_Mov_Bultos.data[i].checked}`); 
   // }
  }
  
}


  EliminarItemBulto(xDato: data_det_Bult) {
    this.insertarDatosCabeceraDetalleBultos(
      'D',
      xDato.Cod_OrdProv,
      xDato.Cod_item,
      xDato.Cod_Proveedor,
      this.codAlmOrigen,
      this.numMovOrigen,
      xDato.Peso_Neto,
      this.tipMovOrigen,
      xDato.Num_Corre
    );
    let xPeso: number = parseInt(xDato.Peso_Neto);
    this.reducirContadorPor(xPeso);
    this.formulario.get('ct_Peso').setValue(contadorGlobal);
    console.log('La suma de pesos es: ' + contadorGlobal);

    this.LecturaQ2aH4Service.showMostrarPendienteQ2H4(
      'C',
      'H4',
      xDato.Cod_Almacen,
      xDato.Num_MovStk,
      xDato.Cod_item,
      xDato.Cod_Proveedor,
      xDato.Cod_OrdProv
    ).subscribe(
      (result: any) => {
        this.dataSource_Mov_Bultos.data = result;
        this.inputCodBarCaja.nativeElement.focus();
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        })
    );

    
  }



  agregarEliminarItemBulto(xDato: any) {
    if (contadorGlobal >= cantidadGlobal) {
      console.log('Contador Global: ' + contadorGlobal);
      console.log('Cantidad Global: ' + cantidadGlobal);

      this.ejecutarConErrorCantidadGlobal();

    } else {
    
        this.filaSeleccionada3 = xDato;
        xDato.selected = !xDato.selected;
        this.insertarDatosCabeceraDetalleBultos(
          'C',
          xDato.Cod_OrdProv,
          xDato.Cod_item,
          xDato.Cod_Proveedor,
          this.codAlmOrigen,
          this.numMovOrigen,
          xDato.Peso_Neto,
          this.tipMovOrigen,
          xDato.Num_Corre
        );

               //INCFEMENTAR PESOS
               let xPeso: number = parseInt(xDato.Peso_Neto);
               this.incrementarContadorPor(xPeso);
               this.formulario.get('ct_Peso').setValue(contadorGlobal);
               console.log('La suma de pesos es: ' + contadorGlobal);
               //INCFEMENTAR PESOS


      this.LecturaQ2aH4Service.showMostrarPendienteQ2H4(
        'C',
        'H4',
        xDato.Cod_Almacen,
        xDato.Num_MovStk,
        xDato.Cod_item,
        xDato.Cod_Proveedor,
        xDato.Cod_OrdProv
      ).subscribe(
        (result: any) => {
          this.dataSource_Mov_Bultos.data = result;
          this.inputCodBarCaja.nativeElement.focus();
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


  actualiarDetalleBulto()

  {


    
  }

  agregarEliminarItemBultoCheck(xDato: any, event: MatCheckboxChange) {
    if (contadorGlobal >= cantidadGlobal) {
      console.log('Contador Global: ' + contadorGlobal);
      console.log('Cantidad Global: ' + cantidadGlobal);
      this.ejecutarConErrorCantidadGlobal();
    } else {
      const isChecked = event.checked;
      console.log(`Checkbox marcado: ${isChecked}`);
      if (isChecked == false) {
        this.insertarDatosCabeceraDetalleBultos(
          'D',
          xDato.Cod_OrdProv,
          xDato.Cod_item,
          xDato.Cod_Proveedor,
          this.codAlmOrigen,
          this.numMovOrigen,
          xDato.Peso_Neto,
          this.tipMovOrigen,
          xDato.Num_Corre
        );
      } else {
        //INCFEMENTAR PESOS
        let xPeso: number = parseInt(xDato.Peso_Neto);
        this.incrementarContadorPor(xPeso);
        this.formulario.get('ct_Peso').setValue(contadorGlobal);
        console.log('La suma de pesos es: ' + contadorGlobal);
        //INCFEMENTAR PESOS

        this.insertarDatosCabeceraDetalleBultos(
          'C',
          xDato.Cod_OrdProv,
          xDato.Cod_item,
          xDato.Cod_Proveedor,
          this.codAlmOrigen,
          this.numMovOrigen,
          xDato.Peso_Neto,
          this.tipMovOrigen,
          xDato.Num_Corre
        );
      }
    }
  }

  cancelarTodo() {
    this.Limpiar();

    this.insertarDatosCabeceraDetalleBultos('E', '', '', '', '', '', '0', '', '');

    this.router.navigate(['/']);
  }

  onToggle() {
    if (this.formulario.get('ct_Cod_Bar_Caja')?.value.length >= 12) {
      this.Cod_Bar_Bul = this.formulario.get('ct_Cod_Bar_Caja')?.value;

      this.marcarCheckboxPorNombre(this.Cod_Bar_Bul);
      //this.ordenarCheckboxesMarcados();
      this.formulario.get('ct_Cod_Bar_Caja').setValue('');
      this.inputCodBarCaja.nativeElement.focus(); // hace focus sobre "myInput"
    }
  }

  Limpiar() {
    contadorGlobal = 0;
    cantidadGlobal = 0;

    this.formulario.get('ct_Cod_Bar_Caja').setValue('');
    this.formulario.get('ct_Peso').setValue('');

    //this.dataSource_Mov.data = [];
    this.dataSource_Mov_Sel.data = [];
    this.dataSource_Mov_Bultos.data = [];
    this.filaSeleccionada = null;
    this.tablaBloqueada = false;
    this.filaSeleccionada2 = null;
    this.tablaBloqueada2 = false;

    this.inputFiltro.nativeElement.focus(); // hace focus sobre "myInput"

    this.showMostrarPendiente();
  }

  incrementarContador() {
    contadorGlobal++;
    console.log(`Contador incrementado: ${contadorGlobal}`);
  }

  incrementarContadorPor(valor: number) {
    contadorGlobal += valor;
    console.log(`Contador incrementado por ${valor}: ${contadorGlobal}`);
  }

  reducirContadorPor(valor: number) {
    contadorGlobal -= valor;
    console.log(`Contador incrementado por ${valor}: ${contadorGlobal}`);
  }








  marcarCheckboxPorNombre(Num_Corre: string) {
   // debugger
    const fila = this.dataSource_Mov_Bultos.data.find(
      (item) => item.Num_Corre === Num_Corre
    );

    
    if (typeof fila === 'undefined') 
    { 
      this.ejecutarConErrorNoExisteReg();
    }
    else
    {
    if (contadorGlobal >= cantidadGlobal) {
      console.log('Contador Global: ' + contadorGlobal);
      console.log('Cantidad Global: ' + cantidadGlobal);
      this.ejecutarConErrorCantidadGlobal();
    } else {
       if (fila.checked == true) {
         this.ejecutarConError();
       } else {
        this.insertarDatosCabeceraDetalleBultos(
          'C',
          fila.Cod_OrdProv,
          fila.Cod_item,
          fila.Cod_Proveedor,
          this.codAlmOrigen,
          this.numMovOrigen,
          fila.Peso_Neto,
          this.tipMovOrigen,
          fila.Num_Corre
        );



        //INCFEMENTAR PESOS
        let xPeso: number = parseInt(fila.Peso_Neto);
        this.incrementarContadorPor(xPeso);
        this.formulario.get('ct_Peso').setValue(contadorGlobal);
        console.log('La suma de pesos es: ' + contadorGlobal);
        //INCFEMENTAR PESOS


        this.LecturaQ2aH4Service.showMostrarPendienteQ2H4(
          'C',
          'H4',
          fila.Cod_Almacen,
          fila.Num_MovStk,
          fila.Cod_item,
          fila.Cod_Proveedor,
          fila.Cod_OrdProv
        ).subscribe(
          (result: any) => {
            this.dataSource_Mov_Bultos.data = result;
            this.inputCodBarCaja.nativeElement.focus();
          },
          (err: HttpErrorResponse) =>
            this.matSnackBar.open(err.message, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            })
        );
      }
        // if (fila) {
        //   fila.checked = true;
        //   // También puedes marcar el checkbox en el DOM directamente si es necesario
        //   const indice = this.dataSource_Mov_Bultos.data.indexOf(fila);
        //   const checkbox = this.checkboxes.toArray()[indice];
        //   if (checkbox) {
        //     checkbox.checked = true;

        //     console.log(
        //       `Checkbox marcado para ${Num_Corre} en el índice ${indice}`
        //     );
        //   }
        // } else {
        //   console.log(
        //     `No se encontró ningún elemento con el nombre ${Num_Corre}`
        //   );
        // }
      //}
      }
    }
  }

  manejarCambio(row: any, index: number) {
    if (row.unchecked) {
      contadorGlobal -= parseInt(row.Peso_Neto); // Descontar valor cuando se desmarca el checkbox
    } else {
      contadorGlobal += parseInt(row.Peso_Neto); // Sumar valor cuando se marca el checkbox
    }
    this.formulario.get('ct_Peso').setValue(contadorGlobal);
    console.log(`El total actualizado es: ${contadorGlobal}`);
  }

  //   onSubscriberCheck(subscriber: Subscriber, row: any) {
  //     if (subscriber.checked) {
  //       contadorGlobal += parseInt(row.Peso_Neto); // Sumar valor cuando se marca el checkbox
  //     } else {
  //       contadorGlobal -= parseInt(row.Peso_Neto); // Descontar valor cuando se desmarca el checkbox

  //     }
  // }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  ejecutarConError() {
    try {
      // Simulación de error
      throw new Error('El registro ya fue seleccionado!');
    } catch (error) {
      this.mostrarError((error as Error).message);
    }
  }


  ejecutarConErrorNoExisteReg() {
    try {
      // Simulación de error
      throw new Error('El codigo no esta en este movimiento!');
    } catch (error) {
      this.mostrarError((error as Error).message);
    }
  }

  ejecutarConErrorCantidadGlobal() {
    try {
      // Simulación de error
      throw new Error('La cantidad no pueda superar al movimiento origen!');
    } catch (error) {
      this.mostrarError((error as Error).message);
    }
  }

  ordenarCheckboxesMarcados() {
    debugger;
    const checkboxesArray = this.checkboxes.toArray();
    const checkboxesMarcados = checkboxesArray.filter(
      (checkbox) => checkbox.checked
    );

    // Ordenar checkboxesMarcados basado en algún criterio. Ejemplo: alfabéticamente por nombre.
    const datosMarcados = checkboxesMarcados.map((checkbox) => {
      const indice = checkboxesArray.indexOf(checkbox);
      return this.dataSource_Mov_Bultos.data[indice];
    });

    datosMarcados.sort((a, b) => b.Num_Bulto - a.Num_Bulto);

    // Puedes usar datosMarcados como necesites
    console.log(
      'Datos de filas con checkboxes marcados y ordenados:',
      datosMarcados
    );
  }

  Filtro(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_Mov.filter = filterValue.trim().toLowerCase();
  }

  highlight(row) {
    this.dataSource_Mov_Bultos = row.id;
  }
}

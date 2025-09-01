import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  AfterViewInit,
  Directive
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogBuscaclienteComponent } from './dialog-buscacliente/dialog-buscacliente.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LecturarollodespachoService } from 'src/app/services/lecturarollodespacho.service';
import { DialogCargaPrepackingComponent } from './dialog-carga-prepacking/dialog-carga-prepacking.component';
import { DialogDetallePartidaRollosComponent } from './dialog-detalle-partida-rollos/dialog-detalle-partida-rollos.component';
import moment from 'moment';


moment.locale("es");



@Component({
  selector: 'app-lectura-rollo-despacho',
  templateUrl: './lectura-rollo-despacho.component.html',
  styleUrls: ['./lectura-rollo-despacho.component.scss'],
})
export class LecturaRolloDespachoComponent implements OnInit {
  xAbrCliente: '';
  xCodCliente: '';
  xNomCliente: '';
  ImagePath = ''

  formulario = this.formBuilder.group({
    iAbr_Cliente: [''],
    iNom_Cliente: [''],
    iEstado_Lectura: [''],
    iPre_packingTitulo: ['PRE-PACKING N°'],
    iPre_packing: [''],
    iCargado_Pack: [''],
    iPartida_Leida: [''],
    ixRollo_Leido:  [''],
    iTotal:         ['0'],
    iLeidos:        ['0'],
    iFalta_Leer:    ['0'],
  });

  

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private LecturarollodespachoService: LecturarollodespachoService,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private exceljsService: ExceljsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @ViewChild('myinputAbr_Cliente')myinputAbr_Cliente: ElementRef;
  @ViewChild('myinputCodRollo')inputCodRollo!: ElementRef;

  ngOnInit(): void {
    //this.Limpiar();
    this.ImagePath = 'http://192.168.1.36/Estilos/Alertas/Despacho.jpg'
    const hoy = Date.now();
    let xFecha =  moment(hoy).format("D MMMM YYYY");
    //this.myinputAbr_Cliente.nativeElement.focus(); // hace focus sobre "myInput"
    
  }

  ngAfterViewInit() {
    this.myinputAbr_Cliente.nativeElement.focus(); // hace focus sobre "myInput"
  }

  MostrarClientexParametro(Abr, Nombre) {
    this.LecturarollodespachoService.ShowListaClienteDespacho(
      Abr,
      Nombre
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.formulario
            .get('iAbr_Cliente')
            ?.setValue(result[0].Abreviatura_Cliente);
          this.formulario
            .get('iNom_Cliente')
            ?.setValue(result[0].Nombre_Cliente);
          this.xCodCliente = result[0].Codigo_Cliente;
          this.MostrarPrePacking();
        } else {
          this.matSnackBar.open('No existen registros..!!', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
    );
  }

  ReproducirError() {
    const audio = new Audio('assets/error.mp3');
    audio.play();
  }

  ReproducirOk() {
    const audio = new Audio('assets/aceptado.mp3');
    audio.play();
  }


  ReproducirAlerta(Var1, Var2) {

    this.ImagePath = Var1; //'http://192.168.1.36/Estilos/Alertas/Error.jpg'
    this.formulario.get('ixRollo_Leido').setValue('');
    this.myinputAbr_Cliente.nativeElement.focus();    //hace focus sobre "myInput"||
    const audio = new Audio('assets/'+Var2);
    audio.play();

    
  }


  ShowResumenTotales(xxOpcion, xxcod_cliente, xxcod_prepackinglist, xxcod_ordtra) {
    console.log("xxcod_cliente :"+xxcod_cliente);
    console.log("xxcod_prepackinglist :"+xxcod_prepackinglist);
    console.log("xxcod_ordtra :"+xxcod_ordtra);
    this.LecturarollodespachoService.ShowDetallePartida(xxOpcion, xxcod_cliente, xxcod_prepackinglist, xxcod_ordtra ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.formulario.get('iTotal').setValue(result[0].Total_Rollos);
          this.formulario.get('iLeidos').setValue(result[0].Total_Rollos_Lecturados);
          this.formulario.get('iFalta_Leer').setValue(result[0].Total_Rollos_Faltantes);
          // this.dataSource.data = result;
          // this.dataResult = result;
        } else {
          this.matSnackBar.open('No existen registros..!!', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
          
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
    );
  }


  MostrarPrePacking() {
    console.log("cliente prepacking :"+this.xCodCliente);
    let dialogRef = this.dialog.open(DialogCargaPrepackingComponent, {
      disableClose: false,
      minWidth: '85%',
      minHeight: '80%',
      maxHeight: '98%',
      height: '90%',
      panelClass: 'my-class',
      data: {
        Codigo_Cliente: this.xCodCliente,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.inputCodRollo.nativeElement.focus(); // hace focus sobre "myInput"
      //this.keyboard.hide();
    });

    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe((result) => {
        dialogSubmitSubscription.unsubscribe();
        console.log('Prepacking es:' + result);
        this.formulario.get('iPre_packing').setValue(result);

      });

    dialogRef.componentInstance.submitClicked2.subscribe((result) => {
      dialogSubmitSubscription.unsubscribe();
      console.log('iTotal es:' + result);
      this.formulario.get('iTotal').setValue(result);
    });

    dialogRef.componentInstance.submitClicked3.subscribe((result) => {
      dialogSubmitSubscription.unsubscribe();
      console.log('iLeidos es:' + result);
      this.formulario.get('iLeidos').setValue(result);
    });

    dialogRef.componentInstance.submitClicked4.subscribe((result) => {
      dialogSubmitSubscription.unsubscribe();
      console.log('iFalta_Leer es:' + result);
      this.formulario.get('iFalta_Leer').setValue(result);


      this.ShowResumenTotales('0',this.xCodCliente, 
        this.formulario.get('iPre_packing')?.value, 
        this.formulario.get('iPartida_Leida')?.value )


    });


    


  }


  Limpiar() {
    this.formulario.get('iAbr_Cliente').setValue('');
    this.formulario.get('iNom_Cliente').setValue('');
    this.formulario.get('iPre_packing').setValue('');
    this.formulario.get('iCargado_Pack').setValue('');
    this.formulario.get('iPartida_Leida').setValue('');
    this.formulario.get('ixRollo_Leido').setValue('');
    this.formulario.get('iEstado_Lectura')?.setValue('');
    this.formulario.get('iAbr_Cliente').enable();
    this.formulario.get('iNom_Cliente').enable();
    this.xCodCliente = '';
    this.ImagePath = '';
    this.myinputAbr_Cliente.nativeElement.focus(); // hace focus sobre "myInput"
    this.ImagePath = 'http://192.168.1.36/Estilos/Alertas/Despacho.jpg'

  }


  onToggle() {
    if (this.formulario.get('ixRollo_Leido')?.value.length >= 10) {
      this.LecturarRollo();
    }
  }


  LecturarRollo(){
    let xPrePack = this.formulario.get('iPre_packing')?.value;
    let xCodRollo = this.formulario.get('ixRollo_Leido')?.value;
    console.log('xPrePack 1 es: ' + xPrePack);
    console.log('xCodRollo 2 es: ' + xCodRollo);

    this.LecturarollodespachoService.LecturaRolloDespacho(xPrePack, xCodRollo).subscribe(
      (result: any) => {
        if (result.length > 0) {
         
          this.formulario.get('iCargado_Pack')?.setValue(result[0].Codigo_PackingList); 
          this.formulario.get('iPartida_Leida')?.setValue(result[0].Cod_Ordtra); 
          this.formulario.get('iTotal')?.setValue(result[0].Total_Rollos); 
          this.formulario.get('iLeidos')?.setValue(result[0].Total_Rollos_Lecturados); 
          this.formulario.get('iFalta_Leer')?.setValue(result[0].Total_Rollos_Faltantes); 
          this.formulario.get('iEstado_Lectura')?.setValue(result[0].Mensaje);
          this.formulario.get('ixRollo_Leido').setValue('');

          this.ReproducirAlerta(result[0].RutaImagen, result[0].RutaSonido);

          if (result[0].Mensaje == "DESPACHADO" || result[0].Mensaje == "NO PERTENECE AL PACKINGLIST" ||  result[0].Mensaje == "ROLLO LEIDO"  ||  result[0].Mensaje == "NO SE ENCONTRÓ PACKINGLIST" )
           {
            this.ShowResumenTotales('0',this.xCodCliente, 
            this.formulario.get('iPre_packing')?.value, 
            this.formulario.get('iPartida_Leida')?.value )   
           }
           
          console.log("Resultado es: "+ result)
        } else {
          this.Limpiar();
          this.formulario.get('iEstado_Lectura')?.setValue(result[0].Mensaje);

          this.matSnackBar.open('No existen registros..!!', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
        }
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
    );


  }



  BuscarCliente() {
    let xAbrCliente = this.formulario.get('iAbr_Cliente')?.value;
    let xNomCliente = this.formulario.get('iNom_Cliente')?.value;

    console.log('Variable 1 es: ' + xAbrCliente.length);
    console.log('Variable 2 es: ' + xNomCliente.length);

    if (xAbrCliente.length == 0 && xNomCliente.length == 0) {
      let dialogRef = this.dialog.open(DialogBuscaclienteComponent, {
        disableClose: false,
        minWidth: '85%',
        minHeight: '80%',
        maxHeight: '98%',
        height: '90%',
        panelClass: 'my-class',
        data: {
          //datos: data
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.inputCodRollo.nativeElement.focus(); // hace focus sobre "myInput"
      });

      const dialogSubmitSubscription =
        dialogRef.componentInstance.submitClicked.subscribe((result) => {
          dialogSubmitSubscription.unsubscribe();
          console.log('xCodCliente es:' + result);
          this.xCodCliente = result;
          
          
        });

      dialogRef.componentInstance.submitClicked2.subscribe((result) => {
        dialogSubmitSubscription.unsubscribe();
        console.log('iAbr_Cliente es:' + result);
        this.formulario.get('iAbr_Cliente').setValue(result);
        
      });

      dialogRef.componentInstance.submitClicked3.subscribe((result) => {
        dialogSubmitSubscription.unsubscribe();
        console.log('iNom_Cliente es:' + result);
        this.formulario.get('iNom_Cliente').setValue(result);
        this.MostrarPrePacking();
      });

      this.formulario.get('iAbr_Cliente').disable();
      this.formulario.get('iNom_Cliente').disable();
      
    } else {
      let xAbrCliente = this.formulario.get('iAbr_Cliente')?.value;
      let xNomCliente = this.formulario.get('iNom_Cliente')?.value;

      console.log('abre 1 es: ' + xAbrCliente);
      console.log('nombre 1 es: ' + xNomCliente);

      this.MostrarClientexParametro(xAbrCliente, xNomCliente);

      this.formulario.get('iAbr_Cliente').disable();
      this.formulario.get('iNom_Cliente').disable();
      //this.formulario.get('iCargado_Pack').disable();
      //this.formulario.get('iPartida_Leida').disable();
    }
  }




  Funcion_Cancelar() {
    this.router.navigate(['/']);
  }



  VerDetallePartida() {
    let xPrePack = this.formulario.get('iPre_packing')?.value;
    console.log("VerDetallePartida :"+xPrePack);
    console.log("xCodCliente :"+this.xCodCliente);
    console.log("iPartida_Leida :"+this.formulario.get('iPartida_Leida')?.value);
    let dialogRef = this.dialog.open(DialogDetallePartidaRollosComponent, {
      disableClose: false,
      // minWidth: '85%',
      // minHeight: '80%',
      // maxHeight: '98%',
      height: '90%',
      panelClass: 'my-class',
      data: {
        xcod_cliente: this.xCodCliente,
        xcod_prepackinglist: xPrePack,
        xcod_ordtra: this.formulario.get('iPartida_Leida')?.value
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }


  hideKeyboard(element) {
    element.attr('readonly', 'readonly'); // Force keyboard to hide on input field.
    element.attr('disabled', 'true'); // Force keyboard to hide on textarea field.
    setTimeout(function() {
        element.blur();  //actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        element.removeAttr('readonly');
        element.removeAttr('disabled');
    }, 100);
}




  
}

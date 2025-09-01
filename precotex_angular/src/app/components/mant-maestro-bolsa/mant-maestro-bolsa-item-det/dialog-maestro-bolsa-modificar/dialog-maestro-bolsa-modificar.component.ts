import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

import { MatTableDataSource } from '@angular/material/table';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogAgregarTallaComponent } from './dialog-agregar-talla/dialog-agregar-talla.component';
import { MantMaestroBolsaItemDetService } from 'src/app/services/bolsa/mant-maestro-bolsa-item-det.service';

interface data {
  Id_Bolsa: number,
  Id_Bolsa_Det: number,
  Id_Barra: number,
  Cod_OrdPro: string,
  Cod_Present: number,
  Des_Present: string,
  Num_SecOrd: string,
  Cod_Talla: string,
  Cantidad: number
}

@Component({
  selector: 'app-dialog-maestro-bolsa-modificar',
  templateUrl: './dialog-maestro-bolsa-modificar.component.html',
  styleUrls: ['./dialog-maestro-bolsa-modificar.component.scss']
})
export class DialogMaestroBolsaModificarComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu;

  formulario = this.formBuilder.group({
    //-----------NUEVO
    Cod_OrdPro: ['', Validators.required],
    Des_Present: ['', Validators.required],
    Num_SecOrd: [''],
    Cod_Item: ['']
  })

  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [];
  //columnsToDisplay: string[] = this.displayedColumns.slice();
  //clickedRows = new Set<data>();

  Id = 0;
  Id_Det = 0;
  Id_Bolsa = 0;
  Id_Bolsa_Det = 0;
  Id_Barra = 0;
  Cod_OrdPro: string = '';
  listar_color: any = [];
  listar_sec: any = [];
  listar_item: any = [];
  op: string = '';
  Des_Present: string = '';
  Cod_Present: number = 0;
  Cantidad: number = 0;
  Cod_Talla: string = '';
  array: Array<any> = [];
  newArray: Array<any> = [];
  color: 0;
  Sec: '';
  Num_SecOrd: '';
  Cod_Item: '';
  Cant: number = 0;
  visibleFieldItem: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialog_: MatDialogRef<DialogMaestroBolsaModificarComponent>,
    private SpinnerService: NgxSpinnerService,
    private bolsaitemdetService: MantMaestroBolsaItemDetService,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) { this.dataSource = new MatTableDataSource(); }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      if (res != null) {
        this.Id = res['Id'];
        this.Id_Det = res['Id_Det'];
      }
    });
  }

  obtenerTallas($event) {
    this.color = $event.value;
    this.SpinnerService.show();
    this.bolsaitemdetService.obtenerDatos_D(
      'T',
      0,
      0,
      0,
      this.formulario.get('Cod_OrdPro').value,
      $event.value,
      '',
      '',
      0,
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
          this.array = result;
          this.displayedColumns = Object.keys(result[0])
          console.log(this.dataSource.data);
        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  grabarTallas() {
    if(this.formulario.valid){
      /*console.log(
        'Accion: ','I',
        'Id_Bolsa: ',this.Id,
        'Id_Bolsa_Det: ',this.Id_Det,
        'Id_Barra: ',0,
        'Cod_OrdPro',this.formulario.get('Cod_OrdPro').value.toUpperCase(),
        'Cod_Present:',this.color,
        'Cod_Talla: ', 'DEL ARRAY',
        'Num_SecOrd: ',this.formulario.get('Num_SecOrd').value,
        'Cantidad: ', 'DEL ARRAY'
      )*/
      let sec = (this.formulario.get('Num_SecOrd').value) == undefined ? '':this.formulario.get('Num_SecOrd').value;
      let coditem = (this.formulario.get('Cod_Item').value) == undefined ? '':this.formulario.get('Cod_Item').value;

      if(sec != '' && coditem==''){
        this.matSnackBar.open('Ingrese un codigo de item', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }else{
        this.SpinnerService.show();
        console.log("this.newArray")
        console.log(this.newArray)
        this.newArray.forEach(element => {
          this.bolsaitemdetService.obtenerDatos_D(
            'I',
            this.Id,
            this.Id_Det,
            0,
            this.formulario.get('Cod_OrdPro').value.toUpperCase(),
            this.color,
            element.Cod_Talla,
            this.Num_SecOrd,
            element.Cantidad,
            this.formulario.get('Cod_Item').value
          ).subscribe(
            (result: any) => {
              if (result.length > 0 && result[0].Respuesta == 'OK') {
                this.dataSource.data = result;
                this.dialog_.close();
              } else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              }
              this.SpinnerService.hide();
            },
            (err: HttpErrorResponse) => {
              this.SpinnerService.hide();
              this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 1500,
              })
            })
        })
      }


    }else{
      this.matSnackBar.open('Ingrese los campos requeridos', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  grabaryAgregar() {
    //console.log($event.value)
    if(this.formulario.valid){

      let sec = (this.formulario.get('Num_SecOrd').value) == undefined ? '':this.formulario.get('Num_SecOrd').value;
      let coditem = (this.formulario.get('Cod_Item').value) == undefined ? '':this.formulario.get('Cod_Item').value;

      if(sec != '' && coditem==''){
        this.matSnackBar.open('Ingrese un codigo de item', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }else{

        this.SpinnerService.show();
        this.newArray.forEach(element => {
          this.bolsaitemdetService.obtenerDatos_D(
            'I',
            this.Id,
            this.Id_Det,
            0,
            this.formulario.get('Cod_OrdPro').value.toUpperCase(),
            this.color,
            element.Cod_Talla,
            this.Num_SecOrd,
            element.Cantidad,
            this.formulario.get('Cod_Item').value
          ).subscribe(
            (result: any) => {
              this.SpinnerService.hide();
              if (result.length > 0) {
                this.dataSource.data = result;
                this.formulario.patchValue({ Cod_OrdPro: '', Des_Present: '', Num_SecOrd: '', Cod_Item: '' });
                this.newArray = [];
              } else {
                this.matSnackBar.open('Ingrese cantidades!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              }
            },
            (err: HttpErrorResponse) => {
              this.SpinnerService.hide();
              this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 1500,
              })
            })
        })
      }
    }else{
      this.matSnackBar.open('Ingrese los campos requeridos', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  obtenerColor() {
    this.Cod_OrdPro = this.formulario.get('Cod_OrdPro')?.value
    console.log(this.formulario.get('Cod_OrdPro')?.value);
    this.bolsaitemdetService.Cf_Busca_OP_Color(this.Cod_OrdPro).subscribe(
      (result: any) => {
        this.listar_color = result;
      },

      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  }

  obtenerSec($event) {
    this.Cod_OrdPro = this.formulario.get('Cod_OrdPro')?.value
    this.bolsaitemdetService.obtenerPlanilla_OP(
      this.Cod_OrdPro,
      $event.value
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        this.listar_sec = result;
        console.log("secuencia ", this.listar_sec);
        
      },

      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  }

  Secuencia($event) {
    this.Num_SecOrd = $event.value;
    console.log("Secu: ", this.Num_SecOrd)
    if(this.Num_SecOrd == undefined){
      this.visibleFieldItem = false;
    }else{
      let Cod_Fabrica = '001'
      this.SpinnerService.show();
      this.bolsaitemdetService.obtenerItem_OP(
        Cod_Fabrica,
        this.Cod_OrdPro
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          this.listar_item = result;
          console.log("items ", this.listar_item);
          this.visibleFieldItem = true;
        },

        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
      
    }
  }
  
  obItem($event){
    this.Cod_Item = $event.value;
//    console.log(this.Cod_Item)
  }

  agregarCantidad(cod_talla, cantidad) {
    console.log(cod_talla, cantidad)
    if (cod_talla == 'Talla' || cod_talla == 'TOTAL') {

    }
    else {
      let indice = this.newArray.indexOf(this.newArray.find(x => x.Cod_Talla == cod_talla));

      let dialogRef = this.dialog.open(DialogAgregarTallaComponent, {
        disableClose: false,
        data: {
          Cod_Talla: cod_talla,
          Cantidad: cantidad
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        //console.log("pp: ", result)
        var newArray = [];
        if (result && result.Cantidad != '') {
          var cod_talla = result.Cod_Talla;
          //var total = 0;
          this.array.forEach((array) => {

            let valor = array[cod_talla];
            let sumar = 0;
            array[cod_talla] = result.Cantidad;
            if (valor > result.Cantidad) {
              sumar = valor - result.Cantidad;
              array['TOTAL'] = Number(array['TOTAL']) - Number(sumar)
            }

            if (valor < result.Cantidad) {
              sumar = result.Cantidad - valor;
              array['TOTAL'] = Number(array['TOTAL']) + Number(sumar)
            }

            //if (valor == result.Cantidad) {}

            let datos = {
              Cod_Talla: cod_talla,
              Cantidad: result.Cantidad
            }

            if(indice >= 0)
              this.newArray[indice] = datos;
            else
              this.newArray.push(datos);
            
          });
        }

      })
    }
  }
}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit , ElementRef, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadControlGuiaService } from 'src/app/services/seguridad-control-guia.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogVerImgenJabaComponent } from '../../seguridad-control-guia/packing-jaba-guia/historial-pack-jaba/dialog-ver-imagen-jaba/dialog-ver-imagen-jaba.component';
import Integer from '@zxing/library/esm/core/util/Integer';
                                          
interface data {
  Cod_Packing_Jaba: number
}
@Component({
  selector: 'app-dialog-detalle-ingreso-pack',
  templateUrl: './dialog-detalle-ingreso-pack.component.html',
  styleUrls: ['./dialog-detalle-ingreso-pack.component.scss']
})
export class DialogDetalleIngresoPackComponent implements OnInit {
  dataJaba: Array<any> = [];
  @ViewChild('inputFile') inputFile: ElementRef;
  displayedColumns: string[] = [
    'acciones',
    'Codigo_Barra',
    'OK',
    'RL',
    '2RL',
    'RT',
    '2RT',
    'G',
    'OUT',
    'RO'
    
  ];
  codigoPaking: string;
  Flag_Estado: string;
  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(private dialogRef: MatDialogRef<DialogDetalleIngresoPackComponent>,@Inject(MAT_DIALOG_DATA) public data: data, private seguridadControlGuiaService: SeguridadControlGuiaService, private matSnackBar: MatSnackBar, private SpinnerService: NgxSpinnerService, private dialog: MatDialog) {

    this.dataSource = new MatTableDataSource();
   }

  ngOnInit(): void {
    this.getJabas();
  }


  getJabas() {
    this.seguridadControlGuiaService.Lg_Man_Packing_Jaba_Web('O', this.data.Cod_Packing_Jaba, GlobalVariable.vusu, '', GlobalVariable.num_planta, GlobalVariable.vusu, '', '').subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataJaba = result;
          this.dataSource.data = this.dataJaba;
          this.codigoPaking = this.dataJaba[0]['Cod_Packing_Jaba'];
          this.Flag_Estado = this.dataJaba[0]['Flag_Estado'];
          if (this.dataJaba.length > 0) {
            this.dataJaba.forEach(element => {
              element.Opcion = 'P',
              element.Num_Planta = '',             
              element.Num_Planta_Destino = GlobalVariable.num_planta,
              element.Cod_Usuario= GlobalVariable.vusu
            });
          
            this.dataSource.data = this.dataJaba;
  
          }

        } else {
          this.dataJaba = [];
          this.dataSource.data = this.dataJaba;
          this.matSnackBar.open('No se encontraron registros', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

   
  guardarImagen(event, tipo, data) {
 
    var eltipo = '';
    if (tipo == 'guardar') {
      eltipo = 'I';
    } else {
      eltipo = 'U';
    }

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', eltipo);
    formData.append('Id_Paking', this.codigoPaking);
    formData.append('Codigo_Barra', data.Codigo_Barra);       
    formData.append('Foto', event.target.files[0]);
   
    this.SpinnerService.show();
    
    this.seguridadControlGuiaService.cargarJabaImagenes(
      formData
    ).subscribe(
      (result: any) => {
        
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("Se guardo la imagen correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        this.getJabas();
        this.SpinnerService.hide();
    //    this.inputFile.nativeElement.value = '';
      //  this.inputFile2.nativeElement.value = '';

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
       // this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })

  }

  changeRadio(event, Id, valor) {

    if (event.checked) {
   
      this.dataJaba.forEach(element => {

        if (element.Codigo_Barra == Id) {
          if (valor == 'OK') {
            element.OK = 'OK ';
            element.RL = '';
            element['2RL'] = '';
            element['RT'] = '';
            element['2RT'] = '';
            element['G'] = '';
            element['OUT'] = '';
            element['RO'] = ' ';
          }

          if (valor == 'RL') {
            element.RL = 'RL ';
            element.OK = '';
          }

          if (valor == '2RL') {
            element['2RL'] = '2RL';
            element.OK = '';
          }

          if (valor == 'RT') {
            element['RT'] = 'RT ';
            element.OK = '';
          }

          if (valor == '2RT') {
            element['2RT'] = '2RT';
            element.OK = '';
          }

          if (valor == 'G') {
            element['G'] = 'G  ';
            element.OK = '';
          }

          if (valor == 'OUT') {
            element['OUT'] = 'OUT';
            element.OK = '';
          }

          if (valor == 'RO') {
            element['RO'] = 'RO ';
            element.OK = '';
          }

        }

      });
    } else {
  
      this.dataJaba.forEach(element => {
        if (element.Codigo_Barra == Id) {
          if (valor == 'OK') {
            element.OK = '';
          }

          if (valor == 'RL') {
            element.RL = '';
          }

          if (valor == '2RL' || valor == 'RL2') {
            element['2RL'] = '';
          }

          if (valor == 'RT') {
            element['RT'] = '';
          }

          if (valor == '2RT' || valor == 'RT2') {
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
 
  Guardar() {
    this.enviarJabas();
  }

  enviarJabas() {
    
    this.seguridadControlGuiaService.Lg_Man_Packing_Jaba_Web_Post(
      this.dataJaba
    ).subscribe(
      (result: any) => {
        if (result.msg == 'OK') {
          this.dataJaba = [];
          this.dataSource.data = this.dataJaba;    
          this.matSnackBar.open('Se registro correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dialogRef.close();          
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
   
    }
 
    mostrarImagen(data){
    
      const formData = new FormData();
      formData.append('Tipo', 'V');
      formData.append('Id_Paking', this.codigoPaking);
      formData.append('Codigo_Barra', data.Codigo_Barra);  
  
      this.SpinnerService.show();
  
      this.seguridadControlGuiaService.verImagenesJaba(
        formData
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result.length > 0) {
            let dialogRef = this.dialog.open(DialogVerImgenJabaComponent,
              {
                disableClose: true,
                minWidth:'85%',
                minHeight:'80%',
                maxHeight: '98%',
                height: '90%',
                panelClass: 'my-class',
                data: {
                  data: result[0]
                }
              });
          } else {
            this.SpinnerService.hide();
            this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
  
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.dataSource.data = [];
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
    }
 
    closeDialog(){
      this.dialogRef.close();
    }
}

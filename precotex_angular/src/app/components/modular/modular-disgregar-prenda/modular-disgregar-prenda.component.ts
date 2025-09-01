import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { LiquidadorTransitoService } from 'src/app/services/modular/liquidador-transito.service';


interface data_det {
  Ticket:string,
  COD_ORDPRO:string,
  COD_PRESENT:string,
  DES_PRESENT:string,
  COD_TALLA:string,
  PRENDASPAQ:string,
  cod_estcli:string,
  Prendas_Disgregada:string,
  NUM_PAQUETE:string
}

@Component({
  selector: 'app-modular-disgregar-prenda',
  templateUrl: './modular-disgregar-prenda.component.html',
  styleUrls: ['./modular-disgregar-prenda.component.scss']
})
export class ModularDisgregarPrendaComponent implements OnInit {

//flg para dar clase css cuando es reproceso o proceso normal
grid_border = ' border: 1px solid #337ab7;'
background = 'background-color: #2962FF; border: 1px solid #2962FF;'
btn_background = 'background-color: #2962FF; color: #ffffff;'

displayedColumns: string[] = [
  'Ticket',
  'COD_ORDPRO',
  //'COD_PRESENT',
  'DES_PRESENT',
  'COD_TALLA',
  'PRENDASPAQ',
  'Prendas_Disgregada',
  'cod_estcli',
  'NUM_PAQUETE'
];
Ticket: string = '';
dataSource: MatTableDataSource<data_det>;
array:Array<any> = [];
columnsToDisplay: string[] = this.displayedColumns.slice();
constructor(private matSnackBar: MatSnackBar, private SpinnerService: NgxSpinnerService, private liquidadorTransitoService: LiquidadorTransitoService) { 
  this.dataSource = new MatTableDataSource();
}

ngOnInit(): void {
}

changeCantidad(event:any, data_det:data_det){
  console.log(event.target.value);
  var valor = event.target.value;
  console.log(data_det.Prendas_Disgregada)
  if(Number(valor) <= Number(data_det.PRENDASPAQ)){
    if(confirm('Esta seguro(a) de quitar prendas al Paquete')){
      this.liquidadorTransitoService.CF_Modular_Muestra_Ticket_Inspeccion(
        'U',
        this.Ticket,
        valor
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          console.log(result);
          if(result[0].status == 1){
            this.GuardarCabecera();
            this.matSnackBar.open('Se modificó correctamente la cantidad.', 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
          }else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
            verticalPosition:'top'
          });
        })
    }
    
  }else{
    this.GuardarCabecera();
    this.matSnackBar.open('La cantidad no puede ser mayor a la cantidad disponible en el Paquete.', 'Cerrar', {
      duration: 3000,
      verticalPosition:'top'
    });
  }
}

GuardarCabecera() {
  this.dataSource.data = this.array;
  if (this.Ticket != '') {
    this.liquidadorTransitoService.CF_Modular_Muestra_Ticket_Inspeccion(
      'M',
      this.Ticket,
      0
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        if(result[0].status == 1){
          this.dataSource.data = result;
        }else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
            duration: 3000,
            verticalPosition:'top'
          });
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition:'top'
        });
      })
  } else {
    this.matSnackBar.open('Debes ingresar el Ticket por agregar', 'Cerrar', {
      duration: 3000,
      verticalPosition:'top'
    });
  }
}


OpenDeleteConfirmacion(data_det: data_det) {
  this.array = this.array.filter(element => {
    return element.Ticket !== data_det.Ticket
  });

  this.matSnackBar.open('Ticket eliminado correctamente.', 'Cerrar', {
    duration: 3000,
    verticalPosition:'top'
  });
  this.dataSource.data = this.array;
}
}

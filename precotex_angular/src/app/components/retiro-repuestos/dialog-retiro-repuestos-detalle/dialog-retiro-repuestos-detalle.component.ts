import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { RetiroRepuestosService } from 'src/app/services/RetiroRepuestos/retiro-repuestos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { timeout } from 'rxjs';
import { DialogRetiroRepuestosDetalleNuevoComponent } from '../dialog-retiro-repuestos-detalle-nuevo/dialog-retiro-repuestos-detalle-nuevo.component';
import { DialogRetiroRepuestosComponent } from '../dialog-retiro-repuestos/dialog-retiro-repuestos/dialog-retiro-repuestos.component';

interface data_det{
    num_requerimiento: number,
    nro_secuencia: number,
    cod_item: string,
    des_item: string,
    can_requerida: number,
    cod_unimed: string,
    rpt_cambio: string,
    itm_foto: string
}

interface data {
  Title       : string;
  num_requerimiento: number
}

@Component({
  selector: 'app-dialog-retiro-repuestos-detalle',
  templateUrl: './dialog-retiro-repuestos-detalle.component.html',
  styleUrls: ['./dialog-retiro-repuestos-detalle.component.scss']
})
export class DialogRetiroRepuestosDetalleComponent implements OnInit {


  formulario = this.formBuilder.group({
    Num_Requerimiento: ['']
  });

  constructor(
            private dialog: MatDialog,
            private formBuilder       : FormBuilder,
            private matSnackBar       : MatSnackBar,
            private serviceRetiro     : RetiroRepuestosService,
            private datePipe          : DatePipe,
            private SpinnerService    : NgxSpinnerService,
            private toastr            : ToastrService,
            @Inject(MAT_DIALOG_DATA) public data: data,
            public dialogRef: MatDialogRef<DialogRetiroRepuestosComponent>
             
  ) { }

  ngOnInit(): void {
      // console.log('init',this.data.num_requerimiento);
      this.onGetDetalleRequerimiento(this.data.num_requerimiento);
  }

  displayedColumns: string[] = [
    'nro_secuencia',
    'cod_item',
    'des_item',
    'can_requerida',
    'cod_unimed',
    'rpt_cambio',
    'itm_foto',
    'editar'
  ];

  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataListadoRequerimientoDetalle: Array<any> = [];

  onGetDetalleRequerimiento(nNum_Requerimiento){
    //const nNum_Requerimiento: number = 1;
    if(nNum_Requerimiento == 0){
      this.matSnackBar.open("No existe numero de requerimiento", "Cerrar",
        {horizontalPosition:'center', verticalPosition:'top', duration:1500}
      );
      return;
    }
    this.SpinnerService.show();
    this.dataListadoRequerimientoDetalle = [];
    this.serviceRetiro.getDetalleRequerimiento(nNum_Requerimiento).subscribe({
      next: (Response: any) => {
        //console.log(Response);
        if(Response.success){
          //console.log(Response.totalElements);
          if(Response.totalElements > 0){
            this.dataListadoRequerimientoDetalle = Response.elements;
            this.dataSource.data = this.dataListadoRequerimientoDetalle;
            //this.dataSource.sort = this.sort;
            this.SpinnerService.hide();

          }else{
            this.dataListadoRequerimientoDetalle = [];
            this.dataSource.data = [];
            this.SpinnerService.hide();
          }
        }else{
          this.dataListadoRequerimientoDetalle = [];
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    })
  }

  onCreateRequerimientoDetalle(){
    let num_req = this.data.num_requerimiento;
    //let secuencia = objeto.secuencia;

    let dialogRef = this.dialog.open(DialogRetiroRepuestosDetalleNuevoComponent,{
      width:'1500px',
      height: '600px',
      disableClose: true,
      panelClass: 'my-class',
      data:{
        Title: "Nuevo",  
        Accion: "Insertar",
        num_requerimiento: num_req,
        //secuencia: secuencia
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.onGetDetalleRequerimiento(this.data.num_requerimiento)
    });
  }

  onEdit(objeto: any){
    let num_req = objeto.num_Requerimiento;
    let num_sec= objeto.nro_Secuencia;
    let cod_Item = objeto.cod_Item;

    let dialogRef = this.dialog.open(DialogRetiroRepuestosDetalleNuevoComponent,{
      width:'500px',
      disableClose: true,
      panelClass: 'my-class',
      data:{
        Title: "Editar",
        Accion: "Editar",
        num_requerimiento: num_req,
        nro_secuencia: num_sec,
        cod_Item: cod_Item,
        
      }
    });
    dialogRef.afterClosed().subscribe(Result=>{
      this.onGetDetalleRequerimiento(this.data.num_requerimiento)
    });
  }

}

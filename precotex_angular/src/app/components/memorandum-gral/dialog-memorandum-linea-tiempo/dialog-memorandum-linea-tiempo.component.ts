import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';

interface data {
  Title       : string;
  Datos       : any   ;
}

interface dataDetalle {
      //Id_Memorandum_Detalle: number,
      nombre_Estado: string,
      orden: number,
      estado_Flujo: string,
}

@Component({
  selector: 'app-dialog-memorandum-linea-tiempo',
  templateUrl: './dialog-memorandum-linea-tiempo.component.html',
  styleUrls: ['./dialog-memorandum-linea-tiempo.component.scss']
})
export class DialogMemorandumLineaTiempoComponent implements OnInit {

  formulario = this.formBuilder.group({
  });    

  constructor(
    private formBuilder       : FormBuilder                     ,
    private serviceMemorandum : MemorandumGralService           ,
    private SpinnerService    : NgxSpinnerService               ,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
  ) { }

  ngOnInit(): void {
    this.getObtieneLineaTiempo(String(this.data.Datos.num_Memo));
  }

  //Estructura Tabla Detalle 
  displayedColumns: string[] = [
    'nombre_Estado'          , 
    'estado_Flujo'
  ];
  dataSource: MatTableDataSource<dataDetalle> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataLineaTiempoMemorandums: Array<any> = [];   


  getObtieneLineaTiempo(sNumMemo: string){
    this.SpinnerService.show();
    this.dataLineaTiempoMemorandums = [];

    this.serviceMemorandum.getObtieneLineaTempoMemorandum(sNumMemo).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              console.log('onHistorialMovimientoMemo',response.elements);
              this.dataLineaTiempoMemorandums = response.elements;
              this.dataSource.data = this.dataLineaTiempoMemorandums;
              this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
          };
        }
      },  
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }          
    });  
  }

}

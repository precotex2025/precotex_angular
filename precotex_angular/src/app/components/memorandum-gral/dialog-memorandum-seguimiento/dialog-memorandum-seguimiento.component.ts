import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

interface data {
  Title       : string;
  num_Memo       : string   ;
}

interface dataDetalle {
  num_Memo	        : string,
  fechaMovimiento	  : string,
  cod_Usuario	      :string,
  nombreUsuario	    :string,
  cod_Estado_Memo	  :string,
  estadoDescripcion	:string,
  observaciones	    :string 
}

@Component({
  selector: 'app-dialog-memorandum-seguimiento',
  templateUrl: './dialog-memorandum-seguimiento.component.html',
  styleUrls: ['./dialog-memorandum-seguimiento.component.scss']
})
export class DialogMemorandumSeguimientoComponent implements OnInit {

  formulario = this.formBuilder.group({
  });    

  dataDetalles  : dataDetalle[] = [];

  constructor(
    private formBuilder       : FormBuilder                     ,
    private serviceMemorandum : MemorandumGralService           ,
    private SpinnerService    : NgxSpinnerService               ,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
  ) { }

  ngOnInit(): void {
    
    console.log('this.data.Datos', this.data.num_Memo);
    this.onHistorialMovimientoMemo(String(this.data.num_Memo));
  }

  //Estructura Tabla Historial 
  displayedColumns: string[] = [
    // 'num_Memo'          , 
    'fechaMovimiento'     ,
    //'cod_Usuario'        ,
    'nombreUsuario'          ,
    //'cod_Estado_Memo'   ,
    'estadoDescripcion',
    'observaciones'     
  ];
  dataSource: MatTableDataSource<dataDetalle> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();  

  onHistorialMovimientoMemo(sNumMemo: string){
    this.SpinnerService.show();
    this.dataDetalles = [];

    this.serviceMemorandum.getHistorialMovimientoMemorandum(sNumMemo).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              console.log('onHistorialMovimientoMemo',response.elements);
              this.dataDetalles = response.elements;
              this.dataSource.data = this.dataDetalles;

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

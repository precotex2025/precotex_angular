import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GlobalVariable } from '../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaHojaMedidaService} from 'src/app/services/auditoria-hoja-medida.service'
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

interface data {
  Id_Registro?: number;
  Des_TipMedida?: string
  Sec_Medida?: string
  Des_Medida?: string
  Tip_Proceso?: string
  Num_Medida?: string
  Orden?: string
  Valor?: string
  Val_Medida?: number;
  Flg_Estado?: string;
}

interface data_det {
  Cod_Medida: number;
  Des_Medida: string;
  Val_Medida: string;
}

@Component({
  selector: 'app-dialog-encogimiento-prenda-medidas',
  templateUrl: './dialog-encogimiento-prenda-medidas.component.html',
  styleUrls: ['./dialog-encogimiento-prenda-medidas.component.scss']
})
export class DialogEncogimientoPrendaMedidasComponent implements OnInit {

  Menos: string = ''
  displayedColumns: string[] = ['Tallas']
  dataSource: MatTableDataSource<data_det>;

  constructor(
    public dialogRef: MatDialogRef<DialogEncogimientoPrendaMedidasComponent>,
    private matSnackBar: MatSnackBar, 
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.dataSource.data = GlobalVariable.Arr_Medidas
  }

  selectMedida(medida: string, valor: number){
    if(medida == 'Eliminar'){
      medida = ''
    }

    if(medida == '-'){
      this.Menos = medida
    }else{
      if(this.Menos == '-'){
        medida = medida.replace('+','-');
        valor = valor * -1;
      } else
        valor = valor * 1;

      if(this.data.Tip_Proceso != ''){
        const formData = new FormData();
        formData.append('Accion', 'I');
        formData.append('Id_Registro', this.data.Id_Registro.toString());
        formData.append('Sec_Medida', this.data.Sec_Medida);
        formData.append('Tip_Proceso', this.data.Tip_Proceso);
        formData.append('Num_Medida', this.data.Num_Medida);
        formData.append('Valor', medida);
        formData.append('Cod_Usuario', GlobalVariable.vusu);

        this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProcesoDetalle(formData)
          .subscribe((result: any) => {

            //if(this.data.Flg_Estado == '0')
            //  this.actualizaEstado();

            this.matSnackBar.open("Proceso Correcto..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        );
      }
      else{
        this.matSnackBar.open("Talla vacia..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }

      this.dialogRef.close({data:medida, valor:valor, estado:"P"});
      this.Menos = '';
    }
  }

  actualizaEstado(){
    const formData = new FormData();
    formData.append('Accion', 'F');
    formData.append('Id_Registro', this.data.Id_Registro.toString());
    formData.append('Cod_OrdPro', '');
    formData.append('Cod_ColCli', '');
    formData.append('Cod_Modulo', '');
    formData.append('Sec', '0');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_Estado', '1');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('F', this.data.Id_Hoja_Medida, '', '', '', '', '', '1', '', '')
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
    .subscribe((result: any) => {
      if (result[0].Respuesta == 'OK') {
        this.matSnackBar.open('Proceso correcto..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      } else {
        this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    });
  }


}

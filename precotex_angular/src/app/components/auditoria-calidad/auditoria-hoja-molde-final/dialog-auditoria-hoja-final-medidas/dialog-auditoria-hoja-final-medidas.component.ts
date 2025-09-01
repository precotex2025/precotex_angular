import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GlobalVariable } from '../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaHojaMedidaService} from 'src/app/services/auditoria-hoja-medida.service'
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

interface data {
  Id_Hoja_Medida?: number;
  Des_TipMedida?: string
  Sec_Medida?: string
  Des_Medida?: string
  Cod_Talla?: string
  Num_Medida?: string
  Orden?: string
  Valor?: string
  Flg_Estado?: string;
}

interface data_det {
  Cod_Medida: number;
  Des_Medida: string;
}

@Component({
  selector: 'app-dialog-auditoria-hoja-final-medidas',
  templateUrl: './dialog-auditoria-hoja-final-medidas.component.html',
  styleUrls: ['./dialog-auditoria-hoja-final-medidas.component.scss']
})
export class DialogAuditoriaHojaFinalMedidasComponent implements OnInit {

  Menos: string = ''
  displayedColumns: string[] = ['Tallas']
  dataSource: MatTableDataSource<data_det>;

  constructor(
    public dialogRef: MatDialogRef<DialogAuditoriaHojaFinalMedidasComponent>,
    private matSnackBar: MatSnackBar, 
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.dataSource.data = GlobalVariable.Arr_Medidas
  }

  selectMedida(medida: string){
    let CodTalla: string;
    let NumMedida: string;

    if(medida == 'Eliminar'){
      medida = ''
    }

    if(medida == '-'){
      this.Menos = medida
    }else{
      if(this.Menos == '-')
        medida = medida.replace('+','-');

      CodTalla = this.data.Cod_Talla.substring(0, this.data.Cod_Talla.length - 1);
      NumMedida = this.data.Cod_Talla.charAt(this.data.Cod_Talla.length - 1);
      
      if(CodTalla != ''){
        const formData = new FormData();
        formData.append('Accion', 'I');
        formData.append('Id_Hoja_Medida', this.data.Id_Hoja_Medida.toString());
        formData.append('Des_TipMedida', this.data.Des_TipMedida);
        formData.append('Sec_Medida', this.data.Sec_Medida);
        formData.append('Cod_Talla', CodTalla);
        formData.append('Num_Medida', NumMedida);
        formData.append('Valor', medida);
        formData.append('Cod_Usuario', GlobalVariable.vusu);

        this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaFinalMoldesDetalle(formData)
          .subscribe((result: any) => {
            if(this.data.Flg_Estado == '0')
              this.actualizaEstado();

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

      this.dialogRef.close({data:medida});
      this.Menos = '';
    }
  }

  actualizaEstado(){
    const formData = new FormData();
    formData.append('Accion', 'F');
    formData.append('Id_Hoja_Medida', this.data.Id_Hoja_Medida.toString());
    formData.append('Cod_OrdPro', '');
    formData.append('Cod_ColCli', '');
    formData.append('Sec', '0');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_Estado', '1');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);
    
    //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaFinalMoldes('F', this.data.Id_Hoja_Medida, '', '', '', '', '1', '', '')
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaFinalMoldes(formData)
      .subscribe((result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Proceso correcto..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }
    );
  }

}

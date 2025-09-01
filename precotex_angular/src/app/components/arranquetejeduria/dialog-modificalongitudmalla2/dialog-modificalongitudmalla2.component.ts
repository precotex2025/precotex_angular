import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef,  Inject,} from '@angular/core';
import { FormBuilder, FormControl, FormControlName,  FormGroup,} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';
import { GlobalVariable } from '../../../VarGlobals';

interface data {
  Tipo: string;
  Cod_Ordtra: string;
  Cod_HilTel: string;
  Cod_Maquina_Tejeduria: string;
  Num_Secuencia_OrdTra: string;
  Long_Malla: string;
  Long_Malla_Real: string;

}

@Component({
  selector: 'app-dialog-modificalongitudmalla2',
  templateUrl: './dialog-modificalongitudmalla2.component.html',
  styleUrls: ['./dialog-modificalongitudmalla2.component.scss']
})
export class DialogModificalongitudmalla2Component implements OnInit {


  Cod_Ordtra = this.data.Cod_Ordtra;
  Cod_HilTel = this.data.Cod_HilTel;
  Cod_Maquina_Tejeduria = this.data.Cod_Maquina_Tejeduria;
  Num_Secuencia_OrdTra = this.data.Num_Secuencia_OrdTra;
  Long_Malla = this.data.Long_Malla;
  Long_Malla_Real = this.data.Long_Malla_Real;
  xLongitud_Real='';
  xMensaje='';
  xCod_Usuario = '';

  formulario = this.formBuilder.group({
    Longitud_Real: ['0'],
  });


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog: MatDialog,
    private arranquetejeduria: ArranquetejeduriaService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogModificalongitudmalla2Component>
    ) {}


    validateFormat(event) {
      let key;
      if (event.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
      } else {
        key = event.keyCode;
        key = String.fromCharCode(key);
      }
      const regex = /[0-9]|\./;
      if (!regex.test(key)) {
        event.returnValue = false;
        if (event.preventDefault) {
          event.preventDefault();
        }
      }
    }

    

  ngOnInit(): void {
    console.log('OT: ' + this.Cod_Ordtra);
    console.log('COD_HILADO: ' + this.data.Cod_HilTel);
    console.log('COD_MAQU: ' + this.data.Cod_Maquina_Tejeduria);
    console.log('NUM_SEC: ' + this.data.Num_Secuencia_OrdTra);
    
    this.xMensaje = 'Se actualizo correctamente';
    this.xCod_Usuario = GlobalVariable.vusu;
    this.formulario.get('Longitud_Real')?.setValue(this.Long_Malla_Real);

  }


  GuardarLongitudReal() {
    this.xLongitud_Real = this.formulario.get('Longitud_Real')?.value;
      const formData = new FormData();
      formData.append('Accion', 'I');
      formData.append('Cod_Ordtra', this.Cod_Ordtra);
      formData.append('Cod_Maquina_Tejeduria', this.Cod_Maquina_Tejeduria);
      formData.append('Num_Secuencia_OrdTra', this.Num_Secuencia_OrdTra);
      formData.append('Cod_HilTel', this.Cod_HilTel);
      formData.append('Long_Malla', this.Long_Malla);
      formData.append('Longitud_Real', this.xLongitud_Real);
      formData.append('Cod_Usuario', this.xCod_Usuario);

      this.arranquetejeduria.GuardarLongitudMallaReal(formData).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open(this.xMensaje, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
            this.dialogRef.close();
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
        }
      );
  }




  

}

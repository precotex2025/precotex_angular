import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckListService } from 'src/app/services/check-list.service';

interface Investigacion {
  cod_ordpro: string;
  Cod_Cliente: string;
  cod_estpro: string;
  Cod_Present: string;
  Des_Present: string;
  cod_estcli: string;
  Cod_TemCli: string;
  Nom_TemCli: string;
  cod_destino: string;
  Des_Destino: string;
  Flg_Estado: string;
  
}

@Component({
  selector: 'app-dialog-aprob-rech-op',
  templateUrl: './dialog-aprob-rech-op.component.html',
  styleUrls: ['./dialog-aprob-rech-op.component.scss']
})
export class DialogAprobRechOpComponent implements OnInit {

  displayedColumns: string[] = [
    'Flg_Estado',
    'cod_ordpro',
    'Des_Present',
    'Destino',
    'Estado'
  ];

  dataSource: MatTableDataSource<Investigacion>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataModificada: Array<Investigacion> = [];
  mostrar:boolean = true;
  buscar: string = '';
  dataCheck: Array<Investigacion> = [];
  dataModificadaCheck: Array<Investigacion> = [];
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private checkListService: CheckListService,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialogRef<DialogAprobRechOpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<Investigacion>) {

    this.dataSource = new MatTableDataSource();

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    console.log(this.data)
    this.dataModificada = this.data;
    this.dataSource.data = this.data;
  }

  seleccionarTodos() {
    this.mostrar = false;
    if (this.buscar == '' || this.buscar != '') {
      this.dataModificada.forEach(ele => {
        ele.Flg_Estado = '1'
      });
      this.dataSource.data = [];
      this.dataSource.data = this.dataModificada;
    } else {

    }
  }

  deseleccionarTodos() {
    this.mostrar = true;
    this.data.forEach(ele => {
      ele.Flg_Estado = null
    });
    this.dataSource.data = [];
    this.dataSource.data = this.data;
  }

  aprobarOP(){
    if(this.dataCheck.length > 0 && this.mostrar){
      this.spinnerService.show();
      this.checkListService.insertarOPAprobacion(
        this.dataCheck
      ).subscribe(res => {
        
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.dialog.close();
          this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al actualizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }else{
      if(this.mostrar == false){

        this.spinnerService.show();
        this.checkListService.insertarOPAprobacion(
          this.dataModificada
        ).subscribe(res => {
          
          this.spinnerService.hide();
          if (res[0].Respuesta == 'OK') {
            this.dialog.close();
            this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open('Ha ocurrido un error al actualizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        }, (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        });
      }else{
        console.log(this.dataModificadaCheck);
        this.dataModificadaCheck.forEach(ele => {
          ele.Flg_Estado = '1'
        });
        this.spinnerService.show();
        this.checkListService.insertarOPAprobacion(
          this.dataModificadaCheck
        ).subscribe(res => {
          
          this.spinnerService.hide();
          if (res[0].Respuesta == 'OK') {
            this.dialog.close();
            this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open('Ha ocurrido un error al actualizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        }, (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        });
      }
    }
  }

  rechazarOP(){
    if(this.dataCheck.length > 0 && this.mostrar){
      this.spinnerService.show();
      this.dataCheck.forEach(ele => {
        ele.Flg_Estado = '0'
      });
      this.checkListService.insertarOPAprobacion(
        this.dataCheck
      ).subscribe(res => {
        
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.dialog.close();
          this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al actualizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }else{
      if(this.mostrar == false){
        this.dataModificada.forEach(ele => {
          ele.Flg_Estado = '0'
        });
        this.spinnerService.show();
        this.checkListService.insertarOPAprobacion(
          this.dataModificada
        ).subscribe(res => {
          
          this.spinnerService.hide();
          if (res[0].Respuesta == 'OK') {
            this.dialog.close();
            this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open('Ha ocurrido un error al actualizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        }, (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        });
      }else{
        console.log(this.dataModificadaCheck);
        this.dataModificadaCheck.forEach(ele => {
          ele.Flg_Estado = '0'
        });
        this.spinnerService.show();
        this.checkListService.insertarOPAprobacion(
          this.dataModificadaCheck
        ).subscribe(res => {
          
          this.spinnerService.hide();
          if (res[0].Respuesta == 'OK') {
            this.dialog.close();
            this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open('Ha ocurrido un error al actualizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        }, (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        });
      }
    }
  }

  changeCheck(event, data_det:Investigacion){ 

    if(event.target.checked == true){
      data_det.Flg_Estado = '1';
      this.dataCheck.push(data_det);
    }else{
      if(this.dataCheck.length > 0){
        this.dataCheck = this.dataCheck.filter(ele => {
          return ele.cod_ordpro !== data_det.cod_ordpro && ele.Cod_Present == data_det.Cod_Present
        });
      }else{
        if(this.dataModificadaCheck.length == 0){
          this.dataModificadaCheck = this.dataModificada.filter(ele => {
            return ele.cod_ordpro !== data_det.cod_ordpro
          });
        }else{
          this.dataModificadaCheck = this.dataModificadaCheck.filter(ele => {
            return ele.cod_ordpro !== data_det.cod_ordpro
          });
        }

        console.log(this.dataModificadaCheck);
      }
      
    }
  }
}

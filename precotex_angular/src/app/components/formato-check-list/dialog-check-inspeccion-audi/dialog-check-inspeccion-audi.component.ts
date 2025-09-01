import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckListService } from 'src/app/services/check-list.service';

@Component({
  selector: 'app-dialog-check-inspeccion-audi',
  templateUrl: './dialog-check-inspeccion-audi.component.html',
  styleUrls: ['./dialog-check-inspeccion-audi.component.scss']
})
export class DialogCheckInspeccionAudiComponent implements OnInit {

  constructor(
    private matSnackBar: MatSnackBar,
    private checkListService: CheckListService,
    private elementRef: ElementRef,
    private spinnerService: NgxSpinnerService,
   @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
  }


  RegistrarCabecera(){
    this.checkListService.CF_CHECK_CREAR_TICKET_AUDITORIA(
      'I',
      this.data.Cod_OrdPro,
      this.data.Des_Present,
      this.data.Cod_Talla,
      this.data.Cantidad,
      this.data.Cantidad_Auditoria,
      this.data.Cod_Usuario,
      this.data.Id_CheckList,
      this.data.Ticket,
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se guardo el registro correctamente', 'Cerrar', { duration: 1500})
          // this.formulario.disable();
          
          //this.flg_btn_cabecera = true;
        }else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500})
        }

      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }
}

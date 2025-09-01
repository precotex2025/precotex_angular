import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MantMaestroBolsaService } from 'src/app/services/mant-maestro-bolsa.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  Proceso_Origen: String,
  Proceso_Destino: String,
  Barra: String
}


@Component({
  selector: 'app-mant-lectura-ticket',
  templateUrl: './mant-lectura-ticket.component.html',
  styleUrls: ['./mant-lectura-ticket.component.scss']
})
export class MantLecturaTicketComponent implements OnInit {

  Flg_Habilitar_btn_Finalizar = true;
  flgInfoJabVisible: boolean = false;
  dataItemsJaba:any = [];
  lc_Mensaje: string = "";

  formulario = this.formBuilder.group({
    //-----------NUEVO
    Proceso_Origen: ['', Validators.required],
    Proceso_Destino: ['', Validators.required],
    Barra: ['', Validators.required]
  })

  //listar_origen: Proceso_Origen[] = [];
  //listar_destino: Proceso_Destino[] = [];
  dataProcesos:Array<any> = [];
  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private bolsaService: MantMaestroBolsaService
  ) { }

  ngOnInit(): void {
    this.getProcesos();
  }


  getProcesos() {
    this.dataProcesos = [];
    this.SpinnerService.show();
      this.Flg_Habilitar_btn_Finalizar = false;
      this.bolsaService.obtenerDatosProcesos(
        'A',''
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          this.dataProcesos = result;
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })

  }

  generaMovimiento(){
    
    if(this.formulario.valid){
      this.SpinnerService.show();
      let codbarra = this.formulario.get('Barra').value
      if (codbarra.length >= 8 ) {

        console.log(
          'I',
          this.formulario.get('Proceso_Origen').value, 
          this.formulario.get('Proceso_Destino').value, 
          this.formulario.get('Barra').value
        )
        
        this.getInfoJaba()
        this.bolsaService.movimientoProcesoWeb(
          'I',
          this.formulario.get('Proceso_Origen').value, 
          this.formulario.get('Proceso_Destino').value, 
          this.formulario.get('Barra').value
        ).subscribe(
          (result: any) => {
            this.SpinnerService.hide();
            if(result == false){
              this.lc_Mensaje = "No hay stock de almacen, revisar";
              this.matSnackBar.open('No hay stock de almacen, revisar', 'Cerrar', {
                duration: 2000,
              })
            }else{

              if(result[0].Respuesta == 'OK'){
                this.lc_Mensaje = "Se realizo el movimiento correctamente: " + codbarra;
                this.matSnackBar.open('Se realizo el movimiento correctamente: ' + codbarra, 'Cerrar', {
                  duration: 2000,
                })
                //this.formulario.reset();
                this.formulario.controls['Barra'].setValue('')
              }else{
                this.lc_Mensaje = result[0].Respuesta;
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                  duration: 2000,
                })
                //this.formulario.reset();
                this.formulario.controls['Barra'].setValue('')
              }

            }
            
            
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.lc_Mensaje = err.message;
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 2000,
            })
          })

      }

    }else{
      
    }
    
  }

  getInfoJaba(){

    this.dataItemsJaba = [];
    let barra = this.formulario.get('Barra').value
    this.SpinnerService.show();
      this.bolsaService.obtenerDatosProcesos(
        'B',barra
      ).subscribe(
        (result: any) => {
          console.log(result)          
          this.flgInfoJabVisible = true
          this.dataItemsJaba = result;
          this.SpinnerService.hide();
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })

  }
  
}

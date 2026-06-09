import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeguimientoSaldoHiloService } from 'src/app/services/tejeduria/seguimiento-saldo-hilo.service';
import { SaldoHiloTelaProgramadaComponent } from './saldo-hilo-tela-programada/saldo-hilo-tela-programada.component';

interface data_det {
  cod_Maquina   : string,
  ot            : string,
  lote          : string,
  fibra         : string,
  titulo        : string,
  fec_Termino   : string,
  cod_Hilado    : string,
  articulo      : number,

}

@Component({
  selector: 'app-saldo-hilo-tela',
  templateUrl: './saldo-hilo-tela.component.html',
  styleUrls: ['./saldo-hilo-tela.component.scss']
})
export class SaldoHiloTelaComponent implements OnInit {

  displayedColumns: string[] = ['opciones', 'cod_Maquina', 'ot', 'lote', 'fibra', 'titulo', 'fec_Termino'];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();

  constructor(
     private formBuilder          : FormBuilder,
     private dialog               : MatDialog  ,
     private serviceSaldoHiloTela : SeguimientoSaldoHiloService,
     private SpinnerService       : NgxSpinnerService ,
  ) { }

  ngOnInit(): void {
    this.onLoadOTTerminadas('N');
  }

  formulario = this.formBuilder.group({
    fecha     : [new Date()],
    pendiente : [false],
  });  

  onLoadOTTerminadas(valorPendiente: string){
    const valorFecha: Date = this.formulario.get('fecha')?.value;
    //const valorPendiente = this.formulario.get('pendiente')?.value;
    //const valor: string = valorPendiente ? 'N' : 'S';

    this.dataSource.data = [];
    this.SpinnerService.show();
    this.serviceSaldoHiloTela.getListaOT_Terminada(valorFecha, valorPendiente).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataSource.data = response.elements;

            this.SpinnerService.hide();
          }
          else{
            this.dataSource.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataSource.data = [];
        }
      },  
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }         
    })

  }

  onEspecificacion(data: any){
      const esMovil = window.innerWidth < 768; 
      let dialogRef = this.dialog.open(SaldoHiloTelaProgramadaComponent, {
      width: esMovil ? '100%' : '700px',
      height: esMovil ? '100%' : '',
      maxHeight: esMovil ? '100vh' : '90vh',
      maxWidth: esMovil ? '100vh' : '90vh',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Datos  : data
       }
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.onGetMemorandums();
    });    
  }

  chgPendiente(event: any){
    if (event.checked) {
      this.onLoadOTTerminadas('S');
    } else {
      this.onLoadOTTerminadas('N');
    }        
  }

  onFechaChange(event: any) {
    const valorPendiente = this.formulario.get('pendiente')?.value;
    const nuevaFecha: Date = event.value;

    this.dataSource.data = [];
    this.SpinnerService.show();
    this.serviceSaldoHiloTela.getListaOT_Terminada(nuevaFecha, valorPendiente).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataSource.data = response.elements;

            this.SpinnerService.hide();
          }
          else{
            this.dataSource.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataSource.data = [];
        }
      },  
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }         
    })    
    



  }  



}

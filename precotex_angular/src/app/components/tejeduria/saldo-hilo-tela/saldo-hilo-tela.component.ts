import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  range = new FormGroup({
      start : new FormControl(new Date()),
      end   : new FormControl(new Date()),
  });     

  displayedColumns: string[] = ['opciones', 'cod_Maquina', 'ot', 'lote', 'fibra', 'titulo', 'fec_Termino'];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();

  constructor(
     private formBuilder          : FormBuilder,
     private dialog               : MatDialog  ,
     private serviceSaldoHiloTela : SeguimientoSaldoHiloService,
     private SpinnerService       : NgxSpinnerService ,
  ) { }

  ngOnInit(): void {

    this.range.valueChanges.subscribe(val => {
      if (val.start && val.end) {
        this.onDateRangeSelected(val.start, val.end);
      }
    });

    //this.onLoadOTTerminadas('N');

    this.onDateRangeSelected(this.range.value.start, this.range.value.end);    
  }

  formulario = this.formBuilder.group({
    //fecha     : [new Date()],
    pendiente : [false]
  });  

  onLoadOTTerminadas(start: Date, end: Date, valorPendiente: string){
    //const valorFecha: Date = this.formulario.get('fecha')?.value;
    //const valorPendiente = this.formulario.get('pendiente')?.value;
    //const valor: string = valorPendiente ? 'N' : 'S';

    //const sFecIni       : string =  this.range.get('start').value ;
    //const sFecFin       : string =  this.range.get('end').value   ;
    
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.serviceSaldoHiloTela.getListaOT_Terminada(start, end,valorPendiente).subscribe({
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
      width         : esMovil ? '100%' : '700px',
      height        : esMovil ? '100%' : '',
      maxHeight     : esMovil ? '100vh' : '90vh',
      maxWidth      : esMovil ? '100vh' : '90vh',
      disableClose  : true,
      panelClass    : 'my-class',
      data: {
        Datos  : data
       }
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.onGetMemorandums();
    });    
  }

  chgPendiente(event: any){
    const sFecIni       : string =  this.range.get('start').value ;
    const sFecFin       : string =  this.range.get('end').value   ;    

    if (event.checked) {
      this.onLoadOTTerminadas(new Date(sFecIni), new Date(sFecFin), 'S');
    } else {
      this.onLoadOTTerminadas(new Date(sFecIni), new Date(sFecFin),'N');
    }        
  }

  // onFechaChange(event: any) {
    
  //   const valorPendiente = this.formulario.get('pendiente')?.value;
  //   this.onLoadOTTerminadas(valorPendiente);
  
  // }  

  onDateRangeSelected(start: Date, end: Date) {
    //console.log('Rango seleccionado:', start, ' - ', end);
    // Aquí puedes disparar tu evento, llamar a un servicio, filtrar datos, etc.
  // Solo ejecutar si ambos valores están presentes

    if (start && end) {
      const valorPendiente = this.formulario.get('pendiente')?.value ? 'S' : 'N';
      this.onLoadOTTerminadas(new Date(start),new Date(end), valorPendiente);
    }

  }  

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }    
}

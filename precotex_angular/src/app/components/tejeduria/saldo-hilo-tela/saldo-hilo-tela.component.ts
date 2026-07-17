import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeguimientoSaldoHiloService } from 'src/app/services/tejeduria/seguimiento-saldo-hilo.service';
import { SaldoHiloTelaProgramadaComponent } from './saldo-hilo-tela-programada/saldo-hilo-tela-programada.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { GlobalVariable } from 'src/app/VarGlobals';

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
     private toastr               : ToastrService,
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
      const sFecIni = this.range.get('start').value;
      const sFecFin = this.range.get('end').value;
      if (sFecIni && sFecFin) {
        this.onDateRangeSelected(sFecIni, sFecFin);
      }
    });    
  }

  onRevertir(row: any){
    Swal.fire({
      title: '¿Desea Revertir la Asignación?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {

      if (result.isConfirmed) {
        const num_Traslado  = ''; 
        const cod_OrdProv     = String(row.lote);
        const cod_Ordtra_Ori  = String(row.ot);
        const cod_Maquina_Ori = String(row.cod_Maquina);
        const cod_HilTel      = String(row.cod_Hilado);
        const cod_Color       = String(row.cod_Color || '');
        const kg_Programado = 0;
        const kg_Salida     = 0;
        const kg_Consumo    = 0;
        const kg_Devolver   = 0;
        const estado  = '';
        const cod_Ordtra_Des  = '';
        const cod_Maquina_Des = '';
        const cod_Usuario =   String(GlobalVariable.vusu);
        
        var data: any = 
          {
            "accion"        : "D",
            "num_Traslado"  : num_Traslado,
            "cod_OrdProv"   : cod_OrdProv,
            "cod_Ordtra_Ori": cod_Ordtra_Ori,
            "cod_Maquina_Ori": cod_Maquina_Ori,
            "cod_HilTel"     : cod_HilTel,
            "cod_Color"       : cod_Color,
            "kg_Programado" : kg_Programado,
            "kg_Salida"   : kg_Salida,
            "kg_Consumo"  : kg_Consumo,
            "kg_Devolver" : kg_Devolver,
            "estado"      : estado,
            "cod_Ordtra_Des"    : cod_Ordtra_Des,
            "cod_Maquina_Des"   : cod_Maquina_Des,
            "cod_Usuario"       : cod_Usuario
          };

        this.SpinnerService.show();
        this.serviceSaldoHiloTela.postProceso(data).subscribe({
          next: (response: any)=> {
            if(response.success){
              if (response.codeResult == 200){
                this.toastr.success(response.message, '', {
                  timeOut: 2500,
                });
                
                // Reload main grid
                const sFecIni = this.range.get('start').value;
                const sFecFin = this.range.get('end').value;
                if (sFecIni && sFecFin) {
                  this.onDateRangeSelected(sFecIni, sFecFin);
                }

              }else if(response.codeResult == 201){
                this.toastr.info(response.message, '', {
                  timeOut: 2500,
                });
              }
              this.SpinnerService.hide();
            }else{
              this.toastr.error(response.message, 'Cerrar', {
                timeOut: 2500,
              });
              this.SpinnerService.hide();
            }
          },
          error: (error) => {
            this.SpinnerService.hide();
            this.toastr.error(error.message, 'Cerrar', {
            timeOut: 2500,
            });
          }
        });            
      }
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

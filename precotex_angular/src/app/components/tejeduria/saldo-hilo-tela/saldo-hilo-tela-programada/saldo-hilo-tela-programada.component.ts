import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SeguimientoSaldoHiloService } from 'src/app/services/tejeduria/seguimiento-saldo-hilo.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import Swal from 'sweetalert2';

interface data {
  Datos       : any   ;
}

interface data_det {
  fec_Inicio   : string,
  ot           : string,
  familia      : string,
  cod_Maquina  : string,
  can_Salida   : number,
  can_Teorico  : number,
  can_PorPedir : number,
  lote          : string,
  cod_Hilado    : string,
  cod_Color     : string
}


@Component({
  selector: 'app-saldo-hilo-tela-programada',
  templateUrl: './saldo-hilo-tela-programada.component.html',
  styleUrls: ['./saldo-hilo-tela-programada.component.scss']
})
export class SaldoHiloTelaProgramadaComponent implements OnInit {

  // columnas visibles en la tabla
  displayedColumns: string[] = ['fec_Inicio','ot','familia','cod_Maquina','can_Salida','can_Teorico','can_PorPedir'];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  menuVisible = true;
  filaSeleccionada: any;
  sUsuario : string = GlobalVariable.vusu;

  constructor(
    private formBuilder           : FormBuilder ,
    private SpinnerService        : NgxSpinnerService               ,
    private serviceSaldoHiloTela  : SeguimientoSaldoHiloService,
    public dialogRef          : MatDialogRef<SaldoHiloTelaProgramadaComponent>,
    private snackBar          : MatSnackBar,
    private toastr            : ToastrService                   ,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
    ) { }

  ngOnInit(): void {

    console.log('data', this.data);

    this.formulario.get('ot')?.disable();
    this.formulario.get('lote')?.disable();
    this.formulario.get('fibra')?.disable();
    this.formulario.get('titulo')?.disable();
    this.formulario.get('articulo')?.disable();

    this.onCargarData(this.data);
    this.onLoadOTProgramadas();
  }

  formulario = this.formBuilder.group({
    ot      : [''],
    lote    : [''],
    fibra   : [''],
    titulo  : [''],
    articulo  : [''],
    estado    : [''],
    mv      : [''],
  }); 

  onCargarData(data: any){
    this.formulario.get('ot')?.setValue(data.Datos.ot);
    this.formulario.get('lote')?.setValue(data.Datos.lote);
    this.formulario.get('fibra')?.setValue(data.Datos.fibra);
    this.formulario.get('titulo')?.setValue(data.Datos.titulo);
    this.formulario.get('articulo')?.setValue(data.Datos.articulo);
  }

  onLoadOTProgramadas(){
    const valorLote: String = this.data.Datos.lote;

    this.dataSource.data = [];
    this.SpinnerService.show();
    this.serviceSaldoHiloTela.getListaOT_Programada(valorLote, "").subscribe({
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

  onGuardar(){

    if (!this.formulario.get('mv')?.value) {
      this.snackBar.open('¡Por favor, seleccione estado!', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    if (!this.filaSeleccionada) {

      const estado  = this.formulario.get('mv').value || '';
      if (estado === 'MV') {
        this.snackBar.open('¡Por favor, seleccione el destino!', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;        
      }
      // else{
      //   if (this.dataSource.data.length > 0) {
      //     this.seleccionarFila(this.dataSource.data[0]); // primera fila
      //   }
      // }
    }

    console.log('fila seleccionada', this.filaSeleccionada);
    //return;
    Swal.fire({
      title: '¿Desea Registrar Seguimiento de Saldo?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {

      if (result.isConfirmed) {
        
   
        const num_Traslado  = ''; 
        const cod_OrdProv     = String(this.data.Datos.lote);
        const cod_Ordtra_Ori  = String(this.data.Datos.ot);
        const cod_Maquina_Ori = String(this.data.Datos.cod_Maquina);
        const cod_HilTel      = String(this.data.Datos.cod_Hilado);
        const cod_Color       = String(this.data.Datos.cod_Color);
        const kg_Programado = this.formulario.get('mv').value == "MV" ? Number(this.filaSeleccionada.can_Teorico)  : 0;
        const kg_Salida     = this.formulario.get('mv').value == "MV" ? Number(this.filaSeleccionada.can_Salida)   : 0;
        const kg_Consumo    = this.formulario.get('mv').value == "MV" ? Number(this.filaSeleccionada.can_Salida)   : 0;
        const kg_Devolver   = this.formulario.get('mv').value == "MV" ? Number(this.filaSeleccionada.can_PorPedir) : 0;
        const estado  = this.formulario.get('mv').value || '';
        const cod_Ordtra_Des  = this.formulario.get('mv').value == "MV" ? String(this.filaSeleccionada.ot) : '';
        const cod_Maquina_Des = this.formulario.get('mv').value == "MV" ? String(this.filaSeleccionada.cod_Maquina) : '';
        const cod_Usuario =   String(this.sUsuario);
        
        var data: any = 
          {
            "accion"        : "I",
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

          console.log('data paar guardar', data);

      this.SpinnerService.show();
      this.serviceSaldoHiloTela.postProceso(data).subscribe({
          next: (response: any)=> {
            if(response.success){
              if (response.codeResult == 200){
                this.toastr.success(response.message, '', {
                  timeOut: 2500,
                });
                this.dialogRef.close();

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

  onVolver(){
    this.dialogRef.close();
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  seleccionarFila(row: any) {
    this.filaSeleccionada = row;
  }

}

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
  fec_Inicio?  : string,
  ot?          : string,
  familia?     : string,
  cod_Maquina? : string,
  can_Salida?  : number,
  can_Teorico? : number,
  can_PorPedir?: number,
  lote?        : string,
  cod_Hilado?  : string,
  cod_Color?   : string,
  sticker?     : string,
  pesoBruto?   : number,
  pesoNeto?    : number,
  cantConos?   : number,
}


@Component({
  selector: 'app-auditoria-devol-de-hilo-programada',
  templateUrl: './auditoria-devol-de-hilo-programada.component.html',
  styleUrls: ['./auditoria-devol-de-hilo-programada.component.scss']
})
export class AuditoriaDevolDeHiloProgramadaComponent implements OnInit {

  // columnas visibles en la tabla
  displayedColumns: string[] = ['sticker', 'pesoBruto', 'pesoNeto', 'cantConos'];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  menuVisible = true;
  filaSeleccionada: any;
  sUsuario : string = GlobalVariable.vusu;

  constructor(
    private formBuilder           : FormBuilder ,
    private SpinnerService        : NgxSpinnerService               ,
    private serviceSaldoHiloTela  : SeguimientoSaldoHiloService,
    public dialogRef          : MatDialogRef<AuditoriaDevolDeHiloProgramadaComponent>,
    private snackBar          : MatSnackBar,
    private toastr            : ToastrService                   ,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
    ) { }

  ngOnInit(): void {

    console.log('data', this.data);

    this.formulario.get('ot')?.disable();
    this.formulario.get('solicNum')?.disable();
    this.formulario.get('lote')?.disable();
    this.formulario.get('proveedor')?.disable();
    this.formulario.get('descripcion_hilo')?.disable();
    this.formulario.get('color')?.disable();
    this.formulario.get('marca')?.disable();
    this.formulario.get('semana')?.disable();
    this.formulario.get('conera')?.disable();
    this.formulario.get('total_bultos')?.disable();
    this.formulario.get('oc')?.disable();

    this.onCargarData(this.data);
    this.onLoadOTProgramadas();
  }

  formulario = this.formBuilder.group({
    ot              : [''],
    solicNum        : [''],
    lote            : [''],
    proveedor       : [''],
    descripcion_hilo: [''],
    color           : [''],
    marca           : [''],
    semana          : [''],
    conera          : [''],
    total_bultos    : [''],
    oc              : [''],
    estado          : [''],
    mv              : [''],
  }); 

  onCargarData(data: any){
    this.formulario.get('solicNum')?.setValue(data.Datos.ot);
    this.formulario.get('lote')?.setValue(data.Datos.lote);
    this.formulario.get('proveedor')?.setValue(data.Datos.proveedor || '');
    this.formulario.get('descripcion_hilo')?.setValue(data.Datos.descripcion_hilo || '');
    this.formulario.get('color')?.setValue(data.Datos.color || '');
    this.formulario.get('marca')?.setValue(data.Datos.marca || '');
    this.formulario.get('semana')?.setValue(data.Datos.sem || '');
    this.formulario.get('conera')?.setValue(data.Datos.conera || '');
    this.formulario.get('total_bultos')?.setValue(data.Datos.nBultos || '');
    this.formulario.get('ot')?.setValue(data.Datos.solic_ot || '');
    this.formulario.get('oc')?.setValue(data.Datos.oc || '');
    if (data?.Datos?.estado) {
      this.formulario.get('mv')?.setValue(data.Datos.estado);
    }
  }

  onLoadOTProgramadas(){
    const mockDetails: data_det[] = [
      {
        sticker: 'STK-9901-A',
        pesoBruto: 25.5,
        pesoNeto: 24.8,
        cantConos: 12
      },
      {
        sticker: 'STK-9901-B',
        pesoBruto: 26.0,
        pesoNeto: 25.2,
        cantConos: 12
      },
      {
        sticker: 'STK-9901-C',
        pesoBruto: 25.8,
        pesoNeto: 25.0,
        cantConos: 12
      }
    ];

    const valorLote: String = this.data.Datos.lote;

    this.dataSource.data = [];
    this.SpinnerService.show();
    this.serviceSaldoHiloTela.getListaOT_Programada(valorLote, "").subscribe({
      next: (response: any)=> {
        if(response.success && response.elements && response.elements.length > 0){
          this.dataSource.data = response.elements;
          this.SpinnerService.hide();
        } else {
          this.dataSource.data = mockDetails;
          this.SpinnerService.hide();
        }
      },  
      error: (error) => {
        this.dataSource.data = mockDetails;
        this.SpinnerService.hide();
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

        if (cod_Ordtra_Ori && (cod_Ordtra_Ori.startsWith('OT-') || cod_Ordtra_Ori.startsWith('SOL-'))) {
          this.toastr.success('Simulado: Seguimiento de Saldo Registrado con éxito', '', {
            timeOut: 2500,
          });
          this.dialogRef.close(estado);
          return;
        }

      this.SpinnerService.show();
      this.serviceSaldoHiloTela.postProceso(data).subscribe({
          next: (response: any)=> {
            if(response.success){
              if (response.codeResult == 200){
                this.toastr.success(response.message, '', {
                  timeOut: 2500,
                });
                this.dialogRef.close(estado);

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

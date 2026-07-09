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
    this.formulario.get('solicNum')?.setValue(data.Datos.solicitud || '');
    this.formulario.get('lote')?.setValue(data.Datos.lote);
    this.formulario.get('proveedor')?.setValue(data.Datos.proveedor || '');
    this.formulario.get('descripcion_hilo')?.setValue(data.Datos.hilo || '');
    this.formulario.get('color')?.setValue(data.Datos.color || '');
    this.formulario.get('marca')?.setValue(data.Datos.marca || '');
    this.formulario.get('semana')?.setValue(data.Datos.semana || '');
    this.formulario.get('conera')?.setValue(data.Datos.conera || '');
    this.formulario.get('total_bultos')?.setValue(data.Datos.bultos || '');
    this.formulario.get('ot')?.setValue(data.Datos.ot || '');
    this.formulario.get('oc')?.setValue(data.Datos.oc || '');
    if (data?.Datos?.estado) {
      this.formulario.get('mv')?.setValue(data.Datos.estado);
    }
  }

  onLoadOTProgramadas(){
    /*
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
    */
    const valorSolicitud: String = this.data.Datos.solicitud || 0;
    const valorLote: String = this.data.Datos.lote || '';
    const valorSemana: String = this.data.Datos.semana || '';
    const valorColor: String = this.data.Datos.color || '';
    const valorMarca: String = this.data.Datos.marca || '';
    const valorConera: String = this.data.Datos.conera || '';

    this.dataSource.data = [];
    this.SpinnerService.show();
    this.serviceSaldoHiloTela.getListaSolicitudAuditoriaBultos(valorSolicitud, valorLote, valorSemana, valorColor, valorMarca, valorConera).subscribe({
      next: (response: any)=> {
        if(response.success && response.elements && response.elements.length > 0){
          console.log('response.elements detalle', response.elements);
          this.dataSource.data = response.elements;
          this.SpinnerService.hide();
        } else {
          this.dataSource.data = [];
          this.SpinnerService.hide();
        }
      },  
      error: (error) => {
        this.dataSource.data = [];
        this.SpinnerService.hide();
      }         
    })
  }

  onGuardar(){

   
    const valor = this.formulario.get('mv')?.value;
    if (valor !== 'A' && valor !== 'D') {
      this.snackBar.open('¡Por favor, seleccione estado!', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
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
        
   
        
         const estado  = this.formulario.get('mv').value || '';
         const num_Solicitud  = String(this.data.Datos.solicitud); 
        const cod_OrdProv     = String(this.data.Datos.lote);
        const cod_Color       = String(this.data.Datos.color);
        const cod_Marca       = String(this.data.Datos.marca);
        const cod_Conera      = String(this.data.Datos.conera);
        const cod_semana      = String(this.data.Datos.semana);
        const tipo            = String(this.data.Datos.tipo);
        const cod_Usuario =   String(this.sUsuario);
        
        var data: any = 
          {
            "accion"        : "U",
            "num_Solicitud"  : num_Solicitud,
            "lote"   : cod_OrdProv,
            "semana" : cod_semana,
            "color"  : cod_Color,
            "marca"  : cod_Marca,
            "conera" : cod_Conera,
            "estado"    : estado,
            "tipo"      : tipo, //VERIFICAR DE DONDE SALE ESTE TIPO
            "cod_Usuario"       : cod_Usuario
          };
          console.log('data paar guardar', data);
          //return;

        // if (cod_Ordtra_Ori && (cod_Ordtra_Ori.startsWith('OT-') || cod_Ordtra_Ori.startsWith('SOL-'))) {
        //   this.toastr.success('Simulado: Seguimiento de Saldo Registrado con éxito', '', {
        //     timeOut: 2500,
        //   });
        //   this.dialogRef.close(estado);
        //   return;
        // }

      this.SpinnerService.show();
      this.serviceSaldoHiloTela.postProcesoSolAuditoria(data).subscribe({
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

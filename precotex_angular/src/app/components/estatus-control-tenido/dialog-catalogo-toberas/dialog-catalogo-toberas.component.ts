import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

import { TiProcesosTintoreriaService } from 'src/app/services/ti-procesos-tintoreria.service';
import { DialogVisorImageComponent } from '../dialog-visor-image/dialog-visor-image.component';

interface data {
  boton: string;
  title: string;
  Opcion: string;
  Datos: any;
}

interface data_det {

   secuenciaP? 				:number;
    fotoP?             :string;
    secuenciaT? 				:number;
    fotoT?             :string;
}

@Component({
  selector: 'app-dialog-catalogo-toberas',
  templateUrl: './dialog-catalogo-toberas.component.html',
  styleUrls: ['./dialog-catalogo-toberas.component.scss']
})
export class DialogCatalogoToberasComponent implements OnInit {
  displayedColumns_cab: string[] = [
    'SEC_P',
    'IMG_P',
    'SEC_T',
    'IMG_T',
  ]  
  dataSource: MatTableDataSource<data_det>;

  //Datos para el reproceso
  flgDivReproceso: boolean = false;
  strDescripcionReproceso: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: data,
    private toastr                    : ToastrService               ,
    private serviceTiProcesoTintoreria: TiProcesosTintoreriaService ,
    private SpinnerService            : NgxSpinnerService           , 
    public  dialog                    : MatDialog                   , 
    public dialogRef                  : MatDialogRef<DialogVisorImageComponent>
  ) { this.dataSource = new MatTableDataSource(); }

  ngOnInit(): void {
    const sPartida: string = this.data.Datos.cod_Ordtra
    const sIdOrgatexUnico: string = this.data.Datos.idOrgatexUnico
    this.listaDetalleToberaPruebaTenido(sPartida, sIdOrgatexUnico);
  }

  listaDetalleToberaPruebaTenido(cod_Ordtra: string, IdOrgatexUnico: string)
  {
    this.SpinnerService.show();
    this.serviceTiProcesoTintoreria.getListaDetalleToberaPruebaTenido(cod_Ordtra, IdOrgatexUnico).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            //Validar el div de la Descripcion del Reproceso
            if (!(response.elements[0].descripcionReproceso == null)){
                this.flgDivReproceso = true;
                this.strDescripcionReproceso = response.elements[0].descripcionReproceso;
            }
            
            this.dataSource.data = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            this.dataSource.data = [];
          }
        }        
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }

  openVisorImagenP(data:any){
      let dialogRef = this.dialog.open(DialogVisorImageComponent, {
        disableClose: false,
        panelClass: 'my-class',
        data: {
          boton:'ARRANQUE',
          Opcion:'I',
          Datos: data,
          Imagen: data.fotoP!
              }
        ,minWidth: '45vh'
      });      
  }

  openVisorImagenT(data:any){
    let dialogRef = this.dialog.open(DialogVisorImageComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        boton:'ARRANQUE',
        Opcion:'I',
        Datos: data,
        Imagen: data.fotoT!
            }
      ,minWidth: '45vh'
    });      
  }
  
  Salir(){
    this.dialogRef.close();
  }  

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { DialogRegistrarUbicacionesComponent } from './dialog-registrar-ubicaciones/dialog-registrar-ubicaciones.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

/*

      "id_Tx_Ubicacion_Colgador": 3,
      "id_Tipo_Ubicacion_Colgador": null,
      "id_Tipo_Ubicacion_Colgador_Padre": null,
      "codigoBarra": "CAJ-001",
      "cod_FamTela": null,
      "flg_Estatus": "A",
      "fec_Registro": "2025-05-23T15:15:24.53",
      "usu_Registro": null,
      "fec_Modifica": "0001-01-01T00:00:00",
      "usu_Modifica": null,
      "cod_Usuario": null,
      "cod_Equipo": null,
      "correlativo": null,
      "descripcion": "CAJA",
      "des_FamTela": ""

*/

interface data_det {
  id_Tx_Ubicacion_Colgador  : number,
  descripcion    : string,
  codigoBarra    : string,
  des_FamTela    : string,
  flg_Estatus    : string,
  fec_Registro   : string
}

@Component({
  selector: 'app-cnf-registro-ubicaciones',
  templateUrl: './cnf-registro-ubicaciones.component.html',
  styleUrls: ['./cnf-registro-ubicaciones.component.scss']
})
export class CnfRegistroUbicacionesComponent implements OnInit {

  dataTipoUbicaciones       : Array<any> = [];
  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });    

  constructor(
    private dialog            : MatDialog  ,
    private formBuilder       : FormBuilder,
    private SpinnerService    : NgxSpinnerService        ,
    private serviceColgadores : ProcesoColgadoresService ,
    private matSnackBar       : MatSnackBar              ,  
    private toastr            : ToastrService           ,
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.onLoadTipoUbicaciones();
    this.onGetListadoUbicacionesCnf();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };
  }  

  formulario = this.formBuilder.group({
    CodTipoUbicacion: [''],
  });

  displayedColumns: string[] = [
    'id',           
    'descripcion',     
    'codigoBarra',  
    'desFamiliaTela',     
    'estado',         
    'fec_Registro',      
    'opciones'
  ];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataListadoUbicaciones: Array<any> = [];  
  
  

  onGetListadoUbicacionesCnf(){

    const sFecIni       : string =  this.range.get('start').value ;
    const sFecFin       : string =  this.range.get('end').value   ;
    const sCodTipUbi    : number =  this.formulario.get('CodTipoUbicacion')?.value || 0 ;

    if (sFecIni == '' || sFecFin == ''){
      this.matSnackBar.open("Seleccione Rango de Fechas.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;                
    }   
    
    this.SpinnerService.show();
    this.serviceColgadores.getListadoUbicacionColgador(sFecIni, sFecFin, sCodTipUbi).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

              this.dataListadoUbicaciones = response.elements;
              this.dataSource.data = this.dataListadoUbicaciones;

            this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            this.dataSource.data = [];
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });        
  }

  onLoadTipoUbicaciones(){
    this.dataTipoUbicaciones = [];
    this.SpinnerService.show();
    this.serviceColgadores.getListadoTipoUbicacionColgador().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataTipoUbicaciones = response.elements;
              this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });       
  }

  onPrint(data: any){

    const _codigoBarra = data.codigoBarra; 
    let datao: any = {
        "content"   : _codigoBarra,
        //"printName" : "\\\\192.168.7.7\\Planeamiento",
        "printName" : "\\\\prxwind606\\Argox CP-2140EX PPLB",
    };    

    //Imprimir CODE QR
    this.SpinnerService.show();
    this.serviceColgadores.postPrintQRCode2(datao).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });
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

  onCreate(){
    let dialogRef = this.dialog.open(DialogRegistrarUbicacionesComponent, {
      width: '500px',
      height: '600px',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "::. Registro de Tipo de Ubicaciones .::",
        Accion : "I",
        Datos  : null 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      /*
      if (result == 'false') {
        this.CargarLista()
      // this.MostrarCabeceraVehiculo()
      }
      this.CargarLista()
      */
    })      
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }  

}

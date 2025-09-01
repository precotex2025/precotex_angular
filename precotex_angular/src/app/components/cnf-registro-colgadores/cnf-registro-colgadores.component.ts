import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogRegistrarColgadoresComponent } from './dialog-registrar-colgadores/dialog-registrar-colgadores.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { MatPaginator } from '@angular/material/paginator';
import * as _moment from 'moment';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  id_Tx_Colgador_Registro_Cab  : number,
  cod_Tela            : string,
  cod_OrdTra          : string,
  cod_Ruta            : string,
  cod_Cliente_Tex     : string,
  fabric              : string,
  yarn                : string,
  composicion         : string,
  flg_Estatus    : string,
  fec_Registro   : string,
  nom_Cliente    : string
}

@Component({
  selector: 'app-cnf-registro-colgadores',
  templateUrl: './cnf-registro-colgadores.component.html',
  styleUrls: ['./cnf-registro-colgadores.component.scss']
})
export class CnfRegistroColgadoresComponent implements OnInit {

  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });  

  constructor(
    private dialog     : MatDialog  ,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private serviceColgadores: ProcesoColgadoresService,
    private exceljsService: ExceljsService,
    private toastr: ToastrService,
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.onGetColgadores();
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

  sCod_Usuario  = GlobalVariable.vusu;
  formulario = this.formBuilder.group({
    CodTela:         [''],
  });

  displayedColumns: string[] = [
    'cod_Tela',           
    'cod_OrdTra',     
    'cod_ruta',  
    'nom_Cliente',
    'fabric',            
    'estado',         
    'fec_Registro',      
    'opciones'
  ];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataListadoColgadores: Array<any> = [];

  dataForExcel: any = [];
  dataSourceExcel: any = [];    
  dataReporteColgadoresDetails: Array<any> = [];

  onGetColgadores(){
    const sFecIni       : string =  this.range.get('start').value;
    const sFecFin       : string =  this.range.get('end').value;
    const sCodOrdtra    : string = this.formulario.get('CodTela')?.value || "";

    if (sFecIni == '' || sFecFin == ''){
      this.matSnackBar.open("Seleccione Rango de Fechas.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;                
    }
    
    this.SpinnerService.show();
    this.dataListadoColgadores = [];
    //this.dataSource.data = this.dataListadoColgadores;

    this.serviceColgadores.getListadoColgadoresBandeja(sFecIni, sFecFin, sCodOrdtra).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

              this.dataListadoColgadores = response.elements;
              this.dataSource.data = this.dataListadoColgadores;

            this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            //this.dataSource.data = [];
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

  onCreate(){
    const refrescarColgadores$ = new Subject<void>();
    let dialogRef = this.dialog.open(DialogRegistrarColgadoresComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "::. Registro e Impresion de Ticket's (Colgadores) .::",
        Accion : "I",
        Datos  : null,
        refrescarColgadores$
      }
    });
    refrescarColgadores$.subscribe(()=>{
      this.onGetColgadores();
    })

    //dialogRef.afterClosed().subscribe(result => {
    //    this.onGetColgadores();
    //})    
  }

  onEdit(data: any){
    const refrescarColgadores$ = new Subject<void>();
    let dialogRef = this.dialog.open(DialogRegistrarColgadoresComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "::. Modificación e Impresion de Ticket's (Colgadores) .::",
        Accion : "U",
        Datos  : data,
        refrescarColgadores$
      }
    });   
    refrescarColgadores$.subscribe(()=>{
      this.onGetColgadores();
    })    
    // dialogRef.afterClosed().subscribe(result => {
    // }); 
  }

  onPrint(data: any){

    //Obtiene codigo de cabecera.
    const _Id = Number(data.id_Tx_Colgador_Registro_Cab);

    //Obtiene informacion detallada de Colgador
    this.SpinnerService.show();
    this.serviceColgadores.getObtieneInformacionTelaColgadorDet(_Id).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

            //Proceso de Imprimir codigo QR
            let _CantidadImpresion = 1;
            let _content  = `${data.cod_Tela}${data.cod_Ruta}${data.cod_OrdTra}`;
            let data2: any = {
                "version"   : "1",
                "content"   : _content,
                "printName" : "",
                "countPrint": _CantidadImpresion,
                "tx_TelaEstructuraColgador" : {
                  "encog_Lenght"  : Number(response.elements[0].encog_Largo) ,
                  "encog_Width"   : Number(response.elements[0].encog_Ancho)  ,
                  "width_BW"      : Number(response.elements[0].ancho_Acabado)  ,
                  "width_AW"      : Number(response.elements[0].ancho_Lavado)  ,
                  "weight_BW"     : Number(response.elements[0].gramaje_Acab) ,
                  "weight_AW"     : Number(response.elements[0].gramaje_Comercial) ,
                  "yield"         : Number(response.elements[0].rendimiento) ,
                  "des_Galga"     : response.elements[0].des_Galga,
                  "diametro"      : Number(response.elements[0].diametro) ,
                  "desComposicion": response.elements[0].composicion,
                  "des_FamTela"   : "",
                  "cod_Tela"      : data.cod_Tela   ,
                  "cod_OrdTra"    : data.cod_OrdTra ,
                  "Cod_Ruta"      : data.cod_Ruta   ,
                  "nom_Cliente"   : response.elements[0].nom_Cliente,
                  "fabric"        : response.elements[0].fabric,
                  "yarn"          : response.elements[0].yarn,
                  "des_Color"     : response.elements[0].des_Color,
                  "des_Fabric_Finish" : response.elements[0].des_Fabric_Finish,
                  "des_Fabric_Wash"   : response.elements[0].des_Fabric_Wash
                }
              };  

              //Imprimir CODE QR
              this.SpinnerService.show();
              this.serviceColgadores.postPrintQRCode(data2).subscribe({
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
          else{
            this.matSnackBar.open(response.message, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });            
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

  onDelete(data: any){
    Swal.fire({
      title: '¿Esta seguro de eliminar el colgador y toda su información?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        const _Id = data.id_Tx_Colgador_Registro_Cab;
        const _User = this.sCod_Usuario;

        //Proceso de registrar
        let data2: any = {
          Id_Tx_Colgador_Registro_Cab: _Id,
          Usu_Registro: _User
        }        

        //Eliminar
        this.SpinnerService.show();
        this.serviceColgadores.postProcesoEliminarColgador(data2).subscribe({
            next: (response: any)=> {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });     

                  //Listar 
                  this.onGetColgadores();

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


      }else{
          //Verifica si obtiene version
          //this.getObtieneVersionArranque(data, Cod_Ordtra, Num_Secuencia);
      }
    });      
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  onExportarExcel(){
    this.SpinnerService.show();

    this.dataForExcel = [];
    this.dataSourceExcel = [];
    this.dataReporteColgadoresDetails = [];

    this.serviceColgadores.getReporteColgadoresGralDetallado().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

            this.dataReporteColgadoresDetails = response.elements;

            //QUE COMIENCE EL JUEGO DE LA EXPORTACION
            this.dataReporteColgadoresDetails.forEach((item: any) => {
              let fechaMostrada = this.formatearFechaValida(item.fch_Hora_Entrega);
              let datos = {
                ['Barcode Colgador']: item.codigoBarra_Colgador,
                ['Articulo']: item.cod_Tela ,
                ['Partida']: item.cod_OrdTra,
                ['Color']: item.des_Color   ,
                ['Ubicación Colgador Repisa/Mostrador']: item.codigoBarra_TipoUbicacion,
                ['Ubicación de Caja']: item.des_Ubicacion,
                ['# Caja']: item.nro_Caja,
                ['# Colgadores']: item.nro_Colgadores,
                ['RUTA']: item.des_Ruta       ,
                ['CLIENTE']: item.nom_Cliente ,
                ['FABRIC']: item.fabric       ,
                ['YARN']: item.yarn           ,
                ['COMPOSITION']: item.composicion,
                ['SHRINKAGE LENGHT']: item.shrinkage_lenght ,
                ['SHRINKAGE WIDTH']: item.shrinkage_width   ,
                ['WIDTH B/W MTS.']: item.width_bw_mts,
                ['WIDTH A/W MTS.']: item.width_aw_mts,
                ['WEIGHT STD B/W GRMS/MT2']: item.weight_bw_mt2,
                ['WEIGHT STD A/W GRMS/MT2']: item.weight_aw_mt2,
                ['YIELD MTS/KG']: item.yield_mts_kg ,
                ['GAGUE (Galga)']: item.gague       ,
                ['DIAMETRO']: item.diametro         ,
                ['FABRIC FINISH']: item.fabric_Finish ,
                ['FABRIC WASH']: item.fabric_Wash     ,
              };
              this.dataForExcel.push(datos);              
            });        
            
            if (this.dataForExcel.length > 0) {

              this.dataForExcel.forEach((row: any) => {
                this.dataSourceExcel.push(Object.values(row))
              })              

              let reportData = {
                title: 'REPORTE ',
                data: this.dataSourceExcel,
                headers: Object.keys(this.dataForExcel[0])
              }

              this.exceljsService.exportExcelReporteColgadoresDetalles(reportData);

            } else {
              this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.SpinnerService.hide();
            }
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

  formatearFechaValida(fecha: string): string {
    if (!fecha || fecha.startsWith('1900-01-01T00:00:00')) {
      return '';
    }

    const f = new Date(fecha);

    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    const anio = f.getFullYear();

    const horas = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }    

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogMemorandumGralComponent } from './dialog-memorandum-gral/dialog-memorandum-gral.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogMemorandumGralEditComponent } from './dialog-memorandum-gral-edit/dialog-memorandum-gral-edit.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { DialogMemorandumSeguimientoComponent } from './dialog-memorandum-seguimiento/dialog-memorandum-seguimiento.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogMemorandumPlantaComponent } from './dialog-memorandum-planta/dialog-memorandum-planta.component';

interface data_detalle {
  //codigo       : string,
  //descripcion  : string,
  //cantidad     : number,

  //Id_Memorandum_Detalle: number,
  num_Memo_Detalle: string,
  num_Memo: string,
  //cod_Material_Memo: string,
  glosa: string,
  cantidad: number,
  flg_Estatus: string,
  //fec_Registro: string,
  usu_Registro: string,
  //fec_Modifica: string,
  //usu_Modifica: string,
  //cod_Equipo: string  

}

interface data_det {
  num_memo          : string,
  emisor            : string,
  fecha_Emisor      : string,
  receptor          : string,
  fecha_Receptor    : string,
  num_Planta_Origen : number,
  planta_Origen     : string,
  num_Planta_Destino: number,
  planta_Destino    : string,
  usuario_Seg_Origen     : string,
  fecha_Seguridad_Emisor : string,
  usuario_Seg_Destino    : string,
  fecha_Seguridad_Receptor  : string,
  cod_Estado_Memo           : string,
  descripcion_Estado_Memo   : string,
  descripcion_Tipo_Memorandum: string,
}

@Component({
  selector: 'app-memorandum-gral',
  templateUrl: './memorandum-gral.component.html',
  styleUrls: ['./memorandum-gral.component.scss']
})
export class MemorandumGralComponent implements OnInit {

  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });    

  sCod_Trabajador = GlobalVariable.vcodtra;
  sTip_Trabajador = GlobalVariable.vtiptra;
  sUsuario        = GlobalVariable.vusu;

  sCod_Usuario = "";
  sNom_Usuario = "";
  sCod_Planta  = "";
  sNum_Memo_Seleccionado = "";
  sCod_Tipo_Memo = "";

  bBotonCrear            : boolean;
  bBotonProcesoSiguiente : boolean;
  bBotonProcesoDevolver : boolean;
  
  _sCodPlantaGarita: string = ""; 

  @ViewChild('btnBuscar') btnBuscar: ElementRef<HTMLButtonElement>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog            : MatDialog  ,
    private formBuilder       : FormBuilder       ,
    private matSnackBar       : MatSnackBar       ,
    private SpinnerService    : NgxSpinnerService ,
    private serviceMemorandum : MemorandumGralService,
    private toastr            : ToastrService,
  ) { }

  ngOnInit(): void {
    this.getTipoUsuario();
    this.getInfoUsuarios();
    //this.onGetMemorandums();
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }  

   displayedColumns: string[] = [
      'select'            , 
      'num_memo'          ,
      'emisor'            ,
      'fecha_Emisor'      ,
      'receptor'          ,
      //'fecha_Receptor'    ,
      'descripcion_Tipo_Memorandum',
      'planta_Origen'     ,
      'planta_Destino'    ,
      //'usuario_Seg_Origen'     ,
      //'fecha_Seguridad_Emisor' ,
      //'usuario_Seg_Destino'    ,
      //'fecha_Seguridad_Receptor'  ,
      'descripcion_Estado_Memo'   ,
      'opciones'
   ];
   dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
   columnsToDisplay: string[] = this.displayedColumns.slice();
   dataListadoMemorandums: Array<any> = []; 
   selectListadoMemorandums: Array<data_det> = [];

  formulario = this.formBuilder.group({
    NroMemo:         [''],
  });

  selection = new SelectionModel<any>(true, []); // true = multi-select
  dataPlantas   : Array<any> = [];
  

  openModalPlanta(){

    let dialogRef = this.dialog.open(DialogMemorandumPlantaComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title     : "::. Selecciona tu Planta .::",
        //num_Memo  : data.num_Memo 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const sCodPlanta = result;
      this._sCodPlantaGarita = sCodPlanta; 
      this.onGetMemorandums()
    });

  }

  onGetMemorandums(){

    const sFecIni       : string =  this.range.get('start').value ;
    const sFecFin       : string =  this.range.get('end').value   ;
    const sNroMemo      : string =  this.formulario.get('NroMemo')?.value || "";  
    const sCod_Usuario  : string = GlobalVariable.vusu;
    const sCod_Planta_Garita : string = String(this._sCodPlantaGarita); 
    
    if (sFecIni == '' || sFecFin == ''){
      this.matSnackBar.open("Seleccione Rango de Fechas.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;                 
    }    

    this.SpinnerService.show();
    this.dataListadoMemorandums = [];

    this.serviceMemorandum.getObtieneInformacionMemorandum(sFecIni, sFecFin, sNroMemo, sCod_Usuario, sCod_Planta_Garita).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              console.log('onGetMemorandums',response.elements);
              this.dataListadoMemorandums = response.elements;
              this.dataSource.data = this.dataListadoMemorandums;
              this.dataSource.sort = this.sort;

            this.SpinnerService.hide();
          }
          else{
            this.dataListadoMemorandums = [];
            this.dataSource.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataListadoMemorandums = [];
          this.dataSource.data = [];
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
    let dialogRef = this.dialog.open(DialogMemorandumGralComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "::. Registro de Memorandum's .::",
        Accion : "I",
        sCod_Usuario : this.sCod_Usuario,
        sNom_Usuario : this.sNom_Usuario,
        sCod_Planta  : this.sCod_Planta,
        Datos  : null
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.onGetMemorandums();
    });
  }

  onEdit(data: any){
    let dialogRef = this.dialog.open(DialogMemorandumGralEditComponent, {
      width: '700px',
      disableClose: false,
      panelClass: 'my-class',
      data: {
        Title  : "::. Edición de Memorandum's .::",
        Accion : "U",
        Datos  : data
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.onGetMemorandums();
    });
  }

  onSeg(data: any){
    console.log('data onSeg', data);
    let dialogRef = this.dialog.open(DialogMemorandumSeguimientoComponent, {
      width: '900px',
      disableClose: false,
      panelClass: 'my-class',
      data: {
        Title     : "::. Seguimiento de Memorandum " + data.num_Memo   +  " .::",
        num_Memo  : data.num_Memo 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  onRevertir(){
    if (this.selection.hasValue()) {

      Swal.fire({
        title: '¿Desea revertir el Memorandum, tener en cuenta que se pueden perder información Trabajada?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {    
        if (result.isConfirmed) {
          const data: any = {
            cod_Usuario   : this.sUsuario               ,
            num_Memo      : this.sNum_Memo_Seleccionado ,
            Observaciones : ''
          };

          //GUARDAR
          this.SpinnerService.show();
          this.serviceMemorandum.postRevertirEstadoMemorandum(data).subscribe({
              next: (response: any)=> {
                if(response.success){
                  if (response.codeResult == 200){
                    this.toastr.success(response.message, '', {
                      timeOut: 2500,
                    });
                    this.selectListadoMemorandums = [];
                    this.onGetMemorandums();
                    
                  }else {
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
      })

    } else {
        this.matSnackBar.open("¡Seleccione al menos un Memo para Revertir...!", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
    }      

  }

  onUpdateListo() {

    if (this.selection.hasValue()) {

      Swal.fire({
        title: '¿Desea procesar y pasar al siguiente estado del Memorandum?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {    
        if (result.isConfirmed) {
          const data: any = {
            cod_Usuario   : this.sUsuario               ,
            num_Memo      : this.sNum_Memo_Seleccionado ,
            Observaciones : ''
          };

          //GUARDAR
          this.SpinnerService.show();
          this.serviceMemorandum.postAvanzaEstadoMemorandum(data).subscribe({
              next: (response: any)=> {
                if(response.success){
                  if (response.codeResult == 200){
                    this.toastr.success(response.message, '', {
                      timeOut: 2500,
                    });
                    this.selectListadoMemorandums = [];
                    //this.btnBuscar.nativeElement.click();
                    this.onGetMemorandums();
                    
                  }else {
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
      })

    } else {
        this.matSnackBar.open("¡Seleccione al menos un Memo para Continuar...!", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
    }    

  }

  onDevolverMemo(){

    //Valida Si tipo memo es 02 - CON RETORNO 
    if (this.sCod_Tipo_Memo !== '02'){
        this.matSnackBar.open("¡El tipo de memo no corresponde para Generar esta Acción ...!", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });      
        return
    }

    if (this.selection.hasValue()) {

      Swal.fire({
        title: '¿Desea procesar y pasar al siguiente estado del Memorandum?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {    
        if (result.isConfirmed) {
            console.log('this.selection', this.selection);
            console.log('this.selectListadoMemorandums', this.selectListadoMemorandums[0]["cod_Usuario_Emisor"]);
   
          const sNumMemo      = this.selectListadoMemorandums[0]["num_Memo"];
          const sUserEmisor   = this.selectListadoMemorandums[0]["cod_Usuario_Emisor"];
          const sUserReceptor = this.selectListadoMemorandums[0]["cod_Usuario_Receptor"];
          const sPlantaOri    = this.selectListadoMemorandums[0]["num_Planta_Origen"];
          const sPlantaDes    = this.selectListadoMemorandums[0]["num_Planta_Destino"];
          const sTipMemo      = '';
          const sCodMotivo    = this.selectListadoMemorandums[0]["cod_Motivo_Memo"];    
          
          let data: any = {
            "num_Memo": sNumMemo,
            "cod_Usuario_Emisor"  : sUserEmisor,
            "cod_Usuario_Receptor": sUserReceptor,
            "num_Planta_Origen": sPlantaOri,
            "num_Planta_Destino": sPlantaDes,
            "cod_Usuario_Seguridad_Emisor": "",
            "cod_Usuario_Seguridad_Receptor": "",
            "cod_Tipo_Memo": sTipMemo,
            "cod_Motivo_Memo": sCodMotivo
          };   
          
        //GUARDAR
        this.SpinnerService.show();
        this.serviceMemorandum.postDevolverMemorandum(data).subscribe({
            next: (response: any)=> {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });

                  this.bBotonProcesoDevolver = false;
                  this.selectListadoMemorandums = [];
                  this.onGetMemorandums();

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

    }else {
        this.matSnackBar.open("¡Seleccione al menos un Memo para Continuar...!", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
    } 

  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }  

  getInfoUsuarios(){
    this.serviceMemorandum.getUsuario(this.sCod_Trabajador, this.sTip_Trabajador).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.sCod_Usuario = result.elements[0].cod_Usuario;
          this.sNom_Usuario = result.elements[0].nom_Usuario;
          this.sCod_Planta  = result.elements[0].cod_Planta;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))        
  }

  getTipoUsuario(){
    this.serviceMemorandum.getObtenerTipoUsuarioMemorandum(this.sUsuario).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          if (Number(result.elements[0].esGarita)==0){
            this.bBotonCrear = false;
            this.onGetMemorandums();
          } else {
            this.bBotonCrear = true;
            this.openModalPlanta();
          }
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))   
  }  

  getPlantas(){
    this.serviceMemorandum.getPlantas().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataPlantas = result.elements;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))    
  }   

  /** Filtro global */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }  

  /*FUNCIONES PARA EL CHECK*/
  // toggleAllRows(event: any) {
  //   if (event.checked) {
  //     this.selection.select(...this.dataSource.data);
  //   } else {
  //     this.selection.clear();
  //   }
  // }

  toggleRow(event: MatCheckboxChange, row: any) {

    this.sNum_Memo_Seleccionado = String(row.num_Memo);
    this.sCod_Tipo_Memo = String(row.cod_Tipo_Memo);

    this.selectListadoMemorandums = [];
    //this.selectListadoMemorandums = row;
    this.selectListadoMemorandums.push(row);

    //const sCodUsuarioEmisor = row.cod_Usuario_Emisor;
    //const sNumMemo          = row.num_Memo;
    const sCodEstadoMemo    = String(row.cod_Estado_Memo);
    const sCod_Tipo_Memo    = String(row.cod_Tipo_Memo);
    const scod_Usuario_Receptor = String(row.cod_Usuario_Receptor);

    if (event.checked) {   
      this.selection.clear();        
      this.selection.toggle(row);

      //El boton de Devolver solo se debe reflejar 
      //When Estado es igual '05' - Recepcion Final
      //When Tipo de Memo '02'    - Con Retorno 
      if (sCodEstadoMemo === '05' && sCod_Tipo_Memo === '02' && scod_Usuario_Receptor.trim().toLowerCase() === this.sUsuario.trim().toLowerCase()){
        console.log('marca 500')
        this.bBotonProcesoDevolver = true;
      }else{
        this.bBotonProcesoDevolver = false;
      }      
    } else {
      this.selection.clear(); 
      this.bBotonProcesoDevolver = false;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  // getObtenerPermisosMemorandum(sCodUsuario, sNumMemo, sCodEstado){
  //   this.serviceMemorandum.getObtenerPermisosMemorandum(sCodUsuario, sNumMemo).subscribe(
  //     (result: any) => {
  //       if (result.totalElements > 0) {
  //         console.log('Resultados Permisos', result);

  //         console.log('sCodEstado', sCodEstado);
  //         console.log('result.elements[0].cod_Estado_Memo_Actual ', result.elements[0].cod_Estado_Memo_Actual)
  //         //Validamos que los estados no sean iguales para habilitar el boton de continuar con el siguiente proceso
  //         if (result.elements[0].cod_Estado_Memo_Siguiente == sCodEstado){
  //           console.log('MARCA 100');
  //           this.bBotonProcesoSiguiente = false;
  //         }else{
  //           console.log('MARCA 101');
  //           this.bBotonProcesoSiguiente = false;
  //         }
          
  //       }
  //       else {
  //         this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
  //       }
  //     },
  //     (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
  //       duration: 1500,
  //     }))  
  // }  


}

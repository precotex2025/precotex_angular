import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { DialogMemorandumGralAddDetalleComponent } from '../dialog-memorandum-gral-add-detalle/dialog-memorandum-gral-add-detalle.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

interface data {
  Title       : string;
  Accion      : string;
  sCod_Usuario: string;
  sNom_Usuario: string;
  sCod_Planta : string;
  Datos       : any   ;
}

interface dataDetalle {
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

@Component({
  selector: 'app-dialog-memorandum-gral-edit',
  templateUrl: './dialog-memorandum-gral-edit.component.html',
  styleUrls: ['./dialog-memorandum-gral-edit.component.scss']
})
export class DialogMemorandumGralEditComponent implements OnInit {

  formulario = this.formBuilder.group({
      ctrol_memo: [''],
      ctrol_fecha: [''],
      ctrol_user_ori: [''],
      ctrol_planta_ori: [''],
      ctrol_user_des: [''],
      ctrol_planta_des: [''],    

      //seguridad
      ctrol_user_seg_ori: [''],
      ctrol_user_seg_des: [''],
      ctrol_fecha_seg_ori: [''],
      ctrol_fecha_seg_des: [''],

      ctrol_cantidad: [''],
      ctrol_material: [''],
      ctrol_motivo: [''],
      ctrol_glosa: [''],

      ctrol_tip_mot: [''],
      ctrol_estado: [''],
      ctrol_tip_memo: [''],
  });  

  dataUsuarios  : Array<any> = [];
  dataPlantas   : Array<any> = [];
  dataDetalles  : dataDetalle[] = [];
  dataMotivos   : Array<any> = [];
  dataTipoMemo  : Array<any> = [];

  sUsuario  = GlobalVariable.vusu;

  //Permisos de Controles por Usuario / Habilitados
  bEdita : boolean = true;
  sRolMemo: string;

  constructor(
    private formBuilder       : FormBuilder                     ,
    private serviceSeguridad  : SeguridadControlVehiculoService ,
    private matSnackBar       : MatSnackBar                     ,
    private serviceMemorandum : MemorandumGralService           ,
    private SpinnerService    : NgxSpinnerService               ,
    private dialog            : MatDialog                       ,
    private toastr            : ToastrService                   ,
    @Inject(MAT_DIALOG_DATA) public data: data                  ,
    public dialogRef: MatDialogRef<DialogMemorandumGralEditComponent>,
  ) { }

  ngOnInit(): void {

    //Deshabilita controles de Seguridad:
    this.formulario.get('ctrol_user_seg_ori')?.disable();
    this.formulario.get('ctrol_user_seg_des')?.disable();
    this.formulario.get('ctrol_fecha_seg_ori')?.disable();
    this.formulario.get('ctrol_fecha_seg_des')?.disable();    
    console.log('this.data.Datos', this.data.Datos);
    
    this.getObtieneRolUsuarioMemorandum(this.sUsuario, this.data.Datos.num_Memo);
    this.getObtenerPermisosMemorandum(this.data.Datos.cod_Usuario_Emisor, this.data.Datos.num_Memo);
    this.getTipoMemo();
    this.getMotivos() ;
    this.getListaUsuarios();
    this.getPlantas();
    this.setValoresFormulario(this.data);
  }

  //Estructura Tabla Detalle 
  displayedColumns: string[] = [
    'select'          , 
    'descripcion'     ,
    'cantidad'        ,
    'estado'          ,
    'acciones'     
  ];
  dataSource: MatTableDataSource<dataDetalle> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataListadoMemorandums: Array<any> = []; 

  selection = new SelectionModel<any>(true, []); // true = multi-select  
  seleccionados: any[] = [];

  setValoresFormulario(data: any){
    console.log('data', data);
    this.wait(1000);
                        
    this.formulario.get('ctrol_tip_memo')?.setValue(data.Datos.cod_Tipo_Memo);
    this.formulario.get('ctrol_tip_mot')?.setValue(data.Datos.cod_Motivo_Memo);

    this.formulario.get('ctrol_user_ori')?.setValue(data.Datos.cod_Usuario_Emisor);
    this.formulario.get('ctrol_user_des')?.setValue(data.Datos.cod_Usuario_Receptor);    

    this.formulario.get('ctrol_planta_ori')?.setValue(data.Datos.num_Planta_Origen);    
    this.formulario.get('ctrol_planta_des')?.setValue(data.Datos.num_Planta_Destino);    

    //CARGAR LOS DETALLES
    const sNumMemo: string = data.Datos.num_Memo;
    this.getObtieneDetalleMemo(sNumMemo);
  }

  getObtieneRolUsuarioMemorandum(sCodUsuario, sNumMemo){
    this.serviceMemorandum.getObtenerRolUsuarioMemorandum(sCodUsuario, sNumMemo).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          console.log('Resultados Rol Permisos', result);
          this.sRolMemo = result.elements[0].rolObtenido
          
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))   
  }

  getObtenerPermisosMemorandum(sCodUsuario, sNumMemo){
    this.serviceMemorandum.getObtenerPermisosMemorandum(sCodUsuario, sNumMemo).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          console.log('Resultados Permisos', result);
          //this.dataTipoMemo = result.elements;
          if (result.elements[0].bEditar == 1){
            this.bEdita = false;
          }else{
            this.bEdita = true;
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

  getTipoMemo(){
    this.serviceMemorandum.getTipoMemorandum().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataTipoMemo = result.elements;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))       
  }  

  getMotivos(){
    this.serviceMemorandum.getMotivos().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataMotivos = result.elements;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))      
  }

  getListaUsuarios(){
    this.serviceSeguridad.mantenimientoUsuariosService(
      ""
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataUsuarios = result;
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

  onUsuarioSeleccionado(event: MatSelectChange){
    // const id = event.value;
    // const usuarioDest = this.dataUsuariosOri.find(u => u.Cod_Usuario === id);
  } 
  
  onSave(){

    Swal.fire({
      title: '¿Desea Actualizar Memorandum?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {

    if (result.isConfirmed) {
      
      //Informacion Cabecera
      const sUserEmisor   = String(this.formulario.get('ctrol_user_ori')?.value);
      const sUserReceptor = String(this.formulario.get('ctrol_user_des')?.value);
      const sPlantaOri    = this.formulario.get('ctrol_planta_ori')?.value;
      const sPlantaDes    = this.formulario.get('ctrol_planta_des')?.value;
      const sCodMotivo    = this.formulario.get('ctrol_tip_mot')?.value;
      const sTipMemo      = this.formulario.get('ctrol_tip_memo')?.value;

      /********************/
      //Memorandum Detalle
      /********************/
      let data: any = {
        "num_Memo": this.data.Datos.num_Memo,
        "cod_Usuario_Emisor"  : sUserEmisor,
        "cod_Usuario_Receptor": sUserReceptor,
        "num_Planta_Origen": sPlantaOri,
        "num_Planta_Destino": sPlantaDes,
        "cod_Usuario_Seguridad_Emisor": "",
        "cod_Usuario_Seguridad_Receptor": "",
        "cod_Tipo_Memo": sTipMemo,
        "cod_Motivo_Memo": sCodMotivo,
        "accion": "U",
        "detalle": this.dataDetalles
      };
      
      //console.log('data', data);
      //GUARDAR
      this.SpinnerService.show();
      this.serviceMemorandum.postProcesoMntoMemorandum(data).subscribe({
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

  // onOK(){
    
  // }

  wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getObtieneDetalleMemo(NumMemo: string){
    this.SpinnerService.show();
    this.dataDetalles = [];

    this.serviceMemorandum.getObtieneDetalleMemorandumByNumMemo(NumMemo).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              console.log('onGetMemorandums',response.elements);
              this.dataDetalles = response.elements;
              this.dataSource.data = this.dataDetalles;

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

  // Para eliminar un detalle por índice
  quitarDetalle(index: number) {
    this.dataDetalles.splice(index, 1);
    this.recalcularCorrelativos();
    this.dataSource.data = [...this.dataDetalles]; // refresca tabla

    console.log('this.dataDetalles', this.dataDetalles);
  }
  
  // Si quieres mantener correlativos al eliminar
  private recalcularCorrelativos() {
    this.dataDetalles.forEach((item, idx) => {
      item.num_Memo_Detalle = (idx + 1).toString().padStart(3, '0');
    });
  }  

  private generarCorrelativo(): string {
    const correlativo = (this.dataDetalles.length + 1).toString().padStart(3, '0');
    return correlativo;
  }  

  onAdd(){
    let dialogRef = this.dialog.open(DialogMemorandumGralAddDetalleComponent, {
      width: '550px',
      disableClose: false,
      panelClass: 'my-class',
      data: {
        Title  : "::. Registro Detalle .::"
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        const nuevaData: dataDetalle = {
          num_Memo_Detalle: this.generarCorrelativo() ,
          num_Memo        : this.data.Datos.num_Memo  ,
          glosa           : String(result.glosa)      ,
          cantidad        : Number(result.cantidad)   ,
          flg_Estatus     : '0'                       ,
          usu_Registro    : this.sUsuario 
        };

        this.dataDetalles.push(nuevaData);
        this.dataSource.data = [...this.dataDetalles]; // Refrescar la tabla  
      }    
      /*
      if (result) {
        console.log("Datos recibidos al cerrar:", result);
        // aquí puedes hacer lo que necesites con el objeto
      } else {
        console.log("El modal se cerró sin devolver datos");
      }
        */
    });
  }

  onRecepcionar() {

    if (this.selection.hasValue()) {

      Swal.fire({
        title: '¿Desea recepcionar todos los articulos seleccionados?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          
          console.log('this.seleccionados', this.seleccionados);

          //Informacion Cabecera
          const sUserEmisor   = String(this.formulario.get('ctrol_user_ori')?.value);
          const sUserReceptor = String(this.formulario.get('ctrol_user_des')?.value);
          const sPlantaOri    = this.formulario.get('ctrol_planta_ori')?.value;
          const sPlantaDes    = this.formulario.get('ctrol_planta_des')?.value;
          const sCodMotivo    = this.formulario.get('ctrol_tip_mot')?.value;
          const sTipMemo      = this.formulario.get('ctrol_tip_memo')?.value;

          /********************/
          //Memorandum Detalle
          /********************/
          let data: any = {
            "num_Memo": this.data.Datos.num_Memo,
            "cod_Usuario_Emisor"  : sUserEmisor,
            "cod_Usuario_Receptor": sUserReceptor,
            "num_Planta_Origen": sPlantaOri,
            "num_Planta_Destino": sPlantaDes,
            "cod_Usuario_Seguridad_Emisor": "",
            "cod_Usuario_Seguridad_Receptor": "",
            "cod_Tipo_Memo": sTipMemo,
            "cod_Motivo_Memo": sCodMotivo,
            "accion": "R",
            "detalle": this.seleccionados
          };

          //console.log('data', data);
          //RECEPCIONAR
          this.SpinnerService.show();
          this.serviceMemorandum.postProcesoMntoMemorandum(data).subscribe({
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

        };
      });      

    }else {
      this.matSnackBar.open("¡Seleccione al menos un articulo a recepcionar...!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });    
    }
  }

  /*FUNCIONES PARA EL CHECK*/
  toggleAllRows(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
      this.seleccionados = [...this.dataSource.data]; 
    } else {
      this.selection.clear();
      this.seleccionados = []; 
    }
  }

  toggleRow(row: any) {
    this.selection.toggle(row);

    if (this.selection.isSelected(row)) {
      this.seleccionados.push(row);
    } else {
      // Elimina de seleccionados si estaba ahí
      this.seleccionados = this.seleccionados.filter(item => item !== row);
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

}

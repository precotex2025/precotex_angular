import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { VistaPreviaVaporizadoDefectosComponent } from '../vista-previa-vaporizado-defectos/vista-previa-vaporizado-defectos.component';
import { DialogRegistrarDetalleVaporizadoAcabadoComponent } from '../dialog-registrar-detalle-vaporizado-acabado/dialog-registrar-detalle-vaporizado-acabado.component';
import { DialogVaporizadoDefectosComponent } from '../dialog-vaporizado-defectos/dialog-vaporizado-defectos.component';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

interface data{
  Num_Auditoria: number,
  Tip_Auditoria: number,
  Flg_Status: string,
  Status: string,
}

interface data_det {
  Num_Auditoria_Detalle:    number
  Num_Auditoria:            number
  Tip_Auditoria:            string
  Cod_OrdPro:               string
  Cod_Cliente:              string
  Des_Cliente:              string
  Cod_EstCli:               string
  Des_EstPro:               string
  Cod_Present:              string
  Des_Present:              string
  Cod_Operario:             string
  Nom_Operario:             string
  Cod_LinPro:               string
  Nom_Servicio:             string
  Can_Muestra:              number
  Observacion:              string
  Flg_Status:               string
  Cod_Usuario:              string
  Cod_Equipo:               string
  Fecha_Reg:                string
  Can_Defecto:              number
  Flg_Reproceso:            string
  Flg_Reproceso_Num:        number
}

@Component({
  selector: 'app-dialog-detalle-vaporizado-acabado',
  templateUrl: './dialog-detalle-vaporizado-acabado.component.html',
  styleUrls: ['./dialog-detalle-vaporizado-acabado.component.scss']
})
export class DialogDetalleVaporizadoAcabadoComponent implements OnInit {

  public data_det = [{
    Num_Auditoria_Detalle:    0,
    Num_Auditoria:            0,
    Tip_Auditoria:            '',
    Cod_OrdPro:               '',
    Cod_Cliente:              '',
    Des_Cliente:              '',
    Des_EstPro:               '',
    Cod_Present:              '',
    Des_Present:              '',
    Cod_LinPro:              '',
    Can_Muestra:              0,
    Observacion:              '',
    Flg_Status:               '',
    Cod_Usuario:              '',
    Cod_Equipo:               '',
    Fecha_Reg:                '', 		
    Can_Defecto:              0,
    Cod_EstCli :              '',
    Flg_Reproceso:            '',
    Flg_Reproceso_Num:        0,
  }]

  Cod_Accion              = '';
  Num_Auditoria_Detalle   = 0;
  Num_Auditoria           = this.data.Num_Auditoria;
  Tip_Auditoria           = '1';
  Cod_OrdPro              = '';
  Cod_Cliente             = '';
  Cod_EstCli              = '';
  Cod_Present             = '' ;
  Can_Muestra             = 0;
  Observacion             = '';
  Flg_Status              = '';
  Cod_Usuario             = '';
  Cod_Equipo              = '';
  Fecha_Reg               = '';
  Cod_Supervisor          = '';
  Cod_Auditor             = '';
  Cod_Operario            = '';
  Fecha_Auditoria         = '';
  Fecha_Auditoria2        = '';
  Flg_Reproceso           = '';
  Flg_Reproceso_Num       = 0;
  Rol                     = '';
  mostrar                 = false;
  deshabilitar            = false;
  ll_Supervisor: boolean = false;

  //* Declaramos formulario para obtener los controles */

  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor:   [''],
    fec_registro: [''],
    auditor:      ['']
  })


  displayedColumns_cab: string[] = ['Num_Auditoria_Detalle', 'Cod_OrdPro', 'Nom_Cliente', 'Cod_EstCli', 'Cod_Present', 'Can_Muestra', 'Can_Defecto', 'Flg_Status', 'Acciones']
  dataSource: MatTableDataSource<data_det>;
  isDisabled = true;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    //this.CargarOperacionConductor()
    this.MostrarDetalleAuditoria(); 
    this.Rol = GlobalVariable.vusu;

    // Reemplaza validación los permisos a usuarios.  2024Nov11, Ahmed
    // 192 - Auditoria Vaporizado Acabado
    this.validarCRUDUsuario(192);
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
 
  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['fec_registro'].setValue('')
  }

  MostrarDetalleAuditoria() {

    this.SpinnerService.show();

    this.Cod_Accion             = 'L';
    this.Num_Auditoria_Detalle  = 0;
    this.Tip_Auditoria          = '0';
    this.Cod_OrdPro             = '';
    this.Cod_Cliente            = '';
    this.Cod_EstCli             = '';
    this.Cod_Present            = '';
    this.Can_Muestra            = 0;
    this.Observacion            = '';
    this.Flg_Status             = '';
    this.Flg_Reproceso          = '';
    this.Flg_Reproceso_Num      = 0;

    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Num_Auditoria_Detalle','0');
    formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
    formData.append('Tip_Auditoria','');
    formData.append('Cod_OrdPro', ''); 			
    formData.append('Cod_Cliente', '');		
    formData.append('Cod_EstCli', ''); 			
    formData.append('Cod_Present','' );
    formData.append('Cod_Operario','' );
    formData.append('Tip_Trabajador_Operario','' );
    formData.append('Cod_LinPro','' );
    formData.append('Can_Muestra', '0'); 		
    formData.append('Observacion', ''); 		
    formData.append('Flg_Status', '' ); 			
    formData.append('Flg_Reproceso', '' ); 		
    formData.append('Flg_Reproceso_Num', '0' ); 	
    formData.append('Cod_Usuario', '' ); 		
    
    this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoDetService(
      formData
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
      console.log('result::YYY',result);
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


  EliminarRegistroDetalle(Num_Auditoria_Detalle: number) {
    
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        const formData = new FormData();
        formData.append('Accion', 'D');
        formData.append('Num_Auditoria_Detalle',Num_Auditoria_Detalle.toString());
        formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
        formData.append('Tip_Auditoria','1');
        formData.append('Cod_OrdPro', ''); 			
        formData.append('Cod_Cliente', '');		
        formData.append('Cod_EstCli', ''); 			
        formData.append('Cod_Present','' ); 		
        formData.append('Cod_Operario', '');
        formData.append('Tip_Trabajador_Operario', ''); 
        formData.append('Cod_LinPro', ''); 
        formData.append('Can_Muestra', '0'); 		
        formData.append('Observacion', ''); 		
        formData.append('Flg_Status', '' ); 			
        formData.append('Flg_Reproceso', '' ); 		
        formData.append('Flg_Reproceso_Num', '0' ); 	
        formData.append('Cod_Usuario', '' ); 		

        this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoDetService(
          formData).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              this.MostrarDetalleAuditoria()
            }
            else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
      }

    })
      
  }

  ModificarRegistroDetalle(data_det: data_det) {
 
    let dialogRef = this.dialog.open(DialogRegistrarDetalleVaporizadoAcabadoComponent, {
      disableClose: true,
      data: { Num_Auditoria: this.data.Num_Auditoria,
              Num_Auditoria_Detalle: data_det.Num_Auditoria_Detalle,
              Tip_Auditoria: data_det.Tip_Auditoria,
              Cod_OrdPro: data_det.Cod_OrdPro,
              Cod_Cliente: data_det.Cod_Cliente,
              Des_Cliente: data_det.Des_Cliente,
              Cod_EstCli: data_det.Cod_EstCli,
              Des_EstPro: data_det.Des_EstPro,
              Cod_Present: data_det.Cod_Present,
              Des_Present: data_det.Des_Present,
              Can_Muestra: data_det.Can_Muestra,
              Observacion: data_det.Observacion,
              Flg_Status: data_det.Flg_Status,
              Flg_Reproceso_Num: data_det.Flg_Reproceso_Num,
              Cod_Operario: data_det.Cod_Operario,
              Nom_Operario: data_det.Nom_Operario,
              Des_Servicio: data_det.Nom_Servicio,
              Cod_LinPro: data_det.Cod_LinPro
            }
    });

    dialogRef.afterClosed().subscribe(result => {
        this.MostrarDetalleAuditoria()
    })
    
  } 

  openDialogSubDetalle(Num_Auditoria_Detalle: number, Flg_Status: string){
 
    //if(Flg_Status != 'R' || GlobalVariable.vusu.toUpperCase() == 'RHUAYANA' || GlobalVariable.vusu.toUpperCase() == 'SISTEMAS' || GlobalVariable.vusu.toUpperCase() == 'IVARGAS'){
    if(Flg_Status != 'R' || this.ll_Supervisor){
      let dialogRef = this.dialog.open(DialogVaporizadoDefectosComponent, {
        disableClose: true,
        data: {Num_Auditoria: this.data.Num_Auditoria, Num_Auditoria_Detalle: Num_Auditoria_Detalle, Flg_Status: Flg_Status }
      });

      dialogRef.afterClosed().subscribe(result => {
          this.MostrarDetalleAuditoria()
      });

    }else{
      this.matSnackBar.open('No puede agregar sub detalle a un reproceso..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    
  }

  openDialogRegistrarDetalle(){
 
    let dialogRef = this.dialog.open(DialogRegistrarDetalleVaporizadoAcabadoComponent, {
      disableClose: true,
      data: {Num_Auditoria: this.data.Num_Auditoria}
    });

    dialogRef.afterClosed().subscribe(result => {
       this.MostrarDetalleAuditoria() 
    })
 
  }

  ReprocesoRegistroDetalle(data_det: data_det){
    
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'R');
        formData.append('Num_Auditoria_Detalle', data_det.Num_Auditoria_Detalle.toString());
        formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
        formData.append('Tip_Auditoria', data_det.Tip_Auditoria.toString());
        formData.append('Cod_OrdPro', data_det.Cod_OrdPro); 			
        formData.append('Cod_Cliente', data_det.Cod_Cliente);		
        formData.append('Cod_EstCli', data_det.Cod_EstCli); 			
        formData.append('Cod_Present',data_det.Cod_Present ); 		
        formData.append('Cod_Operario',  data_det.Cod_Operario ); 
        formData.append('Tip_Trabajador_Operario', '' );
        formData.append('Cod_LinPro',  data_det.Cod_LinPro ); 
        formData.append('Can_Muestra', data_det.Can_Muestra.toString()); 		
        formData.append('Observacion', data_det.Observacion); 		
        formData.append('Flg_Status', 'A' ); 			
        formData.append('Flg_Reproceso', '' ); 		
        formData.append('Flg_Reproceso_Num', data_det.Num_Auditoria_Detalle.toString() ); 	
        formData.append('Cod_Usuario', GlobalVariable.vusu ); 		

        this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoDetService(
          formData
        ).subscribe(
          (result: any) => {
            this.MostrarDetalleAuditoria()
            this.matSnackBar.open('Se creo Reproceso de auditoria correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));

        }
      }); 
  }

  ProcesarFicha(){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion         = 'P'
        this.Num_Auditoria      = this.data.Num_Auditoria
        this.Cod_Supervisor     = ''
        this.Cod_Auditor        = ''
        this.Fecha_Auditoria    = ''
        this.Fecha_Auditoria2   = ''
        this.Observacion        = ''
        this.Flg_Status         = 'E'
        this.Cod_OrdPro         = ''

        this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoCabService(
          this.Cod_Accion,
          this.Num_Auditoria,
          this.Cod_Supervisor,
          this.Cod_Auditor,
          this.Fecha_Auditoria,
          this.Fecha_Auditoria2,  
          this.Observacion,
          this.Flg_Status,
          this.Cod_OrdPro
        ).subscribe(
          (result: any) => {
           if(result[0].Respuesta == 'OK'){
            let element: HTMLElement = document.getElementsByClassName('button-close')[0] as HTMLElement;
            element.click();
            this.matSnackBar.open('La auditoria se proceso correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
           }else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }) 
           }
            
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

        }

      })      
  }

  vistaPreviaAuditoria(data_det: data_det) {
     
    let dialogRef = this.dialog.open(VistaPreviaVaporizadoDefectosComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '95vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {

    });
    
  }

  /*
  Validar y establecer accesos CRUD del Usuario
  2024Nov11, Ahmed
  */
  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          //console.log(crud)
          this.mostrar = crud[0].Flg_Insertar == 1 ? true : false;
          this.ll_Supervisor = crud[0].Flg_Verificar == 1 ? true : false;
        } 
      });

  }

}
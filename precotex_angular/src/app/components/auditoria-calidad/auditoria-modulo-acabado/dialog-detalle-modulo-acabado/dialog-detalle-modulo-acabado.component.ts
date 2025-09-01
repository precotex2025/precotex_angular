import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';

import { VistaPreviaModuloDefectosComponent } from '../vista-previa-modulo-defectos/vista-previa-modulo-defectos.component';
import { DialogRegistrarDetalleModuloAcabadoComponent } from '../dialog-registrar-detalle-modulo-acabado/dialog-registrar-detalle-modulo-acabado.component';
import { DialogModuloDefectosComponent } from '../dialog-modulo-defectos/dialog-modulo-defectos.component';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

interface data{
  Cod_Modulo:    string
  Num_Auditoria: number,
  Flg_Status: string,
  Num_Guia: string,
  Num_Bultos : string,
  Num_Precintos: string,
  Status: string,
  Lectura_Manual: string
}

interface data_det {
  Num_Auditoria_Detalle:    number
  Num_Auditoria:            number
  Cod_Inspector:            string
  Nom_Auditor:              string
  Cod_OrdPro:               string
  Cod_Cliente:              string
  Des_Cliente:              string
  Des_EstPro:               string
  Cod_Present:              string
  Des_Present:              string
  Can_Lote:                 number
  Can_Muestra:              number
  Observacion:              string
  Flg_Status:               string
  Cod_Usuario:              string
  Cod_Equipo:               string
  Fecha_Reg:                string
  Can_Defecto:              number
  Cod_EstCli:               string
  Flg_Reproceso:            string
  Flg_Reproceso_Num:        number
  Co_CodOrdPro:             string
  Num_Paquete:              string, 
  Cod_LinPro:               string,
  Flg_Precintos:            string,
  Num_Guia:			            string,
  Num_Bultos:				        string,
  Num_Precintos:			      string,
  Cod_OrdCor:               string,
  Medidas : string,
  Muestra_Fisica : string,
  Checklist: string 
}

@Component({
  selector: 'app-dialog-detalle-modulo-acabado',
  templateUrl: './dialog-detalle-modulo-acabado.component.html',
  styleUrls: ['./dialog-detalle-modulo-acabado.component.scss']
})
export class DialogDetalleModuloAcabadoComponent implements OnInit {

  public data_det = [{
    Num_Auditoria_Detalle:    0,
    Num_Auditoria:            0,
    Cod_Inspector:            '',
    Nom_Auditor:              '',
    Cod_OrdPro:               '',
    Cod_Cliente:              '',
    Des_Cliente:              '',
    Des_EstPro:               '',
    Cod_Present:              '',
    Des_Present:              '',
    Can_Lote:                 0,
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
    Co_CodOrdPro:             '',
    Num_Paquete:              '',
    Cod_LinPro:              '',
    Num_Guia:				   '',
		Num_Bultos:				   '',
		Num_Precintos:			   '',
    Medidas :'',
    Muestra_Fisica : '',
    Checklist: '' 
  }]

 // nuevas variables
  Cod_Modulo              = this.data.Cod_Modulo;
  Cod_Accion              = '';
  Num_Auditoria_Detalle   = 0;
  Num_Auditoria           = this.data.Num_Auditoria;
  Cod_Inspector           = '';
  Cod_OrdPro              = '';
  Cod_Cliente             = '';
  Cod_EstCli              = '';
  Cod_Present             = '' ;
  Can_Lote                = 0;
  Can_Muestra             = 0;
  Observacion             = '';
  Flg_Status              = '';
  Cod_Usuario             = '';
  Cod_Equipo              = '';
  Fecha_Reg               = '';
  Cod_Supervisor          = '';
  Cod_Auditor             = '';
  Fecha_Auditoria         = '';
  Fecha_Auditoria2        = '';
  Flg_Reproceso           = '';
  Flg_Reproceso_Num       = 0;
  Co_CodOrdPro            = '';
  Num_Paquete             = '';
  Rol                     = '';
  mostrar                 = false;
  deshabilitar            = false;
  Cod_OrdCor              = '';
  Lectura_Manual          = this.data.Lectura_Manual;
  ll_Supervisor: boolean = false;

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor:   [''],
    fec_registro: [''],
    auditor:      ['']
  })


  displayedColumns_cab: string[] = ['Num_Auditoria_Detalle','Modulo', 'Cod_OrdPro', 'Nom_Cliente', 'Cod_EstCli', 'Cod_Present', 'Can_Muestra', 'Can_Defecto', 'Flg_Status', 'Acciones']
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
    this.validarCRUDUsuario(191);
    
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

    this.Cod_Accion             = 'L'
    this.Num_Auditoria_Detalle  = 0    
    this.Cod_Inspector          = ''
    this.Cod_OrdPro             = ''
    this.Cod_Cliente            = ''
    this.Cod_EstCli             = ''
    this.Cod_Present            = ''
    this.Can_Lote               = 0
    this.Can_Muestra            = 0
    this.Observacion            = ''
    this.Flg_Status             = ''
    this.Flg_Reproceso          = ''
    this.Flg_Reproceso_Num      = 0
    this.Co_CodOrdPro            = ''
    this.Num_Paquete             = ''

    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Num_Auditoria_Detalle','0');
    formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
    formData.append('Cod_Inspector', ''); 		
    formData.append('Cod_OrdPro', ''); 			
    formData.append('Cod_Cliente', '');		
    formData.append('Cod_EstCli', ''); 			
    formData.append('Cod_Present','' ); 		    		
    formData.append('Can_Muestra', '0'); 		
    formData.append('Observacion', ''); 		
    formData.append('Flg_Status', '' ); 			
    formData.append('Cod_Usuario', '' ); 		
    formData.append('Flg_Reproceso', '' ); 		
    formData.append('Flg_Reproceso_Num', '0' ); 	
    formData.append('Co_CodOrdPro', '' ); 		
    formData.append('Num_Paquete', '' ); 		    
    formData.append('Medidas',  '' ); 
    formData.append('Muestra',  '' );
    formData.append('Checklist',  '' );  
    formData.append('Cod_Lider', '' );
    formData.append('Cod_Dobladora', '' );
    formData.append('Tip_Trabajador_Lider', '' );
    formData.append('Tip_Trabajador_Dobladora', '' );
    
    this.auditoriaAcabadosService.Mant_AuditoriaModuloAcabadoDetService(
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

        this.Cod_Accion             = 'D'
        this.Num_Auditoria_Detalle  = Num_Auditoria_Detalle
        this.Num_Auditoria
        this.Cod_Inspector          = ''
        this.Cod_OrdPro             = ''
        this.Cod_Cliente            = ''
        this.Cod_EstCli             = ''
        this.Cod_Present            = ''
        this.Can_Lote               = 0
        this.Can_Muestra            = 0
        this.Observacion            = ''
        this.Flg_Status             = ''
        this.Flg_Reproceso          = ''
        this.Flg_Reproceso_Num      = 0
        this.Co_CodOrdPro            = ''
        this.Num_Paquete             = ''
        this.Cod_OrdCor             = ''
    
        const formData = new FormData();
        formData.append('Accion', 'D');
        formData.append('Num_Auditoria_Detalle',Num_Auditoria_Detalle.toString());
        formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
        formData.append('Cod_Inspector', ''); 		
        formData.append('Cod_OrdPro', ''); 			
        formData.append('Cod_Cliente', '');		
        formData.append('Cod_EstCli', ''); 			
        formData.append('Cod_Present','' ); 		
        formData.append('Can_Lote', '0'); 			
        formData.append('Can_Muestra', '0'); 		
        formData.append('Observacion', ''); 		
        formData.append('Flg_Status', '' ); 			
        formData.append('Cod_Usuario', '' ); 		
        formData.append('Flg_Reproceso', '' ); 		
        formData.append('Flg_Reproceso_Num', '0' ); 	
        formData.append('Co_CodOrdPro', '' ); 		
        formData.append('Num_Paquete', '' ); 		
        formData.append('Cod_OrdCor', '' ); 	
        formData.append('Medidas',  '' ); 
        formData.append('Muestra',  '' );
        formData.append('Checklist',  '' ); 
        formData.append('Cod_Lider', '' );
        formData.append('Cod_Dobladora', '' );
        formData.append('Tip_Trabajador_Lider', '' );
        formData.append('Tip_Trabajador_Dobladora', '' );

        this.auditoriaAcabadosService.Mant_AuditoriaModuloAcabadoDetService(
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

  ModificarRegistroDetalle(Num_Auditoria_Detalle: number, Cod_Inspector: string, Nom_Auditor: string, Cod_OrdPro: string, Cod_Cliente: string, Des_Cliente: string, Cod_EstCli: string, Des_EstPro: string,Cod_Present: string, Des_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Flg_Status: string, Flg_Reproceso_Num: number, Cod_OrdCor: string, Cod_Lider: string, Cod_Dobladora: string, Nom_Lider: string, Nom_Dobladora: string) {
 
    let dialogRef = this.dialog.open(DialogRegistrarDetalleModuloAcabadoComponent, {
      disableClose: true,
      data: { Num_Auditoria: this.data.Num_Auditoria,
              Num_Auditoria_Detalle: Num_Auditoria_Detalle,
              Cod_Inspector: Cod_Inspector,
              Nom_Auditor: Nom_Auditor,
              Cod_OrdPro: Cod_OrdPro,
              Cod_Cliente: Cod_Cliente,
              Des_Cliente: Des_Cliente,
              Cod_EstCli: Cod_EstCli,
              Des_EstPro: Des_EstPro,
              Cod_Present: Cod_Present,
              Des_Present: Des_Present,
              Can_Muestra: Can_Muestra,
              Observacion: Observacion,
              Flg_Status: Flg_Status,
              Flg_Reproceso_Num: Flg_Reproceso_Num,
              Cod_OrdCor: Cod_OrdCor,
              Lectura_Manual:  this.data.Lectura_Manual,
              Cod_Lider: Cod_Lider,
              Cod_Dobladora: Cod_Dobladora,
              Nom_Lider: Nom_Lider,
              Nom_Dobladora: Nom_Dobladora
            }
    });

    dialogRef.afterClosed().subscribe(result => {
        this.MostrarDetalleAuditoria()
    })
    
  } 

  openDialogSubDetalle(Num_Auditoria_Detalle: number, Flg_Status: string){
 
    //if(Flg_Status != 'R' || GlobalVariable.vusu.toUpperCase() == 'RHUAYANA' || GlobalVariable.vusu.toUpperCase() == 'SISTEMAS' || GlobalVariable.vusu.toUpperCase() == 'IVARGAS'){
    if(Flg_Status != 'R' || this.ll_Supervisor){
      let dialogRef = this.dialog.open(DialogModuloDefectosComponent, {
        disableClose: true,
        data: {Num_Auditoria: this.data.Num_Auditoria, Num_Auditoria_Detalle: Num_Auditoria_Detalle, Flg_Status: Flg_Status }
      });

      dialogRef.afterClosed().subscribe(result => {
          this.MostrarDetalleAuditoria()
      }) 

    }else{
      this.matSnackBar.open('No puede agregar sub detalle a un reproceso..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    
  }

  openDialogRegistrarDetalle(){
 
    let dialogRef = this.dialog.open(DialogRegistrarDetalleModuloAcabadoComponent, {
      disableClose: true,
      data: {Num_Auditoria: this.data.Num_Auditoria,Lectura_Manual:  this.data.Lectura_Manual}
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
  
 
    })
  
  }

  ReprocesoRegistroDetalle(Num_Auditoria_Detalle: number, Cod_Inspector: string, Nom_Auditor: string, Cod_OrdPro: string, Cod_Cliente: string, Des_Cliente: string, Cod_EstCli: string, Des_EstPro: string,Cod_Present: string, Des_Present: string, Can_Lote: number, Can_Muestra: number,Co_CodOrdPro: string, Num_Paquete: string, Observacion: string, Cod_OrdCor: string){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'R');
        formData.append('Num_Auditoria_Detalle',Num_Auditoria_Detalle.toString());
        formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
        formData.append('Cod_Inspector', Cod_Inspector); 		
        formData.append('Cod_OrdPro', Cod_OrdPro); 			
        formData.append('Cod_Cliente', Cod_Cliente);		
        formData.append('Cod_EstCli', Cod_EstCli); 			
        formData.append('Cod_Present',Cod_Present ); 		
        formData.append('Can_Lote', ''); 			
        formData.append('Can_Muestra', Can_Muestra.toString()); 		
        formData.append('Observacion', Observacion); 		
        formData.append('Flg_Status', 'A' ); 			
        formData.append('Cod_Usuario', GlobalVariable.vusu ); 		
        formData.append('Flg_Reproceso', '' ); 		
        formData.append('Flg_Reproceso_Num', Num_Auditoria_Detalle.toString() ); 	
        formData.append('Co_CodOrdPro', Co_CodOrdPro ); 		
        formData.append('Num_Paquete', Num_Paquete ); 		
        formData.append('Cod_OrdCor', Cod_OrdCor ); 	
        formData.append('Medidas',  '' ); 
        formData.append('Muestra',  '' );
        formData.append('Checklist',  '' ); 
        formData.append('Cod_Lider', '' );
        formData.append('Cod_Dobladora', '' );
        formData.append('Tip_Trabajador_Lider', '' );
        formData.append('Tip_Trabajador_Dobladora', '' );
        this.auditoriaAcabadosService.Mant_AuditoriaModuloAcabadoDetService(
          formData
        ).subscribe(
          (result: any) => {
            this.MostrarDetalleAuditoria()
            this.matSnackBar.open('Se creo Reproceso de auditoria correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

        }

      })
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
        this.Cod_Modulo         = ''
        this.Observacion        = ''
        this.Flg_Status         = 'E'
        this.Cod_OrdPro         = ''
        this.Cod_EstCli         = ''
        this.auditoriaAcabadosService.Mant_AuditoriaModuloAcabadoCabService(
          this.Cod_Accion,
          this.Num_Auditoria,
          this.Cod_Supervisor,
          this.Cod_Auditor,
          this.Fecha_Auditoria,
          this.Fecha_Auditoria2,  
          this.Cod_Modulo,
          this.Observacion,
          this.Flg_Status,
          this.Cod_OrdPro,
          this.Cod_EstCli
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
     
    //data_det.Cod_LinPro = this.data.Cod_LinPro;
    let dialogRef = this.dialog.open(VistaPreviaModuloDefectosComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '95vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {

    })
      
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

 
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute } from '@angular/router'; 

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';

import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogProgramacionAuditoriaRegistroComponent } from './dialog-programacion-auditoria-registro/dialog-programacion-auditoria-registro.component';

interface data_det{
  Id_Auditoria?: number;
  Fecha_Programacion?: Date;
  Fec_Programacion?: string;
  Id_TipoAuditoria?: string;
  Cod_EstPro?: string;
  Cod_OrdPro?: string;
  Cod_TemCli?: string;
  Cod_Auditor?: string;
  Observacion?: string;
  Fecha_Registro?: string;
  Fec_Registro?: string;
  Cod_EstCli?: string;
  Cod_Cliente?: string;
  Des_Auditoria?: string;
  Nom_Auditor?: string;
  Flg_KeyProg?: number;
  Ndias?: number;
  IsPcp?: boolean;
}

@Component({
  selector: 'app-programacion-auditoria',
  templateUrl: './programacion-auditoria.component.html',
  styleUrls: ['./programacion-auditoria.component.scss']
})
export class ProgramacionAuditoriaComponent implements OnInit {

  dataForExcel = [];
  dataReporteAuditoria: any[] = [];
  displayedColumns: string[] = ['Id_Auditoria','Fecha_Programacion','Nom_Cliente','Cod_TemCli','Nom_Auditor','Acciones']
  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formulario = this.formBuilder.group({
    Cod_Cliente: [''],
    Cod_TemCli: ['']
  });

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  isPcp: boolean = true;
  isKey: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private exceljsService: ExceljsService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    private spinnerService: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.isPcp = this.route.snapshot.paramMap.get("id") == '1' ? true : false;
    this.validarCRUDUsuario(206);
    this.onListarProgramacionAuditoria();
  }

  onListarProgramacionAuditoria(){
    this.spinnerService.show();
    
    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Auditoria', '0');
    formData.append('Fecha_Programacion', '');
    //formData.append('Id_TipoAuditoria', '0');
    //formData.append('Cod_EstPro', '');
    formData.append('Cod_Cliente', this.formulario.get('Cod_Cliente')?.value);
    formData.append('Cod_TemCli', this.formulario.get('Cod_TemCli')?.value);
    formData.append('Cod_OrdPro', '');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_KeyProg', '0');
    //formData.append('Observacion', '');
    formData.append('Fecha_Registro', this.range.get('start')?.value ? this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Fecha_Registro2', this.range.get('end')?.value ? this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.auditoriaAcabadosService.MantenimientoProgramacionAuditoria(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          //console.log(result)
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {duration: 1500,})
    );
  }

  onAgregarRegistro(){
    let codAuditor: string = GlobalVariable.vtiptra.trim().concat("-").concat(GlobalVariable.vcodtra.trim())
    let data_det: data_det = {Id_Auditoria: 0, Id_TipoAuditoria: "1", Cod_EstCli: "", Cod_TemCli: "", Cod_OrdPro: "", Cod_Auditor: codAuditor, Nom_Auditor: "", Observacion: "", IsPcp: this.isPcp}

    let dialogRef = this.dialog.open(DialogProgramacionAuditoriaRegistroComponent, {
      disableClose: true,
      width: "1350px",
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onListarProgramacionAuditoria();
    });
    
  }

  onEditarRegistro(data_det: data_det){
    data_det.IsPcp = this.isPcp;
    let dialogRef = this.dialog.open(DialogProgramacionAuditoriaRegistroComponent, {
      disableClose: true,
      width: "1550px",
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onListarProgramacionAuditoria();
    });
  }

  onEliminarRegistro(Id_Auditoria: string){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'D');
        formData.append('Id_Auditoria', Id_Auditoria);
        formData.append('Fecha_Programacion', '');
        //formData.append('Id_TipoAuditoria', '0');
        //formData.append('Cod_EstPro', '');
        formData.append('Cod_Cliente', '');
        formData.append('Cod_TemCli', '');
        formData.append('Cod_OrdPro', '');
        formData.append('Cod_Auditor', '');
        formData.append('Flg_KeyProg', '0');
        //formData.append('Observacion', '');
        formData.append('Fecha_Registro', '');
        formData.append('Fecha_Registro2', '');
        formData.append('Cod_Usuario', GlobalVariable.vusu);
    
        this.auditoriaAcabadosService.MantenimientoProgramacionAuditoria(formData)
          .subscribe((result: any) => {
            if(result[0].Id_Auditoria != '0')
              this.onListarProgramacionAuditoria();
            else 
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {duration: 1500,})
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {duration: 1500,})
        );

      }
    });

  }

  onActivarProgramacion(data_det: data_det){
    console.log(data_det)

    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea habilitar la programación N° " + data_det.Id_Auditoria + "?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();
        const formData = new FormData();
        formData.append('Accion', 'U');
        formData.append('Id_Auditoria', data_det.Id_Auditoria.toString());
        formData.append('Fecha_Programacion', data_det.Fec_Programacion);
        formData.append('Cod_Cliente', data_det.Cod_Cliente);
        formData.append('Cod_TemCli', data_det.Cod_TemCli);
        formData.append('Cod_OrdPro', data_det.Cod_OrdPro);
        formData.append('Cod_Auditor', data_det.Cod_Auditor);
        formData.append('Flg_KeyProg', '1');
        formData.append('Fecha_Registro', '');
        formData.append('Fecha_Registro2', '');
        formData.append('Cod_Usuario', GlobalVariable.vusu);
        
        this.auditoriaAcabadosService.MantenimientoProgramacionAuditoria(formData)
          .subscribe((result: any) => {
            console.log(result)
            if(result[0].Id_Auditoria != '0'){
              this.onListarProgramacionAuditoria();
              this.matSnackBar.open('Programación habilitada!', 'Cerrar', {duration: 1500,})
            } else 
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {duration: 1500,})

            this.spinnerService.show();
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {duration: 1500,})
        );

      }
    });

  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;
        if(crud.length > 0){
          this.isKey = crud[0].Flg_Verificar == 1 ? true : false;
        }
      });
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

}

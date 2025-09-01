import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { TejeduriaService } from 'src/app/services/tejeduria.service';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { DialogAddSolicitudAgujasComponent } from './dialog-solicitud-agujas/dialog-add-solicitud-agujas.component';


interface solicitud_agujas{
  Opcion:             string,
  Num_Registro:       string,
  Fecha_Registro:     string,
  Cod_Maquina_Tejeduria:  string,
  Cod_Ordtra:         string,
  Tip_Trabajador:     string,
  Cod_Tejedor:        string,
  Nom_Tejedor:        string,
  Cod_Tipo_Aguja:     string,
  Tipo_Aguja:         string,
  Talon_C1:           string,
  Talon_C2:           string,
  Talon_C3:           string,
  Talon_C4:           string,
  Talon_Pl1:          string,
  Talon_Pl2:          string,
  Cntd :              string 
}
 
interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
}

@Component({
  selector: 'app-solicitud-agujas',
  templateUrl: './solicitud-agujas.component.html',
  styleUrls: ['./solicitud-agujas.component.scss']
})
export class SolicitudAgujasComponent implements OnInit {

  listar_operacionAuditor:      Auditor[] = [];
  filtroOperacionAuditor:       Observable<Auditor[]> | undefined;

  public solicitud_agujas = [{
    Opcion:"",
    Num_Registro: "",
    Fecha_Registro:"",
    Cod_Maquina_Tejeduria: "",
    Cod_Ordtra: "",
    Tip_Trabajador: "",
    Cod_Tejedor:"",
    Nom_Tejedor: "",
    Cod_Tipo_Aguja: "",
    Tipo_Aguja: "",
    Talon_C1: "",
    Talon_C2: "",
    Talon_C3: "",
    Talon_C4: "",
    Talon_Pl1: "",
    Talon_Pl2: "",
    Cntd:""
  }]

  /****************************/
  Opcion = ''
  Num_Registro= ''
  Fecha_Registro:''
  Cod_Maquina_Tejeduria=''
  Cod_Ordtra = ''
  Tip_Trabajador = ''
  Cod_Trabajador=''
  Cod_Tipo_Aguja = ''
  Nom_Trabajador= ''
  Tipo_Aguja = ''
  T1 = ''
  T2 = ''
  T3 = ''
  T4 = ''
  Tp1 = ''
  Tp2 = ''
  Cntd = ''
  Fec_Reg_Ini = ''
  Fec_Reg_Fin = ''

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    OP:           [''],
    Estilo:       [''],
    fec_registro: [''],
    auditor:      [''],
    CodAuditor:   [''] 
  })
  
  displayedColumns: string[] = ['Num_Registro', 'Fecha_Registro', 'Cod_Maquina_Tejeduria', 'Cod_Ordtra', 'Nom_Tejedor', 'Tipo_Aguja','Acciones']  
  dataSourceSol: MatTableDataSource<solicitud_agujas>;


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private TejeduriaService: TejeduriaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSourceSol = new MatTableDataSource()}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.MostrarSolicitud()
  }

  ngAfterViewInit() {    
    this.dataSourceSol.paginator = this.paginator;
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
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  openDialog() {
   let dialogRef = this.dialog.open(DialogAddSolicitudAgujasComponent, {
      disableClose: true,
      minWidth:'800px',
      maxWidth:'98wh',
      position: {
        top: '0px'
      },
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'false') {        
        this.MostrarSolicitud()
        this.openDialog()
      } 
    })
  }

    MostrarSolicitud(){
    this.SpinnerService.show();
    this.Opcion = 'L' 
    this.Num_Registro = ''
    this.Cod_Maquina_Tejeduria = ''
    this.Cod_Ordtra = ''    
    this.Tip_Trabajador = ''
    this.Cod_Trabajador = ''
    this.Cod_Tipo_Aguja = ''
    this.T1 = ''
    this.T2 = ''
    this.T3 = ''
    this.T4 = ''
    this.Tp1 = ''
    this.Tp2 = ''
    this.Cntd =''
    this.Fec_Reg_Ini= this.range.get('start')?.value == null ? '' : this.range.get('start')?.value
    this.Fec_Reg_Fin = this.range.get('end')?.value == null ? '' : this.range.get('end')?.value
    this.TejeduriaService.MantConsultaAguja(
                          this.Opcion,
                          this.Num_Registro,
                          this.Cod_Maquina_Tejeduria,
                          this.Cod_Ordtra,
                          this.Tip_Trabajador,
                          this.Cod_Trabajador,
                          this.Cod_Tipo_Aguja,
                          this.T1,
                          this.T2,
                          this.T3,
                          this.T4,
                          this.Tp1,
                          this.Tp2,
                          this.Cntd,
                          this.Fec_Reg_Ini,
                          this.Fec_Reg_Fin).subscribe(
                            (result : any) => {
                              if (result.length > 0) {                                
                                this.dataSourceSol.data = result                                
                                this.SpinnerService.hide();
                              }
                              else {
                                this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                                this.dataSourceSol.data = []
                                this.SpinnerService.hide();
                              }
                            },
                            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
                              duration: 1500,
                            }))
  }

  EliminarRegistro(Num_Registro: string, Cod_Tipo_Aguja: string) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.SpinnerService.show();
        this.Opcion = 'D' 
        this.Num_Registro = Num_Registro
        this.Cod_Maquina_Tejeduria = ''
        this.Cod_Ordtra = ''    
        this.Tip_Trabajador = ''
        this.Cod_Trabajador = ''
        this.Cod_Tipo_Aguja = Cod_Tipo_Aguja
        this.T1 = ''
        this.T2 = ''
        this.T3 = ''
        this.T4 = ''
        this.Tp1 = ''
        this.Tp2 = ''
        this.Cntd =''
        this.Fec_Reg_Ini= ''
        this.Fec_Reg_Fin = '' 
        this.TejeduriaService.MantConsultaAguja(
          this.Opcion,
          this.Num_Registro,
          this.Cod_Maquina_Tejeduria,
          this.Cod_Ordtra,
          this.Tip_Trabajador,
          this.Cod_Trabajador,
          this.Cod_Tipo_Aguja,
          this.T1,
          this.T2,
          this.T3,
          this.T4,
          this.Tp1,
          this.Tp2,
          this.Cntd,
          this.Fec_Reg_Ini,
          this.Fec_Reg_Fin).subscribe(     
          (result: any) => {
            if(result[0].Cntd == 'OK'){            
            this.MostrarSolicitud()
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
}


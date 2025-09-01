import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { CheckListService } from 'src/app/services/check-list.service';
import { DialogDetalleReprocesoComponent } from '../dialog-detalle-reproceso/dialog-detalle-reproceso.component';

interface Investigacion {
  Id_Investigacion: string;
  Id_CheckList: string;
  Tipo: string;
  Descripcion: string;
  Fec_Registro: string;
}

interface PlanAccion {
  Id_Plan_Accion: string;
  Id_CheckList: string;
  Actividad: string;
  Fec_Registro: string;
}

interface data_det {
  Auditor_Calidad: string;
  Cantidad: string;
  Cod_Cliente: string;
  Cod_EstCli: string;
  Cod_OrdPro: string;
  Cod_TemCli: string;
  Cod_Usuario: string;
  Color: string;
  Fecha_Registro: string;
  Flg_Aprobado: string;
  Flg_Bordado: string;
  Flg_Estampado: string;
  Flg_FichaTecnica: string;
  Flg_ReporteCalidad: string;
  Id_CheckList: string;
  Jefe_Inspeccion: string;
  Lote: string;
  Lote_Tela: string;
  Num_Defectos: string;
  Numero_Defectos: string;
  Supervisor_Calidad: string;
  Tamano_Muestra: string;
  Tamano_Muestra_Porc: string;
  Tipo_Prenda: string;
  Hoja_Rechazo: string;
}

@Component({
  selector: 'app-dialog-crear-reproceso',
  templateUrl: './dialog-crear-reproceso.component.html',
  styleUrls: ['./dialog-crear-reproceso.component.scss']
})
export class DialogCrearReprocesoComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu;




  myControl = new FormControl();
  fec_registro = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Opcion: [''],
    Id_CheckList: [''],
    Corte: [''],
    Costura_Ate: [''],
    Costura_Indep: [''],
    Estampado_Pieza: [''],
    Estampado_Prenda: [''],
    Bordado: [''],
    Lavanderia: [''],
    Inspeccion: [''],
    Acabados: ['']
  });

  Indicaciones: any = '';

  idCabecera: any = '';
  dataSource: MatTableDataSource<Investigacion>;
  dataSource2: MatTableDataSource<PlanAccion>;

  dataDefectos: any = [];
  dataIndicaciones: any = [];

  displayedColumns: string[] = [
    'Cod_OrdPro',
    'Color',
    'Lote',
    'Tamano_Muestra',
    'Numero_Defectos',
    'Tipo_Prenda',
    'Flg_Aprobado',
    'Fecha_Registro',
    'Cod_Usuario',
    'Acciones'
  ];
  displayedColumns2: string[] = ['Actividad', 'Eliminar'];
  columnsToDisplay: string[] = this.displayedColumns.slice();


  flg_btn_cabecera = false;
  mostrarRechazo = false;

  Tipo: any = '';
  Descripcion: any = '';
  Actividad: any = '';

  estado:any = '';
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private checkListService: CheckListService,
    private elementRef: ElementRef,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.formulario.patchValue({
      Id_CheckList: this.data.data
    });
    this.estado = this.data.estado;
    this.listarInvestigacion();
  }

  RegistrarCabecera() {
    this.spinnerService.show();
    console.log(this.formulario.value);
    var Opcion = this.formulario.get('Opcion').value;
    var Id_CheckList = this.formulario.get('Id_CheckList').value;
    var Corte = this.formulario.get('Corte').value == true ? '1' : '0';
    var Costura_Ate = this.formulario.get('Costura_Ate').value == true ? '1' : '0';
    var Costura_Indep = this.formulario.get('Costura_Indep').value == true ? '1' : '0';
    var Estampado_Pieza = this.formulario.get('Estampado_Pieza').value == true ? '1' : '0';
    var Estampado_Prenda = this.formulario.get('Estampado_Prenda').value == true ? '1' : '0';
    var Bordado = this.formulario.get('Bordado').value == true ? '1' : '0';
    var Lavanderia = this.formulario.get('Lavanderia').value == true ? '1' : '0';
    var Inspeccion = this.formulario.get('Inspeccion').value == true ? '1' : '0';
    var Acabados = this.formulario.get('Acabados').value == true ? '1' : '0';

    this.checkListService.CF_CHECK_CREAR_DETECTO_OBS(
      'I',
      Id_CheckList,
      Corte,
      Costura_Ate,
      Costura_Indep,
      Estampado_Pieza,
      Estampado_Prenda,
      Bordado,
      Lavanderia,
      Inspeccion,
      Acabados
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se guardo el registro correctamente', 'Cerrar', { duration: 1500 })
          // this.formulario.disable();

          //this.flg_btn_cabecera = true;
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  listarInvestigacion() {
    this.checkListService.CF_LISTAR_CHECKLIST_REPROCESO(
      'L',
      this.formulario.get('Id_CheckList').value,
      ''
    ).subscribe(
      (result: any) => {
        console.log(result);
        
        if(result.length >= 2){
          this.dataSource.data = result;
        }
        //this.dataSource.data.length
        //this.dataSource.data = result;
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  InsertarFila() {

  }

  eliminarFila(data_det: Investigacion) {
    console.log(data_det)
    this.spinnerService.show();
    this.checkListService.CF_CHECK_CREAR_INVESTIGACION(
      'D',
      data_det.Id_Investigacion,
      this.formulario.get('Id_CheckList').value,
      this.Tipo,
      this.Descripcion
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se Elimino el registro correctamente', 'Cerrar', { duration: 1500 })
          // this.formulario.disable();
          this.Tipo = '';
          this.Descripcion = '';
          this.listarInvestigacion();
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  openCrearReproceso(){

    let dialogRef =  this.dialog.open(DialogDetalleReprocesoComponent, { 
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '100%',
      width: '100%',
      data: {
        data: this.data,
        tipo: 1
      }
    });

    dialogRef.afterClosed().subscribe(result =>{ 

      this.listarInvestigacion();
    })
  }

  editarFila(data_det){
    let dialogRef =  this.dialog.open(DialogDetalleReprocesoComponent, { 
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '100%',
      width: '100%',
      data: {
        datos: data_det,
        tipo: 2
      }
    });

    dialogRef.afterClosed().subscribe(result =>{ 

      this.listarInvestigacion();
    })
  }

  finalizarReproceso(){
    if(confirm('Esta seguro(a) de finalizar el reproceso?')){
      this.checkListService.CF_LISTAR_CHECKLIST_REPROCESO(
        'F',
        this.formulario.get('Id_CheckList').value,
        ''
      ).subscribe(
        (result: any) => {
          console.log(result);
          if(result[0].Respuesta){
            this.matSnackBar.open('Se finalizo el reproceso correctamente.', 'Cerrar', {
              duration: 1500,
            });
          }else{
            this.matSnackBar.open('Ha ocurrido un error al finalizar el reproceso.', 'Cerrar', {
              duration: 1500,
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })
    } 
    
  }

  eliminarCheckList(data_det:data_det){
    if(confirm('Esta seguro de eliminar este registro?')){
      const formData = new FormData();
      formData.append('Opcion', 'K');
      formData.append('Id_CheckList', data_det.Id_CheckList);
      formData.append('Cod_OrdPro', '');
      formData.append('Cod_Cliente', '');
      formData.append('Cod_EstCli', '');
      formData.append('Tipo_Prenda', '');
      formData.append('Des_Present', '');
      formData.append('Cantidad', '');
      formData.append('Cod_TemCli', '');
      formData.append('Lote_Tela', '');
      formData.append('Lote', '');
      formData.append('Tamano_Muestra', '');
      formData.append('Numero_Defectos', '');
      formData.append('Tamano_Muestra_Porc', '0');
      formData.append('Num_Defectos', '0');
      formData.append('Flg_Aprobado', '');
      formData.append('Flg_FichaTecnica', '');
      formData.append('Flg_ReporteCalidad', '');
      formData.append('Flg_Estampado', '');
      formData.append('Flg_Bordado', '');
      formData.append('Cod_Usuario', '');
      formData.append('Ruta_Prenda', '');
      formData.append('Linea', '');
      formData.append('chk_go', "0");
      formData.append('chk_jc', "0");

      this.spinnerService.show();
      this.checkListService.Cf_Mantenimiento_CheckList(formData)
        .subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.listarInvestigacion();
          this.matSnackBar.open('Registro eliminado correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          

        } else {
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }
  }
}

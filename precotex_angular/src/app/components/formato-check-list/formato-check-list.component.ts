import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

import { ExceljsService } from 'src/app/services/exceljs.service';
import { DialogCrearCheckComponent } from './dialog-crear-check/dialog-crear-check.component';
import { CheckListService } from 'src/app/services/check-list.service';
import { DialogEditarCheckComponent } from './dialog-editar-check/dialog-editar-check.component';
import { DialogCheckRechazoComponent } from './dialog-check-rechazo/dialog-check-rechazo.component';
import { DialogCrearReprocesoComponent } from './dialog-crear-reproceso/dialog-crear-reproceso.component';
import { VistaPreviaCheckComponent } from './vista-previa-check/vista-previa-check.component';
import { GlobalVariable } from 'src/app/VarGlobals';

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
  Flg_Estado: string;
  Ruta_Prenda: string;
  Linea: string;
  Cod_Cli: string;
  Id_Reauditoria: number;
	chk_go: number;
	chk_jc: number;
}

@Component({
  selector: 'app-formato-check-list',
  templateUrl: './formato-check-list.component.html',
  styleUrls: ['./formato-check-list.component.scss']
})
export class FormatoCheckListComponent implements OnInit {

  Cod_Accion = ''
  Num_Grupo = 0
  Cod_OrdPro = ""
  Cod_Present = 0
  Des_Present = ""
  Flg_Aprobado = ""
  Nom_Motivo = ""
  Cod_Usuario = ""
  Fec_Creacion = ""
  Cod_Usuario_Aprobacion = ""
  Fec_Creacion_Aprobacion = ""
  Id_Motivo = 0
  Fec_Inicio = ''
  Fec_Fin = ''
  dataForExcel = []
  Cod_OrdTra = ""
  estado = "PENDIENTE";
  partida = "";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    Cod_OrdPro: [''],
    estado: [''],
    partida: [''],
    Hoja_Rechazo: ['']
  })


  estados = [
    {
      id: 'R',
      estado: 'RECHAZADO'
    },
    {
      id: 'A',
      estado: 'APROBADO'
    },
    {
      id: 'P',
      estado: 'REPROCESO'
    }
  ];

  dataSource: MatTableDataSource<data_det>;
  displayedColumns_cab: string[] = [
    'Cod_Cliente',
    'Cod_EstCli',
    'Cod_OrdPro',
    'Color',
    'Cantidad',
    'Lote',
    'Tamano_Muestra',
    'Numero_Defectos',
    'Tipo_Prenda',
    'Flg_Aprobado',
    'Fecha_Registro',
    'Cod_Usuario',
    'ACCIONES'
  ];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private checkListService: CheckListService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private exceljsService: ExceljsService, private spinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }



  ngOnInit(): void {
    this.listarCabecera();

  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  generateExcel() {
    let dialogRef = this.dialog.open(DialogCrearCheckComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {

      this.listarCabecera();

    })
  }

  exportarExcel(accion: string) {
    this.SpinnerService.show();
    this.Fec_Inicio = this.range.get('start')?.value
    this.Fec_Fin = this.range.get('end')?.value

    this.checkListService.CF_REPORTE_CHECKLIST(accion, this.Fec_Inicio, this.Fec_Fin).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result.length > 0) {
          this.dataForExcel = [];
          result.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row))
          })

          let reportData = {
            title: (accion == 'L' ? 'REPORTE' : 'RESUMEN') + ' INGRESO CHECKLIST',
            data: this.dataForExcel,
            headers: Object.keys(result[0])
          }

          this.exceljsService.exportExcel(reportData);
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => 
      {
      this.spinnerService.hide();
      this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    
    })
  }

  listarCabecera() {
    //CF_LISTAR_CHECKLIST
    this.SpinnerService.show();

    this.checkListService.CF_LISTAR_CHECKLIST(this.range.get('start')?.value, this.range.get('end')?.value, this.formulario.get('Cod_OrdPro').value, this.formulario.get('partida').value, this.formulario.get('estado').value, this.formulario.get('Hoja_Rechazo').value).subscribe((res: any) => {
      console.log(res);
      this.SpinnerService.hide();
      if (res.length > 0) {
        this.dataSource.data = res;
      } else {
        this.dataSource.data = [];
        this.matSnackBar.open('No se encontraron registros.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }

    }, ((err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.SpinnerService.hide();
    }))
  }


  editarCheckList(data_det: data_det) {
    console.log(data_det);
    let dialogRef = this.dialog.open(DialogEditarCheckComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listarCabecera();

    })
  }


  vistaPreviaCheckList(data_det: data_det) {
    console.log(data_det);
    let dialogRef = this.dialog.open(VistaPreviaCheckComponent, {
      disableClose: false,
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

  abrirRechazo(data_det: data_det) {
    let dialogRef = this.dialog.open(DialogCheckRechazoComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '95vw',
      maxHeight: '95vh',
      height: '100%',
      width: '100%',
      data: data_det.Id_CheckList
    });

    dialogRef.afterClosed().subscribe(result => {


    })
  }

  openReproceso(data_det: data_det) {
    console.log(data_det);

    let dialogRef = this.dialog.open(DialogCrearReprocesoComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '95vw',
      maxHeight: '95vh',
      height: '100%',
      width: '100%',
      data:
      {
        data: data_det.Id_CheckList,
        estado: data_det.Flg_Estado
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listarCabecera();

    })
  }

  onReauditoria(data_det: data_det){
    if (confirm('Esta seguro de generar una nueva auditoria?')){

      const formData = new FormData();
      formData.append('Opcion', 'R');
      formData.append('Id_CheckList', data_det.Id_CheckList);
      formData.append('Cod_OrdPro', data_det.Cod_OrdPro);
      formData.append('Cod_Cliente', data_det.Cod_Cli);
      formData.append('Cod_EstCli', data_det.Cod_EstCli);
      formData.append('Tipo_Prenda', data_det.Tipo_Prenda);
      formData.append('Des_Present', data_det.Color);
      formData.append('Cantidad', data_det.Cantidad);
      formData.append('Cod_TemCli', data_det.Cod_TemCli);
      formData.append('Lote_Tela', data_det.Lote_Tela);
      formData.append('Lote', data_det.Lote);
      formData.append('Tamano_Muestra', data_det.Tamano_Muestra);
      formData.append('Numero_Defectos', data_det.Numero_Defectos);
      formData.append('Tamano_Muestra_Porc', data_det.Tamano_Muestra_Porc);
      formData.append('Num_Defectos', data_det.Num_Defectos);
      formData.append('Flg_Aprobado', '');
      formData.append('Flg_FichaTecnica', data_det.Flg_FichaTecnica);
      formData.append('Flg_ReporteCalidad', data_det.Flg_ReporteCalidad);
      formData.append('Flg_Estampado', data_det.Flg_Estampado);
      formData.append('Flg_Bordado', data_det.Flg_Bordado);
      formData.append('Cod_Usuario', GlobalVariable.vusu);
      formData.append('Ruta_Prenda', data_det.Ruta_Prenda);
      formData.append('Linea', data_det.Linea);
      formData.append('chk_go', "0");
      formData.append('chk_jc', "0");

      this.checkListService.Cf_Mantenimiento_CheckList(formData)
        .subscribe(res => {
        
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.listarCabecera();
          this.matSnackBar.open('Se registro la reauditoria correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

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

  eliminarCheckList(data_det: data_det) {
    if (confirm('Esta seguro de eliminar este registro?')) {
      const formData = new FormData();
      formData.append('Opcion', 'D');
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
          this.listarCabecera();
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




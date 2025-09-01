import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { DialogObservacionAperturaComponent } from './dialog-observacion-apertura/dialog-observacion-apertura.component';

interface data_det {
  Cliente: string,
  Cod_Cliente: string,
  Grupo_Textil: string,
  Cierre_Girado: string,
  Cierre_Liquidado: string,

}

@Component({
  selector: 'app-confecciones-apertura-textil',
  templateUrl: './confecciones-apertura-textil.component.html',
  styleUrls: ['./confecciones-apertura-textil.component.scss']
})
export class ConfeccionesAperturaTextilComponent implements OnInit {

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    codCliente: [''],
    codGrupoTextil: ['']
  })

  Fec_Inicio = ''
  Fec_Fin = ''
  ticket: any = '';
  usuario: any = '';
  dataResult: any = [];

  filtro: any;

  displayedColumns_cab2: string[] = [
    'Cliente',
    'Grupo_Textil',
    'Cierre_Girado',
    'Cierre_Liquidado'
  ]
  dataSource: MatTableDataSource<data_det>;



  dataForExcel: Array<any> = [];
  dataCliente: Array<any> = [];
  dataGrupoTextil: Array<any> = [];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService, private exceljsService: ExceljsService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    this.MostrarCabeceraPaquetes()
    this.buscarPorClienteGrupo();
  }

  clearDate(event) {
    event.stopPropagation();

  }


  ngAfterViewInit() {
    console.log(this.paginator);
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

  buscarPorClienteGrupo() {
    var cliente = this.formulario.get('codCliente')!.value;
    var grupo = this.formulario.get('codGrupoTextil')!.value;

    if(cliente == null || cliente == undefined){
      cliente = '';
    }

    if(grupo == null || grupo == undefined){
      grupo = '';
    }

    this.seguridadControlVehiculoService.listaGrupoTextilCorte(cliente, grupo).subscribe((res: any) => {
      console.log(res);
      this.dataSource.data = res;

    }, (err: HttpErrorResponse) => {

    })
  }

  aperturaGirado(data_det: any) {
    let dialogRef = this.dialog.open(DialogObservacionAperturaComponent, {
      disableClose: true,
      panelClass: 'my-class',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result == 'false') {
        //this.getPostulantes();
      } else {
        

        let datos = {
          grupo_textil : data_det.Grupo_Textil,
          cod_cliente : data_det.Cod_Cliente,
          usuario : GlobalVariable.vusu,
          observacion : result
        }
        this.seguridadControlVehiculoService.AperturaCierreGirado(datos).subscribe({
          next: (response:any) => {
            console.log(response);
            if(response == false){
              this.matSnackBar.open('Se actualizo correctamente el registro', 'Cerrar', {
                duration: 1500,
              })
               this.buscarPorClienteGrupo();
            }else if(response[0].Respuesta == 'OK'){

              this.matSnackBar.open(response[0].Respuesta, 'Cerrar', {
                duration: 1500,
              })
              this.buscarPorClienteGrupo();
            }

          },
          error: (error:HttpErrorResponse) => {
            console.log(error);
            this.dataSource.data = [];
            this.matSnackBar.open(error.message, 'Cerrar', {
              duration: 1500,
            })
            this.buscarPorClienteGrupo();
          }
        });
      }
    
    })
  }
  aperturaLiquidacion(data_det: any) {
    let dialogRef = this.dialog.open(DialogObservacionAperturaComponent, {
      disableClose: true,
      panelClass: 'my-class',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result == 'false') {
        //this.getPostulantes();
      } else {
        let datos = {
          grupo_textil : data_det.Grupo_Textil,
          cod_cliente : data_det.Cod_Cliente,
          usuario : GlobalVariable.vusu,
          observacion : result
        }
        this.seguridadControlVehiculoService.CoAperturaCierreLiquidado(datos).subscribe({
          next: (response:any) => {
            console.log(response);
            if(response == false){
              this.matSnackBar.open('Se actualizo correctamente el registro', 'Cerrar', {
                duration: 1500,
              })
               this.buscarPorClienteGrupo();
            }else if(response[0].Respuesta == 'OK'){

              this.matSnackBar.open(response[0].Respuesta, 'Cerrar', {
                duration: 1500,
              })
              this.buscarPorClienteGrupo();
            }

          },
          error: (error:HttpErrorResponse) => {
            console.log(error);
            this.dataSource.data = [];
            this.matSnackBar.open(error.message, 'Cerrar', {
              duration: 1500,
            })
            this.buscarPorClienteGrupo();
          }
        });
      }
    
    })
  }

  selectCliente(event){
    console.log(event)
    this.MostrarCabeceraPaquetes();
  }
  MostrarCabeceraPaquetes() {
    var cliente = this.formulario.get('codCliente')!.value;
    

    if(cliente == null || cliente == undefined){
      cliente = '';
    }
    this.seguridadControlVehiculoService.listarClientesGrupo(cliente).subscribe(res => {
      console.log(res);
      this.dataCliente = res['clientes'];
      this.dataGrupoTextil = res['grupos_textil'];
    }, (err: HttpErrorResponse) => {

    })
  }
  InputSearch() {
    var nombre = this.formulario.get('Usuario').value;
    var array = this.dataResult;

    var filtrado = this.dataResult;

    if (nombre != '') {
      var filtro = [];
      filtro = filtrado.filter(element => {
        return element.Nom_usuario.toUpperCase().match(nombre.toUpperCase()) || element.Cod_Trabajador.toUpperCase().match(nombre.toUpperCase());
      });
      this.dataSource.data = filtro;
    } else {
      this.dataSource.data = array;
    }
  }

  EliminarRegistro(Nro_DocIde: string, Cod_Conductor: string) {
    console.log(Cod_Conductor)
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {



      }

    })
  }





  actualizarEstadoConductor(Cod_Conductor: string) {

  }

  AsignarNumAuditoriaModificar(Nro_DocIde: string, Cod_Conductor: string) {

  }


}

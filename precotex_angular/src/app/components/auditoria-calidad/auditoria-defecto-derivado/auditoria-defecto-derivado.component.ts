import { Component, OnInit, AfterViewInit, inject,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';
import { startWith, map,debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

interface data_det {
  Num_Auditoria: string,
  Fec_Auditoria: string,
  Cod_Auditor: string,
  Nom_Cliente: string,
  Cod_EstCli: string,
  Cod_ColCli: string,
  Total: string,
  Cantidad_Total: string,
  
}

interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}

interface Estilo {
  Cod_EstCli: string;
  
}

interface Color {
  Cod_ColCli: string;
  
}

@Component({
  selector: 'app-auditoria-defecto-derivado',
  templateUrl: './auditoria-defecto-derivado.component.html',
  styleUrls: ['./auditoria-defecto-derivado.component.scss']
})
export class AuditoriaDefectoDerivadoComponent implements OnInit {

 
  listar_operacionCliente:    Cliente [] = [];
  listar_operacionEstilo:     Estilo  [] = [];
  listar_operacionColor:      Color   [] = [];
  filtroOperacionCliente:     Observable<Cliente []> | undefined;
  filtroOperacionEstilo:      Observable<Estilo  []> | undefined;
  filtroOperacionColor:       Observable<Color   []> | undefined;

  public data_det = [{
    Num_Auditoria:  "",
    Fec_Auditoria:  "",
    Cod_Auditor:    "",
    Nom_Cliente:    "",
    Cod_EstCli:     "",
    Cod_ColCli:     "",
    Cantidad_Total: "",
 
   }] 
   
  Cod_Accion      = ''
  Cod_Cliente     =''
  Abr             = ''
  Nom_Cliente     = ''

  

  Codigo_Auditoria_a_Modificar = ''

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
   sCliente:      [''],
   sEstilo:       [''],
   sColor:        [''],
   sAuditor:      [''],
   fec_registro:  ['']
  })  



  displayedColumns_cab: string[] = ['nAuditoria','Fecha','Auditor', 'Cliente', 'Estilo', 'Color','Total','Especiales', 'Cant','modificar','detalle']
  dataSource: MatTableDataSource<data_det>;
  


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService,
    public dialog: MatDialog) {  this.dataSource = new MatTableDataSource();}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.CargarOperacionCliente()
    this.CargarOperacionEstilo()
    this.CargarOperacionColor()
    //this.buscarDefectosDerivados()
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

  /***************************** limpiar el input fecha  ************************** */

  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['fec_registro'].setValue('')
  }
  /***************************** limpiar el input fecha  ************************** */


  /***************************** abrir el matdialog para agregar cabcera o registro  ************************** */

  openDialog() {


  }
  /***************************** abrir el matdialog para agregar cabcera o registro  ************************** */

  /***************************** lisatr la cabecera  ************************** */
  buscarDefectosDerivados(){
   /* if(this.formulario.get('sCliente')?.value == ''){
      this.Cod_Cliente = ''
    }

    this.Cod_Accion     = 'L'
    this.Num_Auditoria  = 0
    this.Cod_Cliente
    this.Cod_Auditor    = ''
    this.Fec_Auditoria  = this.formulario.get('fec_registro')?.value
    this.Total          = 0
    this.Cod_EstCli     = this.formulario.get('sEstilo')?.value
    this.Cod_TemCli     = ''
    this.Cod_ColCli     = this.formulario.get('sColor')?.value
    this.Glosa          = ''
    this.Cod_Talla      = ''
    this.Cod_Motivo     = ''
    this.Can_Defecto    = 0
    this.Op             = ''
   

    this.defectosAlmacenDerivadosService.Cf_Mantenimiento_Derivados(
      this.Cod_Accion,
      this.Num_Auditoria, 
      this.Cod_Cliente,
      this.Cod_Auditor,
      this.Fec_Auditoria,
      this.Total,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_ColCli,
      this.Glosa,
      this.Cod_Talla,
      this.Cod_Motivo,
      this.Can_Defecto,
      this.Op,
      ).subscribe(
        (result: any) => {
          if(result.length>0){
          if (result[0].Respuesta == undefined) {

            console.log(result[0].Respuesta)
            this.dataSource.data = result
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = []
          }}
          else{
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = []
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))*/
  }
  
  /***************************** lisatr la cabecera  ************************** */

 /***************************** eliminar registros con el icono del tacho  ************************** */
 
  EliminarRegistro(Num_Auditoria: number, Cod_Cliente: string, Cod_EstCli: string, Cod_ColCli: string){

}
 /***************************** eliminar registros con el icono del tacho  ************************** */

/***************************** llenar select de cliente ************************** */

CargarOperacionCliente(){
 
  this.listar_operacionCliente = [];
  this.Abr = ''
  this.Cod_Cliente = ''
  this.Nom_Cliente = this.formulario.get('sCliente')?.value
  this.Cod_Accion = 'L'
  this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr,this.Cod_Cliente,this.Nom_Cliente,this.Cod_Accion).subscribe(
    (result: any) => {
      this.listar_operacionCliente = result
      this.RecargarOperacionCliente()
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}


RecargarOperacionCliente(){
  this.filtroOperacionCliente = this.formulario.controls['sCliente'].valueChanges.pipe(
    startWith(''),
    map(option => (option ? this._filterOperacionCliente(option) : this.listar_operacionCliente.slice())),
  );
  
}

private _filterOperacionCliente(value: string): Cliente[] {
  if (value == null || value == undefined ) {
    value = ''
    
  }

  const filterValue = value.toLowerCase();

  return this.listar_operacionCliente.filter(option => option.Nom_Cliente.toLowerCase().includes(filterValue));
}


CambiarValorCliente(Cod_Cliente: string, Abr_Cliente: string){
  this.Cod_Cliente = Cod_Cliente
}


/***************************** llenar select de cliente ************************** */


/***************************** asignar num auditoria y abrir el mat dialog para agregar detalle o editar ************************** */

AsignarNumAuditoriaModificar(cod: string){

}

/***************************** asignar num auditoria y abrir el mat dialog para agregar detalle o editar ************************** */

/***************************** cargar select de estilo  ************************** */


CargarOperacionEstilo(){

  this.listar_operacionEstilo = [];
  this.Abr = ''
  this.Cod_Cliente = ''
  this.Nom_Cliente = ''
  this.Cod_Accion = 'E'
  this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr,this.Cod_Cliente,this.Nom_Cliente,this.Cod_Accion).subscribe(
    (result: any) => {
      this.listar_operacionEstilo = result
      this.RecargarOperacionEstilo()
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}


RecargarOperacionEstilo(){
  this.filtroOperacionEstilo = this.formulario.controls['sEstilo'].valueChanges.pipe(
    startWith(''),
    map(option => (option ? this._filterOperacionEstilo(option) : this.listar_operacionEstilo.slice())),
  );
  
}
private _filterOperacionEstilo(value: string): Estilo[] {
  if (value == null || value == undefined ) {
    value = ''
    
  }

  const filterValue = value.toLowerCase();

  return this.listar_operacionEstilo.filter(option => option.Cod_EstCli.toLowerCase().includes(filterValue));
}


/***************************** cargar select de estilo  ************************** */


/***************************** cargar select de color  ************************** */

CargarOperacionColor(){

  this.listar_operacionColor = [];
  this.Abr = ''
  this.Cod_Cliente = ''
  this.Nom_Cliente = '' 
  this.Cod_Accion = 'C'
  this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr,this.Cod_Cliente,this.Nom_Cliente,this.Cod_Accion).subscribe(
    (result: any) => {
      this.listar_operacionColor = result
      this.RecargarOperacionColor()
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}


RecargarOperacionColor(){
  this.filtroOperacionColor = this.formulario.controls['sColor'].valueChanges.pipe(
    startWith(''),
    map(option => (option ? this._filterOperacionColor(option) : this.listar_operacionColor.slice())),
  );
  
}
private _filterOperacionColor(value: string): Color[] {
  if (value == null || value == undefined ) {
    value = ''
    
  }

  const filterValue = value.toLowerCase();

  return this.listar_operacionColor.filter(option => option.Cod_ColCli.toLowerCase().includes(filterValue));
}


/***************************** cargar select de color  ************************** */


ingresarCantidadTotal(Num_Auditoria: number, Total: number){

}




verObservacion(Num_Auditoria: number){
}


openReporte(){
 
}


}



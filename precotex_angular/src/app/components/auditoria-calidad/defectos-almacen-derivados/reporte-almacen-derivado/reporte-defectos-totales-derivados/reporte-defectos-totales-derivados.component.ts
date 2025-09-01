import { Component, OnInit, AfterViewInit, inject,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators,FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';
import { startWith, map,debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';

interface data_det {
  Cod_Auditor: string,
  Nom_Cliente: string,
  Cod_EstCli: string,
  Cod_ColCli: string,
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

interface Temporada {
  Cod_TemCli: string;
  Nom_TemCli: string;
}

@Component({
  selector: 'app-reporte-defectos-totales-derivados',
  templateUrl: './reporte-defectos-totales-derivados.component.html',
  styleUrls: ['./reporte-defectos-totales-derivados.component.scss']
})
export class ReporteDefectosTotalesDerivadosComponent implements OnInit {

  listar_operacionCliente:  Cliente[] = []
  listar_operacionEstilo:   Estilo[] = []
  listar_operacionColor:   Color[] = []
  listar_operacionTemporada: Temporada[] = []
  filtroOperacionCliente: Observable<Cliente[]> | undefined;
  filtroOperacionEstilo:  Observable<Estilo[]> | undefined;
  filtroOperacionColor:  Observable<Color[]> | undefined;
  filtroOperacionTemporada:  Observable<Temporada[]> | undefined;

  

  public data_det_excel = [{
    fecha: "",
    hora: "",
    numero_guia:"",
    codigo_jaba: "",
    descripcion:"",
    codigo_barras:"",
    accion: "",
    numero_planta_origen:"", 
    planta_origen:"",
    numero_planta_destino:"",
    planta_destino:"",
    codigo_usuario:"",
    codigo_proveedor:"",
    ruc_proveedor:"",
    proveedor:""
  }] 

  public data_det = [{
    Cod_Auditor: "",
    Nom_Cliente: "",
    Cod_EstCli: "",
    Cod_ColCli: "",
    Cantidad_Total: "",
 
   }] 

  Det:any = [] 
  Cod_Accion=''
  sAbr = ''
  sNom_Cli = ''
  sCod_Cli =''
  vCliente  = ''
  vEstilo   = ''
  vColor    = ''
  vAuditor  = '' 
  vOp  = '' 
  vTemporada = ''
  vTalla = ''
  vCant = ''
  vCod_Accion = ''
  vNum_Auditoria = 0
  vMotivo = ''
  filterValueCliente =''
  Codigo_Auditoria_a_Modificar = ''
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  dCod_Cliente:''
  dCod_TemCli:''

  ItemsSearch: any[] = [
    {id:1, name:'Cliente', checked:'0',disable:true},
    {id:2, name:'Estilo', checked:'0', disable: false},
    {id:3, name:'Temporada', checked:'0', disable: false},
    {id:4, name:'Color', checked:'0', disable: false},
  ]

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
   sCliente: ['',Validators.required],
   sEstilo: [''],
   sTemporada: [''],
   sColor: [''],
   sOP: ['']
  })  

  dataForExcel = [];
  dataForExcel2 = [];
  dataForExcel3 = [];

  dataSource: MatTableDataSource<data_det>;
  displayedColumns: string[] = ['Descripcion','Total'];
  //displayedColumns: string[] = []
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService) {  this.dataSource = new MatTableDataSource();}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadDataInicial()
  }

  loadDataInicial(){
    this.SpinnerService.show();
    this.CargarOperacionCliente()
    //this.CargarOperacionEstilo()
    //this.CargarOperacionColor()
    this.formulario.controls['sEstilo'].disable()
    this.formulario.controls['sTemporada'].disable()
    this.formulario.controls['sColor'].disable()
    this.SpinnerService.hide();
    //this.formulario.controls['sColor'].disable()
  }

generateExcel() {
  console.log(this.dataSource.data)
  this.dataForExcel = [];
  if(this.dataSource.data.length == 0){
    this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
  }
  else{

  this.dataSource.data.forEach((row: any) => {
    this.dataForExcel.push(Object.values(row)) 
  })

  let reportData = {
    title: 'REPORTE DE DEFECTOS DERIVADOS',
    data: this.dataForExcel,
    headers: Object.keys(this.dataSource.data[0])
  }

  this.exceljsService.exportExcel(reportData);
  this.dataForExcel = []
}
}

generateExcel2() {

  this.SpinnerService.show();
  
  /*if(this.formulario.get('sCliente')?.value == ''){
    this.vCliente = ''
  }
  this.vEstilo = this.formulario.get('sEstilo')?.value
  this.vColor = this.formulario.get('sColor')?.value
  this.vAuditor = this.formulario.get('sOP')?.value*/
  this.vCod_Accion = 'L'
  
  this.defectosAlmacenDerivadosService.ListarReporteDetallado3Service(
    this.vCod_Accion,
    this.vCliente,
    this.vEstilo, 
    this.vTemporada,
    this.vColor,
    this.range.get('start')?.value,
    this.range.get('end')?.value
    ).subscribe(
      (result: any) => {
        console.log(result[0].Respuesta)
        if(result.length == 0){   
          this.matSnackBar.open('No hay registros..', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.SpinnerService.hide();
        }else{
          if(result[0].Respuesta){
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.SpinnerService.hide();
            
          }else{
            result.forEach((row: any) => {
              this.dataForExcel2.push(Object.values(row)) 
            })
        
            let reportData = {
              title: 'REPORTE DE DEFECTOS DERIVADOS - PCP',
              data: this.dataForExcel2,
              headers: Object.keys(result[0])
            }
        
            this.exceljsService.exportExcel(reportData);
            this.dataForExcel2 = []
            this.SpinnerService.hide();
          }
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))



}

exportAsXLSX():void {
  
  this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Detallado-Defectos-Derivado');

}

clearDate() {
  //event.stopPropagation();
  this.range.controls['start'].setValue('')
  this.range.controls['end'].setValue('')
}

buscarDefectosDerivados(){
   
  this.SpinnerService.show();
  this.dataSource.data = []
  this.displayedColumns  = ['Descripcion','Total','Total Produccion','Total Recuperado', 'Total Vendible','Total Seg.Exp','Total Seg.Adic2','Total Seg.Adic3'];
  this.columnsToDisplay = this.displayedColumns.slice();
  /*if(this.formulario.get('sCliente')?.value == ''){
    this.vCliente = ''
  }
  this.vEstilo = this.formulario.get('sEstilo')?.value
  this.vColor = this.formulario.get('sColor')?.value
  this.vAuditor = this.formulario.get('sOP')?.value*/
  this.vCod_Accion = 'T'
  this.ItemsSearch.forEach(element => {
    switch (element.id) {
      case 1:
        //this.vCliente = (element.checked == '1') ? this.formulario.get('sCliente').value:''
        this.vCliente = (element.checked == '1') ? this.dCod_Cliente:''
        break
      case 2:
        this.vEstilo = (element.checked == '1') ? this.formulario.get('sEstilo').value:''
        break
      case 3:
        //this.vTemporada = (element.checked == '1') ? this.formulario.get('sTemporada').value:''
        this.vTemporada = (element.checked == '1') ? this.dCod_TemCli:''
        break
      case 4:
        this.vColor = (element.checked == '1') ? this.formulario.get('sColor').value:''
        break
    }
  });
  
  console.log(
    'accion: ', this.vCod_Accion,
    'cliente: ', this.vCliente, 
    'estilo: ', this.vEstilo, 
    'temporada: ', this.vTemporada, 
    'color: ', this.vColor, 
    'fIni: ', this.range.get('start')?.value,
    'fFin: ', this.range.get('end')?.value)
  
  this.defectosAlmacenDerivadosService.ListarReporteDetalladoService(
    this.vCod_Accion,
    this.vCliente,
    this.vEstilo, 
    this.vTemporada,
    this.vColor,
    this.range.get('start')?.value,
    this.range.get('end')?.value
    ).subscribe(
      (result: any) => {
      
        if(result.length == 0){   
          this.matSnackBar.open('No hay registros..', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.SpinnerService.hide();
        }else{

          if(result[0].Respuesta ){
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.SpinnerService.hide();
          }
          else{
          
            //console.log(result)
            result.forEach((currentValue, index) => {
              // console.log(result[index].Cod_Talla)
                this.displayedColumns.push(result[index].Cod_Talla)
              })
              
            this.columnsToDisplay = this.displayedColumns.slice()
            this.vCod_Accion = 'L'
            this.defectosAlmacenDerivadosService.ListarReporteDetalladoService(
            this.vCod_Accion,
            this.vCliente,
            this.vEstilo,
            this.vTemporada,
            this.vColor,
            this.range.get('start')?.value,
            this.range.get('end')?.value
            ).subscribe(
              (result: any) => {
                // console.log(result)
                this.dataSource.data = result
                this.SpinnerService.hide();
              })
        
          }
        }
        //if(result[0].Respuesta != ''){
        //this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        //}
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
      
}

CargarOperacionCliente(){

  this.listar_operacionCliente = []; 
  this.sAbr = ''
  this.sCod_Cli = ''
  this.sNom_Cli = this.formulario.get('sCliente')?.value
  this.Cod_Accion = 'L'
  //this.SpinnerService.show();
  this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.sAbr,this.sCod_Cli,this.sNom_Cli,this.Cod_Accion).subscribe(
    (result: any) => {
      this.listar_operacionCliente = result
      this.RecargarOperacionCliente()
      //this.SpinnerService.hide();
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

RecargarOperacionTemporada(){
  this.filtroOperacionTemporada = this.formulario.controls['sTemporada'].valueChanges.pipe(
    startWith(''),
    map(option => (option ? this._filterOperacionTemporada(option) : this.listar_operacionTemporada.slice())),
  );
  
}
private _filterOperacionTemporada(value: string): Temporada[] {
  if (value == null || value == undefined ) {
    value = ''
  }

  const filterValue = value.toLowerCase();
  return this.listar_operacionTemporada.filter(option => option.Nom_TemCli.toLowerCase().includes(filterValue));
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

filtraPorOpcion(item: any, condicion:string){
  //console.log(item)
  switch (condicion) {
    case 'cliente':
      this.dCod_Cliente = item.Cod_Cliente
      this.seleccionEstiloxCliente()
      break
    case 'estilo':
      this.seleccionTemporadaxEstilo()
      break
    case 'temporada':
      this.dCod_TemCli = item.Cod_TemCli
      this.seleccionColorxTemporada()
      break
    case 'color':
      this.seleccionColor()
      break
  }

}

limpiarCampos(){

  this.formulario.patchValue({
    sCliente: '',
    sEstilo: '',
    sTemporada: '',
    sColor: '',
    sOP: ''
  })
  this.clearDate()
  this.loadDataInicial()
  this.ItemsSearch.forEach(element => {
      element.checked = '0';
  })

}

seleccionEstiloxCliente(){
  let sCliente = this.dCod_Cliente//this.formulario.get('sCliente')?.value
  this.listar_operacionEstilo = []
  this.listar_operacionTemporada = []
  this.listar_operacionColor = []
  this.formulario.controls['sTemporada'].disable()
  this.formulario.controls['sColor'].disable()
  this.Cod_Accion = 'A'
  this.SpinnerService.show();
  this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(sCliente,'','',this.Cod_Accion).subscribe(
    (result: any) => {
      this.listar_operacionEstilo = result
      this.RecargarOperacionEstilo()
      this.formulario.controls['sEstilo'].setValue('')
      this.formulario.controls['sTemporada'].setValue('')
      this.formulario.controls['sColor'].setValue('')
      this.formulario.controls['sEstilo'].enable()
      this.ItemsSearch.forEach(element => {
        if (element.id == 1) {
          element.checked = '1';
        }
      })
      this.SpinnerService.hide();
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}

seleccionTemporadaxEstilo(){

  let sCliente = this.dCod_Cliente//this.formulario.get('sCliente')?.value
  let sEstilo = this.formulario.get('sEstilo')?.value
  
  this.listar_operacionColor = []
  this.Cod_Accion = 'B'
  this.SpinnerService.show();
  this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(sCliente,sEstilo,'',this.Cod_Accion).subscribe(
    (result: any) => {
      console.log(result)
      this.listar_operacionTemporada = result
      this.RecargarOperacionTemporada()
      this.formulario.controls['sTemporada'].setValue('')
      this.formulario.controls['sColor'].setValue('')
      this.formulario.controls['sTemporada'].enable()
      this.formulario.controls['sColor'].disable()
      
      this.ItemsSearch.forEach(element => {
        if (element.id == 2) {
          element.checked = '1';
        }
      })
      this.SpinnerService.hide();
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

}

seleccionColorxTemporada(){
  let sCliente = this.dCod_Cliente//this.formulario.get('sCliente')?.value
  let sEstilo = this.formulario.get('sEstilo')?.value
  let sTemporada = this.dCod_TemCli//this.formulario.get('sTemporada')?.value
  this.Cod_Accion = 'G'
  this.SpinnerService.show();
  this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(sCliente,sEstilo,sTemporada,this.Cod_Accion).subscribe(
    (result: any) => {
      //console.log(result)
      this.listar_operacionColor = result
      this.RecargarOperacionColor()
      this.formulario.controls['sColor'].setValue('')
      this.formulario.controls['sColor'].enable()
      this.ItemsSearch.forEach(element => {
        if (element.id == 3) {
          element.checked = '1';
        }
      })
      this.SpinnerService.hide();
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}

seleccionColor(){
  this.ItemsSearch.forEach(element => {
    if (element.id == 4) {
      element.checked = '1';
    }
  })
}

changeCheck(event, item) {
  console.log(item)
  if (event.checked) {

    this.ItemsSearch.forEach(element => {

      if (element.id == item.id) {
        element.checked = '1';
      }

    });
  } else {

    this.ItemsSearch.forEach(element => {
      if (element.id == item.id) {
        element.checked = '0';
      }
    });
  }

}

obtenerObjetoDeValor(valor: string): any {
  //return this.listar_operacionCliente.findIndex(objeto => objeto.Cod_Cliente === valor);
  return this.listar_operacionCliente.find(objeto => objeto.Cod_Cliente === valor);
}

generateRptSegundas(){
  
  this.vCod_Accion = 'Z'
  this.SpinnerService.show();
  
  this.defectosAlmacenDerivadosService.ListarReporteDetalladoService(
    this.vCod_Accion,
    this.vCliente,
    this.vEstilo, 
    this.vTemporada,
    this.vColor,
    this.range.get('start')?.value,
    this.range.get('end')?.value
    ).subscribe(
      (result: any) => {
        console.log(result)
        if(result.length == 0){   
          this.matSnackBar.open('No hay registros..', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.SpinnerService.hide();
        }else{
          if(result[0].Respuesta){
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.SpinnerService.hide();
          }else{
            //console.log('generar reporte excel')
            result.forEach((row: any) => {
              this.dataForExcel3.push(Object.values(row)) 
            })
        
            let reportData = {
              title: 'REPORTE CLASIFICACIÓN SEGUNDAS',
              data: this.dataForExcel3,
              headers: Object.keys(result[0])
            }
        
            this.exceljsService.exportExcel(reportData);
            this.dataForExcel3 = []
            this.SpinnerService.hide();
          }
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
    }))
}
generateRptPedidos(){
  this.vCod_Accion = 'P'
  this.SpinnerService.show();
  
  this.defectosAlmacenDerivadosService.ListarReporteDetalladoService(
    this.vCod_Accion,
    this.vCliente,
    this.vEstilo, 
    this.vTemporada,
    this.vColor,
    this.range.get('start')?.value,
    this.range.get('end')?.value
    ).subscribe(
      (result: any) => {
        console.log(result)
        if(result.length == 0){   
          this.matSnackBar.open('No hay registros..', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.SpinnerService.hide();
        }else{
          if(result[0].Respuesta){
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.SpinnerService.hide();
          }else{
            //console.log('generar reporte excel')
            result.forEach((row: any) => {
              this.dataForExcel3.push(Object.values(row)) 
            })
        
            let reportData = {
              title: 'REPORTE PEDIDOS',
              data: this.dataForExcel3,
              headers: Object.keys(result[0])
            }
        
            this.exceljsService.exportExcel(reportData);
            this.dataForExcel3 = []
            this.SpinnerService.hide();
          }
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
    }))
}

}


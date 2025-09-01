import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { TintoreriaService } from 'src/app/services/tintoreria.service';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { Capacidades } from 'src/app/models/Tintoreria/Capacidades';
import { FamArticulo } from 'src/app/models/Tintoreria/FamArticulo';
import { Cliente } from 'src/app/models/Cliente';
import { TipAncho } from 'src/app/models/Tintoreria/TipAncho';
import { DialogAddCapacidadesComponent } from './dialog-capacidades/dialog-add-capacidades.component';
import { ExceljsService } from 'src/app/services/exceljs.service';

@Component({
  selector: 'app-capacidades',
  templateUrl: './capacidades.component.html',
  styleUrls: ['./capacidades.component.scss']
})
export class CapacidadesComponent implements OnInit {

  listar_FamArticulo: FamArticulo[] = [];
  listar_Cliente: Cliente[] = [];
  listar_TipAncho: TipAncho[] = [];
  
  filtroFamArticulo:  Observable<FamArticulo[]> | undefined;
  filtroCliente:  Observable<Cliente[]> | undefined;
  filtroTipAncho:  Observable<TipAncho[]> | undefined;

  dataForExcel = [];
  public capacidades = [{
    Opcion:"",
    Fec_Creacion:"",
    Cod_Familia:"",
    Cod_Tela:"",
    Cod_Cliente:"",
    Nom_Cliente:"",
    Tip_Ancho:"",
    Des_Tip_Ancho:"",
    Cod_Gama:"",
    Des_Gama:"",
    Eco_Master:"",
    IMaster:"",
    TRD:"",
    ATYC:"",
    MS: "",
    Obs_Eco_Master:"",
    Obs_IMaster:"",
    Obs_TRD:"",
    Obs_ATYC:"",
    Obs_MS: "",
    Fec_Reg_Ini:"",
    Fec_Reg_Fin:"",
  }]

  /****************************/
  Opcion = ''
  Fec_Creacion = ''
  Cod_Familia = ''
  Cod_Tela = ''
  Cod_Cliente = ''
  Nom_Cliente = ''
  Tip_Ancho = ''
  Des_Tip_Ancho = ''
  Cod_Gama = ''
  Des_Gama = ''
  Eco_Master = ''
  IMaster = ''
  TRD = ''
  ATYC = ''
  MS = ''
  Obs_Eco_Master = ''
  Obs_IMaster = ''
  Obs_TRD = ''
  Obs_ATYC = ''
  Obs_Ms = ''
  Fec_Reg_Ini = ''
  Fec_Reg_Fin = ''

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({    
    FamArticulo:  [''],
    NomCliente: [''],
    DesTipAncho: ['']
  })
  
  displayedColumns: string[] = ['Fec_Creacion', 'Cod_Familia', 'Nom_Cliente', 'Des_Tip_Ancho', 'Des_Gama', 'Eco_Master', 'IMaster', 'TRD', 'ATYC', 'MS','Obs_Eco_Master', 'Obs_IMaster', 'Obs_TRD', 'Obs_ATYC','Obs_MS','Acciones']
  dataSourceSol: MatTableDataSource<Capacidades>;


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private TintoreriaService: TintoreriaService,
    public dialog: MatDialog,
    private exceljsService:ExceljsService,
    private SpinnerService: NgxSpinnerService) { this.dataSourceSol = new MatTableDataSource()}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.MostrarCapacidades()
    this.CargarFamArticulo()
    this.CargarCliente()
    this.CargarTipAncho()
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
   let dialogRef = this.dialog.open(DialogAddCapacidadesComponent, {
      disableClose: true,
      // minWidth:'800px',
      // maxWidth:'98wh',
      maxWidth: '100vw',
      maxHeight: '70vh',
      position: {
        top: '0px'
      },
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'false') {          
        this.MostrarCapacidades();
        //this.openDialog();
      } 
    })
  }

  ModificarCapacidad(data) {    
    let dialogRef = this.dialog.open(DialogAddCapacidadesComponent, {
       disableClose: true,
       // minWidth:'800px',
       // maxWidth:'98wh',
       maxWidth: '100vw',
       maxHeight: '70vh',
       position: {
         top: '0px'
       },
       data: {
           datos:data
       }
     });
    }

    MostrarCapacidades(){
    if ((this.formulario.get('FamArticulo')?.value).length < 1) 
      {
        this.Cod_Tela = ''
      }  

    if ((this.formulario.get('DesTipAncho')?.value).length < 7) 
    {
      this.Tip_Ancho = ''
    }

    if ((this.formulario.get('NomCliente')?.value).length < 1) 
      {
        this.Cod_Cliente = ''
      }


    this.SpinnerService.show();
    this.Opcion = 'C' 
    this.Cod_Familia = this.Cod_Tela
    this.Cod_Cliente = this.Cod_Cliente
    this.Tip_Ancho = this.Tip_Ancho
    this.Cod_Gama = this.Cod_Gama
    this.Eco_Master = ''
    this.IMaster = ''
    this.TRD = ''
    this.ATYC = ''
    this.MS = ''
    this.Obs_Eco_Master = ''
    this.Obs_IMaster = ''
    this.Obs_TRD = ''
    this.Obs_ATYC = ''    
    this.Obs_Ms = ''
    this.Fec_Reg_Ini= this.range.get('start')?.value == null ? '' : this.range.get('start')?.value
    this.Fec_Reg_Fin = this.range.get('end')?.value == null ? '' : this.range.get('end')?.value    
    this.TintoreriaService.MantCapacidades(
                          this.Opcion,
                          this.Cod_Familia,
                          this.Cod_Cliente,
                          this.Tip_Ancho,
                          this.Cod_Gama,
                          this.Eco_Master,
                          this.IMaster,
                          this.TRD,
                          this.ATYC,
                          this.MS,
                          this.Obs_Eco_Master,
                          this.Obs_IMaster,
                          this.Obs_TRD,
                          this.Obs_ATYC,
                          this.Obs_Ms,
                          this.Fec_Reg_Ini,
                          this.Fec_Reg_Fin).subscribe(
                            (result : any) => {
                              if (result.length > 0) {                                
                                this.dataSourceSol.data = result
                                console.log("result",result)
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

  EliminarRegistro(Cod_Tela: string, Cod_Cliente: string,Tip_Ancho:string,Cod_Gama: string ) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.SpinnerService.show();
        this.Opcion = 'D' 
        this.Cod_Familia = Cod_Tela
        this.Cod_Cliente = Cod_Cliente
        this.Tip_Ancho = Tip_Ancho  
        this.Cod_Gama = Cod_Gama
        this.Eco_Master = ''
        this.IMaster = ''
        this.TRD = ''
        this.ATYC = ''
        this.MS = ''
        this.Obs_Eco_Master = ''
        this.Obs_IMaster = ''
        this.Obs_TRD = ''
        this.Obs_ATYC = ''
        this.Obs_Ms = ''
        this.Fec_Reg_Ini= this.range.get('start')?.value == null ? '' : this.range.get('start')?.value
        this.Fec_Reg_Fin = this.range.get('end')?.value == null ? '' : this.range.get('end')?.value 
        this.TintoreriaService.MantCapacidades(
            this.Opcion,
            this.Cod_Familia,
            this.Cod_Cliente,
            this.Tip_Ancho,
            this.Cod_Gama,
            this.Eco_Master,
            this.IMaster,
            this.TRD,
            this.ATYC,
            this.MS,
            this.Obs_Eco_Master,
            this.Obs_IMaster,
            this.Obs_TRD,
            this.Obs_ATYC,
            this.Obs_Ms,
            this.Fec_Reg_Ini,
            this.Fec_Reg_Fin).subscribe(     
          (result: any) => {
            if(result[0].Obs_ATYC == 'OK'){            
            this.MostrarCapacidades()
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

  CargarFamArticulo(){
    this.listar_FamArticulo = [];    
    this.TintoreriaService.MuestraFamArticulo("1"      
      ).subscribe(data =>
      {
        this.listar_FamArticulo = data        
        this.RecargarFamArticulo()       
      }
      )
  }
    
  RecargarFamArticulo(){
    this.filtroFamArticulo = this.formulario.controls['FamArticulo'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterFamArticulo(option) : this.listar_FamArticulo.slice())),
    );    
  }

  private _filterFamArticulo(value: string): FamArticulo[] {    
    const filterValue = value.toLowerCase();    
    return this.listar_FamArticulo.filter(option => String(option.Cod_Familia).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Cod_Familia.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarFamArticulo(Cod_Tela: string){
    this.Cod_Tela = Cod_Tela
  }

  CargarCliente(){
    this.listar_Cliente = [];    
    this.TintoreriaService.MuestraCliente("1"      
      ).subscribe(data =>
      {
        this.listar_Cliente = data        
        this.RecargarClientes()       
      }
      )
  }
    
  RecargarClientes(){
    this.filtroCliente = this.formulario.controls['NomCliente'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterCliente(option) : this.listar_Cliente.slice())),
    );    
  }

  private _filterCliente(value: string): Cliente[] {        
    const filterValue = value.toLowerCase();    
    return this.listar_Cliente.filter(option => String(option.Nombre_Cliente).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nombre_Cliente.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarValorCliente(Cod_Cliente: string){
    this.Cod_Cliente = Cod_Cliente
  }


  CargarTipAncho(){
    this.listar_TipAncho = [];    
    this.TintoreriaService.MuestraTipAncho(      
      ).subscribe(data =>
      {
        this.listar_TipAncho = data        
        this.RecargarTipAncho()       
      }
      )
  }
    
  RecargarTipAncho(){
    this.filtroTipAncho = this.formulario.controls['DesTipAncho'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterTipAncho(option) : this.listar_TipAncho.slice())),
    );    
  }

  private _filterTipAncho(value: string): TipAncho[] {        
    const filterValue = value.toLowerCase();    
    return this.listar_TipAncho.filter(option => String(option.Des_TipAncho).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Des_TipAncho.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarValorTipANcho(Tip_Ancho: string){
    this.Tip_Ancho = Tip_Ancho
  }

  generateExcel()
  {  
    this.dataForExcel = [];
    this.dataSourceSol.data.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row)) 
          })
      
          let reportData = {
            title: 'REPORTE CAPACIDADES MÁQUINA TINTORERÍA',
            data: this.dataForExcel,
            headers: Object.keys(this.dataSourceSol.data[0])
          }
      
          this.exceljsService.exportExcel(reportData);
          this.dataForExcel = []
  }

}


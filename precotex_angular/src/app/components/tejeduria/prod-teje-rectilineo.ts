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


interface produccion_rectilineo{
  Fec_Produccion_Ini:string,
  Fec_Produccion_Fin:string,
  Fec_Lectura:string,
  Cod_Ordtra:string,
  Num_Secuencia:string,
  Sec_Maquina:string,
  Cod_Maquina:string,
  Cod_Tela:string,
  Des_Tela:string,
  Comb:string,
  Cod_Talla:string,
  Kg_Producido:string,
  Und_Requerido:string,
  Und_Producido:string,
  Und_Pendiente:string,
  Und_Ingresar:string,
  Und_Fallado:string,
  Tejedor:string,
  Cod_Usuario:string,
  OC:string,
  Precio_Unitario:string,
  Total:string,
  Cliente:string,
  Id:string,
  TotUnd: string,
  TotFalla: string
 }

@Component({
  selector: 'app-prod-teje-rectilineo',
  templateUrl: './prod-teje-rectilineo.html',
  styleUrls: ['./prod-teje-rectilineo.scss']
})
export class ProdTejeRectilineoComponent implements OnInit {
  
  Opcion = ''
  Num_Registro= ''
  Fecha_Registro:''
  Cod_Maquina_Tejeduria=''
  Cod_Ordtra = ''
  Tip_Trabajador = ''
  Cod_Trabajador=''    
  Fec_Reg_Ini = ''
  Fec_Reg_Fin = ''
  Cod_Tela = ''
  Des_Tela = ''
  Num_Secuencia = ''
  Sec_Maquina = ''
  Uni_Producido = ''
  Uni_Fallado = ''
  Id = ''
  Tot_Und: string = '';
  Tot_Falla: string = '';

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario2 = this.formBuilder.group({ 
    Cod_Ordtra:         [''], 
    Cod_Tela:           [''],    
    Des_Tela:           [''],
  })
    
  displayedColumns: string[] = ['Fec_Lectura', 'Cod_Ordtra', 'Maquina', 'Cod_Tela', 'Talla', 'Kg_Producido','Und_Producido','Und_Fallado','Tejedor','Eliminar']
  dataSourceSol: MatTableDataSource<produccion_rectilineo>;
  msgErrorfinal: any;


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,    
    private TejeduriaService: TejeduriaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSourceSol = new MatTableDataSource()}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.formulario2.controls['Des_Tela'].disable()    
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
        this.openDialog()
      } 
    })
  }

  BuscarTela() {

    if (this.formulario2.get('Cod_Tela')?.value == undefined)
      {
        return
      }    
        
    this.Cod_Tela = (this.formulario2.get('Cod_Tela')?.value).toString();
     
    if ((this.Cod_Tela).toString().length >= 6 && (this.Cod_Tela).toString().length<=6) { 
      this.TejeduriaService.MuestraTela(this.Cod_Tela).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {            
            this.formulario2.controls['Cod_Tela'].setValue(result[0].Cod_Tela)
            this.Des_Tela = result[0].Des_Tela            
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })                      
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }
       
  }

  BuscarProduccion(){
    this.SpinnerService.show();        
    this.Fec_Reg_Ini= this.range.get('start')?.value == null ? '' : this.range.get('start')?.value
    this.Fec_Reg_Fin = this.range.get('end')?.value == null ? '' : this.range.get('end')?.value
    this.Cod_Ordtra = (this.formulario2.get('Cod_Ordtra')?.value).toString();
    this.Cod_Tela = (this.formulario2.get('Cod_Tela')?.value).toString();    

    this.TejeduriaService.BuscarProduccion(                          
                          this.Fec_Reg_Ini,
                          this.Fec_Reg_Fin,
                          this.Cod_Ordtra,
                          this.Cod_Tela 
                        ).subscribe(
                            (result : any) => {
                              if (result.length > 0) {                                
                                this.dataSourceSol.data = result                                  
                                this.Tot_Und = result[0].Tot_Und  
                                this.Tot_Falla = result[0].Tot_Falla                                
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
    

  EliminarRegistro(id: string) {    
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });    
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {        
        this.SpinnerService.show();
        this.Opcion = 'D'         
        this.Cod_Ordtra = ''
        this.Num_Secuencia = ''
        this.Sec_Maquina = ''
        this.Uni_Producido = ''
        this.Uni_Fallado = ''
        this.Tip_Trabajador = ''
        this.Cod_Trabajador = ''
        this.Id = id       
        this.TejeduriaService.MantProduccionRectilineo(
        this.Opcion,
        this.Cod_Ordtra,
        this.Num_Secuencia,
        this.Sec_Maquina,
        this.Uni_Producido,
        this.Uni_Fallado,
        this.Tip_Trabajador,
        this.Cod_Trabajador,
        this.Id
        ).subscribe(     
          (result: any) => {
            if(result[0].Resultado == 'OK'){     
              this.BuscarProduccion()                
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
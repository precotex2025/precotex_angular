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
import { DialogAddProdTejeRectilineoComponent } from './dialog-add-prod-teje-rectilineo-registro/dialog-add-prod-teje-rectilineo-registro';


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
  Id:string
 }

@Component({
  selector: 'app-prod-teje-rectilineo-registro',
  templateUrl: './prod-teje-rectilineo-registro.html',
  styleUrls: ['./prod-teje-rectilineo-registro.scss']
})
export class ProdTejeRectilineoRegistroComponent implements OnInit {
  
  Opcion = ''
  Num_Registro= ''
  Fecha_Registro=''
  Cod_Maquina =''
  Cod_Ordtra = ''
  Tip_Trabajador = ''
  Cod_Trabajador=''    
  Nom_Trabajador=''
  Fec_Reg_Ini = ''
  Fec_Reg_Fin = ''
  Cod_Tela = ''
  Des_Tela = ''
  Num_Secuencia = ''
  Sec_Maquina = ''
  Uni_Producido = ''
  Uni_Fallado = ''
  Id = ''

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario2 = this.formBuilder.group({ 
    Cod_Ordtra:         [''], 
    Cod_Maquina:        [''],
    Cod_Tela:           [''],    
    Des_Tela:           [''],
    Cod_Trabajador:     [''],
    Nom_Trabajador:     [''],
  })
    
  // displayedColumns: string[] = ['Fec_Lectura', 'Cod_Ordtra', 'Maquina', 'Cod_Tela', 'Talla', 'Kg_Producido','Und_Producido','Und_Fallado','Tejedor','Eliminar']
  displayedColumns: string[] = ['Sec_Maquina', 'Maquina', 'Cod_Tela', /*'Des_Tela',*/ 'Comb','Cod_Talla','Und_Requerido','Und_Producido','Und_Pendiente','Agregar']
  dataSourceSol: MatTableDataSource<produccion_rectilineo>;
  msgErrorfinal: any;


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,    
    private TejeduriaService: TejeduriaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSourceSol = new MatTableDataSource()}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.formulario2.controls['Nom_Trabajador'].disable()    
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
  
  BuscarDni() {
  
    if (this.formulario2.get('Cod_Trabajador')?.value == undefined)
    {
      return
    }    
    this.Cod_Trabajador = (this.formulario2.get('Cod_Trabajador')?.value).toString(); 
    
    if ((this.Cod_Trabajador).toString().length < 8 ) { 
      this.Nom_Trabajador = '';
    } 
    
    if ((this.Cod_Trabajador).toString().length >= 8) { 
      this.TejeduriaService.MuestraTejedor(this.Cod_Trabajador).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {                        
            this.Nom_Trabajador = result[0].Nom_Tejedor  
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })                      
            this.Nom_Trabajador = '';
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }       
  }

  BuscarOT(){
    this.SpinnerService.show();           
    this.Cod_Ordtra = (this.formulario2.get('Cod_Ordtra')?.value).toString();
    this.Cod_Maquina = (this.formulario2.get('Cod_Maquina')?.value).toString();    

    this.TejeduriaService.BuscarOT(                          
                          this.Cod_Ordtra,
                          this.Cod_Maquina,                   
                        ).subscribe(
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
              this.BuscarOT()                
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


  openDialogAdd(Num_Secuencia: string,Sec_Maquina: string) {    
    if(this.Nom_Trabajador.toString() == null || this.Nom_Trabajador.toString() == undefined || this.Nom_Trabajador.toString() == ''){
      this.matSnackBar.open('Ingrese DNI', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      return;
    } 

    let dialogRef = this.dialog.open(DialogAddProdTejeRectilineoComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        Cod_Ordtra:(this.formulario2.get('Cod_Ordtra')?.value).toString(),
        Num_Secuencia:Num_Secuencia,
        Sec_Maquina:Sec_Maquina,
        Cod_Trabajador:(this.formulario2.get('Cod_Trabajador')?.value).toString()
      }
      ,minWidth: '20vh'
    });
  
    dialogRef.afterClosed().subscribe(result => {
       this.BuscarOT()
    })  
  }

}
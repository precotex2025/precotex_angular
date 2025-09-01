import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroCalidadTejeduriaService } from 'src/app/services/registro-calidad-tejeduria.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService }  from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { DialogAuditoriaRegistroCalidadOtComponent } from './dialog-auditoria-registro-calidad-ot/dialog-auditoria-registro-calidad-ot.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Auditor } from 'src/app/models/Auditor';
import { Restriccion } from 'src/app/models/Restriccion';
import { GlobalVariable } from '../../VarGlobals';
import { MatPaginator } from '@angular/material/paginator';
import { allowedNodeEnvironmentFlags } from 'process';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatCheckboxModule } from '@angular/material/checkbox';



interface data_det {
  Ot: string,
  Fecha: string,
  Detalle: string,
  Imprimir: string,
}

@Component({
  selector: 'app-registro-calidad-ot',
  templateUrl: './registro-calidad-ot.component.html',
  styleUrls: ['./registro-calidad-ot.component.scss']
})
export class RegistroCalidadOtComponent implements OnInit {

  Fec_Inicio="";
  Fec_Fin="";

  formulario = this.formBuilder.group({
    Ct_Ot:                [''],
    Ct_Inspector:         [''],
    Ct_Fecha_Inicio:      [new Date()],
    Ct_Fecha_Fin:         [new Date()],
  });

  displayedColumns_cab: string[] = 
  ['Ot', 'Secuencia', 'Fecha', 'Detalle', 'Imprimir']

  dataSource: MatTableDataSource<data_det>;
  dataResult:Array<any> = [];

  constructor(
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar,   
    private dialog: MatDialog, 
    private RegistroCalidadTejeduriaService: RegistroCalidadTejeduriaService,
    //private DialogAuditoriaRegistroCalidadOtComponent: DialogAuditoriaRegistroCalidadOtComponent,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService,
    private router: Router,
    private route: ActivatedRoute,
    private ingresoRolloTejidoService: IngresoRolloTejidoService) {
      this.dataSource = new MatTableDataSource();
     }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  allSubscribers: any = [
    {
      checked: false,
      name: 'test',
    },
    {
      checked: false,
      name: 'test2',
    },
  ];
  unselectedSubscribers: any = [];
  selectedSubscribers: any = [];

     
  ngOnInit(): void {

    this.showMostrarListaOt();

    this.unselectedSubscribers = this.allSubscribers;
  }

  
  onSubscriberCheck() {
    this.selectedSubscribers = this.allSubscribers.filter(
      (x: any) => x.checked
    );
    this.unselectedSubscribers = this.allSubscribers.filter(
      (x: any) => !x.checked
    );
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


  Fn_PasarFechaInicio() {
    this.Fec_Inicio=this.formulario.get('Ct_Fecha_Inicio')?.value;
    this.formulario.get('Ct_Fecha_Inicio').setValue(this.Fec_Inicio);
    //this.formulario.get('fec_registro').disable();
  }

  Fn_PasarFechaFin() {
    this.Fec_Fin=this.formulario.get('Ct_Fecha_Fin')?.value;
    this.formulario.get('Ct_Fecha_Fin').setValue(this.Fec_Fin);
    //this.formulario.get('fec_registro').disable();
  }


  showMostrarListaOt() {
    this.SpinnerService.show();
    let fec_ini = this.formulario.value['Ct_Fecha_Inicio'];
    fec_ini = moment(fec_ini).format('DD/MM/YYYY');

    let fec_fin = this.formulario.value['Ct_Fecha_Fin'];
    fec_fin = moment(fec_fin).format('DD/MM/YYYY');

    this.ingresoRolloTejidoService.showListaStatusOt(fec_ini, 
                                                     fec_fin, 
                                                     this.formulario.get('Ct_Ot')?.value, 
                                                     this.formulario.get('Ct_Inspector')?.value).subscribe(
      (result: any) => {
        this.dataSource.data = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  detalleOt(data) {
    let dialogRef = this.dialog.open(DialogAuditoriaRegistroCalidadOtComponent,
      {
        disableClose: true,
        minWidth: '85%',
        minHeight: '80%',
        maxHeight: '98%',
        height: '90%',
        panelClass: 'my-class',
        data: {
          datos: data
        }
      });
    dialogRef.afterClosed().subscribe(result => {

    })
  }



  trackByFn(i: number, val: any) {
    return val.name;
  }


  ColaImpresion(event, Cod_Ordtra, Num_Secuencia){
    console.log(event);
    if(event.checked == true){
      this.ingresoRolloTejidoService.insertarColaImpresionAuditoria(Cod_Ordtra, Num_Secuencia).subscribe(
        (result: any) => {
          console.log(result);
          //this.obtenerReposiciones();
          if (result[0].status == 1) {
            this.matSnackBar.open('Se registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 });
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 });
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        })
      
    }
  }
  
  Filtro(event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

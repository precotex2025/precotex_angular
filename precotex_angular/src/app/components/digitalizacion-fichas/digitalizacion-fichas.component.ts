import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as _moment from 'moment';
import { GlobalVariable } from 'src/app/VarGlobals';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ComercialService } from 'src/app/services/comercial.service';

import { Subject } from 'rxjs';
import { DigitalizacionFichasService } from 'src/app/services/digitalizacionFichas.service';
import { DialogVisorFichasComponent } from './dialog-visor-fichas/dialog-visor-fichas.component';
import { saveAs } from 'file-saver';

/*export interface PeriodicElement {
  ESTILO_PROPIO: string;
  DESC_ESTILO_PROPIO: string;
  ESTILO_CLIENTE: string;
  TIPO_PRENDA: string;
  GRUPO_TALLA: string;
}*/
/*
interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}*/

interface Temporada {
  Cod_TemCli: string;
  Nom_TemCli: string;
}

interface FichasPDF{
  Cod_EstPro?: string;
  Cod_Version?: string;
  Des_Version?: string;
  Cod_EstCli?: string;
  OPs?: string;
  Des_EstPro?: string;
  Des_TipPre?: string;
  Tallas?: string;
}

interface Formato {
  Tipo_Ficha?: string;
  Nom_Ficha?: string;
}

//const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-digitalizacion-fichas',
  templateUrl: './digitalizacion-fichas.component.html',
  styleUrls: ['./digitalizacion-fichas.component.scss']
})

export class DigitalizacionFichasComponent implements OnInit {
  //showTipoImpresion: boolean = false; 
  //tipo: string;
  //version: string;
  //opRelacionadas: string;
  //flagEstilo: string;
  //pdfGenerated: Subject<Blob> = new Subject<Blob>();
  //pdfBlob: string | null = null;
  //fecha: string = '';
  //resultado: boolean = false;

  //dataForExcel = [];
  //data: any = [];

  //sede: string = '';
  //estilo: string = '';
  //estilo_propio: string = '';

  cod_EstPro: string = '';
  cod_EstCli: string = '';
  cod_OrdPro: string = '';
  cod_Cliente: string = '';
  cod_TemCli: string = '';

  listar_operacionCliente: any = [];
  listar_operacionTemporada: Temporada[] = [];
  listar_estiloCliente: any = [];
  //listar_tipoImpresion: any = [];


  /*
  displayedColumns: string[] = [
    'ESTILO_PROPIO',
    'DESC_ESTILO_PROPIO',
    'ESTILO_CLIENTE',
    'TIPO_PRENDA',
    'GRUPO_TALLA' 
  ];*/
  /*
  displayedColumnsVersion: string[] = [
    'Codigo',
    'Descripcion'
  ];
   
  displayedColumnsArchivos: string[] = [
    'Codigo Estilo',
    'Version',
    'Acciones' 
  ];*/

  displayedColumns: string[] = ['Cod_EstPro','Cod_Version','Des_Version','Cod_EstCli','OPs','Des_EstPro','Des_TipPre','Tallas','Acciones']

  dataSource: MatTableDataSource<FichasPDF>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //deshabilitar: boolean = false;

  

  //oc: string = '';
  //OP: string = '';
  //Fecha_inicio = '';
  //Fecha_Fin = '';
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //dataSourceVersion = [];
  //dataSourceArchivos = [];
  //filtroOperacionCliente: Observable<Cliente[]> | undefined;

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild('DniSearch') inputDni!: ElementRef;
  //fecha_mes = '';
  //sCod_Usuario = GlobalVariable.vusu

  //Cod_Empresa: string = '';
  //dataEstilos: any = [];
  
  //sCliente: any = '';
  //sTemporada: any = '';
  //local = false;
  //formulario: FormGroup;

  constructor(
    //private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private comercialService: ComercialService,
    //private _router: Router,
    //private exceljsService: ExceljsService,
    //@Inject(DOCUMENT) document: any,
    private dialog: MatDialog,
    //private fb: FormBuilder,
    private digitalizacionFichasService: DigitalizacionFichasService) {
   
    /*this.formulario = this.fb.group({
      Estilo: [''],
      TipoImpresion: ['']
    });   */
  }

  ngOnInit(): void {
    //this.cargarLista();
    this.CargarOperacionCliente()
    this.cargarTipoImpresion();
  }

  cargarLista(){
    //this.showTipoImpresion= false;
    //this.dataSourceVersion= [];
    //this.dataSourceArchivos= [];
    //this.flagEstilo='';
    //this.version='';    
    //this.opRelacionadas='';
    
    const formData = new FormData();
    formData.append('Cod_EstPro', this.cod_EstPro);
    formData.append('Cod_OrdPro', this.cod_OrdPro);
    formData.append('Cod_EstCli', this.cod_EstCli);
    formData.append('Cod_Cliente', this.cod_Cliente);
    formData.append('Cod_TemCli', this.cod_TemCli);

    this.SpinnerService.show();
    this.comercialService.CargarEstilosVersion(
      formData
    ).subscribe(
      (result: any) => {      
        this.SpinnerService.hide();
        if (result.length > 0) {
          //this.dataSourceVersion = result;
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = [];
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.dataSource.data = [];
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      });
  }

  cargarTipoImpresion() {
    GlobalVariable.Arr_Medidas = []
    this.digitalizacionFichasService.cargarTipoImpresion().subscribe(
      (result: any) => {
        GlobalVariable.Arr_Medidas = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }));
  }

  onSelectFichaPdf(fichasPDF: FichasPDF, accion: string){
    
    let dialogRef = this.dialog.open(DialogVisorFichasComponent, {
      //disableClose: true,
      panelClass: 'my-class',
      data: fichasPDF
    });

    dialogRef.afterClosed().subscribe(result => {
      let formato: Formato = result;
      console.log(formato)
      this.getArchivoFormato(fichasPDF.Cod_EstPro, fichasPDF.Cod_Version, formato.Tipo_Ficha, formato.Nom_Ficha, accion)
    });              

  }

  getArchivoFormato(Cod_EstPro: string, Cod_Version: string, Tipo_Ficha: string, Nom_Ficha: string, accion: string){
    this.SpinnerService.show();

    const formData = new FormData();
    formData.append('Cod_EstPro', Cod_EstPro);
    formData.append('Cod_Version', Cod_Version);
    formData.append('Tipo_Ficha', Tipo_Ficha);

    this.comercialService.CargarEstilosArchivos(formData)
      .subscribe((result: any) => {
        //console.log(result)
        this.SpinnerService.hide();
        if (result.length > 0) {
          if(result[0].Cod_EstPro != '0'){
            console.log(result[0].Nom_Archivo)
            if(accion == '1')
              this.generatePdfBlank(result[0].Nom_Archivo);
            else
              this.generatePdf(result[0].Nom_Archivo, Cod_EstPro, Cod_Version, Nom_Ficha);
          } else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        } else {
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
    });
  }

  generatePdf(pdfFileUrl: string, Cod_EstPro: string, Cod_Version: string, Nom_Ficha: string) { 
    //const pdfFileUrl = element['Nom_Archivo']; 
    //const pdfFileUrl = nomArchivo.trim()

    const fileName = Nom_Ficha.trim() + '_' + Cod_EstPro.trim() + '_' + Cod_Version.trim() + '.pdf'
    const formData = new FormData();
    formData.append('Tipo', 'V');
    formData.append('Url', pdfFileUrl.trim()); 
    
    this.SpinnerService.show();
    this.digitalizacionFichasService.obtenerPdfByte(formData)
      .subscribe((result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          const pdfBlob = this.base64ToBlob(result[0]['pdf'], 'application/pdf');
          saveAs(pdfBlob, fileName);
        } else {
          this.SpinnerService.hide();
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
       // this.dataSource.data = [];
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      });
  } 

  generatePdfBlank(pdfFileUrl: string) {
    //const pdfFileUrl = element['Nom_Archivo']; 
    //const pdfFileUrl = nomArchivo.trim()
   
    const formData = new FormData();
    formData.append('Tipo', 'V');
    formData.append('Url', pdfFileUrl.trim()); 

    this.SpinnerService.show();
    this.digitalizacionFichasService.obtenerPdfByte(formData)
      .subscribe((result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          const pdfBlob = this.base64ToBlob(result[0]['pdf'], 'application/pdf'); 
          const url = URL.createObjectURL(pdfBlob);
          window.open(url, '_blank');
        } else {
          this.SpinnerService.hide();
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
       // this.dataSource.data = [];
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      });
  } 
 
  base64ToBlob(base64: string, mimeType: string): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  searchEstilos(event){
  
    if(event != undefined){
      var search = event.term;
      if(search.length >= 3){
        this.comercialService.CC_BUSCAR_ESTILOCLIENTE(search)
          .subscribe((result: any) => {
            this.SpinnerService.hide();
            if (result.length > 0) {
              this.listar_estiloCliente = result;
            } else {
              this.listar_estiloCliente = [];
  
              this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          })
      }else{
        console.log('debes ingresar al menos 3 caracteres');
      }
    }else{
      this.listar_estiloCliente = [];
      this.cod_EstCli = '';
    }
  }

  changeEstilo(event){
    if(event == undefined){
      this.listar_estiloCliente = [];
      this.cod_EstCli = '';
    }
  }

  CargarOperacionCliente() {

    this.listar_operacionCliente = [];
    var Abr = ''
    var Abr_Motivo = ''
    var Nom_Cliente = ''
    var Cod_Accion = 'L'
    this.comercialService.mantenimientoDerivadosService(Abr, Abr_Motivo, Nom_Cliente, Cod_Accion).subscribe(
      (result: any) => {
        this.listar_operacionCliente = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
    
  CambiarValorCliente(event) {
  //  console.log(event);
    if (event != undefined) {
      this.comercialService.buscarTempCliente(event.Cod_Cliente).subscribe(
        (result: any) => {
          this.listar_operacionTemporada = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    } else {
      this.listar_operacionTemporada = [];
      this.cod_Cliente = '';
      this.cod_TemCli = '';
    }
  
  }

  
/*

  onSelectionChangeTipo(event: any) {
    this.tipo = event.value;     
    var estilo_propio = this.formulario.get('Estilo').value;      
    const formData = new FormData();
    formData.append('Estilo_Propio', estilo_propio);
    formData.append('Cod_Version', this.version);
    formData.append('Tipo_Ficha', this.tipo);
    this.comercialService.CargarEstilosArchivos(
      formData
    ).subscribe(
      (result: any) => {
        //console.log(result)
        this.SpinnerService.hide();
        if (result.length > 0) {
          if(result[0].Cod_EstPro != '0'){
            this.dataSourceArchivos = result;
          } else{
            this.dataSourceArchivos = [];
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        } else {
          this.dataSourceArchivos = [];
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.dataSourceArchivos = [];
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  

}

oldcargarLista() {
  this.showTipoImpresion= false;
  this.dataEstilos = [];    
  this.dataSource.data =  [];  
  this.dataSourceVersion= [];
  this.dataSourceArchivos= [];
  this.flagEstilo='';
  this.version='';
  this.opRelacionadas='';
  if (this.OP != '' || this.estilo != '' || this.estilo_propio != '' || (this.sCliente != '' && this.sTemporada != '')) {
    this.SpinnerService.show();


    this.comercialService.CargarEstilosDigitalizacion(
      this.OP,
      this.estilo_propio,
      this.estilo,
      this.sCliente,
      this.sTemporada
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
        } else {
          this.dataSource.data = [];
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  } else {
    this.matSnackBar.open("Debes ingresar un filtro de búsqueda.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
  }
}






applyFilter() {
  console.log(this.dataSource.data)

  this.dataForExcel = [];
  if (this.dataSource.data.length == 0) {
    this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
  }
  else {

    this.dataSource.data.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: 'REPORTE CONTROL INTERNO DE MERMA',
      data: this.dataForExcel,
      headers: Object.keys(this.dataSource.data[0])
    }

    this.exceljsService.exportExcel(reportData);
    //this.dataSource.data = [];
  }
}

onRowSelect(row: any){
  this.showTipoImpresion= false;
  this.dataSourceVersion= [];
  this.dataSourceArchivos= [];
  this.flagEstilo='';
  this.version='';    
  this.opRelacionadas='';
  
  this.flagEstilo = row['ESTILO_PROPIO'];
  var sCod_Usuario = GlobalVariable.vusu;
  this.formulario.get('Estilo')?.setValue(this.flagEstilo);
  const formData = new FormData();
  formData.append('Estilo_Propio', this.flagEstilo);
  formData.append('OP', this.OP);
  this.comercialService.CargarEstilosVersion(
    formData
  ).subscribe(
    (result: any) => {      
      this.SpinnerService.hide();
      if (result.length > 0) {
        this.dataSourceVersion = result;
      } else {
        this.dataSourceVersion = [];
        this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }

    },
    (err: HttpErrorResponse) => {
      this.SpinnerService.hide();
      this.dataSourceVersion = [];
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    })

     
}

onRowSelectVersion(rowVersion: any){
  this.dataSourceArchivos= [];  
  this.version='';
  this.version = rowVersion['Cod_Version']; 
  this.opRelacionadas = rowVersion['OPs']; 
  this.showTipoImpresion= true;

}*/


}


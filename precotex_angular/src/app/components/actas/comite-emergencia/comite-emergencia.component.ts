import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'

import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas';

import { GlobalVariable } from 'src/app/VarGlobals';
import { ActasService } from 'src/app/services/actas.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { DialogRegistarActaComponent } from './dialog-registar-acta/dialog-registar-acta.component';

interface Detalle {
  Id_Participante?: number;
  Id_ActaComite?: number;
  Cod_Trabajador?: string;
  Flg_Voto?: number;
  Fec_Voto?: Date;
  Signatura64?: string;
  Flg_Activo?: number;
  Cod_Usuario?: string;
  Nom_Trabajador?: string;
  Des_Ocupacion?: string;
  Des_Area?: string;
}

interface Comite {
  Accion?: string;
  Id_ActaComite?: number;
  Fec_ActaComite?: Date;
  Id_Sede?: number;
  Id_Area?: number;
  Id_Proceso?: number;
  Id_Problema?: number;
  Num_Acta?: string;
  Cod_OrdPro?: string;
  Cod_OrdTra?: string;
  Det_Problema?: string;
  Des_Detalle?: string;
  Des_Decision?: string;
  Flg_Estado?: string;
  Flg_Activo?: number;
  Cod_Responsable?: string;
  Cod_Trabajador?: string;
  Cod_Usuario?: string;
  Des_Sede?: string;
  Des_Area?: string;
  Des_Proceso?: string;
  Des_Problema?: string;
  Nom_Responsable?: string;
  Nom_Cliente?: string;
  Des_Present?: string;
  Cod_EstCli?: string;
  Signatura64?: string;
  Detalle: Detalle[];
}

@Component({
  selector: 'app-comite-emergencia',
  templateUrl: './comite-emergencia.component.html',
  styleUrls: ['./comite-emergencia.component.scss']
})
export class ComiteEmergenciaComponent implements OnInit {

  fecha = new Date();
  verPdf: boolean = false;
  horaActa: string = ""
  fechaActa: string = ""
  votoFavor: number = 0;
  votoContra: number = 0;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });  

  dataForExcel = [];
  acta: Comite[] = [];
  displayedColumns: string[] = ['Num_Acta','Fec_ActaComite', 'Des_Sede', 'Des_Area', 'Des_Proceso', 'Des_Problema', 'Cod_OrdPro', 'Flg_Estado','Acciones']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
        private matSnackBar: MatSnackBar,
        private dialog: MatDialog,
        private spinnerService: NgxSpinnerService,
        private actasService: ActasService,
        private datePipe: DatePipe,
        private exceljsService: ExceljsService
  ) {
    this.range.controls['start'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
    this.range.controls['end'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarComiteEmergencia();
  }

  listarComiteEmergencia(){
    let data: any = {
      Accion: 'L',
      Id_ActaComite: 0,
      Fec_ActaComite: this.range.get('start')?.value ? this.datePipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss') : '',
      Id_Sede: 0,
      Id_Area: 0,
      Id_Proceso: 0,
      Id_Problema: 0,
      Cod_OrdPro: '',
      Cod_OrdTra: '',
      Det_Problema: '',
      Des_Detalle: '',
      Des_Decision: '',
      Cod_Responsable: '',
      Flg_Estado: '',
      Flg_Activo: 0,
      Fec_ActaComite2: this.range.get('end')?.value ? this.datePipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss') : '',
      Cod_Usuario: GlobalVariable.vusu,
    }
    
    this.spinnerService.show();
    this.actasService.manComiteEmergencia(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          //console.log(result)
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }  

  onInsertarRegistro(){
    let comite: Comite = {Accion: 'I', Id_ActaComite: 0, Num_Acta: '', Fec_ActaComite: new Date(), Id_Problema: 1, Flg_Estado: 'P', Flg_Activo: 1, Cod_Responsable: GlobalVariable.vtiptra.trim().concat(GlobalVariable.vcodtra.trim()), Cod_Usuario: GlobalVariable.vusu, Detalle: []};

    let dialogRef = this.dialog.open(DialogRegistarActaComponent, {
      disableClose: true,
      width: "1000px",
      height: "90%",
      data: comite
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result)
        comite = result;
        
        comite.Fec_ActaComite = new Date(comite.Fec_ActaComite + ':00');  // Agregar los segundos a la fecha
        this.registarComite(comite);
      }
    });
  }

  onEditarRegistro(comite: Comite){
    let data: any = {
      Accion: 'E',
      Id_ActaComite: comite.Id_ActaComite,
      Fec_ActaComite: '',
      Id_Sede: 0,
      Id_Area: 0,
      Id_Proceso: 0,
      Id_Problema: 0,
      Cod_OrdPro: '',
      Cod_OrdTra: '',
      Det_Problema: '',
      Des_Detalle: '',
      Des_Decision: '',
      Cod_Responsable: '',
      Flg_Estado: '',
      Flg_Activo: 0,
      Fec_ActaComite2: '',
      Cod_Usuario: GlobalVariable.vusu,
    }
    
    this.actasService.manComiteEmergencia(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          comite = result[0];
          comite.Accion = 'U';
          comite.Cod_Usuario = GlobalVariable.vusu;

          let dialogRef = this.dialog.open(DialogRegistarActaComponent, {
            disableClose: true,
            width: "1000px",
            height: "90%",
            data: comite
          });

          dialogRef.afterClosed().subscribe(result => {
            if(result){
              //console.log(result)
              comite = result;
              
              comite.Fec_ActaComite = new Date(comite.Fec_ActaComite + ':00');  // Agregar los segundos a la fecha
              this.registarComite(comite);
            }
          });    

        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onAnularRegistro(idActaComite: number){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        let data: any = {
          Accion: 'D',
          Id_ActaComite: idActaComite,
          Fec_ActaComite: '',
          Id_Sede: 0,
          Id_Area: 0,
          Id_Proceso: 0,
          Id_Problema: 0,
          Cod_OrdPro: '',
          Cod_OrdTra: '',
          Det_Problema: '',
          Des_Detalle: '',
          Des_Decision: '',
          Cod_Responsable: '',
          Flg_Estado: '',
          Flg_Activo: 0,
          Fec_ActaComite2: '',
          Cod_Usuario: GlobalVariable.vusu,
        }

        this.actasService.manComiteEmergencia(data)
          .subscribe((result: any) => {
            if (result.length > 0) {
              if (result[0].Id_Registro > 0){
                this.matSnackBar.open('Anulación Ok', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
              } else {
                Swal.fire(result[0].Respuesta, '', 'warning')
              }
              this.listarComiteEmergencia();
            }else{
              this.matSnackBar.open('Error al anular el evento!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      }
    });    
  }

  registarComite(comite: Comite){
    this.spinnerService.show();
    this.actasService.manComiteEmergencia(comite)
      .subscribe((result: any) => {
        if (result.length > 0) {
          if (result[0].Id_Registro > 0){
            //this.listarComiteEmergencia();
            this.matSnackBar.open('Registro Ok', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          } else {
            Swal.fire(result[0].Respuesta, '', 'warning')
          }
        }else{
          this.matSnackBar.open('Error en el registro del evento!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
        this.spinnerService.hide();
        this.listarComiteEmergencia();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );    
  }

  onExportarRegistro(){}
  
  onImprimirRegistro(comite: Comite){
    this.spinnerService.show();
    let data: any = {
      Accion: 'E',
      Id_ActaComite: comite.Id_ActaComite,
      Fec_ActaComite: '',
      Id_Sede: 0,
      Id_Area: 0,
      Id_Proceso: 0,
      Id_Problema: 0,
      Cod_OrdPro: '',
      Cod_OrdTra: '',
      Det_Problema: '',
      Des_Detalle: '',
      Des_Decision: '',
      Cod_Responsable: '',
      Flg_Estado: '',
      Flg_Activo: 0,
      Fec_ActaComite2: '',
      Cod_Usuario: GlobalVariable.vusu,
    }
    
    this.actasService.manComiteEmergencia(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.acta = result;

          this.votoFavor = 0;
          this.votoContra = 0;
          this.fechaActa = this.datePipe.transform(this.acta[0].Fec_ActaComite['date'], 'dd/MM/yyyy HH:mm')
          //this.fechaActa = this.datePipe.transform(this.acta[0].Fec_ActaComite['date'], 'dd/MM/yyyy')
          //this.horaActa = this.datePipe.transform(this.acta[0].Fec_ActaComite['date'], 'HH:mm')

          this.acta[0].Detalle.forEach(e => {
            if(e.Flg_Voto == 1)
              this.votoFavor = this.votoFavor + 1;
            else
              this.votoContra = this.votoContra + 1;
          });

          this.verPdf = true;
          //console.log(this.acta)
          //console.log(this.datePipe.transform(this.acta[0].Fec_ActaComite['date'], 'yyyy-MM-ddTHH:mm:ss'))

          setTimeout(() => {
            this.generarPDF('contentToConvert', this.acta[0].Num_Acta);
          }, 100);

          //console.log(this.acta[0].Fec_ActaComite.getUTCDate())
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );    
  }

generarPDF(seccion: string, numfile: string){
    setTimeout(() => {
      var data = document.getElementById(seccion);  

      html2canvas(data).then(canvas => {
        var imgWidth = 300; //200;
        var pageHeight = 300; //590; //295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        
        var contentDataURL = canvas.toDataURL('image/png',1.0)

        let pdf = new jsPDF({
          //orientation: 'L',
          unit: 'mm',
          format: 'a4',
        });
        var position = 15;
        var position1 = -282 //-297;

        var totalPages = Math.ceil(imgHeight / pageHeight - 1)
        
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight)
        for (var i = 1; i <= totalPages; i++) { 
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 5, position1, imgWidth, imgHeight);
        }
        
        pdf.save('ACTA COMITE_' + numfile + '.pdf'); // Generated PDF

        this.verPdf = false;
        this.spinnerService.hide();
      });
    }, 100);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

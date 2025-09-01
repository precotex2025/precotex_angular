import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { MantMaestroBolsaService } from 'src/app/services/mant-maestro-bolsa.service';

interface data_det {
  Id_Bolsa: number,
  Usuario_Creacion: string,
  Fecha_Creacion: string,
  Usuario_Modificacion: string,
  Fecha_Modificacion: string,
  Num_MovStk: string
}

@Component({
  selector: 'app-mant-maestro-bolsa',
  templateUrl: './mant-maestro-bolsa.component.html',
  styleUrls: ['./mant-maestro-bolsa.component.scss']
})

export class MantMaestroBolsaComponent implements OnInit {

  displayedColumns: string[] = [
    'Id_Bolsa',
    'Usuario_Creacion',
    'Fecha_Creacion',
    'Usuario_Modificacion',
    'Fecha_Modificacion',
    'Num_MovStk',
    'acciones'
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();

  
  fechasIni: any;
  fechasRange: Array<any>=[]
  range: any;


  Fecha1!: Date;
  Fecha2!: Date;

  Id = 0
  PageIndex = 0

  Fecha1tring = '';
  Fecha2tring = '';

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  formulario = this.formBuilder.group({
    sIdBolsa: [''],
  });

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private bolsaService: MantMaestroBolsaService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  ngOnInit(): void {
    
    if (!this.fechasRange.length) {
      
      this.fechasIni = {
        "start": [this.sumarDias(new Date(), -7)], 
        "end": [new Date()]
      }
  
      this.bolsaService.setRangoFechas(this.fechasIni);
      
    }
    this.verificaFechaAsignada();
    this.obtenerDatos();
  }

  sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
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

    this.range.valueChanges.pipe(
      debounceTime(200)
    ).subscribe(event => {
      if (event.start && event.end) {
          //this.onDateChanged(event);
          this.bolsaService.setRangoFechas(event);         
      }
  });
  }

  OpenDeleteConfirmacion(data) {
    if (confirm('Esta seguro(a) de eliminar el siguiente registro?')) {
      this.SpinnerService.show();
      // this.PageIndex = this.dataSource.paginator.pageIndex
      this.bolsaService.eliminarDatos_S(
        'D',
        data.Id_Bolsa,
        '',
        ''
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Se elimino el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            this.obtenerDatos();
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })
    }
  }

  obtenerDatos() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    let idbolsa = (this.formulario.get('sIdBolsa').value == '') ? 0:this.formulario.get('sIdBolsa').value
    this.bolsaService.obtenerDatos_S(
      'V',
      idbolsa,
      this.range.get('start').value,
      this.range.get('end').value
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
          // this.paginator.pageIndex = this.PageIndex;
          // this.dataSource.paginator.pageIndex = this.PageIndex;
        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  OpenInsertar() {
    this.SpinnerService.show();
    this.bolsaService.insertarDatos_S(
      'I',
      0,
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.Id = result[0].Id_Bolsa
          let datos = {
            Id: this.Id,
            Flg_Edita : true
          }
          this._router.navigate(['/MantMaestroBolsaItem'], { skipLocationChange: true, queryParams: datos });
          //this.matSnackBar.open('Se elimino el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          //this.obtenerDatos();
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  OpenEditDetalle(data) {
    let datos = {
      Id: data.Id_Bolsa,
      //Se comenta hasta que OyM de pase para produccion, 2025feb12, Ahmed
      //Flg_Edita : data.Num_MovStk ? false : true
      Flg_Edita : true  //-- provisional
    }
    this._router.navigate(['/MantMaestroBolsaItem'], { skipLocationChange: true, queryParams: datos });
  }

  verificaFechaAsignada(){

    this.bolsaService.getRangoFechas().subscribe({
      next: data => {
        this.fechasRange = data
      },
      error: error => {
        this.fechasRange = [];
        console.log('error en recuperar los datos del BehaviorSubject', error)
      }
    })

    this.range = this.formBuilder.group({
      start: this.fechasRange[0].start,
      end: this.fechasRange[0].end
    })
    
  }
  handleDOBChange(event) {
    console.log(event);
  }
}


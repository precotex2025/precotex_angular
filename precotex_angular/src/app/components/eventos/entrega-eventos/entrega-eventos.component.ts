import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { GlobalVariable } from 'src/app/VarGlobals';
import { EventosService } from 'src/app/services/eventos.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { ExceljsEventosService } from 'src/app/services/exceljs-eventos.service';

interface Detalle {
  Id_DetalleEvento?: number;
  Id_Evento?: number;
  Des_Entrega?: string;
  Flg_Dependiente?: number;
  Flg_Activo?: number;
  Sede?: string;
}

interface Evento {
  Accion?: string;
  Id_Evento?: number;
  Id_TipoEvento?: number;
  Des_Evento?: string;
  Fec_Evento?: Date;
  Lugar?: string;
  Flg_Estado?: string;
  Fltr_Sexo?: string;
  Fltr_Tipo?: string;
  Fltr_Sede?: number;
  Fltr_Padre?: number;
  Fltr_Onomastico?: number;
  Fltr_Dependiente?: number;
  Fltr_TopeEdad?: number;
  Fltr_Ingreso?: Date;
  Fec_Cierre?: Date;
  Flg_Activo?: number;
  Fec_Registro?: Date;
  Usu_Registro?: string;
  Des_TipoEvento?: string;
  Personal?: string;
  Sede?: string;
  Detalle: Detalle[];
}

@Component({
  selector: 'app-entrega-eventos',
  templateUrl: './entrega-eventos.component.html',
  styleUrls: ['./entrega-eventos.component.scss']
})
export class EntregaEventosComponent implements OnInit {

  formulario = this.formBuilder.group({
    Id_Evento: [0, Validators.required],
    Id_DetalleEvento: [0],
    Lugar: [{value: "", disabled: true}],
    Fec_Evento: [{value: new Date, disabled: true}],
    Entregas: [""],
    Flg_Estado: ["T"],
    Fec_Entrega: [new Date, Validators.required],
    DocumentoIdentidad: ['', Validators.required],
    Num_Items: [0, Validators.required]
  },{
    validators: this.validarNumItems
  });

  selected = new FormControl(0);
  evento: Evento[];
  dataEventos: Evento[];
  dataDetalle: Detalle[];
  dataEntregas: Detalle[];
  dataPersonal: any[];
  dataForExcel = [];

  filtroParticipantes: any[] = [
    {flg_Estado: 'T', des_Estado: 'TODOS'},
    {flg_Estado: 'P', des_Estado: 'PARTICIPANTES'},
    {flg_Estado: 'X', des_Estado: 'NO PARTICIPANTES'}
  ];

  displayedColumns1: string[] = ['DocumentoIdentidad','NombreCompleto','DesTrabajador','NombreSede','NombreArea','NombrePuesto','Des_Entrega','Acciones']
  displayedColumns2: string[] = ['DocumentoIdentidad','NombreCompleto','DesTrabajador','NombreSede','NombreGerencia','NombreArea','NombrePuesto','Des_Entrega','Signatura64','Fec_Entrega','Usu_Registro']
  
  dataSource1!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  
  //lc_img64: string = "";
  ll_nuevo: boolean = false;
  ll_lista: boolean = false;
  ll_firma: boolean = true;
  ll_total: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    private exceljsEventosService: ExceljsEventosService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService 
  ) {}

  ngOnInit(): void {
    this.validarCRUDUsuario(225);
    this.cargarEventos();
  }

  onSubmit(){
    if(this.dataSource1.data.length > 0){
      this.dataSource1.data.forEach(element => {
        const formData = new FormData();
        formData.append('Accion', 'I');
        formData.append('Id_EntregaEvento', '0');
        formData.append('Id_DetalleEvento', element.Id_DetalleEvento.toString());
        formData.append('Id_Evento', element.Id_Evento.toString());
        formData.append('DocumentoIdentidad', element.DocumentoIdentidad.trim());
        formData.append('Persona', element.Persona.toString());
        formData.append('Secuencia', element.Secuencia.toString());
        formData.append('Fec_Entrega', this.formulario.get('Fec_Entrega')?.value.toISOString());
        formData.append('Flg_Estado', '');
        formData.append('Flg_Activo', '1');
        formData.append('Usu_Registro', GlobalVariable.vusu);

        this.spinnerService.show();
        this.eventosService.entregasEventoColaborador(formData)
          .subscribe((result: any) => {
            if(result[0].Id_Registro != 0){
              Swal.fire(result[0].Respuesta, '', 'success')
              this.spinnerService.hide();
              this.onLimpiarEntrega();
            }else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.spinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );    

      });
    }

  }

  cargarEventos(){
    let data: Evento = {
      Accion: 'L',
      Id_Evento: 0,
      Id_TipoEvento: 0,
      Des_Evento: '',
      Fec_Evento: new Date(),
      Lugar: '',
      Flg_Estado: 'P',
      Fltr_Sexo: '',
      Fltr_Tipo: '',
      Fltr_Sede: 0,
      Fltr_Padre: 0,
      Fltr_Onomastico: 0,
      Fltr_Dependiente: 0,
      Fltr_TopeEdad: 0,
      Fltr_Ingreso: new Date(),
      Fec_Cierre: new Date(),
      Flg_Activo: 0,
      Usu_Registro: GlobalVariable.vusu,
      Detalle: []
    }

    this.spinnerService.show();
    this.eventosService.registroEventosColaborador(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataEventos = result.filter(d => d.Flg_Estado == 'P') 
          console.log(this.dataEventos)

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataEventos = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onBuscarDocumento(documentoIdentidad: any){
    if(documentoIdentidad.length > 7){
      if(this.dataEntregas.length > 0){
        this.dataEntregas.forEach(element => {

          const formData = new FormData();
          formData.append('Accion', 'E');
          formData.append('Id_EntregaEvento', '0');
          formData.append('Id_DetalleEvento', element.Id_DetalleEvento.toString());
          formData.append('Id_Evento', element.Id_Evento.toString());
          formData.append('DocumentoIdentidad', documentoIdentidad);
          formData.append('Persona', '0');
          formData.append('Secuencia', '0');
          formData.append('Fec_Entrega', '');
          formData.append('Flg_Estado', '');
          formData.append('Flg_Activo', '1');
          formData.append('Usu_Registro', GlobalVariable.vusu);

          this.dataPersonal = [];
          this.spinnerService.show();
          this.eventosService.entregasEventoColaborador(formData)
            .subscribe((result: any) => {
              if (result.length > 0) {

                if(result[0].Id_Registro != 0){
                  console.log(result)
                  this.ll_firma = result[0].Signatura == 'SI' ? true : false;
                  this.dataPersonal = this.dataPersonal.concat(result.filter(d => d.Flg_Estado == 'X'));
                  
                  this.dataSource1 = new MatTableDataSource(this.dataPersonal);
                  this.dataSource1.paginator = this.paginator.toArray()[0];
                  this.dataSource1.sort = this.sort.toArray()[0];

                  this.formulario.controls['Num_Items'].setValue(this.dataSource1.data.length);
                  this.ll_nuevo = this.dataSource1.data.length == 0 ? true : false;
                  this.ll_total = this.dataSource1.data.length == 0 ? true : false;
                } else {
                  this.ll_nuevo = true;
                  //this.onLimpiarEntrega();
                  Swal.fire(result[0].Respuesta, '', 'warning')
                }
                this.spinnerService.hide();
              }else{
                this.matSnackBar.open('Documento de identidad inválido!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.spinnerService.hide();
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          );
        });
      }
    }
  }

  selectEvento(event: any){
    let data: Evento = {
      Accion: 'E',
      Id_Evento: event.value,
      Id_TipoEvento: 0,
      Des_Evento: '',
      Fec_Evento: new Date(),
      Lugar: '',
      Flg_Estado: '',
      Fltr_Sexo: '',
      Fltr_Tipo: '',
      Fltr_Sede: 0,
      Fltr_Padre: 0,
      Fltr_Onomastico: 0,
      Fltr_Dependiente: 0,
      Fltr_TopeEdad: 0,
      Fltr_Ingreso: new Date(),
      Fec_Cierre: new Date(),
      Flg_Activo: 0,
      Usu_Registro: GlobalVariable.vusu,
      Detalle: []
    }

    this.eventosService.registroEventosColaborador(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.evento = result;
          this.dataDetalle = result[0].Detalle;
          this.formulario.controls['Id_Evento'].setValue(result[0].Id_Evento);
          this.formulario.controls['Id_DetalleEvento'].setValue(result[0].Detalle[0].Id_DetalleEvento);
          this.formulario.controls['Fec_Evento'].setValue(this.datePipe.transform(result[0].Fec_Evento['date'], 'yyyy-MM-ddTHH:mm'));
          this.formulario.controls['Lugar'].setValue(result[0].Lugar);
          this.formulario.controls['Entregas'].setValue('');
          this.onLimpiarEntrega();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onLimpiarEntrega(){
    this.dataSource1 = new MatTableDataSource([]);
    this.dataSource1.paginator = this.paginator.toArray()[0];
    this.dataSource1.sort = this.sort.toArray()[0];

    this.formulario.controls['DocumentoIdentidad'].setValue('');
    this.formulario.controls['Num_Items'].setValue(0);
    this.ll_firma = true;
    this.ll_total = false;
  }

  onListarRegistro(){
    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_EntregaEvento', '0');
    formData.append('Id_DetalleEvento',  this.formulario.get('Id_DetalleEvento')?.value.toString());
    formData.append('Id_Evento', this.formulario.get('Id_Evento')?.value.toString());
    formData.append('DocumentoIdentidad', '');
    formData.append('Persona', '0');
    formData.append('Secuencia', '0');
    formData.append('Fec_Entrega', '');
    formData.append('Flg_Estado', this.formulario.get('Flg_Estado')?.value);
    formData.append('Flg_Activo', '1');
    formData.append('Usu_Registro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.eventosService.entregasEventoColaborador(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataSource2 = new MatTableDataSource(result);
          this.dataSource2.paginator = this.paginator.toArray()[1];
          this.dataSource2.sort = this.sort.toArray()[1];

          this.spinnerService.hide();
        }else{
          this.dataSource2 = new MatTableDataSource([]);
          this.matSnackBar.open('No existen registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onQuitarEntrega(entrega: any){
    let ln_Index = this.dataPersonal.indexOf(entrega);
    this.dataPersonal.splice(ln_Index, 1);
    this.dataSource1._updateChangeSubscription();
    this.formulario.controls['Num_Items'].setValue(this.dataSource1.data.length);
  }
  
  onExportarRegistro(firmas: boolean){
    this.dataForExcel = [];
    if(this.dataSource2.filteredData.length > 0){
      let dataReporte: any[] = [];
      
      this.dataSource2.filteredData.forEach((row: any) => {
        let data: any = {};

        data.Persona = row.Persona;
        data.DocumentoIdentidad = row.DocumentoIdentidad;
        data.ApellidosNombres = row.NombreCompleto;
        data.TipoPlanilla = row.DesTrabajador;
        data.Sede = row.NombreSede;
        data.Gerencia = row.NombreGerencia;
        data.Area = row.NombreArea;
        data.SubArea = row.NombreSubArea;
        data.Puesto = row.NombrePuesto;
        data.FirmaDigital = firmas ? row.Signatura64 : (row.Signatura64 != '' ? 'SI' : 'NO');
        data.FechaEntrega = this.datePipe.transform(row.Fec_Entrega, 'yyyy-MM-dd HH:mm');  //row.Fec_Entrega;
        data.Responsable = row.Usu_Registro;

        dataReporte.push(data);
      });      
      
      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
      console.log(dataReporte)
      let detalle: Detalle[]
      detalle = this.dataDetalle.filter(d => d.Id_DetalleEvento == this.formulario.get('Id_DetalleEvento')?.value);

      let reportData = {
        title: 'REGISTRO DE ENTREGAS - ' + (this.formulario.get('Flg_Estado')?.value == 'T' ? 'GENERAL' : (this.formulario.get('Flg_Estado')?.value == 'P' ? 'PARTICIPANTES' : 'NO PARTICIPANTES')),
        tipo: this.evento[0].Des_TipoEvento,
        evento: this.evento[0].Des_Evento,
        entrega: detalle[0].Des_Entrega,
        fecha:  this.datePipe.transform(this.evento[0].Fec_Evento['date'], 'yyyy-MM-dd HH:mm'),
        firma: firmas,
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsEventosService.exportExcelcImg(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }    
    
  }

  selectEntregas(event: any){
    this.dataEntregas = event;
    this.onLimpiarEntrega();
  }

  validarNumItems(form: FormGroup){
    const numItems = form.get('Num_Items')?.value;
    return numItems > 0 ? null : { mismatch: true };
  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          this.ll_lista = crud[0].Flg_Verificar == 1 ? true : false;
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

}

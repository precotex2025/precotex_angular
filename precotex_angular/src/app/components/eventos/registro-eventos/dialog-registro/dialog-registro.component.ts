import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from "@angular/common";

import { EventosService } from 'src/app/services/eventos.service';

interface Detalle {
  Id_DetalleEvento?: number;
  Id_Evento?: number;
  Des_Entrega?: string;
  Flg_Dependiente?: number;
  Flg_Activo?: number;
  Usu_Registro?: string;
  Num_Item?: number;
  Dependiente?: string;
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
  selector: 'app-dialog-registro',
  templateUrl: './dialog-registro.component.html',
  styleUrls: ['./dialog-registro.component.scss']
})
export class DialogRegistroComponent implements OnInit {

  formulario = this.formBuilder.group({
    Accion: [''],
    Id_Evento: ['', Validators.required],
    Id_TipoEvento: ['', Validators.required],
    Des_Evento: ['', Validators.required],
    Fec_Evento: [new Date, Validators.required],
    Lugar: ['', Validators.required],
    Flg_Estado: ['', Validators.required],
    Fltr_Sexo: [''],
    Fltr_Tipo: [''],
    Fltr_Sede: [''],
    Fltr_Padre: [0],
    Fltr_Onomastico: [0],
    Fltr_Dependiente: [0],
    Fltr_TopeEdad: [0],
    Fltr_Ingreso: [new Date],
    Fec_Cierre: [new Date],
    Flg_Activo: [0],
    Usu_Registro: [''],
    Des_Entrega: [''],
    Flg_Dependiente: [0],
    Num_Items: [0, Validators.required],
    Detalle: []
    },{
      validators: this.validarNumItems
  });

  //detalleEvento: Detalle[] ;
  tipoEvento: any[];
  plantaEvento: any[];
  filtroSexo: any[] = [
    {fltrSexo: 'T', desSexo: 'TODOS'},
    {fltrSexo: 'F', desSexo: 'FEMENINO'},
    {fltrSexo: 'M', desSexo: 'MASCULINO'}
  ];
  filtroTipo: any[] = [
    {fltrTipo: '00', desTipo: 'TODOS'},
    {fltrTipo: '01', desTipo: 'OBREROS'},
    {fltrTipo: '02', desTipo: 'EMPLEADOS'}
  ];
  filtroLogico: any[] = [
    {idFiltro: 0, desFiltro: 'NO'},
    {idFiltro: 1, desFiltro: 'SI'}
  ];
  filtroOnomastico: any[] = [
    {idMes: 0, desMes: 'TODOS'},
    {idMes: 1, desMes: 'ENERO'},
    {idMes: 2, desMes: 'FEBRERO'},
    {idMes: 3, desMes: 'MARZO'},
    {idMes: 4, desMes: 'ABRIL'},
    {idMes: 5, desMes: 'MAYO'},
    {idMes: 6, desMes: 'JUNIO'},
    {idMes: 7, desMes: 'JULIO'},
    {idMes: 8, desMes: 'AGOSTO'},
    {idMes: 9, desMes: 'SEPTIEMBRE'},
    {idMes: 10, desMes: 'OCTUBRE'},
    {idMes: 11, desMes: 'NOVIEMBRE'},
    {idMes: 12, desMes: 'DICIEMBRE'}
  ];
  
  ln_NumItem: number = 0;
  ll_EditItem: boolean = false;
  ll_Pendiente: boolean = true;

  displayedColumns: string[] = ['Num_Item', 'Des_Entrega', 'Dependiente','Acciones']
  dataSource: MatTableDataSource<Detalle>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private eventosService: EventosService,
    public dialogRef: MatDialogRef<DialogRegistroComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: Evento
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    //console.log(this.data)
    this.formulario.reset();
    this.formulario.patchValue({
      Accion: this.data.Accion,
      Id_Evento: this.data.Id_Evento,
      Id_TipoEvento: this.data.Id_TipoEvento,
      Des_Evento: this.data.Des_Evento,
      //Fec_Evento: this.data.Fec_Evento ? new Date(this.data.Fec_Evento) : this.data.Fec_Evento,
      Fec_Evento: this.datePipe.transform(this.data.Fec_Evento['date'], 'yyyy-MM-ddTHH:mm'),
      Lugar: this.data.Lugar,
      Flg_Estado: this.data.Flg_Estado,
      Fltr_Sexo: this.data.Fltr_Sexo,
      Fltr_Tipo: this.data.Fltr_Tipo,
      Fltr_Sede: this.data.Fltr_Sede,
      Fltr_Padre: this.data.Fltr_Padre,
      Fltr_Onomastico: this.data.Fltr_Onomastico,
      Fltr_Dependiente: this.data.Fltr_Dependiente,
      Fltr_TopeEdad: this.data.Fltr_TopeEdad,
      Fltr_Ingreso: this.data.Fltr_Ingreso ? new Date(this.data.Fltr_Ingreso) : this.data.Fltr_Ingreso,
      Fec_Cierre: this.data.Fec_Cierre ? new Date(this.data.Fec_Cierre) : this.data.Fec_Cierre,
      Flg_Activo: this.data.Flg_Activo,
      Fec_Registro: this.data.Fec_Registro,
      Usu_Registro: this.data.Usu_Registro,
      Num_Items: this.data.Detalle.length,
      Detalle: this.data.Detalle,
      Flg_Dependiente: 0
    });

    //this.detalleEvento = this.data.Detalle;
    this.dataSource = new MatTableDataSource(this.data.Detalle);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.ll_Pendiente = this.data.Flg_Estado == 'P' ? true : false;
    this.listarTipoEventos();
    this.listarPlantaEventos();
  }

  onInsertarEntrega(){
    if(this.formulario.get('Des_Entrega')?.value.trim().length > 0){
      let detalle: Detalle = {};

      detalle.Id_DetalleEvento = 0;
      detalle.Id_Evento = this.data.Id_Evento;
      detalle.Des_Entrega = this.formulario.get('Des_Entrega')?.value.trim();
      detalle.Flg_Dependiente = this.formulario.get('Flg_Dependiente')?.value;
      detalle.Flg_Activo = 1;
      detalle.Num_Item = this.dataSource.data.length + 1;
      detalle.Dependiente =  this.formulario.get('Flg_Dependiente')?.value == 1 ? 'SI' : 'NO';

      this.data.Detalle.push(detalle)
      this.dataSource._updateChangeSubscription();
      this.onLimpiatEntrega();
    }
  }

  onEditarEntrega(detalle: Detalle){
    this.ln_NumItem = this.data.Detalle.indexOf(detalle);
    this.ll_EditItem = true;
    this.formulario.patchValue({
      Des_Entrega: detalle.Des_Entrega,
      Flg_Dependiente: detalle.Flg_Dependiente
    });
  }

  onAnularEntrega(detalle: Detalle){
    let ln_Index = this.data.Detalle.indexOf(detalle);
    this.data.Detalle.splice(ln_Index, 1);
    this.dataSource._updateChangeSubscription();
    this.onLimpiatEntrega();
  }

  onConfirmarEdicion(){
    this.data.Detalle[this.ln_NumItem].Des_Entrega = this.formulario.get('Des_Entrega')?.value.trim();
    this.data.Detalle[this.ln_NumItem].Flg_Dependiente = this.formulario.get('Flg_Dependiente')?.value;
    this.data.Detalle[this.ln_NumItem].Dependiente =  this.formulario.get('Flg_Dependiente')?.value == 1 ? 'SI' : 'NO';
    this.dataSource._updateChangeSubscription();

    this.ln_NumItem = 0;
    this.ll_EditItem = false;
    this.onLimpiatEntrega();
  }

  onLimpiatEntrega(){
    this.formulario.patchValue({
      Des_Entrega: '',
      Flg_Dependiente: 0,
      Detalle: this.dataSource.data,
      Num_Items: this.dataSource.data.length
    });
  }

  listarTipoEventos(){
    this.eventosService.tipoEventosColaborador()
      .subscribe((response) => {
        this.tipoEvento = response;
      });
  }

  listarPlantaEventos(){
    let plantas: any[];
    this.plantaEvento = [{Id_Planta: 0, des_planta: 'TODAS', num_planta: "00"}]

    this.eventosService.listaPlantaEventos()
      .subscribe((response) => {
        plantas = response;
        this.plantaEvento = this.plantaEvento.concat(plantas);
      });
  }

  validarNumItems(form: FormGroup){
    const numItems = form.get('Num_Items')?.value;
    return numItems > 0 ? null : { mismatch: true };
  }

}

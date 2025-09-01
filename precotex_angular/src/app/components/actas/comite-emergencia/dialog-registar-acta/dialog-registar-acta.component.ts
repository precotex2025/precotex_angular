import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from "@angular/common";
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { ActasService } from 'src/app/services/actas.service';
import { EventosService } from 'src/app/services/eventos.service';
import { SeguridadRondasService } from 'src/app/services/seguridad-rondas.service';

interface Detalle {
  Id_Participante?: number;
  Id_ActaComite?: number;
  Cod_Trabajador?: string;
  Flg_Voto?: number;
  Fec_Voto?: Date;
  Flg_Activo?: number;
  Cod_Usuario?: string;
  Num_Item?: number;
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
  //Cod_Trabajador?: string;
  Cod_Usuario?: string;
  Des_Cliente?: string;
  Cod_EstCli?: string;
  Detalle: Detalle[];
}

@Component({
  selector: 'app-dialog-registar-acta',
  templateUrl: './dialog-registar-acta.component.html',
  styleUrls: ['./dialog-registar-acta.component.scss']
})
export class DialogRegistarActaComponent implements OnInit {

  formulario = this.formBuilder.group({
    Accion: [''],
    Id_ActaComite: ['', Validators.required],
    Fec_ActaComite: [new Date, Validators.required],
    Id_Sede: ['', Validators.required],
    Id_Area: ['', Validators.required],
    Id_Proceso: ['', Validators.required],
    Id_Problema: ['', Validators.required],
    Cod_OrdPro: ['', Validators.required],
    Cod_OrdTra: ['', Validators.required],
    Det_Problema: ['', Validators.required],
    Des_Detalle: ['', Validators.required],
    Des_Decision: ['', Validators.required],
    Num_Acta: [''],
    Flg_Estado: [''],
    Cod_Responsable: ['', Validators.required],
    Flg_Activo: [0],
    Cod_Usuario: [''],
    Des_Cliente: [{value: '', disabled: true}],
    Cod_EstCli: [{value: '', disabled: true}],
    Nom_Responsable: [''],
    Cod_Trabajador: [''],
    Nom_Trabajador: [''],
    Flg_Voto: [0],
    Voto_Favor: [0],
    Voto_Contra: [0],
    Resultado: [''],
    Num_Items: [0, Validators.required],
    Fec_ActaComite2: [''],
    Detalle: []
    },{
      validators: this.validarNumItems
  });

  dataSede: any[];
  dataArea: any[] = [];
  dataProceso: any[];
  dataProblema: any[];
  dataPartida: any[];
  dataTrabajador: any[];

  dataVoto: any[] = [
    {Flg_Voto: '1', Des_Voto: 'A FAVOR'},
    {Flg_Voto: '0', Des_Voto: 'EN CONTRA'}
  ];

  filtroTrabajador: Observable<any[]> | undefined;

  //displayedColumns: string[] = ['Nom_Trabajador', 'Des_Ocupacion', 'flg_Voto1', 'flg_Voto2', 'Des_Area', 'Firma','Acciones'];
  displayedColumns: string[] = ['Nom_Trabajador', 'Des_Ocupacion', 'flg_Voto1', 'flg_Voto2', 'Des_Area', 'Acciones'];
  dataSource: MatTableDataSource<Detalle>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ll_Pendiente: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private actasService: ActasService,
    private eventosService: EventosService,
    private seguridadRondasService: SeguridadRondasService,
    public dialogRef: MatDialogRef<DialogRegistarActaComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: Comite
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    //console.log(this.data)
    this.formulario.reset();
    this.formulario.patchValue({
      Accion: this.data.Accion,
      Id_ActaComite: this.data.Id_ActaComite,
      Fec_ActaComite: this.datePipe.transform(this.data.Fec_ActaComite['date'], 'yyyy-MM-ddTHH:mm'),
      Id_Sede: this.data.Id_Sede,
      Id_Area: this.data.Id_Area,
      Id_Proceso: this.data.Id_Proceso,
      Id_Problema: this.data.Id_Problema,
      Num_Acta: this.data.Num_Acta,
      Cod_OrdPro: this.data.Cod_OrdPro,
      Cod_OrdTra: this.data.Cod_OrdTra,
      Det_Problema: this.data.Det_Problema,
      Des_Detalle: this.data.Des_Detalle,
      Des_Decision: this.data.Des_Decision,
      Flg_Estado: this.data.Flg_Estado,
      Cod_Responsable: this.data.Cod_Responsable,
      Flg_Activo: this.data.Flg_Activo,
      Des_Cliente: this.data.Des_Cliente,
      Cod_EstCli: this.data.Cod_EstCli,
      Cod_Usuario: this.data.Cod_Usuario,
      Num_Items: this.data.Detalle.length,
      
      Detalle: this.data.Detalle,
    });

    this.dataSource = new MatTableDataSource(this.data.Detalle);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.listarPlantaEventos();
    this.listarAreasPlanta(0);
    this.listarProcesoComite();
    this.listarProblemaComite();
    this.listarTrabajadores();

    if(this.data.Id_ActaComite != 0){
      this.onBuscarOP(this.data.Cod_OrdPro);
      this.onLimpiarTrabajador();
    }
      
  }

  onBuscarOP(codOrdPro: string){
    if(codOrdPro.length > 0){
      this.actasService.getOP_PartidaClienteEstiloColor(codOrdPro, '')
        .subscribe((response) => {
          this.dataPartida = response;

          if(this.data.Id_ActaComite != 0)
            this.onSelectPartida(this.data.Cod_OrdTra);
        });
    }
  }

  listarPlantaEventos(){
    this.eventosService.listaPlantaEventos()
      .subscribe((response) => {
        this.dataSede = response;
      });
  }

  listarAreasPlanta(idPlanta: number){
    this.seguridadRondasService.listarAreasPlanta(idPlanta)
      .subscribe((response) => {
        this.dataArea = response;
      });
  }

  listarProcesoComite(){
    this.actasService.getComiteEmergenciaProceso()
      .subscribe((response) => {
        this.dataProceso = response;
      });
  }

  listarProblemaComite(){
    this.actasService.getComiteEmergenciaProblema()
      .subscribe((response) => {
        this.dataProblema = response;
      });
  }

  onSelectPartida(codOrdTra: string){
    let partida: any = [];

    partida = this.dataPartida.filter(d => d.Cod_OrdTra == codOrdTra);
    this.formulario.patchValue({
      Des_Cliente: partida[0].Des_Cliente,
      Cod_EstCli: partida[0].Cod_EstCli
    });
  }

  onInsertarParticipante(){
    if(this.formulario.get('Nom_Trabajador')?.value.trim().length > 0 && this.formulario.get('Flg_Voto')?.value != ''){
      let detalle: Detalle = {};

      detalle.Id_Participante = 0;
      detalle.Id_ActaComite = this.data.Id_ActaComite;
      detalle.Cod_Trabajador = this.formulario.get('Cod_Trabajador')?.value.trim();
      detalle.Flg_Voto = this.formulario.get('Flg_Voto')?.value.trim();
      detalle.Fec_Voto = new Date();
      detalle.Flg_Activo = 1
      detalle.Cod_Usuario = this.data.Cod_Usuario;
      detalle.Nom_Trabajador = this.formulario.get('Nom_Trabajador')?.value.trim();
      detalle.Num_Item = this.dataSource.data.length + 1;
      //console.log(detalle)
      this.data.Detalle.push(detalle)
      this.dataSource._updateChangeSubscription();
      this.onLimpiarTrabajador();
    }    
  }

  onQuitarParticipante(detalle: Detalle){
    let ln_Index = this.data.Detalle.indexOf(detalle);
    this.data.Detalle.splice(ln_Index, 1);
    this.dataSource._updateChangeSubscription();
    this.onLimpiarTrabajador()
  }  

  onLimpiarTrabajador(){
    let favor: number = 0;
    let contra: number = 0;

    this.dataSource.data.forEach(e => {
      if(e.Flg_Voto == 1)
        favor = favor + 1;
      else
        contra = contra + 1;
    });

    this.formulario.patchValue({
      Cod_Trabajador: '',
      Nom_Trabajador: '',
      Flg_Voto: '',
      Voto_Favor: favor,
      Voto_Contra: contra,
      Resultado: this.dataSource.data.length == 0 ? 'PENDIENTE' : (favor > contra ? 'APROBADO' : 'DESAPROBADO'), //favor > contra ? 'APROBADO' : 'DESAPROBADO',
      Flg_Estado: this.dataSource.data.length == 0 ? 'P' : (favor > contra ? 'A' : 'D'),
      Detalle: this.dataSource.data,
      Num_Items: this.dataSource.data.length
    });
  }

  listarTrabajadores(){
    this.seguridadRondasService.listarOperarioAreas('001','')
      .subscribe((response) => {
        this.dataTrabajador = response;
        this.recargarTrabajador();

        let responsable: any = [];        
        responsable = this.dataTrabajador.filter(d => d.Codigo == this.data.Cod_Responsable);
        
        this.formulario.controls['Nom_Responsable'].setValue(responsable[0].Trabajador);

        //if(this.data.Id_ActaComite != 0){
        //  let responsable: any[];
        //  responsable = response.filter(d => d.Codigo == this.data.Cod_Trabajador);
        //  this.formulario.controls['Nom_Trabajador'].setValue(responsable[0].Trabajador);
        //}
      });
  }

  // Responsable Acto/Condicion
  recargarTrabajador(){
    this.filtroTrabajador = this.formulario.controls['Nom_Trabajador'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterTrabajador(option) : this.dataTrabajador.slice())),
    );
  }  

  private _filterTrabajador(value: string): any[] {
    this.formulario.controls['Cod_Trabajador'].setValue('')
    const filterValue = value.toLowerCase();

    return this.dataTrabajador.filter(option => String(option.Codigo).toLowerCase().indexOf(filterValue ) > -1 || option.Trabajador.toLowerCase().indexOf(filterValue ) > -1);
  }

  selectTrabajador(option: any){
    this.formulario.controls['Cod_Trabajador'].setValue(option.Codigo);
  }
  

  filtrarAreasPlanta(){
    return this.dataArea.filter(data => data.Id_Planta == this.formulario.get('Id_Sede')?.value);
  }

  validarNumItems(form: FormGroup){
    const numItems = form.get('Num_Items')?.value;
    return numItems > 0 ? null : { mismatch: true };
  }

}

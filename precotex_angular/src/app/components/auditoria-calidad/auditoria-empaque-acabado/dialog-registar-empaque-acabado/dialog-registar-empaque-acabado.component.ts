import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from "ngx-spinner";

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';

interface data_det {
  Num_Auditoria: number; 
  Cod_Auditor: string; 
  Nom_Auditor:  string;
  Fecha_Auditoria: string;
  Cod_EstCli: string;
  Cod_TemCli: string;
  Lote: string;
  Tamano_Muestra: string;
  Observacion: string;
  Obs_Medida: string;
  Nro_Defectos: number;
  Flg_Status: number;
  Cod_Usuario: string; 
  Nom_Cliente: string; 
  Abr_Cliente: string; 
}

interface estilo {
  Cod_Cliente: string; 
  Cod_EstPro: string;
  Cod_EstCli: string;
  Des_EstCli: string;
  Cod_TemCli: string;
  Nom_TemCli: string;
  Nom_Cliente: string; 
  Abr_Cliente: string; 
  NRow: number;
}

interface data_op {
  Cod_OrdPro: string;
  Cod_Cliente: string;
  Cod_PurOrd: string;
  Cod_EstPro: string;
  Cod_Present: string;
  Des_Present: string;
  Cod_EstCli: string;
  Cod_TemCli: string;
  Nom_TemCli: string;
  Cod_Destino: string;
  Des_Destino: string;
  Flg_Estado: string;
  Num_Auditoria: number;
  Num_Auditoria_Op: number;
  Num_PreReq: string;
  Num_Encajadas: string;
  Cant_Cajas: string;
}

@Component({
  selector: 'app-dialog-registar-empaque-acabado',
  templateUrl: './dialog-registar-empaque-acabado.component.html',
  styleUrls: ['./dialog-registar-empaque-acabado.component.scss']
})
export class DialogRegistarEmpaqueAcabadoComponent implements OnInit {

  formulario = this.formBuilder.group({
    Num_Auditoria: [''],
    Cod_Auditor: [''],
    Fecha_Auditoria: [''],
    Fecha_Auditoria2: [''],
    Abr_Cliente: ['', Validators.required],
    Cod_EstCli: ['', Validators.required],
    Cod_TemCli: ['', Validators.required],
    Lote: ['0', Validators.required],
    Tamano_Muestra: ['0', Validators.required],
    Defectos: [0],
    PorcMuestra: [0],
    Observacion: [''],
    Obs_Medida: [''],
    Flg_Status: ['1'],
    Cod_Usuario: [''],
    Nom_Auditor: [''],
    Nom_Cliente: ['']
  }) 

  dataEstilos: estilo[] = []
  dataTemporadaCli: any = [];
  dataEstiloCli: any = [];
  dataOrdPro: any = [];
  
  filtroEstiloCliente : Observable<estilo[]> | undefined;

  displayedColumns: string[] = [
    'Flg_Estado',
    'Cod_OrdPro',
    'Des_Present',
    'Destino',
    'Cod_PurOrd',
    'Num_PreReq',
    'Num_Encajadas',
    'Cant_Cajas',
    'Estado'
  ];

  dataSource: MatTableDataSource<data_op>;
  selection = new SelectionModel<data_op>(true, []);
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataCheck: Array<data_op> = [];

  Fecha = new Date();
  Titulo: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private spinnerService: NgxSpinnerService,
    private auditoriaAcabadosService: AuditoriaAcabadosService,   
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,            
    @Inject(MAT_DIALOG_DATA) public data: data_det,
    private dialogRef: MatDialogRef<DialogRegistarEmpaqueAcabadoComponent>
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.Titulo = this.data.Cod_EstCli;
    this.CargarAuditor(this.data.Cod_Auditor);

    this.formulario.reset();
    this.formulario.patchValue({
      Num_Auditoria: this.data.Num_Auditoria,
      Cod_Auditor: this.data.Cod_Auditor,
      Fecha_Auditoria: this.data.Num_Auditoria != 0 ? this.data.Fecha_Auditoria : this.Fecha.toDateString(),
      Fecha_Auditoria2: this.data.Num_Auditoria != 0 ? this.data.Fecha_Auditoria : this.Fecha.toLocaleDateString(),
      Abr_Cliente: this.data.Abr_Cliente,
      Cod_EstCli: this.data.Cod_EstCli,
      Cod_TemCli: this.data.Cod_TemCli,
      Lote: this.data.Lote,
      Tamano_Muestra: this.data.Tamano_Muestra,
      Observacion: this.data.Observacion,
      Obs_Medida: this.data.Obs_Medida,
      Flg_Status: this.data.Flg_Status.toString(),
      Defectos: this.data.Nro_Defectos,
      Nom_Cliente: this.data.Nom_Cliente
    });

    this.formulario.controls['Nom_Auditor'].disable();
    this.formulario.controls['Fecha_Auditoria2'].disable();
    this.formulario.controls['Nom_Cliente'].disable();
    this.formulario.controls['Defectos'].disable();
    this.formulario.controls['PorcMuestra'].disable();
    
    if(this.data.Num_Auditoria!=0){
      this.formulario.controls['Num_Auditoria'].disable();
      this.formulario.controls['Abr_Cliente'].disable();
      this.formulario.controls['Cod_EstCli'].disable();
      this.formulario.controls['Cod_TemCli'].disable();

      if(this.data.Flg_Status!=0)
        this.formulario.controls['Flg_Status'].disable();

      this.onBuscarEstilo()
      this.selectTemporada(this.data);
      this.getPorcentajeMuestra();
    }    

  }

  submit(formDirective) :void{
    
    let lc_accion: string = this.data.Num_Auditoria == 0 ? "I" : "U"
    //console.log(this.dataCheck)
    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_AuditoriaModuloEmpaqueAcabado(
      lc_accion,
      this.formulario.get('Num_Auditoria')?.value,
      this.formulario.get('Cod_Auditor')?.value, 
      this.formulario.get('Fecha_Auditoria')?.value, 
      this.formulario.get('Fecha_Auditoria')?.value, 
      this.formulario.get('Cod_EstCli')?.value, 
      this.formulario.get('Cod_TemCli')?.value, 
      this.formulario.get('Lote')?.value, 
      this.formulario.get('Tamano_Muestra')?.value, 
      this.formulario.get('Observacion')?.value, 
      this.formulario.get('Obs_Medida')?.value, 
      this.formulario.get('Flg_Status')?.value)
      .subscribe((res) => {
        //console.log(res)
        if(res[0].Respuesta == "OK"){
          this.dataCheck.forEach(element => {
            lc_accion = element.Num_Auditoria_Op ? "U" : "I";

            this.auditoriaAcabadosService.Mant_AuditoriaModuloEmpaqueAcabadoOp(
              lc_accion,
              element.Num_Auditoria_Op,
              res[0].Num_Auditoria,
              element.Cod_OrdPro,
              element.Cod_EstCli,
              element.Cod_TemCli,
              element.Cod_Present,
              element.Flg_Estado
            ).subscribe((res) => {
              console.log(res)
            });
          });
          this.spinnerService.hide();
          this.matSnackBar.open("Registro Ok!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      });

  }

  onBuscarEstilo(){
    let abrCliente: string = this.formulario.get('Abr_Cliente')?.value;
    let codEstCli: string = this.formulario.get('Cod_EstCli')?.value;

    if(abrCliente.length >= 2){
      this.auditoriaAcabadosService.Get_TemporadaClienteXEstilo(abrCliente)
      .subscribe((res: any) => {
        this.dataEstilos = res;
        
        this.dataEstiloCli = res.filter(d => d.NRow == 1);
        
        if(codEstCli.length > 0)
          this.dataTemporadaCli = this.dataEstilos;  // Valido para mostrar temporada en la edición del registro
        
        if(this.dataEstiloCli.length > 0){
          this.formulario.patchValue({
            Nom_Cliente: this.dataEstilos[0].Nom_Cliente
          });
          
          this.recargarEstiloCliente()
        } else {
          this.formulario.patchValue({
            Nom_Cliente: ""
          });
        }
        //console.log(this.dataEstiloCli)
      });
    }
  }

  recargarEstiloCliente(){
    this.filtroEstiloCliente = this.formulario.controls['Cod_EstCli'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.dataEstiloCli.slice())),
    );
  }
 
  private _filterOperacionAuditor(value: string): estilo[] {
    this.formulario.controls['Cod_TemCli'].setValue('');
    const filterValue = value.toLowerCase();
    
    return this.dataEstiloCli.filter(option => String(option.Cod_EstCli).toLowerCase().indexOf(filterValue ) > -1 || 
      option.Des_EstCli.toLowerCase().indexOf(filterValue ) > -1);
  }

  selectEstilo(codEstCli: any){
    this.dataTemporadaCli = this.dataEstilos.filter(d => d.Cod_EstCli == codEstCli)
  }

  selectTemporada(item: any){
    let numAuditoria: number = this.formulario.get('Num_Auditoria')?.value;

    //console.log(item)
    this.auditoriaAcabadosService.Mant_AuditoriaModuloEmpaqueAcabadoOp('L', 0, numAuditoria, '', item.Cod_EstCli.trim(), item.Cod_TemCli.trim(), '', '')
      .subscribe((res) => {
        this.dataOrdPro = res;

        this.dataSource = this.dataOrdPro;
        if(this.data.Num_Auditoria!=0){
          this.dataCheck = this.dataOrdPro.filter(d => d.Flg_Estado == "1")
        }
      });
  }

  changeCheck(event, data_op: data_op){ 
    if(event.target.checked == true){
      data_op.Flg_Estado = '1';
      this.dataCheck.push(data_op);
    }else{
      data_op.Flg_Estado = '0';
      var indice = this.dataCheck.indexOf(data_op);
      this.dataCheck.splice(indice, 1);
    }

    //console.log(this.dataCheck)
    //console.log(this.data.Flg_Status)
  }

  getPorcentajeMuestra(){
    let ln_lote: number = this.formulario.get('Lote')?.value;
    let ln_muestra: number = this.formulario.get('Tamano_Muestra')?.value;

    this.formulario.patchValue({
      PorcMuestra: ((ln_muestra / ln_lote) * 100).toFixed(2)
    });

  }

  CargarAuditor(codAuditor: string){
    //console.log(codAuditor)
    let listaAuditores = [];
    let listaAuditor = [];

    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('L', codAuditor, '', '', 0, '')
      .subscribe((result: any) => {
        listaAuditores = result

        listaAuditor = listaAuditores.filter(d => d.Tip_Trabajador == codAuditor.substring(0,1) && d.Cod_Auditor == codAuditor.substring(2,6));
        if (listaAuditor.length > 0){
          this.formulario.patchValue({
            Nom_Auditor: listaAuditor[0].Nom_Auditor
          });
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  onCambiarStatus(value){
    this.data.Flg_Status = value;
  }

}

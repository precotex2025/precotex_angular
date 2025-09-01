import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';

import { DialogProgramacionAuditoriaFechaComponent } from './../dialog-programacion-auditoria-fecha/dialog-programacion-auditoria-fecha.component';

interface data_det {
  Id_Auditoria?: number;
  Fecha_Programacion?: Date;
  Fec_Programacion?: Date;
  Id_TipoAuditoria?: string;
  Cod_EstPro?: string;
  Cod_TemCli?: string;
  Cod_OrdPro?: string;
  Cod_Auditor?: string;
  Observacion?: string;
  Fecha_Registro?: string;
  Usu_Registro?: string;
  Fecha_Edicion?: string;
  Usu_Edicion?: string;
  Cod_EstCli?: string;
  Des_Auditoria?: string;
  Abr_Cliente?: string;
  Cod_Usuario?: string;
  Nom_Auditor?: string;
  Cod_Cliente?: string;
  Nom_Cliente?: string;
  Flg_KeyProg?: number;
  Ndias?: number;
  IsPcp?: boolean;
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
  Cod_OrdPro?: string;
  Cod_Cliente?: string;
  Cod_PurOrd?: string;
  Cod_EstPro?: string;
  Cod_Present?: string;
  Des_Present?: string;
  Cod_EstCli?: string;
  Cod_TemCli?: string;
  Nom_TemCli?: string;
  Cod_Destino?: string;
  Des_Destino?: string;
  Flg_Estado?: string;
  Id_Auditoria?: string;
  Id_Auditoria_Op?: string;
  Fecha_Programacion?: Date;
  Fec_Programacion?: Date;
  Fec_Auditoria?: Date;
  Fec_Empaque?: Date;
  Des_Estado?: string;
  Flg_Status?: string;
  Des_Estado_2?: string;
  Flg_Estado_2?: string;
  Num_Auditoria?: number;
  Id_Reprogramacion?: number;
  Flg_ProgFec?: string;
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}

@Component({
  selector: 'app-dialog-programacion-auditoria-registro',
  templateUrl: './dialog-programacion-auditoria-registro.component.html',
  styleUrls: ['./dialog-programacion-auditoria-registro.component.scss']
})
export class DialogProgramacionAuditoriaRegistroComponent implements OnInit {

  formulario = this.formBuilder.group({
    Id_Auditoria: [''],
    Fecha_Programacion: [''],
    Id_TipoAuditoria: [''],
    Abr_Cliente: [''],
    Cod_EstPro: [''],
    Cod_EstCli: [''],
    Cod_OrdPro: [''],
    Cod_TemCli: ['', Validators.required],
    Cod_Cliente: ['', Validators.required],
    Observacion: [''],
    Cod_Auditor: [''],
    Cod_Usuario: [''],
    Nom_Auditor: ['', Validators.required],
    Nom_Cliente: ['', Validators.required],
    Des_Auditoria: [{value: "", disabled: true}]
  });

  dataCliente: Cliente[] = [];
  dataTemporadaCliente: any[] = [];
  dataTipoAuditoria: any[] = [];
  dataEstilos: estilo[] = []
  dataTemporadaCli: any = [];
  dataEstiloCli: any = [];
  dataOrdPro: any = [];
  dataOperacionAuditor: Auditor[] = [];

  filtroCliente: Observable<Cliente[]> | undefined;
  filtroOperacionAuditor: Observable<Auditor[]> | undefined;
  filtroEstiloCliente : Observable<estilo[]> | undefined;

  //displayedColumns: string[] = ['select','Cod_EstCli','Num_PreReq','OPs','Num_Auditoria','Fecha_Programacion','Flg_Estado','Flg_Estado_2'];
  displayedColumns: string[] = ['select','Cod_EstCli','Num_PreReq','OPs','Fecha_Programacion','Flg_Estado','Flg_Estado_2'];
  displayedColumnsFechas: string[] = [];
  
  dataSource: MatTableDataSource<data_op>;
  selection = new SelectionModel<data_op>(true, []);
  //columnsToDisplay: string[] = this.displayedColumns.slice();
  
  dataCheck: Array<data_op> = [];
  
  Fecha = new Date();
  Titulo: string = '';
  Flg_Edita: boolean = true;
  Flg_Prog: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private spinnerService: NgxSpinnerService,
    private datepipe: DatePipe,
    public dialog: MatDialog,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    @Inject(MAT_DIALOG_DATA) public data: data_det,
    private dialogRef: MatDialogRef<DialogProgramacionAuditoriaRegistroComponent>
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    console.log(this.data)
    this.Titulo = this.data.Cod_EstCli;

    this.formulario.reset();
    this.formulario.patchValue({
      Id_Auditoria: this.data.Id_Auditoria,
      Fecha_Programacion: this.data.Id_Auditoria != 0 ? new Date(this.data.Fec_Programacion) : this.Fecha, //.toDateString(),
      Id_TipoAuditoria: this.data.Id_TipoAuditoria,
      Abr_Cliente: this.data.Abr_Cliente,
      Cod_EstPro: this.data.Cod_EstPro,
      Cod_EstCli: this.data.Cod_EstCli,
      Cod_OrdPro: this.data.Cod_OrdPro,
      Cod_Cliente: this.data.Cod_Cliente,
      Cod_TemCli: this.data.Cod_TemCli,
      Observacion: this.data.Observacion,
      Cod_Auditor: this.data.Cod_Auditor,
      Cod_Usuario: this.data.Cod_Usuario,
      Nom_Auditor: this.data.Nom_Auditor,
      Nom_Cliente: this.data.Nom_Cliente,
      Des_Auditoria: this.data. Des_Auditoria
    });

    if(this.data.Id_Auditoria != 0){
      //console.log(this.Fecha)
      //console.log(this.Fecha.getHours())
      this.formulario.controls['Fecha_Programacion'].disable();
      //this.formulario.controls['Id_TipoAuditoria'].disable();
      //this.formulario.controls['Abr_Cliente'].disable();
      //this.formulario.controls['Cod_EstCli'].disable();
      this.formulario.controls['Cod_TemCli'].disable();
      this.formulario.controls['Cod_OrdPro'].disable();
      this.formulario.controls['Nom_Cliente'].disable();
      this.formulario.controls['Nom_Auditor'].disable();

      //this.onBuscarEstilo();
      this.selectTemporada(this.data);
      this.selectCliente(this.data.Cod_Cliente)
      this.formulario.controls['Cod_TemCli'].setValue(this.data.Cod_TemCli.trim());
      this.Flg_Edita = this.data.Ndias == 0 ? true : false;

      if(this.data.Flg_KeyProg == 0){
        // Fijar hora/minuto limite de programación diaria.
        let horas = 18;
        let minutos = 30;

        this.Flg_Prog = this.Fecha.getHours() >= horas && (((this.Fecha.getHours() - horas) * 60) + this.Fecha.getMinutes()) >= minutos ? false : true
      }
        
    }  

    this.cargarOperacionAuditor(this.data.Cod_Auditor);
    this.cargarTipoAuditoria('T');
    this.cargarClientes();
  }

  onSubmit() :void{

    const formData = new FormData();
    formData.append('Accion', this.data.Id_Auditoria == 0 ? "I" : "U");
    formData.append('Id_Auditoria', this.data.Id_Auditoria.toString());
    formData.append('Fecha_Programacion', this.datepipe.transform(this.formulario.get('Fecha_Programacion')?.value, 'yyyy-MM-ddTHH:mm:ss'));
    //formData.append('Id_TipoAuditoria', this.formulario.get('Id_TipoAuditoria')?.value);
    //formData.append('Cod_EstPro', this.formulario.get('Cod_EstPro')?.value);
    formData.append('Cod_Cliente', this.formulario.get('Cod_Cliente')?.value);
    formData.append('Cod_TemCli', this.formulario.get('Cod_TemCli')?.value);
    formData.append('Cod_OrdPro', this.formulario.get('Cod_OrdPro')?.value);
    formData.append('Cod_Auditor', this.formulario.get('Cod_Auditor')?.value);
    formData.append('Flg_KeyProg', '0');
    //formData.append('Observacion', this.formulario.get('Observacion')?.value);
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    //console.log(this.dataCheck)
    this.spinnerService.show();
    this.auditoriaAcabadosService.MantenimientoProgramacionAuditoria(formData)
      .subscribe((res) => {
        //console.log(res)
        
        if(res[0].Respuesta == "OK"){
          this.dataSource.data.forEach(element => {
            //console.log(element.Flg_Status)
            //console.log(element.Id_Auditoria_Op)
            if(element.Flg_Status != "0" || element.Id_Auditoria_Op != "0"){
              let fechaProg = new Date(element.Fec_Programacion);

              const formData = new FormData();
              formData.append('Accion', element.Flg_Status == "1" ? (element.Id_Auditoria_Op == "0" ? "I" : "U") : element.Flg_Status == "2" ? "I" : "D");
              //formData.append('Accion', element.Flg_Status == "1" ? (element.Id_Auditoria_Op == "0" ? "I" : "U") : "D");
              formData.append('Id_Auditoria_Op', element.Id_Auditoria_Op);
              formData.append('Id_Auditoria', res[0].Id_Auditoria.toString());
              formData.append('Fecha_Programacion', fechaProg.toISOString());
              formData.append('Fecha_Auditoria', element.Id_Auditoria_Op == "0" ? '' : element.Fec_Auditoria ? element.Fec_Auditoria.toLocaleString() : '');
              formData.append('Fecha_Empaque', '');
              formData.append('Cod_EstCli', element.Cod_EstCli);
              formData.append('Cod_OrdPro', '');
              formData.append('Cod_Present', '');
              formData.append('Flg_Estado', element.Flg_Status == "1" ? (element.Id_Auditoria_Op == '0' ? '0' : element.Flg_Estado) : '0');
              formData.append('Flg_Estado_2', element.Flg_Status == "1" ? (element.Id_Auditoria_Op == '0' ? '0' : element.Flg_Estado_2) : '0');
              formData.append('Id_Motivo', '1');
              formData.append('Cod_Cliente', element.Cod_Cliente);
              formData.append('Cod_EstPro', '');
              formData.append('Cod_TemCli', element.Cod_TemCli);
              formData.append('Cod_Auditor', '');
              formData.append('Fecha_Registro', '');
              formData.append('Fecha_Registro2', '');
              formData.append('Cod_Usuario', GlobalVariable.vusu);
  
              this.auditoriaAcabadosService.MantenimientoProgramacionAuditoriaOp(formData)
                .subscribe((res) => {
                  console.log(res)
              });  
            }
          });

          this.spinnerService.hide();
          this.matSnackBar.open("Registro Ok!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      }
    );
  }

  onBuscarEstilo(){
    let abrCliente: string = this.formulario.get('Abr_Cliente')?.value;
    let codEstCli: string = this.formulario.get('Cod_EstCli')?.value;
    
    if(abrCliente.length >= 2){
      this.auditoriaAcabadosService.Get_TemporadaClienteXEstilo(abrCliente)
      .subscribe((res: any) => {
        this.dataEstilos = res;
        
        this.dataEstiloCli = res.filter(d => d.NRow == 1);
        //console.log(this.dataEstiloCli)
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
      map(option => (option ? this._filterEstiloCliente(option) : this.dataEstiloCli.slice())),
    );
  }

  private _filterEstiloCliente(value: string): estilo[] {
    this.formulario.controls['Cod_TemCli'].setValue('');
    const filterValue = value.toLowerCase();
    
    return this.dataEstiloCli.filter(option => String(option.Cod_EstCli).toLowerCase().indexOf(filterValue ) > -1 || 
      option.Des_EstCli.toLowerCase().indexOf(filterValue ) > -1);
  }

  selectEstilo(item: any){
    this.dataTemporadaCli = this.dataEstilos.filter(d => d.Cod_EstCli == item.Cod_EstCli)
    this.formulario.controls['Cod_EstPro'].setValue(item.Cod_EstPro);
  }

  selectTemporada(item: any){
    //console.log(item)
    const formData = new FormData();
    formData.append('Accion', 'E');
    formData.append('Id_Auditoria_Op', '0');
    formData.append('Id_Auditoria', this.data.Id_Auditoria.toString());
    formData.append('Fecha_Programacion', '');
    formData.append('Fecha_Auditoria', '');
    formData.append('Fecha_Empaque', '');
    formData.append('Cod_EstCli', '');
    formData.append('Cod_OrdPro', this.formulario.get('Cod_OrdPro')?.value);
    formData.append('Cod_Present', '');
    formData.append('Flg_Estado', '');
    formData.append('Flg_Estado_2', '');
    formData.append('Id_Motivo', '');
    formData.append('Cod_Cliente', item.Cod_Cliente.trim());
    formData.append('Cod_EstPro', '');
    formData.append('Cod_TemCli', item.Cod_TemCli.trim());
    formData.append('Cod_Auditor', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', '');

    this.dataSource.data = [];

    this.auditoriaAcabadosService.MantenimientoProgramacionAuditoriaOp(formData)
      .subscribe((res: any[]) => {
        //console.log(res)
        this.dataOrdPro = res;
        if(this.dataOrdPro[0].Cod_Cliente != ''){
            
          //console.log(this.displayedColumns)
          Object.keys(this.dataOrdPro[0]).forEach(e => {
            if(e.substring(0,8) == 'Fch_Prog'){
              this.displayedColumns.push(e);
              this.displayedColumnsFechas.push(e);
            }
          })
          //console.log(this.displayedColumns)

          this.dataSource = new MatTableDataSource(this.dataOrdPro);
          this.selection.clear();

        } else {
          //console.log("aqqqi")
          this.matSnackBar.open(this.dataOrdPro[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
    }
    );
  }

  onBuscarOp(){
    let dataitem: any[];
    let item: any = {};

    let codOrdPro = this.formulario.get('Cod_OrdPro')?.value
    if(codOrdPro.length == 0 || codOrdPro.length >= 5){
      dataitem = this.dataTemporadaCli.filter(d => d.Cod_TemCli == this.formulario.get('Cod_TemCli')?.value);

      item.Cod_Cliente = dataitem[0].Cod_Cliente;
      item.Cod_TemCli = dataitem[0].Cod_TemCli
      this.selectTemporada(item);
    }
  }

  changeCheck(event, data_op: data_op){ 
    if(event.target.checked == true){
      this.dataCheck.push(data_op);
    }else{
      var indice = this.dataCheck.indexOf(data_op);
      this.dataCheck.splice(indice, 1);
    }
    //console.log(this.dataCheck)
  }

  onProgramarAuditoria(status: String){
    if(this.Flg_Prog){
      if(this.selection.selected.length > 0){
        this.dataCheck = this.selection.selected
        //console.log(this.dataCheck)
  
        let dialogRef = this.dialog.open(DialogProgramacionAuditoriaFechaComponent, {
          disableClose: true,
          data: {fechaMin: this.formulario.get('Fecha_Programacion')?.value}
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if(result || result != ''){
            //console.log("result")
            //console.log(result)
            this.dataCheck.forEach((element) => {
              //console.log("status:->", status)
              var indice = this.dataSource.data.indexOf(element);
              if(status == '1'){ // Programar
                this.dataSource.data[indice].Flg_Status = '1';
                this.dataSource.data[indice].Fecha_Programacion = result;
                this.dataSource.data[indice].Fec_Programacion = new Date(result);
                this.dataSource.data[indice].Flg_ProgFec = '1';
              } else {  // Reprogramar
                if(element.Flg_Status == '0'){
                  //console.log("entra al programar")
                  this.dataSource.data[indice].Flg_Status = '1';
                  this.dataSource.data[indice].Fecha_Programacion = result;
                  this.dataSource.data[indice].Fec_Programacion = new Date(result);
                  this.dataSource.data[indice].Flg_ProgFec = '1';
                } else {
                  //console.log("entra al reprogramar")
                  //console.log(element.Flg_Estado)
                  //if((element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3') && element.Id_Reprogramacion == 0){
                  if(element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3'){
                    //console.log("entro")
                    this.dataSource.data[indice].Flg_Status = '2';
                    this.dataSource.data[indice].Fecha_Programacion = result;
                    this.dataSource.data[indice].Fec_Programacion = new Date(result); 
                    this.dataSource.data[indice].Flg_ProgFec = '1'
                  }
                }
              }
  
            });
          }
          else{
            //console.log("cancelar fecha")
            this.dataCheck.forEach((element) => {
              var indice = this.dataSource.data.indexOf(element);
              if(element.Flg_Status == '1'){
                this.dataSource.data[indice].Flg_Status = '0';
                this.dataSource.data[indice].Fecha_Programacion = null;
                this.dataSource.data[indice].Fec_Programacion = null;  
                this.dataSource.data[indice].Flg_ProgFec = '0'
              } else {
                //if((element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3') && element.Id_Reprogramacion == 0){
                if(element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3'){
                  this.dataSource.data[indice].Flg_Status = '0';
                  this.dataSource.data[indice].Fecha_Programacion = null;
                  this.dataSource.data[indice].Fec_Programacion = null;  
                  this.dataSource.data[indice].Flg_ProgFec = '0'
                }
              }
            });
          }
          this.dataCheck.length = 0;
          this.selection.clear();
          //console.log(this.dataSource.data)
          //this.onSubmit()
        }); 
      }
    } else{
      this.matSnackBar.open("No es posible programar auditorias despues de las 18:30 horas!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
    }
    
  }


  xonProgramarAuditoria(status: String){
    //if(this.dataCheck.length > 0){
    if(this.selection.selected.length > 0){
      this.dataCheck = this.selection.selected
      //console.log(this.dataCheck)

      let dialogRef = this.dialog.open(DialogProgramacionAuditoriaFechaComponent, {
        disableClose: true,
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result || result != ''){
          //console.log("result")
          //console.log(result)
          this.dataCheck.forEach((element) => {
            //console.log("status:->", status)
            var indice = this.dataSource.data.indexOf(element);
            if(status == '1'){
              //console.log("entra al programar")
              this.dataSource.data[indice].Flg_Status = '1';
              this.dataSource.data[indice].Fecha_Programacion = result;
              this.dataSource.data[indice].Fec_Programacion = new Date(result);  
            } else {
              //console.log("entra al reprogramar")
              //console.log(element.Flg_Estado)
              //if((element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3') && element.Id_Reprogramacion == 0){
              if(element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3'){
                //console.log("entro")
                this.dataSource.data[indice].Flg_Status = '2';
                this.dataSource.data[indice].Fecha_Programacion = result;
                this.dataSource.data[indice].Fec_Programacion = new Date(result);    
              }
            }
          });
        }
        else{
          //console.log("cancelar fecha")
          this.dataCheck.forEach((element) => {
            var indice = this.dataSource.data.indexOf(element);
            if(status == '1'){
              this.dataSource.data[indice].Flg_Status = '0';
              this.dataSource.data[indice].Fecha_Programacion = null;
              this.dataSource.data[indice].Fec_Programacion = null;  
            } else {
              //if((element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3') && element.Id_Reprogramacion == 0){
              if(element.Flg_Estado == '2' || element.Flg_Estado_2 == '2' || element.Flg_Estado == '3' || element.Flg_Estado_2 == '3'){
                this.dataSource.data[indice].Flg_Status = '0';
                this.dataSource.data[indice].Fecha_Programacion = null;
                this.dataSource.data[indice].Fec_Programacion = null;  
              }
            }
          });
        }
        this.dataCheck.length = 0;
        this.selection.clear();
        //console.log(this.dataSource.data)
        //this.onSubmit()
      });
      
    }
  }

  cargarOperacionAuditor(codAuditor: string){
    this.dataOperacionAuditor = [];
    let listaAuditor = [];

    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('I', codAuditor, '', '', 0, '')
      .subscribe((result: any) => {
        this.dataOperacionAuditor = result;
        listaAuditor = this.dataOperacionAuditor.filter(d => d.Tip_Trabajador == codAuditor.substring(0,1) && d.Cod_Auditor == codAuditor.substring(2,6))
        if (listaAuditor.length > 0){
          this.formulario.patchValue({
            Nom_Auditor: listaAuditor[0].Nom_Auditor
          });
        }

        this.recargarOperacionAuditor();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );  
  }
  
  recargarOperacionAuditor(){
    this.filtroOperacionAuditor = this.formulario.controls['Nom_Auditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.dataOperacionAuditor.slice())),
    );
  }

  private _filterOperacionAuditor(value: string): Auditor[] {
    this.formulario.controls['Cod_Auditor'].setValue('')
    const filterValue = value.toLowerCase();

    return this.dataOperacionAuditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  seleccionarAuditor(option: Auditor){
    this.formulario.controls['Cod_Auditor'].setValue(option.Tip_Trabajador.concat("-").concat(option.Cod_Auditor));

  }

  cargarTipoAuditoria(tipo: string){
    this.auditoriaAcabadosService.ListaTipoAuditoria(tipo)
      .subscribe((result: any) => {
        this.dataTipoAuditoria = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  cargarClientes(){
    this.auditoriaAcabadosService.ListaClientes()
      .subscribe((result: any) => {
        this.dataCliente = result;
        this.recargarCliente()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  recargarCliente(){
    this.filtroCliente = this.formulario.controls['Nom_Cliente'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterCliente(option) : this.dataCliente.slice())),
    );
  }

  private _filterCliente(value: string): Cliente[] {
    this.formulario.controls['Cod_Cliente'].setValue('')
    const filterValue = value.toLowerCase();

    return this.dataCliente.filter(option => String(option.Cod_Cliente).toLowerCase().indexOf(filterValue ) > -1 || option.Nom_Cliente.toLowerCase().indexOf(filterValue ) > -1);
  }

  selectCliente(codCliente: string){
    this.formulario.controls['Cod_Cliente'].setValue(codCliente);

    this.auditoriaAcabadosService.ListaTemporadaCliente(codCliente)
      .subscribe((result: any) => {
        this.dataTemporadaCli = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

    
    //console.log(this.formulario.get('Fecha_Programacion')?.value)
    //console.log(this.datepipe.transform(this.formulario.get('Fecha_Programacion')?.value, 'yyyy-MM-ddTHH:mm:ss'))
    //console.log(this.formulario.get('Fecha_Programacion')?.value.toDateString())
    //console.log(this.formulario.get('Fecha_Programacion')?.value.toLocaleDateString())
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: data_op): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id_Auditoria_Op! + 1}`;
  }
  
}

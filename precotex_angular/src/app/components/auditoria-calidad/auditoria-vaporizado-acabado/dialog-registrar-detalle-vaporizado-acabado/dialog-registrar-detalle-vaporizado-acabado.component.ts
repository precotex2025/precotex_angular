import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';

import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

interface data{
  Num_Auditoria:          number
  Num_Auditoria_Detalle:  number,
  Tip_Auditoria:          string,
  Cod_OrdPro:             string,
  Cod_Cliente:            string,
  Des_Cliente:            string,
  Cod_EstCli:             string,
  Des_EstPro:             string,
  Cod_Present:            string,
  Des_Present:            string,
  Cod_Operario:           string,
  Cod_LinPro:             string
  Can_Muestra:            number,
  Observacion:            string,
  Flg_Status:             string,
  Flg_Reproceso:          string,
  Flg_Reproceso_Num:      number,
  Nom_Operario:           string,
  Des_Servicio:           string
}

interface Inspector {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Color {
  Cod_Present: string;
  Des_Present: string; 
  
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string
}

interface Servicio {
  Cod_LinPro: string;
  Des_Servicio: string;
  Descripcion: string;
}


@Component({
  selector: 'app-dialog-registrar-detalle-vaporizado-acabado',
  templateUrl: './dialog-registrar-detalle-vaporizado-acabado.component.html',
  styleUrls: ['./dialog-registrar-detalle-vaporizado-acabado.component.scss']
})
export class DialogRegistrarDetalleVaporizadoAcabadoComponent implements OnInit {

  listar_operacionColor:        Color[] = [];
  listar_Auditor:               Auditor[] = [];
  listar_Servicio:              Servicio[] = [];
  filtroAuditor:                Observable<Auditor[]> | undefined;
  filtroServicio:               Observable<Servicio[]> | undefined;

  // nuevas variables
  Cod_Accion              = '';
  Num_Auditoria_Detalle   = 0;
  Num_Auditoria           = this.data.Num_Auditoria;
  Tip_Auditoria           = '1';
  Cod_OrdPro              = '';
  Cod_Cliente             = '';
  Cod_EstCli              = '';
  Cod_Present             = '';
  Cod_Operario            = '';
  Tip_Trabajador_Operario = '';
  Cod_LinPro              = '';
  Can_Muestra             = 0;
  Observacion             = '';
  Flg_Status              = this.data.Flg_Status;
  Flg_Reproceso           = '';
  Flg_Reproceso_Num       = 0;
  Cod_Usuario             = GlobalVariable.vusu;
  Cod_Equipo              = '';
  Fecha_Reg               = ''; 
  Titulo                  = ''
  //Cargar auditores
  Cod_Auditor             = '';
  Nom_Auditor             = '';
  Cod_Motivo              = '';
  Can_Lote                = 0;
  
  isConditionTrue: boolean = false;
  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Tip_Auditoria:    [''],
    OP:               [''],
    Cliente:          [''],
    Estilo:           [''],
    Color:            [''],
    Muestra:          [''],
    CodCliente:       [''],
    CodEstCli:        [''],
    Cod_Operario:     [''],
    Nom_Operario:     [''],
    Cod_LinPro:       [''],
    Des_Servicio:     [''],
    Observacion:      ['']
  }) 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) {

      this.formulario = formBuilder.group({
        Tip_Auditoria:   ['1',],
        OP:              ['', Validators.required],
        Cliente:         ['', Validators.required],
        Estilo:          ['', Validators.required],
        Color:           ['', Validators.required],
        Muestra:         ['', Validators.required],
        CodCliente:      ['', Validators.required],
        CodEstCli:       ['', Validators.required],
        Cod_Operario:    [''],
        Nom_Operario:    [''],
        Cod_LinPro:      [''],
        Des_Servicio:    [''],
        Observacion:     ['']
      });
    }

  ngOnInit(): void {

    this.formulario.controls['Cliente'].disable();
    this.formulario.controls['Estilo'].disable();  
    this.formulario.controls['CodEstCli'].disable();
    this.formulario.controls['Cod_Operario'].disable();
    this.formulario.controls['Cod_LinPro'].disable();   
    this.Titulo    = this.data.Cod_Cliente;

    if(this.Titulo != undefined){

      this.CargarAuditor();
      this.CargarServicios();
      this.Tip_Auditoria = this.data.Tip_Auditoria;

      this.formulario.controls['Tip_Auditoria'].disable();
      this.formulario.controls['OP'].disable();
      this.formulario.controls['Color'].disable();
      this.formulario.controls['Muestra'].enable();
      this.formulario.controls['Nom_Operario'].disable();
      this.formulario.controls['Des_Servicio'].disable();

      this.formulario.controls['Tip_Auditoria'].setValue(this.data.Tip_Auditoria.toString());
      this.formulario.controls['OP'].setValue(this.data.Cod_OrdPro);
      this.formulario.controls['Cliente'].setValue(this.data.Des_Cliente);
      this.formulario.controls['Estilo'].setValue(this.data.Cod_EstCli);
      this.formulario.controls['CodEstCli'].setValue(this.data.Cod_EstCli);
      this.formulario.controls['Color'].setValue(this.data.Cod_Present);
      this.formulario.controls['Muestra'].setValue(this.data.Can_Muestra);
      this.formulario.controls['Observacion'].setValue(this.data.Observacion);
      this.formulario.controls['Cod_Operario'].setValue(this.data.Cod_Operario);
      this.formulario.controls['Nom_Operario'].setValue(this.data.Nom_Operario);
      this.formulario.controls['Cod_LinPro'].setValue(this.data.Cod_LinPro);    
      this.formulario.controls['Des_Servicio'].setValue(this.data.Des_Servicio);   
      this.buscarEstiloClientexOP();

    } else {

      this.CargarAuditor();
      this.CargarServicios();  
    }

  }

  CargarAuditor(){

    this.listar_Auditor = [];
    this.listar_Servicio = [];

    this.Cod_Accion   = 'L'
    this.Cod_Auditor  = ''
    this.Nom_Auditor  = ''
    this.Cod_OrdPro   = ''
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
      ).subscribe(
      (result: any) => {
        this.listar_Auditor = result
        this.RecargarAuditor()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  RecargarAuditor(){
    this.filtroAuditor = this.formulario.controls['Nom_Operario'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterAuditor(option) : this.listar_Auditor.slice())),
    );
    
  }

  private _filterAuditor(value: string): Auditor[] {
    this.formulario.controls['Cod_Operario'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_Auditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarCodLider(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['Cod_Operario'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
  }

  CargarServicios(){
    this.auditoriaAcabadosService.ListarLineaProd_Servicios()
      .subscribe((result: any) => {
        this.listar_Servicio = result;
        this.RecargarServicio();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  RecargarServicio(){
    this.filtroServicio = this.formulario.controls['Des_Servicio'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterServicio(option) : this.listar_Servicio.slice())),
    );
  }

  private _filterServicio(value: string): Servicio[] {
    this.formulario.controls['Cod_LinPro'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_Servicio.filter(option => String(option.Cod_LinPro).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Des_Servicio.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarCodLinPro(Cod_LinPro: string){
    this.formulario.controls['Cod_LinPro'].setValue(Cod_LinPro)
  }

  CambiarTipoAuditoria(value){
    this.Tip_Auditoria = value;
    this.formulario.controls['Cod_LinPro'].setValue("");
    this.formulario.controls['Cod_Operario'].setValue("");
    this.formulario.controls['Des_Servicio'].setValue("");
    this.formulario.controls['Nom_Operario'].setValue("");
    this.formulario.controls['Tip_Auditoria'].setValue(this.Tip_Auditoria);
  }

  
  submit(formDirective) :void {
  
    this.Cod_Accion            = 'I'
    this.Num_Auditoria_Detalle = 0
    if(this.Titulo != undefined){
      this.Cod_Accion          = 'U'
      this.Num_Auditoria_Detalle = this.data.Num_Auditoria_Detalle
    }

    var operario = this.formulario.get('Cod_Operario')?.value.split('-');
    
    const formData = new FormData();
    formData.append('Accion', this.Cod_Accion);
    formData.append('Num_Auditoria_Detalle',this.Num_Auditoria_Detalle.toString());
    formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
    formData.append('Tip_Auditoria', this.formulario.get('Tip_Auditoria')?.value);
    formData.append('Cod_OrdPro', this.formulario.get('OP')?.value); 			
    formData.append('Cod_Cliente', this.formulario.get('CodCliente')?.value );		
    formData.append('Cod_EstCli', this.formulario.get('CodEstCli')?.value ); 			
    formData.append('Cod_Present', this.formulario.get('Color')?.value ); 		
    formData.append('Cod_Operario',  operario[1] ? operario[1] : '' );
    formData.append('Tip_Trabajador_Operario', operario[0] ? operario[0] : '' );
    formData.append('Cod_LinPro', this.formulario.get('Cod_LinPro')?.value ); 
    formData.append('Can_Muestra', this.formulario.get('Muestra')?.value ); 		
    formData.append('Observacion', this.formulario.get('Observacion')?.value ); 		
    formData.append('Flg_Status', 'A' ); 			
    formData.append('Cod_Usuario', this.Cod_Usuario ); 		
    formData.append('Flg_Reproceso', 'N' ); 		
    formData.append('Flg_Reproceso_Num', '0' ); 	
    
    this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoDetService(
      formData
      ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              
              //if(this.Titulo == undefined){
                //this.limpiar()
                formDirective.resetForm();
                this.formulario.reset();
              //}
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
              
            }
            else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
       );
  }

  buscarEstiloClientexOP(){
    this.listar_operacionColor = []
    this.formulario.controls['CodCliente'].setValue('');
    this.formulario.controls['Cliente'].setValue('');
    this.formulario.controls['CodEstCli'].setValue('');
    this.formulario.controls['Estilo'].setValue('');
    this.Cod_OrdPro = this.formulario.get('OP')?.value;

    if(this.Cod_OrdPro.length == 5){
      this.Cod_Accion   = 'E';
      this.Cod_Auditor  = '';
      this.Nom_Auditor  = '';
      this.Can_Lote     = 0;
      this.Cod_Motivo   = '';

      this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
        this.Cod_Accion,
        this.Cod_Auditor,
        this.Nom_Auditor, 
        this.Cod_OrdPro,
        this.Can_Lote,
        this.Cod_Motivo
        ).subscribe(
        (result: any) => {
          if(result.length > 0){
            this.formulario.controls['CodCliente'].setValue(result[0].Cod_Cliente)
            this.formulario.controls['Cliente'].setValue(result[0].Des_Cliente)
            this.formulario.controls['CodEstCli'].setValue(result[0].Cod_EstCli)
            this.formulario.controls['Estilo'].setValue(result[0].Des_EstPro)

            this.CargarOperacionColor()
          }else{
            this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }
  }

  CargarOperacionColor(){

    this.Cod_OrdPro = this.formulario.get('OP')?.value

    this.Cod_Accion   = 'C'
    this.Cod_Auditor  = ''
    this.Nom_Auditor  = ''
    this.Cod_OrdPro
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor, 
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
    ).subscribe(
      (result: any) => {
        this.listar_operacionColor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      
  }

}

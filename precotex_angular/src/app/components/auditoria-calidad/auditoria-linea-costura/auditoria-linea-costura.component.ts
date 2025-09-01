import { Component, ViewChild, OnInit,AfterViewInit } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounce, debounceTime, map, startWith } from 'rxjs/operators';

import * as _moment from 'moment';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AuditoriaLineaCosturaService } from '../../../services/auditoria-linea-costura.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogEliminarComponent } from '../../dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService }  from "ngx-spinner";
interface Listar_Op_Present {
  Cod_Present: number;
  Des_Present: string;
} 
  
interface Listar_Linea { 
  cod_linea: string;
  descripcion: string;
}

interface Listar_Familia {
  cod_familia: string;
}


interface data_cab {
  Num_Auditoria: string
    Fec_Auditoria: string
    Cod_LinPro: string
    Cod_Auditor: string
    Abr_Cliente:string
    Cod_EstCli: string
    Cod_OrdPro: string
    Des_Present: string
}


@Component({
  selector: 'app-auditoria-linea-costura',
  templateUrl: './auditoria-linea-costura.component.html',
  styleUrls: ['./auditoria-linea-costura.component.scss',
    './auditoria-linea-costura.component-grid.scss',
    './auditoria-linea-costura.component-registro.scss',
    './auditoria-linea-costura.component-detalle.scss',
    './auditoria-linea-costura.component-trabajador.scss',
    './auditoria-linea-costura.component-calificacion.scss']

})

export class AuditoriaLineaCosturaComponent implements OnInit,AfterViewInit {

  listar_op_presents: Listar_Op_Present[] = [];
  listar_lineas: Listar_Linea[] = []; 



  clearDate(event) {
    event.stopPropagation();
    this.auditoriaForm.controls['fec_auditoria'].setValue('')
  }

  //filtroFamilia: Observable<string[]> | undefined;
  filtroOperacion: Observable<string[]> | undefined;

  //listar_familia: string[] = [''];
  listar_operacion: string[] = [''];
  dataOperaciones: Array<any>= [];

  texto_libre = ''
  status_pendiente = false
  status_cerrado = false
  flg_accion = ''
  num_auditoria_cab = ''
  nNum_Auditoria_Activo = 0
  sCod_Trabajador_Activo = ''
  Cod_OrdPro = ''
  sDes_Operacion_Activo = ''

  nom_trabajador: string = ''
  des_operacion: string = ''

  calif_rev1_status: string = ''
  calif_rev1_abr_motivo: string = ''
  calif_rev1_des_motivo: string = ''
  calif_rev1_num_prendas: number = 0

  calif_rev2_status: string = ''
  calif_rev2_abr_motivo: string = ''
  calif_rev2_des_motivo: string = ''
  calif_rev2_num_prendas: number = 0

  calif_rev3_status: string = ''
  calif_rev3_abr_motivo: string = ''
  calif_rev3_des_motivo: string = ''
  calif_rev3_num_prendas: number = 0

  calif_glosa: string = ''
  Tip_Trabajador:string = '';
 
  Visible_Registro_Auditoria: boolean = false
  Visible_Detalle_Auditoria: boolean = false
  Visible_Registro_Trabajador: boolean = false
  Visible_Registro_Calificacion: boolean = false

  Lotev1 = '';
  Muestrav1 = '';
  Lotev2 = '';
  Muestrav2 = '';
  Lotev3 = '';
  Muestrav3 = '';

  displayedColumns_cab: string[] = ['Num_Auditoria', 'Fec_Auditoria', 'Cod_LinPro', 'Cod_Auditor', 'Abr_Cliente', 'Cod_EstCli', 'Cod_OrdPro', 'Des_Present', 'detalle','eliminar']
  // displayedColumns_det: string[] = ['Codigo', 'Nombres', 'Operacion', 'Rev1_Flg_Aprobado', 'Rev1_Flg_Rechazado', 'Rev1_Num_Prendas', 'Rev1_Des_Motivo', 'Rev2_Flg_Aprobado', 'Rev2_Flg_Rechazado', 'Rev2_Num_Prendas', 'Rev2_Des_Motivo', 'Rev3_Flg_Aprobado', 'Rev3_Flg_Rechazado', 'Rev3_Num_Prendas', 'Rev3_Des_Motivo','Glosa']
  displayedColumns_det: string[] = ['trabajador', 'operacion', 'rev1_status', 'rev2_status', 'rev3_status', 'glosa', 'detalle','eliminar']


  public data_cab = [{
    Num_Auditoria: "",
    Fec_Auditoria: "",
    Cod_LinPro: "",
    Cod_Auditor: "",
    Abr_Cliente: "",
    Cod_EstCli: "",
    Cod_OrdPro: "",
    Des_Present: ""
  }]

  public data_det = [{
    trabajador: "",
    operacion: "",
    rev1_status: "",
    rev2_status: "",
    rev3_status: "",
    Tip_Trabajador: "",
    glosa: ""
  }]



  auditoriaForm = this.formBuilder.group({
    num_auditoria: [''],
    fec_auditoria: [''],
    cod_linea: [''],
    cod_auditor: [''],
    cod_ordpro: [''],
    flg_pendiente: [''],
    flg_cerrado: ['']
  })

  RegistroAuditoriaForm = this.formBuilder.group({
    fec_reg_auditoria: [''],
    cod_linea: [''],
    des_linea: [''],
    cod_ordpro: [''],
    cod_present: [''],
    des_present: [''],
    abr_cliente: [''],
    cod_estcli: [''],
    tipo_prenda: [''],
    ruta_imagen: ['']
  })

  trabajadorForm = this.formBuilder.group({
    codigo: [''],
    tip_trabajador: [''],
    num_dni: [''],
    familia: [''],
    operacion: [''],
    lote: [''],
    muestra: ['']
  })
  dataSource: MatTableDataSource<data_cab>;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaLineaCosturaService: AuditoriaLineaCosturaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) {   this.dataSource = new MatTableDataSource();}
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    //this.find_visible= true;
    //this.data_det_prueba.paginator = this.paginator;
    
    //this.CargarFamilia();

    // this.filtroFamilia = this.trabajadorForm.controls['familia'].valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterFamilia(value))
    // );
    
    this.RecargarOperacion();
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

  // private _filterFamilia(value: string): string[] {
  //   if (value == null) {
  //     value = ''
  //   }
  //   const filterValue = value.toLowerCase();
  //   return this.listar_familia.filter(option => option.toLowerCase().includes(filterValue));
  // }
  private _filterOperacion(value: string): string[] {

    if (value == null) {
      value = ''
    }
    const filterValue = value.toLowerCase();
    return this.listar_operacion.filter(option => option.toLowerCase().includes(filterValue));

  }

RecargarOperacion(){
  this.filtroOperacion = this.trabajadorForm.controls['operacion'].valueChanges.pipe(
    debounceTime(500),
    startWith(''),
    map(value => this._filterOperacion(value))
  );
}



  // CargarFamilia() {
  //   this.listar_familia = [];

  //   this.auditoriaLineaCosturaService.CargarFamiliaService().subscribe(
  //     (result: any) => {
  //       //console.log(result)
  //       for (let i = 0; i < result.length; i++) {
  //         this.listar_familia.push(result[i].Cod_Familia)
  //       }
  //     },
  //     (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
  //       duration: 1500,
  //     }))
  // }

  getOperaciones(){
    this.auditoriaLineaCosturaService.getOperacionService('001', this.Cod_OrdPro).subscribe(
      (result: any) => {
        //console.log(result)
        if(result.length > 0){
          this.dataOperaciones = result;
        }else{
          this.dataOperaciones = [];
          this.matSnackBar.open('No se encontraron operaciones para esta OP', 'Cerrar', {
            duration: 1500,
          })
        }
        
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  CargarOperacion() {
    this.listar_operacion = [];
    //this.trabajadorForm.patchValue({ operacion: '' }) 

    //this.trabajadorForm.patchValue({ operacion: '' })

    this.texto_libre = this.trabajadorForm.get('familia')?.value

    this.trabajadorForm.patchValue({ familia: this.texto_libre.toUpperCase() })
    // this.trabajadorForm.patchValue({ operacion: '' })
    // this.trabajadorForm.patchValue({ operacion: '..' })
    // this.trabajadorForm.patchValue({ operacion: '' })
    
    this.trabajadorForm.controls['operacion'].reset()


    this.auditoriaLineaCosturaService.CargarOperacionService(this.trabajadorForm.get('familia')?.value).subscribe(
      (result: any) => {
        //console.log(result)
        for (let i = 0; i < result.length; i++) {
          //console.log(result[i].Des_Operacion)
          this.listar_operacion.push(result[i].Des_Operacion)
        }
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

      this.RecargarOperacion();
  } 

  CargarLista() {
    this.SpinnerService.show();
    this.auditoriaLineaCosturaService.ViewAuditoriaService_Cab(this.auditoriaForm.get('num_auditoria')?.value,
      this.auditoriaForm.get('fec_auditoria')?.value,
      this.auditoriaForm.get('cod_linea')?.value,
      this.auditoriaForm.get('cod_auditor')?.value,
      this.auditoriaForm.get('cod_ordpro')?.value,
      this.auditoriaForm.get('flg_pendiente')?.value,
      this.auditoriaForm.get('flg_cerrado')?.value).subscribe(
        (result: any) => {
          this.dataSource.data = result
          this.SpinnerService.hide();
          // console.log(result);        
          // console.log('--------');
          // console.log(this.data);
          //.subscribe((mascotas: Mascota[]) => this.mascotas = mascotas);
          //this.find_visible = false;
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

  MostrarVentanaAuditoria() {
    this.flg_accion = 'I'
    this.num_auditoria_cab = '0'
    this.Visible_Registro_Auditoria = !this.Visible_Registro_Auditoria

    this.RegistroAuditoriaForm.reset()

    this.BuscarLinea()
    this.listar_op_presents = []
  }

  BuscarLinea() {
    this.auditoriaLineaCosturaService.BuscarLineaService().subscribe(
      (result: any) => {
        //console.log(result)
        this.listar_lineas = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  BuscarColorOP() {
    //console.log(this.RegistroAuditoriaForm.get('cod_ordpro')?.value)
    this.auditoriaLineaCosturaService.BuscarColorOPService(this.RegistroAuditoriaForm.get('cod_ordpro')?.value).subscribe(
      (result: any) => {
        //console.log(result)
        this.listar_op_presents = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  } 

  GuardarRegistroCab() {
    //console.log(this.RegistroAuditoriaForm.get('fec_reg_auditoria')?.value)
    this.auditoriaLineaCosturaService.ManAuditoriaService_Cab(this.flg_accion,
      this.num_auditoria_cab,
      this.RegistroAuditoriaForm.get('fec_reg_auditoria')?.value,
      this.RegistroAuditoriaForm.get('cod_linea')?.value,
      this.RegistroAuditoriaForm.get('cod_ordpro')?.value,
      this.RegistroAuditoriaForm.get('cod_present')?.value).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.CancelarRegistroCab()
            this.CargarLista() 
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

  CancelarRegistroCab() {

    this.Visible_Registro_Auditoria = false

  }

  VerDetalle(nNum_Auditoria: number, Cod_OrdPro:string) {

    this.nNum_Auditoria_Activo = nNum_Auditoria
    this.Cod_OrdPro = Cod_OrdPro;
    this.auditoriaLineaCosturaService.ViewAuditoriaService_Det(this.nNum_Auditoria_Activo).subscribe(
      (result: any) => {
        this.data_det = result

        //data_det_prueba = new MatTableDataSource(result);
        // dataSource = new MatTableDataSource(result);
        this.Visible_Detalle_Auditoria = true 
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))


  }

  EliminarAuditoria(nNum_Auditoria: string){



    let dialogRef =  this.dialog.open(DialogEliminarComponent, { disableClose: true, data:{nNum_Auditoria: nNum_Auditoria} });
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){
    
        this.flg_accion = 'D'
        let fec_reg_auditoria = ''
        let cod_linea = ''
        let cod_ordpro= ''
       let cod_present = '0'
       this.auditoriaLineaCosturaService.ManAuditoriaService_Cab(this.flg_accion,
        nNum_Auditoria,
        fec_reg_auditoria,
        cod_linea,
        cod_ordpro,
        cod_present).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.CargarLista()
              this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

    }
  
  
  
  })

  }

  OcultarVentanaDetalle() {

    this.Visible_Detalle_Auditoria = false

  }

  //*  BOTONERA DETALLE INVOCA A TRABAJADOR */
  MostrarVentanaTrabajador(xflg_accion: string) {
    this.flg_accion = xflg_accion
    this.Visible_Registro_Trabajador = true

    this.trabajadorForm.reset()
    this.nom_trabajador = 'Nombre Trabajador'
    this.des_operacion = 'Nombre de la Operacion'
    this.getOperaciones();
  }

  //*  BOTONERA TRABAJADOR */
  OcultarVentanaTrabajador() {
    this.flg_accion = ''
    this.Visible_Registro_Trabajador = false

  }

  BuscarTrabajador(sTipo: string) {
    this.texto_libre = this.trabajadorForm.get(sTipo)?.value

    if ((sTipo == 'codigo' && this.texto_libre.length >= 4) || (sTipo == 'num_dni' && this.texto_libre.length >= 8)) {

      this.auditoriaLineaCosturaService.BuscarTrabajadorService(sTipo,
        this.trabajadorForm.get(sTipo)?.value).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.trabajadorForm.patchValue({ codigo: result[0].Cod_Trabajador })
              this.trabajadorForm.patchValue({ num_dni: result[0].Nro_DocIde })
              this.trabajadorForm.patchValue({ tip_trabajador: result[0].Tip_Trabajador })
              this.nom_trabajador = result[0].Nombres

            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
              this.nom_trabajador = ''
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
    } else {
      this.nom_trabajador = ''
      this.matSnackBar.open("Dato Ingresado es Incorrecto", 'Cerrar', { duration: 1500, })
    }
  }

  // BuscarOperacion() {
  //   this.texto_libre = this.trabajadorForm.get('cod_operacion')?.value

  //   this.texto_libre = this.texto_libre.replace(/\s+/g, " ").trim();

  //   if (this.texto_libre.length <= 6) {
  //     this.auditoriaLineaCosturaService.BuscarOperacionService(this.nNum_Auditoria_Activo, this.texto_libre).subscribe(
  //       (result: any) => {
  //         if (result[0].Respuesta == 'OK') {
  //           this.trabajadorForm.patchValue({ cod_operacion: result[0].cod_operacion })
  //           this.des_operacion = result[0].des_operacion

  //         } else {
  //           this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
  //           this.des_operacion = ''
  //         }
  //       },
  //       (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
  //         duration: 1500,
  //       }))
  //   } else {
  //     this.des_operacion = ''
  //     this.matSnackBar.open("Dato Ingresado es Incorrecto", 'Cerrar', { duration: 1500, })
  //   }
  // }


  EliminarRegistroDetalle(sCod_Trabajador: string, sDes_Operacion: string, tip_trabajador:string){

  

    this.sCod_Trabajador_Activo = sCod_Trabajador.substring(0, 4)
    this.sDes_Operacion_Activo = sDes_Operacion
    this.flg_accion ='D'

    let dialogRef =  this.dialog.open(DialogEliminarComponent, { disableClose: true, data:{nNum_Auditoria: sCod_Trabajador} });
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){

    
    this.auditoriaLineaCosturaService.ManAuditoriaService_Tra(
      this.flg_accion,
      this.nNum_Auditoria_Activo,
      this.sCod_Trabajador_Activo,
      this.sDes_Operacion_Activo,
      '',
      '',
      tip_trabajador
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.VerDetalle(this.nNum_Auditoria_Activo, this.Cod_OrdPro)
            this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
         }
      })
  }

  changeLote(event, version){
    this.auditoriaLineaCosturaService.CF_ValidarTamano_Muestra(event.target.value).subscribe(
      (result: any) => {

        if (result.length > 0) {
          if(version == '1'){
            this.Muestrav1 = result[0].Tamanio_Muestra;
          }else if(version == '2'){
            this.Muestrav2 = result[0].Tamanio_Muestra;
          }else if(version == '3'){
            this.Muestrav3 = result[0].Tamanio_Muestra;
          }
        }else{
          if(version == '1'){
            this.Muestrav1 = '';
          }else if(version == '2'){
            this.Muestrav2 = '';
          }else if(version == '3'){
            this.Muestrav3 = '';
          }
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  GuardarTrabajador() {
    this.auditoriaLineaCosturaService.ManAuditoriaService_Tra(
      this.flg_accion,
      this.nNum_Auditoria_Activo,
      this.trabajadorForm.get('codigo')?.value,
      this.trabajadorForm.get('operacion')?.value,
      this.trabajadorForm.get('lote')?.value,
      this.trabajadorForm.get('muestra')?.value,
      this.trabajadorForm.get('tip_trabajador')?.value
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.VerDetalle(this.nNum_Auditoria_Activo, this.Cod_OrdPro)
            this.OcultarVentanaTrabajador()

            if (this.flg_accion != 'D') {
              this.VerCalificacion(result[0].codigo, result[0].operacion, this.trabajadorForm.get('tip_trabajador')?.value)
            }

          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

  //*  BOTONERA DETALLE INVOCA A CALIFICACION */
  VerCalificacion(sCod_Trabajador: string, sDes_Operacion: string, tip_trabajador:string) {

    this.nom_trabajador = 'Trabajador : ' + sCod_Trabajador
    this.des_operacion = 'Operacion : ' + sDes_Operacion

    this.sCod_Trabajador_Activo = sCod_Trabajador.substring(0, 4)
    this.sDes_Operacion_Activo = sDes_Operacion

    this.auditoriaLineaCosturaService.ViewAuditoriaService_Cal(this.nNum_Auditoria_Activo,
      this.sCod_Trabajador_Activo,
      this.sDes_Operacion_Activo, tip_trabajador).subscribe(
        (result: any) => {

          if (result[0].Respuesta == 'OK') {

            this.calif_rev1_status = result[0].rev1_status
            this.calif_rev1_abr_motivo = result[0].rev1_abr_motivo
            this.calif_rev1_des_motivo = result[0].rev1_des_motivo
            this.calif_rev1_num_prendas = result[0].rev1_num_prendas

            this.calif_rev2_status = result[0].rev2_status
            this.calif_rev2_abr_motivo = result[0].rev2_abr_motivo
            this.calif_rev2_des_motivo = result[0].rev2_des_motivo
            this.calif_rev2_num_prendas = result[0].rev2_num_prendas

            this.calif_rev3_status = result[0].rev3_status
            this.calif_rev3_abr_motivo = result[0].rev3_abr_motivo
            this.calif_rev3_des_motivo = result[0].rev3_des_motivo
            this.calif_rev3_num_prendas = result[0].rev3_num_prendas

            this.Lotev1 = result[0].Lote;
            this.Lotev2 = result[0].Lotev2;
            this.Lotev3 = result[0].Lotev3;
            this.Muestrav1 = result[0].Muestra;
            this.Muestrav2 = result[0].Muestrav2;
            this.Muestrav3 = result[0].Muestrav3;

            this.calif_glosa = result[0].glosa
            this.Tip_Trabajador = tip_trabajador;
            this.Visible_Registro_Calificacion = true

          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
          }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))

  }

  //*  BOTONERA CALIFICACION */
  GuardarCalificacion() {

    this.auditoriaLineaCosturaService.ManAuditoriaService_Cal(
      this.nNum_Auditoria_Activo,
      this.sCod_Trabajador_Activo,
      this.sDes_Operacion_Activo,

      this.calif_rev1_status,
      this.calif_rev1_abr_motivo,
      this.calif_rev1_num_prendas,

      this.calif_rev2_status,
      this.calif_rev2_abr_motivo,
      this.calif_rev2_num_prendas,

      this.calif_rev3_status,
      this.calif_rev3_abr_motivo,
      this.calif_rev3_num_prendas,

      this.calif_glosa,
      this.Tip_Trabajador,
      this.Lotev1,
      this.Lotev2,
      this.Lotev3,
      this.Muestrav1,
      this.Muestrav2,
      this.Muestrav3
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.VerDetalle(this.nNum_Auditoria_Activo, this.Cod_OrdPro)
            this.OcultarVentanaCalificacion()

          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

  OcultarVentanaCalificacion() {
    this.flg_accion = ''
    this.Visible_Registro_Calificacion = false

  }

  BuscarMotivo(sRevision: string, sMotivo: string) {

    this.auditoriaLineaCosturaService.BuscarMotivoService(sMotivo).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          if (sRevision == 'rev1') { this.calif_rev1_des_motivo = result[0].Descripcion }
          else if (sRevision == 'rev2') { this.calif_rev2_des_motivo = result[0].Descripcion }
          else { this.calif_rev3_des_motivo = result[0].Descripcion }

        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
          if (sRevision == 'rev1') { this.calif_rev1_des_motivo = '' }
          else if (sRevision == 'rev2') { this.calif_rev2_des_motivo = '' }
          else { this.calif_rev3_des_motivo = '' }
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { CheckListService } from 'src/app/services/check-list.service';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';


interface Derivados {
  Id_Observacion:string;
  Codigo: string;
  Defecto: string;
  Total: string;
}
@Component({
  selector: 'app-dialog-detalle-reproceso',
  templateUrl: './dialog-detalle-reproceso.component.html',
  styleUrls: ['./dialog-detalle-reproceso.component.scss']
})
export class DialogDetalleReprocesoComponent implements OnInit {
  check = false;
  datosDefectos: any = []
  flg_btn_detalle = false
  Defecto:any = ''
  Cantidad:any = ''
  Codigo:any = ''
  
  dataSource: MatTableDataSource<Derivados>;
  displayedColumns: string[] = ['Cod_Defecto', 'Defecto', 'Cantidad', 'Eliminar'];


  idCabecera:any = '';
  Cod_Motivo:any = '';
  Abr_Motivo:any = '';
  Nom_Cliente:any = '';
  Abr:any = '';
  Cod_Accion:any = '';
  dataDefectos:any = [];


  //CHECLIST
  Cod_OrdPro:any = '';
  Tipo_Prenda:any = '';
  Cod_Present:any = '';
  Lote_Tela:any = '';
  Lote:any = '';
  Tamano_Muestra:any = '';
  Numero_Defectos:any = '';
  Tamano_Muestra_Porc:any = '';
  Num_Defectos:any = '';
  Flg_Aprobado:any = '';
  Flg_FichaTecnica:any = '';
  Flg_ReporteCalidad:any = '';
  Flg_Estampado:any = '';
  Flg_Bordado:any = '';
  Cod_Usuario:any = '';
  Ruta_Prenda:any = '';
  Linea:any = '';
  Cod_Cliente:any = '';
  Cod_EstCli:any = '';
  Cantidad_Cabecera:any = '';
  Cod_TemCli:any = '';


  FlgAprobado:any = '';
  constructor(private spinnerService: NgxSpinnerService, private defectosAlmacenDerivadosService:DefectosAlmacenDerivadosService, private checkListService:CheckListService, private matSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {
    console.log(this.data);
    if(this.data.tipo == 1){
      this.idCabecera = this.data.data.data;
    }else{
      this.flg_btn_detalle = !this.flg_btn_detalle;
      this.idCabecera = this.data.datos.Id_CheckList;
      this.Cod_OrdPro = this.data.datos.Cod_OrdPro;
      this.Tipo_Prenda = this.data.datos.Tipo_Prenda;
      this.Cod_Present = this.data.datos.Color;
      this.Lote_Tela = this.data.datos.Lote_Tela;
      this.Lote = this.data.datos.Lote;
      this.Tamano_Muestra = this.data.datos.Tamano_Muestra;
      this.Numero_Defectos = this.data.datos.Numero_Defectos;
      this.Tamano_Muestra_Porc = this.data.datos.Tamano_Muestra_Porc;
      this.Num_Defectos = this.data.datos.Num_Defectos;
      this.Flg_Aprobado = this.data.datos.Flg_Aprobado;
      this.FlgAprobado = this.data.datos.Flg_Aprobado;
      this.Flg_FichaTecnica = this.data.datos.Flg_FichaTecnica;
      this.Flg_ReporteCalidad = this.data.datos.Flg_ReporteCalidad;
      this.Flg_Estampado = this.data.datos.Flg_Estampado;
      this.Flg_Bordado = this.data.datos.Flg_Bordado;
      this.Cod_Usuario = this.data.datos.Cod_Usuario;
      this.Ruta_Prenda = this.data.datos.Ruta_Prenda;
      this.Linea = this.data.datos.Linea;
      this.Cod_Cliente = this.data.datos.Cod_Cliente;
      this.FlgAprobado = this.data.datos.FlgAprobado;
      this.Cod_EstCli = this.data.datos.Cod_EstCli;
      this.Cantidad_Cabecera = this.data.datos.Cantidad_Cabecera;
      this.Cod_TemCli = this.data.datos.Cod_TemCli;
      console.log(this.data.datos);
      console.log(this.data.datos.Flg_Aprobado);
      this.FlgAprobado = this.data.datos.Flg_Aprobado;
      console.log(this.data.datos.Flg_Aprobado);
      console.log(this.FlgAprobado);
      this.cargarObservaciones();
    }
    
  }


  BuscarMotivo(event) {
    console.log(event);
    this.Abr_Motivo = event.target.value;
    console.log(this.Abr_Motivo);
    if (this.Abr_Motivo == null) {
      this.Abr_Motivo = ''
    }
    if (this.Abr_Motivo.length > 3) {
      this.Abr_Motivo = '';

    }
    else {
      this.Abr = ''
      this.Nom_Cliente = ''
      this.Cod_Accion = 'M'
      this.spinnerService.show();
      this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr, this.Abr_Motivo, this.Nom_Cliente, this.Cod_Accion).subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.Defecto = (result[0].Descripcion)
            this.Cod_Motivo = result[0].Cod_Motivo
            
            this.spinnerService.hide();
          }
          else {
            this.spinnerService.hide();
            this.matSnackBar.open('Abr de motivo no existe..!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
        this.spinnerService.hide();
    }

  }


  changeCheck(event){
    console.log(event);
    this.check = event.checked;

    
    
  }

  confirmarCreacion(){
    if(confirm('Esta seguro(a) de crear el reproceso?')){
      this.checkListService.CF_LISTAR_CHECKLIST_REPROCESO(
        'I',
        this.idCabecera,
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          console.log(result);
          if(result[0].Id_CheckList){
            this.matSnackBar.open('Se registro correctamente el reproceso', 'Cerrar', {
              duration: 1500,
            })
          }
          this.flg_btn_detalle = !this.flg_btn_detalle;
          this.idCabecera = result[0].Id_CheckList;
          this.Cod_OrdPro = result[0].Cod_OrdPro;
          this.Tipo_Prenda = result[0].Tipo_Prenda;
          this.Cod_Present = result[0].Color;
          this.Lote_Tela = result[0].Lote_Tela;
          this.Lote = result[0].Lote;
          this.Tamano_Muestra = result[0].Tamano_Muestra;
          this.Numero_Defectos = result[0].Numero_Defectos;
          this.Tamano_Muestra_Porc = result[0].Tamano_Muestra_Porc;
          this.Num_Defectos = result[0].Num_Defectos;
          this.Flg_Aprobado = result[0].Flg_Aprobado;
          this.Flg_FichaTecnica = result[0].Flg_FichaTecnica;
          this.Flg_ReporteCalidad = result[0].Flg_ReporteCalidad;
          this.Flg_Estampado = result[0].Flg_Estampado;
          this.Flg_Bordado = result[0].Flg_Bordado;
          this.Cod_Usuario = result[0].Cod_Usuario;
          this.Ruta_Prenda = result[0].Ruta_Prenda;
          this.Linea = result[0].Linea;
          this.Cod_Cliente = result[0].Cod_Cliente;
          this.Cod_EstCli = result[0].Cod_EstCli;
          this.Cantidad_Cabecera = result[0].Cantidad_Cabecera;
          this.Cod_TemCli = result[0].Cod_TemCli;
        },
        (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })
    }
  }

  changeAprobado(event){
    console.log(event)
    const formData = new FormData();
    formData.append('Opcion', 'I');
    formData.append('Id_CheckList', this.idCabecera);
    formData.append('Cod_OrdPro', this.Cod_OrdPro);
    formData.append('Cod_Cliente', this.Cod_Cliente);
    formData.append('Cod_EstCli', this.Cod_EstCli);
    formData.append('Tipo_Prenda', this.Tipo_Prenda);
    formData.append('Des_Present', this.Cod_Present);
    formData.append('Cantidad', this.Cantidad);
    formData.append('Cod_TemCli', this.Cod_TemCli);
    formData.append('Lote_Tela', this.Lote_Tela);
    formData.append('Lote', this.Lote);
    formData.append('Tamano_Muestra', this.Tamano_Muestra);
    formData.append('Numero_Defectos', this.Numero_Defectos);
    formData.append('Tamano_Muestra_Porc', this.Tamano_Muestra_Porc);
    formData.append('Num_Defectos', this.Num_Defectos);
    formData.append('Flg_Aprobado', event.value);
    formData.append('Flg_FichaTecnica', this.Flg_FichaTecnica);
    formData.append('Flg_ReporteCalidad', this.Flg_ReporteCalidad);
    formData.append('Flg_Estampado', this.Flg_Estampado);
    formData.append('Flg_Bordado', this.Flg_Bordado);
    formData.append('Cod_Usuario', this.Cod_Usuario);
    formData.append('Ruta_Prenda', this.Ruta_Prenda);
    formData.append('Linea', this.Linea);
    formData.append('chk_go', "0");
    formData.append('chk_jc', "0");
      
    this.spinnerService.show();
    this.checkListService.Cf_Mantenimiento_CheckList(formData)
        .subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se actualizo el estado correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
  }

  saveDefecto(event){
    console.log(event);

    if(event != undefined){
      this.Defecto = (event.Descripcion)
      this.Cod_Motivo = event.Cod_Motivo
    }
  }
  BuscarDefecto(event) {
    console.log(event);
    var defecto = event.value;
    console.log(this.Abr_Motivo);

    if (defecto == '' ||  defecto == undefined) {
      this.Abr_Motivo = '';

    }
    else {
      this.Abr = ''
      this.Nom_Cliente = ''
      this.Cod_Accion = 'D'
      this.spinnerService.show();
      this.defectosAlmacenDerivadosService.mantenimientoDerivadosWebService(this.Abr, this.Abr_Motivo, this.Nom_Cliente, this.Cod_Accion, defecto).subscribe(
        (result: any) => {
          if (result.length > 0) {
            console.log(result);
            this.datosDefectos = result;
            // this.Defecto = (result[0].Descripcion)
            // this.Cod_Motivo = result[0].Cod_Motivo
            
            this.spinnerService.hide();
          }
          else {
            this.spinnerService.hide();
            this.matSnackBar.open('Abr de motivo no existe..!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
        this.spinnerService.hide();
    }

  }

  cargarObservaciones(){
    this.checkListService.CF_CHECKLIST_LISTAR_DETALLE('O', this.idCabecera).subscribe(
      (result: any) => {
        this.dataDefectos = result;
        this.dataSource.data = this.dataDefectos;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /******************************INSERTAR DETALLE **************************************** */
  InsertarFila() {

    if(this.Codigo != '' && this.Defecto != '' && this.Cantidad != ''){
      this.spinnerService.show();
      this.checkListService.CF_INSERTAR_CHECKLIST_OBS(
        'I',
        0,
        this.idCabecera,
        this.Cantidad,
        this.Cod_Motivo,
        this.Defecto
      ).subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          let datos = {
            Id_Observacion: res[0].Id,
            Cod_Defecto: this.Cod_Motivo, 
            Defecto: this.Defecto, 
            Cantidad: this.Cantidad
          };
          
          this.dataDefectos.push(datos);
          this.dataSource.data = this.dataDefectos;

          this.Cantidad = '';
          this.Defecto = '';
          this.Codigo = '';
          
          this.matSnackBar.open('Se Realizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al realizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }else{
      this.matSnackBar.open('Debes ingresar El Código, Defecto y Cantidad.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  eliminarFila(data_det:Derivados){
    if(confirm('Esta seguro de eliminar el registro?')){
      this.spinnerService.show();
      this.checkListService.CF_INSERTAR_CHECKLIST_OBS(
        'D',
        data_det.Id_Observacion,
        '',
        '',
        '',
        ''
      ).subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          
          this.dataDefectos = this.dataDefectos.filter( (element:any) => {
            return element.Id_Observacion !== data_det.Id_Observacion
          });
          this.dataSource.data = this.dataDefectos;

          
          this.matSnackBar.open('Se elimino el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al eliminar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }
  }
}

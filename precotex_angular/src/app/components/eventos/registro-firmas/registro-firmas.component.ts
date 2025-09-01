import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { GlobalVariable } from 'src/app/VarGlobals';
import { EventosService } from 'src/app/services/eventos.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { DialogFirmaDigitalComponent } from 'src/app/components/auditoria-externa/registro-firmas-auditoria/dialog-firma-digital/dialog-firma-digital.component';
import { ExceljsService } from 'src/app/services/exceljs.service';

@Component({
  selector: 'app-registro-firmas',
  templateUrl: './registro-firmas.component.html',
  styleUrls: ['./registro-firmas.component.scss']
})
export class RegistroFirmasComponent implements OnInit {

  formulario = this.formBuilder.group({
    DocumentoIdentidad: ['', Validators.required],
    NumeroHijos: ['', Validators.required],
    NombreCompleto: [{value: "", disabled: true}],
    NombreSede: [{value: "", disabled: true}],
    NombreGerencia: [{value: "", disabled: true}],
    NombreArea: [{value: "", disabled: true}],
    NombrePuesto: [{value: "", disabled: true}],
    DesTrabajador: [{value: "", disabled: true}],
    Sexo: [{value: "", disabled: true}]
  });

  selected = new FormControl(0);
  dataForExcel = [];

  displayedColumns: string[] = ['DocumentoIdentidad', 'NombreCompleto', 'Sexo', 'DesTrabajador', 'NombreSede', 'NombreArea', 'NombrePuesto','Signatura','Acciones']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  lc_img64: string = "";
  ll_nuevo: boolean = false;
  ll_lista: boolean = false;
  ln_cols: number = 3;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService,
    private exceljsService: ExceljsService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.validarCRUDUsuario(221);
    this.listarFirmaColaboradores();
  }

  listarFirmaColaboradores(){

    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('DocumentoIdentidad', '');
    formData.append('NumeroHijos', '0');
    formData.append('UsuarioRegistro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.eventosService.consutarFirmaColaborador(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
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

  onSubmit(){
    const formData = new FormData();
    formData.append('Accion', 'I');
    formData.append('DocumentoIdentidad', this.formulario.get('DocumentoIdentidad')?.value.trim());
    formData.append('NumeroHijos', this.formulario.get('NumeroHijos')?.value.toString());
    formData.append('UsuarioRegistro', GlobalVariable.vusu);
    formData.append('Imagen64', this.lc_img64);

    this.spinnerService.show();
    this.eventosService.registrarFirmaColaborador(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          if (result[0].Id_Registro != 0){
            this.onLimpiarFirma();
            this.listarFirmaColaboradores();
          } else {
            this.ll_nuevo = true;
          }

          //this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          Swal.fire(result[0].Respuesta, '', 'warning')
        }else{
          this.matSnackBar.open('Error en el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })          
          this.ll_nuevo = true;
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
    this.spinnerService.hide();
  }

  onQuitarFirma(data: any){
    const formData = new FormData();
    formData.append('Accion', 'D');
    formData.append('DocumentoIdentidad', data.DocumentoIdentidad);
    formData.append('NumeroHijos', '0');
    formData.append('UsuarioRegistro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.eventosService.consutarFirmaColaborador(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          if (result[0].Id_Registro != 0)
            this.listarFirmaColaboradores();

          //this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          Swal.fire(result[0].Respuesta, '', 'warning')
        }else{
          this.matSnackBar.open('Error en el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })          
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
    this.spinnerService.hide();    
  }

  onInsertarFirma(data: any){
    this.onLimpiarFirma();
    this.onBuscarDocumento(data.DocumentoIdentidad);
    this.selected.setValue(0);
  }

  onBuscarDocumento(documentoIdentidad: any){
    const formData = new FormData();
    formData.append('Accion', 'C');
    //formData.append('DocumentoIdentidad', this.formulario.get('DocumentoIdentidad')?.value.trim());
    formData.append('DocumentoIdentidad', documentoIdentidad);
    formData.append('NumeroHijos', '0');
    formData.append('UsuarioRegistro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.eventosService.consutarFirmaColaborador(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {

          this.formulario.patchValue({
            DocumentoIdentidad: result[0].DocumentoIdentidad,
            NumeroHijos: result[0].NumeroHijos,
            NombreCompleto: result[0].NombreCompleto,
            NombreSede: result[0].NombreSede,
            NombreGerencia: result[0].NombreGerencia,
            NombreArea: result[0].NombreArea,
            NombrePuesto: result[0].NombrePuesto,
            DesTrabajador: result[0].DesTrabajador,
            Sexo: result[0].Sexo
          });  

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('Documento de identidad inválido!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onLimpiarFirma(){
    this.formulario.patchValue({
      DocumentoIdentidad: '',
      NumeroHijos: '',
      NombreCompleto: '',
      NombreSede: '',
      NombreGerencia: '',
      NombreArea: '',
      NombrePuesto: '',
      DesTrabajador: '',
      Sexo: ''
    });
    this.lc_img64 = '';
    this.ll_nuevo = false;
  }

  onRegistrarFirma(){
    //console.log(window.innerWidth)
    //console.log(window.innerHeight)
    let ln_width: number = 800;
    let ln_height: number = 350;
    this.ln_cols = 3;

    if(window.innerWidth < (ln_width + 300)){
      ln_width = window.innerWidth - 300;
      this.ln_cols = 1;
    }

    if(window.innerHeight < (ln_height + 200)){
      ln_height = window.innerHeight - 200;
      this.ln_cols = 1;
    }

    let dialogRef = this.dialog.open(DialogFirmaDigitalComponent, {
      disableClose: true,
      data: {Nombre: this.formulario.get('NombreCompleto')?.value.trim(), Width: ln_width, Height: ln_height}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.lc_img64 = result;      
    });
  }

  onExportarRegistro(){
    this.dataForExcel = [];
    if(this.dataSource.filteredData.length > 0){
      let dataReporte: any[] = [];
      
      this.dataSource.filteredData.forEach((row: any) => {
        let data: any = {};

        data.DocumentoIdentidad = row.DocumentoIdentidad;
        data.ApellidosNombres = row.NombreCompleto;
        data.Sexo = row.Sexo == 'M' ? 'MASCULINO' : 'FEMENINO';
        data.TipoPlanilla = row.DesTrabajador;
        data.Sede = row.NombreSede;
        data.Area = row.NombreArea;
        data.Puesto = row.NombrePuesto;
        data.Firma = row.Signatura;
        data.NumeroHijos = row.NumeroHijos;
        data.FechaRegistro = row.FechaRegistro;  // ? row.FechaRegistro.toDateSrting() : "";
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REGISTRO DE FIRMAS DEL PERSONAL',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          this.ll_lista = crud[0].Flg_Verificar == 1 ? true : false;
        }

        //this.cargarOperacionAuditor();

      });
  }
}

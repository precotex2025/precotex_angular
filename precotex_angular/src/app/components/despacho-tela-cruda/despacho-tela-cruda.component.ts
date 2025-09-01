import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

import { DespachoTelaCrudaService } from '../../services/despacho-tela-cruda.service';
import { GlobalVariable } from '../../VarGlobals'; //<==== this one

@Component({
  selector: 'app-despacho-tela-cruda',
  templateUrl: './despacho-tela-cruda.component.html',
  styleUrls: ['./despacho-tela-cruda.component.scss']
})
export class DespachoTelaCrudaComponent implements OnInit {

  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    fec_registro: [''],
    cod_ordtra: ['']
  })

  displayedColumns_cab: string[] = ['num_movstk', 'cod_ordtra', 'peso', 'bultos', 'acciones']

  public data_det = [{
    num_movstk: "",
    cod_ordtra: "",
    peso: "",
    bultos: ""
  }]

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private despachoTelaCrudaService: DespachoTelaCrudaService
  ) {  }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      'fec_despacho': new FormControl(''),
      'cod_ordtra': new FormControl(''),
    });

    GlobalVariable.num_movdespacho = '';
    this.CargarLista();
  }

  CargarLista() {
    let fec_despacho = this.formulario.value['fec_despacho'];
    fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');

    this.despachoTelaCrudaService.ListarDespachoService(fec_despacho,
      this.formulario.get('cod_ordtra')?.value).subscribe(
        (result: any) => {
          this.data_det = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

  AgregarDespacho() {
    GlobalVariable.cod_ordtra = ''
    GlobalVariable.num_movdespacho = ''
  }


  VerDetalle(sCod_OrdTra: string, nNum_Movstk: string) {
    GlobalVariable.cod_ordtra = sCod_OrdTra
    GlobalVariable.num_movdespacho = nNum_Movstk

    // this.auditoriaLineaCosturaService.ViewAuditoriaService_Det(this.nNum_Auditoria_Activo).subscribe(
    //   (result: any) => {
    //     this.data_det = result
    //     //data_det_prueba = new MatTableDataSource(result);
    //     // dataSource = new MatTableDataSource(result);
    //     this.Visible_Detalle_Auditoria = true
    //   },
    //   (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
    //     duration: 1500,
    //   }))


  }

  // crearTabla(data: data_det[]) {
  //   this.dataSource = new MatTableDataSource(data);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

}

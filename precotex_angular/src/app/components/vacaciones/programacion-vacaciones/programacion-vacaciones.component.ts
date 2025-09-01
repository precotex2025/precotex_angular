import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { GlobalVariable } from 'src/app/VarGlobals';



export interface PeriodicElement {
  Fec_Permiso: string;
  Nom_Trabajador: string;
  Inicio: string;
  Termino: string;
  Inicio_Lectura: string;
  Termino_Lectura: string;
  Sede: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-programacion-vacaciones',
  templateUrl: './programacion-vacaciones.component.html',
  styleUrls: ['./programacion-vacaciones.component.scss']
})
export class ProgramacionVacacionesComponent implements OnInit {
  fecha: string = '';
  resultado: boolean = false;
  formulario = this.formBuilder.group({
    fec_permiso: [new Date()],
    dni: ['']
  })

  data: any = [];
  dataEmpresas: any = [];
  dataTrabajadores: any = [];
  dataPeriodos: Array<any> = [];
  sede: string = '';


  displayedColumns: string[] = [
    'Fec_Permiso',
    'Nom_Trabajador',
    'Inicio',
    'Termino',
    'Inicio_Lectura',
    'Termino_Lectura',
    'Sede'
  ];
  deshabilitar: boolean = false;
  Nom_Trabajador: string = '';

  Cod_Trabajador: string = '';
  Tip_Trabajador: string = '';
  Cod_Empresa: string = '';


  fecha_inicio: string = '';
  fecha_fin: string = '';
  dias = 0;
  observaciones: string = '';

  min_date: string = '';
  max_date: string = '';

  dias_pendientes = 0;
  Fecha_Modificada: string = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('DniSearch') inputDni!: ElementRef;
  fecha_mes = '';
  sCod_Usuario = GlobalVariable.vusu

  validarForm = false;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private despachoTelaCrudaService: RegistroPermisosService,
    private _router: Router,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.cargarEmpresas();
    const str = new Date().toLocaleString('en-Es', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var dia = str.substring(3, 5);
    var mes = str.substring(0, 2);
    var anio = str.substring(6, 10);
    var totaldia = anio + '-' + mes + '-' + dia;
    console.log(totaldia);
    this.min_date = totaldia;
  }
  ngAfterViewInit(): void {
  }

  cargarEmpresas() {
    this.despachoTelaCrudaService.getEmpresasVacaciones('E', GlobalVariable.vcodtra, GlobalVariable.vtiptra, '').subscribe((result: any) => {
      if (result != null) {
        this.dataEmpresas = result;
      }

    },
      (err: HttpErrorResponse) => {
        this.resultado = false;
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })

  }

  selectEmpresa(event) {
    console.log(event.value);
    if (event.value != '') {
      this.data = [];
      this.Cod_Trabajador = '';
      this.fecha_inicio = '';
      this.fecha_fin = '';
      this.Fecha_Modificada = '';
      this.dias = 0;
      this.despachoTelaCrudaService.getEmpresasVacaciones('T', GlobalVariable.vcodtra, GlobalVariable.vtiptra, event.value).subscribe((result: any) => {
        if (result != null) {
          this.dataTrabajadores = result;
        } else {
          this.dataTrabajadores = [];
        }
      },
        (err: HttpErrorResponse) => {
          this.dataTrabajadores = [];
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })
    }
  }
  selectUsuario(event) {
    console.log(event);
    if (event != '' && event != undefined) {
      this.data = [];
      this.Cod_Trabajador = event.Codigo;
      this.Tip_Trabajador = event.Tipo;
    } else {
      this.Cod_Trabajador = '';
      this.Tip_Trabajador = '';
      this.fecha_inicio = '';
      this.fecha_fin = '';
      this.Fecha_Modificada = '';
      this.dias = 0;
      this.data = [];
    }
  }

  CargarLista() {
    if (this.Cod_Empresa != '' && this.Cod_Trabajador != '' && this.Tip_Trabajador != '') {
      if (this.fecha_inicio != '' && this.fecha_fin != '') {
        this.dataPeriodos = [];
        if (this.dias >= 7) {
          if (this.data[0].dias_01 != null && this.data[0].dias_01 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_01)
          }

          if (this.data[0].dias_02 != null && this.data[0].dias_02 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_02)
          }

          if (this.data[0].dias_03 != null && this.data[0].dias_03 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_03)
          }

          if (this.data[0].dias_04 != null && this.data[0].dias_04 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_04)
          }

          if (this.data[0].dias_05 != null && this.data[0].dias_05 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_05)
          }

          if (this.data[0].dias_06 != null && this.data[0].dias_06 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_06)
          }

          if (this.data[0].dias_07 != null && this.data[0].dias_07 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_07)
          }

          if (this.data[0].dias_08 != null && this.data[0].dias_08 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_08)
          }

          if (this.data[0].dias_09 != null && this.data[0].dias_09 > 0) {
            this.dataPeriodos.push(this.data[0].Periodo_09)
          }
          var dias_sin_truncos = (Number(this.data[0].dias_01) + Number(this.data[0].dias_02) + Number(this.data[0].dias_03) + Number(this.data[0].dias_04) + Number(this.data[0].dias_05) + Number(this.data[0].dias_06) + Number(this.data[0].dias_07) + Number(this.data[0].dias_08) + Number(this.data[0].dias_09) + Number(this.data[0].dias_10))

          this.dataPeriodos.push(this.data[0].Periodo_10);
          //SI LOS DÍAS DE VACACIONES NO ABARCAN TRUNCOS
          console.log(this.dias);
          console.log(dias_sin_truncos);
          if (dias_sin_truncos == 0) {
            var dias = this.dias;
            var dataPeriodos = [];
            this.dataPeriodos.forEach(element => {
              if (element == this.data[0].Periodo_10) {
                if (this.data[0].dias_10 > 0) {
                  if (dias > 0) {
                    if (this.data[0].dias_10 < dias) {
                      dias = dias - this.data[0].dias_10;
                      var res = new Date(this.fecha_inicio);
                      res.setDate(res.getDate() + this.data[0].dias_01);
                      let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                      let fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                      let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                      let data = {
                        periodo: element,
                        dias: this.data[0].dias_10,
                        Cod_Trabajador: this.Cod_Trabajador,
                        Cod_Empresa: this.Cod_Empresa,
                        Tip_Trabajador: this.Tip_Trabajador,
                        fecha_inicio: fecha_inicio_modificada,
                        fecha_fin: fecha_modificada
                      };
                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = this.data[0].dias_10 - dias;

                      var res = new Date(this.fecha_inicio);
                      res.setDate(res.getDate() + guardar);
                      let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                      let fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                      let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                      let data = {
                        periodo: element,
                        dias: guardar,
                        Cod_Trabajador: this.Cod_Trabajador,
                        Cod_Empresa: this.Cod_Empresa,
                        Tip_Trabajador: this.Tip_Trabajador,
                        fecha_inicio: fecha_inicio_modificada,
                        fecha_fin: fecha_modificada
                      };
                      dataPeriodos.push(data)
                    }
                  }
                } else {
                  if (dias > 0) {
                    var truncos = Number(this.data[0].dias_truncos) - Number(this.data[0].dias_vencidos);
                    if (truncos < dias) {
                      dias = dias - truncos;
                      var res = new Date(this.fecha_inicio);
                      res.setDate(res.getDate() + truncos);
                      let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                      let fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                      let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                      let data = {
                        periodo: this.data[0].Periodo_10,
                        dias: truncos,
                        Cod_Trabajador: this.Cod_Trabajador,
                        Cod_Empresa: this.Cod_Empresa,
                        Tip_Trabajador: this.Tip_Trabajador,
                        fecha_inicio: fecha_inicio_modificada,
                        fecha_fin: fecha_modificada
                      };
                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = truncos - dias;

                      var res = new Date(this.fecha_inicio);
                      res.setDate(res.getDate() + guardar);
                      let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                      let fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                      let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                      let data = {
                        periodo: this.data[0].Periodo_10,
                        dias: guardar,
                        Cod_Trabajador: this.Cod_Trabajador,
                        Cod_Empresa: this.Cod_Empresa,
                        Tip_Trabajador: this.Tip_Trabajador,
                        fecha_inicio: fecha_inicio_modificada,
                        fecha_fin: fecha_modificada
                      };
                      dataPeriodos.push(data)
                    }
                  }
                }

              }
            });
            console.log(dias);
            console.log(dataPeriodos);
          } else {
            if (this.dias <= dias_sin_truncos) {
              console.log('LOS DIAS NO ABARCAN TRUNCOS');
              var dias = this.dias;
              var dataPeriodos = [];
              var fecha_fin = '';
              this.dataPeriodos.forEach(element => {
                if (element == this.data[0].Periodo_01) {
                  if (this.data[0].dias_01 < dias) {
                    dias = dias - this.data[0].dias_01;
                    var res = new Date(this.fecha_inicio);
                    res.setDate(res.getDate() + this.data[0].dias_01);
                    let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                    fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                    let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                    let data = {
                      periodo: element,
                      dias: this.data[0].dias_01,
                      Cod_Trabajador: this.Cod_Trabajador,
                      Cod_Empresa: this.Cod_Empresa,
                      Tip_Trabajador: this.Tip_Trabajador,
                      fecha_inicio: fecha_inicio_modificada,
                      fecha_fin: fecha_modificada
                    };
                    dataPeriodos.push(data)
                  } else {
                    var guardar = dias;
                    dias = dias - this.data[0].dias_01;
                    var res = new Date(this.fecha_inicio);
                    res.setDate(res.getDate() + this.data[0].dias_01);
                    let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                    let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                    fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                    let data = {
                      periodo: element,
                      dias: guardar,
                      Cod_Trabajador: this.Cod_Trabajador,
                      Cod_Empresa: this.Cod_Empresa,
                      Tip_Trabajador: this.Tip_Trabajador,
                      fecha_inicio: fecha_inicio_modificada,
                      fecha_fin: fecha_modificada
                    };
                    dataPeriodos.push(data)
                  }

                }
                if (element == this.data[0].Periodo_02) {
                  if (dias > 0) {
                    if (this.data[0].dias_02 < dias) {
                      dias = dias - this.data[0].dias_02;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_02);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_02,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_02 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_02 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_02,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_02;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_03) {
                  if (dias > 0) {
                    if (this.data[0].dias_03 < dias) {
                      dias = dias - this.data[0].dias_03;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_03);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_03,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_03 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_03 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_03,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_03;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_04) {
                  if (dias > 0) {
                    if (this.data[0].dias_04 < dias) {
                      dias = dias - this.data[0].dias_04;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_04);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_04,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_04 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_04 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_04,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_04;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_05) {
                  if (dias > 0) {
                    if (this.data[0].dias_05 < dias) {
                      dias = dias - this.data[0].dias_05;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_05);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_05,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_05 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_05 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_05,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_05;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_06) {
                  if (dias > 0) {
                    if (this.data[0].dias_06 < dias) {
                      dias = dias - this.data[0].dias_06;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_06);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_06,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_06 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_06 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_06,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_06;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_07) {
                  if (dias > 0) {
                    if (this.data[0].dias_07 < dias) {
                      dias = dias - this.data[0].dias_07;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_07);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_07,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_07 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_07 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_07,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_07;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_08) {
                  if (dias > 0) {
                    if (this.data[0].dias_08 < dias) {
                      dias = dias - this.data[0].dias_08;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_08);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');

                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_08,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_08 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_08 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_08,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_08;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_09) {
                  if (dias > 0) {
                    if (this.data[0].dias_09 < dias) {
                      dias = dias - this.data[0].dias_09;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_09);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        console.log(fecha_inicio_modificada + 'prueba');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_09,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_09 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_09 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_09,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_09;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + (guardar));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        let res = new Date(fecha_fin);
                        console.log(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        let res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_10) {
                  if (dias > 0) {
                    if (this.data[0].dias_10 < dias) {
                      dias = dias - this.data[0].dias_10;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_10);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_10,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_10 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_10 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_10,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_10;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
              });

              console.log(dataPeriodos);
              console.log(dias);
            }
            //SI LOS DÍAS DE VACACIONES ABARCAN TRUNCOS
            else {
              console.log('LOS DIAS ABARCAN TRUNCOS');
              var dias = this.dias;
              var dataPeriodos = [];
              var fecha_fin = '';
              this.dataPeriodos.forEach(element => {
                if (element == this.data[0].Periodo_01) {
                  if (this.data[0].dias_01 < dias) {
                    dias = dias - this.data[0].dias_01;
                    var res = new Date(this.fecha_inicio);
                    res.setDate(res.getDate() + this.data[0].dias_01);
                    let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                    fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                    let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                    let data = {
                      periodo: element,
                      dias: this.data[0].dias_01,
                      Cod_Trabajador: this.Cod_Trabajador,
                      Cod_Empresa: this.Cod_Empresa,
                      Tip_Trabajador: this.Tip_Trabajador,
                      fecha_inicio: fecha_inicio_modificada,
                      fecha_fin: fecha_modificada
                    };
                    dataPeriodos.push(data)
                  } else {
                    var guardar = dias;
                    dias = dias - this.data[0].dias_01;
                    var res = new Date(this.fecha_inicio);
                    res.setDate(res.getDate() + this.data[0].dias_01);
                    let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                    let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                    fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                    let data = {
                      periodo: element,
                      dias: guardar,
                      Cod_Trabajador: this.Cod_Trabajador,
                      Cod_Empresa: this.Cod_Empresa,
                      Tip_Trabajador: this.Tip_Trabajador,
                      fecha_inicio: fecha_inicio_modificada,
                      fecha_fin: fecha_modificada
                    };
                    dataPeriodos.push(data)
                  }

                }
                if (element == this.data[0].Periodo_02) {
                  if (dias > 0) {
                    if (this.data[0].dias_02 < dias) {
                      dias = dias - this.data[0].dias_02;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_02);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_02,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_02 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_02 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_02,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_02;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_03) {
                  if (dias > 0) {
                    if (this.data[0].dias_03 < dias) {
                      dias = dias - this.data[0].dias_03;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_03);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_03,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_03 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_03 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_03,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_03;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_04) {
                  if (dias > 0) {
                    if (this.data[0].dias_04 < dias) {
                      dias = dias - this.data[0].dias_04;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_04);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_04,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_04 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_04 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_04,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_04;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_05) {
                  if (dias > 0) {
                    if (this.data[0].dias_05 < dias) {
                      dias = dias - this.data[0].dias_05;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_05);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_05,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_05 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_05 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_05,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_05;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_06) {
                  if (dias > 0) {
                    if (this.data[0].dias_06 < dias) {
                      dias = dias - this.data[0].dias_06;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_06);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_06,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_06 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_06 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_06,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_06;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_07) {
                  if (dias > 0) {
                    if (this.data[0].dias_07 < dias) {
                      dias = dias - this.data[0].dias_07;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_07);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_07,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_07 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_07 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_07,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_07;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_08) {
                  if (dias > 0) {
                    if (this.data[0].dias_08 < dias) {
                      dias = dias - this.data[0].dias_08;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_08);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');

                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_08,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_08 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_08 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_08,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_08;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + guardar);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_09) {
                  if (dias > 0) {
                    if (this.data[0].dias_09 < dias) {
                      dias = dias - this.data[0].dias_09;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + this.data[0].dias_09);
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_09,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        var res = new Date(fecha_fin);
                        res.setDate(res.getDate() + (this.data[0].dias_09 + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        var res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (this.data[0].dias_09 - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data = {
                          periodo: element,
                          dias: this.data[0].dias_09,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }

                      dataPeriodos.push(data)
                    } else {
                      var guardar = dias;
                      dias = dias - this.data[0].dias_09;
                      if (fecha_fin == '') {
                        var res = new Date(this.fecha_inicio);
                        res.setDate(res.getDate() + (guardar));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio_modificada,
                          fecha_fin: fecha_modificada
                        };
                      } else {
                        let res = new Date(fecha_fin);
                        console.log(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        let res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        var data2 = {
                          periodo: element,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                      }
                      dataPeriodos.push(data2)
                    }

                  }

                }
                if (element == this.data[0].Periodo_10) {
                  if (this.data[0].dias_10 > 0) {
                    if (dias > 0) {
                      if (this.data[0].dias_09 < dias) {
                        dias = dias - this.data[0].dias_09;
                        if (fecha_fin == '') {
                          var res = new Date(this.fecha_inicio);
                          res.setDate(res.getDate() + this.data[0].dias_09);
                          let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                          fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');
                          let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                          var data = {
                            periodo: element,
                            dias: this.data[0].dias_09,
                            Cod_Trabajador: this.Cod_Trabajador,
                            Cod_Empresa: this.Cod_Empresa,
                            Tip_Trabajador: this.Tip_Trabajador,
                            fecha_inicio: fecha_inicio_modificada,
                            fecha_fin: fecha_modificada
                          };
                        } else {
                          var res = new Date(fecha_fin);
                          res.setDate(res.getDate() + (this.data[0].dias_09 + 1));
                          let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                          fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                          let fecha_inicio = '';
                          var res2 = new Date(fecha_fin);
                          res2.setDate(res2.getDate() - (this.data[0].dias_09 - 2));
                          fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                          var data = {
                            periodo: element,
                            dias: this.data[0].dias_09,
                            Cod_Trabajador: this.Cod_Trabajador,
                            Cod_Empresa: this.Cod_Empresa,
                            Tip_Trabajador: this.Tip_Trabajador,
                            fecha_inicio: fecha_inicio,
                            fecha_fin: fecha_modificada
                          };
                        }

                        dataPeriodos.push(data)
                      } else {
                        var guardar = dias;
                        dias = dias - this.data[0].dias_09;
                        if (fecha_fin == '') {
                          var res = new Date(this.fecha_inicio);
                          res.setDate(res.getDate() + (guardar));
                          let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                          fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                          let fecha_inicio_modificada = _moment(this.fecha_inicio.valueOf()).format('DD/MM/YYYY');
                          var data2 = {
                            periodo: element,
                            dias: guardar,
                            Cod_Trabajador: this.Cod_Trabajador,
                            Cod_Empresa: this.Cod_Empresa,
                            Tip_Trabajador: this.Tip_Trabajador,
                            fecha_inicio: fecha_inicio_modificada,
                            fecha_fin: fecha_modificada
                          };
                        } else {
                          let res = new Date(fecha_fin);
                          console.log(fecha_fin);
                          res.setDate(res.getDate() + (guardar + 1));
                          let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                          fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                          let fecha_inicio = '';
                          let res2 = new Date(fecha_fin);
                          res2.setDate(res2.getDate() - (guardar - 2));
                          fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                          var data2 = {
                            periodo: element,
                            dias: guardar,
                            Cod_Trabajador: this.Cod_Trabajador,
                            Cod_Empresa: this.Cod_Empresa,
                            Tip_Trabajador: this.Tip_Trabajador,
                            fecha_inicio: fecha_inicio,
                            fecha_fin: fecha_modificada
                          };
                        }
                        dataPeriodos.push(data2)
                      }

                    }
                  } else {
                    if (dias > 0) {
                      var truncos = Number(this.data[0].dias_truncos) - Number(this.data[0].dias_vencidos);

                      if (truncos < dias) {
                        dias = dias - truncos;
                        let res = new Date(fecha_fin);
                        console.log(fecha_fin);
                        res.setDate(res.getDate() + (truncos + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        let res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (truncos - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        let data = {
                          periodo: this.data[0].Periodo_10,
                          dias: truncos,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                        dataPeriodos.push(data)
                      } else {
                        var guardar = dias;
                        dias = truncos - dias;

                        let res = new Date(fecha_fin);
                        console.log(fecha_fin);
                        res.setDate(res.getDate() + (guardar + 1));
                        let fecha_modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
                        fecha_fin = _moment(res.valueOf()).format('YYYY-MM-DD');

                        let fecha_inicio = '';
                        let res2 = new Date(fecha_fin);
                        res2.setDate(res2.getDate() - (guardar - 2));
                        fecha_inicio = _moment(res2.valueOf()).format('DD/MM/YYYY');
                        let data = {
                          periodo: this.data[0].Periodo_10,
                          dias: guardar,
                          Cod_Trabajador: this.Cod_Trabajador,
                          Cod_Empresa: this.Cod_Empresa,
                          Tip_Trabajador: this.Tip_Trabajador,
                          fecha_inicio: fecha_inicio,
                          fecha_fin: fecha_modificada
                        };
                        dataPeriodos.push(data)
                      }
                    }
                  }

                }
              });
              console.log(dias);
              console.log(dataPeriodos);
            }
          }


          let form = {
            opcion: 'I',
            periodos: dataPeriodos,
            observaciones: this.observaciones,
            cod_empresa: this.Cod_Empresa,
            Cod_Usuario: GlobalVariable.vusu
          }
          console.log(form);
          this.despachoTelaCrudaService.grabarDatosVacaciones(form).subscribe((result: any) => {
            if (result.msg == 'OK') {
              this.matSnackBar.open('SE REGISTRO CORRECTAMENTE', 'Cerrar', {
                duration: 3500,
              });
              this.validarForm = !this.validarForm;
            }
          },
            (err: HttpErrorResponse) => {
              this.dataTrabajadores = [];
              this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 1500,
              })
            })
        }else{
          this.matSnackBar.open('LOS DÍAS DE VACACIONES DEBEN SER MAYOR O IGUAL A 7', 'Cerrar', {
            duration: 2500,
          });
        }


      } else {
        this.matSnackBar.open('LAS FECHAS DE INICIO Y FIN DE VACACIONES SON OBLIGATORIAS', 'Cerrar', {
          duration: 2500,
        });
      }
    } else {
      this.matSnackBar.open('DEBES SELECCIONAR LA EMPRESA Y EL TRABAJADOR', 'Cerrar', {
        duration: 2500,
      });
    }


  }

  changeFechaFin() {
    var fechaInicio = new Date(this.fecha_inicio).getTime();
    var fechaFin = new Date(this.fecha_fin).getTime();

    var diff = fechaFin - fechaInicio;
    var res = new Date(this.fecha_fin);
    res.setDate(res.getDate() + 2);
    var Fecha_Modificada = _moment(res.valueOf()).format('DD/MM/YYYY');
    var Fecha_Modificada2 = _moment(res.valueOf()).format('YYYY-MM-DD');
    this.dias = diff / (1000 * 60 * 60 * 24) + 1;
    console.log(Fecha_Modificada);
    this.Fecha_Modificada = Fecha_Modificada2;

    this.despachoTelaCrudaService.horariosTrabajadoresEmpresa(this.Cod_Empresa, this.Tip_Trabajador, this.Cod_Trabajador, Fecha_Modificada, 'I').subscribe((result: any) => {
      let valor = JSON.stringify(result[0]).split(':')
      if (valor[2] != undefined) {
        let hora = valor[1].replace('"', '')
        let minutos = valor[2].replace('"}', '')

        this.despachoTelaCrudaService.horariosFeriados(Fecha_Modificada).subscribe((res: any) => {
          console.log(res);
          let valor = JSON.stringify(res[0]).split(':')
          let validar = valor[1].replace('"}', '')
          let data = validar.replace('"', '')
          console.log(data);
          if (data == 'S') {
            this.matSnackBar.open('LA FECHA DE RETORNO NO DEBE SER UN DÍA FERIADO!!', 'Cerrar', {
              duration: 2500,
            });
            this.fecha_fin = '';
            this.dias = 0;
            this.Fecha_Modificada = '';
          }
        },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })

      } else {
        this.fecha_fin = '';
        this.dias = 0;
        this.Fecha_Modificada = '';
        this.matSnackBar.open('LA FECHA DE RETORNO NO DEBE SER UN DÍA NO LABORABLE PARA EL TRABAJADOR!!', 'Cerrar', {
          duration: 2500,
        });
      }



    },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })


    if (this.dias < 0) {
      this.fecha_fin = '';
      this.matSnackBar.open('VERIFICA EL RANGO DE FECHAS SEA CORRECTO!!', 'Cerrar', {
        duration: 2500,
      });
      this.dias = 0;
      this.Fecha_Modificada = '';
    }

    if (this.dias > this.dias_pendientes) {
      this.fecha_fin = '';
      this.matSnackBar.open('LOS DÍAS DE VACACIONES NO PUEDEN SER MAYOR A LOS DÍAS DISPONIBLES!!', 'Cerrar', {
        duration: 3500,
      });
      this.dias = 0;
      this.Fecha_Modificada = '';
    }
  }

  actualizarPermiso() {
    if (this.Cod_Trabajador != '' && this.Cod_Empresa != '') {
      this.fecha_inicio = '';
      this.fecha_fin = '';
      this.Fecha_Modificada = '';
      this.dias = 0;
      this.despachoTelaCrudaService.getControlVacacionesTrabajador(this.Cod_Trabajador, this.Tip_Trabajador, this.Cod_Empresa).subscribe((result: any) => {
        console.log(result);
        if (result != null) {
          this.data = result;
          this.dias_pendientes = (Number(this.data[0].dias_01) + Number(this.data[0].dias_02) + Number(this.data[0].dias_03) + Number(this.data[0].dias_04) + Number(this.data[0].dias_05) + Number(this.data[0].dias_06) + Number(this.data[0].dias_07) + Number(this.data[0].dias_08) + Number(this.data[0].dias_09) + Number(this.data[0].dias_10) + Number(this.data[0].dias_truncos));

          console.log(this.data[0].dias_08);
          console.log(this.data[0].dias_09);
          if (this.data[0].dias_vencidos != null) {
            this.dias_pendientes = this.dias_pendientes - Number(this.data[0].dias_vencidos)
          }
          console.log(Math.floor(this.dias_pendientes));
          this.dias_pendientes = Math.floor(this.dias_pendientes);
        }
      },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })
    } else {
      this.matSnackBar.open('DEBES SELECCIONAR LA EMPRESA Y LUEGO EL TRABAJADOR!!', 'Cerrar', {
        duration: 1500,
      })
    }
  }

  nuevoRegistro() {
    this.validarForm = !this.validarForm;
    this.fecha_inicio = '';
    this.fecha_fin = '';
    this.Fecha_Modificada = '';
    this.dias = 0;
    this.Cod_Empresa = '';
    this.Cod_Trabajador = '';
    this.Tip_Trabajador = '';
    this.observaciones = '';
    this.data = [];
  }
}


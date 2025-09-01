import { AfterViewInit, Component, ViewChild, OnInit, Input, AfterContentInit, AfterContentChecked, AfterViewChecked, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { DialogIngresoEmpleadoComisionComponent } from '../form-comisiones/dialog-ingreso-empleado-comision/dialog-ingreso-empleado-comision.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import * as _moment from 'moment';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

export interface PeriodicElement {
  tipo: string;
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-form-comisiones',
  templateUrl: './form-comisiones.component.html',
  styleUrls: ['./form-comisiones.component.scss']
})
export class FormComisionesComponent implements OnInit,
  AfterViewInit {
  date = new FormControl(new Date());

  boton: boolean = false;
  sCod_Usuario = GlobalVariable.vusu
  today: string = '';
  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _router: Router,
    private despachoTelaCrudaService: RegistroPermisosService) {

    const str = new Date().toLocaleString('en-Es', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var dia = str.substring(3, 5);
    var mes = str.substring(0, 2);
    var anio = str.substring(6, 10);
    var totaldia = anio + '-' + mes + '-' + dia;
    console.log(totaldia);
    this.today = totaldia;

  }
  
  formulario = this.formBuilder.group({ fecha: [new Date()], jefe: [this.sCod_Usuario], tipos: [''], motivos: [''], observaciones: [''], Sede_partida: [''] })

  ngOnInit(): void {
    GlobalVariable.Arr_Trabajadores = [];
  }



  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'Acciones'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  opendialog() {

    let dialogRef = this.dialog.open(DialogIngresoEmpleadoComisionComponent, {
      minHeight: '400px',
      disableClose: false,
      data: { eltipo: this.formulario.get('tipos')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {


      const ELEMENT_DATA: PeriodicElement[] = GlobalVariable.Arr_Trabajadores;

      this.displayedColumns = ['position', 'name', 'weight', 'symbol', 'Acciones'];
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.ngAfterViewInit()

      if (result == 'false') {
        //this.CargarOperacionConductor()
        // this.MostrarCabeceraVehiculo()
      }

    })

  }

  async guardarPermisos() {
    this.boton = true;
    if (this.formulario.get('tipos').value != '' && this.formulario.get('Sede_partida').value != '') {
      if (GlobalVariable.Arr_Trabajadores.length > 0) {
        await this.registroComision();
      } else {
        this.boton = false;
        this.matSnackBar.open('Debes agregar al menos un trabajador al permiso.', 'Cerrar', {
          duration: 1500,
        })
      }
    } else {
      this.boton = false;
      this.matSnackBar.open('Debes seleccionar el tipo de comisión y sede de partida.', 'Cerrar', {
        duration: 3500,
      })
    }




  }

  EliminarRegistro(position) {
    console.log(position);
    var array = [];
    array = GlobalVariable.Arr_Trabajadores.filter(element => {
      return element.position != position
    });
    GlobalVariable.Arr_Trabajadores = array;
    console.log(GlobalVariable.Arr_Trabajadores);
    const ELEMENT_DATA: PeriodicElement[] = GlobalVariable.Arr_Trabajadores;

    this.displayedColumns = ['position', 'name', 'weight', 'symbol', 'Acciones'];
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.ngAfterViewInit();

    this.matSnackBar.open('Se elimino correctamente el registro', 'Cerrar', {
      duration: 1500,
    })
  }


  async registroComision() {
    let nreg = GlobalVariable.Arr_Trabajadores.length
    let fecha = this.formulario.get("fecha")?.value

    if (!_moment(fecha).isValid()) {
      fecha = '01/01/1900';
    } else {
      fecha = _moment(fecha.valueOf()).format('DD/MM/YYYY');
    }

    let jefe = this.formulario.get("jefe")?.value
    let tipos = this.formulario.get("tipos")?.value
    let motivos = this.formulario.get("motivos")?.value
    let obse = this.formulario.get("observaciones")?.value
    let sede = this.formulario.get("Sede_partida")?.value
    //let idpermiso=""+this.grabarPermisos(fecha,jefe,tipos,motivos,obse)
    let idpermiso



    this.despachoTelaCrudaService.recogedatosJefes(jefe).subscribe(
      (result: any) => {
        var codJefe = result[0].Codigo
        var tipoJefe = result[0].Tipo
        this.despachoTelaCrudaService.guardarPermiso(fecha, jefe, tipos, motivos, obse).subscribe(
          (result: any) => {
            idpermiso = result
            console.log(idpermiso)
            console.log(idpermiso.toString().length)
            let comodin = ''
            switch (idpermiso.toString().length) {
              case 1: comodin = '0000000'
                break;
              case 2: comodin = '000000'
                break;
              case 3: comodin = '00000'
                break;
              case 4: comodin = '0000'
                break;
              case 5: comodin = '000'
                break;
              case 6: comodin = '00'
                break;
              case 7: comodin = '0'
                break;
              case 8: comodin = ''
                break;
            }
            let idGnPermiso = comodin + idpermiso
            this.despachoTelaCrudaService.grabarCabeceraPermiso('A', idGnPermiso, fecha, tipos, motivos, tipoJefe, codJefe, obse, this.sCod_Usuario, sede).subscribe((result: any) => {
              console.log(result)
              for (let index = 0; index < nreg; index++) {

                GlobalVariable.Arr_Trabajadores[index];
                console.log(GlobalVariable.Arr_Trabajadores[index]);

                let tipotra = GlobalVariable.Arr_Trabajadores[index].tipo
                let position = GlobalVariable.Arr_Trabajadores[index].position
                let name = GlobalVariable.Arr_Trabajadores[index].name
                let weight = GlobalVariable.Arr_Trabajadores[index].weight
                let Cod_Empresa = GlobalVariable.Arr_Trabajadores[index].Cod_Empresa
                let hinicio = weight.split(':')
                let hini = hinicio[0]
                let mini = hinicio[1]
                let symbol = GlobalVariable.Arr_Trabajadores[index].symbol
                let hfinal = symbol.split(':')
                let hfin = hfinal[0]
                let mfin = hfinal[1]

                let idGnPermiso = comodin + idpermiso

                this.despachoTelaCrudaService.grabarDetallePermiso('A', idGnPermiso, '001', tipotra, position, hini, mini, hfin, mfin, this.sCod_Usuario, Cod_Empresa).subscribe((result: any) => {
                  console.log(result)
                  if (index == (nreg - 1)) {
                    this.matSnackBar.open('El registro se proceso correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
                    this.boton = false;
                    var arr = [];
                    GlobalVariable.Arr_Trabajadores.push(arr);

                    this._router.navigate(['RegistrarPermisos']);
                  }

                  return result
                },
                  (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
                    duration: 1500,
                  }))
              }

                    //========================
                    this.despachoTelaCrudaService.MostrarAlerta(idGnPermiso, this.sCod_Usuario).subscribe((result: any) => { },
                    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
                    duration: 1500,
                    }))
                    //========================

                    
              return result
            }, (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            }))




            return result;
            // 
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }







}

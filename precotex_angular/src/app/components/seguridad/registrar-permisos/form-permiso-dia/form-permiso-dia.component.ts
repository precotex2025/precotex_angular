import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { DialogIngresoEmpleadorefrigerioComponent } from "../form-refrigerio/dialog-ingreso-empleadorefrigerio/dialog-ingreso-empleadorefrigerio.component";
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment, * as _moment from 'moment';
import { Router } from '@angular/router';
import { DialogPermisoDiaComponent } from './dialog-permiso-dia/dialog-permiso-dia.component';

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
  selector: 'app-form-permiso-dia',
  templateUrl: './form-permiso-dia.component.html',
  styleUrls: ['./form-permiso-dia.component.scss']
})
export class FormPermisoDiaComponent implements OnInit {

  date = new FormControl(new Date());
  sCod_Usuario = GlobalVariable.vusu

  boton: boolean = false;
  codJefe: string = '';
  tipoJefe: string = '';
  idPermiso: string = '';

  idGnPermiso2 = '';

  minDate: Date;
  today:string = '';
  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _router: Router,
    private despachoTelaCrudaService: RegistroPermisosService) {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay);

    const str = new Date().toLocaleString('en-Es', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var dia = str.substring(3, 5);
    var mes = str.substring(0, 2);
    var anio = str.substring(6, 10);
    var totaldia = anio + '-' + mes + '-' + dia;
    console.log(totaldia);
    this.today = totaldia;
  }
  formulario = this.formBuilder.group({ start: [new Date], end: [new Date], jefe: [this.sCod_Usuario], tipos: ['007'], motivos: [''], observaciones: [''], Sede_partida: [''] })

  range = new FormGroup({
    start: new FormControl(
      new Date()
    ),
    end: new FormControl(
      new Date()
    ),
  });




  ngOnInit(): void {
    GlobalVariable.Arr_Trabajadores = [];
    this.formulario.get('jefe').disable();
    this.obtenerCodTipJefe();
    this.obtenerPermiso();
  }


  displayedColumns: string[] = ['position', 'name', 'Acciones'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  opendialog() {

    let dialogRef = this.dialog.open(DialogPermisoDiaComponent, {
      disableClose: false,
      minHeight: '400px',
      //minWidth: '600px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: { eltipo: this.formulario.get('tipos')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {


      const ELEMENT_DATA: PeriodicElement[] = GlobalVariable.Arr_Trabajadores;

      this.displayedColumns = ['position', 'name', 'Acciones'];
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.ngAfterViewInit()

      if (result == 'false') {
        //this.CargarOperacionConductor()
        //this.MostrarCabeceraVehiculo()
      }

    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarPermisos() {
    if (confirm('Esta seguro(a) de registrar un permiso sin GOCE DE HABER?')) {
      this.boton = true;

      var finM = this.range.get('start').value;
      var finEnd = this.range.get('end').value;
      var starfinM = this.range.get('start').value;
      var fechaFInM = _moment(finM);
      console.log(fechaFInM);
      var fec = '';
      if (!_moment(fechaFInM).isValid()) {
        fec = '';
      }
      fec = _moment(fechaFInM.valueOf()).format('DD/MM/YYYY');
      var fecstar = _moment(starfinM.valueOf()).format('DD/MM/YYYY');
      var fecend = _moment(finEnd.valueOf()).format('DD/MM/YYYY');
      console.log(fec);
      console.log(fecstar);
      console.log(finEnd);
      if (fecend <= fec) {
        if (this.formulario.get('tipos').value != '' && this.formulario.get('Sede_partida').value != '' && this.formulario.get('motivos').value != '') {
          if (GlobalVariable.Arr_Trabajadores.length > 0) {
            var fecha_start = this.range.get('start')?.value;
            var fecha_end = this.range.get('end')?.value;
            var start = new Date(fecha_start).getTime();
            var end = new Date(fecha_end).getTime();

            var diff = end - start;
            var dias = (diff / (1000 * 60 * 60 * 24) + 1);

            var array_fechas = [];
            for (let i = 0; i < dias; i++) {
              var inicio = new Date(fecha_start);
              inicio.setDate(inicio.getDate() + i);
              const element = inicio;
              let fecha = _moment(element.valueOf()).format('DD/MM/YYYY');
              let permiso = this.idPermiso + i;
              let datos = {
                fecha: fecha,
                permiso: permiso
              }
              array_fechas.push(datos);
            }

            let tipos = this.formulario.get("tipos")?.value
            let motivos = this.formulario.get("motivos")?.value
            let obse = this.formulario.get("observaciones")?.value
            //let idpermiso=""+this.grabarPermisos(fecha,jefe,tipos,motivos,obse)
            var idPermiso = this.idPermiso;
            var dataCab = [];
            for (let i = 0; i < array_fechas.length; i++) {
              const element = array_fechas[i].fecha;
              const permiso = array_fechas[i].permiso;
              let comodin = ''
              switch (permiso.toString().length) {
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
              //EXEC Rh_Man_Permiso_Cab 'A','00000001','28/09/2022','003','PER','E','2043','PRUEBA','SISTEMAS'
              const idGnPermiso = comodin + permiso
              console.log('fecha: ' + element);
              console.log('permiso: ' + idGnPermiso);
              var Sede_partida = this.formulario.get('Sede_partida').value;
              let cab = {
                Opcion: 'A',
                Num_Permiso: idGnPermiso,
                Fec_Permiso: element,
                Cod_Tipo_Permiso: tipos,
                Cod_Motivo_Permiso: motivos,
                Tip_Trabajador_Autoriza: this.tipoJefe,
                Cod_Trabajador_Autoriza: this.codJefe,
                Observacion: obse,
                Cod_Usuario: this.sCod_Usuario,
                Sede_partida: Sede_partida,
                Det: []
              };

              let nreg = GlobalVariable.Arr_Trabajadores.length
              for (let index = 0; index < nreg; index++) {

                GlobalVariable.Arr_Trabajadores[index];
                console.log(GlobalVariable.Arr_Trabajadores[index]);

                let tipotra = GlobalVariable.Arr_Trabajadores[index].tipo
                let position = GlobalVariable.Arr_Trabajadores[index].position
                let name = GlobalVariable.Arr_Trabajadores[index].name
                let weight = GlobalVariable.Arr_Trabajadores[index].weight
                let hinicio = weight.split(':')
                let hini = hinicio[0]
                let mini = hinicio[1]
                let symbol = GlobalVariable.Arr_Trabajadores[index].symbol
                let Cod_Empresa = GlobalVariable.Arr_Trabajadores[index].Cod_Empresa
                let hfinal = symbol.split(':')
                let hfin = hfinal[0]
                let mfin = hfinal[1]
                let det = {
                  Opcion: 'A',
                  Num_Permiso: idGnPermiso,
                  Cod_Fabrica: '001',
                  Tip_Trabajador: tipotra,
                  Cod_Trabajador: position,
                  Inicio_Hora: hini,
                  Inicio_Minuto: mini,
                  Termino_Hora: hfin,
                  Termino_Minuto: mfin,
                  Cod_Usuario: this.sCod_Usuario,
                  Cod_Empresa: Cod_Empresa
                }
                cab.Det.push(det);
              }

              dataCab.push(cab);
              this.idGnPermiso2 = idGnPermiso;
            }
            this.despachoTelaCrudaService.grabarCabeceraPermisoRefrigerio(dataCab).subscribe(
              (res: any) => {
                if (res.msg == 'OK' && res['data_det'].length == 0) {
                  this.boton = false;
                  GlobalVariable.Arr_Trabajadores = [];
                  this.matSnackBar.open('El registro se proceso correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })


                  this._router.navigate(['RegistrarPermisos']);


                     //========================
                     this.despachoTelaCrudaService.MostrarAlerta(this.idGnPermiso2, this.sCod_Usuario).subscribe((result: any) => { },
                     (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
                     duration: 1500,
                     }))
                     //========================



                }else{
                  this.obtenerPermiso();
                  this.boton = false;
                  this.matSnackBar.open('Ya registraste el permiso por día para esta persona anteriormente.!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
                }
              },
              (err: HttpErrorResponse) => {
                this.boton = false;
                this.matSnackBar.open(err.message, 'Cerrar', {
                  duration: 1500,
                })
              })
          } else {
            this.boton = false;
            this.matSnackBar.open('Debes agregar trabajadores al permiso', 'Cerrar', {
              duration: 1500,
            })
          }
        } else {
          this.boton = false;
          this.matSnackBar.open('Debes seleccionar la sede de partida y el motivo del permiso', 'Cerrar', {
            duration: 1500,
          })
        }
      } else {
        this.matSnackBar.open('Solo puedes registrar un permiso de 1 día', 'Cerrar', {
          duration: 1500,
        })
        this.boton = false;
      }

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

    this.displayedColumns = ['position', 'name', 'Acciones'];
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.ngAfterViewInit();

    this.matSnackBar.open('Se elimino correctamente el registro', 'Cerrar', {
      duration: 1500,
    })
  }

  cambiarValor(idPermiso) {
    this.idPermiso = idPermiso;
    console.log('metodo: ' + this.idPermiso)
  }

  obtenerPermiso() {
    this.despachoTelaCrudaService.guardarPermiso('prueba', 'prueba', 'prueba', 'prueba', 'prueba').subscribe(
      (res: any) => {

        if (res != '') {
          this.idPermiso = res;
          console.log(this.idPermiso);
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  obtenerCodTipJefe() {
    this.despachoTelaCrudaService.recogedatosJefes(this.formulario.get("jefe")?.value).subscribe((result: any) => {
      this.codJefe = result[0].Codigo
      this.tipoJefe = result[0].Tipo
    },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


  grabarDetalles(idGnPermiso) {
    let nreg = GlobalVariable.Arr_Trabajadores.length
    for (let index = 0; index < nreg; index++) {

      GlobalVariable.Arr_Trabajadores[index];
      console.log(GlobalVariable.Arr_Trabajadores[index]);

      let tipotra = GlobalVariable.Arr_Trabajadores[index].tipo
      let position = GlobalVariable.Arr_Trabajadores[index].position
      let name = GlobalVariable.Arr_Trabajadores[index].name
      let weight = GlobalVariable.Arr_Trabajadores[index].weight
      let hinicio = weight.split(':')
      let hini = hinicio[0]
      let mini = hinicio[1]
      let symbol = GlobalVariable.Arr_Trabajadores[index].symbol
      let hfinal = symbol.split(':')
      let hfin = hfinal[0]
      let mfin = hfinal[1]


      // this.despachoTelaCrudaService.grabarDetallePermiso('A', idGnPermiso, '001', tipotra, position, hini, mini, hfin, mfin, this.sCod_Usuario).subscribe({
      //   next: (response) => {
      //     console.log(response);
      //   },
      //   error: (error: HttpErrorResponse) => {
      //     this.matSnackBar.open(error.message, 'Cerrar', {
      //       duration: 1500,
      //     });
      //   }
      // });
    }


    

  }
}


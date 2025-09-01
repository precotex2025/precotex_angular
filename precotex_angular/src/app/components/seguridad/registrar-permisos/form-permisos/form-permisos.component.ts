import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { DialogIngresoEmpleadoComponent } from '../form-permisos/dialog-ingreso-empleado/dialog-ingreso-empleado.component';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';
import * as _moment from 'moment';
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
  selector: 'app-form-permisos',
  templateUrl: './form-permisos.component.html',
  styleUrls: ['./form-permisos.component.scss']
})
export class FormPermisosComponent implements OnInit {
  date = new FormControl(new Date());
  boton: boolean = false;
  sCod_Usuario = GlobalVariable.vusu
  tardanza = false;
  today:string = ''
  iSpring: any = [];

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _router: Router,
    private registroPermisosService: RegistroPermisosService) { 

      const str = new Date().toLocaleString('en-Es', { year: 'numeric', month: '2-digit', day: '2-digit' });
      var dia = str.substring(3, 5);
      var mes = str.substring(0, 2);
      var anio = str.substring(6, 10);
      var totaldia = anio + '-' + mes + '-' + dia;
      console.log(totaldia);
      this.today = totaldia;
    }

  formulario = this.formBuilder.group({ fecha: [new Date()], jefe: [this.sCod_Usuario], tipos: [''], motivos: [''], observaciones: [''] })

  ngOnInit(): void {
    this.formulario.get('jefe').disable();
    GlobalVariable.Arr_Trabajadores = [];

   

  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'Acciones'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  opendialog() {

    let dialogRef = this.dialog.open(DialogIngresoEmpleadoComponent, {
      minHeight: '400px',
      disableClose: true,
      data: { eltipo: this.formulario.get('tipos')?.value, fecha: this.formulario.get('fecha')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {


      const ELEMENT_DATA: PeriodicElement[] = GlobalVariable.Arr_Trabajadores;

      this.displayedColumns = ['position', 'name', 'weight', 'symbol', 'Acciones'];
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.ngAfterViewInit()

      if (result == 'false') {
        //this.CargarOperacionConductor()
        //this.MostrarCabeceraVehiculo()
      }

    })
  }

  grabarPermisos(fecha, jefe, tipos, motivos, obse) {


    this.registroPermisosService.guardarPermiso(fecha, jefe, tipos, motivos, obse).subscribe(
      (result: any) => {
        return result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))


  }

  changePermiso(event){
    if(event.value == '002' || event.value == '001'){
      this.tardanza = false;
    }else{
      this.tardanza = true;
    }

  }

  guardarPermisos() {
    this.boton = true;
    
    if(this.formulario.get('tipos').value != '' &&
    this.formulario.get('motivos').value != ''){
      if (GlobalVariable.Arr_Trabajadores.length > 0) {
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
        //let idpermiso=""+this.grabarPermisos(fecha,jefe,tipos,motivos,obse)
        let idpermiso
        var sede = '';
  
  
        this.registroPermisosService.recogedatosJefes(jefe).subscribe(
          (result: any) => {
            console.log(result);
            var codJefe = result[0].Codigo
            var tipoJefe = result[0].Tipo
            this.registroPermisosService.guardarPermiso(fecha, jefe, tipos, motivos, obse).subscribe(
              (result: any) => {
                idpermiso = result
                console.log(idpermiso)
  
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
                //EXEC Rh_Man_Permiso_Cab 'A','00000001','28/09/2022','003','PER','E','2043','PRUEBA','SISTEMAS'
                let idGnPermiso = comodin + idpermiso
                this.registroPermisosService.grabarCabeceraPermiso('A', idGnPermiso, fecha, tipos, motivos, tipoJefe, codJefe, obse, this.sCod_Usuario, sede).subscribe((result: any) => {
  
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
                    let Cod_Empresa = GlobalVariable.Arr_Trabajadores[index].Cod_Empresa
                    let idGnPermiso = comodin + idpermiso
  
                    this.registroPermisosService.grabarDetallePermiso('A', idGnPermiso, '001', tipotra, position, hini, mini, hfin, mfin, this.sCod_Usuario, Cod_Empresa)
                      .subscribe((result: any) => {
                      console.log(result)
                      
                      // GENERAR REGISTRO DE PERMISO EN SPRING. 2024NOV06 (AHMED)
                      this.registroPermisosService.interfaceSpring(idGnPermiso.trim(), tipotra.trim(), position.trim(), 1)
                        .subscribe((res: any) => {
                          this.iSpring = res;
                          console.log(res)
                          
                          if(this.iSpring.length > 0 && this.iSpring[0].NroDocumento != '0'){
                            this.registroPermisosService.generarPermisoSpring(
                              'I',  // Insertar registro en Spring
                              this.iSpring[0].NroDocumento.trim(),
                              this.iSpring[0].CompaniaSocio.trim(),
                              this.getFecha(this.iSpring[0].Fecha),
                              this.iSpring[0].ConceptoAcceso.trim(),
                              this.getFecha(this.iSpring[0].Desde),
                              this.getFecha(this.iSpring[0].FechaFin),
                              this.getFecha(this.iSpring[0].Hasta),
                              this.getFecha(this.iSpring[0].FechaAutorizacion),
                              this.iSpring[0].Observacion.trim(),
                              this.getFecha(this.iSpring[0].FechaSolicitud),
                              this.iSpring[0].UltimoUsuario.trim(),
                              this.getFecha(this.iSpring[0].UltimaFechaModif),
                              this.iSpring[0].FlagPermisoInicioFinJornada.trim()
                            ).subscribe((res: any) => {
                              console.log("ok")
                            });
                          }
                        });
                      // FIN GRABAR EN SPRINT

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
              this.registroPermisosService.MostrarAlerta(idGnPermiso, this.sCod_Usuario).subscribe((result: any) => { },
              (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
              }))
              //========================
                  


                  console.log(result)
                  return result
                },
                  (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
                    duration: 1500,
                  }))
  
  
              },
              (err: HttpErrorResponse) => {
                this.boton = false;
                this.matSnackBar.open(err.message, 'Cerrar', {
                  duration: 1500,
                })
              })
          },
          (err: HttpErrorResponse) => {
            this.boton = false;
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })
      } else {
        this.boton = false;
        this.matSnackBar.open('Debes agregar al menos un trabajador al permiso', 'Cerrar', {
          duration: 1500,
        })
      }
    }else {
      this.boton = false;
      this.matSnackBar.open('Debes seleccionar el tipo y motivos del permiso', 'Cerrar', {
        duration: 1500,
      })
    }
    

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  //-- Obtener fecha en formato UTC del objeto fecha enviado por la DB
  //-- 2024Nov07, Ahmed
  getFecha(fecha: any){
    let arr = Object.entries(fecha);
    let fec = new Date(arr[0][1].toString().substring(0,16).concat(" UTC"));

    return fec.toISOString();
  }

}

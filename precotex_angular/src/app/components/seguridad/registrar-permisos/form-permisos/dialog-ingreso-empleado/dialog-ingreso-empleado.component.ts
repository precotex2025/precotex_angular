import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Console } from 'console';
import * as _moment from 'moment';
interface trabajadores {
  Tipo: string,
  Codigo: string,
  Nombre: string,
}

interface data {
  eltipo: string,
  fecha: Date
}

@Component({
  selector: 'app-dialog-ingreso-empleado',
  templateUrl: './dialog-ingreso-empleado.component.html',
  styleUrls: ['./dialog-ingreso-empleado.component.scss']
})
export class DialogIngresoEmpleadoComponent implements OnInit {
  listar_operacionConductor: trabajadores[] = [];
  listar_operacionConductor2: trabajadores[] = [];
  num_guiaMascara = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];
  seleccionados: Array<any> = [];
  subAreas: Array<any> = [];
  searchable = true;
  mostrar = false;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private RegistroPermisosService: RegistroPermisosService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({ codTrabajador: [''], desTrabajador: [''], horainicio: ['00:00'], horafinal: ['00:00'], subAreas: ['TODOS'] })

  ngOnInit(): void {
    console.log(this.data)
    console.log(screen.height);
    if (screen.height < 740) {
      this.searchable = false;
    }
    this.CargarTrabajadores()
  }

  agregarTrabajadores() {
    this.seleccionados = this.listar_operacionConductor;
    this.mostrar = true;
    this.formulario.get('codTrabajador').disable();
    //console.log(this.data.eltipo.length);
    if (this.data.eltipo == '002') {
      this.formulario.get('horainicio')?.setValue('07:00')
      this.formulario.get('horafinal')?.setValue('17:15')
    } else if (this.data.eltipo == '001' || this.data.eltipo == '003') {
      //console.log('aca estoy');
      this.formulario.patchValue({
        horainicio: '',
        horafinal: ''
      })
      console.log(this.formulario.value);
    }
  }

  quitarTrabajadores() {
    this.mostrar = false;
    this.seleccionados = [];
    this.formulario.get('codTrabajador').enable();
  }

  pasarDato() {

    let val1 = this.formulario.get('codTrabajador')?.value
    console.log(val1)

    let datval1 = val1.split('-')
    console.log(datval1)

    //let valor=this.formulario.get('codTrabajador')?.value

    let valor = datval1[1]
    console.log(valor)


    let contar = this.listar_operacionConductor.length
    for (let index = 0; index < contar; index++) {
      const element = this.listar_operacionConductor[index];
      if (element.Codigo == valor) {

        // console.log(element)
        this.formulario.get('desTrabajador')?.setValue(element.Nombre)
        this.formulario.get('desTrabajador').disable();


        console.log(this.data.eltipo)
        switch (this.data.eltipo) {
          case '001':

            this.formulario.get('horainicio')?.setValue('')
            this.formulario.get('horafinal')?.setValue('')

            break;
          case '002':
            this.formulario.get('horainicio')?.setValue('')
            console.log(new Date())
            this.RegistroPermisosService.horariosTrabajadores('001', element.Tipo, element.Codigo, '07/09/2022', 'F').subscribe(
              (result: any) => {
                let valor = JSON.stringify(result[0]).split(':')
                try {
                  let hora = valor[1].replace('"', '')
                  let minutos = valor[2].replace('"}', '')
                  if (hora != '' && minutos != '') {
                    this.formulario.get('horafinal')?.setValue(hora + ':' + minutos)
                  } else {
                    this.formulario.get('horafinal')?.setValue('00' + ':' + '00')
                  }
                } catch (error) {
                  this.formulario.get('horafinal')?.setValue('00' + ':' + '00')
                }

              },
              (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
            break;
          case '003':
            this.RegistroPermisosService.horariosTrabajadores('001', element.Tipo, element.Codigo, '07/09/2022', 'I').subscribe(
              (result: any) => {
                let valor = JSON.stringify(result[0]).split(':')
                let hora = valor[1].replace('"', '');
                let minutos = valor[2].replace('"}', '');
                this.formulario.get('horainicio')?.setValue(hora + ':' + minutos)
                console.log(hora + ':' + minutos)
              },
              (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
            this.formulario.get('horafinal')?.setValue('')

            break;

          default:
            break;
        }
      }
    }
    //this.formulario.get('desTrabajador')?.setValue(a)
  }
  changeFin($event) {
    var hora = $event.target.value;
    if (hora.length == 5) {
      let horainicio = this.formulario.get('horainicio')?.value
      let horafinal = this.formulario.get('horafinal')?.value

      var hora1 = (horainicio).split(":"),
        hora2 = (horafinal).split(":"),
        t1 = new Date(),
        t2 = new Date();

      t1.setHours(hora2[0], hora2[1], 0);
      t2.setHours(hora1[0], hora1[1], 0);

      //Aquí hago la resta
      t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());

      //Imprimo el resultado
      var horas = "La diferencia es de: " + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");

      console.log(horas);
      console.log(this.data.eltipo);

      console.log(t1.getHours());

      if (this.data.eltipo != '002') {
        if (t1.getHours() >= 8 && t1.getMinutes() >= 0) {
          this.formulario.patchValue({
            horafinal: ''
          });
          this.matSnackBar.open('El permiso no puede ser mayor a 8 horas', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {

        }
      }


    } else {

    }

  }

  changeSubArea(event) {
    console.log(event);
    this.listar_operacionConductor = this.listar_operacionConductor2;
    if (event.value == 'TODOS') {
      this.listar_operacionConductor = this.listar_operacionConductor2;
    } else {
      this.listar_operacionConductor = this.listar_operacionConductor.filter((element: any) => {
        return element.Rh_cod_Area === event.value;
      });
    }
  }

  changeTimeIni(event) {
    console.log(event.target.value);
  }
  Seleccionados(event) {
    console.log(event);
    this.seleccionados = event;
    if (this.data.eltipo == '002') {
      this.RegistroPermisosService.horarioTrabajador(event[0].Tipo, event[0].Codigo, this.data.fecha.toLocaleDateString())
        .subscribe((res: any) => {
          if(res.length > 0){
            this.formulario.get('horainicio')?.setValue(res[0].Hora_Ini);
            this.formulario.get('horafinal')?.setValue(res[0].Hora_Fin);
          } else{
            this.formulario.get('horainicio')?.setValue('07:00');
            this.formulario.get('horafinal')?.setValue('17:15');
          }
        });

    } else if (this.data.eltipo == '001' || this.data.eltipo == '003') {
      this.formulario.patchValue({
        horainicio: '',
        horafinal: ''
      })
    }

  }

  guardar() {

    let val1 = this.formulario.get('codTrabajador')?.value

    let desTrabajador = this.formulario.get('desTrabajador')?.value
    let horainicio = this.formulario.get('horainicio')?.value
    let horafinal = this.formulario.get('horafinal')?.value

    console.log(horainicio + horafinal)

    if (horainicio == '' && horafinal == '') {
      this.matSnackBar.open("Error: Debe Ingresar un Horario Valido", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

    }
    if (horainicio == '00:00' && horafinal == '00:00') {
      this.matSnackBar.open("Error: Debe Ingresar un Horario Valido", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    if ((horainicio != '00:00' && horafinal != '00:00') && (horainicio != '' && horafinal != '')) {

      this.seleccionados.forEach(element => {
        GlobalVariable.Arr_Trabajadores.push({ tipo: element.Tipo, position: element.Codigo, name: element.Nombre, weight: horainicio, symbol: horafinal, Cod_Empresa: element.Cod_Empresa })
      });

      console.log(GlobalVariable.Arr_Trabajadores);
      this.dialog.closeAll();

    }

  }

  changeHoraInicio(event) {
    if (this.data.eltipo != '003') {
      var fecha = _moment(new Date());
      var valor = this.formulario.get('horainicio').value;
      valor = valor + ':00';
      const endTime = _moment(valor, 'HH:mm:ss').add(60, 'minutes').format('HH:mm');
      const printTime = _moment(valor, 'HH:mm:ss').format('HH:mm');

      const str = new Date().toLocaleString('en-Es', { year: 'numeric', month: '2-digit', day: '2-digit' });
      var dia = str.substring(3, 5);
      var mes = str.substring(0, 2);
      var anio = str.substring(6, 10);
      var totaldia = anio + '/' + mes + '/' + dia;
      var nuevaFecha = new Date(totaldia + ' ' + printTime)
      console.log(nuevaFecha);
      var fecha_validar = _moment(nuevaFecha);
      const diferencia = _moment.duration(fecha_validar.diff(fecha));
      var minutos = (diferencia.asMinutes());

      console.log(minutos);

      if (minutos < -30) {
        this.matSnackBar.open("Error: Debe Ingresar una hora a futuro.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.formulario.get('horainicio')?.setValue('')
      } else {

      }
    }

  }

  CargarTrabajadores() {
    var usuario = GlobalVariable.vusu;
    this.RegistroPermisosService.listarTrabajadores(usuario).subscribe(
      (result: any) => {
        this.listar_operacionConductor = result;

        this.listar_operacionConductor2 = result;
        console.log(this.listar_operacionConductor);
        this.cargarSubAreas();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  cargarSubAreas() {
    var usuario = GlobalVariable.vusu;
    this.RegistroPermisosService.Rh_Mostrar_Areas_Permiso_Web(usuario).subscribe(
      (result: any) => {
        this.subAreas = result
        console.log(this.subAreas);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }




}

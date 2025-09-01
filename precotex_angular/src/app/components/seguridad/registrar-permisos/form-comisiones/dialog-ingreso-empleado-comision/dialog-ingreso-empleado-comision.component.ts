import { Component, OnInit,ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl,Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import * as _moment from 'moment';

interface trabajadores {
  Tipo: string,
  Codigo: string,
  Nombre: string,
}

interface data {
  eltipo: string
}


@Component({
  selector: 'app-dialog-ingreso-empleado-comision',
  templateUrl: './dialog-ingreso-empleado-comision.component.html',
  styleUrls: ['./dialog-ingreso-empleado-comision.component.scss']
})
export class DialogIngresoEmpleadoComisionComponent implements OnInit {
  listar_operacionConductor:  trabajadores[] = [];
  num_guiaMascara = [/[0-2]/, /\d/,':',/[0-5]/, /\d/];
  seleccionados:Array<any> = [];
  searchable = true;
  constructor(private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private RegistroPermisosService: RegistroPermisosService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }

  formulario = this.formBuilder.group({codTrabajador: [''],desTrabajador: [''],horainicio: ['00:00',Validators.required],horafinal: ['00:00',Validators.required]})

  ngOnInit(): void {
    if(screen.height < 740){
      this.searchable = false;
    }
    this.CargarTrabajadores()
  }

  changeHoraInicio(event){

    var fecha =  _moment(new Date());
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

    // if(minutos < -30){
    //   this.matSnackBar.open("Error: Debe Ingresar una hora a futuro.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    //   this.formulario.get('horainicio')?.setValue('')
    // }else{
      
    // }
  }

  pasarDato() {

    let val1=this.formulario.get('codTrabajador')?.value
    console.log(val1)

    let datval1=val1.split('-')
    console.log(datval1)

    //let valor=this.formulario.get('codTrabajador')?.value

    let valor=datval1[1]
    console.log(valor)

    let contar=this.listar_operacionConductor.length






    for (let index = 0; index < contar; index++) {
      const element = this.listar_operacionConductor[index];
      if(element.Codigo==valor) {
        console.log(element)
        this.formulario.get('desTrabajador')?.setValue(element.Nombre)
        this.formulario.get('desTrabajador').disable();

        console.log(this.data.eltipo)

        switch (this.data.eltipo) {
          case '005':

              this.formulario.get('horainicio')?.setValue('00:00')
              this.formulario.get('horafinal')?.setValue('00:00')

            break;
              case '006':
                this.formulario.get('horainicio')?.setValue('')
                    console.log(new Date())
                    this.RegistroPermisosService.horariosTrabajadores('001',element.Tipo,element.Codigo,'07/09/2022','F').subscribe(
                      (result: any) => {
                        let valor=JSON.stringify(result[0]).split(':')
                        let hora=valor[1].replace('"', '')
                        let minutos=valor[2].replace('"}', '')
                        this.formulario.get('horafinal')?.setValue(hora+':'+minutos)
                        console.log(hora+':'+minutos)
                      },
                      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
              break;
        }

      }
    }
    //this.formulario.get('desTrabajador')?.setValue(a)
  }


  Seleccionados(event) {
    console.log(event);
    this.seleccionados = event;
    this.formulario.get('horainicio')?.setValue('')
    this.formulario.get('horafinal')?.setValue('17:15')
  }

  guardar(){

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

  CargarTrabajadores() {
    var usuario = GlobalVariable.vusu;
    this.RegistroPermisosService.listarTrabajadores(usuario).subscribe(
      (result: any) => {
        this.listar_operacionConductor = result
        console.log(this.listar_operacionConductor);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

}

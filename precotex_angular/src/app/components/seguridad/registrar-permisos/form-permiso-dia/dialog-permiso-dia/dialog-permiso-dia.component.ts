import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

interface trabajadores {
  Tipo: string,
  Codigo: string,
  Nombre: string,
}

interface data {
  eltipo: string
}

@Component({
  selector: 'app-dialog-permiso-dia',
  templateUrl: './dialog-permiso-dia.component.html',
  styleUrls: ['./dialog-permiso-dia.component.scss']
})
export class DialogPermisoDiaComponent implements OnInit {
  sCod_Usuario = GlobalVariable.vusu
  mostrar = false;
  listar_operacionConductor: trabajadores[] = [];
  seleccionados:Array<any> = [];
  searchable = true;
  num_guiaMascara = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private RegistroPermisosService: RegistroPermisosService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({ codTrabajador: [''], desTrabajador: [''], horainicio: ['00:00', Validators.required], horafinal: ['00:00', Validators.required] })

  ngOnInit(): void {
    
    if(screen.height < 740){
      this.searchable = false;
    }
    this.CargarTrabajadores()
  }

  agregarTrabajadores(){
    this.seleccionados = this.listar_operacionConductor;
    this.mostrar = true;
    this.formulario.get('codTrabajador').disable();
    console.log(this.data.eltipo);
    if(this.data.eltipo == '002'){
      this.formulario.get('horainicio')?.setValue('07:00')
      this.formulario.get('horafinal')?.setValue('17:15')
    }else{
      this.formulario.get('horainicio')?.setValue('07:00')
      this.formulario.get('horafinal')?.setValue('')
    }
  }

  quitarTrabajadores(){
    this.mostrar = false;
    this.seleccionados = [];
    this.formulario.get('codTrabajador').enable();
  }

  pasarDato() {

  }
  Seleccionados(event) {
    console.log(event);
    this.seleccionados = event;
    this.formulario.get('horainicio')?.setValue('13:30')
    this.formulario.get('horafinal')?.setValue('14:30')
  }
  guardar() {

    let val1 = this.formulario.get('codTrabajador')?.value

    let desTrabajador = this.formulario.get('desTrabajador')?.value
    let horainicio = this.formulario.get('horainicio')?.value
    let horafinal = this.formulario.get('horafinal')?.value

    console.log(horainicio + horafinal)


      this.seleccionados.forEach(element => {
        GlobalVariable.Arr_Trabajadores.push({ tipo: element.Tipo, position: element.Codigo, name: element.Nombre, weight: horainicio, symbol: horafinal, Cod_Empresa: element.Cod_Empresa })
      });
     
      console.log(GlobalVariable.Arr_Trabajadores);
      this.dialog.closeAll();

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

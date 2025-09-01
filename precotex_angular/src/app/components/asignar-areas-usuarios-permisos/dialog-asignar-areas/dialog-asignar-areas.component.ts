import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';

interface data {
  boton: string,
  title: string,
  Opcion: string,
  Datos: any;
}

@Component({
  selector: 'app-dialog-asignar-areas',
  templateUrl: './dialog-asignar-areas.component.html',
  styleUrls: ['./dialog-asignar-areas.component.scss']
})
export class DialogAsignarAreasComponent implements OnInit {

  ItemsTipoPermisos: any[] = [
    {id:'T', name:'CREAR Y APROBAR PERMISOS'},
    {id:'C', name:'SOLO CREAR PERMISOS'}
  ]

  formulario = this.formBuilder.group({
    Cod_Trabajador: ['', Validators.required],
    Tip_Trabajador: ['', Validators.required],
    Cod_Fabrica: ['001', Validators.required],
    Cod_Empresa: ['', Validators.required],
    RH_Cod_Area: ['', Validators.required],
    Tipo: ['T', Validators.required],
  });

  dataTrabajador: Array<any> = [];
  dataAreas: Array<any> = [];
  dataUsuarios: Array<any> = [];
  mostrarUsuarios: boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogAsignarAreasComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private usuariosService: RegistroPermisosService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }

  ngOnInit(): void {
    console.log(this.data.Datos);
    this.getUsuarios();
    if (this.data.Opcion == 'U') {
      
      this.formulario.patchValue({
        Cod_Trabajador: this.data.Datos.Cod_Trabajador,
        Tip_Trabajador: this.data.Datos.Tip_Trabajador,
        Cod_Fabrica: this.data.Datos.Cod_Fabrica,
        Cod_Empresa: this.data.Datos.Cod_Empresa,
        RH_Cod_Area: this.data.Datos.RH_Cod_Area,
        Tipo: (this.data.Datos.Tipo.trim() == 'SOLO CREAR PERMISOS') ? 'C':'T'
      });
      let datos = [{
        Cod_Trabajador: this.data.Datos.Cod_Trabajador,
        Nombre_Trabajador: this.data.Datos.Nombre_Trabajador,
        Tip_Trabajador: this.data.Datos.Tip_Trabajador
      }];
      this.dataTrabajador = datos;

      let event = {
        value: this.data.Datos.Cod_Empresa
      };

      this.selectEmpresa(event);
    }
  }
  setAll(checked) {
    console.log(checked);
    this.mostrarUsuarios = checked;
  }
  obtenerSeleccionado(event) {
    console.log(event);
    if (event != undefined) {
      this.formulario.patchValue({
        Cod_Trabajador: event.Cod_Trabajador,
        Tip_Trabajador: event.Tip_Trabajador
      });

      let datos = {
        Nombre_Trabajador: event.Nom_usuario
      }
      this.dataTrabajador.push(datos);
    }
  }

  guardarAreaPermiso() {
    var Opcion = this.data.Opcion;
    var Cod_Fabrica = this.formulario.get('Cod_Fabrica')?.value;
    var Tip_Trabajador = this.formulario.get('Tip_Trabajador')?.value;
    var Cod_Empresa = this.formulario.get('Cod_Empresa')?.value;
    var Cod_Trabajador = this.formulario.get('Cod_Trabajador')?.value;
    var RH_Cod_Area = this.formulario.get('RH_Cod_Area')?.value;
    if (this.dataTrabajador.length > 0) {
      this.usuariosService.insertaAreasPorUsuario(Opcion, Cod_Fabrica, Tip_Trabajador, Cod_Trabajador, Cod_Empresa, RH_Cod_Area, this.formulario.get('Tipo')?.value).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            console.log(result);
            this.matSnackBar.open("Se inserto el registro correctamente..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
            this.dialogRef.close();
          }
          else if (result[0].Respuesta == 'FALSE') {
            this.matSnackBar.open("El registro ya estaba registrado..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
            this.dialogRef.close();
          } else {
            this.matSnackBar.open("Ha ocurrido un error al registrar el área..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3500,
        })
      )
    } else {
      this.matSnackBar.open("Debes realizar la búsqueda de un trabajador..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    }
  }


  getUsuarios() {
    this.usuariosService.mantenimientoUsuariosService(
      ""
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          this.dataUsuarios = result;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  buscarTrabajadorPermiso() {
    if (this.formulario.get('Cod_Trabajador')?.value != '' && this.formulario.get('Tip_Trabajador')?.value != '') {
      this.usuariosService.muestraTrabajadorporCodigo(this.formulario.get('Cod_Trabajador')?.value, this.formulario.get('Tip_Trabajador')?.value).subscribe(
        (result: any) => {
          if (result.length > 0) {
            console.log(result);
            this.dataTrabajador = result;
          }
          else {
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataTrabajador = [];
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      )
    } else {
      this.matSnackBar.open("Debes ingresar el Cód. Trabajador y el Tipo de Trabajador a Buscar..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  selectEmpresa(event) {
    console.log(event.value);
    this.usuariosService.muestraAreasPorEmpresa(event.value).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          this.dataAreas = result;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataTrabajador = [];
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    )
  }
}

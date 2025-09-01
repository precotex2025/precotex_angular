import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActasAcuerdosService } from 'src/app/services/actas-acuerdos.service';
import { ControlActivoFijoService } from 'src/app/services/control-activo-fijo.service';
import { SeguridadUsuariosService } from 'src/app/services/seguridad-usuarios.service';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data {
  data: any

}
@Component({
  selector: 'app-dialog-agregar-descripcion',
  templateUrl: './dialog-agregar-descripcion.component.html',
  styleUrls: ['./dialog-agregar-descripcion.component.scss']
})
export class DialogAgregarDescripcionComponent implements OnInit {
  formulario = this.formBuilder.group({
    IdDescripcion: [0,],
    Descripcion: ['', Validators.required],
    Cod_Categoria: ['', Validators.required]
  })

  dataUsuario: Array<any> = [];
  ClaseActivos: Array<any> = [];
  usuario: any = "";
  existeCo: boolean = true;

  Empresa: string = "";

  tipo: any;
  cabecera = '';
  boton = '';

  Cod_Accion = ""
  Cod_Item_Cab = 0
  Cod_Empresa = 0
  Planta = ""
  Piso = 0
  Cod_CenCost = ""
  Nom_Area = ""
  Nom_Responsable = ""
  Nom_Usuario = ""
  Ubicacion = ""
  Cod_Activo = ""
  Clase_Activo = 0

  constructor(public dialogRef: MatDialogRef<DialogAgregarDescripcionComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private controlActivoFijoService: ControlActivoFijoService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }

  ngOnInit(): void {
    console.log(this.data.data);
    this.CargarOperacionClase();
    this.tipo = this.data.data.tipo;
    this.cabecera = this.data.data.cabecera;
    this.boton = this.data.data.boton;

    if (this.tipo == 2) {
      this.formulario.patchValue({
     
      })
    }

  }
  CargarOperacionClase() {
    this.Cod_Accion = "C"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = ""
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.ClaseActivos = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }
  onEmpresaChange(event) {

  }

  guardarInformacion() {
    this.controlActivoFijoService.getDescripcionActivos('I', '', this.formulario.get('Descripcion').value, this.formulario.get('Cod_Categoria').value
    ).subscribe(
      (result: any) => {
        
        if(result[0].Respuesta == 'OK'){
          this.matSnackBar.open('Se registro correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          this.dialogRef.close();
        }
      },
      (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    })
  }


}
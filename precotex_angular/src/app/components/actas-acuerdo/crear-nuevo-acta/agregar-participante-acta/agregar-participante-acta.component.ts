import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActasAcuerdosService } from 'src/app/services/actas-acuerdos.service';
import { SeguridadUsuariosService } from 'src/app/services/seguridad-usuarios.service';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data {
  data: any

}
@Component({
  selector: 'app-agregar-participante-acta',
  templateUrl: './agregar-participante-acta.component.html',
  styleUrls: ['./agregar-participante-acta.component.scss']
})
export class AgregarParticipanteActaComponent implements OnInit {
  formulario = this.formBuilder.group({
    IdParticipante: [0,],
    Apellidos: ['', Validators.required],
    Nombres: ['', Validators.required],
    Correo: ['', Validators.required],
    Celular: ['', Validators.required],
    Cargo: ['', Validators.required],
    Firma: ['',]
  })

  dataUsuario: Array<any> = [];
  usuario: any = "";
  existeCo: boolean = true;

  Empresa: string = "";

  tipo: any;
  cabecera = '';
  boton = '';
  constructor(public dialogRef: MatDialogRef<AgregarParticipanteActaComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private actasAcuerdosService: ActasAcuerdosService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }

  ngOnInit(): void {
    console.log(this.data.data);
    this.tipo = this.data.data.tipo;
    this.cabecera = this.data.data.cabecera;
    this.boton = this.data.data.boton;

    if (this.tipo == 2) {
      this.formulario.patchValue({
        IdParticipante: this.data.data.data.IdParticipante,
        Apellidos: this.data.data.data.Apellidos,
        Nombres: this.data.data.data.Nombre,
        Correo: this.data.data.data.Correo,
        Celular: this.data.data.data.Telefono,
        Cargo: this.data.data.data.Cargo
      })
    }

  }

  onEmpresaChange(event) {

  }

  guardarInformacion() {
    console.log(this.formulario);
    if (this.formulario.valid) {
      var msje = '';
      var opcion = '';
      if (this.tipo == 1) {
        msje = 'Se registro el participante correctamente';
        opcion = 'I';
      } else {
        msje = 'Se actualizo el participante correctamente';
        opcion = 'U';
      }

      let IdParticipante = this.formulario.get('IdParticipante')?.value;
      let Apellidos = this.formulario.get('Apellidos')?.value;
      let Nombres = this.formulario.get('Nombres')?.value;
      let Correo = this.formulario.get('Correo')?.value;
      let Celular = this.formulario.get('Celular')?.value;
      let Cargo = this.formulario.get('Cargo')?.value;
      let Firma = this.formulario.get('Firma')?.value;

      this.actasAcuerdosService.InsertarParticipanteService(opcion, IdParticipante, Nombres, Apellidos, Celular, Correo, Firma, Cargo).subscribe(res => {
        if (res[0].Respuesta == 'OK') {
          this.matSnackBar.open(msje, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
          this.dialogRef.close();
        } else {
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
        }
      }, (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
      })
    }
  }


}

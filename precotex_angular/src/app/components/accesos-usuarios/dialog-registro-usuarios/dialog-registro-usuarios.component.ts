import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadUsuariosService } from 'src/app/services/seguridad-usuarios.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogSelectUsuarioComponent } from '../dialog-select-usuario/dialog-select-usuario.component';

interface data {
  Cod_Usuario:      string, 
  Nom_usuario:         string,
  Tip_Trabajador:            string,
  Cod_Trabajador:  string,
  Empresa: string,
  Flg_Activo:   string,
  Fecha_Registro:         string,

}
@Component({
  selector: 'app-dialog-registro-usuarios',
  templateUrl: './dialog-registro-usuarios.component.html',
  styleUrls: ['./dialog-registro-usuarios.component.scss']
})
export class DialogRegistroUsuariosComponent implements OnInit {


  formulario = this.formBuilder.group({
    Apellidos:   ['', Validators.required],
    Nombres:   ['', Validators.required],
    Password:   ['', Validators.required],
    Estado:   ['1', Validators.required],
    Cod_Trabajador: ['', Validators.required],
    Tip_Trabajador: ['', Validators.required],
    Cod_Usuario: ['' , Validators.required],
    Nombres_Trabajador: ['', Validators.required],
  })

  dataUsuario:Array<any> = [];
  usuario:any = "";
  existeCo:boolean = true;

  Empresa:string = "";
  constructor(public dialogRef: MatDialogRef<DialogRegistroUsuariosComponent>,
    private formBuilder: FormBuilder,
       private matSnackBar: MatSnackBar, 
       public dialog: MatDialog,
       private seguridadService: SeguridadUsuariosService,
       @Inject(MAT_DIALOG_DATA) public data: data) { }

  ngOnInit(): void {
  }

  onEmpresaChange(event){
    console.log(event.value);
    this.seguridadService.verUsuariosBd(event.value).subscribe(res => {
      
      if(res != null){
        let dialogRef = this.dialog.open(DialogSelectUsuarioComponent, {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            usuarios: res
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          
          console.log(result);
          if(result != undefined){
            this.formulario.reset();
            var empresa = "";
            if(event.value == '07'){
              empresa = 'ASISTENCIA';
            }else if(event.value == '56'){
              empresa = 'VYD';
            }else if(event.value == '77'){
              empresa = 'DBSABOR_CRIOLLO';
            }else if(event.value == '78'){
              empresa = 'DBKAPRA';
            }
              let Cod_Trabajador= result.Cod_Trabajador;
              let Tip_Trabajador = result.Tip_Trabajador;
              let Cod_Empresa = empresa;
              this.Empresa = empresa;
              this.seguridadService.seg_obtener_cod_usuario(Cod_Trabajador, Tip_Trabajador, Cod_Empresa).subscribe( (res:any) => {
                
                this.dataUsuario = res;
                if(this.dataUsuario.length == 0){
                  this.existeCo = false;
                }else{
                  this.existeCo = true;
                }

                this.formulario.patchValue({
                  Apellidos: result.Apellidos,
                  Nombres: result.Nombre_Trabajador,
                  Cod_Trabajador: result.Cod_Trabajador,
                  Tip_Trabajador: result.Tip_Trabajador,
                  Password: res[0].Password,
                  Cod_Usuario: this.dataUsuario.length > 0 ? this.dataUsuario[0].Cod_Usuario : "",
                  Nombres_Trabajador: result.Nombre_Trabajador
                });
              },(err: HttpErrorResponse) => {

              })

          }
        })
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  guardarInformacion(){
    console.log(this.formulario);
    if (this.formulario.valid) {
      let Cod_Usuario = this.formulario.get('Cod_Usuario')?.value;
      let Nom_usuario = this.formulario.get('Apellidos')?.value + " " + this.formulario.get('Nombres')?.value; 
      let Password = this.formulario.get('Password')?.value;
      let Tip_Trabajador = this.formulario.get('Tip_Trabajador')?.value;
      let Cod_Trabajador = this.formulario.get('Cod_Trabajador')?.value;
      let Empresa = this.Empresa;
      let Flg_Activo = this.formulario.get('Estado')?.value;
      let Cod_Usuario_Reg = GlobalVariable.vusu;

      this.seguridadService.seg_insertar_usuario_Web(Cod_Usuario, Nom_usuario, Password, Tip_Trabajador, Cod_Trabajador, Empresa, Flg_Activo, Cod_Usuario_Reg).subscribe( res => {
        if(res[0].status == 1){
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
          this.dialogRef.close();
        }else{
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
        }
      }, (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
      })
    }
  }

  validarCodUsuario(event){
    console.log(event.target.value);
    if(event != undefined){
      if(event.target.value != ''){
        this.seguridadService.validarCodUsuariosBd(event.target.value).subscribe( (res:any) => {
          console.log(res);
          if(res.length == 0){
            
          }else{
            this.formulario.patchValue({
              Cod_Usuario: ""
            })
            this.matSnackBar.open("El código de usuario ingresado ya existe en la Base de Datos..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
          }
        }, (err: HttpErrorResponse) => {

        })
      }
    }
    
  }

}

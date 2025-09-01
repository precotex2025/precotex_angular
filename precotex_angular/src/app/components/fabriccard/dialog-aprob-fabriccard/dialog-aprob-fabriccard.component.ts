import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AprofabriccardService } from 'src/app/services/aprofabriccard.service';
import { GlobalVariable } from '../../../VarGlobals';



//import { ConsoleReporter } from 'jasmine';


interface data {
  boton: string,
  title: string,
  Opcion: string,
  Datos: any;
}



@Component({
  selector: 'app-dialog-aprob-fabriccard',
  templateUrl: './dialog-aprob-fabriccard.component.html',
  styleUrls: ['./dialog-aprob-fabriccard.component.scss']
})
export class DialogAprobFabriccardComponent implements OnInit {

  onFileChange(event: any): void {
    this.file = event.target.files[0];
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
     
      reader.onload = () => {
        this.RutaFoto = reader.result as string;
    
      };
    
    }

}

  RutaFoto='';
  pesoacabado    = ''
  pesolavado    = ''
  kilospartida    = ''
  sAccion = ''
  NumFab=''
  Cod_OrdTra=''
  Secuencia=''
  Comentarios=''
  Aprob=''
  Color=''
  Tela=''
  Cliente=''


  formulario = this.formBuilder.group({
    pesoacabado:  [''],
    pesolavado:   [''],
    kilospartida: [''],
    comentarios:  ['-'],
    ope: [''],
    
  });

  file: any;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private aprofabriccardservice : AprofabriccardService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogAprobFabriccardComponent>,  ) { }

  ngOnInit(): void {

    this.formulario.get('pesoacabado').disable();
    this.formulario.get('pesolavado').disable();
    this.formulario.get('kilospartida').disable();
    
    this.formulario.get('kilospartida')?.setValue(this.data.Datos.PARTIDA_KGS_ASIGNADOS)
    this.formulario.get('pesoacabado')?.setValue(this.data.Datos.PESO_ACABADO)
    this.formulario.get('pesolavado')?.setValue(this.data.Datos.PESO_LAVADO)

    this.file = "";
    console.log(this.data.Datos.NUM_FABRIC_CARD)
    console.log(this.data.Datos.COD_ORDTRA)
    console.log(this.data.Datos.SEC)
    console.log(this.data.Datos.CLIENTE)

    this.NumFab=this.data.Datos.NUM_FABRIC_CARD
    this.Cod_OrdTra=this.data.Datos.COD_ORDTRA
    this.Secuencia=this.data.Datos.SEC
    this.Cliente=this.data.Datos.CLIENTE

    this.pesoacabado=this.data.Datos.PESO_ACABADO
    this.pesolavado=this.data.Datos.PESO_LAVADO

    this.Color=this.data.Datos.COLOR
    this.Tela=this.data.Datos.TELA

    if (this.data.Opcion == 'U') {
      this.formulario.patchValue({
        NumFab: this.data.Datos.NUM_FABRIC_CARD
        
      });

  }
}

Limpiar() {
  this.formulario.reset()
  
  this.NumFab = '';
  this.Cod_OrdTra = '';
  this.Secuencia = '';
  this.file = '';


  // const formData = new FormData();
  //     formData.append('Num_Fabric', "");
  //     formData.append('Comentarios', "");
  //     formData.append('Partida', "");
  //     formData.append('Secuencia', "");
  //     formData.append('Foto', "");
  //     formData.append('Flg_Ad', "");
  
}



  Aprobar() {

    console.log(this.formulario.get('ope')?.value)
    this.sAccion = 'U'

    if (this.formulario.get('comentarios')?.value == '') 
    {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else 
    {
      this.spinnerService.show();
      const formData = new FormData();
      formData.append('Num_Fabric', this.NumFab);
      formData.append('Comentarios', this.formulario.get('comentarios')?.value);
      formData.append('Partida', this.Cod_OrdTra);
      formData.append('Secuencia', this.Secuencia);
      formData.append('Foto', this.file);
      formData.append('Cod_Usuario', GlobalVariable.vusu);
      formData.append('Flg_Ad', this.formulario.get('ope')?.value);
      formData.append('Color', this.Color);
      formData.append('Tela', this.Tela);
      formData.append('Cliente', this.Cliente);

      this.aprofabriccardservice.GuardarServiceCopia(
        formData).subscribe(

          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.spinnerService.hide();
              this.file = null;
              this.matSnackBar.open('Proceso Correcto Aprobado!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.Limpiar()
              this.dialogRef.close();
            }
            else {
              this.spinnerService.hide();
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.spinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

          })

    }
  }


  Rechazar() {

    console.log(this.formulario.get('ope')?.value)
    this.sAccion = 'U'

    if (this.formulario.get('comentarios')?.value == '') 
    {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else 
    {
      this.spinnerService.show();
      const formData = new FormData();
      formData.append('Num_Fabric', this.NumFab);
      formData.append('Comentarios', this.formulario.get('comentarios')?.value);
      formData.append('Partida', this.Cod_OrdTra);
      formData.append('Secuencia', this.Secuencia);
      formData.append('Foto', this.file);
      formData.append('Cod_Usuario', GlobalVariable.vusu);
      formData.append('Flg_Ad', "X");
      formData.append('Color', this.Color);
      formData.append('Tela', this.Tela);
      formData.append('Cliente', this.Cliente);

      this.aprofabriccardservice.GuardarServiceCopia(
        formData).subscribe(

          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.spinnerService.hide();
              this.file = null;
              this.matSnackBar.open('Proceso Correcto Rechazado!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.Limpiar()
              this.dialogRef.close();
            }
            else {
              this.spinnerService.hide();
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.spinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

          })

    }
  }



  listes: any[] = [
    { name: "Aprobado", cod: "A" },
    { name: "Aprob. c/observaciones", cod: "O" },
    { name: "Aprob. c/concesión cliente", cod: "Q" },];





  
}
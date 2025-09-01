import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EncuestasComedorService } from 'src/app/services/comedor/encuestas-comedor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JabasCochesService } from 'src/app/services/jabas/jabas-coches.service';
import { DialogAddUbicacionComponent } from './dialog-add-ubicacion/dialog-add-ubicacion.component';



interface data {
  datos: any,
  tipo: number,
}


@Component({
  selector: 'app-dialog-jabas-coches',
  templateUrl: './dialog-jabas-coches.component.html',
  styleUrls: ['./dialog-jabas-coches.component.scss']
})
export class DialogJabasCochesComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu
  listar_cabeceras = [];
  dataEstados = [];
  dataUbicaciones = [];
  EstadoOK = "";
  Estado2RL= "";
  Estado2RT= "";
  EstadoG= "";
  EstadoOUT= "";
  EstadoRL= "";
  EstadoRO= "";
  EstadoRT= "";
  Id_Detalle: number = 0;
  switchNoOk: boolean = false;
  switchSiOk: boolean = false;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private comedorService: EncuestasComedorService,
    private SpinnerService: NgxSpinnerService,
    private jabasCocheService: JabasCochesService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({
    Codigo: ['', Validators.required], Codigo_Barra: ['', Validators.required], Ubicacion: ['', Validators.required],
    Fecha_Compra: ['', Validators.required], Observacion: ['', ], Nro_Hoja: ['', Validators.required],
    Tipo: ['', Validators.required],// Cod_Usuario: ['', Validators.required]
    EstadoOK: [false],
    Estado2RL: [false],
    Estado2RT: [false],
    EstadoG: [false],
    EstadoOUT: [false],
    EstadoRL: [false],
    EstadoRO: [false],
    EstadoRT: [false]
  })

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.tipo == 2) { 
      this.formulario.patchValue({
        Codigo: this.data.datos.Codigo,
        Codigo_Barra: this.data.datos.Codigo_Barra,
        Ubicacion: this.data.datos.Ubicacion,
        Estado: this.data.datos.Estado,
        Fecha_Compra: this.data.datos.Fecha_Compra,
        Observacion: this.data.datos.Observacion,
        Nro_Hoja: this.data.datos.Nro_Hoja,
        Tipo: this.data.datos.Tipo.trim(),
        Cod_Usuario: this.data.datos.Cod_Usuario,
        EstadoOK:  (this.data.datos.OK.trim() === "OK") ? true : false, 
        Estado2RL:  (this.data.datos['2RL'].trim() === "2RL") ? true : false,
        Estado2RT: (this.data.datos['2RT'].trim() === "2RT") ? true : false, 
        EstadoG: (this.data.datos.G.trim() === "G") ? true : false,
        EstadoOUT: (this.data.datos.OUT.trim() === "OUT") ? true : false,
        EstadoRL:(this.data.datos.RL.trim() === "RL") ? true : false,
        EstadoRO:(this.data.datos.RO.trim()=== "RO") ? true : false ,
        EstadoRT:(this.data.datos.RT.trim() === "RT") ? true : false      
      });

      if(this.data.datos.OK.trim() === "OK"){
        this.onNoSonOK()
      }else{
        this.onSiOK();
      }

      let event = {
        value: this.data.datos.Tipo
      };
      this.onTipoChange(event);

    }
    this.CargarEstados();
    this.CargarUbicaciones();

    this.formulario.get('EstadoOK').valueChanges.subscribe(value => {
      if (value === true) {
        this.formulario.patchValue({
          Estado2RL: false,
          Estado2RT: false,
          EstadoG: false,
          EstadoOUT: false,
          EstadoRL: false,
          EstadoRO: false,
          EstadoRT: false
        });
      }
    });

    this.formulario.get('Estado2RL').valueChanges.subscribe(value => {
      if (value === true) {this.formulario.patchValue({EstadoOK: false});}
    });

    this.formulario.get('Estado2RT').valueChanges.subscribe(value => {
      if (value === true) {this.formulario.patchValue({EstadoOK: false});}
    });

    this.formulario.get('EstadoG').valueChanges.subscribe(value => {
      if (value === true) {this.formulario.patchValue({EstadoOK: false});}
    });
    this.formulario.get('EstadoOUT').valueChanges.subscribe(value => {
      if (value === true) {this.formulario.patchValue({EstadoOK: false});}
    });
    this.formulario.get('EstadoRL').valueChanges.subscribe(value => {
      if (value === true) {this.formulario.patchValue({EstadoOK: false});}
    });
    this.formulario.get('EstadoRO').valueChanges.subscribe(value => {
      if (value === true) {this.formulario.patchValue({EstadoOK: false});}
    });
    this.formulario.get('EstadoRT').valueChanges.subscribe(value => {
      if (value === true) {this.formulario.patchValue({EstadoOK: false});}
    });

    console.log(this.Id_Detalle);
  }

  asignacionEstado(){
    this.EstadoOK="";
    this.Estado2RL="";
    this.Estado2RT="";
    this.EstadoG="";
    this.EstadoOUT="";
    this.EstadoRL="";
    this.EstadoRO="";
    this.EstadoRT=""

    if(this.formulario.get('EstadoOK').value==true){this.EstadoOK="OK";}
    if(this.formulario.get('Estado2RL').value==true){this.Estado2RL="2RL";}
    if(this.formulario.get('Estado2RT').value==true){this.Estado2RT="2RT";}
    if(this.formulario.get('EstadoG').value==true){this.EstadoG="G";}
    if(this.formulario.get('EstadoOUT').value==true){this.EstadoOUT="OUT";}
    if(this.formulario.get('EstadoRL').value==true){this.EstadoRL="RL";}
    if(this.formulario.get('EstadoRO').value==true){this.EstadoRO="RO";}
    if(this.formulario.get('EstadoRT').value==true){this.EstadoRT="RT";}
}

  guardar() {
    if (this.formulario.valid) {
 
 
      this.asignacionEstado();
      if (this.data.tipo == 1) {
        this.SpinnerService.show();
        this.jabasCocheService.ManteJabasCoches(
          'I',
          this.formulario.get('Codigo').value,
          this.formulario.get('Codigo_Barra').value,
          this.formulario.get('Ubicacion').value,
          this.formulario.get('Fecha_Compra').value,
          this.formulario.get('Observacion').value,
          this.formulario.get('Nro_Hoja').value,
          this.formulario.get('Tipo').value,
          GlobalVariable.vusu,
          this.EstadoOK.trim(),
          this.Estado2RL.trim(),
          this.Estado2RT.trim(),
          this.EstadoG.trim(),
          this.EstadoOUT.trim(),
          this.EstadoRL.trim(),
          this.EstadoRO.trim(),
          this.EstadoRT.trim()  
        ).subscribe(
          (result: any) => {
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open('Se realizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dialog.closeAll();
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })
      } else {
        this.SpinnerService.show();


 
        /*console.log('llegasta aqui')
        console.log(this.formulario.get('Codigo').value)
        console.log(this.formulario.get('Ubicacion').value)
        console.log(this.formulario.get('Observacion').value)
        console.log(this.formulario.get('Tipo').value)
        console.log(GlobalVariable.vusu)
        this.SpinnerService.hide();*/

       
        this.jabasCocheService.ManteJabasCoches(
          'U',
          this.formulario.get('Codigo').value,
          this.formulario.get('Codigo_Barra').value,
          this.formulario.get('Ubicacion').value,
          this.formulario.get('Fecha_Compra').value,
          this.formulario.get('Observacion').value,
          this.formulario.get('Nro_Hoja').value,
          this.formulario.get('Tipo').value,
          GlobalVariable.vusu,
          this.EstadoOK.trim(),
          this.Estado2RL.trim(),
          this.Estado2RT.trim(),
          this.EstadoG.trim(),
          this.EstadoOUT.trim(),
          this.EstadoRL.trim(),
          this.EstadoRO.trim(),
          this.EstadoRT.trim()
        ).subscribe(
          (result: any) => {
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open('Se actualizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dialog.closeAll();
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })




          
      }
 
    } else {
      this.matSnackBar.open('Debe ingresar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }

  }

  openDialogTipos() {
    let dialogRef = this.dialog.open(DialogAddUbicacionComponent, {
      disableClose: false,
      //minWidth: '600px',
      panelClass: 'my-class',
      minWidth: '600px',
      maxWidth: '95%',
      data: {
        tipo: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result); 
        if(result == undefined) {
          this.CargarUbicaciones();
        }
        
    })
  }

  CargarEstados() {

    this.jabasCocheService.ManteJabasCoches(
      'E',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataEstados = result;
        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  CargarUbicaciones() {

    this.jabasCocheService.ManteJabasCoches(
      'G',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataUbicaciones = result;
        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  onTipoChange(event){
    console.log(event.value);
  }

  onNoSonOK(){
    
    if( this.formulario.get('EstadoOK').value==true){
          this.switchNoOk = false; 
          console.log("OK");
        }
  }

  onSiOK(){
    if( this.formulario.get('Estado2RL').value==true ||
        this.formulario.get('Estado2RT').value==true ||
        this.formulario.get('EstadoG').value==true ||
        this.formulario.get('EstadoOUT').value==true ||
        this.formulario.get('EstadoRL').value==true ||
        this.formulario.get('EstadoRO').value==true ||
        this.formulario.get('EstadoRT').value==true){
          this.switchSiOk = false;
          console.log("No Ok");
        } 
       
  }
}
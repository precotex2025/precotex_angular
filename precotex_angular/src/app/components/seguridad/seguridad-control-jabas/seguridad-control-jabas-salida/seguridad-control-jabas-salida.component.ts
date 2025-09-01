import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SeguridadControlJabaService } from '../../../../services/seguridad-control-jaba.service';
import { MatDialog } from '@angular/material/dialog';

import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogJabaComponent } from '../dialog-jaba/dialog-jaba.component';


interface Listar_Guia {
  num_guia: string;
  cod_proveedor: string, 
  num_planta_destino: number, 
  destino: string;
  num_bulto: number;
  num_cantidad: number;
  num_peso: number;
  cod_despachado: string;
  nom_despachado: string;
  glosa: string; 
}

interface Jabas {
  tipo: string; 
  hora: string;
  vehiculo: string;
}


 
 
@Component({
  selector: 'app-seguridad-control-jabas-salida',
  templateUrl: './seguridad-control-jabas-salida.component.html',
  styleUrls: ['./seguridad-control-jabas-salida.component.scss']
})
export class SeguridadControlJabasSalidaComponent implements OnInit, AfterViewInit {
 
  nNum_Planta = GlobalVariable.num_planta;
  cod_accion = 'S'
  des_planta = ''
  sCod_Barras = ''
  sCod_Jaba = ''
  sDescripcionJaba = ''
  data: any = [];
  Ndata: any = [];
  destino_select = ''
  cantidad = 0
  guia = '' 
  matDialogRespuesta = ''
  Codigo_Registro = 0
  sAccion = ''

  

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    destino: [''],
    jaba: [''],
    glosa: [''],
    num_guia: [''],
    num_planta_destino: [0],
    cod_proveedor: [''],
  })

 
  listar_guias: Listar_Guia[] = [];

  displayedColumns_cab: string[] = ['tipo', 'hora', 'vehiculo', 'detalle']

  dataSource: MatTableDataSource<Jabas>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, public dialog: MatDialog, private segurdadControlJabaService: SeguridadControlJabaService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild('jaba') inputJaba!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };
  }

  ngOnInit(): void {
    this.MostrarTitulo(); 
    this.ListarGuia();
    this.formulario.controls['jaba'].disable();

    this.ListarPendientes()
  
    
   
 
  }

  ListarPendientes(){
    this.segurdadControlJabaService.VerificarGuiasPendientesControlJabas(this.nNum_Planta, this.cod_accion).subscribe(
      (resp: any) => {
        console.log(resp[0].Respuesta);
       if(resp[0].Respuesta == 'OK'){

        let dialogRef =  this.dialog.open(DialogJabaComponent, { disableClose: false, data:{accion: this.cod_accion} });
        dialogRef.afterClosed().subscribe(result =>{
        console.log(result);
        });
       }
       
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  ListarGuia() {
    this.segurdadControlJabaService.ListarGuiaSalidaService(GlobalVariable.num_planta).subscribe(
      (result: any) => {
        console.log(result)
        this.listar_guias = result;

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  DatosGuia() {
    let guia_select = this.listar_guias.find(elemento => elemento.num_guia == this.formulario.get('num_guia')?.value)
    this.formulario.controls['jaba'].enable();
    this.formulario.controls['jaba'].setValue('');
    this.formulario.patchValue({ cod_proveedor: guia_select?.cod_proveedor })
    this.formulario.patchValue({ num_planta_destino: guia_select?.num_planta_destino })
    this.formulario.patchValue({ destino: guia_select?.destino })
    this.destino_select = this.formulario.get('destino')?.value
    this.guia = this.formulario.get('num_guia')?.value



    this.segurdadControlJabaService.CargarRegistroControlSalidaByGuia(GlobalVariable.num_planta, this.guia, this.cod_accion).subscribe(
      (resp: any) => {
        if (resp.length > 0) {
          this.Codigo_Registro = resp[0].Datos
          this.dataSource.data = [];

            //console.log(this.matDialogRespuesta)
         
              for (let obj of resp) {
                this.add(obj.Cod_Jaba, obj.Cod_Barras, obj.Des_Jaba);
                console.log(this.dataSource.data)
              }
              this.matSnackBar.open('Los datos se cargaron correctamente!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        }

        else {
          this.dataSource.data = [];

        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }



  /* NuevaJaba(cod: String, cod_ba: String, des: String): Jabas {
 
     return {
       tipo: cod.toString(),
       hora: cod_ba.toString(),
       vehiculo: des.toString()
     }
   }
 
   jabaExists(name: String) {
     return this.dataSource.data.some(function(el) {
       return el.hora === name;
     }); 
   }
 
   add(cod: String, cod_ba: String, des: String) {
     if(this.dataSource.data.length == 0){
     this.dataSource.data.push(this.NuevaJaba(cod, cod_ba, des));
     this.dataSource.filter = ""
     this.ReproducirOk();
     this.Limpiar();
     }else if(this.jabaExists(cod_ba) == false) {
       this.dataSource.data.push(this.NuevaJaba(cod, cod_ba, des));
     this.dataSource.filter = "";
     this.ReproducirOk();
     this.Limpiar();
     }
     else {
       this.ReproducirError();
       //alert("Jaba repetida");
     }
 
   }*/

  NuevaJaba(cod: String, cod_ba: String, des: String): Jabas {

    return {
      tipo: cod.toString(),
      hora: cod_ba.toString(),
      vehiculo: des.toString()
    }
  }


  add(cod: String, cod_ba: String, des: String) {

    this.dataSource.data.push(this.NuevaJaba(cod, cod_ba, des));
    this.dataSource.filter = "";


  }

  MostrarTitulo() {
    if (GlobalVariable.num_planta === 1) {
      this.des_planta = 'Santa Maria'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'Santa Cecilia'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'Huachipa Sede I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'Huachipa Sede II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'Independencia'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'Independencia II'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'Huachipa Sede III'
    } else {
      this.des_planta = ''
    }
  }




  BuscarJaba() {
    this.sCod_Barras = this.formulario.get('jaba')?.value

    if (this.sCod_Barras.length <= 8 || this.sCod_Barras.length >= 10) {

    } else {
      this.segurdadControlJabaService.traerInfoJabaService(this.nNum_Planta, this.sCod_Barras, this.formulario.get('num_guia')?.value,this.cod_accion).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {


            this.Codigo_Registro = result[0].Codigo;
            this.sCod_Jaba = result[0].Cod_Jaba;
            this.sDescripcionJaba = result[0].Descripcion;
            console.log(result);
            console.log(this.Codigo_Registro)
            console.log(this.sCod_Jaba)
            console.log(this.sDescripcionJaba)
            if (this.dataSource.data.length > 0) {

              console.log('INSERT DE JABAS')
              console.log(this.Codigo_Registro)
              this.sAccion = 'I'
              this.Guardar(this.sAccion,
                this.Codigo_Registro,
                this.nNum_Planta,
                this.cod_accion,
                this.formulario.get('num_guia')?.value,
                this.formulario.get('num_planta_destino')?.value,
                this.nNum_Planta,
                this.sCod_Barras,
                this.formulario.get('glosa')?.value,
                this.sCod_Jaba,
                this.sDescripcionJaba,
                this.formulario.get('cod_proveedor')?.value
              )


            }
            else {
              this.Codigo_Registro = 0;
              this.sAccion = 'I'
              console.log('INSERT DE NUEVO REGISTRO')
              console.log(this.Codigo_Registro)
              this.Guardar(this.sAccion,
                this.Codigo_Registro,
                this.nNum_Planta,
                this.cod_accion,
                this.formulario.get('num_guia')?.value,
                this.formulario.get('num_planta_destino')?.value,
                this.nNum_Planta,
                this.sCod_Barras,
                this.formulario.get('glosa')?.value,
                this.sCod_Jaba,
                this.sDescripcionJaba,
                this.formulario.get('cod_proveedor')?.value
              )
            }

          } else {

            // this.formulario.controls['conductor'].setValue('');
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }

  }


  Guardar(sAccion: string, nCod_reg: number, nNum_P: number, sCod_Acc: string, nNum_Gui: string, nNum_Planta_Destino: number, nNum_po: number, sBarras: string, sGlosa: string, nCod_Jaba: string, sDescrijab: string, sCod_Proveedor:string) {


    this.segurdadControlJabaService.GuardarService(sAccion, nCod_reg, nNum_P, sCod_Acc, nNum_Gui, nNum_Planta_Destino, nNum_po, sBarras, sGlosa, sCod_Proveedor).subscribe(

      (result: any) => {

        console.log(result);
        if (result[0].Respuesta == 'OK' && result[0].Resp == null) {


 
          //this.matSnackBar.open('Se creo un registro asociado a esta guia !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.add(nCod_Jaba, sBarras, sDescrijab);
          this.Limpiar()


 
        }
        else if (result[0].Respuesta == 'OK' && result[0].Resp == 'L') {
          this.dataSource.data = [];
          this.Limpiar()
        }
        else if (result[0].Respuesta == 'OK' && result[0].Resp == 'D') {

          this.matSnackBar.open('Jaba eliminada correctamente!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        }

        else if (result[0].Respuesta == 'OK' && result[0].Resp == 'R') {

          this.matSnackBar.open('Los datos se registraron correctamente!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.dataSource.data = [];
          this.formulario.controls['num_guia'].setValue('');
          this.formulario.controls['glosa'].setValue('');
          this.destino_select = '';
          this.Limpiar()
          this.formulario.controls['jaba'].disable();
          
        }

        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }


      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }



  InsertarJabasDetalle(nCod_Registro: number, sDescrijab: string, sBarras: string) {

    console.log(nCod_Registro)

    console.log(sDescrijab)
    console.log(sBarras)



    this.segurdadControlJabaService.InsertarJabasDetalleService(nCod_Registro, sBarras).subscribe(

      (result: any) => {
        if (result[0].Respuesta == 'OK') {

          this.ReproducirOk()
          this.add(result[0].Codigo, sBarras, sDescrijab);
          this.Limpiar()


        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


  }



  ReproducirError() {
    const audio = new Audio('assets/error.mp3');
    audio.play();
  }

  ReproducirOk() {
    const audio = new Audio('assets/aceptado.mp3');
    audio.play();
  }

  EliminarRegistroTableDinamica(index: number) {

    let barras = this.dataSource.data[index].hora;
    this.sAccion = 'D'
    this.Codigo_Registro


    

    //this.data.splice(index, 1);
    //this.updateDataSource();



    this.Guardar(this.sAccion,
      this.Codigo_Registro,
      this.nNum_Planta,
      this.cod_accion,
      this.formulario.get('num_guia')?.value,
      this.formulario.get('num_planta_destino')?.value,
      this.nNum_Planta,
      barras,
      this.formulario.get('glosa')?.value,
      this.sCod_Jaba,
      this.sDescripcionJaba,
      this.formulario.get('cod_proveedor')?.value
    )

    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;


  }

  updateDataSource() {
    this.dataSource.data = this.data;
  }


  Limpiar() {
    this.formulario.controls['jaba'].setValue('');

  }

  Procesar(){
    this.sAccion = 'R'
    this.Codigo_Registro


    this.Guardar(this.sAccion,
      this.Codigo_Registro,
      this.nNum_Planta,
      this.cod_accion,
      this.formulario.get('num_guia')?.value,
      this.formulario.get('num_planta_destino')?.value,
      this.nNum_Planta,
      this.sDescripcionJaba,
      this.formulario.get('glosa')?.value,
      this.sCod_Jaba,
      this.sDescripcionJaba,
      this.formulario.get('cod_proveedor')?.value)
  }


  openDialog() {
    //let dialogRef =  this.dialog.open(DialogJabaComponent, { disableClose: true });
    this.dialog.open(DialogJabaComponent, { disableClose: true });
    // dialogRef.afterClosed().subscribe(result =>{

    // });
  }

}





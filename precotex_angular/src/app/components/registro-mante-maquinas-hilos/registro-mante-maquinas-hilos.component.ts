import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { DialogEliminarComponent } from '../dialogs/dialog-eliminar/dialog-eliminar.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';
import { GlobalVariable } from '../../VarGlobals'; //<==== this one
import { TiemposImproductivosService } from '../../services/tiempos-improductivos.service';
import { DialogMantMaquiHiComponent } from './dialog-mant-maqui-hi/dialog-mant-maqui-hi.component';
import { DialogModificaMantMaquiHiComponent } from './dialog-modifica-mant-maqui-hi/dialog-modifica-mant-maqui-hi.component';
import { startWith, map,debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ToastrService } from 'ngx-toastr';


interface maquinas {
  Codigo: string,
  Descripcion: string,
}


interface TAREA {
  Cod_Tarea: string,
  Nombre_Tarea: string,
}

interface OT {
  Cod_TipOrdTra: string,
  OT: string,
}




interface data_det 
{
        Accion: string,
        Num_Mante: string,
        Fec_Registro: string,
        Fec_Registro2: string,
        Cod_Maquina: string,
        Nro_DocIde: string,
        Cod_Tarea: string,
        Fec_Hora_Inicio: string,
        Fec_Hora_Fin: string,
        Minutos:string,
        Observacion: string,
        Cod_Usuario: string,
        Cod_OrdTra:string,
        Estado:string,

        Cod_Area:string,
				Nom_Area:string,
				Cod_Cond:string,
				Nom_Condicion:string,
				Cod_Espe:string,
				Nom_Espe:string,
				Cod_ParMaq:string,
				Nom_ParMaq:string,
				Cod_TipFal:string,
				Nom_TipFal:string,
				Cod_Articulo:string,
				Desc_Articulo:string,
				Min_Max:string,
        Turno:string,
}



@Component({
  selector: 'app-registro-mante-maquinas-hilos',
  templateUrl: './registro-mante-maquinas-hilos.component.html',
  styleUrls: ['./registro-mante-maquinas-hilos.component.scss']
})
export class RegistroManteMaquinasHilosComponent implements OnInit {

  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];

  listar_operacionMaquina:  maquinas[] = [];
  listar_operacionOt:    OT [] = [];
  listar_operacionTarea:    TAREA [] = [];

  

  filtroOperacionMaquina:   Observable<maquinas[]> | undefined;
  filtroOperacionOt:        Observable<OT []> | undefined;
  filtroOperacionTarea:     Observable<TAREA []> | undefined;
  
    range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  public data_det = [{
    Nro_Tarea_Mante:"",
    Nombre_Tarea:"",
    Trabajador:"",
    Fec_Hora_Inicio:"",
    Fec_Hora_Fin:"",
    Cod_Ordtra:"",
    Cod_Tarea:"",
    Fec_Registro:"",
    Fec_Registro2:"",
    Minutos:"",
    Cod_OrdTra:""
    
  }]

  Cod_TipOrdTra="";
  Cod_Tarea="";
  Fec_Registro="";
  Fec_Registro2="";
  Observacion="";
  Cod_Maquina=""
  Nombre_Tarea="";
  
  //Nuevo Cambio
  gl_NumPlanta = 0;
  btnDeshabilita: boolean = false; // Cambia a true para deshabilitar el botón



  formulario = this.formBuilder.group({
    fec_registro: [new Date()],
    fec_registro2: [new Date()],
    Cod_Ordtra: [''],
    sOt: [''],
    Cod_Maquina:[''],
    sTarea: [''],
    
  })

  dataForExcel = [];

        // Cod_Area:string,
				// Nom_Area:string,
				// Cod_Cond:string,
				// Nom_Condicion:string,
				// Cod_Espe:string,
				// Nom_Espe:string,
				// Cod_ParMaq:string,
				// Nom_ParMaq:string,
				// Cod_TipFal:string,
				// Nom_TipFal:string,
				// Cod_Articulo:string,
				// Desc_Articulo:string,
				// Min_Max:string,


  displayedColumns_cab: string[] = 
  [
    'Acciones',
    'Num_Mante',
    'Fec_Registro',
    'Cod_Tarea',
    'Nom_Area',
    'Nom_Condicion',
    'Nom_Espe',
    'Nom_ParMaq',
    'Nom_TipFal',
    'Desc_Articulo',
    'Min_Max',
    'Nombre_Tarea_Mante',
    'Cod_Maquina',
    'NombreMaquina',
    'Dni',
    'Trabajador',
    'Fec_Hora_Inicio',
    'Fec_Hora_Fin',
    'Minutos',
    'OT_',
    'Turno',
    'Atribuido',
    'Observacion',
    'Observacion2',
    'Des_Planta',
    'Estado'
  ]


  dataSource: MatTableDataSource<data_det>;

  constructor( private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private registromantemaquinastej: RegistroManteMaquinasTejService,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService,
    private despachoTelaCrudaService: TiemposImproductivosService,
    private toastr                  : ToastrService               ,) 
    { 
      this.dataSource = new MatTableDataSource();
    }

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // this.formulario = new FormGroup({
    //   'Fec_Registro': new FormControl(''),
    //   'Cod_Maquina': new FormControl(''),
    // });

    GlobalVariable.num_movdespacho = '';
    //this.CargarMaquinas();
    //this.CargarOts();
    this.ObtieneSedeByUser();
    //this.CargarTareas(); //comentado por hmedina porque no hace ningun efecto
    //this.CargarLista();  //comantado por hmedina porque no es su lugar


    //this.formulario.get('sTarea')?.setValue("1 ")
  }

  ObtieneSedeByUser(){

    this.SpinnerService.show();
    this.registromantemaquinastej.getListaUsuarioSedeByUser().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.gl_NumPlanta = response.elements[0].num_Planta;
            this.CargarLista();
            this.SpinnerService.hide();
          }
          else{
            //Deshabilita los botones
            this.btnDeshabilita = true;
            this.toastr.warning("Usuario sin configuración de SEDE.", 'Cerrar', {
            timeOut: 2500,
             });            
             this.SpinnerService.hide();
          }
        }        
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });

  }

  pasarfecha() {
    this.Fec_Registro=this.formulario.get('fec_registro')?.value;
    this.formulario.get('fec_registro').setValue(this.Fec_Registro);
    //this.formulario.get('fec_registro').disable();
  }


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

  CargarLista() {
    let fec_despacho = this.formulario.value['fec_registro'];
    fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');

    this.registromantemaquinastej.listadoDatosServiceSede("LA","","","","","", String(this.gl_NumPlanta)).subscribe(
        (result: any) => {
          this.dataSource.data = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

  /* se reemplazo con la funcion Buscar de abajo
  Buscar() {
    let fec_despacho = this.formulario.value['fec_registro'];
    //fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');
    fec_despacho = moment(fec_despacho).format('DD-MM-YYYY' );
    let fec_despacho2 = this.formulario.value['fec_registro2'];
    //fec_despacho2 = moment(fec_despacho2).format('YYYY-MM-DDTHH:mm:ss');
    fec_despacho2 = moment(fec_despacho2).format('DD-MM-YYYY');

    this.registromantemaquinastej.listadoDatosService("LC",
           fec_despacho, fec_despacho2 ,this.formulario.get('Cod_Maquina')?.value,this.formulario.get('sOt')?.value,this.formulario.get('sTarea')?.value ).subscribe(
           (result: any) => {
          //this.data_det = result
          this.dataSource.data = result
          //console.log(this.data_det);
          console.log(this.dataSource.data);
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }
  */

  Buscar() {
    let fec_despacho = this.formulario.value['fec_registro'];
    //fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');
    fec_despacho = moment(fec_despacho).format('DD-MM-YYYY' );
    let fec_despacho2 = this.formulario.value['fec_registro2'];
    //fec_despacho2 = moment(fec_despacho2).format('YYYY-MM-DDTHH:mm:ss');
    fec_despacho2 = moment(fec_despacho2).format('DD-MM-YYYY');

    this.registromantemaquinastej.listadoDatosServiceSede("LC",
           fec_despacho, fec_despacho2 ,this.formulario.get('Cod_Maquina')?.value,this.formulario.get('sOt')?.value,this.formulario.get('sTarea')?.value, String(this.gl_NumPlanta)).subscribe(
           (result: any) => {
          //this.data_det = result
          this.dataSource.data = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }




  openDialog() {

    let fec_despacho = this.formulario.value['Fec_Registro'];
    fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');

      //let dialogRef = this.dialog.open(DialogMantMaquiHiComponent, {
        let dialogRef = this.dialog.open(DialogModificaMantMaquiHiComponent, {
        disableClose: true,
        panelClass: 'my-class',
        data: {
              sFec_Registro: fec_despacho,
              cod_maquina: this.formulario.get('Cod_Maquina')?.value
              },
              minWidth: '46vh'
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result == 'false') {
          this.CargarLista()
        // this.MostrarCabeceraVehiculo()
        }
        this.CargarLista()

      })

    }

openDialogModificar
 (
    Opcion: string,
    Num_Mante: string,
    Fec_Registro: string,
    Cod_Maquina: string,
    Cod_Tarea: string,
    finicio: string,
    ffin: string,
    Ot: string,
    observacion: string,
    Dni: string,
    Estado: string,
    Cod_Area: string,
    Cod_Cond: string,
    Cod_Espe: string,
    Cod_ParMaq: string,
    Cod_TipFal: string,
    Cod_Articulo: string,
    Min_Max: string,
    Flg_Atribuido: string,
    Observacion2: string,
    Num_Planta: string
 ) 
    {

      if (Opcion =="MODIFICAR")
      {
            
        //console.log("Fec-inicio es: "+moment(finicio).format('DD/MM/YYYY'))

            let dialogRef = this.dialog.open(DialogModificaMantMaquiHiComponent, 
              {
                disableClose: true,
                panelClass: 'my-class',
                data: 
                {
                  
                  sFec_Registro:Fec_Registro, 
                  cod_maquina: Cod_Maquina, 
                  Cod_Tarea: Cod_Tarea, 
                  finicio: finicio, 
                  ffin: ffin, 
                  Cod_OrdTra:Ot, 
                  Observacion:observacion, 
                  Dni: Dni,
                  Opcion: 'MODIFICAR',
                  sNum_Mante : Num_Mante,
                  Estado: Estado,
                  Cod_Area: Cod_Area,
                  Cod_Cond: Cod_Cond,
                  Cod_Espe: Cod_Espe,
                  Cod_ParMaq: Cod_ParMaq,
                  Cod_TipFal: Cod_TipFal,
                  Cod_Articulo: Cod_Articulo,
                  Min_Max : Min_Max,
                  finicio2: moment(finicio).format('DD/MM/YYYY'),

                  //Campos Nuevos
                  Num_Planta: Num_Planta,//this.gl_NumPlanta, //Nuevo parametro Planta.     
                  Flg_Atribuido: Flg_Atribuido,
                  Observacion2: Observacion2
                },
                  minWidth: '46vh'
              });
      
          dialogRef.afterClosed().subscribe(result => {
            this.CargarLista()
              if (result == 'false') {
                
              }
            })

    }
    else
    {

            let fec_despacho = this.formulario.value['Fec_Registro'];
            //fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');
            fec_despacho = moment(fec_despacho).format('DD/MM/YYYY');

              //let dialogRef = this.dialog.open(DialogMantMaquiHiComponent, {
                let dialogRef = this.dialog.open(DialogModificaMantMaquiHiComponent, {
                disableClose: true,
                panelClass: 'my-class',
                data: {
                      sFec_Registro: fec_despacho,
                      cod_maquina: this.formulario.get('Cod_Maquina')?.value,
                      Opcion: 'NUEVO',
                      sNum_Mante : "",
                      Num_Planta: this.gl_NumPlanta, //Nuevo parametro Planta.
                      },
                      minWidth: '46vh'
              });

              dialogRef.afterClosed().subscribe(result => {

                if (result == 'false') {
                  this.CargarLista()
                  // this.MostrarCabeceraVehiculo()
                }
                this.CargarLista()

              })

            }


   }






  CargarMaquinas() {
    this.despachoTelaCrudaService.mantenimientoConductorService().subscribe(
      (result: any) => {
        this.listar_operacionMaquina = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  CargarOts(){
    this.registromantemaquinastej.listadoDatosService("LO","","","","","").subscribe(
      (result: any) => {
        this.listar_operacionOt = result
        this.RecargarOperacionOt()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  RecargarOperacionOt(){
    this.filtroOperacionOt = this.formulario.controls['sOt'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionOt(option) : this.listar_operacionOt.slice())),
    );
  }




  private _filterOperacionOt(value: string): OT[] {
    if (value == null || value == undefined ) {
      value = ''
      
    }
    const filterValue = value.toLowerCase();
    return this.listar_operacionOt.filter(option => option.OT.toLowerCase().includes(filterValue));
  }

  CambiarValorOt(Cod_TipOrdTra: string, OT: string){
    this.Cod_TipOrdTra = Cod_TipOrdTra
  }


  CargarTareas(){
    this.registromantemaquinastej.listadoDatosService("LT","","","","", "").subscribe(
      (result: any) => {
        this.listar_operacionTarea = result
        //this.RecargarOperacionTareas()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  RecargarOperacionTareas(){
    this.filtroOperacionTarea = this.formulario.controls['sTarea'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionTarea(option) : this.listar_operacionTarea.slice())),
    );
    
  }


  private _filterOperacionTarea(value: string): TAREA[] {
    if (value == null || value == undefined ) {
      value = ''
      
    }
    const filterValue = value.toLowerCase();
    return this.listar_operacionTarea.filter(option => option.Nombre_Tarea.toLowerCase().includes(filterValue));
  }

  CambiarValorTarea(Cod_Tarea: string, Nombre_Tarea: string){
    this.Nombre_Tarea = Nombre_Tarea
  }
  
  


  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


  




  EliminarRegistro(Fec_Registro: string, Cod_Maquina: string, Cod_Tarea: string,finicio: string, ffin: string,dni: string, Cod_OrdTra) {
    if(confirm("Desea Eliminar este registro?")) {
      this.registromantemaquinastej.eliminarTareaMaquinaTej(
        Fec_Registro,
        Cod_Maquina,
        Cod_Tarea,
        finicio,
        ffin,
        dni, 
        Cod_OrdTra
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            //this.MostrarCabeceraConductor()
            this.CargarLista()
            this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 1500,
            })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }
  }



  generateExcel() {   

    this.SpinnerService.show();
    let fec_despacho = this.formulario.value['fec_registro'];
    fec_despacho = moment(fec_despacho).format('DD/MM/YYYY');

    let fec_despacho2 = this.formulario.value['fec_registro2'];
    fec_despacho2 = moment(fec_despacho2).format('DD/MM/YYYY');
    
    // if(this.formulario.get('Cod_Maquina')?.value == ''){
    //   this.Cod_Maquina = ''
    // }

    // this.Cod_Maquina = this.formulario.get('Cod_Maquina')?.value
    // this.Cod_TipOrdTra = this.formulario.get('sOt')?.value
    // this.Cod_Tarea = this.formulario.get('sTarea')?.value
    // this.Fec_Registro = this.formulario.get('fec_registro')?.value


    this.registromantemaquinastej.ListarReporteDetalladoSede(
      fec_despacho,fec_despacho2, String(this.gl_NumPlanta)
      ).subscribe(
        (result: any) => {
        if(result[0].Respuesta){
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.SpinnerService.hide();
          
        }else{
          this.dataForExcel = [];
          result.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row)) 
          })
      
          let reportData = {
            title: 'REPORTE DE MANTENIMIENTO DE MAQUINAS',
            data: this.dataForExcel,
            headers: Object.keys(result[0])
          }
      
          this.exceljsService.exportExcel(reportData);
          this.dataForExcel = []
          this.SpinnerService.hide();
        }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))


  
  }






}

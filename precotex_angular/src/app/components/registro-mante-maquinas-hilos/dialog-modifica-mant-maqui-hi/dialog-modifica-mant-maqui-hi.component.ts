import { Component, OnInit, ViewChild,ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';

import { FormBuilder } from '@angular/forms';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
//import { DialogTiemposImproductivosComponent } from '../tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { startWith, map,Observable } from 'rxjs';
import { DialogTiemposImproductivosService } from '../../../services/dialog-tiempos-improductivos.service';
import { GlobalVariable } from '../../../VarGlobals'; //<==== this one
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';
import { Console } from 'console';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { equal } from 'assert';


interface maquinas {
  Codigo: string,
  Descripcion: string,
}

interface TAREA {
  Cod_Tarea: string,
  Nombre_Tarea: string,
  Flg_ValidaMaquina: string
}

interface OT {
  Cod_TipOrdTra: string,
  OT: string,
}

interface especialidad {
  Cod_Espe: string,
  Nomb_Espec: string,
}

interface area {
  Cod_Area_Tej_Mante_Maq: string,
  Nomb_Area_Tej_Mante_Maq: string,
}

interface condicion {
  Cod_Tej_Cond: string,
  Desc_Tej_Cond: string,
}

interface tipo_falla {
  Cod_Tarea: string,
  Cod_TipFall: string,
  Desc_TipFall: string,
}

interface articulo {
  Cod_Articulo: string,
  Desc_Articulo: string,
}

interface paro_maquina {
  Cod_ParMaq_Tej: string,
  Desc_ParMaq_Tej: string,
}

interface tipo_atribuido {
  Cod_TipAtr: string,
  Desc_TipAtr: string,
}

interface data{
  sFec_Registro: string
  cod_maquina: string
  Cod_Tarea: string
  finicio: string
  ffin: string
  Observacion: string
  Titulo: string
  Cod_OrdTra:string
  Dni:string
  Opcion:string
  sNum_Mante: string
  Estado : string
  Cod_Area : string
  Cod_Cond : string
  Cod_Espe : string
  Cod_ParMaq : string
  Cod_TipFal : string
  Cod_Articulo : string
  Min_Max : string
  finicio2: string
  //Campos Nuevos
  Num_Planta: Number
  Flg_Atribuido: string
  Observacion2: string
}

@Component({
  selector: 'app-dialog-modifica-mant-maqui-hi',
  templateUrl: './dialog-modifica-mant-maqui-hi.component.html',
  styleUrls: ['./dialog-modifica-mant-maqui-hi.component.scss']
})



export class DialogModificaMantMaquiHiComponent implements OnInit {

  num_guiaMascara = [/[0-2]/, /\d/,':',/[0-5]/, /\d/];
  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];


  datefecreg = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  isShown=false; // hidden by default 

  listar_operacionMaquina:  maquinas[] = [];
  listar_operacionOt:    OT [] = [];
  listar_operacionTarea:    TAREA [] = [];

  filtroOperacionMaquina:   Observable<maquinas[]> | undefined;
  filtroOperacionOt:        Observable<OT []> | undefined;
  filtroOperacionTarea:     Observable<TAREA []> | undefined;

  listar_especialidad:  especialidad[] = [];
  listar_area:  area[] = [];
  listar_condicion:  condicion[] = [];
  listar_tipo_falla:  tipo_falla[] = [];
  listar_articulo:  articulo[] = [];
  listar_paro_maquina:  paro_maquina[] = [];
  listar_tipo_atribuido: tipo_atribuido[] = [];
  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  Cod_Accion    = ''
  Fec_Registro  = ''
  Cod_Maquina   = ''
  cod_tarea   = ''
  hini          = ''
  hfin          = ''
  Observacion = ''
  Titulo        = ''
  Fec_Fin       = ''
  Fec_Inicio    = ''
  dni_tejedor   = ''
  Cod_OrdTra    =''

  
  Cod_TipOrdTra="";
  xNum_Mante = "";


  Cod_Tarea="";
  Cod_Espe = "";
  Cod_Articulo="";
  Cod_Area_Tej_Mante_Maq = "";
  Cod_Tej_Cond = "";
  Cod_ParMaq_Tej="";
  Cod_TipFall = "";

  //Campos Nuevos
  Observacion2  = "";
  Flg_Atribuido = "";
  Num_Planta    = "";




  Flg_ValidaMaquina = "1";

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
                Cod_Maquina: [''],
                Cod_Tarea: [''],
                Cod_OrdTra: [''],
                hini: ['00:00'],
                hfin: ['00:00'],
                Fec_Registro: [new Date()],
                Fec_Inicio: [new Date()],
                Fec_Fin: [new Date()],
                Observacion:[''],
                dnitejedor:[''],
                nomtejedor:[''],
                sOt: [''],
                sTarea: [''],
                ct_Especialidad: [''],
                ct_Area: [''],
                ct_Condicion: [''],
                ct_Articulo: [''],
                ct_MinMax: [''],
                ct_Paromaquina: [''],
                ct_Tipo_Falla:[''],
                ct_Tipo_Atribuido:[''],
                Observacion2:[''],
                filtro:[''],
})

mostrarCtrolOtrasSedes: boolean = false; // Esta variable controlará la visibilidad

selectedTipoFalla: any;
filtro: string = '';
tipoFallaFiltrada: any[] = []; // Lista filtrada

  constructor( private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private despachoTelaCrudaService: DialogTiemposImproductivosService,  
    private registromantemaquinastej: RegistroManteMaquinasTejService,
    private datePipe: DatePipe,
    private toastr                  : ToastrService               ,
     @Inject(MAT_DIALOG_DATA) public data: data)
      { 
      //this.dataSource = new MatTableDataSource();
      }

    @ViewChild('dnitejedor',{ static: false }) dnitejedor: ElementRef;

  ngOnInit(): void 
  {

    //ACtivamos los controles si no es planta 4
    if (Number(this.data.Num_Planta) !== 4){
      //Aqui ocultamos los controles de
      this.mostrarCtrolOtrasSedes = true;
      this.formulario.get('ct_Articulo')?.disable();
    }

    this.mostrarTejedor();
    //this.CargarMaquinas();
    this.CargarOts();
    //this.CargarTareas(); //Comentado por que la tareas dependen de un Area hmedina - 24/04/2025
    //this.CargarEspecialidad();
    this.CargarArea();
    this.CargarCondicion();
    this.CargarParoMaquina();
    this.CargarTipoAtribuido();

    GlobalVariable.num_movdespacho = '';
   
    //Agregado por HMEDINA - 11/03/2025
    this.formulario.get('ct_Especialidad').disable(); 
    this.formulario.get('Fec_Registro')?.setValue(this.data.sFec_Registro)
    this.formulario.get('Fec_Registro').disable();
    this.formulario.get('nomtejedor').disable();

    var actual = new Date();
    var hora = _moment(actual.valueOf()).format('HH:mm');
    var weight = hora.split(':')
    this.formulario.get('Fec_Inicio').disable();
    this.formulario.get('hini').setValue(weight[0]+':'+weight[1]);
    this.formulario.get('hini').disable();
    this.formulario.get('dnitejedor').disable();
    this.formulario.get('ct_MinMax').disable();



    if (this.data.Opcion == 'MODIFICAR')
    {
      this.CargarMaquinas(this.data.Cod_Area);
      this.CargarTareasSedes(this.data.Cod_Area);
      this.CompletarDatosModificarRegistro();
    }


    //INHABILITAR CONTROL SI ESTA CERRADO
    if (this.data.Estado == "C")
    {
      //console.log("Estado: "+this.data.Estado )
      this.formulario.get('Fec_Fin').disable();
      this.formulario.get('hfin').disable();
    }

  }

  

  CargarTipoAtribuido(){
    this.listar_tipo_atribuido = [
      { Cod_TipAtr: 'P', Desc_TipAtr: 'PRODUCCION' },
      { Cod_TipAtr: 'M', Desc_TipAtr: 'MANTENIMIENTO' },
      { Cod_TipAtr: 'S', Desc_TipAtr: 'SISTEMAS' }
    ];
  }

  CompletarDatosModificarRegistro()
  {
    
    const xfecha_Registr = _moment(this.data.sFec_Registro, 'DD/MM/YYYY HH:mm');
    //const fechaFormateadaFecRegistro = xfecha_Registr.format('YYYY-MM-DD');
    const fechaFormateadaFecRegistro = xfecha_Registr.format('DD/MM/YYYY');
    //console.log("fecha fec:"+fechaFormateadaFecRegistro);  
    this.formulario.get('Fec_Registro')?.setValue(fechaFormateadaFecRegistro)

    const codMaquina: string = this.data.cod_maquina || null;

   //Deshabilitado
   //this.CargarMaquinas(); 
   this.formulario.get('Cod_Maquina')?.setValue(codMaquina)
   this.formulario.get('sTarea')?.setValue(this.data.Cod_Tarea)
   this.formulario.get('dnitejedor')?.setValue(this.data.Dni)
   this.formulario.get('sOt')?.setValue(this.data.Cod_OrdTra)
   this.formulario.get('ct_Area')?.setValue(this.data.Cod_Area)
   this.formulario.get('ct_Condicion')?.setValue(this.data.Cod_Cond)
   this.formulario.get('ct_Especialidad')?.setValue(this.data.Cod_Espe) 
   this.formulario.get('ct_Paromaquina')?.setValue(this.data.Cod_ParMaq)

    //Cargar Tipo Falla
    this.CargarTipoFalla2(this.data.Cod_Area, this.data.Cod_Tarea);

   this.formulario.get('ct_Tipo_Falla')?.setValue(this.data.Cod_TipFal)

   this.CargarArticulo(this.data.Cod_Tarea);

   this.formulario.get('ct_Articulo')?.setValue(this.data.Cod_Articulo)
   this.formulario.get('ct_MinMax')?.setValue(this.data.Min_Max)
   this.formulario.get('ct_Tipo_Atribuido')?.setValue(this.data.Flg_Atribuido);
   this.formulario.get('Observacion')?.setValue(this.data.Observacion)

   this.xNum_Mante = this.data.sNum_Mante;

   //Nuevos Campos
      
   //Se envia info cuando la planta no es nro 4
   if (Number(this.data.Num_Planta) !== 4){   
      this.formulario.get('Observacion2')?.setValue(this.data.Observacion2);
      //this.formulario.get('ct_Tipo_Atribuido')?.setValue(this.data.Flg_Atribuido);
    }

  //  console.log("NRoTarea"+this.data.Cod_Tarea)
  //  console.log("Num. Mante."+this.xNum_Mante)
  //  console.log("Num. Mante."+this.xNum_Mante)

   var actual = new Date();
   var hora = _moment(actual.valueOf()).format('HH:mm');
   var weight = hora.split(':')
   this.formulario.get('hfin').setValue(weight[0]+':'+weight[1]);
   
   var splittedfini = this.data.finicio.split(' ',2);
   //console.log("Hora inicio guardada:"+splittedfini)
   this.formulario.get('hini').setValue(splittedfini[1])
   this.formulario.get('hini').disable();
   //this.formulario.get('hfin').disable();
    
   const xfechaInicio = _moment(this.data.finicio, 'DD/MM/YYYY HH:mm');
   const fechaFormateadaFechaInicio = xfechaInicio.format('YYYY-MM-DD');
   //console.log("Nueva feca ini:"+fechaFormateadaFechaInicio);  
   this.formulario.get('Fec_Inicio').setValue(fechaFormateadaFechaInicio)


    // var splittedffin = this.data.ffin.split(' ',2);
    // if (splittedfini[0]!=='01/01/1900') 
    // { 
    //   this.formulario.get('Fec_Inicio').setValue(splittedfini[0]) 
    // }
    // else 
    
    // { 
    //   this.formulario.get('Fec_Inicio').setValue('') 
    // }

    //this.formulario.get('hfin').setValue(splittedffin[1])
   
 }

 pasarfecha() {
  this.Fec_Registro=this.formulario.get('Fec_Registro')?.value;
  this.formulario.get('Fec_Inicio').setValue(this.Fec_Registro);
  this.formulario.get('Fec_Inicio').disable();
  //this.formulario.get('Fec_Fin').setValue(this.Fec_Registro);
}



  CargarMaquinas(Cod_Tarea: string) {

    this.despachoTelaCrudaService.cargarMaquinas(Cod_Tarea).subscribe(
      (result: any) => {

        this.listar_operacionMaquina = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
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
    this.Cod_Tarea = Cod_Tarea
  }

  CargarOts(){
    this.registromantemaquinastej.listadoDatosService("LO","","","","", "").subscribe(
      (result: any) => {
        this.listar_operacionOt = result
        //console.log(this.listar_operacionOt)
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

  mostrarTejedor() {
    let Cod_Trabajador=GlobalVariable.vcodtra;
    let Tip_Trabajador=GlobalVariable.vtiptra;
    //if (dni_tejedor.length===8) {
      //console.log(Cod_Trabajador.length);
      this.registromantemaquinastej.traerTejedorTra(Cod_Trabajador, Tip_Trabajador).subscribe(
        (result: any) => {
          //console.log("El dni inicial es:"+result[0].Nro_DocIde);
           if (result[0].Respuesta == 'OK') {
            this.formulario.get('dnitejedor')?.setValue(result[0].Nro_DocIde); 
            this.formulario.get('nomtejedor')?.setValue(result[0].Nombres);
           }
           this.CargarEspecialidad();
         },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  submit(formDirective) :void {

    const codArea: string =  this.formulario.get('ct_Area')?.value || null;
    const codTarea: string = this.formulario.get('sTarea')?.value || null;
    const codMaq: string = this.formulario.get('Cod_Maquina')?.value || null;
    const paroMaq: string = this.formulario.get('ct_Paromaquina')?.value || null;
    const condicion: string = this.formulario.get('ct_Condicion')?.value || null;

    if (codArea == null){
      this.matSnackBar.open("¡Importante seleccionar el area!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }     

    if (this.Flg_ValidaMaquina == '1' && codMaq == null){
      this.matSnackBar.open("¡Importante seleccionar maquina!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }     
    
    if (codTarea == null){
      this.matSnackBar.open("¡Importante seleccionar la tarea!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    } else {
      const codArticulo: string = this.formulario.get('ct_Articulo')?.value || null;
      const codTipFalla: string = this.formulario.get('ct_Tipo_Falla')?.value || null;

      //Valida si existe articulo a seleccionar
      //Solo cuando planta sea HUACHIPA 2
      if (Number(this.data.Num_Planta) == 4){   

        if (this.listar_articulo.length > 0){
          if (codArticulo == null || codArticulo == ''){
            this.matSnackBar.open("¡Importante seleccionar el articulo!", 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
            return;
          }        
        }        

      }      


      //Valida si existe Tipo Falla a seleccionar
      if (this.listar_tipo_falla.length > 0){
        if (codTipFalla == null || codTipFalla == ''){
          this.matSnackBar.open("¡Importante seleccionar tipo falla!", 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
          return;
        }        
      }      

    }    
    
    if (this.Flg_ValidaMaquina == '1' && paroMaq == null){
      this.matSnackBar.open("¡Importante seleccionar paro maquina!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }      
    
    if (condicion == null){
      this.matSnackBar.open("¡Importante seleccionar la condición!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }    
    
    //if (Number(this.data.Num_Planta) !== 4){
    const Flg_Atribuido: string = this.formulario.get('ct_Tipo_Atribuido')?.value || null;
    if (Flg_Atribuido == null){
      this.matSnackBar.open("¡Importante seleccionar la Tipo Atribuido!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;        
    }
    //}    

    //console.log("El numero a guardar es :"+this.xNum_Mante)

    // if  (this.formulario.valid) {
    //     this.Cod_Accion   = 'I'
    // if  (this.Titulo == 'U'){
    //     this.Cod_Accion = 'U'
    //   }

      if  (this.xNum_Mante == '') {
          this.Cod_Accion = 'I'
      }
      else
      {
          this.Cod_Accion = 'U'
      }


      this.Fec_Registro=this.formulario.get('Fec_Registro')?.value,
      this.Cod_Maquina=this.formulario.get('Cod_Maquina')?.value,
      this.Cod_Tarea=this.formulario.get('sTarea')?.value,
      this.Cod_OrdTra=this.formulario.get('sOt')?.value,
      this.Fec_Inicio=_moment(this.formulario.get('Fec_Inicio')?.value).format('DD/MM/YYYY'),
      this.hini=this.formulario.get('hini')?.value,
      this.Fec_Fin=this.formulario.get('Fec_Fin')?.value,
      this.hfin=this.formulario.get('hfin')?.value,
      this.Observacion=this.formulario.get('Observacion')?.value
      this.dni_tejedor=this.formulario.get('dnitejedor')?.value;

      // Cod_Espe = "";
      // Cod_Articulo="";
      // Cod_Area_Tej_Mante_Maq = "";
      // Cod_Tej_Cond = "";
      // Cod_ParMaq_Tej="";
      // Cod_TipFall = "";

      this.Cod_Espe               = this.formulario.get('ct_Especialidad')?.value;
      this.Cod_Articulo           = this.formulario.get('ct_Articulo')?.value;
      this.Cod_Area_Tej_Mante_Maq = this.formulario.get('ct_Area')?.value;
      this.Cod_Tej_Cond           = this.formulario.get('ct_Condicion')?.value;
      this.Cod_ParMaq_Tej         = this.formulario.get('ct_Paromaquina')?.value;
      this.Cod_TipFall            = this.formulario.get('ct_Tipo_Falla')?.value;
      this.Flg_Atribuido          = this.formulario.get('ct_Tipo_Atribuido')?.value; //Obligatorio para todos

      //Se envia info cuando la planta no es nro 4
      if (Number(this.data.Num_Planta) !== 4){
        this.Observacion2  = this.formulario.get('Observacion2')?.value; 
        //this.Flg_Atribuido = this.formulario.get('ct_Tipo_Atribuido')?.value; 
      }else{
        this.Observacion2  = '';
        //this.Flg_Atribuido = ''; 
      }

      //SEDE - PLANTA
      this.Num_Planta    = String(this.data.Num_Planta);

          this.registromantemaquinastej.guardarEditarEliminarMantenimientoSede
          (
            this.Cod_Accion,
            this.xNum_Mante,
            this.Fec_Registro,
            this.Cod_Maquina,
            this.Cod_Tarea,
            this.Cod_OrdTra,
           this.Fec_Inicio,
            this.hini,
            this.Fec_Fin,
            this.hfin,
            this.Observacion,
            this.dni_tejedor, 
            this.Cod_Espe,
            this.Cod_Articulo,
            this.Cod_Area_Tej_Mante_Maq,
            this.Cod_Tej_Cond ,
            this.Cod_ParMaq_Tej,
            this.Cod_TipFall,
            //Campos Nuevos
            this.Observacion2,
            this.Flg_Atribuido,
            this.Num_Planta
          ).subscribe(
            (result: any) => {
              //this.dialog.closeAll();
              if (result[0]) {
                if (result[0].Respuesta == 'OK') {
                  this.matSnackBar.open('Se guardo Correctamente!!', 'Cerrar', {
                    duration: 3000,
                  })
                  this.dialog.closeAll();
                } else {
                  this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                    duration: 3000,
                  })
                }
              } else {
                this.matSnackBar.open('Error, No Se Pudo guardar!!', 'Cerrar', {
                  duration: 3000,
                })
              }

            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    //   }
    // else 
    //   {
    //   this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    //   }
}




  CargarEspecialidad() 
  {
    let xDni = this.formulario.get('dnitejedor')?.value;  
    this.registromantemaquinastej.ListarEspecialidad(xDni).subscribe(
      (result: any) => {
        this.listar_especialidad = result

        //Agregado por HMEDINA - 11/03/2025
        this.formulario.get('ct_Especialidad')?.setValue(this.listar_especialidad[0].Cod_Espe);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  
  CargarArea() {
    this.listar_area = [];
    this.registromantemaquinastej.ListarAreaBySede(String(this.data.Num_Planta)).subscribe({

      next: (result:any) => {
        if (result.length !== 0){
          this.listar_area = result;
        }else{
          this.listar_area = [];
          this.toastr.warning("No se configuro Areas para la Sede.", 'Cerrar', {
            timeOut: 2500,
            positionClass: 'toast-bottom-center'
             });             
        }
        // Aquí manejas el resultado exitoso
        //console.log('Áreas obtenidas:', result);

      },
      error: (err) => {
        // Aquí manejas el error
        //this.listar_area = [];
        console.error('Error al listar áreas:', err);
        // Opcional: mostrar un mensaje al usuario
      }
    });

    /*
    this.registromantemaquinastej.ListarAreaBySede(this.data.Num_Planta).subscribe(
      (result: any) => {
        this.listar_area = result
        //console.log(this.listar_area);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    */

  }


  CargarCondicion() {
    this.registromantemaquinastej.ListarCondicion().subscribe(
      (result: any) => {
        this.listar_condicion = result
        //console.log(this.listar_area);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CargarTipoFalla2(sCodArea: string, Cod_Tarea: string){
    //Nuevo parametro

    this.registromantemaquinastej.ListarTipoFallaSede(String(this.data.Num_Planta), sCodArea, Cod_Tarea).subscribe(
      (result: any) => {
        this.listar_tipo_falla = result;
        this.tipoFallaFiltrada = [...this.listar_tipo_falla]; 
        this.CargarArticulo(Cod_Tarea);
        //console.log("Codigo de tarea: "+Cod_Tarea);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CargarTipoFalla(Cod_Tarea: string, Flg_ValidaMaquina: string) {
    //Obtener el valor de flag de validar maquina (1 = "Valida", 0 = "no valida")
    this.Flg_ValidaMaquina = Flg_ValidaMaquina;
    
    //SI NO VALIDA MAQUINA DEBE DE LIMPIAR Y BLOQUEAR 
    if (this.Flg_ValidaMaquina == "0") {
      this.formulario.get('Cod_Maquina')?.setValue(''); 
      this.formulario.get('ct_Paromaquina')?.setValue(''); 

      this.formulario.get('Cod_Maquina').disable();
      this.formulario.get('ct_Paromaquina').disable();
    } else {
      this.formulario.get('Cod_Maquina').enable();
      this.formulario.get('ct_Paromaquina').enable();
    }


    //Limpia articulo y (Min Max) - HMEDINA - 11/03/2025
    this.listar_articulo = [];
    this.formulario.get('ct_MinMax')?.setValue('');
    this.formulario.get('ct_Articulo')?.setValue('');
    //Hasta Aqui

    //Nuevo parametro
    const sCodArea : string = this.formulario.get('ct_Area')?.value;
    
    this.registromantemaquinastej.ListarTipoFallaSede(String(this.data.Num_Planta), sCodArea, Cod_Tarea).subscribe(
      (result: any) => {
        this.listar_tipo_falla = result;
        this.tipoFallaFiltrada = [...this.listar_tipo_falla]; 
        this.CargarArticulo(Cod_Tarea);
        //console.log("Codigo de tarea: "+Cod_Tarea);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  CargarArticulo(Cod_Tarea: string) {
    const sCodArea : string = this.formulario.get('ct_Area')?.value;
    this.registromantemaquinastej.ListarArticuloSede(String(this.data.Num_Planta), sCodArea, Cod_Tarea).subscribe(
      (result: any) => {
        this.listar_articulo = result
        //console.log("Codigo de tarea: "+Cod_Tarea);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  
  ListarArticuloMinMax(Cod_Articulo: string) {
    this.Cod_Tarea = this.formulario.get('sTarea')?.value;  
    this.registromantemaquinastej.ListarArticuloMinMax(this.Cod_Tarea.trim(), Cod_Articulo).subscribe(
      (result: any) => {
             //console.log("Minimo: "+result[0].Min_Max);
              this.formulario.get('ct_MinMax')?.setValue(result[0].Min_Max)
              //this.listar_articulo = result
              //console.log("Codigo articulo: "+Cod_Articulo+ " Cod_Tarea : "+this.Cod_Tarea);
              
           
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


   CargarParoMaquina() {
    this.registromantemaquinastej.ListarParoMaquina().subscribe(
      (result: any) => {
        this.listar_paro_maquina = result
        //console.log(this.listar_especialidad);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*NUEVAS FUNCIONES NUEVAS */
  CargarValoresMaquiTarea() {
    //console.log('CargarValoresMaquiTarea');
    //console.log(this.formulario.get('ct_Area')?.value);

    this.listar_operacionMaquina  = [];
    this.listar_operacionTarea    = [];
    this.listar_articulo          = [];
    this.listar_tipo_falla        = [];
    
    this.formulario.get('Cod_Maquina')?.setValue(''); 
    this.formulario.get('sTarea')?.setValue(''); 
    this.formulario.get('ct_Articulo')?.setValue(''); 
    this.formulario.get('ct_Tipo_Falla')?.setValue(''); 

    const sCodArea : string = this.formulario.get('ct_Area')?.value;
    this.CargarMaquinas(sCodArea);
    this.CargarTareasSedes(sCodArea);
  }

  
  CargarTareasSedes(Cod_Tarea: string){

    this.listar_operacionTarea = [];
    this.registromantemaquinastej.ListarTareaByArea(String(this.data.Num_Planta), Cod_Tarea).subscribe({

      next: (result:any) => {

        if (result){
          this.listar_operacionTarea = result;

          if (this.data.Opcion == 'MODIFICAR')
          {
            const tarea = this.listar_operacionTarea.find(t => t.Cod_Tarea === this.data.Cod_Tarea);
            this.Flg_ValidaMaquina = tarea.Flg_ValidaMaquina;
          }

        }else{
          this.listar_operacionTarea = [];
          this.toastr.warning("No se configuro Areas para la Sede.", 'Cerrar', {
            timeOut: 2500,
            positionClass: 'toast-bottom-center'
             });             
        }
      },
      error: (err) => {
        console.error('Error al listar áreas:', err);
      }      
    
  });
}

filtrarTiposFalla() {
  //this.tipoFallaFiltrada = [];
  const filtroTexto = this.formulario.get('filtro')?.value?.toLowerCase();

  this.tipoFallaFiltrada = this.listar_tipo_falla.filter(item =>
    item.Desc_TipFall.toLowerCase().includes(filtroTexto)
  );
}

limpiaFiltro(){
  this.formulario.get('filtro')?.setValue(''); 
}

}

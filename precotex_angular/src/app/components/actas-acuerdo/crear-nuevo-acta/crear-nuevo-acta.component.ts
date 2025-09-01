import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { DialogEliminarComponent } from '../../dialogs/dialog-eliminar/dialog-eliminar.component';
import { element } from 'protractor';
import { AgregarParticipanteActaComponent } from './agregar-participante-acta/agregar-participante-acta.component';
import { ActasAcuerdosService } from 'src/app/services/actas-acuerdos.service';

export interface PeriodicElement {
  IdParticipante: string;
  Nombres: string;
  Apellidos: string;
  Cargo: string;
  Correo: string;
  Telefono: string;
  IdActa: string;
}


const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-crear-nuevo-acta',
  templateUrl: './crear-nuevo-acta.component.html',
  styleUrls: ['./crear-nuevo-acta.component.scss']
})
export class CrearNuevoActaComponent implements OnInit {
  data: any = '';

  displayedColumns: string[] = [
    'Nombres',
    'Cargo',
    'Correo',
    'Telefono',
    'acciones'

  ];

  editor:any;
  deshabilitar: boolean = false;

  Cod_Empresa: string = '';
  dataOp: any = [];
  dataTabla: Array<any> = [];
  dataParticipantes: any = [];
  dataAreas: any = [];
  OP_Sec: string = '';
  IdParticipante;
  Descripcion: string = '';
  Fecha: string = '';
  Sede: string = '';
  Area: string = '';
  IdActa = 0;

  Participante:any;
  tipo: number;
  cabecera: string = '';
  boton: string = '';
  
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private despachoTelaCrudaService: RegistroPermisosService,
    private _router: Router,
    private actasAcuerdosService: ActasAcuerdosService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.mostrarParticipantes();
    //this.mostrarAreas();
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      if (res != null) {
        this.tipo = res['tipo'];
        this.cabecera = res['Cabecera'];
        this.boton = res['boton'];
        if(this.tipo == 2){
          this.Descripcion = res['Descripcion'];
          this.Sede = res['Sede'];
          this.Area = res['Area'];
          this.IdActa = res['IdActa'];
          //var fecha = res['Fecha'];
          this.Fecha = res['Fecha'];
          console.log(this.Fecha);
          //this.dataTabla = res['dataTabla'];
          this.editor = res['Glosario'];
          this.obtenerParticipantesActa(this.IdActa);
        }
      }
    });
  }
  ngAfterViewInit(): void {

  }
  obtenerMermaPrendasOp() {
    
  }
  
  saveRegistro(){
    console.log(this.editor);
    if(this.Descripcion == ''){
      this.matSnackBar.open('La descripción es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }
    if(this.Sede == ''){
      this.matSnackBar.open('La Sede es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.Area == ''){
      this.matSnackBar.open('La Area es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.Fecha == ''){
      this.matSnackBar.open('La Fecha es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.dataTabla.length == 0){
      this.matSnackBar.open('Debes agregar al menos un participante', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.editor == '' || this.editor == undefined){
      this.matSnackBar.open('El glosario es obligatorio.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }
    this.deshabilitar = true;
    var fecha = this.Fecha;
    fecha = _moment(fecha.valueOf()).format('DD/MM/YYYY');
    let data = {
      Opcion: 'I',
      Descripcion: this.Descripcion,
      Sede: this.Sede,
      Area: this.Area,
      Fecha: fecha,
      IdActa: this.IdActa,
      Participantes: this.dataTabla,
      Glosario: this.editor,
      Documento: ''
    }

    this.actasAcuerdosService.insertarActasAcuerdos(data).subscribe((res:any) => {
      if(res.msg == 'OK'){
        this.matSnackBar.open('Se inserto el registro correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })  
        this.deshabilitar = false;
        this._router.navigate(['/ActasAcuerdo']);
      }else{
        this.matSnackBar.open('Ha ocurrido un error al guardar el Acta', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })  
        this.deshabilitar = false;
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
      this.deshabilitar = false;
    })

    console.log("Paso las validaciones");
    console.log(data);
  }

  obtenerParticipantesActa(IdActa){
    this.actasAcuerdosService.muestraParticipantesActa(IdActa).subscribe((res:any) => {
      if (res != null) {
        this.dataTabla = res;
        this.dataSource.data = this.dataTabla;
        console.log(this.dataTabla);
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    })
  }

  guardarRegistro() {
    if(this.tipo == 1){
      this.saveRegistro();
    }
    if(this.tipo == 2){
      this.updateRegistro();
    }
  }
  revertirEnvio(IdParticipante, IdActa, index){
    this.actasAcuerdosService.revertirEnvioCorreo(IdActa, IdParticipante).subscribe((res:any) => {
      if (res != null && res != false) {
        this.matSnackBar.open('Se revirtió correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
        this.obtenerParticipantesActa(IdActa);
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    })
  }
  eliminarParticipante(IdParticipante, IdActa, index){
    console.log(IdActa);
    if(this.tipo == 1){
      this.dataTabla = this.dataTabla.filter(element => {
        return IdParticipante !== element.IdParticipante
      });
  
      this.dataSource.data = this.dataTabla;
    }else if(this.tipo == 2){
      
      if(IdActa == undefined){
        this.dataTabla.splice(index,1);
        this.dataSource.data = this.dataTabla;
        
      }else{
        if(confirm("Esta seguro de eliminar el registro?")){
          this.actasAcuerdosService.mantenimientoParticipantesActa(IdActa, IdParticipante).subscribe((res:any) => {
            if (res != null && res != false) {
              this.dataTabla.splice(index,1);
              this.dataSource.data = this.dataTabla;
            }else{
              this.matSnackBar.open('Ha ocurrido un error al eliminar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
            }
          }, (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
          })
        }
      }
    }


  }
  updateRegistro(){
    if(this.Descripcion == ''){
      this.matSnackBar.open('La descripción es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }
    if(this.Sede == ''){
      this.matSnackBar.open('La Sede es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.Area == ''){
      this.matSnackBar.open('La Area es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.Fecha == ''){
      this.matSnackBar.open('La Fecha es obligatoria', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.dataTabla.length == 0){
      this.matSnackBar.open('Debes agregar al menos un participante', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }

    if(this.editor == '' || this.editor == undefined){
      this.matSnackBar.open('El glosario es obligatorio.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      return;
    }
    this.deshabilitar = true;
    var fecha = this.Fecha;
    fecha = _moment(fecha.valueOf()).format('DD/MM/YYYY');
    let data = {
      Opcion: 'U',
      Descripcion: this.Descripcion,
      Sede: this.Sede,
      Area: this.Area,
      Fecha: fecha,
      IdActa: this.IdActa,
      Participantes: this.dataTabla,
      Glosario: this.editor,
      Documento: ''
    }

    this.actasAcuerdosService.insertarActasAcuerdos(data).subscribe((res:any) => {
      if(res.msg == 'OK'){
        this.matSnackBar.open('Se actualizo el registro correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })  
        this.deshabilitar = false;
        this._router.navigate(['/ActasAcuerdo']);
      }else{
        this.matSnackBar.open('Ha ocurrido un error al actualizar el Acta', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })  
        this.deshabilitar = false;
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
      this.deshabilitar = false;
    })
  }

  enviarTodos(){
    console.log(this.dataTabla);
    this.dataTabla.forEach(element => {
      if(element.Envio_Correo == null){
        this.actasAcuerdosService.enviarCorreo(element.IdParticipante, element.IdActa).subscribe(res => {
          this.matSnackBar.open('Enviando correos', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
          this.obtenerParticipantesActa(element.IdActa);
        }, (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
        })
      }
    });
  }

  enviarCorreo(IdParticipante, IdActa){

        this.actasAcuerdosService.enviarCorreo(IdParticipante, IdActa).subscribe(res => {
          this.matSnackBar.open('Enviando correo', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
          this.obtenerParticipantesActa(IdActa);
        }, (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
        })
  }

  getDefectos() {

  }
  
  seleccionado(event){
    if(event != null && event != undefined){
      this.Participante = event;
    }
  }

  selectParticipante(){
    if(this.Participante != undefined && this.Participante != null){
      this.dataTabla.push(this.Participante);
      this.dataSource.data = this.dataTabla;
      this.matSnackBar.open('Se agrego correctamente el participante', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
      this.Participante = null;
      this.IdParticipante = null;
    }else{
      this.matSnackBar.open('Debes seleccionar un participante.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 });
    }
    
  }

  crearNuevoParticipante() {
    let datos = {
      tipo: 1,
      boton: 'Guardar',
      cabecera: 'Crear Nuevo Participante'
    }
    let dialogRef = this.dialog.open(AgregarParticipanteActaComponent, {
      disableClose: true,
      panelClass: 'my-class',
      data: {
        data: datos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.mostrarParticipantes()
      
 
    })

  }

  mostrarParticipantes(){
    this.actasAcuerdosService.InsertarParticipanteService('M', '', '', '', '', '', '', '').subscribe(res => {
      if (res != null) {
        this.dataParticipantes = res;
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    })
  }

  mostrarAreas(){
    this.actasAcuerdosService.areasService().subscribe(res => {
      if (res != null) {
        this.dataAreas = res;
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    })
  }

}



import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from "@angular/common";

import { DialogDetalleOcurrenciaComponent } from './../dialog-detalle-ocurrencia/dialog-detalle-ocurrencia.component';
import { SeguridadRondasService } from 'src/app/services/seguridad-rondas.service';

@Component({
  selector: 'app-dialog-registo-ocurrencia',
  templateUrl: './dialog-registo-ocurrencia.component.html',
  styleUrls: ['./dialog-registo-ocurrencia.component.scss']
})
export class DialogRegistoOcurrenciaComponent implements OnInit {

  formulario = this.formBuilder.group({
    Accion: ['', Validators.required],
    Id_Ocurrencia: ['', Validators.required],
    Id_Ronda: ['', Validators.required],
    Fecha: [{value: new Date, disabled: true}], //[new Date, Validators.required],
    Fec_Ocurrencia: [new Date, Validators.required],
    Id_Area: ['', Validators.required],
    Tip_Estandar: ['', Validators.required],
    Id_Estandar: ['', Validators.required],
    Des_Lugar: ['', Validators.required],
    Cod_ResArea: [''], //['', Validators.required],
    Cod_Responsable: ['', Validators.required],
    Tip_Riesgo: ['', Validators.required],
    Des_Ocurrencia: ['', Validators.required],
    Des_Accion: ['', Validators.required],
    Evidencia_1: ['', Validators.required],
    Evidencia_2: ['', Validators.required],
    Flg_Activo: [0],
    Usu_Registro: [''],
    Nom_ResArea: [''],
    Nom_Responsable: ['']
  });

  dataArea: any[];
  dataEstandar: any[] = [];
  dataResponsable: any[];
  dataRespArea: any[];

  filtroResponsable: Observable<any[]> | undefined;
  filtroRespArea: Observable<any[]> | undefined;

  dataTipoEstandar: any[] = [
    {Tip_Estandar: 'A', Des_TipoEstandar: 'ACTO SUB ESTANDAR'},
    {Tip_Estandar: 'C', Des_TipoEstandar: 'CONDICION SUB ESTANDAR'}
  ];

  dataTipoRiesgo: any[] = [
    {Tip_Riesgo: '1', Des_Riesgo: 'ALTO'},
    {Tip_Riesgo: '2', Des_Riesgo: 'MEDIO'},
    {Tip_Riesgo: '3', Des_Riesgo: 'BAJO'},
  ];

  Imagen: string = '';
  Imagen64_1: string = '';
  Imagen64_2: string = '';
  numImg: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogRegistoOcurrenciaComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private seguridadRondasService: SeguridadRondasService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data)

    this.formulario.reset();
    this.formulario.patchValue({
      Accion: this.data.Accion,
      Id_Ocurrencia: this.data.Id_Ocurrencia,
      Id_Ronda: this.data.Id_Ronda,
      Fecha: this.datePipe.transform(this.data.Fec_Ocurrencia, 'yyyy-MM-ddTHH:mm'),
      Fec_Ocurrencia: this.datePipe.transform(this.data.Fec_Ocurrencia, 'yyyy-MM-ddTHH:mm'),
      Id_Area: this.data.Id_Area,
      Tip_Estandar: this.data.Tip_Estandar,
      Id_Estandar: this.data.Id_Estandar,
      Des_Lugar: this.data.Des_Lugar,
      Cod_ResArea: this.data.Cod_ResArea,
      Cod_Responsable: this.data.Cod_Responsable,
      Tip_Riesgo: this.data.Tip_Riesgo,
      Des_Ocurrencia: this.data.Des_Ocurrencia,
      Des_Accion: this.data.Des_Accion,
      Evidencia_1: this.data.Evidencia_1,
      Evidencia_2: this.data.Evidencia_2,
      Flg_Activo: this.data.Flg_Activo,
      Usu_Registro: this.data.Usu_Registro
    });

    this.Imagen64_1 = this.data.Captura1_64 ? this.data.Captura1_64 : "";
    this.Imagen64_2 = this.data.Captura2_64 ? this.data.Captura2_64 : "";
    this.numImg = this.numImg + (this.data.Evidencia_1 ? 1 : 0);
    this.numImg = this.numImg + (this.data.Evidencia_2 ? 1 : 0);

    if(this.data.Flg_Estado == 'F'){
      this.formulario.controls['Id_Area'].disable();
      this.formulario.controls['Tip_Estandar'].disable();
      this.formulario.controls['Id_Estandar'].disable();
      this.formulario.controls['Nom_Responsable'].disable();
      this.formulario.controls['Nom_ResArea'].disable();
      this.formulario.controls['Des_Lugar'].disable();
      this.formulario.controls['Tip_Riesgo'].disable();
      this.formulario.controls['Des_Ocurrencia'].disable();
      this.formulario.controls['Des_Accion'].disable();
    }

    this.listarAreasPlanta(this.data.Id_Planta);
    this.listarEstandarSeguridad();
    this.listarResponsables();
  }

  onSelectArea(idArea: number){
    //this.formulario.controls['Cod_ResArea'].setValue('E2900');
  }

  onGuardarImagen(event: any){
    const archivoCapturado = event.target.files[0];

    // Preparar imagen a binario para previsualización
    const extraerBase64 = async ($event: any) => new Promise ((resolve) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({          
            base: reader.result
          });
        };
        reader.onerror = error => {
          resolve({
            base: null
          });
        };
      }
      catch (e) {
        resolve({
          base: null
        });
      }
    });
  
    // Generar imagen para previsualización
    extraerBase64(archivoCapturado).then((imagen: any) => {
      if(this.Imagen64_1 == ''){
        this.Imagen64_1 = imagen.base;
        this.formulario.controls['Evidencia_1'].setValue(imagen.base);
      } else {
        this.Imagen64_2 = imagen.base;
        this.formulario.controls['Evidencia_2'].setValue(imagen.base);
      }
        
      this.numImg = this.numImg + 1;
    });

    // Preperar imagen string a binario para grabar en servidor
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(archivoCapturado);

  }

  _handleReaderLoaded(readerEvent: any) {
    var binaryString = readerEvent.target.result;

    this.formulario.patchValue({
      imgbase64: btoa(binaryString)
    }); 

  }

  onAmpliarImagen(imagen: string){
    let img64: string;
    if(imagen == '1')
      img64 = this.Imagen64_1;
    else
      img64 = this.Imagen64_2;

    let dialogRef = this.dialog.open(DialogDetalleOcurrenciaComponent, {
      disableClose: true,
      maxWidth: "100vw",
      maxHeight: "90vh",
      data: {img: img64}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
    });

  }

  filterEstandarSeguridad(){
    return this.dataEstandar.filter(data => data.Tip_Estandar == this.formulario.get('Tip_Estandar')?.value);
  }

  listarAreasPlanta(idPlanta: number){
    this.seguridadRondasService.listarAreasPlanta(idPlanta)
      .subscribe((response) => {
        this.dataArea = response;
      });
  }  

  listarEstandarSeguridad(){
    this.seguridadRondasService.listarEstandarSeguridad()
      .subscribe((response) => {
        this.dataEstandar = response;
      });
  }

  listarResponsables(){
    this.seguridadRondasService.listarOperarioAreas('001','')
      .subscribe((response) => {
        this.dataResponsable = response;
        this.dataRespArea = response;
        this.recargarResponsable();
        this.recargarRespArea();

        if(this.data.Id_Ocurrencia != 0){
          let responsable: any[];

          //Responsable Area
          responsable = response.filter(d => d.Codigo == this.data.Cod_ResArea);
          this.formulario.controls['Nom_ResArea'].setValue(responsable[0].Trabajador);

          //Responsable Acto/Condicion
          responsable = response.filter(d => d.Codigo == this.data.Cod_Responsable);
          this.formulario.controls['Nom_Responsable'].setValue(responsable[0].Trabajador);
        }
      });
  }

  // Responsable Acto/Condicion
  recargarResponsable(){
    this.filtroResponsable = this.formulario.controls['Nom_Responsable'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterResponsable(option) : this.dataResponsable.slice())),
    );
  }  

  private _filterResponsable(value: string): any[] {
    this.formulario.controls['Cod_Responsable'].setValue('')
    const filterValue = value.toLowerCase();

    return this.dataResponsable.filter(option => String(option.Codigo).toLowerCase().indexOf(filterValue ) > -1 || option.Trabajador.toLowerCase().indexOf(filterValue ) > -1);
  }

  selectResponsable(option: any){
    this.formulario.controls['Cod_Responsable'].setValue(option.Codigo);
  }

  // Responsable Area
  recargarRespArea(){
    this.filtroRespArea = this.formulario.controls['Nom_ResArea'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterRespArea(option) : this.dataRespArea.slice())),
    );
  }  

  private _filterRespArea(value: string): any[] {
    this.formulario.controls['Cod_ResArea'].setValue('')
    const filterValue = value.toLowerCase();

    return this.dataRespArea.filter(option => String(option.Codigo).toLowerCase().indexOf(filterValue ) > -1 || option.Trabajador.toLowerCase().indexOf(filterValue ) > -1);
  }

  selectRespArea(option: any){
    this.formulario.controls['Cod_ResArea'].setValue(option.Codigo);
  }  
  
}
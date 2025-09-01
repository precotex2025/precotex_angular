import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';

import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

interface data_det {
  Id_Firma: string,
  Tip_Origen: string,
  Cod_Origen: string,
  Imagen: string,
  Cod_Usuario: string,
  Nombre: string,
  Img64: any
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string
}

interface Servicio {
  Cod_LinPro: string;
  Des_Servicio: string;
  Descripcion: string;
}

@Component({
  selector: 'app-dialog-registro-firmas',
  templateUrl: './dialog-registro-firmas.component.html',
  styleUrls: ['./dialog-registro-firmas.component.scss']
})
export class DialogRegistroFirmasComponent implements OnInit {

  listar_Auditor:   Auditor[] = [];
  listar_Servicio:  Servicio[] = [];
  filtroAuditor:    Observable<Auditor[]> | undefined;
  filtroServicio:   Observable<Servicio[]> | undefined;

  formulario = this.formBuilder.group({
    Id_Firma:    [''],
    Tipo:        [''],
    Tip_Origen:  ['', Validators.required],
    Cod_Origen:  ['', Validators.required],
    Imagen:      [''],
    Cod_Usuario: [''],
    Nom_Auditor: [''],
    Des_Servicio: ['']
  }) 

  Titulo: string = '';
  Tipo: string = '0';
  Imagen: string = '';
  Imagen64: string = '';
  ImgOk: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: data_det, 
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.Titulo = this.data.Cod_Origen;
    this.Tipo = this.data.Tip_Origen == 'TB' ? '0' : '1';

    this.formulario.reset();
    this.formulario.patchValue({
      Id_Firma: this.data.Id_Firma,
      Tipo: this.data.Tip_Origen.trim() == 'TB' ? '0' : '1',
      Tip_Origen: this.data.Tip_Origen,
      Cod_Origen: this.data.Cod_Origen,
      Imagen: this.data.Imagen,
      Cod_Usuario: this.data.Cod_Usuario,
      Nom_Auditor: this.data.Nombre,
      Des_Servicio: this.data.Nombre
    });

    if(this.data.Id_Firma!="0"){
      this.formulario.controls['Tipo'].disable();
      this.formulario.controls['Nom_Auditor'].disable();
      this.formulario.controls['Des_Servicio'].disable();
      this.Imagen64 = this.data.Img64; 
    }    

    this.CargarAuditor();
    this.CargarServicios();
  }

  submit(formDirective) :void{
    let accion: string = ""

    if(this.ImgOk){
      if (this.data.Id_Firma == '0') {
        accion = 'I';
      } else {
        accion = 'U';
      }
      console.log(this.Imagen)
      var sCod_Usuario = GlobalVariable.vusu;
      const formData = new FormData();
      formData.append('Tipo', accion);
      formData.append('Id_Firma', this.formulario.get('Id_Firma')?.value);
      formData.append('Tip_Origen', this.formulario.get('Tip_Origen')?.value);
      formData.append('Cod_Origen', this.formulario.get('Cod_Origen')?.value);
      formData.append('Imagen', this.formulario.get('Imagen')?.value);
      formData.append('Usuario', sCod_Usuario);
      formData.append('Foto', this.Imagen);
      console.log(formData)
      this.SpinnerService.show();
      this.auditoriaInspeccionCosturaService.cargarImagenesFirmas(
        formData
      ).subscribe(
        (result: any) => {
          console.log(result)
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open("Se guardo la imagen correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          this.SpinnerService.hide();
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        });
      console.log(accion)  
    } else {
      this.matSnackBar.open("Acción cancelada.  No se selecciono ninguna imagen", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }

  }

  cambiarTipoFirma(value){
    this.Tipo = value;
    this.formulario.controls['Tip_Origen'].setValue(value == '0' ? "TB" : "CS");
  }

  CargarAuditor(){
    this.listar_Auditor = [];
    this.listar_Servicio = [];

    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('L','','','',0,'').subscribe(
      (result: any) => {
        this.listar_Auditor = result
        this.RecargarAuditor()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  RecargarAuditor(){
    this.filtroAuditor = this.formulario.controls['Nom_Auditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterAuditor(option) : this.listar_Auditor.slice())),
    );    
  }

  private _filterAuditor(value: string): Auditor[] {
    //this.formulario.controls['Cod_Operario'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_Auditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarCodLider(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['Cod_Origen'].setValue(Tip_Trabajador+Cod_Auditor)
  }

  CargarServicios(){
    this.auditoriaAcabadosService.ListarLineaProd_Servicios()
      .subscribe((result: any) => {
        this.listar_Servicio = result;
        this.RecargarServicio();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  RecargarServicio(){
    this.filtroServicio = this.formulario.controls['Des_Servicio'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterServicio(option) : this.listar_Servicio.slice())),
    );
  }

  private _filterServicio(value: string): Servicio[] {
    //this.formulario.controls['Cod_LinPro'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_Servicio.filter(option => String(option.Cod_LinPro).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Des_Servicio.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarCodLinPro(Cod_LinPro: string){
    this.formulario.controls['Cod_Origen'].setValue(Cod_LinPro)
  }

  guardarImagen(event: any){
    this.ImgOk = false;
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
      this.Imagen64 = imagen.base;
      this.ImgOk = true;
    });

    // Preperar imagen string a binario para grabar en servidor
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(archivoCapturado);

    this.Imagen = event.target.files[0];
  }

  _handleReaderLoaded(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    //this.lc_binary64 = btoa(binaryString);

    this.formulario.patchValue({
      imgbase64: btoa(binaryString)
    }); 

  }

  old_guardarImagen(event){
    this.Imagen = event.target.files[0]
    //console.log(event.target.files[0])

    const file: File = event.target.files[0];
    //console.log(file)


    if(event.target.files[0].name != ""){
      this.http.get('assets/Firma1.jpg', { responseType: 'blob' })
      .pipe(
        switchMap(blob => this.convertBlobToBase64(blob))
      )
      .subscribe(base64ImageUrl => {
        //this.Imagen = base64ImageUrl;
        console.log(base64ImageUrl)
  
      });
    }
  }

  convertBlobToBase64(blob: Blob) {
    return Observable.create(observer => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        //console.log('Image in Base64: ', event.target.result);
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        //console.log("File could not be read: " + event.target.error.code);
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }

}

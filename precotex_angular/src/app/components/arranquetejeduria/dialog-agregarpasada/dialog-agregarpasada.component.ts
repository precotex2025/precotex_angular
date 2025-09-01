import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Console, log } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';

interface data_det {
  num_Correlativo     : number,
  cod_Tela            : string,
  id_Version          : number,
  titulo              : string,
  cabos               : string,
  longitudMalla       : string,
  color               : string,
  pasadas             : string,
  estructura          : string,
  repeticiones        : string,
  rec_Pasadas_Real    : number,
  longitud_Malla_Real : number,
}

interface data_det_med {
  cod_Tela : string,
  largoReal: number,
  altoReal : number,
  id       : number,
  tipo     : string,
  estado   : number,
}

interface data {
    boton             : string;
    title             : string;
    title_Combinacion : string;
    CodOrdtra         : string;
    CodComb           : string;
    CodTalla          : string;
    valorLargo        : number;
    valorAlto         : number;
    valorPesoxUnidad  : number;
    valorPasadas      : number;
    CodTela           : string;
    valorLargoReal    : number;
    valorAltoReal     : number;
    Data              : any;
    Version           : number;
    Estado            : string;
}

@Component({
  selector: 'app-dialog-agregarpasada',
  templateUrl: './dialog-agregarpasada.component.html',
  styleUrls: ['./dialog-agregarpasada.component.scss']
})
export class DialogAgregarpasadaComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: data ,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private arranquetejeduria : ArranquetejeduriaService,
    public dialogRef: MatDialogRef<DialogAgregarpasadaComponent>,
    private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService,
  ) { this.dataSource = new MatTableDataSource();  }

  displayedColumns_cab: string[] = [
    'Titulo'              ,
    'Estructura'          ,
    'Cabos'               ,
    'Color'               ,
    'LongitudMalla'       ,
    'LongitudMallaReales' ,
    'Pasadas'             ,
    'PasadasReales'
  ]
  dataSource: MatTableDataSource<data_det>;
  listar_Estructura_Tejido_Items:  data_det[] = [];


  displayedColumns_cabMed: string[] = [
    'CodTela'        ,
    'LargoReal'      ,
    'AltoReal'       ,
    'Opciones'
  ]
  datasourceMed: MatTableDataSource<data_det_med>= new MatTableDataSource();;
  listar_Estructura_Medidas: data_det_med[] = [];


  sCod_Usuario = GlobalVariable.vusu;
  isButtonDisabled_Est: boolean = true;
  isButtonDisabled_Med: boolean = false;//Inicia Habilitado
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    //Validar si esta 'APROBADO' no realizar ninguna acción en Medidas
    if (this.data.Estado == 'S'){
      this.isButtonDisabled_Med = true;
    }

    this.formulario.get('InputLargo').disable();
    this.formulario.get('InputAlto').disable();
    this.formulario.get('InputPasadas').disable();
    this.getObtieneEstructuraTejidoItem();
    this.getObtieneTelaMedida();
    this.getObtieneTelaMedidaHist();

    //this.ObtenerDatosRealesPasadas(this.data.CodOrdtra!, this.data.CodComb! ,this.data.CodTalla!);
  }

  formulario = this.formBuilder.group({
    InputLargo:         [''],
    InputAlto:          [''],
    InputPasadas:       [''],
    InputLargo_Real:    ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    InputAlto_Real:     ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    InputPasadas_Real:  ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
  });

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


  // registrarDatosReales(){



  //   if (this.formulario.get('InputLargo_Real')?.value  == ''){
  //     this.matSnackBar.open('Ingrese el valor de Largo Real!!!', 'Cerrar', {
  //       horizontalPosition: 'center',
  //       verticalPosition: 'top',
  //       duration: 1500,
  //     });

  //     return;
  //   }

  //   if (this.formulario.get('InputAlto_Real')?.value  == ''){
  //     this.matSnackBar.open('Ingrese el valor de Alto Real!!!', 'Cerrar', {
  //       horizontalPosition: 'center',
  //       verticalPosition: 'top',
  //       duration: 1500,
  //     });
  //     return;
  //   }

  //   if (this.formulario.get('InputPasadas_Real')?.value  == ''){
  //     this.matSnackBar.open('Ingrese el valor de Pasada Real!!!', 'Cerrar', {
  //       horizontalPosition: 'center',
  //       verticalPosition: 'top',
  //       duration: 1500,
  //     });
  //     return;
  //   }

  //     //GRABAR DATOS REALES
  //     const codOrdtra = this.data.CodOrdtra ;
  //     const codComb   = this.data.CodComb   ;
  //     const codTalla  = this.data.CodTalla  ;
  //     const largo     = this.formulario.get('InputLargo_Real')?.value == ''?0:this.formulario.get('InputLargo_Real')?.value;
  //     const alto      = this.formulario.get('InputAlto_Real')?.value == ''?0:this.formulario.get('InputAlto_Real')?.value;
  //     const peso      = "0";
  //     const pasadas   = this.formulario.get('InputPasadas_Real')?.value == ''?0:this.formulario.get('InputPasadas_Real')?.value;

  //     const formData = new FormData();
  //     formData.append('Cod_Ordtra', codOrdtra);
  //     formData.append('Cod_Comb', codComb);
  //     formData.append('Cod_Talla', codTalla);
  //     formData.append('Rec_Largo_Real', largo);
  //     formData.append('Rec_Alto_Real', alto);
  //     formData.append('Rec_Peso_Real', peso);
  //     formData.append('Rec_Pasadas_Real', pasadas);
  //     formData.append('cod_usuario', this.sCod_Usuario);

  //     this.arranquetejeduria.GuardarDatosReales(formData).subscribe(
  //       (result: any) => {

  //           //Limpia Texto.
  //           this.formulario.get('InputLargo_Real')?.setValue('');
  //           this.formulario.get('InputAlto_Real')?.setValue('');
  //           this.formulario.get('InputPasadas_Real')?.setValue('');

  //           //Muestra mensaje de registro correcto.
  //           this.matSnackBar.open('Registrado  correctamente.', 'Cerrar', {
  //             horizontalPosition: 'center',
  //             verticalPosition: 'top',
  //             duration: 1500,
  //           });

  //           //Funcion de Listar / Actualizar la grilla.
  //           this.ObtenerDatosRealesPasadas(codOrdtra, codComb, codTalla);
  //       },
  //       (err: HttpErrorResponse) => {
  //         this.matSnackBar.open(err.message, 'Cerrar', {
  //           horizontalPosition: 'center',
  //           verticalPosition: 'top',
  //           duration: 1500,
  //         });
  //       }
  //     );

  // }

  // ObtenerDatosRealesPasadas(Cod_Ordtra: string, Cod_Comb: string, Cod_Talla: string) {
  //   this.arranquetejeduria
  //     .obtenerDatosReales(Cod_Ordtra, Cod_Comb, Cod_Talla)
  //     .subscribe(
  //       (result: any) => {
  //         if (result.length > 0) {
  //           this.listar_Datos_Real = result;
  //         }
  //       },
  //       (err: HttpErrorResponse) =>
  //         this.matSnackBar.open(err.message, 'Cerrar', {
  //           duration: 1500,
  //       })
  //   );
  // }

  // eliminarDatosReales(data: any){

  //   const Id = data.Id_Tx_Ots_Hojas_Arranque_Det
  //   const formData = new FormData();
  //   formData.append('Id', Id);

  //   this.arranquetejeduria
  //   .EliminarDatosReales(formData).subscribe(
  //     (result: any) => {

  //       if (result[0].Respuesta == "OK"){
  //           //Muestra mensaje de registro correcto.
  //           this.matSnackBar.open('Registrado eliminado correctamente.', 'Cerrar', {
  //             horizontalPosition: 'center',
  //             verticalPosition: 'top',
  //             duration: 1500,
  //           });
  //       }

  //       //Funcion de Listar / Actualizar la grilla.
  //       this.ObtenerDatosRealesPasadas(data.Cod_Ordtra, this.data.CodComb, this.data.CodTalla);
  //     },
  //     (err: HttpErrorResponse) =>
  //       this.matSnackBar.open(err.message, 'Cerrar', {
  //         duration: 1500,
  //     }
  //   ))

  // }

  getObtieneEstructuraTejidoItem(){
    const sCodTela      : string = this.data.CodTela  ;
    const sCodOrdtra    : string = this.data.CodOrdtra;
    const sNumSecuencia : string = this.data.Data.SEC;

    this.SpinnerService.show();
    this.arranquetejeduria.getObtieneEstructuraTejidoItem(sCodTela, sCodOrdtra, sNumSecuencia).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

            //this.isButtonDisabled_Est = false;

            //Validar si esta 'APROBADO' no realizar ninguna acción
            if (this.data.Estado == 'S'){
              this.isButtonDisabled_Est = true;
            }else{
              this.isButtonDisabled_Est = false;
            }
            
            this.dataSource.data = response.elements;
          }
          else{
            this.SpinnerService.hide();
            this.dataSource.data = [];
          }
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }

  GuardarEstructura(){

      //LEER LA INFORMACION DE MATTABLE
      const strXMLVar: String = this.fncGenerarXML();
      let data: any = {
        CodOrdtra      : this.data.CodOrdtra      ,
        NumSecuencia   : this.data.Data.SEC       ,
        CodComb        : this.data.CodComb.trim() ,
        CodTalla       : this.data.CodTalla.trim(),
        CodUsuario     : this.sCod_Usuario        ,
        XmlData         : strXMLVar  // Ejemplo de XML
      }

      this.arranquetejeduria.postRegistraEstructuraTejidoItem(data).subscribe({
        next: (response: any)=> {
          if(response.success){

            if (response.codeResult > 0){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });

            }else{
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }

          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut: 2500,
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500,
           });
        }
      });
  }

  fncGenerarXML() {
    let xml = `<Datos>\n`;
    this.dataSource.data.forEach(item => {
      xml += `  <Registro>\n`;
      xml += `    <Cod_Tela>${item.cod_Tela}</Cod_Tela>\n`;
      xml += `    <Num_Correlativo>${item.num_Correlativo}</Num_Correlativo>\n`;
      xml += `    <Id_Version>${item.id_Version}</Id_Version>\n`;
      xml += `    <Rec_Pasadas_Real>${item.rec_Pasadas_Real}</Rec_Pasadas_Real>\n`;
      xml += `    <Longitud_Malla_Real>${item.longitud_Malla_Real}</Longitud_Malla_Real>\n`;
      xml += `    <Version>${this.data.Version}</Version>\n`;
      xml += `  </Registro>\n`;
    });

    xml += `</Datos>`;
    return xml;
  }

  fncGenerarXML_Medidas() {
    let xml = `<Datos>\n`;
    this.listar_Estructura_Medidas.forEach(item => {
      xml += `  <Registro>\n`;
      xml += `    <Codigo>        ${item.id}            </Codigo>\n`;    
      xml += `    <Rec_Largo_Real>${item.largoReal}     </Rec_Largo_Real>\n`;
      xml += `    <Rec_Alto_Real> ${item.altoReal}      </Rec_Alto_Real>\n`;
      xml += `    <Tipo>          ${item.tipo}          </Tipo>\n`;
      xml += `    <Estado>        ${item.estado}        </Estado>\n`;
      xml += `    <Version>       ${this.data.Version}  </Version>\n`;
      xml += `  </Registro>\n`;
    });

    xml += `</Datos>`;
    return xml;
  }


  //MEDIDAS

  getObtieneTelaMedidaHist(){

    const sCodTela      : string = this.data.CodTela        ;
    const sCodOrdtra    : string = this.data.CodOrdtra      ;
    const sNumSecuencia : string = this.data.Data.SEC       ;
    const sCodComb      : string = this.data.CodComb        ;
    const CodTalla      : string = this.data.CodTalla.trim();

    this.SpinnerService.show();
    this.arranquetejeduria.getObtieneTelaMedidaHist(sCodTela, sCodOrdtra, sNumSecuencia, sCodComb, CodTalla).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.listar_Estructura_Medidas = response.elements;
            this.datasourceMed.data = [...this.datasourceMed.data, ...this.listar_Estructura_Medidas];

            this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            //this.dataSource.data = [];
          }
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }

  getObtieneTelaMedida(){
    const sCodTela      : string = this.data.CodTela        ;
    const CodTalla      : string = this.data.CodTalla.trim();

    this.arranquetejeduria.getObtieneTelaMedida(sCodTela, CodTalla).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

            //recupera los 2 campos
            this.formulario.get('InputLargo')?.setValue(response.elements[0].largo);
            this.formulario.get('InputAlto')?.setValue(response.elements[0].alto);
          }
          else{
            //this.SpinnerService.hide();
            //this.dataSource.data = [];
          }
        }
      },
      error: (error) => {
        //this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }

  GuardarMedida(){

      //LEER LA INFORMACION DE MATTABLE
      const strXMLVar: String = this.fncGenerarXML_Medidas();

      let data: any = {
        CodOrdtra      : this.data.CodOrdtra      ,
        NumSecuencia   : this.data.Data.SEC       ,
        CodTela        : this.data.CodTela        ,
        CodComb        : this.data.CodComb.trim() ,
        CodTalla       : this.data.CodTalla.trim(),
        CodUsuario     : this.sCod_Usuario        ,
        XmlData        : strXMLVar
      }

      this.arranquetejeduria.postRegistraTelaMedida(data).subscribe({
        next: (response: any)=> {
          if(response.success){

            if (response.codeResult > 0){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });

            }else{
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }

          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut: 2500,
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500,
           });
        }
      });

  }

  AgregarFila(){

    const newRow: data_det_med = {
      cod_Tela  : this.data.CodTela ,
      largoReal : 0         ,
      altoReal  : 0         ,
      id        : Math.floor(10000 + Math.random() * 90000),
      tipo      : 'N',
      estado    : 1
    };
    this.listar_Estructura_Medidas.push(newRow)
    this.datasourceMed.data = [...this.datasourceMed.data, newRow];
  }

  EliminarFila(data:any) {

    const id: number = data.id;
    const estado: number = data.estado;
    const tipo: String = data.tipo;


    // Actualiza el campo de la fila en listar_Estructura_Medidas
    this.listar_Estructura_Medidas = this.listar_Estructura_Medidas.map(row => {
      if (row.id === id && row.tipo == 'E') {
        row['estado'] = 0; // Actualiza el campo con el nuevo valor
      }
      return row;
    });

    // Actualiza el campo en datasourceMed.data
    this.datasourceMed.data = this.datasourceMed.data.map(row => {
      if (row.id === id && row.tipo == 'E') {
        row['estado'] = 0; // Actualiza el campo con el nuevo valor
      }
      return row;
    });


    // Filtra la lista para eliminar el registro con el id proporcionado
    if (tipo == 'N'){
      this.listar_Estructura_Medidas = this.listar_Estructura_Medidas.filter(row => row.id !== id);
    }

    // Actualiza el datasourceMed para reflejar la eliminación
    this.datasourceMed.data = this.datasourceMed.data.filter(row => row.id !== id);
  }

  Salir(){
    this.dialogRef.close();
  }

}

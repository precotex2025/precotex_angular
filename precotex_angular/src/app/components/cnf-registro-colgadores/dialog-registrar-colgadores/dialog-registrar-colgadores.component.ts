import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ToastrService } from 'ngx-toastr';

interface data {
  Title   : string;
  Accion  : string;
  Datos   : dataIn;
  refrescarColgadores$
}

interface dataIn {
  cod_Cliente_Tex : string,
  cod_Equipo      : string,
  cod_OrdTra      : string,
  cod_Ruta        : string,
  cod_Tela        : string,
  composicion     : string,
  fabric          : string,
  fec_Modifica    : string,
  fec_Registro    : string,
  flg_Estatus     : string,
  id_Tx_Colgador_Registro_Cab: number,
  nom_Cliente   : string,
  usu_Modifica  : string,
  usu_Registro  : string,
  yarn          : string,
}

interface detalle {
      "encog_Largo"   : number,
      "encog_Ancho"   : number,
      "ancho_Acabado" : number,
      "ancho_Lavado"  : number,
      "gramaje_Acab"  : number,
      "gramaje_Comercial" : number,
      "rendimiento"       : number,
      "diametro"          : number,
      "des_Galga"         : string,
      "des_Color"         : string,
      "des_Fabric_Finish" : string,
      "des_Fabric_Wash"   : string,
      "glosa"             : string,
      "flg_Estatus"       : string
}

@Component({
  selector: 'app-dialog-registrar-colgadores',
  templateUrl: './dialog-registrar-colgadores.component.html',
  styleUrls: ['./dialog-registrar-colgadores.component.scss']
})
export class DialogRegistrarColgadoresComponent implements OnInit {

  cantidadPrint: number = 1;
  sCod_Usuario  = GlobalVariable.vusu;
  formulario = this.formBuilder.group({
    ctrol_articleNumber: [''],
    ctrol_ruta: [''],
    ctrol_cliente: [''],
    ctrol_partida: [''],
    ctrol_fabric:[''],
    ctrol_yarn:[''],
    ctrol_composition:[''],
    ctrol_shrinkageLength:[''],
    ctrol_shrinkageWidth:[''],
    ctrol_widthBW:[''],
    ctrol_widthAW:[''],
    ctrol_weightBW:[''],
    ctrol_weightAW:[''],
    ctrol_yield:[''],
    ctrol_gauge:[''],
    ctrol_diametro:[''],
    ctrol_color:[''],
    ctrol_fabricFinish:[''],
    ctrol_fabricWash:[''],

    filtro:[''],
    ctrol_cantidad:[''],
  });

  maskCodigo: (string | RegExp)[] = [
    /[A-Z]/, // Primera letra mayúscula
    /[A-Z]/, // Segunda letra mayúscula
    /\d/,    // Primer número
    /\d/,    // Segundo número
    /\d/,    // Tercer número
    /\d/,    // Cuarto número
    /\d/,    // Quinto número
    /\d/     // Sexto número
  ];

  dataRutas       : Array<any> = [];
  dataClientes    : any[] = [];
  ClientesFiltrada: any[] = [];
  btnGuardarDeshabilitado: boolean = true;
  btnImprimirDeshabilitado: boolean = true;
  tituloBtnProceso: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private serviceColgadores: ProcesoColgadoresService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogRegistrarColgadoresComponent>,
  ) { }

  ngOnInit(): void {
    
    //numero de impresion por defecto 1
    this.formulario.get('ctrol_cantidad')?.setValue(1);

    if (this.data.Accion == 'I'){
      this.tituloBtnProceso = "Grabar";
      //Carga general para ambos casos
      this.LoadClientes(null);
      this.DesHabilitar(true);
    }
    else {
      this.tituloBtnProceso = "Actualizar"; 
      this.LoadRutas(this.data.Datos.cod_Tela!);
      this.DesHabilitar(false);

      //Inhabilita los controles llaves
      this.formulario.get('ctrol_articleNumber')?.disable();
      this.formulario.get('ctrol_ruta')?.disable();
      //this.formulario.get('ctrol_cliente')?.disable();
      this.formulario.get('ctrol_partida')?.disable(); 

      //Habilita controles botones
      this.btnGuardarDeshabilitado  = false;
      this.btnImprimirDeshabilitado = false;

      //Completa informacion
      this.onCompleteData();
    }
  }

  onCompleteData(){

    const filtroTexto = this.data.Datos.cod_Cliente_Tex;
    this.formulario.get('ctrol_articleNumber')?.setValue(this.data.Datos.cod_Tela!);
    this.formulario.get('ctrol_ruta')?.setValue(this.data.Datos.cod_Ruta!);
    //this.formulario.get('ctrol_cliente')?.setValue(this.data.Datos.nom_Cliente!);

    this.LoadClientes(filtroTexto);    


    // console.log(this.data.Datos.cod_Cliente_Tex);
    // this.formulario.patchValue({
    //   ctrol_cliente: this.data.Datos.cod_Cliente_Tex
    // });

    this.formulario.get('ctrol_partida')?.setValue(this.data.Datos.cod_OrdTra!);
    this.formulario.get('ctrol_fabric')?.setValue(this.data.Datos.fabric!);
    this.formulario.get('ctrol_yarn')?.setValue(this.data.Datos.yarn!);
    this.formulario.get('ctrol_composition')?.setValue(this.data.Datos.composicion!);

    //DETALLE
    this.onDetail(Number(this.data.Datos.id_Tx_Colgador_Registro_Cab!));
  }

  onDetail(id: number){
    this.SpinnerService.show();
    this.serviceColgadores.getObtieneInformacionTelaColgadorDet(id).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){      

              //Mostrar datos detalle
              this.formulario.get('ctrol_shrinkageLength')?.setValue(this.formatDecimal(response.elements[0].encog_Largo));
              this.formulario.get('ctrol_shrinkageWidth')?.setValue(this.formatDecimal(response.elements[0].encog_Ancho));
              this.formulario.get('ctrol_widthBW')?.setValue(this.formatDecimal(response.elements[0].ancho_Acabado));
              this.formulario.get('ctrol_widthAW')?.setValue(this.formatDecimal(response.elements[0].ancho_Lavado));
              this.formulario.get('ctrol_weightBW')?.setValue(this.formatDecimal(response.elements[0].gramaje_Acab));
              this.formulario.get('ctrol_weightAW')?.setValue(this.formatDecimal(response.elements[0].gramaje_Comercial));
              this.formulario.get('ctrol_yield')?.setValue(this.formatDecimal(response.elements[0].rendimiento));

              this.formulario.get('ctrol_gauge')?.setValue(response.elements[0].des_Galga);
              this.formulario.get('ctrol_diametro')?.setValue(this.formatEntero(response.elements[0].diametro));  

              this.formulario.get('ctrol_color')?.setValue(response.elements[0].des_Color); 
              this.formulario.get('ctrol_fabricFinish')?.setValue(response.elements[0].des_Fabric_Finish); 
              this.formulario.get('ctrol_fabricWash')?.setValue(response.elements[0].des_Fabric_Wash); 
              
              this.SpinnerService.hide();      
          }
          else{
            this.matSnackBar.open(response.message, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });            
            this.SpinnerService.hide();
          };
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

  onSearch(){
    let articleNumber = this.formulario.get('ctrol_articleNumber')?.value;

    if (!articleNumber || articleNumber.trim() === '') {
      this.matSnackBar.open("¡Importante ingresar Codigo Articulo!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    articleNumber = articleNumber.toUpperCase(); // Asegura letras en mayúscula
    const letras = articleNumber.substring(0, 2);
    const numeros = articleNumber.substring(2).replace(/\D/g, ''); // Solo dígitos

    // Validar letras
    if (!/^[A-Z]{2}$/.test(letras)) {
      console.warn('Las primeras 2 posiciones deben ser letras mayúsculas');
      return;
    }

    // Completar con ceros si faltan dígitos
    const numerosCompletos = numeros.padStart(6, '0');
    const nuevoValor = letras + numerosCompletos;

    // Asignar el valor corregido al control
    this.formulario.get('ctrol_articleNumber')?.setValue(nuevoValor);
    articleNumber = nuevoValor;

    //Obtener la información de la Tela
    this.SpinnerService.show();
    this.serviceColgadores.getObtieneInformacionTelaColgador(articleNumber).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

              //Obtiene Variables Numericas
              const valor_ctrol_shrinkageLength = +response.elements[0].encog_Lenght == 0 ? '' : this.formatDecimal(response.elements[0].encog_Lenght);
              const valor_ctrol_shrinkageWidth = +response.elements[0].encog_Width == 0 ? '' : this.formatDecimal(response.elements[0].encog_Width);
              const valor_ctrol_widthBW = +response.elements[0].width_BW == 0 ? '' : this.formatDecimal(response.elements[0].width_BW);
              const valor_ctrol_widthAW = +response.elements[0].width_AW == 0 ? '' : this.formatDecimal(response.elements[0].width_AW);
              const valor_ctrol_weightBW = +response.elements[0].weight_BW == 0 ? '' : this.formatDecimal(response.elements[0].weight_BW);
              const valor_ctrol_weightAW = +response.elements[0].weight_AW == 0 ? '' : this.formatDecimal(response.elements[0].weight_AW);
              const valor_ctrol_yield = +response.elements[0].yield == 0 ? '' : this.formatDecimal(response.elements[0].yield);
              const valor_ctrol_diametro = +response.elements[0].diametro == 0 ? '' : this.formatEntero(response.elements[0].diametro);             

              //Mostrar los datos Basicos
              this.formulario.get('ctrol_fabric')?.setValue(response.elements[0].des_FamTela);
              this.formulario.get('ctrol_composition')?.setValue(response.elements[0].desComposicion);
              this.formulario.get('ctrol_shrinkageLength')?.setValue(valor_ctrol_shrinkageLength);
              this.formulario.get('ctrol_shrinkageWidth')?.setValue(valor_ctrol_shrinkageWidth);
              this.formulario.get('ctrol_widthBW')?.setValue(valor_ctrol_widthBW);
              this.formulario.get('ctrol_widthAW')?.setValue(valor_ctrol_widthAW);
              this.formulario.get('ctrol_weightBW')?.setValue(valor_ctrol_weightBW);
              this.formulario.get('ctrol_weightAW')?.setValue(valor_ctrol_weightAW);
              this.formulario.get('ctrol_yield')?.setValue(valor_ctrol_yield);
              this.formulario.get('ctrol_gauge')?.setValue(response.elements[0].des_Galga);
              this.formulario.get('ctrol_diametro')?.setValue(valor_ctrol_diametro);              

              this.SpinnerService.hide();

              //Metodo para obtener las rutas
              this.LoadRutas(articleNumber);

              //Habilita los controles en caso Existe Información
              this.btnGuardarDeshabilitado = false;
              //this.btnImprimirDeshabilitado = false; Habilitar boton cuando Imprime 
              this.DesHabilitar(false);             
          }
          else{
            this.matSnackBar.open(response.message, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });            
            this.SpinnerService.hide();
          };
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

  LoadRutas(Cod_Tela: string){
    this.dataRutas = [];
    this.SpinnerService.show();
    this.serviceColgadores.getObtieneInformacionRutaColgador(Cod_Tela).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataRutas = response.elements;
              this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
          };
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

  usarClientes(codigoCliente: string) {

    this.ClientesFiltrada = this.dataClientes.filter(item =>
      item.cod_Cliente_Tex.toLowerCase().includes(codigoCliente)
    );

    // Busca si hay coincidencia exacta (opcional)
    const clienteExacto = this.dataClientes.find(item =>
      item.cod_Cliente_Tex.toLowerCase() === codigoCliente
    );

    // Asigna el valor al mat-select si encuentra coincidencia
    if (clienteExacto) {
      this.formulario.get('ctrol_cliente')?.setValue(clienteExacto.cod_Cliente_Tex);
    }    

  }

  LoadClientes(codigoCliente: string){
    this.dataClientes = [];
    this.SpinnerService.show();
    this.serviceColgadores.getObtieneInformacionClienteColgador().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataClientes = response.elements;
              this.SpinnerService.hide();

              if (codigoCliente && codigoCliente.trim() !== ''){
                this.usarClientes(codigoCliente);
              }
          }
          else{
            this.SpinnerService.hide();
          };
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

DesHabilitar(sEstado: boolean){
  sEstado?this.formulario.get('ctrol_ruta')?.disable():this.formulario.get('ctrol_ruta')?.enable();
  //sEstado?this.formulario.get('ctrol_cliente')?.disable():this.formulario.get('ctrol_cliente')?.enable();
  sEstado?this.formulario.get('ctrol_partida')?.disable():this.formulario.get('ctrol_partida')?.enable();
  sEstado?this.formulario.get('ctrol_fabric')?.disable():this.formulario.get('ctrol_fabric')?.enable();
  sEstado?this.formulario.get('ctrol_yarn')?.disable():this.formulario.get('ctrol_yarn')?.enable();
  sEstado?this.formulario.get('ctrol_composition')?.disable():this.formulario.get('ctrol_composition')?.enable();
  sEstado?this.formulario.get('ctrol_shrinkageLength')?.disable():this.formulario.get('ctrol_shrinkageLength')?.enable();
  sEstado?this.formulario.get('ctrol_shrinkageWidth')?.disable():this.formulario.get('ctrol_shrinkageWidth')?.enable();
  sEstado?this.formulario.get('ctrol_widthBW')?.disable():this.formulario.get('ctrol_widthBW')?.enable();
  sEstado?this.formulario.get('ctrol_widthAW')?.disable():this.formulario.get('ctrol_widthAW')?.enable();
  sEstado?this.formulario.get('ctrol_weightBW')?.disable():this.formulario.get('ctrol_weightBW')?.enable();
   sEstado?this.formulario.get('ctrol_weightAW')?.disable():this.formulario.get('ctrol_weightAW')?.enable();
  sEstado?this.formulario.get('ctrol_yield')?.disable():this.formulario.get('ctrol_yield')?.enable();
  sEstado?this.formulario.get('ctrol_gauge')?.disable():this.formulario.get('ctrol_gauge')?.enable();
  sEstado?this.formulario.get('ctrol_diametro')?.disable():this.formulario.get('ctrol_diametro')?.enable();
  sEstado?this.formulario.get('ctrol_color')?.disable():this.formulario.get('ctrol_color')?.enable();
  sEstado?this.formulario.get('ctrol_fabricFinish')?.disable():this.formulario.get('ctrol_fabricFinish')?.enable();
  sEstado?this.formulario.get('ctrol_fabricWash')?.disable():this.formulario.get('ctrol_fabricWash')?.enable();
  //this.formulario.get('ctrol_cliente').disable();
  //this.formulario.get('ctrol_ruta').disable();
  //this.formulario.get('ctrol_ruta').disable();
}
  
filtrarClientes() {
    //this.tipoFallaFiltrada = [];
    const filtroTexto = this.formulario.get('filtro')?.value?.toLowerCase();
    this.ClientesFiltrada = this.dataClientes.filter(item =>
      item.nom_Cliente.toLowerCase().includes(filtroTexto) ||
      item.abr_Cliente.toLowerCase().includes(filtroTexto)
    );
  }  

  onSave(){
    const _articleNumber = this.formulario.get('ctrol_articleNumber')?.value;
    const _ruta = this.formulario.get('ctrol_ruta')?.value;
    const _cliente = this.formulario.get('ctrol_cliente')?.value;
    const _partida = this.formulario.get('ctrol_partida')?.value;

    if (!_articleNumber || _articleNumber.trim() === '') {
      this.matSnackBar.open("¡Importante ingresar Codigo Articulo!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }
    
    if (!_ruta || _ruta.trim() === '') {
      this.matSnackBar.open("¡Importante seleccionar Ruta!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    if (!_cliente || _cliente.trim() === '') {
      this.matSnackBar.open("¡Importante seleccionar Cliente!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    if (!_partida || _partida.trim() === '') {
      this.matSnackBar.open("¡Importante ingresar codigo Partida!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    //Datos numericos
    const valor_ctrol_shrinkageLength = +this.formulario.get('ctrol_shrinkageLength')?.value?.toString().trim() || 0;
    const valor_ctrol_shrinkageWidth = +this.formulario.get('ctrol_shrinkageWidth')?.value?.toString().trim() || 0;
    const valor_ctrol_widthBW = +this.formulario.get('ctrol_widthBW')?.value?.toString().trim() || 0;
    const valor_ctrol_widthAW = +this.formulario.get('ctrol_widthAW')?.value?.toString().trim() || 0;
    const valor_ctrol_weightBW = +this.formulario.get('ctrol_weightBW')?.value?.toString().trim() || 0;
    const valor_ctrol_weightAW = +this.formulario.get('ctrol_weightAW')?.value?.toString().trim() || 0;
    const valor_ctrol_yield = +this.formulario.get('ctrol_yield')?.value?.toString().trim() || 0;
    const valor_ctrol_diametro = +this.formulario.get('ctrol_diametro')?.value?.toString().trim() || 0;
    
    //Proceso de registrar
    let data: any = {
      "id_Tx_Colgador_Registro_Cab": 0,
      "cod_Tela"        : this.formulario.get('ctrol_articleNumber')?.value ,
      "cod_OrdTra"      : this.formulario.get('ctrol_partida')?.value       ,
      "cod_Ruta"        : this.formulario.get('ctrol_ruta')?.value          ,
      "cod_Cliente_Tex" : this.formulario.get('ctrol_cliente')?.value       ,
      "fabric"          : this.formulario.get('ctrol_fabric')?.value        ,
      "yarn"            : this.formulario.get('ctrol_yarn')?.value          ,
      "composicion"     : this.formulario.get('ctrol_composition')?.value   ,
      "flg_Estatus"     : 'S',
      "usu_Registro"    : this.sCod_Usuario ,
      "accion"          : this.data.Accion  ,
      "detalle"         : [
        {
          "id_Tx_Colgador_Registro_Det": 0,
          "id_Tx_Colgador_Registro_Cab": 0,
          "encog_Largo"      : valor_ctrol_shrinkageLength,
          "encog_Ancho"      : valor_ctrol_shrinkageWidth,
          "ancho_Acabado"    : valor_ctrol_widthBW,
          "ancho_Lavado"     : valor_ctrol_widthAW,
          "gramaje_Acab"     : valor_ctrol_weightBW,
          "gramaje_Comercial": valor_ctrol_weightAW,
          "rendimiento"      : valor_ctrol_yield,
          "diametro"         : valor_ctrol_diametro,
          "des_Galga"        : this.formulario.get('ctrol_gauge')?.value,
          "des_Color"        : this.formulario.get('ctrol_color')?.value,
          "des_Fabric_Finish": this.formulario.get('ctrol_fabricFinish')?.value,
          "des_Fabric_Wash"  : this.formulario.get('ctrol_fabricWash')?.value,
          "glosa"            : "",
          "flg_Estatus"      : "S"
        }
      ]
    };
    
    //Guardar
    this.SpinnerService.show();
    this.serviceColgadores.postProcesoMntoColgador(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });

              //Deshabilita Controles
              this.DesHabilitar(true);

              //Deshabilita botones
              this.btnGuardarDeshabilitado = true;
              this.btnImprimirDeshabilitado = false;

              // Emitir para refrescar la pantalla padre
              this.data.refrescarColgadores$.next();       

              //Deshabili
              if (this.data.Accion == 'U'){
                this.dialogRef.close();
              }

            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }
            this.SpinnerService.hide();
          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut: 2500,
            });
            this.SpinnerService.hide();
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500,
           });
        }
      });
  }

  validarCodigo(): void {
    let valor = this.formulario.get('ctrol_articleNumber')?.value || '';
    valor = valor.toUpperCase(); // Asegura letras en mayúscula

    const letras = valor.substring(0, 2);
    const numeros = valor.substring(2).replace(/\D/g, ''); // Solo dígitos

    // Validar letras
    if (!/^[A-Z]{2}$/.test(letras)) {
      console.warn('Las primeras 2 posiciones deben ser letras mayúsculas');
      return;
    }

    // Completar con ceros si faltan dígitos
    const numerosCompletos = numeros.padStart(6, '0');
    const nuevoValor = letras + numerosCompletos;

    // Asignar el valor corregido al control
    this.formulario.get('ctrol_articleNumber')?.setValue(nuevoValor);

    // Validar longitud
    if (nuevoValor.length !== 8) {
      console.warn('El código debe tener exactamente 8 caracteres');
      return;
    }

    console.log('Código válido:', nuevoValor);
}

  onPrint(){
    //Proceso de Imprimir codigo QR
    let _content  = `${this.formulario.get('ctrol_articleNumber')?.value}${this.formulario.get('ctrol_ruta')?.value }${this.formulario.get('ctrol_partida')?.value}`;
    let data: any = {
        "version"   : "1",
        "content"   : _content,
        //"printName" : "\\\\192.168.7.7\\Planeamiento",
        //"printName" : "\\\\prxwind606\\Argox CP-2140EX PPLB",
        "printName" : "",
        "countPrint": this.cantidadPrint,
        "tx_TelaEstructuraColgador" : {
          "encog_Lenght"  : Number(this.formulario.get('ctrol_shrinkageLength')?.value) ,
          "encog_Width"   : Number(this.formulario.get('ctrol_shrinkageWidth')?.value)  ,
          "width_BW"      : Number(this.formulario.get('ctrol_widthBW')?.value) ,
          "width_AW"      : Number(this.formulario.get('ctrol_widthAW')?.value) ,
          "weight_BW"     : Number(this.formulario.get('ctrol_weightBW')?.value),
          "weight_AW"     : Number(this.formulario.get('ctrol_weightAW')?.value),
          "yield"         : Number(this.formulario.get('ctrol_yield')?.value),
          "des_Galga"     : this.formulario.get('ctrol_gauge')?.value,
          "diametro"      : Number(this.formulario.get('ctrol_diametro')?.value),
          "desComposicion": this.formulario.get('ctrol_composition')?.value ,
          "des_FamTela"   : "string",
          "cod_Tela"      : this.formulario.get('ctrol_articleNumber')?.value ,
          "cod_OrdTra"    : this.formulario.get('ctrol_partida')?.value,
          "Cod_Ruta"      : this.formulario.get('ctrol_ruta')?.value   ,
          "nom_Cliente"   : this.formulario.get('ctrol_cliente')?.value,
          "fabric"        : this.formulario.get('ctrol_fabric')?.value,
          "yarn"          : this.formulario.get('ctrol_yarn')?.value,
          "des_Color"     : this.formulario.get('ctrol_color')?.value,
          "des_Fabric_Finish" : this.formulario.get('ctrol_fabricFinish')?.value,
          "des_Fabric_Wash"   : this.formulario.get('ctrol_fabricWash')?.value
        }
      };
    
      /*
          let data: any = {
        "version"   : "1",
        "content"   : "demo",
        "printName" : "xx",
        "tx_TelaEstructuraColgador" : {
          "encog_Lenght"  : 0 ,
          "encog_Width"   : 0  ,
          "width_BW"      : 0 ,
          "width_AW"      : 0 ,
          "weight_BW"     : 0,
          "weight_AW"     : 0,
          "yield"         : 0,
          "des_Galga"     : "demo",
          "diametro"      : 0,
          "desComposicion": "demo" ,
          "des_FamTela"   : "string",
          "cod_Tela"      : "demo" ,
          "cod_OrdTra"    : "demo",
          "nom_Cliente"   : "demo",
          "fabric"        : "demo",
          "yarn"          : "demo",
          "des_Color"     : "demo",
          "des_Fabric_Finish" : "demo",
          "des_Fabric_Wash"   : "demo"
        }
      };
      */
    //Imprimir CODE QR
    this.SpinnerService.show();
    this.serviceColgadores.postPrintQRCode(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });
            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }
            this.SpinnerService.hide();
          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut: 2500,
            });
            this.SpinnerService.hide();
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500,
           });
        }
      });    
    

  }

  incrementCantidad(): void {
    this.cantidadPrint++;
  }

  decrementCantidad(): void {
    if (this.cantidadPrint > 1) {
      this.cantidadPrint--;
    }
  }

  formatDecimal(valor: any): string {
    const numero = parseFloat(valor);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  }

  formatEntero(valor: any): string {
    const numero = parseFloat(valor);
    return isNaN(numero) ? '0' : numero.toFixed(0);
  }  
}

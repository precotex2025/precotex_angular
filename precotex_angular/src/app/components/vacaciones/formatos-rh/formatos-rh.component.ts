import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formatos-rh',
  templateUrl: './formatos-rh.component.html',
  styleUrls: ['./formatos-rh.component.scss']
})
export class FormatosRhComponent implements OnInit {
  cod_Trabajador = '';
  Fecha_Fin = '';
  Fecha_Inicio = '';
  Empresa = '';
  constructor() { }

  ngOnInit(): void {
  }

  imprimirFormato(){
    if(this.cod_Trabajador != '' && this.Fecha_Fin != ''){
      var cod_trabajador = this.cod_Trabajador.substring(0, 1);
      var tip_trabajador = this.cod_Trabajador.substring(1, 5);
      console.log(cod_trabajador);
      console.log(tip_trabajador);
      http://192.168.1.36/ws_android/app_ImprimirFormato.php?Opcion=R&Tip_Trabajador=E&Cod_Trabajador=4263&Fecha_Fin=14%20de%20Julio%20de%202023
      window.open('http://192.168.1.36/ws_android/app_ImprimirFormato.php?Opcion=R&Tip_Trabajador=' + cod_trabajador + '&Cod_Trabajador=' + this.cod_Trabajador +  '&Fecha_Fin=' + this.Fecha_Fin + '&Fecha_Inicio=' + this.Fecha_Inicio + '&Cod_Empresa=' + this.Empresa, '_blank');
    }else{
      alert('debes ingresar los campos requeridos');
    }
  }

  imprimirFormatoM(){
    if(this.cod_Trabajador != '' && this.Fecha_Fin != ''){
      var cod_trabajador = this.cod_Trabajador.substring(0, 1);
      var tip_trabajador = this.cod_Trabajador.substring(1, 5);
      console.log(cod_trabajador);
      console.log(tip_trabajador);
      http://192.168.1.36/ws_android/app_ImprimirFormato.php?Opcion=R&Tip_Trabajador=E&Cod_Trabajador=4263&Fecha_Fin=14%20de%20Julio%20de%202023
      window.open('http://192.168.1.36/ws_android/app_ImprimirFormato.php?Opcion=M&Tip_Trabajador=' + cod_trabajador + '&Cod_Trabajador=' + this.cod_Trabajador +  '&Fecha_Fin=' + this.Fecha_Fin + '&Fecha_Inicio=' + this.Fecha_Inicio + '&Cod_Empresa=' + this.Empresa, '_blank');
    }else{
      alert('debes ingresar los campos requeridos');
    }
  }

  imprimirFormatoL(){
    if(this.cod_Trabajador != '' && this.Fecha_Fin != ''){
      var cod_trabajador = this.cod_Trabajador.substring(0, 1);
      var tip_trabajador = this.cod_Trabajador.substring(1, 5);
      console.log(cod_trabajador);
      console.log(tip_trabajador);
      http://192.168.1.36/ws_android/app_ImprimirFormato.php?Opcion=R&Tip_Trabajador=E&Cod_Trabajador=4263&Fecha_Fin=14%20de%20Julio%20de%202023
      window.open('http://192.168.1.36/ws_android/app_ImprimirFormato.php?Opcion=L&Tip_Trabajador=' + cod_trabajador + '&Cod_Trabajador=' + this.cod_Trabajador +  '&Fecha_Fin=' + this.Fecha_Fin + '&Fecha_Inicio=' + this.Fecha_Inicio + '&Cod_Empresa=' + this.Empresa, '_blank');
    }else{
      alert('debes ingresar los campos requeridos');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tiempos-improductivosv3',
  templateUrl: './tiempos-improductivosv3.component.html',
  styleUrls: ['./tiempos-improductivosv3.component.scss']
})
export class TiemposImproductivosv3Component implements OnInit {

  constructor(
    private formBuilder       : FormBuilder       ,
  ) { }

  ngOnInit(): void {


  }

    formulario = this.formBuilder.group({
      operador: [''],
      dni: ['', [Validators.required, Validators.maxLength(8)]],
      maquina: ['', Validators.required],
      motivo: ['', Validators.required],
      inicio: [null, Validators.required],
      fin: [null],
      ctrolFechaFin: [''],
    });



motivos = [
  { codigo: '01', descripcion: 'PRE CALENTAMIENTO' },
  { codigo: '02', descripcion: 'LIMPIEZA DE PLANTA' },
  { codigo: '05', descripcion: 'LIQUIDACION DE HILO/LYCRA' },
  { codigo: '13', descripcion: 'FALLA DE MAQUINA' },
  { codigo: '20', descripcion: 'MANTENIMIENTO PREVENTIVO' },
  // ...otros motivos
];

maquinas = ['ABRIDO-01', 'RAMA-01', 'LIQUIDACION DE HILADO'];  

//EVENTOS
  onIniciar(){
  }
  onTerminar(){
  }
  onCancelar(){
  }
  onRegistrar(){
  }
  onHistorial(){
  }


}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-gestion-visitas',
  templateUrl: './gestion-visitas.component.html',
  styleUrls: ['./gestion-visitas.component.scss']
})
export class GestionVisitasComponent implements OnInit {

  result: boolean = false;


  constructor() { }

  ngOnInit(): void { 
  } 
 
  ActualizarPlanta(xNum_Planta: number){
    GlobalVariable.num_planta = xNum_Planta
  }

  
}
 
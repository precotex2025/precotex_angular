import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cnf-registro-presentacion',
  templateUrl: './cnf-registro-presentacion.component.html',
  styleUrls: ['./cnf-registro-presentacion.component.scss']
})
export class CnfRegistroPresentacionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  link_1(){
    this.router.navigate(['/CnfRegistroColgadoresIngreso']);
  }

  link_2(){
    this.router.navigate(['/CnfReubicacionColgadores']);
  }

  link_3(){
    this.router.navigate(['/CnfReubicacionCajas']);
  }

}

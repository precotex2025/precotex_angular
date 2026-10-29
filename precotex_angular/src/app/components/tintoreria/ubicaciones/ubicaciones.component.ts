import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.scss']
})
export class UbicacionesComponent {

  constructor(private router: Router) { }

  irConsultaUbicaciones() {
    this.router.navigate(['/ConsultaUbicaciones']);
  }

  irCrearAgrupamiento() {
    this.router.navigate(['/CrearAgrupamiento']);
  }

  irReubicaUbicaGrupo() {
    this.router.navigate(['/ReubicaUbicaGrupo']);
  }

}

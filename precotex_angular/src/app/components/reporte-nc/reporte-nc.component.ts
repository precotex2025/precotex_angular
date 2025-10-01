import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-reporte-nc',
  templateUrl: './reporte-nc.component.html',
  styleUrls: ['./reporte-nc.component.scss']
})
export class ReporteNCComponent implements OnInit {

  private timer: any;
  constructor() { }

  ngOnInit(): void {
    this.updateHora();
    this.timer = setInterval(() => this.updateHora(), 1000);
  }

  formData = {
    hora: '',
    sede: '',
    area: '',
    lugar: '',
    clasificacion: '',
    descripcion: '',
    riesgo: '',
    accion: '',
    responsable: ''
  };

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
  

  updateHora(): void {
    const now = new Date();
    const horas = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const segundos = now.getSeconds().toString().padStart(2, '0');
    this.formData.hora = `${horas}:${minutos}:${segundos}`;
  }

  sedes = ['Santa Marta', 'Santa Cecilia', 'Santa Rosa', 'Huachipa 1', 'Huachipa 2', 'Huachipa 3', 'Independencia', 'Raray'];
  areas = ['Producción', 'Mantenimiento', 'Seguridad', 'Calidad'];
  clasificaciones = ['Auto Inspección', 'Condición Insegura', 'Mantenimiento', 'Producción'];
  niveles = ['ALTO', 'MEDIO', 'BAJO'];
  responsables = ['Juan Pérez', 'Ana Torres', 'Carlos Díaz'];

  select(field: keyof typeof this.formData, value: string) {
    this.formData[field] = value;
  }

}

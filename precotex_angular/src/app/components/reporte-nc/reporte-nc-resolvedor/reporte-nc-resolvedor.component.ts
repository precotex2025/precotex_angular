import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-reporte-nc-resolvedor',
  templateUrl: './reporte-nc-resolvedor.component.html',
  styleUrls: ['./reporte-nc-resolvedor.component.scss']
})
export class ReporteNcResolvedorComponent implements OnInit, OnDestroy {
  constructor(){}
  formData = {
    fecha: '',
    hora: '',
    descripcion: '',
    fechaObservacion: '',
    estado: '',
    riesgo: '',
    accionCorrectiva: '',
    ubicacion: '',
    reportadoPor: '',
    responsable: '',
    area: '',
    aceptar: '',
    accionTomada: '',
    fechaLevantamiento: '',
    cierre: '',
    observacion: ''
  };

  estados = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Cerrado', value: 'cerrado' },
    { label: 'Con Observación', value: 'observacion' }
  ];

  cierres = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Cerrado', value: 'cerrado' },
    { label: 'Con Observación', value: 'observacion' }
  ];

  niveles = ['Alto', 'Medio', 'Bajo'];
  responsables = [{label: 'Juan Pérez', value: 1}, {label: 'Ana Torres', value: 2}, {label: 'Carlos Díaz', value: 2}];
  areas = ['Producción', 'Mantenimiento', 'Seguridad', 'Calidad'];

  imagenes: string[] = [
    'assets/img1.jpg',
    'assets/img2.jpg'
  ];

  private timer: any;

  ngOnInit(): void {
    this.updateFechaHora();
    this.timer = setInterval(() => this.updateFechaHora(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  updateFechaHora(): void {
    const now = new Date();
    const horas = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const segundos = now.getSeconds().toString().padStart(2, '0');
    this.formData.hora = `${horas}:${minutos}:${segundos}`;

    const dia = now.getDate().toString().padStart(2, '0');
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    const año = now.getFullYear();
    this.formData.fecha = `${dia}/${mes}/${año}`;
  }

  select(field: keyof typeof this.formData, value: string): void {
    this.formData[field] = value;
  }

}

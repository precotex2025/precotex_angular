import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reporte-nc-lst',
  templateUrl: './reporte-nc-lst.component.html',
  styleUrls: ['./reporte-nc-lst.component.scss']
})
export class ReporteNcLstComponent implements OnInit {
  
  constructor(
    private router: Router,
  ){}

  ngOnInit(): void {
    console.log('Se carga el listado');
  }

  RegistrarNC(): void {
    this.onRedireccionarRegistro();
  }

   // Columnas visibles en la tabla
  columnas: string[] = [
    'id',
    'reportadoPor',
    'fechaObservacion',
    'responsable',
    'estado',
    'fechaSubsanacion',
    'accion'
  ];

  // Datos simulados (puedes reemplazar con datos reales desde un servicio)
  reportes = [
    {
      id: '#001',
      reportadoPor: 'Adam Smith',
      fechaObservacion: '05/01/2024',
      responsable: 'Lucas Graham',
      estado: 'Pendiente',
      fechaSubsanacion: 'Pendiente'
    },
    {
      id: '#002',
      reportadoPor: 'María López',
      fechaObservacion: '12/02/2024',
      responsable: 'Carlos Díaz',
      estado: 'Cerrado',
      fechaSubsanacion: '15/02/2024'
    }
    // Puedes agregar más registros aquí
  ];

  // Acciones de los botones
  ver(reporte: any): void {
    console.log('Ver reporte:', reporte);
    // Aquí puedes abrir un modal o navegar a la vista de detalle
  }

  editar(reporte: any): void {
    console.log('Editar reporte:', reporte);
    // Aquí puedes navegar al formulario de edición
  }

  eliminar(reporte: any): void {
    console.log('Eliminar reporte:', reporte);
    // Aquí puedes mostrar confirmación y eliminar el registro
  }

  onRedireccionarRegistro(){
    this.router.navigate(['ReporteNC'], 
      { queryParams: {
          accionR: 'I',
      }}
    )
  }
}

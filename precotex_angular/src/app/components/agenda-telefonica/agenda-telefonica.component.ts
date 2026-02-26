import { Component, OnInit } from '@angular/core';
import { AgendaTelefonicaService } from 'src/app/services/agendatelefonica/agenda-telefonica.service';

export interface Personas {
  age_Id: number;
  age_Car: string;
  age_Sed: string;
  age_Nom: string;
  age_Tel: string;
  flg_Status: string;
}

@Component({
  selector: 'app-agenda-telefonica',
  templateUrl: './agenda-telefonica.component.html',
  styleUrls: ['./agenda-telefonica.component.scss']
})
export class AgendaTelefonicaComponent implements OnInit {

  personas: Personas[] = [];
  loading: boolean = false;
  contactosFiltrados: Personas[] = []; filtro: string = '';
  constructor(private service: AgendaTelefonicaService) {}

  ngOnInit(): void {
    this.obtenerAgentes();
  }

  aplicarFiltro(valor: string): void { 
    this.filtro = valor.toLowerCase(); 
    this.contactosFiltrados = this.personas.filter(c => 
      c.age_Nom.toLowerCase().includes(this.filtro ) || 
      c.age_Car.toLowerCase().includes(this.filtro ) || 
      c.age_Sed.toLowerCase().includes(this.filtro ) || 
      c.age_Tel.toLowerCase().includes(this.filtro ) ); 
    }


  obtenerAgentes(): void {
    this.loading = true;

    this.service.getObtenerNumeros()
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.personas = response.elements;
            this.contactosFiltrados = [...this.personas];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener agentes', err);
          this.loading = false;
        }
      });
  }

}

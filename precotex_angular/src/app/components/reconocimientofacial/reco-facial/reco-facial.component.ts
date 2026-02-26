import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import screenfull from 'screenfull';
import { TomaFotoService } from 'src/app/services/toma-foto/toma-foto.service';

interface PersonaCard {
  foto: string;
  nombre: string;
}

@Component({
  selector: 'app-reco-facial',
  templateUrl: './reco-facial.component.html',
  styleUrls: ['./reco-facial.component.scss']
})

export class RecoFacialComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private service: TomaFotoService
  ) { }

  foto = '';
  // fotosVisibles: string[] = [];
  // fotosPendientes: string[] = [];
  fotosVisibles: PersonaCard[] = []; 
  fotosPendientes: PersonaCard[] = [];
  private intervalDatos: any;
  private intervalFotos: any

  ngOnInit(): void {
    //this.getObtenerDatosRegistro('70105328');
    // const listaDnis = ['70105328', '70158368', '70291653', '70531493', '70760806', 
    //                   '70724978', '70953583', '70899458', '61123360', '60465469', 
    //                   '60162938', '48028831'];
    this.intervalDatos = setInterval(() => {
      // listaDnis.forEach(dni => { 
      //   console.log('DNI LEIDO: ---------------', dni);
      //   this.getObtenerDatosRegistro(dni); 
      // });
      //this.getObtenerDatosRegistro('70105328');
      this.getObtenerMarcación1p1();
    }, 1000);
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    if (this.intervalDatos) {
      clearInterval(this.intervalDatos);
    }

    if (this.intervalFotos) {
      clearInterval(this.intervalFotos);
    }
  }

  alternarPantallaCompleta(): void {
    if (screenfull.isEnabled) {
      screenfull.request();
    }
  }

  getObtenerDatosRegistro(Cam_Mar_Id: number, Nro_Dni: string): void {
  this.service.getObtenerDatosRegistro(Cam_Mar_Id, Nro_Dni).subscribe({
    next: (response: any) => {
      if (response.success) {
        const FotoBase64 = response.elements[0].fotoBase64;
        const NombreFormateado = response.elements[0].nombre; // 👈 ya viene listo

        const personaCard: PersonaCard = {
          foto: FotoBase64,
          nombre: NombreFormateado
        };

        if (this.fotosVisibles.length < 6) {
          this.fotosVisibles.push(personaCard);

          if (this.fotosVisibles.length === 6 && !this.intervalFotos) {
            this.intervalFotos = setInterval(() => {
              if (this.fotosPendientes.length > 0) {
                const nuevaPersona = this.fotosPendientes.shift();
                this.fotosVisibles.shift();
                this.fotosVisibles.push(nuevaPersona!);
              } else {
                if (this.fotosVisibles.length > 0) {
                  this.fotosVisibles.shift();
                }
              }
            }, 3000);
          }
        } else {
          this.fotosPendientes.push(personaCard);
        }
      }
    },
    error: (error: any) => {
      console.error('Error al obtener datos:', error);
    }
  });
}


  getObtenerMarcación1p1(): void {
    let nro_dni: string = '';
    let cam_mar_id: number = 0;
    this.service.getObtenerMarcación1p1().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            
            cam_mar_id = response.elements[0].cam_Mar_Id;
            nro_dni = response.elements[0].cam_Mar_Cod_Usr;    
          
            this.getObtenerDatosRegistro(cam_mar_id, nro_dni);
          }
        }
      },
      error: (error: any) => {
      }
    });
  }


}

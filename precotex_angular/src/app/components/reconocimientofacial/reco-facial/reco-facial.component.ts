import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import screenfull from 'screenfull';
import { TomaFotoService } from 'src/app/services/toma-foto/toma-foto.service';

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
  fotos: string[] = [
    'assets/fotos/FOTO1.jpg',
    'assets/fotos/FOTO2.jpg',
    'assets/fotos/FOTO3.jpg',
    'assets/fotos/FOTO4.jpg',
    'assets/fotos/FOTO5.jpg',
    'assets/fotos/FOTO6.jpg'
  ];

  fotosVisibles: string[] = [];
  fotosPendientes: string[] = [];
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
    console.log('ENTRAMOS AL METODO');
    this.service.getObtenerDatosRegistro(Cam_Mar_Id, Nro_Dni).subscribe({
      next: (response: any) => {
        console.log('ENTRAMOS AL SERVICIO DEL METODO');
        //console.log('TENEMOS ESTOS ELEMENTOS: -----', response.totalElements);
        if (response.success) {
          //console.log('ENTRAMOS CON MÁS DE 0 ELEMENTOS');
          //console.log('FFFFFFFFFFFFFFFFFFFFF', response.elements);
          const FotoBase64 = response.elements[0].fotoBase64;
          //console.log('la foto es --------------------', FotoBase64);
          if (this.fotosVisibles.length < 6) {
            this.fotosVisibles.push(FotoBase64);

            if (this.fotosVisibles.length === 6 && !this.intervalFotos) {
              this.intervalFotos = setInterval(() => {
                if (this.fotosPendientes.length > 0) {
                  const nuevaFoto = this.fotosPendientes.shift();
                  this.fotosVisibles.shift();
                  this.fotosVisibles.push(nuevaFoto!);
                } else {
                    if (this.fotosVisibles.length > 0) {
                    this.fotosVisibles.shift();
                  }
                }
              }, 3000);
            }
          } else {
            this.fotosPendientes.push(FotoBase64);
          }
        }
      },
      error: (error: any) => {
        console.error('Error al obtener foto:', error);
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
            
            //console.log('codigo dni leido------', cam_mar_id);
            //console.log('DNI LEIDO: ---------------', nro_dni);

            this.getObtenerDatosRegistro(cam_mar_id, nro_dni);
          }
        }
      },
      error: (error: any) => {
      }
    });
  }


}

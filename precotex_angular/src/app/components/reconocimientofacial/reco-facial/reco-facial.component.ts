// import { Component, OnInit, OnDestroy } from '@angular/core';
// import screenfull from 'screenfull';

// @Component({
//   selector: 'app-reco-facial',
//   templateUrl: './reco-facial.component.html',
//   styleUrls: ['./reco-facial.component.scss']
// })
// export class RecoFacialComponent implements OnInit, OnDestroy {

//   constructor() { }

//   fotos: string[] = [
//     'assets/fotos/FOTO1.jpg',
//     'assets/fotos/FOTO2.jpg',
//     'assets/fotos/FOTO3.jpg',
//     'assets/fotos/FOTO4.jpg',
//     'assets/fotos/FOTO5.jpg',
//     'assets/fotos/FOTO6.jpg'
//   ];

//   fotosVisibles: string[] = [];
//   private index = 0;
//   private intervalId: any;
//   animando = false;

//   ngOnInit(): void {
//     this.mostrarFotos(); this.intervalId = setInterval(() => { 
//       this.animando = false; 
//       setTimeout(() => { 
//         this.index = (this.index + 6) % this.fotos.length; 
//         this.mostrarFotos(); this.animando = true; 
//         }, 500); 
//       }, 3000);
//   }

//   ngOnDestroy(): void {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//     }
//   }

//   private mostrarFotos(): void {
//     this.fotosVisibles = this.fotos.slice(this.index, this.index + 6); 
//     this.animando = true;
//   }

//   alternarPantallaCompleta(): void { 
//     if (screenfull.isEnabled) { 
//       screenfull.toggle(); 
//     } 
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import screenfull from 'screenfull';

@Component({
  selector: 'app-reco-facial',
  templateUrl: './reco-facial.component.html',
  styleUrls: ['./reco-facial.component.scss']
})

// export class RecoFacialComponent implements OnInit, OnDestroy {
//   fotos: string[] = [
//     'assets/fotos/FOTO1.jpg',
//     'assets/fotos/FOTO2.jpg',
//     'assets/fotos/FOTO3.jpg',
//     'assets/fotos/FOTO4.jpg',
//     'assets/fotos/FOTO5.jpg',
//     'assets/fotos/FOTO6.jpg'
//   ];

//   currentIndex = 0;
//   private intervalId: any;

//   ngOnInit(): void {
//     this.intervalId = setInterval(() => {
//       this.nextSlide();
//     }, 3000); 
//   }

//   ngOnDestroy(): void {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//     }
//   }

//   nextSlide(): void {
//     this.currentIndex = (this.currentIndex + 1) % this.fotos.length;
//   }

//   alternarPantallaCompleta(): void {
//     if (screenfull.isEnabled) {
//       screenfull.request();
//     }
//   }
// }

export class RecoFacialComponent implements OnInit, OnDestroy {
  fotos: string[] = [
    'assets/fotos/FOTO1.jpg',
    'assets/fotos/FOTO2.jpg',
    'assets/fotos/FOTO3.jpg',
    'assets/fotos/FOTO4.jpg',
    'assets/fotos/FOTO5.jpg',
    'assets/fotos/FOTO6.jpg'
  ];

  fotosVisibles: string[] = [];
  private intervalId: any;

  ngOnInit(): void {
    // Inicialmente mostramos las primeras 6
    this.fotosVisibles = this.fotos.slice(0, 6);

    // Cada 3 segundos simulamos la cola
    this.intervalId = setInterval(() => {
      this.fotosVisibles.shift(); // quita la primera
      const siguienteIndex = (this.fotos.indexOf(this.fotosVisibles[this.fotosVisibles.length - 1]) + 1) % this.fotos.length;
      this.fotosVisibles.push(this.fotos[siguienteIndex]); // agrega la siguiente
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  alternarPantallaCompleta(): void {
    if (screenfull.isEnabled) {
      screenfull.request();
    }
  }
}

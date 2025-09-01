import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import { CalificacionRollosProcesoService } from 'src/app/services/calificacion-rollos-proceso.service';
import { PartidaPorRolloCabecera } from '../calificacion-rollos-proceso/calificacion-rollos-proceso.model';
import { GlobalVariable } from 'src/app/VarGlobals';
//import { PartidaPorRolloCabecera } from './calificacion-rollos-proceso.model';


@Component({
  selector: 'app-lectura-rollos-embalaje',
  templateUrl: './lectura-rollos-embalaje.component.html',
  styleUrls: ['./lectura-rollos-embalaje.component.scss']
})
export class LecturaRollosEmbalajeComponent implements OnInit {

  @ViewChild('scannerInput') scannerInput!: ElementRef;

  partidaPorRolloList: PartidaPorRolloCabecera[] = [];
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private CalificacionRollosProcesoService: CalificacionRollosProcesoService) { }

  ngOnInit(): void {
  }

  addCode(partida: string) {

    if (partida.trim()) {

      this.CalificacionRollosProcesoService.buscarPorRollo(partida,this.sCod_Usuario).subscribe({
        next: (response) => {
          this.partidaPorRolloList = response.elements
          console.log('buscarPorRollo:', this.partidaPorRolloList);

        },
        error: (err) => {
          console.error('buscarPorRollo', err);
        }
      });
    }
  }

  ngAfterViewInit() {
  this.focusInput();
}

  focusInput() {
    setTimeout(() => {
      this.scannerInput?.nativeElement?.focus();
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id; // Or a unique identifier for each item
  }

  eliminarRollo(defecto: any, index: number): void {
    this.partidaPorRolloList.splice(index, 1);
    console.log('defecto', defecto);

    this.CalificacionRollosProcesoService.updatePorPartida(defecto.codPartida,defecto.id).subscribe({
      next: (response) => {
        this.partidaPorRolloList = response.elements
        console.log('updatePorPartida', this.partidaPorRolloList);

      },
      error: (err) => {
        console.error('updatePorPartida', err);
      }
    });
  }

  limpiar(){
    this.partidaPorRolloList = [];
  }

}

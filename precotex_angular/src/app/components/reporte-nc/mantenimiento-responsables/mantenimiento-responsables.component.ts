import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

interface dataResponsables{
  resp_Id: number;
  resp_Nom: string;
  resp_Ape_Pat: string;
  resp_Ape_Mat: string;
}

@Component({
  selector: 'app-mantenimiento-responsables',
  templateUrl: './mantenimiento-responsables.component.html',
  styleUrls: ['./mantenimiento-responsables.component.scss']
})

export class MantenimientoResponsablesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private serviceReporteNC: ReporteNCService,
    private toastr: ToastrService
  ) { }

  dataSource: MatTableDataSource<dataResponsables> = new MatTableDataSource();

  ngOnInit(): void {
    this.onCargarGrid(0);
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
columnas: string[] = ['accion', 'codigo', 'nombre', 'apePaterno', 'apeMaterno'];

responsables = [];

crearResponsable() {
  this.router.navigate(['DialogResponsablesNuevo'],
      { queryParams: {
          accionR: 'I'
      }}
    );
}

editarResponsable(responsable: any) {
  let resp_Id = responsable.resp_Id;
  let resp_Nom = responsable.resp_Nom;
  let resp_Ape_Pat = responsable.resp_Ape_Pat;
  let resp_Ape_Mat = responsable.resp_Ape_Mat;
  
  this.router.navigate(['DialogResponsablesNuevo'],
      { queryParams: {
          accionR: 'U',
          resp_IdR: resp_Id,
          resp_NomR: resp_Nom,
          resp_Ape_PatR: resp_Ape_Pat,
          resp_Ape_MatR: resp_Ape_Mat    
      }}
    );
}


eliminarResponsable(resp_Id: number) {
  Swal.fire({
    title: "¿Eliminar Responsable?",
    text: "Se eliminará de forma permanente",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor:'#3085d6',
    cancelButtonColor:'#d33',
    confirmButtonText:'Si',
    cancelButtonText: 'No'
  }).then((result) =>{
    if(result.isConfirmed){    
      this.SpinnerService.show();
      this.serviceReporteNC.deleteEliminarResponsable(resp_Id).subscribe({
        next: (response: any) => {
          if(response.success){
            if(response.codeResult == 200){
              this.onCargarGrid(0);
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });
            }
            this.SpinnerService.hide();
          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut:2500
            });
            this.SpinnerService.hide();
          }
        },
        error:(error) => {
          this. SpinnerService.hide();
          this.toastr.error(error.message, 'Cerrar', {
            timeOut: 2500
          });
        }
      })
    }
  })
}

cerrar() {
  this.router.navigate(['ReporteNCListado'])
}

onCargarGrid(Resp_Id: number){
    console.log('entra al método ---');
    console.log('el codigo enviado es: ', Resp_Id);
    this.SpinnerService.show();
    this.responsables = [];
    this.serviceReporteNC.getObtenerResponsables(Resp_Id).subscribe({
      next: (response: any) => {
        console.log('entra al servicio del metodo');
        if(response.success){
          console.log('los elementos son: ', response.elements);
          if(response.totalElements > 0){
            console.log(response.elements);
            this.responsables = response.elements;
            this.dataSource.data = this.responsables;
            this.dataSource.sort = this.sort;
            this.SpinnerService.hide();
          }else{
            this.responsables = [];
            this.dataSource.data = [];
            this.SpinnerService.hide();
          }
        }else{
          this.responsables = [];
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    })
  }

}

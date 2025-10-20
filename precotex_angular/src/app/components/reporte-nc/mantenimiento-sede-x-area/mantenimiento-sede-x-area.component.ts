import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';


interface dataAreas {
  are_Id: number,
  are_Des: string,
  num_Planta: number,
  des_Planta: string

}

@Component({
  selector: 'app-mantenimiento-sede-x-area',
  templateUrl: './mantenimiento-sede-x-area.component.html',
  styleUrls: ['./mantenimiento-sede-x-area.component.scss']
})
export class MantenimientoSedeXAreaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  constructor(
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private serviceReporteNC: ReporteNCService,
    private toastr: ToastrService
  ) { }

  
  
  dataSource: MatTableDataSource<dataAreas> = new MatTableDataSource();
  ngOnInit(): void {
    this.onCargarGrid(0);
  }
  columnas: string[] = ['accion', 'codigo', 'descripcion', 'sede'];

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
  
  crearArea() {
    //DialogAreaNuevo
    this.router.navigate(['DialogAreaNuevo'],
      { queryParams: {
          accionR: 'I'
      }}
    );
  }

  cerrar(){
    this.router.navigate(['ReporteNCListado']);
  }

  editarArea(area: any) {
    console.log(area.are_Id);
    console.log(area.num_Planta);
    console.log(area.are_Des);
    let are_Id: number = area.are_Id;
    let num_Planta: number = area.num_Planta;
    let are_Des: number = area.are_Des;
    this.router.navigate(['DialogAreaNuevo'], 
      { queryParams: {
          accionR: 'U',
          are_IdR: are_Id,
          num_PlantaR: num_Planta,
          are_DesR: are_Des
      }}
    )
  }

  eliminarArea(id: number) {
    console.log('EL ITEM QUE SE ELIMINARÁ ES: ', id);
    Swal.fire({
            title: "¿Eliminar Área?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor:'#3085d6',
            cancelButtonColor:'#d33',
            confirmButtonText:'Si',
            cancelButtonText: 'No'
          }).then((result) =>{
            if(result.isConfirmed){    
      //  'MantenimientoAreaXSede'
      //    'DialogAreaNuevo'
              this.SpinnerService.show();
              this.serviceReporteNC.deleteEliminarArea(id).subscribe({
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

  areas = [];
  onCargarGrid(Are_Id: number){
    console.log('entra al método ---');
    console.log('el codigo enviado es: ', Are_Id);
    this.SpinnerService.show();
    this.areas = [];
    this.serviceReporteNC.getObtenerAreas(Are_Id).subscribe({
      next: (response: any) => {
        console.log('entra al servicio del metodo');
        if(response.success){
          console.log('los elementos son: ', response.elements);
          if(response.totalElements > 0){
            console.log(response.elements);
            this.areas = response.elements;
            this.dataSource.data = this.areas;
            this.dataSource.sort = this.sort;
            this.SpinnerService.hide();
          }else{
            this.areas = [];
            this.dataSource.data = [];
            this.SpinnerService.hide();
          }
        }else{
          this.areas = [];
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

interface dataReporte{
  rep_Id: string;
  rep_FecObs: string;
  rep_HorObs: string;
  cod_Planta_Tg: string;
  are_Id: number;
  rep_Esp: string;
  rep_Clas: string;
  rep_DesNC: string;
  rep_NivRgo: number;
  rep_AccCor: string;
  resp_Id: number;
  rep_RepPor: string;
  rep_Est: string;
  Rep_FecSub: string;
}

@Component({
  selector: 'app-reporte-nc-lst',
  templateUrl: './reporte-nc-lst.component.html',
  styleUrls: ['./reporte-nc-lst.component.scss']
})
export class ReporteNcLstComponent implements OnInit {
  
  @ViewChild(MatSort) sort!: MatSort;  
  constructor(
    private router: Router,
    private serviceReporteNC: ReporteNCService,
    private SpinnerService: NgxSpinnerService,
    private matSnackBar: MatSnackBar,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.onCargarGrid(0);
    console.log('Se carga el listado');
  }

  RegistrarNC(): void {
    this.onRedireccionarRegistro('I', '0');
  }

   // Columnas visibles en la tabla
  columnas: string[] = [
    'accion',
    'rep_Id',
    'rep_RepPor',
    'rep_FecObs',
    'resp_Id',
    'rep_Est',  
    'rep_FecSub'    
  ];

  // Datos simulados (puedes reemplazar con datos reales desde un servicio)
  reportes = [
    // {
    //   id: '#001',
    //   reportadoPor: 'Adam Smith',
    //   fechaObservacion: '05/01/2024',
    //   responsable: 'Lucas Graham',
    //   estado: 'Pendiente',
    //   fechaSubsanacion: 'Pendiente'
    // },
    // {
    //   id: '#002',
    //   reportadoPor: 'María López',
    //   fechaObservacion: '12/02/2024',
    //   responsable: 'Carlos Díaz',
    //   estado: 'Cerrado',
    //   fechaSubsanacion: '15/02/2024'
    // }
    // Puedes agregar más registros aquí
  ];


  dataSource: MatTableDataSource<dataReporte> = new MatTableDataSource();
  // reportes = [];
  onCargarGrid(Rep_ID: number){
    this.SpinnerService.show();
    this.reportes = [];
    this.serviceReporteNC.getListarRegistro(Rep_ID).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.reportes = response.elements;
            this.dataSource.data = this.reportes;
            this.dataSource.sort = this.sort;
            this.SpinnerService.hide();
          }else{
            this.reportes = [];
            this.dataSource.data = [];
            this.SpinnerService.hide();
          }
        }else{
          this.reportes = [];
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
  // Acciones de los botones
  ver(reporte: any): void {
    let rep_Id = reporte.rep_Id;
    this.onRedireccionarRegistroResolvedor(rep_Id);
    // Aquí puedes abrir un modal o navegar a la vista de detalle
  }

  editar(reporte: any): void {
    let rep_Id = reporte.rep_Id;
    this.onRedireccionarRegistro('U', rep_Id);
    // Aquí puedes navegar al formulario de edición
  }

  eliminar(reporte: any): void {
    console.log('Eliminar reporte:', reporte);
    // Aquí puedes mostrar confirmación y eliminar el registro
  }

  onRedireccionarRegistro(accion: string, rep_Id: string){
    this.router.navigate(['ReporteNC'], 
      { queryParams: {
          accionR: accion,
          rep_IdR: rep_Id
      }}
    )
  }

  onRedireccionarRegistroResolvedor(rep_Id: string){
    this.router.navigate(['ReporteNCResolvedor'], 
      { queryParams: {
          rep_IdR: rep_Id
      }}
    )
  }

  onAnular(reporte: any): void{
      let Rep_Id = reporte.rep_Id ?? 0;      
      console.log(Rep_Id);
      Swal.fire({
      title: "¿Desea Eliminar el Registro?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si',
      cancelButtonText: 'No'
      }).then((result) =>{
      if(result.isConfirmed){   

          let data: any = {
          "Rep_Id": Rep_Id,
          "Rep_Est": '4',
          };
          this.SpinnerService.show();
          this.serviceReporteNC.patchActualizarEstado(data).subscribe({
            next: (response: any) => {
              if(response.success){
                if(response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });
                }else if(response.codeResult == 201){
                  this.toastr.info(response.message, '', {
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



}

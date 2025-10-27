import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReporteNCService } from 'src/app/services/ReporteNC/reporte-nc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { GlobalVariable } from 'src/app/VarGlobals';
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
  rep_FecSub: string;
  resp_Nom: string;
}

interface FormDataBuscar {
  num_Planta: number;
  are_Id: number;
  resp_Id: number;
  niv_Rgo_Id: number;
  est_Id: number;
}

@Component({
  selector: 'app-reporte-nc-lst',
  templateUrl: './reporte-nc-lst.component.html',
  styleUrls: ['./reporte-nc-lst.component.scss']
})
export class ReporteNcLstComponent implements OnInit {
  sCod_Usuario: string = GlobalVariable.vusu;
  funcionUsuario: number = 0;
  @ViewChild(MatSort) sort!: MatSort;  
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  constructor(
    private router: Router,
    private serviceReporteNC: ReporteNCService,
    private SpinnerService: NgxSpinnerService,
    private matSnackBar: MatSnackBar,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.onGetFuncionUsuario(this.sCod_Usuario, (funcion) => {
      this.funcionUsuario = funcion;
      if(this.funcionUsuario !== 0){
        this.onGetSedes();
        this.onGetEstados();
        this.onGetResponsables(1);
        this.onGetCriticidades();
        this.onCargarGrid(0);
      }
    });
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  formDataBuscar: FormDataBuscar = {
    num_Planta: 0,
    are_Id: 0,
    resp_Id: 0,
    niv_Rgo_Id: 0,
    est_Id: 0
  }

  RegistrarNC(): void {
    this.onRedireccionarRegistro('I', '0');
  }

  onRedireccionarAreasXSede(){
    this.router.navigate(['MantenimientoAreaXSede']);
  }

  onRedireccionarResponsable(){
    this.router.navigate(['MantenimientoResponsables'])
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


  reportes = [];


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

  ver(reporte: any): void {
    let rep_Id = reporte.rep_Id;
    this.onRedireccionarRegistroResolvedor(rep_Id);
  }

  editar(reporte: any): void {
    let rep_Id = reporte.rep_Id;
    this.onRedireccionarRegistro('U', rep_Id);
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

  filtro = {
  sede: '0',
  area: '0',
  responsable: '0',
  criticidad: '0',
  estado: '0'
  };

  

//   filtrar(): void {
//   const { sede, area, responsable, criticidad, estado } = this.filtro;
    
//   this.dataSource.filterPredicate = (data: any, filter: string) => {
//     console.log('el valor que llega a resp_Id es: ', data.resp_Id);
//     console.log('el valor que llega a rep_est es: ', data.rep_Est);
//     return (!sede || data.cod_Planta_Tg === sede) &&
//           (!area || data.are_Id === area) &&
//           (!responsable || data.resp_Id === responsable) &&
//           (!criticidad || data.rep_NivRgo === criticidad) &&
//           (!estado || data.est_Des === estado);
//   };

//   this.dataSource.filter = JSON.stringify(this.filtro); // trigger filtering
// }

sedes= [];
onGetSedes(): void{
    this.SpinnerService.show();
    this.sedes = [];
    this.serviceReporteNC.getListarPlantas().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.sedes = response.elements;
            this.SpinnerService.hide();
          }else{
            this.sedes = [];
            this.SpinnerService.hide();
          }
        }else{
          this.sedes = [];
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

  onSedeSeleccionada(Num_Planta: number): void {
  // console.log('Sede seleccionada:', numPlanta);
  // this.filtro.sede = numPlanta;

  this.onGetAreaXSede(Num_Planta, 0);

  }

  areas = [];
  onGetAreaXSede(Num_Planta: number, Are_Id: number):void {
      this.SpinnerService.show();
      this.areas = [];
      this.serviceReporteNC.getObtenerAreaXSede(Num_Planta, Are_Id).subscribe({
        next: (response: any) => {
          if(response.success){
            if(response.totalElements > 0){
              this.areas = response.elements;
              this.SpinnerService.hide();
            }else{
              this.areas = [];
              this.SpinnerService.hide();
            }
          }else{
            this.areas = [];
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

    responsables = [];
    onGetResponsables(Resp_Id: number):void {
      this.SpinnerService.show();
      this.responsables = [];
      this.serviceReporteNC.getObtenerResponsables(Resp_Id).subscribe({
        next: (response: any) => {
          if(response.success){
            if(response.totalElements > 0){
              this.responsables = response.elements;
              this.SpinnerService.hide();
            }else{
              this.responsables = [];
              this.SpinnerService.hide();
            }
          }else{
            this.responsables = [];
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

  estados = [];
  onGetEstados():void {
      this.SpinnerService.show();
      this.estados = [];
      this.serviceReporteNC.getListarEstados().subscribe({
        next: (response: any) => {
          if(response.success){
            if(response.totalElements > 0){
              this.estados = response.elements;
              this.SpinnerService.hide();
            }else{
              this.estados = [];
              this.SpinnerService.hide();
            }
          }else{
            this.estados = [];
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

  criticidades= [];
  onGetCriticidades():void {
      this.SpinnerService.show();
      this.estados = [];
      this.serviceReporteNC.getListarRiesgos().subscribe({
        next: (response: any) => {
          if(response.success){
            if(response.totalElements > 0){
              this.criticidades = response.elements;
              this.SpinnerService.hide();
            }else{
              this.criticidades = [];
              this.SpinnerService.hide();
            }
          }else{
            this.criticidades = [];
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

  onBuscar(): void{
    let Num_Planta: number = 0;
    let Are_Id: number = 0;
    let Resp_Id: number = 0;
    let Rep_Niv_Rgo: number = 0;
    let Rep_Est: number = 0;

    const EnviarData: FormDataBuscar = {
      ...this.formDataBuscar,        
    };

    Num_Planta = EnviarData.num_Planta ?? 0;
    Are_Id = EnviarData.are_Id ?? 0;
    Resp_Id = EnviarData.resp_Id ?? 0;
    Rep_Niv_Rgo = EnviarData.niv_Rgo_Id ?? 0;
    Rep_Est = EnviarData.est_Id ?? 0;
    this.SpinnerService.show();
      this.reportes = [];
      this.serviceReporteNC.getBuscarRegistros(Num_Planta, Are_Id, Resp_Id, Rep_Niv_Rgo, Rep_Est).subscribe({
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

  funciones = [];
  onGetFuncionUsuario(sCod_Usuario: string, callback: (funcion: number) => void): void {
  this.SpinnerService.show();

  this.serviceReporteNC.getObtenerUsuarios(sCod_Usuario).subscribe({
    next: (response: any) => {
      this.SpinnerService.hide();
      if (response.success && response.totalElements > 0) {
        const funcion = response.elements[0].usr_Fun;
        console.log('La función del usuario es:', funcion);
        callback(funcion);
      } else {
        callback(0);
      }
    },
    error: (error) => {
      this.SpinnerService.hide();
      console.log(error.error.message, 'Cerrar', { timeout: 2500 });
      callback(0); 
    }
  });
}
}

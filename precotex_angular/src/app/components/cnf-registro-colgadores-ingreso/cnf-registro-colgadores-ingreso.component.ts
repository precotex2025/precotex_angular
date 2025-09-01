import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Console } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';

interface data_det {
  id_Tx_Ubicacion_Colgador     : number,
  cantidad_Cono : number,
  codigoBarra   : string,
  flg_Estatus    : string,
  fec_Registro    : string,
  nTotalColgadores     : number,
}

@Component({
  selector: 'app-cnf-registro-colgadores-ingreso',
  templateUrl: './cnf-registro-colgadores-ingreso.component.html',
  styleUrls: ['./cnf-registro-colgadores-ingreso.component.scss']
})
export class CnfRegistroColgadoresIngresoComponent implements OnInit {

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    SeccionGrupo_Consulta :   [''],
    Fec_Creacion          :   [''],
  })

  displayedColumns: string[] = ['tipUbi','totCol','fecha','estado','acciones']
  dataSource: MatTableDataSource<data_det>;

  @ViewChild('myinputAdd') inputAdd!: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private toastr     : ToastrService     ,
              private SpinnerService: NgxSpinnerService,
              private serviceColgadores: ProcesoColgadoresService,
              private router: Router
  ) { this.dataSource = new MatTableDataSource(); }


  ngAfterViewInit() {
    this.inputAdd.nativeElement.focus();
  } 

  ngOnInit(): void {

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    document.head.appendChild(link);

    this.onListarDisponibles();
  }

  clearDate(event: any) {
    event.stopPropagation();
    this.formulario.controls['Fec_Creacion'].setValue('')
  }

  applyEnterAdd(event: any) {
    this.AnadirColgadores()
  }   

  AnadirColgadores(){
    const codigoGrupo: string | null = this.formulario.get('SeccionGrupo_Consulta')?.value ?? null;

    if(!codigoGrupo || codigoGrupo.trim() === ''){
      this.toastr.info('Escanee codigo QR!', 'Cerrar', {
        timeOut: 2500,
         });
         return;
    } 
    
    this.onObtenerInfoUbicacionColgador(codigoGrupo);
  }

  onObtenerInfoUbicacionColgador(codigoBarra: string){
    this.SpinnerService.show();
    this.serviceColgadores.getObtenerUbicacionColgadorQR(codigoBarra).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              const id: string = response.elements[0].id_Tx_Ubicacion_Colgador;

              //Abrir dialog
              this.router.navigate(['/CnfRegistroColgadoresIngresoDetalle'], { queryParams: { id } });
              this.SpinnerService.hide();
          }
          else{
            this.formulario.get('SeccionGrupo_Consulta')?.patchValue('');
            this.inputAdd.nativeElement.focus(); // ✅
            this.toastr.info('Codigo QR, No existe', 'Cerrar', {
              timeOut: 2500,
              });            
            this.SpinnerService.hide();
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });      
  }

  onDetalleTipoUbi(data_det: any){
    const id: string = data_det["id_Tx_Ubicacion_Colgador"];
    this.router.navigate(['/CnfRegistroColgadoresIngresoDetalle'], { queryParams: { id } });
  }

  onListarDisponibles(){
    const fechaString: string = this.formulario.controls['Fec_Creacion']?.value?.toString()!;
    const fechaDate: Date = new Date(fechaString);   
    
    this.SpinnerService.show();
    this.serviceColgadores.getListadoTotalColgadoresxTipoUbicaciones(fechaDate).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.dataSource.data = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.dataSource.data = []
          }
          this.SpinnerService.hide();
        }        
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });    

  }

  Regresar(){
    this.router.navigate(['/CnfRegistroPresentacion']);
  }

}

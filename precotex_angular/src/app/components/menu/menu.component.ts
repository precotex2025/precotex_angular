import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service'
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolicitudMntoCreateComponent } from '../solicitud-mantenimiento-maquina/dialog-solicitud-mnto-create/dialog-solicitud-mnto-create.component';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';
import { ToastrService } from 'ngx-toastr';


interface Menu {
  Opcion: string,
  Des_Menu: string,
  Ruta_Opcion: string,
  Des_Opcion: string
}

interface IMenu {
  Opcion: string,
  Des_Menu: string,
  Ruta_Opcion: string,
  children: IMenuItem[]
}

interface IMenuItem {
  Opcion: string,
  Ruta_Opcion: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
 
})
export class MenuComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu
  Cod_Rol  = GlobalVariable.vCod_Rol
  Cod_Empresa = '07'

  //Nuevo
  sCod_Trabajador = GlobalVariable.vcodtra;
  sTip_Trabajador = GlobalVariable.vtiptra;  
  sNom_Usuario = "";
  sCod_Planta  = "";
  sCod_Espe    = "";
  
  menuList: Observable<IMenu[]>;
  objectKeys = Object.keys;

  Menu = []

  constructor(private matSnackBar: MatSnackBar,
    private loginService: LoginService,
    public router: Router,
    private dialog            : MatDialog            ,
    private serviceMemorandum : MemorandumGralService ,
    private registromantemaquinastej: RegistroManteMaquinasTejService   ,
    private toastr            : ToastrService

  ) {
  } 


  ngOnInit(): void {
    const currentUrl: string = this.router.url;
    let rolUsuario = GlobalVariable.vCod_Rol;
    this.loginService.getValidaAccesoRol(currentUrl, rolUsuario);

    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;

    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }

    this.MuestraMenu()  
    
    //Nuevo
    this.getInfoUsuarios();
    this.mostrarTejedor();
    this.ObtieneSedeByUser();    

  }

MuestraMenu(){
  this.Cod_Rol
  this.Cod_Empresa  
  this.loginService.MuestraMenu(
    this.Cod_Rol,
    this.Cod_Empresa
  ).subscribe(
    (result: any) => {
      this.Menu  = result || {};

      // Asegurar que la opción 'No Conformidades' aparezca dentro del módulo 'Control de Calidad'
      if (this.Menu) {
        if (!this.Menu['Control de Calidad']) {
          this.Menu['Control de Calidad'] = [];
        }
        const existe = this.Menu['Control de Calidad'].some((item: any) => 
          item.Ruta_Opcion === '/NoConformidades' || item.Opcion === 'No Conformidades'
        );
        if (!existe) {
          this.Menu['Control de Calidad'].push({
            Opcion: 'No Conformidades',
            Ruta_Opcion: '/NoConformidades',
            Des_Opcion: 'No Conformidades'
          });
        }
      }

      GlobalVariable.Global_menu = this.Menu;
      console.log(GlobalVariable.Global_menu);
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
}

CerrarSession(){
   //
   window.location.href = '/Precotex/#/'; 
   window.location.reload();
  /*GlobalVariable.vusu = ''
  this.router.navigate(['./']);*/
}

openDialogGenerateSolicitudMnto() {
    let dialogRef = this.dialog.open(DialogSolicitudMntoCreateComponent,{
      width:'500px',
      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "Nuevo",
        Accion : "I",
        sCod_Usuario : this.sCod_Usuario,
        sNom_Usuario : this.sNom_Usuario,
        sCod_Planta  : this.sCod_Planta,
        Datos  : null
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      //this.onGetSolicitudes()
    });  
}

getInfoUsuarios(){
  this.serviceMemorandum.getUsuario(this.sCod_Trabajador, this.sTip_Trabajador).subscribe(
    (result: any) => {
      if (result.totalElements > 0) {
        this.sCod_Usuario = result.elements[0].cod_Usuario;
        this.sNom_Usuario = result.elements[0].nom_Usuario;
        //this.sCod_Planta  = result.elements[0].cod_Planta;
      }
      else {
        this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 1500,
    }))        
}  

  mostrarTejedor() {

    //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
    let Cod_Trabajador=GlobalVariable.vcodtra;
    let Tip_Trabajador=GlobalVariable.vtiptra;
    //if (dni_tejedor.length===8) {
      console.log(Cod_Trabajador.length);
      this.registromantemaquinastej.traerTejedorTra(Cod_Trabajador, Tip_Trabajador).subscribe(
        (result: any) => {
          console.log(result);
           if (result[0].Respuesta == 'OK') {
            this.CargarEspecialidad(String(result[0].Nro_DocIde));
           }
         },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    //}
  }  

  CargarEspecialidad(dni: string) 
  {

    this.registromantemaquinastej.ListarEspecialidad(dni).subscribe(
      (result: any) => {
        this.sCod_Espe = result[0].Cod_Espe;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }  

  ObtieneSedeByUser(){
    this.registromantemaquinastej.getListaUsuarioSedeByUser().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.sCod_Planta = response.elements[0].num_Planta;
          }
          else{
            //Deshabilita los botones
            /*
            this.toastr.warning("Usuario sin configuración de SEDE.", 'Cerrar', {
            timeOut: 2500,
             });       
            */     
          }
        }        
      },
      error: (error) => {
        //this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }    


  RedireccionarAgendaTelefonica(): void {
    this.router.navigate(['/AgendaTelefonica']);
  }

}

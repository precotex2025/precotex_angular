import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service'
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';


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
  
   menuList: Observable<IMenu[]>;
   objectKeys = Object.keys;

  Menu = []

  constructor(private matSnackBar: MatSnackBar,
    private loginService: LoginService,
    public router: Router) {
  } 


  ngOnInit(): void {

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
  }




 
MuestraMenu(){
  this.Cod_Rol
  this.Cod_Empresa  
  this.loginService.MuestraMenu(
    this.Cod_Rol,
    this.Cod_Empresa
  ).subscribe(
    (result: any) => {
     this.Menu  = result
      GlobalVariable.Global_menu = result;
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

}

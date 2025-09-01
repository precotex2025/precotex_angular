import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalVariable } from './VarGlobals'; //<==== this one

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginService } from './services/login.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  hide = true;
  login_activo: boolean = true;
  usuario = ''
  ruta = ''

  userName:any = '';
  constructor(private loginService: LoginService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  @ViewChild('contraseña') inputContraseña!: ElementRef;



  ngOnInit(): void {
    this.login_activo = true;
    this.usuario = GlobalVariable.vusu;
    

    this.route.queryParams.subscribe(params => {
      if(params.usuario != undefined && params.usuario != ''){
        this.loginForm.patchValue({
          user: params.usuario,
          pass: params.password,
        });
        this.userName = params.usuario;
        this.ruta = params.ruta;
        this.validarUsuario();
      }
      // else if(params.Num_Planta == 1){
      //   console.log(params.Num_Planta);
      //   this.login_activo = false;
      // }
      //if(params.usuario
    });

    console.log(this.userName);

    
  }

  loginForm = this.formBuilder.group({
    user: ['', [Validators.required, Validators.minLength(3)]],
    pass: ['', [Validators.required, Validators.minLength(3)]]
  })

  get user() {
    return this.loginForm.get('user');
  }


  focusContra() {
    this.inputContraseña.nativeElement.focus()
  }
  testApi() {
    var data = {
      dni: this.loginForm.get('user').value,
      password: this.loginForm.get('pass').value,
    }
    this.loginService.validarUsuarioTest(data).subscribe(
      (result: any) => {
        console.log(result);
      });
  }
  validarUsuario() {
    //this.testApi();
    this.loginService.validarUsuario2(this.loginForm.value).subscribe(
      (result: any) => {

        console.log(result)
        //if (true) {
        if (result[0].resp == 'OK' || result == 'OK') {


          this.login_activo = false
          this.usuario = result[0].Nom_Usuario
          GlobalVariable.vusu = this.loginForm.get('user').value
          GlobalVariable.vcodtra = result[0].Cod_Trabajador
          GlobalVariable.vtiptra = result[0].Tip_Trabajador
          GlobalVariable.empresa = result[0].Empresa

          if(result[0].Empresa == 'ASISTENCIA'){
            //Se establece a 07 -> valor asignado a PRECOTEX-TEXTIL 2024Nov11, Ahmed
            //GlobalVariable.empresa = '03';
            GlobalVariable.empresa = '07';
          }else if(result[0].Empresa == 'VYD'){
            GlobalVariable.empresa = '56';
          }
          this.usuario = GlobalVariable.vusu
          GlobalVariable.vCod_Rol = result[0].Cod_Rol

          if(this.userName != undefined && this.userName != ''){
            this.router.navigate(['/' + this.ruta]);
          }
          //
        }
        else {
          this.matSnackBar.open('Datos Incorrectos!!', 'Cerrar', {
            duration: 1500,
          })
        }
      },
      err => this.matSnackBar.open(err, 'Cerrar', {
        duration: 1500,
      }))

  }

  ir_a() {
    this.router.navigate(['/menu']);
  }

}


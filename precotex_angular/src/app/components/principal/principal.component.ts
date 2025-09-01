import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GlobalVariable } from '../../VarGlobals'; //<==== this one

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  private sub: any;
  constructor(private router: Router, private route: ActivatedRoute) {

    if(GlobalVariable.vusu.length==0){
      this.router.navigate(['/']);
    }
  }

 ngOnInit(): void {
  
 }

}

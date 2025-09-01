import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';


interface Cod_Menu {
 
  Cod_Menu: number;
 
}

interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {



 /* @Input() items: Cod_Menu[];
  @Input() opcion: Opcion[];
  @ViewChild('childMenu') public childMenu;*/

  @Input() items: NavItem[];
  @ViewChild('childMenu') public childMenu;


  constructor(public router: Router) { }

  ngOnInit(): void {
    /*console.log('hola')
   console.log(this.items)
   console.log('hola')
   console.log(this.opcion)*/
   //console.log(this.childMenu)
  }

}

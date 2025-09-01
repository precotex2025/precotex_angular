import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckListService } from 'src/app/services/check-list.service';

@Component({
  selector: 'app-dialog-check-op',
  templateUrl: './dialog-check-op.component.html',
  styleUrls: ['./dialog-check-op.component.scss']
})
export class DialogCheckOpComponent implements OnInit {

  constructor(
    private matSnackBar: MatSnackBar,
    private checkListService: CheckListService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log(this.data);
  }

  ngOnInit(): void {
  }

}

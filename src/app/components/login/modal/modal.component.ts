import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginComponent } from '../login.component';

export interface DialogData {
  action: string;
  username: string;
  password: string;
  dob: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  public action: string;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.action = data.action;
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.action);
  }
}

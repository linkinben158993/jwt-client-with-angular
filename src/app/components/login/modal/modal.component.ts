import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginComponent } from '../login.component';

export interface DialogData {
  action: string;
  username: string;
  password: string;
  fullName: string;
  dob: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  public dynamicForm: FormGroup;
  public action: string;

  toppings = new FormControl();

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.action = data.action;
  }

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      additionalInfo: this.fb.array([])
    })
  }

  getAdditionalInfo(): FormArray {
    return this.dynamicForm.get('additionalInfo') as FormArray;
  }

  addInfo(): void {
    const info = this.fb.group({
      detail: []
    });

    this.getAdditionalInfo().push(info);
  }

  removeInfo(i): void {
    this.getAdditionalInfo().removeAt(i);
  } 

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.action);
  }
}

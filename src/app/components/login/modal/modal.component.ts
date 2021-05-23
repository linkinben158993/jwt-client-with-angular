import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginComponent } from '../login.component';

export interface DialogData {
  action: string;
  username: string;
  password: string;
  fullName: string;
  dob: string;
  additionalInfo: FormArray;
}

interface AdditionalInfo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  public dynamicForm: FormGroup;
  public action: string;

  addtionalInfo: AdditionalInfo[] = [
    { value: 'password', viewValue: 'Password' },
    { value: 'age', viewValue: 'Age' },
    { value: 'dob', viewValue: 'Date' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.action = data.action;
  }

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      additionalInfo: this.fb.array([])
    });
  }

  getAdditionalInfos(): FormArray {
    return this.dynamicForm.get('additionalInfo') as FormArray;
  }

  addInfo(): void {
    const info = this.fb.group({
      detail: '',
      selected: '',
    });

    this.getAdditionalInfos().push(info);
  }

  removeInfo(i): void {
    this.getAdditionalInfos().removeAt(i);
  }

  selectType(event: Event, i): void {
    const selected = (event.target as HTMLSelectElement).value;
    console.log(selected);
    this.getAdditionalInfos().at(i).setValue({
      detail: '',
      selected,
    });
    this.data.additionalInfo = this.getAdditionalInfos();
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.action);
  }
}

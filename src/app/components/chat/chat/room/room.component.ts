import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface Question {
  questionLabel: number;
  questionContent: string;
  formGroup: FormGroup;
  formGroupName: string;
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  isLinear = false;

  questionNumber: FormGroup;

  formGroup: FormGroup;
  questionsForm: FormArray;
  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.questionNumber = this.formBuilder.group({
      questionNumber: ['', Validators.required]
    });
    this.formGroup = this.formBuilder.group({
      questionsForm: this.formBuilder.array([])
    });
  }

  init(): FormGroup {
    return this.formBuilder.group({
      cont: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    });
  }

  addItem(): void {
    this.questionsForm = this.formGroup.get('questionsForm') as FormArray;
    if (this.questionsForm.length < 10) {
      this.questionsForm.push(this.init());
    }
  }

  setDynamicStep(): void {
    this.addItem();
  }

  resetSteps(): void {
    if (this.questionsForm) {
      this.questionsForm.clear();
    }
  }

  doneValue(stepperResult): void {
    console.log('Stepper response:', stepperResult);
  }
}

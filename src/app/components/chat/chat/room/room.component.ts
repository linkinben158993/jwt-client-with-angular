import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notificationService/notification.service';

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

  typesOfShoes: string[] = ['What the fuck is your problems mate?', 'CS:GO Is For Slavs?', 'Jazz Is The Jap?', 'Cowboy Bebop And Jazz?', `That's right mate?`];

  constructor(private formBuilder: FormBuilder, private message: NotificationService) {

  }

  ngOnInit(): void {
    this.questionNumber = this.formBuilder.group({
      questionNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
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

  addItem(numberOfQuestions: number): void {
    this.questionsForm = this.formGroup.get('questionsForm') as FormArray;
    for (let i = 0; i < numberOfQuestions; ++i) {
      if (this.questionsForm.length < 10) {
        this.questionsForm.push(this.init());
      }
      else {
        this.message.showNotification('Number of question should be less than 10!', 3);
        break;
      }
    }

  }

  setDynamicStep(): void {
    console.log('Something happened!');
    if (this.questionNumber.valid) {
      this.addItem(this.questionNumber.value.questionNumber);
    } else {
      this.message.showNotification('Invalid input!', 3);
    }
  }

  resetSteps(): void {
    if (this.questionsForm) {
      this.questionsForm.clear();
    }
  }

  doneValue(): void {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
    }
  }
}

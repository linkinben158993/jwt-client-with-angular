import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(message: string, duration: number): void {
    this.snackBar.open(message, 'Close Message', {
      duration: duration * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}

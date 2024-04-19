import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirmationsnackbar',
  templateUrl: './confirmationsnackbar.component.html',
  styleUrls: ['./confirmationsnackbar.component.css']
})
export class ConfirmationsnackbarComponent {
  constructor(
 
    public snackBarRef: MatSnackBarRef<ConfirmationsnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // do nothing.
  }

  actionConfirmed(): void {
    if (this.data.positive) {
  
    }
    this.snackBarRef.closeWithAction();
  }
}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    template: `
        <span mat-dialog-title>{{ data.question }}</span>
        <mat-dialog-actions>
            <button mat-button mat-dialog-close>Nie</button>
            <button mat-button [mat-dialog-close]="data.id">Tak</button>
      </mat-dialog-actions>
    `
})
export class ConfirmationDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Config) { }

}

interface Config {
    question: string;
    id: number
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-seat-dialog',
  templateUrl: './seat-dialog.component.html',
  styleUrls: ['./seat-dialog.component.css']
})
export class SeatDialogComponent {
  seats: string[][] = [
    ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'],
    ['A2', 'B2', 'C2', 'D2', 'E2', 'F2'],
    ['A3', 'B3', 'C3', 'D3', 'E3', 'F3'],
    ['A4', 'B4', 'C4', 'D4', 'E4', 'F4'],
    ['A5', 'B5', 'C5', 'D5', 'E5', 'F5'],
    ['A6', 'B6', 'C6', 'D6', 'E6', 'F6'],
  ];

  constructor(
    public dialogRef: MatDialogRef<SeatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedSeats: string[] }
  ) { }
  
  selectSeat(seat: string): void {
    this.dialogRef.close(seat);
  }

  onNoClick(): void {
    this.dialogRef.close(); // Cerrar el diálogo sin pasar ningún valor
  }




}

// src/app/material.module.ts
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator'; // Add this
import { MatSortModule } from '@angular/material/sort'; // Add this
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Add this
import { MatChipsModule } from '@angular/material/chips'; // Add this
import { MatTooltipModule } from '@angular/material/tooltip'; // Add this

@NgModule({
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule, // Add this
    MatSortModule, // Add this
    MatDialogModule,
    MatProgressSpinnerModule, // Add this
    MatChipsModule, // Add this
    MatTooltipModule // Add this
  ]
})
export class MaterialModule { }
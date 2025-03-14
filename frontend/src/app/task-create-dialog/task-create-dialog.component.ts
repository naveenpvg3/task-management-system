// src/app/task-create-dialog/task-create-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Task } from '../services/task.service';

@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Task' : 'Create New Task' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="taskForm">
        <mat-form-field appearance="fill" style="width: 100%">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title">
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="fill" style="width: 100%">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4"></textarea>
        </mat-form-field>
        
        <mat-checkbox formControlName="completed">Completed</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="taskForm.invalid" (click)="onSubmit()">
        {{ data ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      margin-bottom: 16px;
    }
  `]
})
export class TaskCreateDialogComponent implements OnInit {
  taskForm: FormGroup;
  
  constructor(
    private dialogRef: MatDialogRef<TaskCreateDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false]
    });
  }
  
  ngOnInit(): void {
    // If we have data, we're in edit mode, so populate the form
    if (this.data) {
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description,
        completed: this.data.completed
      });
    }
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }
}
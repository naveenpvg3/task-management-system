// src/app/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../services/task.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h2>Task List</h2>
        <button class="add-button" (click)="openAddTaskForm()">Add New Task</button>
      </div>
      
      <div *ngIf="isLoading" class="loading">Loading tasks...</div>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
      
      <div *ngIf="showForm" class="task-form">
        <h3>{{ editMode ? 'Edit Task' : 'Add New Task' }}</h3>
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" [(ngModel)]="newTask.title" required>
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" [(ngModel)]="newTask.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" [(ngModel)]="newTask.completed">
            Completed
          </label>
        </div>
        <div class="form-actions">
          <button (click)="cancelForm()">Cancel</button>
          <button (click)="saveTask()" [disabled]="!newTask.title">{{ editMode ? 'Update' : 'Save' }}</button>
        </div>
      </div>
      
      <div *ngIf="!isLoading && !errorMessage && tasks.length === 0" class="no-tasks">
        No tasks found. Start by adding a new task!
      </div>
      
      <div *ngIf="!isLoading && !errorMessage && tasks.length > 0">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of tasks">
              <td>{{ task.id }}</td>
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>
                <span [class.completed]="task.completed" [class.pending]="!task.completed">
                  {{ task.completed ? 'Completed' : 'Pending' }}
                </span>
              </td>
              <td class="actions">
                <button (click)="editTask(task)">Edit</button>
                <button (click)="toggleTaskStatus(task)">
                  {{ task.completed ? 'Mark Pending' : 'Mark Complete' }}
                </button>
                <button class="delete" (click)="deleteTask(task.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .add-button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .completed {
      color: green;
      font-weight: bold;
    }
    .pending {
      color: orange;
      font-weight: bold;
    }
    .delete {
      background-color: #f44336;
      color: white;
    }
    button {
      margin-right: 5px;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .actions {
      white-space: nowrap;
    }
    .loading, .error, .no-tasks {
      text-align: center;
      padding: 20px;
    }
    .error {
      color: red;
    }
    .task-form {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input[type="text"], .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-actions {
      text-align: right;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  errorMessage = '';
  showForm = false;
  editMode = false;
  
  newTask: Task = {
    title: '',
    description: '',
    completed: false
  };
  
  editTaskId?: number;

  constructor(
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
        console.log('Tasks loaded:', data);
      },
      error: (error) => {
        this.errorMessage = 'Error loading tasks. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching tasks:', error);
      }
    });
  }

  openAddTaskForm(): void {
    this.editMode = false;
    this.newTask = {
      title: '',
      description: '',
      completed: false
    };
    this.showForm = true;
  }

  editTask(task: Task): void {
    this.editMode = true;
    this.editTaskId = task.id;
    this.newTask = {
      title: task.title,
      description: task.description,
      completed: task.completed
    };
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  saveTask(): void {
    if (!this.newTask.title) return;
    
    if (this.editMode && this.editTaskId) {
      this.taskService.updateTask(this.editTaskId, this.newTask).subscribe({
        next: () => {
          this.showForm = false;
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.errorMessage = 'Error updating task. Please try again.';
        }
      });
    } else {
      this.taskService.addTask(this.newTask).subscribe({
        next: () => {
          this.showForm = false;
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.errorMessage = 'Error creating task. Please try again.';
        }
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.errorMessage = 'Error deleting task. Please try again.';
        }
      });
    }
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = {
      ...task,
      completed: !task.completed
    };
    
    this.taskService.updateTask(task.id!, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.errorMessage = 'Error updating task status. Please try again.';
      }
    });
  }
}
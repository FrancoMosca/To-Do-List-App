import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-task-modal.component.html',
})
export class AddTaskModalComponent implements OnInit{
  private readonly fb = inject(FormBuilder);
  private readonly _taskService = inject(TasksService);
  showModal = false;
  taskForm!: FormGroup;
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void{
    this.taskForm = this.fb.group({
      description: ['', [Validators.required]],   
    });
  }

  async onSubmit(): Promise<void> {
    const { description } = this.taskForm.value;
    const task = await this._taskService.formatTask(description);
  
    if (task) {
      this._taskService.addTask(task);
      this.toggleModal();
    } else {
      console.error('Task is undefined. Unable to add.');
    }
    
  }

  hasError(field: string): boolean {
    const fieldName = this.taskForm.get(field);
    return !!fieldName?.invalid && fieldName.touched;
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.taskForm.reset();
    }
  }

}

import { Component, Input, inject } from '@angular/core';
import { Task } from './models/Task';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  standalone: true
})
export class TaskComponent{
  @Input({required: true}) task!: Task;
  private readonly _taskService= inject(TasksService);

  deleteTask(taskid: string){
    this._taskService.deleteTask(taskid);
  }

  updateTask(taskId: string){
    this._taskService.toggleTaskStatus(taskId);
  }
}

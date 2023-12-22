import { Component, OnInit, inject } from '@angular/core';
import { TasksService } from './services/tasks.service';
import { Task } from './components/task/models/Task';
import { TaskComponent } from './components/task/task.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AddTaskModalComponent } from './components/add-task-modal/add-task-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [TaskComponent, SearchBarComponent, AddTaskModalComponent],
})
export class HomeComponent implements OnInit {
  public tasks: Task[] = [];

  public readonly _taskService = inject(TasksService);

  ngOnInit() {
    this._taskService.getTasks();
  }
}

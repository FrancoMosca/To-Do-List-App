import { Injectable, inject, signal } from '@angular/core';
import { Task } from '../components/task/models/Task';
import { StoreService } from '../../../shared/services/store.service';
import { AuthService } from '../../../pages/users/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly _storeService = inject(StoreService);
  private readonly _authService = inject(AuthService);
  private readonly _toastService = inject(ToastrService);

  public tasks = signal<Task[]>([]);

  private showToastMessage(message: string, isSuccess: boolean = true): void {
    const options = {
      progressBar: true,
      timeOut: 2000,
    };

    if (isSuccess) {
      this._toastService.success(message, 'Success', options);
    } else {
      this._toastService.error(message, 'Error');
    }
  }

  private updateTasksList(updatedTasks: Task[]): void {
    this.tasks.set(updatedTasks);
  }

  async getTasks(): Promise<void> {
    try {
      const userId = this._authService.currentUser()?.uid;
      if (!userId) {
        throw new Error('User ID not available.');
      }

      const usersTasks: Task[] = await this._storeService.getDocumentsWithQuery(
        'tasks',
        'uid',
        '==',
        userId
      );

      this.updateTasksList(usersTasks);
    } catch (error: any) {
      this.showToastMessage('Error fetching tasks:', false);
      console.error('Error fetching tasks:', error.message);
    }
  }

  async formatTask(description: string): Promise<Task | undefined> {
    try {
      const userId = this._authService.currentUser()?.uid;
      if (!userId || !description) {
        throw new Error('User ID or description missing.'); // Lanza una excepción si falta información
      }

      const newTask: Task = {
        uid: userId,
        description: description,
        active: true,
      };

      return newTask;
    } catch (error: any) {
      console.error('Error formatting task:', error.message);
      return undefined;
    }
  }

  async addTask(newTask: Task): Promise<void> {
    try {
      const task = await this._storeService.addDocument('tasks', newTask);
      this.tasks.update((old) => [...old, task]);
      this.showToastMessage('Task added');
    } catch (error: any) {
      this.showToastMessage('Error adding task: ', false);
    }
  }
  
  async deleteTask(taskId: string): Promise<void> {
    if (!taskId || taskId === '') {
      throw new Error('Task ID must not be null, undefined or empty string.');
    }
    try {
      this.removeTaskFromList(taskId);
      await this._storeService.deleteDocument('tasks', taskId);
      this.showToastMessage('Task deleted');
    } catch (error: any) {
      this.showToastMessage('Error deleting task: ', false);
      throw new Error(
        `Error deleting task with ID ${taskId}: ${error.message}`
      );
    }
  }

  private removeTaskFromList(taskId: string): void {
    this.tasks.update((old) => old.filter((task) => task.id !== taskId));
  }

  async getTask(taskId: string): Promise<Task | null> {
    return this._storeService.getDocument('tasks', taskId);
  }

  async updateTaskInStore(taskId: string, updatedTask: Task): Promise<void> {
    await this._storeService.updateDocument('tasks', taskId, updatedTask);
  }

  async toggleTaskStatus(taskId: string): Promise<void> {
    try {
      const task = await this.getTask(taskId);

      if (!task) {
        throw new Error(`Task with id ${taskId} does not exist.`);
      }

      const updatedTask = { ...task, active: !task.active };
      await this.updateTaskInStore(taskId, updatedTask);

      this.tasks.update((oldTasks) => {
        return oldTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        );
      });

      this._toastService.success('Task updated', 'Success', {
        progressBar: true,
        timeOut: 2000,
      });
    } catch (error) {
      console.error('Error al actualizar el task:', error);
      // Consider adding error handling or reporting here
      throw error;
    }
  }
}

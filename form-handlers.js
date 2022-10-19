import Task from './task.js';
import Folder from './folder.js';
import { folders } from './index.js';
import { closeModal } from './modal.js';
import { drawPageContent } from './dom.js';

export function newFolderFormHandler(e) {
  e.preventDefault();

  // Gather input value
  const folderName = document.querySelector('#folder-name').value;

  const folder = new Folder(folderName);

  folders.addFolder(folder);

  closeModal('folder');
}

export function newTaskFormHandler(e) {
  e.preventDefault();

  // Gather input values
  const taskTitle = document.querySelector('#task-title').value;
  const taskDesc = document.querySelector('#task-desc').value;
  const taskDueDate = document.querySelector('#task-duedate').value;
  const taskPriority = document.querySelector('#task-priority').value;

  const task = new Task(taskTitle, taskDesc, taskDueDate, taskPriority);
  const activeFolder = folders.getActiveFolder();
  activeFolder.addTask(task);

  closeModal('task');
}

export function editFolderFormHandler(e, folder) {
  e.preventDefault();

  folder.name = document.querySelector('#folder-name').value;
  folder.tab.querySelector('.tab-text').textContent = folder.name;

  if (folders.getActiveFolder() == folder) {
    document.querySelector('.page-heading').textContent = folder.name;
  }

  closeModal('folder');
}

export function editTaskFormHandler(e, task) {
  e.preventDefault();

  task.title = document.querySelector('#task-title').value;
  task.description = document.querySelector('#task-desc').value;
  task.dueDate = document.querySelector('#task-duedate').value;
  task.priority = document.querySelector('#task-priority').value;

  drawPageContent();

  closeModal('task');
}
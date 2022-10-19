import { 
  newFolderFormHandler, 
  newTaskFormHandler, 
  editFolderFormHandler, 
  editTaskFormHandler 
} from "./form-handlers.js";
import { convertDateToISO } from "./task.js";

const modalWrapper = document.querySelector('#modal-wrapper');
const newFolderButton = document.querySelector('#new-folder-btn');

function openModal(modalName) {
  const modalElem = document.querySelector(`#${modalName}-modal`);

  modalWrapper.classList.remove('hidden');
  modalElem.classList.remove('hidden');

  modalElem.querySelector('input:first-of-type').focus();

  modalElem.querySelector('button.cancel').onclick = () => 
  closeModal(modalName);

  modalWrapper.onclick = e => {
    if (e.target == modalWrapper) {
      closeModal(modalName);
    }
  }
}

export function closeModal(modalName) {
  const modalElem = document.querySelector(`#${modalName}-modal`);

  modalWrapper.classList.add('hidden');
  modalElem.classList.add('hidden');

  modalElem.reset();
}

export function setupModal(modalName, obj) {
  // if given an object, this is an edit
  // otherwise, this is a creation

  const modalElem = document.querySelector(`#${modalName}-modal`);

  if (obj) {
    modalElem.querySelector('.btn-main').textContent = 'Save';
    if (modalName == 'folder') {
      prefillFolderForm(obj);
      modalElem.onsubmit = (e) => editFolderFormHandler(e, obj);
    } else if (modalName == 'task') {
      prefillTaskForm(obj);
      modalElem.onsubmit = (e) => editTaskFormHandler(e, obj);
    }
  } else {
    if (modalName == 'folder') {
      modalElem.querySelector('.btn-main').textContent = 'Create Folder';
      modalElem.onsubmit = newFolderFormHandler;
    } else if (modalName == 'task') {
      modalElem.querySelector('.btn-main').textContent = 'Add Task';
      modalElem.querySelector('#task-duedate').value = 
      convertDateToISO(new Date());
      modalElem.onsubmit = newTaskFormHandler;
    }
  }

  openModal(modalName);
}

function prefillFolderForm(folder) {
  document.querySelector('#folder-name').value = folder.name;
}

function prefillTaskForm(task) {
  document.querySelector('#task-title').value = task.title;
  document.querySelector('#task-desc').value = task.description;
  document.querySelector('#task-duedate').value = task.dueDate;
  document.querySelector('#task-priority').value = task.priority;
}

newFolderButton.onclick = () => setupModal('folder');
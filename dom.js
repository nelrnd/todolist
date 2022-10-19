import { setupModal } from './modal.js';
import { folders } from './index.js';
import { convertDateToISO, formatTaskDueDate, sortTaskByDueDate } from './task.js';

export function createTaskElem(task) {
  const taskElem = document.createElement('div');
  const top = document.createElement('div');
  const extend = document.createElement('div');
  const checkbox = document.createElement('input');
  const titleWrapper = document.createElement('div');
  const title = document.createElement('p');
  const editButton = document.createElement('button');
  const removeButton = document.createElement('button');
  const editIcon = document.createElement('img');
  const removeIcon = document.createElement('img');
  const priority = document.createElement('p');
  const description = document.createElement('p');

  taskElem.classList.add('task');
  top.classList.add('task-top');
  extend.classList.add('task-extend');
  checkbox.classList.add('task-checkbox');
  titleWrapper.classList.add('task-title-wrapper');
  title.classList.add('task-title');
  priority.classList.add('task-priority');
  description.classList.add('task-description');
  editButton.classList.add('task-btn');
  removeButton.classList.add('task-btn');

  checkbox.type = 'checkbox';
  if (task.isDone) checkbox.checked = 'checked';

  title.textContent = task.title;
  priority.textContent = task.priority + ' priority';
  description.textContent = task.description;

  editIcon.src = './assets/edit-icon.svg';
  editIcon.alt = 'pencil';
  editButton.append(editIcon);

  removeIcon.src = './assets/remove-icon.svg';
  removeIcon.alt = 'trash';
  removeButton.append(removeIcon);

  checkbox.onchange = () => task.switchIsDone();
  titleWrapper.onclick = () => extendTaskElem(taskElem);
  editButton.onclick = () => setupModal('task', task);
  removeButton.onclick = () => {
    if (folders.getActiveFolder()) {
      folders.getActiveFolder().removeTask(task);
    } else {
      let folder = folders.getAllFolders().find(folder => folder.getTasks().includes(task));
      folder.removeTask(task);
    }
  }

  titleWrapper.append(title);
  top.append(checkbox, titleWrapper, editButton, removeButton);
  extend.append(priority, description);
  taskElem.append(top, extend);

  task.elem = taskElem;

  return taskElem;
}

function extendTaskElem(elem) {
  const extend = elem.querySelector('.task-extend');

  if (extend.style.maxHeight) {
    extend.style.maxHeight = null;
    elem.classList.remove('extended');
  } else {
    extend.style.maxHeight = extend.scrollHeight + 'px';
    elem.classList.add('extended');
  }
}

export function addTaskElem(task) {
  const taskElem = createTaskElem(task);
  document.querySelector('.main').append(taskElem);
}

export function removeTaskElem(task) {
  task.elem.remove();
}

function createFolderTab(folder) {
  const folderTab = document.createElement('li');
  const name = document.createElement('span');
  const editButton = document.createElement('button');
  const removeButton = document.createElement('button');
  const editIcon = document.createElement('img');
  const removeIcon = document.createElement('img');

  folderTab.classList.add('tab');
  name.classList.add('tab-text');
  editButton.classList.add('tab-btn');
  removeButton.classList.add('tab-btn');

  name.textContent = folder.name;

  editIcon.src = './assets/edit-icon.svg';
  editIcon.alt = 'pencil';
  editButton.append(editIcon);

  removeIcon.src = './assets/remove-icon.svg';
  removeIcon.alt = 'trash';
  removeButton.append(removeIcon);

  folderTab.onclick = () => {
    folders.setActiveFolder(folder);
    setActiveTab(folder.tab);
  };
  editButton.onclick = e => {
    e.stopPropagation();
    setupModal('folder', folder);
  };
  removeButton.onclick = e => {
    e.stopPropagation();
    folders.removeFolder(folder);
  };

  folderTab.append(name, editButton, removeButton);

  folder.tab = folderTab;

  return folderTab;
}

export function addFolderTab(folder) {
  const folderTab = createFolderTab(folder);
  const folderTabList = document.querySelector('#folder-tabs');
  folderTabList.append(folderTab);
}

export function removeFolderTab(folder) {
  folder.tab.remove();
}

export function setActiveTab(tab) {
  document.querySelectorAll('.tab').forEach(tab => {
    if (tab.classList.contains('active')) {
      tab.classList.remove('active');
    }
  });

  tab.classList.add('active');

  drawPageContent();
}

document.querySelectorAll('#home-tabs .tab').forEach(tab => {
  tab.onclick = () => {
    folders.setActiveFolder(null);
    setActiveTab(tab)
  };
});

export function drawPageContent() {
  const activeTab = document.querySelector('.tab.active');
  const pageContent = document.querySelector('.main');
  pageContent.innerHTML = null;

  const topBar = createPageTopBar();
  pageContent.append(topBar);

  let tasks;
  if (folders.getActiveFolder()) {
    tasks = getFolderTasks();
  } else if (activeTab.id == 'all-tasks') {
    tasks = getAllTasks();
  } else if (activeTab.id == 'today-tasks') {
    tasks = getTodayTasks();
  } else if (activeTab.id == 'week-tasks') {
    tasks = getWeekTasks();
  }
  drawTasks(tasks);
}

function getFolderTasks() {
  const tasks = folders.getActiveFolder().getTasks();
  const orderedTasks = sortTaskByDueDate(tasks);
  return orderedTasks;
}

function getAllTasks() {
  const allTasks = folders.getAllTasks();
  const orderedTasks = sortTaskByDueDate(allTasks);
  return orderedTasks;
}

function getTodayTasks() {
  const allTasks = getAllTasks();

  const today = new Date().toISOString().split('T')[0];

  const filteredTasks = allTasks.filter(task => task.dueDate == today);
  return filteredTasks;
}

function getWeekTasks() {
  const allTasks = getAllTasks();

  let today = new Date();
  let in7days = new Date();
  in7days.setDate(in7days.getDate() + 7);

  // Convert today and in7days dates to same format as task duedate
  today = convertDateToISO(today);
  in7days = convertDateToISO(in7days);

  const filteredTasks = allTasks.filter(task => {
    return task.dueDate >= today && task.dueDate <= in7days;
  });

  return filteredTasks;
}

function drawTasks(tasks) {
  const pageContent = document.querySelector('.main');

  tasks.forEach((task, index) => {
    const taskElem = createTaskElem(task);

    if (index == 0 || task.dueDate !== tasks[index - 1].dueDate) {
      const dayHeading = document.createElement('h2');
      dayHeading.classList.add('day-heading');
      dayHeading.textContent = 'For ' + formatTaskDueDate(task);
      pageContent.append(dayHeading);
    }

    pageContent.append(taskElem);
  });
}

function createPageTopBar() {
  const topBar = document.createElement('div');
  const heading = document.createElement('h1');
  const activeTab = document.querySelector('.tab.active');

  topBar.classList.add('top-bar');
  heading.classList.add('page-heading');

  heading.textContent = activeTab.textContent;

  topBar.append(heading);

  if (folders.getActiveFolder()) {
    const newTaskButton = document.createElement('button');
    newTaskButton.classList.add('btn-main');
    newTaskButton.textContent = 'New Task';
    newTaskButton.onclick = () => setupModal('task');
    topBar.append(newTaskButton);
  }

  return topBar;
}

function toggleMenu() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');

  if (sidebar.classList.contains('open')) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', closeMenu);
    });
  } else {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.removeEventListener('click', closeMenu);
    });
  }
}

function closeMenu() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.remove('open');
}

document.querySelector('#toggle-menu-button').onclick = toggleMenu;
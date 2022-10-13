class Task {
  constructor(title, desc, dueDate, priority) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isDone = false;
  }

  switchIsDone() {
    this.isDone = !this.isDone;
  }
}

class Folder {
  constructor(name) {
    this.arr = [];
    this.name = name;
  }

  getTasks() {
    return this.arr;
  }

  addTask(task) {
    this.arr.push(task);
    DOMStuff.addTask(task);
  }

  removeTask(task) {
    let taskIndex = this.arr.findIndex(item => item === task);
    this.arr.splice(taskIndex, 1);
  }
}

const folders = (function() {
  const arr = [];
  let currentFolder;

  const getFolders = () => arr;

  const getCurrentFolder = () => currentFolder;
  const setCurrentFolder = (folder) => {
    currentFolder = folder
    DOMStuff.setCurrentFolder(folder);
    DOMStuff.generateFolderPage(folder);
  };

  const addFolder = (name) => {
    const folder = new Folder(name);
    arr.push(folder);

    DOMStuff.addFolderTab(folder);
    setCurrentFolder(folder);
  };

  const removeFolder = (folder) => {
    let folderIndex = arr.findIndex(item => item === folder);
    arr.splice(folderIndex, 1);
  };

  return {
    getFolders,
    getCurrentFolder,
    setCurrentFolder,
    addFolder,
    removeFolder
  };
})();

const DOMStuff = (function() {
  const createTaskElement = (task) => {
    const elem = document.createElement('div');
    elem.classList.add('task');

    const bar = document.createElement('div');
    bar.classList.add('bar');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (task.isDone) checkbox.checked = true;

    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('task-title-wrapper');
    titleWrapper.addEventListener('click', function() {
      if (expandSection.style.maxHeight) {
        expandSection.style.maxHeight = null;
      } else {
        expandSection.style.maxHeight = expandSection.scrollHeight + 'px';
      }
    });

    const title = document.createElement('p');
    title.classList.add('task-title');
    title.textContent = task.title;
    titleWrapper.append(title);

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn-icon');
    const editBtnIcon = document.createElement('img');
    editBtnIcon.src = './assets/edit-icon.svg';
    editBtnIcon.alt = 'Edit icon';
    const editBtnText = document.createElement('p');
    editBtnText.classList.add('btn-icon-text');
    editBtnText.textContent = 'Edit';
    editBtn.append(editBtnIcon, editBtnText);
    editBtn.addEventListener('mouseover', function() {
      editBtnText.style.maxWidth = editBtnText.scrollWidth + 'px';
    });
    editBtn.addEventListener('mouseout', function() {
      editBtnText.style.maxWidth = null;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-icon');
    const deleteBtnIcon = document.createElement('img');
    deleteBtnIcon.src = './assets/delete-icon.svg';
    deleteBtnIcon.alt = 'Delete icon';
    const deleteBtnText = document.createElement('p');
    deleteBtnText.classList.add('btn-icon-text');
    deleteBtnText.textContent = 'Delete';
    deleteBtn.append(deleteBtnIcon, deleteBtnText);
    deleteBtn.addEventListener('mouseover', function() {
      deleteBtnText.style.maxWidth = deleteBtnText.scrollWidth + 'px';
    });
    deleteBtn.addEventListener('mouseout', function() {
      deleteBtnText.style.maxWidth = null;
    });

    bar.append(checkbox, titleWrapper, editBtn, deleteBtn);

    const expandSection = document.createElement('div');
    expandSection.classList.add('expand');

    const priority = document.createElement('p');
    priority.classList.add('priority');
    priority.textContent = task.priority + ' priority';

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.textContent = task.desc;

    expandSection.append(priority, desc);

    elem.append(bar, expandSection);

    return elem;
  };

  const addFolderTab = (folder) => {
    const tab = document.createElement('li');
    tab.textContent = folder.name;

    tab.addEventListener('click', () => folders.setCurrentFolder(folder));

    const tabs = document.getElementById('folder-tabs');
    tabs.insertBefore(tab, tabs.lastElementChild);
  };

  const setCurrentFolder = (folder) => {
    document.querySelectorAll('#folder-tabs li').forEach(li => {
      if (li.classList.contains('current')) {
        li.classList.remove('current');
      }
      if (li.textContent == folder.name) {
        li.classList.add('current');
      }
    });
  };

  const generateFolderPage = (folder) => {
    document.getElementById('current-folder-name').textContent = folder.name;

    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';

    if (folder.getTasks().length > 0) {
      folder.getTasks().forEach(task => {
        addTask(task);
      });
    }
  };

  const addTask = (task) => {
    const taskElem = createTaskElement(task);
    const taskList = document.getElementById('tasks');
    taskList.append(taskElem);
  };

  return {
    createTaskElement,
    addFolderTab,
    setCurrentFolder,
    generateFolderPage,
    addTask
  };
})();

// Modals Module

const modals = (function() {
  const openModal = (modal) => {
    const modalWrapper = document.getElementById('modal-wrapper');
    const modalElem = document.getElementById(`${modal}-modal`);

    modalWrapper.classList.remove('hidden');
    modalElem.classList.remove('hidden');

    if (modal == 'folder') {
      document.getElementById('folder-name').focus();
    } else if (modal == 'task') {
      document.getElementById('title').focus();
    }

    modalWrapper.onclick = (event) => {
      if (event.target === modalWrapper) {
        closeModal(modal);
      }
    };
  };

  const closeModal = (modal) => {
    const modalWrapper = document.getElementById('modal-wrapper');
    const modalElem = document.getElementById(`${modal}-modal`);

    modalWrapper.classList.add('hidden');
    modalElem.classList.add('hidden');

    modalElem.reset();

    modalWrapper.onclick = null;
  };

  const newFolderBtn = document.getElementById('new-folder-btn');
  newFolderBtn.addEventListener('click', () => openModal('folder'));

  const newTaskBtn = document.getElementById('new-task-btn');
  newTaskBtn.addEventListener('click', () => openModal('task'));

  const folderModalCancelBtn = document.querySelector('#folder-modal .cancel');
  folderModalCancelBtn.addEventListener('click', () => closeModal('folder'));

  const taskModalCancelBtn = document.querySelector('#task-modal .cancel');
  taskModalCancelBtn.addEventListener('click', () => closeModal('task'));

  return {closeModal};
})();

// Form Handlers Module

const formHandlers = (function() {
  const folderFormHandler = (event) => {
    event.preventDefault();

    const folderName = document.getElementById('folder-name').value;
    folders.addFolder(folderName);

    modals.closeModal('folder');
  };

  const taskFormHandler = (event) => {
    event.preventDefault();

    // Gather inputs values
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const dueDate = document.getElementById('duedate').value;
    const priority = document.getElementById('priority').value;

    const task = new Task(title, desc, dueDate, priority);
    folders.getCurrentFolder().addTask(task);

    modals.closeModal('task');
  };

  const folderForm = document.querySelector('form#folder-modal');
  folderForm.addEventListener('submit', folderFormHandler);

  const taskForm = document.querySelector('form#task-modal');
  taskForm.addEventListener('submit', taskFormHandler);
})();
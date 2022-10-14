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
    currentFolder = folder;
    if (folder) {
      DOMStuff.setCurrentFolder(folder);
      DOMStuff.generateFolderPage(folder);
    }
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
    if (currentFolder == folder) {
      if (getFolders().length > 0) {
        setCurrentFolder(getFolders()[0]);
        DOMStuff.generateFolderPage(getCurrentFolder());
      } else {
        setCurrentFolder(null);
        DOMStuff.emptyPage();
      }
    };

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
    checkbox.addEventListener('change', () => task.switchIsDone());

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
    editBtn.addEventListener('click', () => modals.openTaskModal(task));

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
    deleteBtn.addEventListener('click', () => {
      folders.getCurrentFolder().removeTask(task);
      removeTask(elem);
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

    const text = document.createElement('p');
    text.textContent = folder.name;

    const editBtn = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.src = './assets/edit-icon.svg';
    editIcon.alt = 'Folder edit name icon';
    editBtn.append(editIcon);
    editBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      modals.openFolderModal(folder);
    });

    const deleteBtn = document.createElement('button');
    const deleteIcon = document.createElement('img');
    deleteIcon.src = './assets/delete-icon.svg';
    deleteIcon.alt = 'Delete folder icon';
    deleteBtn.append(deleteIcon);
    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      folders.removeFolder(folder);
      tab.remove();
    });

    tab.append(text, editBtn, deleteBtn);

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

  const generateFolderTabs = () => {
    document.querySelectorAll('#folder-tabs li').forEach(li => {
      if (li.id != 'new-folder-btn') {
        li.remove();
      }
    });
    folders.getFolders().forEach(folder => addFolderTab(folder));
    setCurrentFolder(folders.getCurrentFolder());
  };

  const generateFolderPage = (folder) => {
    document.querySelector('.main').innerHTML = '';
    createTopBar(folder);

    const tasks = document.createElement('div');
    tasks.id = 'tasks';

    document.querySelector('.main').append(tasks);

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

  const removeTask = (elem) => {
    elem.remove();
  };

  const emptyPage = () => {
    document.querySelector('.main').innerHTML = null;
  };

  const createTopBar = (folder) => {
    const topBar = document.createElement('div');
    topBar.classList.add('main-top-bar');

    const heading = document.createElement('h1');
    heading.id = 'current-folder-name';
    if (folder) heading.textContent = folder.name;
    topBar.append(heading);

    if (folder) {
      const addTaskBtn = document.createElement('button');
      addTaskBtn.id = 'new-task-btn';
      addTaskBtn.classList.add('btn-main');
      addTaskBtn.textContent = 'New Task';
      addTaskBtn.addEventListener('click', () => modals.openTaskModal());
      topBar.append(addTaskBtn);
    }

    document.querySelector('.main').append(topBar);
  };

  return {
    createTaskElement,
    addFolderTab,
    setCurrentFolder,
    generateFolderPage,
    generateFolderTabs,
    addTask,
    emptyPage
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

  const openTaskModal = (task) => {
    const taskForm = document.querySelector('form#task-modal');

    const mindate = new Date().toISOString().split('T')[0];
    document.getElementById('duedate').value = mindate;

    if (task) {
      taskForm.querySelector('.btn-main').textContent = 'Save';

      // Populate input fields with task data
      document.getElementById('title').value = task.title;
      document.getElementById('desc').value = task.desc || '';
      document.getElementById('duedate').value = task.dueDate || '';
      document.getElementById('priority').value = task.priority || '';

      taskForm.onsubmit = function(event) {
        event.preventDefault();
        formHandlers.taskFormHandler(task);
      };
    } else {
      taskForm.querySelector('.btn-main').textContent = 'Add task';

      taskForm.onsubmit = function(event) {
        event.preventDefault();
        formHandlers.taskFormHandler();
      };
    }
    openModal('task');
  };

  const openFolderModal = (folder) => {
    const folderForm = document.querySelector('form#folder-modal');

    if (folder) {
      folderForm.querySelector('.btn-main').textContent = 'Save';

      document.getElementById('folder-name').value = folder.name;

      folderForm.onsubmit = function(event) {
        event.preventDefault();
        formHandlers.folderFormHandler(folder);
      };
    } else {
      folderForm.querySelector('.btn-main').textContent = 'Create Folder';

      folderForm.onsubmit = function(event) {
        event.preventDefault();
        formHandlers.folderFormHandler();
      };
    }
    openModal('folder');
  };

  const newFolderBtn = document.getElementById('new-folder-btn');
  newFolderBtn.addEventListener('click', () => openFolderModal());

  const newTaskBtn = document.getElementById('new-task-btn');
  newTaskBtn.addEventListener('click', () => openTaskModal());

  const folderModalCancelBtn = document.querySelector('#folder-modal .cancel');
  folderModalCancelBtn.addEventListener('click', () => closeModal('folder'));

  const taskModalCancelBtn = document.querySelector('#task-modal .cancel');
  taskModalCancelBtn.addEventListener('click', () => closeModal('task'));

  return {closeModal, openTaskModal, openFolderModal};
})();

// Form Handlers Module

const formHandlers = (function() {
  const folderFormHandler = (folder) => {
    const folderName = document.getElementById('folder-name').value;

    if (folder) {
      folder.name = folderName;

      DOMStuff.generateFolderTabs();
      
      DOMStuff.generateFolderPage(folders.getCurrentFolder());
    } else {
      folders.addFolder(folderName);
    }

    modals.closeModal('folder');
  };

  const taskFormHandler = (task) => {
    // Gather inputs values
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const dueDate = document.getElementById('duedate').value;
    const priority = document.getElementById('priority').value;

    if (task) {
      task.title = title;
      task.desc = desc;
      task.dueDate = dueDate;
      task.priority = priority;

      DOMStuff.generateFolderPage(folders.getCurrentFolder());
    } else {
      const task = new Task(title, desc, dueDate, priority);
      folders.getCurrentFolder().addTask(task);
    }

    modals.closeModal('task');
  };

  return {
    taskFormHandler,
    folderFormHandler
  }
})();

folders.addFolder('Default');
folders.getCurrentFolder().addTask(new Task('Make Coffee', '', '', 'medium'));

window.addEventListener('load', () => {
  // Set minimum date input and value to today
  const mindate = new Date().toISOString().split('T')[0];
  document.getElementById('duedate').min = mindate;
  document.getElementById('duedate').value = mindate;
});
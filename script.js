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

class List {
  constructor(name) {
    this.arr = [];
    this.name = name;
  }

  addTask(task) {
    this.arr.push(task);
  }

  removeTask(task) {
    let taskIndex = this.arr.findIndex(item => item === task);
    this.arr.splice(taskIndex, 1);
  }
}

const DOMStuff = (function() {
  const getFormValues = () => {
    let title = document.getElementById('title').value;
    let desc = document.getElementById('desc').value;
    let date = document.getElementById('date').value;
    let priority = document.getElementById('priority').value;

    return [title, desc, date, priority];
  };

  const clearFormValues = () => form.reset();

  const handleFormSubmit = () => {
    const formValues = getFormValues();
    const task = new Task(...formValues);
    list.addTask(task);

    const htmlTask = createHtmlTask(task);
    document.getElementById('list').append(htmlTask);
    
    clearFormValues();
  };

  const createHtmlTask = (task) => {
    const elem = document.createElement('li');
    elem.textContent = task.title;
    return elem;
  };

  return {
    handleFormSubmit
  };
})();


const form = document.getElementById('form');
form.addEventListener('submit', event => {
  event.preventDefault();
  DOMStuff.handleFormSubmit();
});
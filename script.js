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


// Tests

const list = new List('main');

const task1 = new Task(
  'Cook', 
  'Cook the meal for tonight', 
  'today',
  1
);
const task2 = new Task(
  'Go running', 
  'Run around the neighborhood for 15min', 
  'tommorow',
  3
);
const task3 = new Task(
  'Call Paul', 
  'Tell Paul about my project idea',
  'tommorow',
  2
);

list.addTask(task1);
list.addTask(task2);
list.addTask(task3);

console.log(list.arr);

task1.switchIsDone();
list.removeTask(task2);
console.log(list.arr);
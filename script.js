class Task {
  constructor(title, desc, dueDate) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.isDone = false;
  }

  switchIsDone() {
    this.isDone = !this.isDone;
  }
}

const list = (function() {
  const arr = [];

  const getList = () => arr;
  const addTask = (task) => arr.push(task);
  const removeTask = (task) => {
    let taskIndex = arr.findIndex(item => item === task);
    arr.splice(taskIndex, 1);
  };

  return {
    getList,
    addTask,
    removeTask
  };
})();

const task1 = new Task(
  'Cook', 
  'Cook the meal for tonight', 
  'today'
);
const task2 = new Task(
  'Go running', 
  'Run around the neighborhood for 15min', 
  'tommorow'
);
const task3 = new Task(
  'Call Paul', 
  'Tell Paul about my project idea',
  'tommorow'
);

// Tests

list.addTask(task1);
list.addTask(task2);
list.addTask(task3);

console.log(list.getList());

task1.switchIsDone();
list.removeTask(task2);
console.log(list.getList());
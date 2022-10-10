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
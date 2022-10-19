import { drawPageContent } from "./dom.js";

export default class Folder {
  constructor(name) {
    this.arr = [];
    this.name = name;
  }

  getTasks() {
    return this.arr;
  }

  addTask(task) {
    this.arr.push(task);
    drawPageContent();
  }

  removeTask(task) {
    let taskIndex = this.arr.findIndex(item => item == task);
    this.arr.splice(taskIndex, 1);
    drawPageContent();
  }
}
export default class Task {
  constructor(title, desc, dueDate, priority) {
    this.title = title;
    this.description = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isDone = false;
  }

  switchIsDone() {
    this.isDone = !this.isDone;
  }
}

export function sortTaskByDueDate(tasks) {
  return tasks.sort((a,b) => a.dueDate == b.dueDate ? 0 : a.dueDate > b.dueDate ? 1 : -1);
}

export function formatTaskDueDate(task) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

  let today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Convert today and tomorrow dates to same format as task duedate
  today = convertDateToISO(today);
  tomorrow = convertDateToISO(tomorrow);

  if (task.dueDate == today) {
    return 'today';
  } else if (task.dueDate == tomorrow) {
    return 'tomorrow';
  } else {
    const taskDate = new Date(task.dueDate);
    return `${days[taskDate.getDay()]}, ${months[taskDate.getMonth()]} ${task.dueDate.split('-')[2]}`;
  }
}

export function convertDateToISO(date) {
  return date.toISOString().split('T')[0];
}
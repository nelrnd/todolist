import { updateStorage } from './index.js';

export default class Task {
  constructor(title, desc, dueDate, priority, isDone) {
    this.title = title;
    this.description = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isDone = isDone || false;
  }

  switchIsDone() {
    this.isDone = !this.isDone;
    updateStorage();
  }
}

export function sortTasks(tasks) {
  return tasks.sort((a, b) => {
    if (a.dueDate !== b.dueDate) {
      if (a.dueDate > b.dueDate) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (a.priority > b.priority) {
        return -1;
      } else if (a.priority < b.priority) {
        return 1;
      } else {
        return 0;
      }
    }
  });
}

export function formatTaskDueDate(task) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

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
    return `${days[taskDate.getDay()]}, ${months[taskDate.getMonth()]} ${
      task.dueDate.split('-')[2]
    }`;
  }
}

export function convertDateToISO(date) {
  return date.toISOString().split('T')[0];
}

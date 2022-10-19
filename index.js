import Task, { convertDateToISO } from './task.js';
import Folder from './folder.js';
import { addFolderTab, removeFolderTab, setActiveTab } from './dom.js';
import './modal.js';

export const folders = (function() {
  const list = [];

  let activeFolder = null;

  function getActiveFolder() {
    return activeFolder;
  }

  function setActiveFolder(folder) {
    activeFolder = folder;
  }

  function getAllFolders() {
    return list;
  }

  function getAllTasks() {
    const allTasks = [];
    list.forEach(folder => {
      folder.getTasks().forEach(task => {
        allTasks.push(task);
      });
    });
    return allTasks;
  }

  function addFolder(folder) {
    list.push(folder);
    addFolderTab(folder);
  }

  function removeFolder(folder) {
    let folderIndex = list.findIndex(item => item == folder);
    list.splice(folderIndex, 1);
    removeFolderTab(folder);

    if (folder == activeFolder) {
      if (list.length > 0) {
        setActiveFolder(list[0]);
        setActiveTab(list[0].tab);
      } else {
        setActiveFolder(null);
        setActiveTab(document.querySelector('#home-tabs .tab:first-of-type'));
      }
    }
  }

  return {
    getActiveFolder, 
    setActiveFolder,
    getAllFolders,
    getAllTasks, 
    addFolder, 
    removeFolder
  };
})();

window.addEventListener('load', () => {
  let todayDate = new Date();
  todayDate = convertDateToISO(todayDate);
  document.querySelector('input#task-duedate').min = todayDate;
});

// For demonstration purpose

const folder1 = new Folder('Work');
const folder2 = new Folder('Life');

folders.addFolder(folder1);
folders.addFolder(folder2);

folders.setActiveFolder(folder1);
setActiveTab(folder1.tab);

folder1.addTask(new Task(
  'Finish to-do list project',
  'Make to-do list app fully functional',
  convertDateToISO(new Date()),
  'high'
));

folder2.addTask(new Task(
  'Build a cabin in the forest',
  '',
  '2022-10-25',
  'mid'
));
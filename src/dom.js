import "./style.css";
import pencil from "./icons/pencil-outline.svg";
import trashCan from "./icons/trash-can-outline.svg";
import {
  ToDo,
  categories,
  addCategory,
  removeCategory,
  addTaskToList,
  removeTaskFromList,
} from "./index";

const categoriesDiv = document.querySelector(".categories");
const tasksDiv = document.querySelector(".tasks");
const newList = document.querySelector(".new-list");
const newTask = document.querySelector(".new-task");
const allTasks = document.querySelector(".all");

const dialog = document.querySelector("dialog");
const form = document.querySelector("form");
const title = document.querySelector("#title");
const desc = document.querySelector("#desc");
const dueDate = document.querySelector("#due-date");
const priority = document.querySelector("#priority");
const submit = document.querySelector("#submit");
const initialText = submit.textContent;
const cancel = document.querySelector("#cancel");

let isEditing = false;
let currentTask;

function displayTasks(obj, key) {
  for (const task of obj[key]) {
    if (tasksDiv.querySelector(`[data-id="${task.id}"]`)) continue;
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.setAttribute("data-id", task.id);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", () => {
      task.changeCompleteness();
      localStorage.setItem("todo", JSON.stringify(categories));
    });
    if (task.completeness === "done") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }

    const taskWrapper = document.createElement("div");
    const taskTitle = createElementWithClass("div", "task-title");
    taskTitle.textContent = task.title;
    const taskDueDate = createElementWithClass("div", "task-date");
    taskDueDate.textContent = task.formattedDate;
    taskWrapper.append(taskTitle, taskDueDate);

    const container = document.createElement("div");
    container.classList.add("eddel");

    const editButton = document.createElement("button");
    const edit = document.createElement("img");
    edit.src = pencil;
    editButton.appendChild(edit);
    editButton.addEventListener("click", () => {
      isEditing = true;
      currentTask = task;
      populateFormData(task);
      submit.textContent = "Save";
      dialog.showModal();
    });

    const delButton = document.createElement("button");
    const del = document.createElement("img");
    del.src = trashCan;
    delButton.appendChild(del);
    delButton.addEventListener("click", () => {
      removeTaskFromList(key, taskDiv);
      taskDiv.remove();
    });

    container.append(editButton, delButton);

    taskDiv.append(checkbox, taskWrapper, container);
    tasksDiv.insertBefore(taskDiv, newTask);
  }
}

const displayedKeys = new Set();
let currentCategory;

function display() {
  for (const key in categories) {
    if (displayedKeys.has(key)) continue;
    const listDiv = createElementWithClass("div", "list-div");
    const list = createElementWithClass("button", "list");
    list.textContent = key;
    listDiv.appendChild(list);
    categoriesDiv.insertBefore(listDiv, newList);
    list.addEventListener("click", () => {
      currentCategory = list.textContent;
      tasksDiv.replaceChildren(newTask);
      displayTasks(categories, list.textContent);
    });
    listDiv.addEventListener("mouseenter", () => {
      const delButton = document.createElement("button");
      const del = document.createElement("img");
      del.src = trashCan;
      delButton.appendChild(del);
      delButton.addEventListener("click", () => {
        removeCategory(key);
        displayedKeys.delete(key);
        listDiv.remove();
        tasksDiv.replaceChildren(newTask);
      });
      listDiv.appendChild(delButton);
    });
    listDiv.addEventListener("mouseleave", () => {
      listDiv.removeChild(listDiv.lastElementChild);
    });
    displayedKeys.add(key);

    displayTasks(categories, key);
  }
}

function displayAllTasks() {
  for (const key in categories) {
    displayTasks(categories, key);
  }
}

allTasks.addEventListener("click", () => {
  displayAllTasks();
  tasksDiv.removeChild(newTask);
});

function populateFormData(task) {
  title.value = task.title;
  desc.value = task.desc;
  dueDate.value = task.dueDate;
  priority.value = task.priority;
}

function updateTask(task, e) {
  e.preventDefault();
  const formData = new FormData(form);
  for (const [key, value] of formData) {
    task[key] = value;
  }
  const taskDiv = document.querySelector(`[data-id="${task.id}"]`);
  if (taskDiv) {
    taskDiv.querySelector(".task-title").textContent = task.title;
    taskDiv.querySelector(".task-date").textContent = task.formattedDate;
  }
  localStorage.setItem("todo", JSON.stringify(categories));
  form.reset();
  dialog.close();
}

newTask.addEventListener("click", () => {
  isEditing = false;
  submit.textContent = initialText;
  dialog.showModal();
});

cancel.addEventListener("click", () => {
  form.reset();
  dialog.close();
});

form.addEventListener("submit", (e) => {
  if (!isEditing) {
    addTask(e);
  } else if (isEditing && currentTask) {
    updateTask(currentTask, e);
  }
});

function addTask(e) {
  e.preventDefault();
  const task = new ToDo(title.value, desc.value, dueDate.value, priority.value);
  addTaskToList(currentCategory, task);
  displayTasks(categories, currentCategory);
  form.reset();
  dialog.close();
}

newList.addEventListener("click", addList);

function addList() {
  const input = document.createElement("input");
  input.setAttribute("type", "text");

  categoriesDiv.replaceChild(input, newList);

  input.focus();

  function onBlur() {
    if (categoriesDiv.contains(input)) {
      categoriesDiv.replaceChild(newList, input);
    }
  }

  input.addEventListener("blur", onBlur);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && input.value.trim() !== "") {
      addCategory(input.value);
      input.removeEventListener("blur", onBlur);
      categoriesDiv.replaceChild(newList, input);
      tasksDiv.replaceChildren(newTask);
      currentCategory = input.value;
      display();
    }
  });
}

function createElementWithClass(element, className) {
  const newElement = document.createElement(element);
  newElement.classList.add(className);

  return newElement;
}

display();

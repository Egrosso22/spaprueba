const todoList = document.getElementById("todo-list");
const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const prioritySelect = document.getElementById("priority-select");
const categorySelect = document.getElementById("category-select");
const filterPriority = document.getElementById("filter-priority");
const filterCategory = document.getElementById("filter-category");

addButton.addEventListener("click", onClickAdd);
input.addEventListener("input", onTypeTodo);
filterPriority.addEventListener("change", filterTodos);
filterCategory.addEventListener("change", filterTodos);

document.addEventListener("DOMContentLoaded", loadTodos);

function onClickAdd() {
  const todo = {
    text: input.value,
    priority: prioritySelect.value,
    category: categorySelect.value
  };

  const li = createListItem(todo);
  todoList.appendChild(li);
  saveTodoToLocal(todo);
  input.value = "";
  addButton.disabled = true;
}

function onTypeTodo() {
  addButton.disabled = input.value.length === 0;
}

function createListItem(todo) {
  const listItem = document.createElement("li");
  const heading = document.createElement("span");
  heading.textContent = `${todo.text} [${todo.priority}] [${todo.category}]`;

  const completeButton = document.createElement("button");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  listItem.classList.add("todo-item");
  listItem.classList.add(todo.priority);
  listItem.dataset.category = todo.category;

  completeButton.textContent = "Complete";
  completeButton.classList.add("complete-button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");

  completeButton.addEventListener("click", onClickComplete);
  deleteButton.addEventListener("click", onClickDelete);
  editButton.addEventListener("click", onClickEdit);

  listItem.appendChild(heading);
  listItem.appendChild(completeButton);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

function onClickComplete() {
  const listItem = this.parentNode;
  const heading = listItem.querySelector("span");
  heading.style.textDecoration = "line-through";
}

function onClickDelete() {
  const listItem = this.parentNode;
  listItem.remove();
  removeTodoFromLocal(listItem);
}

function onClickEdit() {
  const listItem = this.parentNode;
  const heading = listItem.querySelector("span");
  const newText = prompt("Edit your task", heading.textContent);

  if (newText) {
    heading.textContent = newText;
  }
}

function saveTodoToLocal(todo) {
  let todos = localStorage.getItem("todos");
  todos = todos ? JSON.parse(todos) : [];
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  let todos = localStorage.getItem("todos");
  todos = todos ? JSON.parse(todos) : [];

  todos.forEach(todo => {
    const li = createListItem(todo);
    todoList.appendChild(li);
  });
}

function removeTodoFromLocal(listItem) {
  let todos = localStorage.getItem("todos");
  todos = todos ? JSON.parse(todos) : [];
  const updatedTodos = todos.filter(todo => {
    return !listItem.querySelector("span").textContent.includes(todo.text);
  });
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

function filterTodos() {
  const priority = filterPriority.value;
  const category = filterCategory.value;

  Array.from(todoList.children).forEach(item => {
    const matchesPriority = priority === "all" || item.classList.contains(priority);
    const matchesCategory = category === "all" || item.dataset.category === category;

    if (matchesPriority && matchesCategory) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
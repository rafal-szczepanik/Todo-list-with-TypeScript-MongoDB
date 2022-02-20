const inputValue = document.querySelector('.add-text');
const taskConfirmForm = document.querySelector('.form');
const listContainer = document.querySelector('.list');
const listItem = document.querySelector('.list-item');
const taskConfirmBtn = document.querySelector(".task-btn");
const editTaskWindow = document.querySelector('.task-edit-wrapper');
const form = document.querySelector('.task-edit-container form');
const formTaskId = document.querySelector('.task-id');
const textArea = document.querySelector('textarea');
const tasksNumber = document.querySelector(".tasks-number");
const tasksToDoNumber = document.querySelector(".tasks-todo-number");
const searchBar = document.querySelector('.search');

const fetchedAllElements = async () => {
  const response = await fetch('/api/v1/tasks/');
  const {tasks} = await response.json();
  return tasks;
};

const fetchedElement = async (id) => {
  const response = await fetch(`/api/v1/tasks/${id}`);
  return await response.json();
};

const createAndDisplayElements = async (fetchedTasks) => {
  const tasks = (await fetchedTasks());
  createElements(tasks);
};

const createElements = (tasks) => {
  listContainer.innerText = '';
  tasks.forEach(({name, completed, id}) => {
    const clonedItem = listItem.cloneNode(true);
    const textItem = clonedItem.firstChild;
    clonedItem.classList.remove('hidden');
    textItem.innerText = name;
    clonedItem.dataset.id = id;
    const [editBtn, checkedBtn, deleteBtn] = clonedItem.childNodes[1].childNodes;

    if (completed) {
      editBtn.classList.add('hidden');
    }

    editBtn.addEventListener('click', editTaskPanel);
    checkedBtn.addEventListener('click', checkTask);
    deleteBtn.addEventListener('click', deleteTask);

    handleTaskDisplay(completed, clonedItem, textItem, checkedBtn);
    listContainer.appendChild(clonedItem);
  });
  showTasksNumber(tasks);
  showToDoTasksNumber(tasks);
};


const disableHandler = ({target}) => {
  taskConfirmBtn.disabled = !target.value.length;
};

const confirmTask = async e => {
  e.preventDefault();
  const name = inputValue.value;
  await fetch('/api/v1/tasks', {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  inputValue.value = "";
  taskConfirmBtn.disabled = true;

  createAndDisplayElements(fetchedAllElements);
};

const handleTaskDisplay = (completed, liElement, textElement, checkBtn) => {

  if (completed) {
    liElement.classList.add('darker');
    textElement.classList.add('done');
    checkBtn.innerText = "To Do";
  } else {
    liElement.classList.remove('darker');
    textElement.classList.remove('done');
  }
};

const editTask = async (e) => {
  e.preventDefault();
  const id = e.target.children[1].dataset.id;
  await fetch(`/api/v1/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: textArea.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  editTaskWindow.classList.add('hidden');
  textArea.value = "";
  createAndDisplayElements(fetchedAllElements);
};


const editTaskPanel = async ({target}) => {
  const {id} = (target.closest('.list-item').dataset);
  const {task} = await fetchedElement(id);
  const {name, id: taskId} = task;

  formTaskId.textContent = `ID: ${taskId}`;
  textArea.value = name;
  textArea.dataset.id = taskId;
  editTaskWindow.classList.remove('hidden');
};

const checkTask = async ({target}) => {
  const {id} = target.closest('.list-item').dataset;
  const {task: {completed}} = await fetchedElement(id);
  const listItem = target.closest('.list-item');
  const text = target.closest('.list-item').firstChild;
  handleTaskDisplay(completed, listItem, text, target);

  await fetch(`/api/v1/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      completed: !completed
    }),
    headers: {
      'Content-Type': "application/json"
    }
  });
  createAndDisplayElements(fetchedAllElements);
};

const deleteTask = async ({target}) => {
  const {id} = target.closest('.list-item').dataset;
  await fetch(`/api/v1/tasks/${id}`, {
    method: "DELETE",
  });
  createAndDisplayElements(fetchedAllElements);
};

const searchTask = async ({target}) => {
  listContainer.innerText = '';
  const name = target.value;

  let tasks = await fetchedAllElements();
  tasks = tasks.filter(task => task.name.startsWith(name));
  createElements(tasks);
};


const showToDoTasksNumber = (tasks) => {
  const toDoNumber = tasks.filter(el => !el.completed);
  tasksToDoNumber.innerText = `Tasks To Do: ${Number(toDoNumber.length)}`;
};

const showTasksNumber = (tasks) => {
  tasksNumber.innerText = `All Tasks: ${Number(tasks.length)}`;
};


inputValue.addEventListener('keyup', disableHandler);
taskConfirmForm.addEventListener('submit', confirmTask);
form.addEventListener('submit', editTask);
searchBar.addEventListener('input', searchTask);

createAndDisplayElements(fetchedAllElements);


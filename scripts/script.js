// Author: Michael Zhan
// Last modified: 9/29/23


// Global variables
var taskCount = 0;


// Load tasks from local storage
window.addEventListener("load", function() {
  var listItems = JSON.parse(localStorage.getItem("tasks")) || [];
  taskCount = localStorage.getItem("taskCount") || 0;
  const taskList = document.querySelector("#taskList");

  listItems.forEach(function(item) {
    let id = item.id;
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    let checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input", "me-1");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id);

    let label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = item.text;

    let button = document.createElement("button");
    button.classList.add("btn", "btn-danger", "show-delete-modal");
    button.setAttribute("type", "button");
    button.textContent = "Delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(button);
    taskList.appendChild(listItem);
  });
});
// End of load tasks from local storage


// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  // ------- Define variables -------
  // Buttons
  const addTaskButton = document.querySelector("#taskInputButton");
  const deleteButton = document.querySelector("#deleteButton");
  const clearAllPromptButton = document.querySelector("#clearAllPromptButton");
  const deleteAllTasksButton = document.querySelector("#deleteAllTasksButton");

  // Task-related
  const taskInput = document.querySelector("#taskInput");
  const taskList = document.querySelector("#taskList");
  var taskItem;

  // Modals
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  const clearAllModal = new bootstrap.Modal(document.getElementById('clearAllModal'));

  // Toasts
  const toastLifespan = 3000;
  const toastContainer = document.querySelector('.toast-container');

  // Placeholder text for empty task list
  const emptyTaskListMessage = document.querySelector("#emptyTaskListMessage");
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      checkTaskListEmpty();
      updateLocalStorage();
    });
  });
  var config = {childList: true};
  // ------- End of variables -------


  // ------- Initialize -------
  // Continuously check if task list is empty
  observer.observe(taskList, config);
  // ------- End of initialize -------

  
  // ------- Define functions -------
  // Create a new toast
  function createToast(action) {
    if (action === "add") {
      var phrase = "Task successfully added!";
    } else if (action === "delete") {
      var phrase = "Task successfully deleted!";
    }
    let newToast = document.createElement("div");
    newToast.classList.add("toast", "hide", "bg-green");
    newToast.setAttribute("role", "alert");

    let flexDiv = document.createElement("div");
    flexDiv.classList.add("d-flex");

    let toastBody = document.createElement("div");
    toastBody.classList.add("toast-body");
    toastBody.textContent = phrase;

    let closeButton = document.createElement("button");
    closeButton.classList.add("btn-close", "me-2", "m-auto");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-bs-dismiss", "toast");

    flexDiv.appendChild(toastBody);
    flexDiv.appendChild(closeButton);
    newToast.appendChild(flexDiv);
    toastContainer.appendChild(newToast);

    return new bootstrap.Toast(newToast, {
      autohide: true,
      delay: toastLifespan
    })
  }

  // Add a new task
  function addTask(value) {
    let newId = `task${taskCount++}`;
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    let checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input", "me-1", "float-start");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", newId);

    let label = document.createElement("label");
    label.setAttribute("for", newId);
    label.innerHTML = escapeHtml(value);

    let button = document.createElement("button");
    button.classList.add("btn", "btn-danger", "show-delete-modal", "float-end");
    button.setAttribute("type", "button");
    button.textContent = "Delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(button);
    taskList.appendChild(listItem);
  }

  // Delete a task
  function deleteTask(taskItem) {
    taskItem.remove();
  }

  // Check if task list is empty and show/hide placement text
  function checkTaskListEmpty() {
    if (taskList.childElementCount > 0) {
      emptyTaskListMessage.classList.add("d-none");
    } else {
      emptyTaskListMessage.classList.remove("d-none");
    }
  }

  // Replace problematic characters with HTML entities
  function escapeHtml(input) {
    return input.replace(/[&<>"']/g, function(match) {
      switch (match) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case "'":
          return '&#x27;';
        case '"':
          return '&quot;';
        default:
          return match;
      }
    });
  }

  // Update local storage
  function updateLocalStorage() {
    let listItems = Array.from(taskList.querySelectorAll('label')).map(function(item) {
      return {
        id: item.getAttribute('for'),
        text: item.textContent
      };
    });
    localStorage.setItem("tasks", JSON.stringify(listItems));
    localStorage.setItem("taskCount", taskCount);
  }
  // ------- End of functions -------


  // ------- Event listeners -------
  // Add a new task
  addTaskButton.addEventListener("click", function() {
    if (taskInput.value) {
      addTask(taskInput.value);
      taskInput.value = "";
      taskInput.focus();
      createToast("add").show()
    }
  });

  // Let user press enter to add tasks
  taskInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
      addTaskButton.click();
      addTaskButton.classList.add('active');
    }
  });

  taskInput.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
      addTaskButton.classList.remove('active');
    }
  });

  // Strikethrough checked tasks
  taskList.addEventListener("click", function(e) {
    if (e.target.type === "checkbox") {
      document.querySelector(`label[for=${e.target.id}]`).classList.toggle("strikethrough");
    }
  });

  // Delete button
  taskList.addEventListener("click", function(e) {
    if (e.target.type === "button" && e.target.classList.contains("show-delete-modal")) {
      deleteModal.show();
      taskItem = e.target.parentElement;
    }
  });

  deleteButton.addEventListener("click", function() {
    deleteModal.hide();
    deleteTask(taskItem);
    createToast("delete").show()
  });

  // Delete all tasks button
  clearAllPromptButton.addEventListener("click", function() {
    clearAllModal.show();
  });

  deleteAllTasksButton.addEventListener("click", function() {
    clearAllModal.hide();
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
    taskCount = 0;
  });

  // Remove finished toasts
  toastContainer.addEventListener('hidden.bs.toast', function (e) {
    e.target.remove();
  });
  // ------- End of event listeners -------  
});
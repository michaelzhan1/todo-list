// Author: Michael Zhan
// Last modified: 6/29/23
// path: scripts\scripts.js


// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  // ------- Define variables -------
  // Buttons
  const addTaskButton = document.querySelector("#taskInputButton");
  const deleteButton = document.querySelector("#deleteButton");
  const clearAllPromptButton = document.querySelector("#clearAllPromptButton");
  const deleteAllTasksButton = document.querySelector("#deleteAllTasksButton");
  const saveEditButton = document.querySelector("#saveEditButton");

  
  // Task-related
  const taskInput = document.querySelector("#taskInput");
  const taskList = document.querySelector("#taskList");
  var taskItem;


  // Modals
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  const clearAllModal = new bootstrap.Modal(document.getElementById('clearAllModal'));


  // Edit body
  const editBody = document.querySelector("#editBody");


  // Toasts
  const toastLifespan = 3000;
  const toastContainer = document.querySelector('.toast-container');


  // Placeholder text for empty task list
  const emptyTaskListMessage = document.querySelector("#emptyTaskListMessage");
  

  // Mutation observer
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
    newToast = createToastElement(phrase);
    toastContainer.appendChild(newToast);
    return new bootstrap.Toast(newToast, {
      autohide: true,
      delay: toastLifespan
    });
  }


  // Add a new task
  function addTask(value) {
    taskList.appendChild(createTaskElement(value));
  }


  // Delete a task
  function deleteTask(taskItem) {
    taskItem.remove();
  }


  // Check if task list is empty and show/hide placement text
  function checkTaskListEmpty() {
    if (taskList.childElementCount > 0) {
      emptyTaskListMessage.classList.add("d-none");
      clearAllPromptButton.classList.remove("d-none");
    } else {
      emptyTaskListMessage.classList.remove("d-none");
      clearAllPromptButton.classList.add("d-none");
    }
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


  // Task buttons (edit and delete)
  taskList.addEventListener("click", function(e) {
    if (e.target.type === "button") {
      taskItem = e.target.parentElement;

      if (e.target.classList.contains("show-delete-modal")) {
        deleteModal.show();
      }
      if (e.target.classList.contains("show-edit-modal")) {
        editBody.value = taskItem.querySelector("label").textContent;
        editModal.show();
      }
    }
  });


  // Perform deletion
  deleteButton.addEventListener("click", function() {
    deleteModal.hide();
    deleteTask(taskItem);
    createToast("delete").show()
  });


  // Save edit
  saveEditButton.addEventListener("click", function() {
    editModal.hide();
    taskItem.querySelector("label").textContent = editBody.value;
    updateLocalStorage();
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
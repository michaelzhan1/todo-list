document.addEventListener("DOMContentLoaded", function() {
  // ------- Define variables -------
  // Buttons
  const addTaskButton = document.querySelector("#taskInputButton");
  const deleteButton = document.querySelector("#deleteButton");

  // Task-related
  const taskInput = document.querySelector("#taskInput");
  const taskList = document.querySelector("#taskList");
  let taskCount = 0;
  var taskItem;

  // Modals
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

  // Toasts
  const toastLifespan = 3000;
  const toastContainer = document.querySelector('.toast-container');

  // Placeholder text for empty task list
  const emptyTaskListMessage = document.querySelector("#emptyTaskListMessage");
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      checkTaskListEmpty();
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
      animation: true,
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
    checkbox.classList.add("form-check-input", "me-1");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", newId);

    let label = document.createElement("label");
    label.setAttribute("for", newId);
    label.innerHTML = escapeHtml(value);
    console.log(label.textContent)

    let button = document.createElement("button");
    button.classList.add("btn", "btn-danger", "show-delete-modal");
    button.setAttribute("type", "button");
    button.textContent = "Delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(button);
    taskList.appendChild(listItem);
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
    taskItem.remove();
    createToast("delete").show()
  });

  // Remove finished toasts
  toastContainer.addEventListener('hidden.bs.toast', function (e) {
    e.target.remove();
  });

  // Check if task list is empty

  // ------- End of event listeners -------  
});
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
  // ------- End of variables -------

  
  // ------- Define functions -------
  // Create a new toast
  function createToast(action) {
    if (action === "add") {
      var phrase = "Task successfully added!";
    } else if (action === "delete") {
      var phrase = "Task successfully deleted!";
    }
    toastContainer.innerHTML += `
      <div class="toast hide bg-green" role="alert">
        <div class="d-flex">
          <div class="toast-body">
            ${phrase}
          </div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `
    return new bootstrap.Toast(document.querySelector('.toast:last-child'), {
      autohide: true,
      delay: toastLifespan
    });
  }
  // ------- End of functions -------


  // ------- Event listeners -------
  // Add a new task
  addTaskButton.addEventListener("click", function() {
    if (taskInput.value) {
      let newId = `task${taskCount++}`;
      taskList.innerHTML += `
      <li class="list-group-item">
        <input class="form-check-input me-1" type="checkbox" id="${newId}" name="${newId}" value="${newId}">
        <label for="${newId}">${taskInput.value}</label>
        <button type="button" class="btn btn-danger show-delete-modal">Delete</button>
      </li>
      `
      taskInput.value = "";
      taskInput.focus();

      addToast.show();
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
  // ------- End of event listeners -------  
});
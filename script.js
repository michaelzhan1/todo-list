document.addEventListener("DOMContentLoaded", function() {
  // Checkbox strikethrough toggle
  let taskList = document.querySelector("#taskList");
  taskList.addEventListener("click", function(e) {
    if (e.target.type === "checkbox") {
      let label = document.querySelector(`label[for=${e.target.id}]`);
      label.classList.toggle("strikethrough");
    }
  });

  // Add tasks
  let i = document.querySelectorAll("#taskList li").length + 1;
  let addTaskButton = document.querySelector("#taskEnterButton");
  addTaskButton.addEventListener("click", function() {
    let taskInput = this.parentElement.querySelector("input");
    taskValue = taskInput.value;
    if (taskValue) {
      newId = `task${i++}`;
      let taskList = document.querySelector("#taskList");
      taskList.innerHTML += `
      <li class="list-group-item">
        <input class="form-check-input me-1" type="checkbox" id="${newId}" name="${newId}" value="${newId}">
        <label for="${newId}">${taskValue}</label>
        <button type="button" class="btn btn-danger">Delete</button>
      </li>
      `
      taskInput.value = "";
    }
  });

  // Delete button
  // TODO: Make the confirmation dialog prettier, using modal
  taskList.addEventListener("click", function(e) {
    if (e.target.type === "button") {
      if (confirm("Are you sure you want to delete this task?")) {
        e.target.parentElement.remove();
      }
    }
  });  
});
// Author: Michael Zhan
// Last modified: 6/29/23
// path: scripts\load.js

// Global variables
var taskCount = 0;


// Load tasks from local storage
window.addEventListener("load", function() {
  var listItems = JSON.parse(localStorage.getItem("tasks")) || [];
  taskCount = localStorage.getItem("taskCount") || 0;
  const taskList = document.querySelector("#taskList");

  listItems.forEach(function(item) {
    taskList.appendChild(createTaskElement(item.text, item.id));
  });
});
// End of load tasks from local storage
// Author: Michael Zhan
// Last modified: 6/29/23
// path: scripts\functions.js

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


// Create a new task item
function createTaskElement(value, id) {
  if (typeof id === "undefined") {
    id = `task${taskCount++}`;
  }
  let listItem = document.createElement("li");
  listItem.classList.add("list-group-item");

  let checkbox = document.createElement("input");
  checkbox.classList.add("form-check-input", "me-1", "float-start");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", id);

  let label = document.createElement("label");
  label.setAttribute("for", id);
  label.innerHTML = escapeHtml(value);

  let button = document.createElement("button");
  button.classList.add("btn", "btn-danger", "show-delete-modal", "float-end");
  button.setAttribute("type", "button");
  button.textContent = "Delete";

  listItem.appendChild(checkbox);
  listItem.appendChild(label);
  listItem.appendChild(button);
  return listItem;
}


// Create a new toast
function createToastElement(phrase) {
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

  return newToast;
}
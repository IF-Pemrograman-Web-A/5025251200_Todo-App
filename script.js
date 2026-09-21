const todoForm = document.getElementById("new-todo-form");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");

const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter button");

const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const prioritySelect = document.getElementById("priority");
const dateInput = document.getElementById("date");

const saveButton = document.getElementById("save-btn");
const deleteButton = document.getElementById("delete-btn");

let selectedTodo = document.querySelector(".todo-item.selected");
function updateTaskCount() {
    const totalTasks = todoList.querySelectorAll(".todo-item").length;
    taskCount.textContent = `${totalTasks} Tasks`;
}
function updateTodoStatus(todo, completed) {
    const check = todo.querySelector(".todo-check");
    todo.setAttribute("data-status", completed ? "completed" : "pending");

    check.classList.toggle("completed-check", completed);
    check.textContent = completed ? "✓" : "";
}
function setupTodo(todo) {
    const check = todo.querySelector(".todo-check");
    check.addEventListener("click", function (event) {
        event.stopPropagation();
        const isCompleted = todo.getAttribute("data-status") === "completed";
        updateTodoStatus(todo, !isCompleted);
        applyFilter();
    });
    todo.addEventListener("click", function () {
        document.querySelectorAll(".todo-item").forEach(function (item) {
            item.classList.remove("selected");
        });
        todo.classList.add("selected");
        selectedTodo = todo;

        const title = todo.querySelector("h3").textContent;
        const description = todo.querySelector("p").textContent;
        const priority = todo.querySelector(".priority").textContent;

        taskTitle.value = title.trim();
        taskDescription.value = description.trim();
        prioritySelect.value = priority.trim();
    });
}
function applyFilter() {
    const keyword = searchInput.value.toLowerCase();
    const activeButton = document.querySelector(".filter button.active");
    const filter = activeButton.getAttribute("data-filter");

    document.querySelectorAll(".todo-item").forEach(function (todo) {
        const title = todo.querySelector("h3").textContent.toLowerCase();
        const description = todo.querySelector("p").textContent.toLowerCase();
        const status = todo.getAttribute("data-status");
        const matchesSearch =
            title.includes(keyword) || description.includes(keyword);
        const matchesFilter = filter === "all" || status === filter;

        todo.style.display = matchesSearch && matchesFilter ? "flex" : "none";
    });
}
document.querySelectorAll(".todo-item").forEach(function (todo) {
    setupTodo(todo);
});
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("new-title").value.trim();
    const description = document.getElementById("new-description").value.trim();

    if (title === "") {
        alert("Task title harus diisi!");
        return;
    }
    const newTodo = document.createElement("article");
    newTodo.classList.add("todo-item");
    newTodo.setAttribute("data-status", "pending");
    newTodo.innerHTML = `
        <div class="todo-check"></div>
        <div class="todo-info">
            <h3>${title}</h3>
            <p>
                ${description || "No description added."}
            </p>
            <div class="todo-meta">
                <span class="priority medium">
                    Medium
                </span>
                <span>
                    Today
                </span>
            </div>
        </div>
    `;
    todoList.appendChild(newTodo);
    setupTodo(newTodo);
    updateTaskCount();
    todoForm.reset();
    document.querySelectorAll(".todo-item").forEach(function (item) {
        item.classList.remove("selected");
    });
    newTodo.classList.add("selected");
    selectedTodo = newTodo;
    taskTitle.value = title;
    taskDescription.value = description || "No description added.";
    prioritySelect.value = "Medium";
    alert("Todo berhasil ditambahkan!");
});

searchInput.addEventListener("input", function () {
    applyFilter();
});
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });
        button.classList.add("active");
        applyFilter();
    });
});
saveButton.addEventListener("click", function () {
    if (!selectedTodo) {
        alert("Pilih Todo terlebih dahulu!");
        return;
    }
    selectedTodo.querySelector("h3").textContent = taskTitle.value;
    selectedTodo.querySelector("p").textContent = taskDescription.value;
    const priorityElement = selectedTodo.querySelector(".priority");
    priorityElement.textContent = prioritySelect.value;
    priorityElement.classList.remove("high", "medium", "low");
    priorityElement.classList.add(prioritySelect.value.toLowerCase());
    alert("Perubahan berhasil disimpan!");
    applyFilter();
});
deleteButton.addEventListener("click", function () {
    if (!selectedTodo) {
        alert("Pilih Todo yang ingin dihapus!");
        return;
    }
    const confirmation = confirm("Yakin ingin menghapus Todo ini?");

    if (confirmation) {
        selectedTodo.remove();
        selectedTodo = null;
        updateTaskCount();
        taskTitle.value = "";
        taskDescription.value = "";
        prioritySelect.value = "Medium";
        applyFilter();
    }
});

updateTaskCount();

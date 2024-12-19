const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const loadingScreen = document.querySelector(".loading");
const taskContainer = document.querySelector(".task-container");

const apiKey = "6762d31260a208ee1fde4ca8";

let allTodos = [];

getAllTodos();

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputElement.value.trim().length > 0 || inputElement.value === "") {
   
    addTodos();
    
  }
});

async function addTodos() {
    showLoading();
  const todo = {
    title: inputElement.value,
    apiKey: apiKey,
  };
  const obj = {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      toastr.success("Task added successfully");
      // get the todos
      await getAllTodos();
      formElement.reset();
      
    }
  }
  hideLoading();
}

async function getAllTodos() {
    showLoading();
  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );
  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      allTodos = data.todos;
      displayData();
    }
  }
  hideLoading();
}

function displayData() {
  let cartona = "";
  for (const todo of allTodos) {

    cartona += `
         <li class="d-flex justify-content-between align-items-center border-bottom pb-3" >
                    <span onclick="markCompleted('${
                      todo._id
                    }')"  class="task-name" style=${
      todo.completed ? "text-decoration:line-through" : ""
    }>${todo.title}</span>
                    <div class="d-flex align-items-center gap-3">
                        ${
                          todo.completed
                            ? `<span class=" mt-3"> <i class="fa-regular fa-circle-check" style="color:green"></i> </span>`
                            : " "
                        }
                        <span onclick="deleteTodo('${
                          todo._id
                        }')" class="mt-3 icon"> <i class="fa-regular fa-trash-can"></i> </span>
                    </div>
                    
                </li>
        `;
  }
  document.querySelector(".task-container").innerHTML = cartona;
  

  changeProgress();
}

async function deleteTodo(idTodo) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
        showLoading();
      const todoData = {
        todoId: idTodo,
      };
      const obj = {
        method: "DELETE",
        body: JSON.stringify(todoData),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          await getAllTodos();
        }
      }
      hideLoading();
    }
  });
}

async function markCompleted(idTodo) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, it's done!"
      }).then(async(result) => {
        if (result.isConfirmed) {
            showLoading();
            const todoData = {
                todoId: idTodo,
              };
              const obj = {
                method: "PUT",
                body: JSON.stringify(todoData),
                headers: {
                  "Content-Type": "application/json",
                },
              };
            
              const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
            
              if (response.ok) {
                const data = await response.json();
                if (data.message === "success") {
                    Swal.fire({
                        title: "Completed!",
                        text: "Your Task has been completed.",
                        icon: "success"
                      });
                  await getAllTodos();
                }

              }
              hideLoading();
        }
      });


  
}

function showLoading() {
  loadingScreen.classList.remove("d-none");
}

function hideLoading() {
  loadingScreen.classList.add("d-none");
}


function changeProgress() {
  
  
    const completedTaskNumber = allTodos.filter((todo) => todo.completed).length; 
    const totalTask = allTodos.length; 
  
    document.getElementById("progress").style.width = `${(completedTaskNumber / totalTask) * 100}%`;
  
    const statusNumber = document.querySelectorAll(".status-number span");
  
    statusNumber[0].innerHTML = completedTaskNumber;
    statusNumber[1].innerHTML = totalTask;
  }
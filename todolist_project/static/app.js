//Document is the DOM can be accessed in the console with document.window.
// Tree is from the top, html, body, p etc.

//Problem: User interaction does not provide the correct results.
//Solution: Add interactivity so the user can manage daily tasks.
//Break things down into smaller steps and take each step at a time.


//Event handling, uder interaction is what starts the code execution.

var taskInput = document.getElementById("new-task");//Add a new task.
var addButton = document.getElementById("add-task-btn");//改用id取得
var incompleteTaskHolder = document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks");//completed-tasks
var addForm = document.getElementById("add-task-form"); // 新增表單元素
console.log("app.js loaded");
var taskInput = document.getElementById("new-task");    // 輸入框
var addButton = document.getElementById("add-task-btn"); // 新增按鈕

if (!addForm) {
    console.error("找不到 add-task-form，請檢查 HTML 結構");
} else {
    addForm.addEventListener("submit", addTask);
}

if (!taskInput) {
    console.error("找不到 new-task，請檢查 HTML 結構");
}
if (!addButton) {
    console.error("找不到 add-task-btn，請檢查 HTML 結構");
}

// 取得 CSRF Token 的函式
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


//New task list item
var createNewTaskElement = function(taskString, taskId) {
    var listItem = document.createElement("li");
    if (taskId) {
        listItem.dataset.id = taskId;
		console.log("新任務的 ID 為:", taskId);
		
    }

	//input (checkbox)
	var checkBox=document.createElement("input");//checkbx
	//label
	var label=document.createElement("label");//label
	//input (text)
	var editInput=document.createElement("input");//text
	//button.edit
	var editButton=document.createElement("button");//edit button

	//button.delete
	var deleteButton=document.createElement("button");//delete button

	label.innerText=taskString;

	//Each elements, needs appending
	checkBox.type="checkbox";
	editInput.type="text";

	editButton.innerText="Edit";//innerText encodes special characters, HTML does not.
	editButton.className="edit";
	deleteButton.innerText="Delete";
	deleteButton.className="delete";



	//and appending.
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
	return listItem;
}



// 新增任務功能（純前端）
var addTask = function(e) {
    e.preventDefault();
    var title = taskInput.value.trim();
    if (!title) return;

    fetch('/tasks/ajax_add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ title: title })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            var listItem = createNewTaskElement(data.title, data.id); // 傳入 id
            incompleteTaskHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskCompleted);
            taskInput.value = "";
        } else {
            alert('新增失敗: ' + data.error);
        }
    });
};


//Delete task.
var deleteTask = function() {
    var listItem = this.parentNode;
    var taskId = listItem.dataset.id;
	console.log("此 listItem 的 id 為:", taskId);
    if (!taskId) {
        //alert('找不到任務 id');
        return;
    }
    fetch('/tasks/ajax_delete/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ id: taskId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            listItem.parentNode.removeChild(listItem);
        } else {
            alert('刪除失敗: ' + (data.error || '未知錯誤'));
        }
    });
}


//Edit an existing task.

var editTask=function(){
console.log("Edit Task...");
console.log("Change 'edit' to 'save'");


var listItem=this.parentNode;

var editInput=listItem.querySelector('input[type=text]');
var label=listItem.querySelector("label");
var containsClass=listItem.classList.contains("editMode");
		//If class of the parent is .editmode
		if(containsClass){

		//switch to .editmode
		//label becomes the inputs value.
			label.innerText=editInput.value;
		}else{
			editInput.value=label.innerText;
		}

		//toggle .editmode on the parent.
		listItem.classList.toggle("editMode");
}



//Mark task completed
var taskCompleted=function(){
		console.log("Complete Task...");
	
	//Append the task list item to the #completed-tasks
	var listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
				bindTaskEvents(listItem, taskIncomplete);

}


var taskIncomplete=function(){
		console.log("Incomplete Task...");
//Mark task as incomplete.
	//When the checkbox is unchecked
		//Append the task list item to the #incomplete-tasks.
		var listItem=this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
			bindTaskEvents(listItem,taskCompleted);
}



var ajaxRequest=function(){
	console.log("AJAX Request");
}

//The glue to hold it all together.


//Set the click handler to the addTask function.
// addButton.addEventListener("click", addTask);
// addButton.addEventListener("click", ajaxRequest);

// 監聽表單 submit 事件
addForm.addEventListener("submit", addTask);


var bindTaskEvents=function(taskListItem,checkBoxEventHandler){
	console.log("bind list item events");
//select ListItems children
	var checkBox=taskListItem.querySelector("input[type=checkbox]");
	var editButton=taskListItem.querySelector("button.edit");
	var deleteButton=taskListItem.querySelector("button.delete");


			//Bind editTask to edit button.
			editButton.onclick=editTask;
			//Bind deleteTask to delete button.
			deleteButton.onclick=deleteTask;
			//Bind taskCompleted to checkBoxEventHandler.
			checkBox.onchange=checkBoxEventHandler;
}

//cycle over incompleteTaskHolder ul list items
	//for each list item
	for (var i=0; i<incompleteTaskHolder.children.length;i++){

		//bind events to list items chldren(tasksCompleted)
		bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
	}




//cycle over completedTasksHolder ul list items
	for (var i=0; i<completedTasksHolder.children.length;i++){
	//bind events to list items chldren(tasksIncompleted)
		bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
	}




// Issues with usabiliy don't get seen until they are in front of a human tester.

//prevent creation of empty tasks.

//Shange edit to save when you are in edit mode.
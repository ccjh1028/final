// ===============================
// 取得 DOM 元素
// ===============================
var taskInput = document.getElementById("new-task");           // 新任務輸入框
var taskDateInput = document.getElementById("new-task-date");  // 任務日期輸入框
var incompleteTaskHolder = document.getElementById("incomplete-tasks"); // 未完成任務列表
var completedTasksHolder = document.getElementById("completed-tasks");  // 已完成任務列表
var addForm = document.getElementById("add-task-form");        // 新增任務表單


if (typeof document !== 'undefined') console.log("app.js loaded!!");

// ===============================
// 取得 CSRF Token（Django 用於防止 CSRF 攻擊）
// ===============================
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // 檢查 cookie 字串是否以指定名稱開頭
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ===============================
// 建立新的任務元素（li）
// ===============================
var createNewTaskElement = function(taskString, taskId, taskDate) {
    var listItem = document.createElement("li");
    if (taskId) listItem.dataset.id = taskId; // 設定任務 id 於 data 屬性

    // 勾選框（完成/未完成）
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    // 任務標題
    var label = document.createElement("label");
    label.innerText = taskString;

    // 任務日期顯示
    var dateSpan = document.createElement("span");
    dateSpan.className = "task-date";
    dateSpan.innerText = taskDate ? taskDate : "";

    // 編輯用文字輸入框
    var editInput = document.createElement("input");
    editInput.type = "text";

    // 編輯用日期輸入框（預設隱藏）
    var editDateInput = document.createElement("input");
    editDateInput.type = "date";
    editDateInput.className = "edit-date";
    editDateInput.style.display = "none";
    if (taskDate) editDateInput.value = taskDate;

    // 編輯按鈕
    var editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.className = "edit";

    // 刪除按鈕
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    // 組合 li 元素
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(dateSpan);
    listItem.appendChild(editInput);
    listItem.appendChild(editDateInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

// ===============================
// 新增任務事件處理
// ===============================
var addTask = function(e) {
    e.preventDefault();
    var title = taskInput.value.trim();
    var date = taskDateInput.value;
    if (!title) return;

    // 使用 Fetch API 發送 POST 請求到後端
    fetch('/ajax_add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ title: title, date: date })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 新增成功，將新任務加入未完成清單
            var listItem = createNewTaskElement(data.title, data.id, data.date);
            incompleteTaskHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskCompleted);
            taskInput.value = "";
            taskDateInput.value = "";
        } else {
            alert('新增失敗: ' + data.error);
        }
    });
};

// ===============================
// 刪除任務事件處理
// ===============================
var deleteTask = function() {
    var listItem = this.parentNode;
    var taskId = listItem.dataset.id;
    if (!taskId) {
        alert('找不到任務 id');
        return;
    }
    fetch('/ajax_delete/', {
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
            // 刪除成功，從畫面移除
            listItem.parentNode.removeChild(listItem);
        } else {
            alert('刪除失敗: ' + (data.error || '未知錯誤'));
        }
    });
}

// ===============================
// 編輯任務事件處理
// ===============================
var editTask = function() {
    var listItem = this.parentNode;
    var editInput = listItem.querySelector('input[type=text]');
    var label = listItem.querySelector("label");
    var dateSpan = listItem.querySelector(".task-date");
    var editDateInput = listItem.querySelector('input[type=date].edit-date');
    // 若找不到 editDateInput，則補上一個
    if (!editDateInput) {
        editDateInput = document.createElement("input");
        editDateInput.type = "date";
        editDateInput.className = "edit-date";
        editDateInput.style.display = "none";
        listItem.insertBefore(editDateInput, listItem.querySelector("button.edit"));
    }
    var containsClass = listItem.classList.contains("editMode");
    var taskId = listItem.dataset.id;
    if (containsClass) {
        // 儲存編輯
        var newTitle = editInput.value.trim();
        var newDate = editDateInput.value;
        if (!newTitle) {
            alert('標題不能為空');
            return;
        }
        // 若未選擇新日期，保留原本日期
        if (!newDate && dateSpan.innerText) {
            newDate = dateSpan.innerText;
        }
        if (!newDate) {
            newDate = null;
        }
        fetch('/ajax_edit/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ id: taskId, title: newTitle, date: newDate })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 更新畫面
                label.innerText = newTitle;
                dateSpan.innerText = newDate ? newDate : "";
            } else {
                alert('編輯失敗: ' + (data.error || '未知錯誤'));
            }
        });
        editDateInput.style.display = "none";
        dateSpan.style.display = "";
    } else {
        // 進入編輯模式
        editInput.value = label.innerText;
        editDateInput.value = dateSpan.innerText ? dateSpan.innerText : "";
        editDateInput.style.display = "";
        dateSpan.style.display = "none";
    }
    listItem.classList.toggle("editMode");
}

// ===============================
// 標記任務為已完成
// ===============================
var taskCompleted = function() {
    var listItem = this.parentNode;
    var taskId = listItem.dataset.id;
    if (!taskId) return;
    fetch('/ajax_edit/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ id: taskId, completed: true })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 移動到已完成清單
            completedTasksHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskIncomplete);
        } else {
            alert('標記完成失敗: ' + (data.error || '未知錯誤'));
            // 若失敗，還原 checkbox 狀態
            listItem.querySelector("input[type=checkbox]").checked = false;
        }
    });
}

// ===============================
// 標記任務為未完成
// ===============================
var taskIncomplete = function() {
    var listItem = this.parentNode;
    var taskId = listItem.dataset.id;
    if (!taskId) return;
    fetch('/ajax_edit/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ id: taskId, completed: false })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 移動到未完成清單
            incompleteTaskHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskCompleted);
        } else {
            alert('標記未完成失敗: ' + (data.error || '未知錯誤'));
            // 若失敗，還原 checkbox 狀態
            listItem.querySelector("input[type=checkbox]").checked = true;
        }
    });
}

// ===============================
// 綁定任務項目事件（編輯、刪除、勾選）
// ===============================
var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    var checkBox = taskListItem.querySelector("input[type=checkbox]");
    var editButton = taskListItem.querySelector("button.edit");
    var deleteButton = taskListItem.querySelector("button.delete");

    // 綁定事件
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
}

// ===============================
// 初始化：綁定表單與現有任務事件
// ===============================
addForm.addEventListener("submit", addTask);

// 對現有未完成任務綁定事件
for (var i = 0; i < incompleteTaskHolder.children.length; i++) {
    bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
}

// 對現有已完成任務綁定事件
for (var i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
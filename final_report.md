# 專案書面報告

## 一、背景說明

隨著現代人生活步調加快，待辦事項管理成為提升效率的重要工具。本專案旨在設計並實作一套基於 Django 的待辦清單（To-Do List）網站，協助使用者有效管理日常任務，提升工作與生活品質。

## 二、系統功能

1. 使用者註冊、登入、登出
2. 新增、編輯、刪除待辦事項
3. 標記任務完成狀態
4. 依使用者顯示個人任務
5. 基本權限控管

## 三、系統特色

- 介面簡潔直覺，操作容易上手
- 支援多使用者帳號，資料隔離
- 響應式設計，適用於桌機與行動裝置
- 基於 Django 框架，安全性高、易於維護

## 四、專案架構圖

```
+-------------------+
|   使用者瀏覽器    |
+--------+----------+
         |
         v
+--------+----------+
|    Django Views   |
+--------+----------+
         |
         v
+--------+----------+
|   Django Models   |
+--------+----------+
         |
         v
+--------+----------+
|    SQLite 資料庫  |
+-------------------+
```
- 前端：Django Templates + Bootstrap
- 後端：Django Views/Models
- 資料庫：SQLite

## 五、系統設計

### 1. 網站架構

- 前端：Django Templates + Bootstrap，負責頁面呈現與互動
- 後端：Django，負責業務邏輯與資料處理
- 資料庫：SQLite，儲存使用者與任務資料

### 2. 資料庫設計

- User（Django 內建）
- Task
  - id：主鍵
  - user：外鍵，對應 User
  - title：任務標題
  - description：任務描述
  - is_completed：是否完成
  - created_at：建立時間

### 3. 模組設計

- 使用者管理模組（註冊、登入、登出）
- 任務管理模組（CRUD 操作）
- 權限驗證模組（僅能操作自己的任務）

### 4. 畫面設計

- 首頁：登入後顯示個人任務清單
- 註冊/登入頁面：帳號管理
- 任務新增/編輯頁面：表單操作
- 任務列表頁：顯示、標記、刪除任務

## 六、程式

```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

```python
# views.py（部分）
from django.contrib.auth.decorators import login_required

@login_required
def task_list(request):
    tasks = Task.objects.filter(user=request.user)
    return render(request, 'tasks/task_list.html', {'tasks': tasks})
```

```html
<!-- task_list.html（部分） -->
{% for task in tasks %}
  <li>
    {{ task.title }} {% if task.is_completed %}(已完成){% endif %}
    <!-- 編輯、刪除按鈕 -->
  </li>
{% endfor %}
```

## 六、執行畫面及其說明

1. **登入畫面**  
   ![登入畫面](images/login.png)  
   使用者輸入帳號密碼登入系統。

2. **任務清單頁面**  
   ![任務清單](images/task_list.png)  
   顯示個人所有待辦事項，可標記完成、編輯或刪除。

3. **新增/編輯任務頁面**  
   ![新增任務](images/task_form.png)  
   填寫任務標題與描述，儲存後回到清單頁。

---

以上為本專案之完整書面報告，詳細程式碼與設計細節請參考專案原始碼。

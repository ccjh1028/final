from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    """
    任務表單
    根據 Task 模型自動產生欄位：標題、描述、完成狀態
    可用於新增或編輯任務時的表單驗證與渲染
    """
    class Meta:
        model = Task
        fields = ['title', 'description', 'completed']
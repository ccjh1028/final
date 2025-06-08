from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    """
    任務模型
    user: 任務所屬的用戶（外鍵，刪除用戶時任務一併刪除）
    title: 任務標題（最長255字）
    date: 任務日期（可為空）
    completed: 是否完成（預設為未完成）
    description: 任務描述（可為空）
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # 關聯用戶
    title = models.CharField(max_length=255)                  # 任務標題
    date = models.DateField(null=True, blank=True)            # 任務日期
    completed = models.BooleanField(default=False)            # 完成狀態
    description = models.TextField(blank=True, null=True)     # 任務描述

    def __str__(self):
        return self.title
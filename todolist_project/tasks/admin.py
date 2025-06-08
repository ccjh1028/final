from django.contrib import admin
from .models import Task

# 註冊 Task 模型到 Django admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'date', 'completed')  # 後台列表顯示欄位
    list_filter = ('completed', 'date', 'user')                  # 右側過濾器
    search_fields = ('title', 'description', 'user__username')   # 搜尋欄位
    ordering = ('-date',)                                        # 預設排序

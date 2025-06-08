"""
todolist_project 專案的 URL 設定檔。

此檔案負責將不同的 URL 路徑導向對應的應用程式或 view。
詳細說明請參考官方文件：https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    # 管理後台路徑
    path('admin/', admin.site.urls),

    # 所有路由交給 tasks/urls.py 處理（包含首頁與任務）
    path('', include('tasks.urls')),
]

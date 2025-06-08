from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LogoutView

# 主專案的 URL 設定
urlpatterns = [
    # Django 管理後台路由
    path('admin/', admin.site.urls),

    # 將 'tasks' 應用的路由包含進來，所有 /tasks/ 開頭的請求都會交給 tasks.urls 處理
    path('tasks/', include('tasks.urls')),

    # 登出路由，使用預設 logged_out.html 模板
    path('logout/', LogoutView.as_view(), name='logout'),

]
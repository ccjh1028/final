from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    # 首頁
    path('', views.home, name='home'),

    # 使用 Django 內建登入頁面
    path('accounts/login/', auth_views.LoginView.as_view(), name='login'),  # 登入頁面

    # 使用 Django 內建登出頁面，登出後顯示 logged_out.html
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),   # 登出頁面

    # 任務列表頁面
    path('tasks/', views.task_list, name='task_list'),

    # AJAX 刪除任務
    path('ajax_delete/', views.ajax_delete, name='ajax_delete'),

    # AJAX 新增任務
    path('ajax_add/', views.ajax_add, name='ajax_add'),

    # AJAX 編輯任務
    path('ajax_edit/', views.ajax_edit, name='ajax_edit'),
]
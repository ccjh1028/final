from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('accounts/login/', auth_views.LoginView.as_view(), name='login'),  # 登入頁面
    path('accounts/logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),   # 登出頁面
    
    path('', views.task_list, name='task_list'),  # 首頁

    path('ajax_delete/', views.ajax_delete_task, name='ajax_delete_task'),
    path('ajax_add/', views.ajax_add_task, name='ajax_add_task'),
]
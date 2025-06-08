"""
Django settings for todolist_project project.

產生自 'django-admin startproject'，本檔案為 Django 專案的主要設定檔。
詳細說明請參考官方文件：https://docs.djangoproject.com/en/5.2/topics/settings/
"""

from pathlib import Path
import os

# =========================
# 專案目錄設定
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent  # 專案根目錄


# =========================
# 安全性相關設定
# =========================

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure--*rje7^7s62kbllg1np=ze^aswzgffg(0rfss+t8l8&8n%$*7*'  # 請勿在正式環境公開

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True  # 除錯模式，正式環境請設為 False

ALLOWED_HOSTS = []  # 允許的主機名稱（正式環境需設定）


# =========================
# 應用程式註冊
# =========================

INSTALLED_APPS = [
    'django.contrib.admin',            # 管理後台
    'django.contrib.auth',             # 認證系統
    'django.contrib.contenttypes',     # 內容型別
    'django.contrib.sessions',         # Session 支援
    'django.contrib.messages',         # 訊息框架
    'django.contrib.staticfiles',      # 靜態檔案
    'tasks',                           # 任務應用（自訂）
]


# =========================
# 中介軟體（Middleware）設定
# =========================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# =========================
# URL 設定
# =========================

ROOT_URLCONF = 'todolist_project.urls'


# =========================
# 模板（Templates）設定
# =========================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],  # 全域 templates 目錄
        'APP_DIRS': True,                  # 自動尋找各 app 的 templates
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',  # 請求物件
                'django.contrib.auth.context_processors.auth', # 使用者認證
                'django.contrib.messages.context_processors.messages', # 訊息
            ],
        },
    },
]


# =========================
# WSGI 設定
# =========================

WSGI_APPLICATION = 'todolist_project.wsgi.application'


# =========================
# 資料庫設定（預設 SQLite）
# =========================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# =========================
# 密碼驗證規則
# =========================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# =========================
# 國際化與時區設定
# =========================

LANGUAGE_CODE = 'en-us'   # 語系（可改為 'zh-hant'）
TIME_ZONE = 'Asia/Taipei' # 時區（台灣可設為 'Asia/Taipei'）
USE_I18N = True           # 啟用國際化
USE_TZ = True             # 啟用時區支援


# =========================
# 靜態檔案（CSS, JS, Images）設定
# =========================

STATIC_URL = '/static/'  # 靜態檔案網址

STATICFILES_DIRS = [
    BASE_DIR / "static", # 靜態檔案目錄
]


# =========================
# 預設主鍵型別
# =========================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# =========================
# 登入/登出相關設定
# =========================

LOGIN_URL = '/accounts/login/'         # 未登入時導向的登入頁

LOGIN_REDIRECT_URL = '/tasks/'         # 登入成功後導向任務清單

#!/usr/bin/env python
"""
Django 專案管理工具入口檔案。

可用於執行 migrate、runserver、createsuperuser 等管理指令。
"""

import os
import sys


def main():
    """
    執行 Django 管理指令。
    設定預設的 settings 模組，並呼叫 Django 的指令執行器。
    """
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todolist_project.settings')
    try:
        from django.core.management import execute_from_command_line  # 匯入指令執行器
    except ImportError as exc:
        # 若未安裝 Django，顯示錯誤訊息
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)  # 執行命令列指令


if __name__ == '__main__':
    main()

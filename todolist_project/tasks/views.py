from django.shortcuts import render
from .models import Task
from .forms import TaskForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from django.contrib.auth import get_user_model

# =========================
# 首頁：未登入顯示登入按鈕，已登入顯示進入任務清單按鈕
# =========================
def home(request):
    """
    首頁：未登入顯示登入按鈕，已登入顯示進入任務清單按鈕
    """
    return render(request, 'registration/home.html')

# =========================
# 任務列表頁面，只顯示當前用戶的任務
# =========================
@login_required
def task_list(request):
    """
    顯示當前登入用戶的所有任務，依照日期排序
    """
    tasks = Task.objects.filter(user=request.user).order_by('date')
    return render(request, 'tasks/task_list.html', {'tasks': tasks})

# =========================
# 刪除任務（AJAX）
# =========================
@require_POST
@login_required
def ajax_delete(request):
    """
    處理 AJAX 刪除任務請求
    只允許刪除屬於當前用戶的任務
    請求格式: {'id': 任務ID}
    回傳: {'success': True} 或 {'success': False, 'error': '錯誤訊息'}
    """
    try:
        data = json.loads(request.body)
        task_id = data.get('id')
        if not task_id:
            return JsonResponse({'success': False, 'error': 'No task id'}, status=400)
        # 僅允許刪除自己的任務
        task = Task.objects.get(id=task_id, user=request.user)
        task.delete()
        return JsonResponse({'success': True})
    except Task.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

# =========================
# 新增任務（AJAX）
# =========================
@require_POST
@login_required
def ajax_add(request):
    """
    處理 AJAX 新增任務請求
    請求格式: {'title': 標題, 'date': 日期(必填)}
    回傳: {'success': True, 'id': 任務ID, 'title': 標題, 'date': 日期}
    """
    try:
        data = json.loads(request.body)
        title = data.get('title')
        date = data.get('date')
        if not title:
            return JsonResponse({'success': False, 'error': 'No title'})
        if not date:
            return JsonResponse({'success': False, 'error': 'No date'})
        # 建立新任務，日期必填
        task = Task.objects.create(
            user = request.user,
            title = title,
            date = date
        )
        return JsonResponse({
            'success': True,
            'id': task.id,
            'title': task.title,
            'date': str(task.date)
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

# =========================
# 編輯任務（AJAX）
# =========================
@require_POST
@login_required
def ajax_edit(request):
    """
    處理 AJAX 編輯任務請求
    可修改標題、日期、完成狀態
    請求格式: {'id': 任務ID, 'title': 新標題(可選), 'date': 新日期(可選), 'completed': 完成狀態(可選)}
    回傳: {'success': True} 或 {'success': False, 'error': '錯誤訊息'}
    """
    try:
        data = json.loads(request.body)
        task_id = data.get('id')
        title = data.get('title')
        date = data.get('date', None)  # 預設為 None
        completed = data.get('completed', None)
        # 檢查至少有 id 及 title/completed 其中一項
        if not task_id and title is None and completed is None:
            return JsonResponse({'success': False, 'error': '缺少 id 或 title/completed'}, status=400)
        # 僅允許編輯自己的任務
        task = Task.objects.get(id=task_id, user=request.user)
        # 僅有 completed 欄位時允許不傳 title
        if title is not None:
            task.title = title
        # 允許 date 為空字串或 None
        if date == "":
            task.date = None
        elif date is not None:
            task.date = date
        if completed is not None:
            task.completed = completed
        task.save()
        return JsonResponse({'success': True})
    except Task.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
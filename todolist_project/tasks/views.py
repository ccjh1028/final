from django.shortcuts import render, redirect
from .models import Task
from .forms import TaskForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from django.views.decorators.csrf import csrf_exempt

@login_required
def task_list(request):
    tasks = Task.objects.filter(user=request.user) # 確保只顯示當前用戶的任務
    return render(request, 'tasks/task_list.html', {'tasks': tasks})

def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            return redirect('task_list')
    else:
        form = TaskForm()
    return render(request, 'tasks/add_task.html', {'form': form})

@login_required
@require_POST
def ajax_delete_task(request):
    try:
        data = json.loads(request.body)
        task_id = data.get('id')
        if not task_id:
            return JsonResponse({'success': False, 'error': 'No task id'}, status=400)
        task = Task.objects.get(id=task_id, user=request.user)
        task.delete()
        return JsonResponse({'success': True})
    except Task.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@login_required
def ajax_add_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title = data.get('title')
        if title:
            task = Task.objects.create(user=request.user, title=title)
            return JsonResponse({'success': True, 'id': task.id, 'title': task.title})
        else:
            return JsonResponse({'success': False, 'error': 'No title'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from todo.views import TodoViewSet, ClearAllTodos

router = routers.DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/todos/clear/', ClearAllTodos.as_view(), name='clear-all-todos'),
    path('api/', include(router.urls)),
]

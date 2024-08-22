from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, status
from .models import Todo
from .serializers import TodoSerializer

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    
class ClearAllTodos(APIView):
    def delete(self, request, *args, **kwargs):
        Todo.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
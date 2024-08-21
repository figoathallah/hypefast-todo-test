from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=100)
    status = models.BooleanField(default=False)

from django.contrib import admin
from .models import AcademicSession, Subject, SubjectGroup


@admin.register(AcademicSession)
class AcademicSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'days', 'created_at', 'updated_at')
    fields = ('days', 'created_at', 'updated_at')
admin.site.register(Subject, )
admin.site.register(SubjectGroup, )

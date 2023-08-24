from rest_framework import permissions
from students.models import Student


def isUserAdmin(user):
    return user.groups.filter(name__in=['admin']).exists()


def isUserTeacher(user):
    return user.groups.filter(name__in=['teacher']).exists()


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return isUserAdmin(request.user)


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return isUserTeacher(request.user)


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view,):
        query = request.user.groups.filter(name__in=['student'])
        if query.exists():
            request.student = Student.objects.get(user=request.user)
            return True
        return False
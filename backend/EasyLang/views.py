from django.shortcuts import render

from rest_framework import generics, permissions
from EasyLang.models import User, Language, Module, Lesson, Exercise, LessonProgress, Review
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer, LanguageSerializer, ModuleSerializer, LessonSerializer, ExerciseSerializer, LessonProgressSerializer, ReviewSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import action

from rest_framework import viewsets, permissions
import random
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.viewsets import ModelViewSet

# Регистрация пользователя
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Создаём JWT-токен сразу при регистрации
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

# Профиль пользователя (доступен только авторизованным)
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user  # request.user уже доступен после проверки токена
        serializer = UserSerializer(user)
        return Response(serializer.data)


class TokenRefreshView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        try:
            token = RefreshToken(refresh_token)
            return Response({
                'access': str(token.access_token)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['get'], url_path='modules')
    def get_modules(self, request, pk=None):
        modules = Module.objects.filter(language_id=pk)
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)

class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['get'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        lessons = Lesson.objects.filter(module_id=pk)
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'  

    @action(detail=True, methods=['get'], url_path='exercises')
    def get_exercises(self, request, slug=None):  
            exercises_qs = Exercise.objects.filter(lesson__slug=slug)
            exercises = list(exercises_qs)  
            random.shuffle(exercises)

            limit = int(request.query_params.get("limit", 6))
            selected = exercises[:limit]

            serializer = ExerciseSerializer(selected, many=True)
            return Response(serializer.data)

class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.AllowAny]



class LessonProgressView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = LessonProgress.objects.filter(user=request.user)
        serializer = LessonProgressSerializer(progress, many=True)
        return Response(serializer.data)

    def post(self, request):
        lesson_id = request.data.get("lesson")

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Урок не найден"}, status=status.HTTP_404_NOT_FOUND)

        progress, created = LessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )

        if not created:
            return Response({"message": "Этот урок уже отмечен как пройденный"}, status=status.HTTP_200_OK)

        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProgressOverviewView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_lessons = Lesson.objects.all()
        user_progress = LessonProgress.objects.filter(user=request.user)

        completed_lesson_ids = set(user_progress.values_list("lesson_id", flat=True))

        # Всего
        total_lessons = all_lessons.count()
        completed_lessons = len(completed_lesson_ids)

        # Считаем модули, где все уроки пройдены
        completed_modules = 0
        all_modules = Module.objects.prefetch_related("lessons")

        for module in all_modules:
            lesson_ids_in_module = set(module.lessons.values_list("id", flat=True))
            if lesson_ids_in_module and lesson_ids_in_module.issubset(completed_lesson_ids):
                completed_modules += 1

        total_modules = all_modules.count()

        return Response({
            "completed_lessons": completed_lessons,
            "total_lessons": total_lessons,
            "completed_modules": completed_modules,
            "total_modules": total_modules,
        })

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
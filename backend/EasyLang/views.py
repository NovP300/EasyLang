from django.shortcuts import render

from rest_framework import generics, permissions
from EasyLang.models import User, Language, Module, Lesson, Exercise, LessonProgress, Review
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (UserSerializer, RegisterSerializer, LanguageSerializer, ModuleSerializer, 
LessonSerializer, ExerciseSerializer, LessonProgressSerializer,
 ReviewSerializer, ChangePasswordSerializer, CustomTokenObtainPairSerializer)

from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import action

from rest_framework import viewsets, permissions
import random
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView



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
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


class TokenRefreshView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)
        
        try:
            token = RefreshToken(refresh_token)
            return Response({
                'access': str(token.access_token)
            })
        except (InvalidToken, TokenError) as e:
            return Response({"error": str(e)}, status=401)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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

        # Исключаем тестовый модуль
        all_modules = Module.objects.exclude(title__iexact="Test").prefetch_related("lessons")

        # Считаем уроки только из обычных модулей
        lesson_ids_in_modules = set()
        for module in all_modules:
            lesson_ids_in_modules.update(module.lessons.values_list("id", flat=True))

        total_lessons = len(lesson_ids_in_modules)
        completed_lessons = len([lid for lid in lesson_ids_in_modules if lid in completed_lesson_ids])

        # Считаем модули, где все уроки пройдены
        completed_modules = 0
        for module in all_modules:
            lesson_ids = set(module.lessons.values_list("id", flat=True))
            if lesson_ids and lesson_ids.issubset(completed_lesson_ids):
                completed_modules += 1

        total_modules = all_modules.count()

        return Response({
            "completed_lessons": completed_lessons,
            "total_lessons": total_lessons,
            "completed_modules": completed_modules,
            "total_modules": total_modules,
        })


class DetailedProgressView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Все завершенные уроки пользователя
        completed_lessons = LessonProgress.objects.filter(user=user).values_list("lesson_id", flat=True)
        completed_lessons_set = set(completed_lessons)

        modules_data = []

        for module in Module.objects.prefetch_related("lessons"):
            lesson_ids = list(module.lessons.values_list("id", flat=True))
            total = len(lesson_ids)
            completed = sum(1 for lid in lesson_ids if lid in completed_lessons_set)

            modules_data.append({
                "id": module.id,
                "title": module.title,
                "completed_lessons": completed,
                "total_lessons": total,
                "is_completed": completed == total and total > 0,
            })

        return Response({
            "completed_lesson_ids": list(completed_lessons_set),
            "modules": modules_data
        })





class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    permission_classes = [AllowAny]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['language', 'user']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MyReviewByLanguageView(generics.GenericAPIView):
    serializer_class = ReviewSerializer

    def get(self, request, language_id):
        try:
            review = Review.objects.get(user=request.user, language_id=language_id)
            serializer = self.get_serializer(review)
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response({"detail": "Review not found."}, status=404)


class TestLessonsView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, language_id):
        try:
            test_module = Module.objects.get(language_id=language_id, title__icontains="test")
        except Module.DoesNotExist:
            return Response({"error": "Модуль тестирования не найден"}, status=404)

        lessons = Lesson.objects.filter(module=test_module).order_by("difficulty_level")
        data = [
            {"level": lesson.difficulty_level, "slug": lesson.slug}
            for lesson in lessons
        ]
        return Response(data)



class MarkLessonsCompletedBeforeModuleView(APIView):

    def post(self, request, language_id, module_order):
        user = request.user

        # Получаем модули по языку, ниже нужного уровня и не тестовые
        modules = Module.objects.filter(language_id=language_id, order__lte=module_order, is_test=False)

        lessons = Lesson.objects.filter(module__in=modules)

        created = 0
        for lesson in lessons:
            obj, was_created = LessonProgress.objects.get_or_create(user=user, lesson=lesson)
            if was_created:
                created += 1

        return Response({
            "status": "ok",
            "message": f"Уроки разблокированы. Добавлено {created} новых записей."
        }, status=status.HTTP_200_OK)



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Данные на бэкенде:", request.data)
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Неверный текущий пароль."]}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Пароль успешно обновлён."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

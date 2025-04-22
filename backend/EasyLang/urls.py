from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, ProfileView,
    LanguageViewSet, ModuleViewSet,
    LessonViewSet, ExerciseViewSet, LessonViewSet, LessonProgressView, ProgressOverviewView, ReviewViewSet
)


router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'reviews', ReviewViewSet)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),

    # Языки
    path('languages/', LanguageViewSet.as_view({'get': 'list'})),
    path('languages/<int:pk>/', LanguageViewSet.as_view({'get': 'retrieve'})),
    path('languages/<int:pk>/modules/', LanguageViewSet.as_view({'get': 'get_modules'})),

    # Модули
    path('modules/', ModuleViewSet.as_view({'get': 'list'})),
    path('modules/<int:pk>/', ModuleViewSet.as_view({'get': 'retrieve'})),
    path('modules/<int:pk>/lessons/', ModuleViewSet.as_view({'get': 'get_lessons'})),

    # Уроки
    path('', include(router.urls)),

    
    # Упражнения (если хочешь доступ ко всем) ?????
    path('exercises/', ExerciseViewSet.as_view({'get': 'list'})),
    path('exercises/<int:pk>/', ExerciseViewSet.as_view({'get': 'retrieve'})),



    path("progress/", LessonProgressView.as_view(), name="lesson-progress"),
    path("progress/overview/", ProgressOverviewView.as_view(), name="progress-overview"),
]


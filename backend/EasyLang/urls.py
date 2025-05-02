from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, ProfileView,
    LanguageViewSet, ModuleViewSet,
    LessonViewSet, ExerciseViewSet, LessonViewSet, LessonProgressView, ProgressOverviewView, ReviewViewSet, MyReviewByLanguageView,
    UserDetailView, DetailedProgressView, TestLessonsView, MarkLessonsCompletedBeforeModuleView, ChangePasswordView
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
    path('progress/detailed/', DetailedProgressView.as_view(), name='detailed-progress'),

    path("lessons/test/<int:language_id>/", TestLessonsView.as_view(), name="test-lessons-by-language"),


    path('reviews/my/<int:language_id>/', MyReviewByLanguageView.as_view()),
    path('users/<int:id>/', UserDetailView.as_view(), name='user_detail'),


    path("progress/unlock-up-to/<int:language_id>/<int:module_order>/", MarkLessonsCompletedBeforeModuleView.as_view()),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
]


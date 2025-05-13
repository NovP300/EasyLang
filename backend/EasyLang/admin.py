from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Language, Module, Lesson, Exercise, User, Review, Feedback

class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

class ExercisesInline(admin.TabularInline):
    model = Exercise
    extra = 1

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    search_fields = ("name",)
    inlines = [ModuleInline]  # Вставка модулей прямо в страницу языка

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "order", "is_test", "paid")
    list_filter = ("language", "is_test", "paid")

    search_fields = ("title", "description")
    inlines = [LessonInline]  # Вставка уроков в модуль

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "difficulty_level", "lesson_order")
    list_filter = ("module", "difficulty_level")
    search_fields = ("title", "content")

    inlines = [ExercisesInline]

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("id", "lesson", "type")
    list_filter = ("type", "lesson__module__language")
    search_fields = ("type", "id")

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'role', 'is_staff', 'subscription', 'subscription_due')
    list_filter = ('role', 'is_staff')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'gender', 'birth_date')}),
        ('Subscription', {'fields': ('subscription', 'subscription_due')}),  # ← добавлено
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'role'),
        }),
    )

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'is_moderated', 'moderation_status')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_done')
from django.contrib import admin
from .models import Language, Module, Lesson, Exercise

class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    search_fields = ("name",)
    inlines = [ModuleInline]  # Вставка модулей прямо в страницу языка

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "language")
    list_filter = ("language",)
    search_fields = ("title", "description")
    inlines = [LessonInline]  # Вставка уроков в модуль

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "difficulty_level")
    list_filter = ("module", "difficulty_level")
    search_fields = ("title", "content")

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("id", "lesson", "type")
    list_filter = ("type", "lesson__module__language")
    search_fields = ("type", "id")

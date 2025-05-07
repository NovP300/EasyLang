from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from slugify import slugify
from django.conf import settings

# Менеджер пользователей (управляет созданием пользователей и суперпользователей)

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("У пользователя должен быть email")
        if not username:
            raise ValueError("У пользователя должен быть логин")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password) #Django должен сам хешировать пароль
        user.save(using=self.db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Суперпользователь должен иметь is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Суперпользователь должен иметь is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)
    

class User(AbstractUser):

    class Role(models.TextChoices):
        STUDENT = "ST", "Ученик"
        TEACHER = "TC", "Учитель"
        CONTENT_MANAGER = "CM", "Модератор"  # Для заявок/отзывов
        ADMIN = "AD", "Администратор"  # Полный доступ (но не root!)
    
    role = models.CharField(
        max_length=2,
        choices=Role.choices,
        default=Role.STUDENT
    )


    email = models.EmailField(unique=True) #Уникальный email
    username = models.CharField(max_length=100, unique=True) 
    objects = CustomUserManager() # Используем написанный менеджер паролей


    USERNAME_FIELD = "email" 
    REQUIRED_FIELDS = ["username"]


    GENDER_CHOICES = [
        ("M", "Мужской"),
        ("F", "Женский"),
    ]
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, null=True, blank=True
    )
    birth_date = models.DateField(null=True, blank=True)

    subscription = models.BooleanField(default=False)
    subscription_due = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.email # Отображение email вместо id


class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Module(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    order = models.PositiveIntegerField(null=True, blank=True)  # null → для тестового модуля
    is_test = models.BooleanField(default=False)
    paid = models.BooleanField(default=False)  # для будущей реализации платных модулей

    def __str__(self):
        return f"{self.language.name} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    difficulty_level = models.IntegerField(choices=[(i, f"{i}/3") for i in range(1, 4)])
    theory = models.JSONField(default=list)
    slug = models.SlugField(unique=True, blank=True)
    lesson_order = models.PositiveIntegerField(default=0)


    def __str__(self):
        return f"{self.module.title} - {self.title}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Lesson.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

class Exercise(models.Model):
    class ExerciseType(models.TextChoices):
        TRANSLATE_WORD = "translate_word", "Выбор перевода слова"
        TRANSLATE_IMAGE = "translate_image", "Перевод по картинке"
        FILL_TRANSLATION = "fill_translation", "Дополните перевод"
        FILL_AUDIO = "fill_audio", "Пропущенное слово по аудио"
        WORD_ORDER = "word_order", "Переведите предложение"
        AUDIO_ORDER = "audio_order", "Что вы услышали?"

    lesson = models.ForeignKey("Lesson", on_delete=models.CASCADE, related_name="exercises")
    type = models.CharField(max_length=30, choices=ExerciseType.choices)
    data = models.JSONField(default=dict, help_text="Все данные для задания (включая текст, варианты, ответы, медиа и т.д.)")

    def __str__(self):
        return f"{self.lesson.title} - {self.get_type_display()}"

    @property
    def header(self):
        # Можно использовать это поле как свойство
        default_headers = {
            "translate_word": "Выберите правильный перевод",
            "translate_image": "Что изображено на картинке?",
            "fill_translation": "Дополните перевод",
            "fill_audio": "Введите пропущенное слово",
            "word_order": "Переведите предложение",
            "audio_order": "Что вы услышали?",
        }
        return default_headers.get(self.type, "Задание")



class LessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="completed_lessons")
    lesson = models.ForeignKey('Lesson', on_delete=models.CASCADE, related_name="completed_by")

    class Meta:
        unique_together = ('user', 'lesson')  # Один пользователь - один прогресс по уроку

    def __str__(self):
        return f"{self.user.email} - {self.lesson.title}"

class Review(models.Model):

    STATUS_CHOICES = [
        ('pending', 'На модерации'),
        ('approved', 'Принят'),
        ('rejected', 'Отклонён'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    response = models.TextField()
    estimation = models.DecimalField(max_digits=2, decimal_places=1)  
    is_moderated = models.BooleanField(default=True)

    moderation_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )

    def __str__(self):
        return f"{self.user.username} - {self.language.name} - {self.estimation}"


class Feedback(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    age = models.PositiveIntegerField(verbose_name="Возраст")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(verbose_name="Email")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_done = models.BooleanField(default=False, verbose_name="Заявка выполнена")

    class Meta:
        verbose_name = "Обратная связь"
        verbose_name_plural = "Обратные связи"

    def __str__(self):
        return f"{self.name} ({self.email})"


class Enrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    language = models.ForeignKey('Language', on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'language')  # Гарантирует уникальность записей

    def __str__(self):
        return f"{self.user.email} → {self.language.name}"
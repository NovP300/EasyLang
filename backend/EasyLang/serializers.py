from rest_framework import serializers
from .models import User, Language, Module, Lesson, Exercise, LessonProgress, Review
from django.contrib.auth.password_validation import validate_password




# Сериализатор для пользователя
class UserSerializer(serializers.ModelSerializer):
    GENDER_CHOICES = [
        ("M", "Мужской"),
        ("F", "Женский"),
    ]
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_null=True, required=False)
    birth_date = serializers.DateField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'gender', 'birth_date']

# Сериализатор для регистрации
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
    write_only=True,
    required=True,
    validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'description']

class ModuleSerializer(serializers.ModelSerializer):
    language = LanguageSerializer(read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'language']

class LessonSerializer(serializers.ModelSerializer):
    module = ModuleSerializer(read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'difficulty_level', 'module', 'slug', 'theory']


class LessonShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'slug', 'title']



class ExerciseSerializer(serializers.ModelSerializer):
    lesson = LessonShortSerializer(read_only=True)
    header = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = [
            'id',
            'lesson',
            'type',
            'header',          
            'data'        
        ]
    
    def get_header(self, obj):
        return obj.header

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'user', 'lesson']
        read_only_fields = ['user'] 

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user', 'date']



class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    repeat_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['repeat_password']:
            raise serializers.ValidationError("Пароли не совпадают.")
        
        validate_password(data['new_password'])
        return data
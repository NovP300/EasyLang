from rest_framework import serializers
from .models import User, Language, Module, Lesson, Exercise, LessonProgress, Review, Feedback, Enrollment
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer




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
        fields = ['id', 'username', 'email', 'first_name', 
        'last_name', 'gender', 'birth_date', 'role', 'subscription', 'subscription_due']

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
        fields = ['id', 'title', 'difficulty_level', 'module', 'slug', 'theory', 'lesson_order']


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
    old_password = serializers.CharField(
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    repeat_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, data):
        if data['new_password'] != data['repeat_password']:
            raise serializers.ValidationError({"repeat_password": "Пароли не совпадают."})
        
        validate_password(data['new_password'])
        return data



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Добавляем кастомные поля в токен
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Добавляем дополнительные данные в ответ
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email
        }
        return data


from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'name', 'age', 'phone', 'email', 'created_at', 'is_done']


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'language', 'enrolled_at']
        read_only_fields = ['id', 'enrolled_at']


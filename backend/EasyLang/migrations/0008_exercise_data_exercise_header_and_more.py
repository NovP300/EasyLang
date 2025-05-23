# Generated by Django 5.1.7 on 2025-04-17 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('EasyLang', '0007_lesson_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='data',
            field=models.JSONField(blank=True, help_text='Дополнительные данные (аудио, изображения, подсказки и т.д.)', null=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='header',
            field=models.CharField(default='Заголовок задания', max_length=255),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='correct_answer',
            field=models.TextField(help_text='Правильный ответ (строка или JSON)'),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='options',
            field=models.JSONField(blank=True, help_text='Варианты ответа (если применимо)', null=True),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='question',
            field=models.TextField(blank=True, help_text='Текст вопроса (например, слово или фраза)', null=True),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='type',
            field=models.CharField(choices=[('translate_word', 'Выбор перевода слова'), ('translate_image', 'Перевод по картинке'), ('fill_translation', 'Дополните перевод'), ('fill_audio', 'Пропущенное слово по аудио'), ('word_order', 'Переведите предложение'), ('audio_order', 'Что вы услышали?')], max_length=30),
        ),
    ]

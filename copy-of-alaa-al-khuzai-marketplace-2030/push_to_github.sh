#!/bin/bash

# 1. تهيئة مستودع Git
git init

# 2. ربط المستودع البعيد (تحديث الرابط إذا كان موجوداً مسبقاً)
git remote add origin https://github.com/alakhzay20-hue/-.git || git remote set-url origin https://github.com/alakhzay20-hue/-.git

# 3. إضافة جميع الملفات
git add .

# 4. إنشاء الـ Commit
git commit -m 'Final push to fix empty repo'

# التأكد من أن اسم الفرع هو main
git branch -M main

# 5. الدفع القسري إلى GitHub
git push -f origin main

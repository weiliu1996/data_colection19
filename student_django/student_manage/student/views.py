from django.shortcuts import render
from student.models import Student
# 引入jsonresponse模块
from django.http import JsonResponse
# 导入json模块
import json
# 导入Q查询
from django.db.models import Q
# Create your views here.
def get_students(request):
    try:
        #使用ORM获取所有学生信息
        obj_students = Student.objects.all().values() 
        #把结果转为list
        students = list(obj_students)
        return(JsonResponse({'code':1,'data':students}))
    except Exception as e:
        # 如果出现异常
        return(JsonResponse({'code':0,'msg':"获取学生信息出现异常，具体错误：" + str(e)}))


def query_student(request):
    # 默认json格式，字典类型:inputstr,通过data['inputstr']取出
    data = json.loads(request.body.decode('UTF-8'))
    try:
        obj_students = Student.objects.filter(Q(name__icontains = data['inputstr']) | Q(gender__icontains = data['inputstr'])).values()
        # 把结果转为list
        students = list(obj_students)
        return (JsonResponse({'code': 1, 'data': students}))
    except Exception as e:
        # 如果出现异常
        return (JsonResponse({'code': 0, 'msg': "查询学生信息出现异常，具体错误：" + str(e)}))

from django.db import models

# Create your models here.
class Student(models.Model):
    gender_choices = (('男','男'),('女','女'))
    sno = models.IntegerField(db_column="SNO",primary_key=True,null=False) #学号主键
    name = models.CharField(db_column='SName',max_length=100,null=False) #姓名
    birthday = models.DateField(db_column='Birthday', null=False)  # 出生日期
    gender = models.CharField(db_column='Gender',max_length=100,choices=gender_choices) #性别
    address = models.CharField(db_column='Address',max_length=200) #家庭地址
    class Meta:
        managed = True
        db_table = "Student"
    def __str__(self):
        return "姓名：%s\t性别：%s" %(self.name,self.gender)
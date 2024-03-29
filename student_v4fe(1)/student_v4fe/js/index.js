const app = new Vue({
    el: '#app',
    data() {
        // 校验学号是否存在
        const rulesSNO = (rule, value, callback) => {
            // 使用Axios进行校验
            axios.post(
                this.baseurl + 'sno/check/',
                {
                    sno: value,
                }
            )
                .then((res) => {
                    //请求成功
                    if (res.data.code === 1) {
                        if (res.data.exists) {
                            callback(new Error("学号已存在"));
                        } else {
                            callback();
                        }
                    } else {
                        callback(new Error("校验学号后端出现异常"))
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        return {
            students: [],
            student_onepage: [],
            baseurl: "http://192.168.0.180:8000/",
            inputstr_front: '',
            total: 0,//数据的总行数
            currentpage: 1,//当前页
            pagesize: 10,//每页显示多少行
            dialogVisible: false,
            dialog_title: "",//弹出框标题
            is_view: false,//标识是否是查看
            is_edit: false,//标识是否是修改
            student_form: {
                sno: '',
                name: '',
                birthday: '',
                gender: '',
                address: '',
            },
            rules: {
                sno: [
                    { required: true, message: '学号不能为空', triggler: 'blur' },
                    { validator: rulesSNO, triggler: 'blur' },
                ],
                name: [
                    { required: true, message: '姓名不能为空', triggler: 'blur' },
                ],
                birthday: [
                    { type: 'date', required: true, message: '出生日期不能为空', triggler: 'change' },
                ],
                gender: [
                    { required: true, message: '性别不能为空', triggler: 'change' },
                ],
                address: [
                    { required: true, message: '地址不能为空', triggler: 'blur' },
                ],
            }
        }
    },
    mounted() {
        //自动加载数据
        this.getstudents();
    },
    methods: {
        getstudents: function () {
            //使用Axios实现Ajax请求
            //记录this地址
            let that = this
            axios
                .get(that.baseurl + "students/")
                .then(function (res) {
                    //请求成功后执行的函数
                    if (res.data.code === 1) {
                        //把数据给students
                        that.students = res.data.data;
                        that.total = res.data.data.length;
                        that.get_student_onepage()
                        //获取当前页数据
                        //提示
                        that.$message({
                            message: '数据加载成功',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(function (err) {
                    //请求失败后执行的函数
                    console.log(err);
                });
        },
        //获取当前页的学生信息
        get_student_onepage: function () {
            //清空之前页信息
            this.student_onepage = [];
            //获得当前页数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                //遍历数据添加到pagestudent中
                this.student_onepage.push(this.students[i]);
                //判断是否达到一页的要求
                if (this.student_onepage.length === this.pagesize) break
            }
        },
        //分页时修改每页行数
        handleSizeChange: function (size) {
            //修改当前每页的数据行数
            this.pagesize = size;
            //数据重新分页
            this.get_student_onepage();
        },
        //调整当前的页码
        handleCurrentChange: function (pagenumber) {
            //修改当前的页码
            this.currentpage = pagenumber;
            this.get_student_onepage();
        },
        // 添加学生时打开表单
        add_student() {
            //修改标题
            this.dialog_title = "添加学生明细";

            this.dialogVisible = true;
        },
        // 查看学生明细
        view_student(row) {
            //修改标题
            this.dialog_title = "查看学生明细";

            this.is_view = true;
            // 弹出表单
            this.dialogVisible = true;
            // 深拷贝方法1
            // this.student_form.sno = row.sno;
            // this.student_form.name = row.name;
            // this.student_form.birthday = row.birthday;
            // this.student_form.gender = row.gender;
            // this.student_form.address = row.address;
            // 深拷贝方法2
            this.student_form = JSON.parse(JSON.stringify(row))

        },
        // 修改学生明细
        update_student(row) {
            //修改标题
            this.dialog_title = "修改学生明细";

            this.is_edit = true;
            // 弹出表单
            this.dialogVisible = true;
            this.student_form = JSON.parse(JSON.stringify(row))

        },
        // 关闭弹出框的表单
        close_dialog() {
            // 清空
            this.student_form.sno = "";
            this.student_form.name = "";
            this.student_form.birthday = "";
            this.student_form.gender = "";
            this.student_form.address = "";
            // 关闭
            this.dialogVisible = false;
            // 初始化is_view,is_edit
            this.is_view = false;
            this.is_edit = false;
        },
        //实现学生信息查询
        query_student_front: function () {
            //使用Ajax请求--post请求，传递inputstr
            let that = this;
            axios
                .post(
                    that.baseurl + "students/query/",
                    {
                        inputstr: that.inputstr_front
                    }
                )
                .then(function (res) {
                    if (res.data.code === 1) {
                        that.students = res.data.data;
                        that.total = res.data.data.length;
                        that.get_student_onepage();
                        that.$message({
                            message: '查询数据成功',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    that.$message.error("获取后端查询结果出现异常！");
                }

                )
        }
    }
})
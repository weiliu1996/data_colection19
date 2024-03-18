const app = new Vue({
    el:'#app',
    data:{
        students:[],
        student_onepage:[],
        baseurl:"http://10.77.183.160:8000/",
        inputstr_front:'',
        total:0,//数据的总行数
        currentpage:1,//当前页
        pagesize:10,//每页显示多少行
        dialogVisible:false,
    },
    mounted() {
        //自动加载数据
        this.getstudents();
    },
    methods:{
        getstudents:function(){
            //使用Axios实现Ajax请求
            //记录this地址
            let that = this
            axios
            .get(that.baseurl + "students/")
            .then(function(res){
                //请求成功后执行的函数
                if(res.data.code === 1){
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
                }else{
                    that.$message.error(res.data.msg);
                }
            })
            .catch(function(err){
                //请求失败后执行的函数
                console.log(err);
            });        
        },
        //获取当前页的学生信息
        get_student_onepage:function(){
            //清空之前页信息
            this.student_onepage = [];
            //获得当前页数据
            for(let i=(this.currentpage-1) * this.pagesize;i < this.total;i ++){
                //遍历数据添加到pagestudent中
                this.student_onepage.push(this.students[i]);
                //判断是否达到一页的要求
                if(this.student_onepage.length === this.pagesize) break
            }
        },
        //分页时修改每页行数
        handleSizeChange:function(size){
            //修改当前每页的数据行数
            this.pagesize = size;
            //数据重新分页
            this.get_student_onepage();
        },
        //调整当前的页码
        handleCurrentChange:function(pagenumber){
            //修改当前的页码
            this.currentpage = pagenumber;
            this.get_student_onepage();
        },
        // 添加学生时打开表单
        add_student(){
            this.dialogVisible = true;
        },
        //实现学生信息查询
        query_student_front:function(){
            //使用Ajax请求--post请求，传递inputstr
            let that = this;
            axios
            .post(
                that.baseurl + "students/query/",
                {
                    inputstr: that.inputstr_front
                }
            )
            .then(function(res){
                if(res.data.code === 1){
                    that.students = res.data.data;
                    that.total = res.data.data.length;
                    that.get_student_onepage();
                    that.$message({
                        message: '查询数据成功',
                        type: 'success'
                    });
                }else{
                    that.$message.error(res.data.msg);
                }
            })
            .catch(function(err){
                console.log(err);
                that.$message.error("获取后端查询结果出现异常！");
            }

            )
        }
    }
})
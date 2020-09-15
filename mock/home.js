
module.exports = [
    {
        url:'/home',
        type:'get',
        response: config=>{
            return{
                code: 20000,
                data: {
                    name: '张三',
                    sex: '男',
                    age: 18
                }
            }
        }
    }
]
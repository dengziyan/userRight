
module.exports = [
    {
        url:'/userList',
        type:'get',
        response: config=>{
            return{
                code: 20000,
                data: {
                    row:[
                        {
                            id:1,
                            username:'liyifeng',
                            nickName:'李易峰',
                            email:'111@qq.com',
                            createTime:'',
                            loginTime:'',
                            
                        }
                    ]

                }
                    
                
            }
        }
    }
]
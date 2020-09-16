
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
                            
                        },
                        {
                            id:2,
                            username:'dengziyan',
                            nickName:'邓紫嫣',
                            email:'222@qq.com',
                            createTime:'',
                            loginTime:'',
                            
                        },
                        {
                            id:3,
                            username:'wuyuan',
                            nickName:'无源',
                            email:'111@qq.com',
                            createTime:'',
                            loginTime:'',
                            
                        },
                        {
                            id:4,
                            username:'panguangming',
                            nickName:'盘光明',
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
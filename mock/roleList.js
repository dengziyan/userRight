
module.exports = [
    {
        url:'/roleList',
        type:'get',
        response: config=>{
            return{
                code: 20000,
                data: {
                    row:[
                        {
                            id:1,
                            name:'超级管理员',
                            description:'拥有所有权限',
                            email:'111@qq.com'
                                                       
                        }
                    ]

                }
                    
                
            }
        }
    }
]
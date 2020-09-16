
module.exports = [
    {
        url:'/resourceList',
        type:'get',
        response: config=>{
            return{
                code: 20000,
                data: {
                    row:[
                        {
                            id:1,
                            name:'后台用户管理',
                            url:'',
                            description:'',
                            createTime:''
                            
                                                       
                        }
                    ]

                }
                    
                
            }
        }
    }
]
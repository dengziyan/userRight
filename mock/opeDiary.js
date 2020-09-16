
module.exports = [
    {
        url:'/opeDiary',
        type:'get',
        response: config=>{
            return{
                code: 20000,
                data: {
                    row:[
                        {
                            id:1,
                            title:'权限',
                            level:'一级',
                            name:'ums',
                            icon:'el-icon-s-goods',
                            sort:0,
                            
                                                       
                        }
                    ]

                }
                    
                
            }
        }
    }
]
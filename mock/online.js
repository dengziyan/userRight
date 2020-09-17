
module.exports = [
    {
        url:'/online',
        type:'get',
        response: config=>{
            return{
                code: 20000,
                data: {
                    row:[
                        {
                            tokenId:1,
                            userName:'liyifeng',
                            ipaddr:'115.194.180.13',
                            loginLocation:'内网IP',
                            browser:'Chrome8',
                            os:'windows10',
                            loginTime:'2020-09-22 20:09:20'
                            
                                                       
                        },
                        {
                            tokenId:2,
                            userName:'dengziyan',
                            ipaddr:'115.194.180.13',
                            loginLocation:'内网IP',
                            browser:'Chrome8',
                            os:'windows10',
                            loginTime:'2020-09-22 20:09:20'
                            
                                                       
                        },
                        {
                            tokenId:3,
                            userName:'dengziyan',
                            ipaddr:'115.194.180.13',
                            loginLocation:'内网IP',
                            browser:'Chrome8',
                            os:'windows10',
                            loginTime:'2020-09-22 20:09:20'
                            
                                                       
                        }
                    ]

                }
                    
                
            }
        }
    }
]
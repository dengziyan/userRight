<template>
    <div>
      首页
      <h1>{{user.name}}</h1>
      <h1>{{user.sex}}</h1>
      <h1>{{user.age}}</h1>
    </div>
</template>

<script>
    import { getHome } from '@/api/home'
    export default {
        data(){
            return{
                user: {}
            }
        },
        mounted(){
            getHome().then(res=>{
                this.user = res.data;
                console.log(res.data);
            })
            this.$http.get('/home').then(res=>{
                console.log(res);
            })
        }
        
    }
</script>

<style scoped>

</style>

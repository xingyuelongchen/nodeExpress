<template>
<div class="message">
  {{msg}}
  
</div>  
</template>  
<script> 
   export default { 
      data(){
         return{
             msg:'message'
          }
      },
      methods:{
        
      }
    } 
</script> 
<style lang="less" scoped>
.message{
background:#fff;
}
</style>  
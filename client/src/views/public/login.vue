<template>
    <div class="login">
        <el-form :model="form" label-position="right">
            <el-form-item label="账号：">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="密码：">
                <el-input show-password v-model="form.password" />
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>  
<script>
export default {
    data() {
        return {
            form: {
                name: "",
                password: ""
            }
        };
    },
    methods: {
        onSubmit() {
            this.$http({
                url: "http://127.0.0.1:3000/api/v1/public/login",
                method: "post",
                data: this.form,
                headers: {
                    token: "token"
                }
            })
                .then(e => {
                    console.log("a", e);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script> 
<style lang="less" scoped>
.login {
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .el-form {
        width: 360px;
        box-shadow: 0 0 20px #eee;
        border-radius: 6px;
        padding: 20px;
    }
}
</style>  
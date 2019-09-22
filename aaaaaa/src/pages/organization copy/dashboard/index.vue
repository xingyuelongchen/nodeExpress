<template>
    <div class="sideShow">
        <mainTitle v-model="input" @input="event" />
        <div style="overflow:auto;height:100%">
            <el-container class="index-content">
                <el-main>
                    <el-row>
                        <el-col :xs="24" :sm="10" :md="8" :lg="7">
                            <el-card class="box-card">
                                <div slot="header" class="space-between">
                                    <span>卡片名称</span>
                                    <el-button style="text-align:right" type="text">去处理</el-button>
                                </div>
                                <div class="card-content">
                                    <div></div>
                                    <div>
                                        <div>10</div>
                                        <div>成员管理</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :xs="24" :sm="10" :md="8" :lg="7">
                            <el-card class="box-card">
                                <div slot="header" class="space-between">
                                    <span>卡片名称</span>
                                    <el-button style="text-align:right" type="text">去处理</el-button>
                                </div>
                                <div class="card-content">
                                    <div></div>
                                    <div>
                                        <div>10</div>
                                        <div>成员管理</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :xs="24" :sm="10" :md="8" :lg="7">
                            <el-card class="box-card">
                                <div slot="header" class="space-between">
                                    <span>卡片名称</span>
                                    <el-button style="text-align:right" type="text">去处理</el-button>
                                </div>
                                <div class="card-content">
                                    <div></div>
                                    <div>
                                        <div>10</div>
                                        <div>成员管理</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </div>
    </div>
</template>  
<script>
export default {
    components: {
        mainTitle: () => import("@/components/public/mainTitle.vue")
    },
    data() {
        return {
            input: null
        };
    },
    methods: {
        event(e) {
            console.log(e);
        }
    }
};
</script> 
<style lang="less" scoped>
.sideShow {
    height: 100%;
    .index-content {
        width: 90%;
        margin: 0 auto;
        background: #fff;
        border-radius: 6px;
        margin-top: 40px;
        margin-bottom: 85px;
        .el-col {
            min-width: 238px;
        }
        .card-content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            > div {
                margin-left: 25px;
            }
            > div:first-child {
                width: 80px;
                height: 80px;
                background: #ccc;
                border-radius: 50%;
            }
        }
    }
}
</style>  
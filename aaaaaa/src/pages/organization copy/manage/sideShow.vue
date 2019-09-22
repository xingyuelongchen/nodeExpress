<template>
    <div class="index">
        <mainTitle v-model="input" @input="event" />
        <div style="overflow:auto;height:100%">
            <el-container class="index-content">
                <div class="imgList">
                    <vuedraggable
                        v-model="arr"
                        :options="{group:'addSideImg',animation:150,filter :'.add-img'}"
                        tag="div"
                    >
                        <template v-for="v in arr ">
                            <div :key="v">
                                <div class="imgItem">
                                    <div class="img">
                                        <el-image
                                            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                                            lazy
                                            fit="cover"
                                        >
                                            <div slot="error" class="image-slot">
                                                <i class="el-icon-picture-outline"></i>
                                            </div>
                                        </el-image>
                                    </div>
                                    <div class="tool">
                                        <div>a</div>
                                        <div>b</div>
                                    </div>
                                    <div class="title">title</div>
                                </div>
                            </div>
                        </template>
                        <div>
                            <div class="add-img text-active" @click="addImgShow = true">
                                <i class="my-icon icon-i-add"></i>
                                <el-dialog title="提示" :visible="addImgShow" width="30%">
                                    <span>这是一段信息</span>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click.stop="addImgShow = false">取 消</el-button>
                                        <el-button
                                            type="primary"
                                            @click.stop="addImgShow = false"
                                        >确 定</el-button>
                                    </span>
                                </el-dialog>
                            </div>
                        </div>
                    </vuedraggable>
                </div>
            </el-container>
        </div>
    </div>
</template>  
<script>
import vuedraggable from "vuedraggable";
export default {
    components: {
        mainTitle: () => import("@/components/public/mainTitle.vue"),
        vuedraggable
    },
    data() {
        return {
            input: null,
            addImgShow: false,
            arr: [1, 2, 3, 4]
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
.index {
    height: 100%;
    .index-content {
        margin-bottom: 85px;
        .imgList {
            width: 100%;
            > div {
                padding: 0 20px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                > div {
                    max-width: 296px;
                    max-height: 296px;
                    min-width: 200px;
                    min-height: 200px;
                    width: 18%;
                    margin: 0.6%;
                    border-radius: 6px;
                    .imgItem:hover {
                        &:after {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: #32b0b350;
                            content: "拖动调整顺序";
                            cursor: pointer;
                            text-align: center;
                            line-height: 296px;
                            color: #fff;
                            font-size: 16px;
                        }
                    }
                    .imgItem {
                        width: 100%;
                        position: relative;
                        background: #ccc;
                        border-radius: 6px;
                        overflow: hidden;
                        padding-top: 100%;
                        > div {
                            position: absolute;
                            &.img {
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                margin: auto;
                                .el-image {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            &.tool {
                                width: 100%;
                                top: 0;
                                left: 0;
                                display: flex;
                                justify-content: space-between;
                            }
                            &.title {
                                width: 100%;
                                height: 20%;
                                bottom: 0;
                                left: 0;
                                background: rgba(0, 0, 0, 0.2);
                            }
                        }
                    }
                    .add-img {
                        width: 100%;
                        border-radius: 6px;
                        overflow: hidden;
                        padding-top: 100%;
                        background: transparent;
                        color: #838eab;
                        border: 1px dashed #838eab;
                        display: -ms-flexbox;
                        -ms-flex-pack: center;
                        -ms-flex-align: center;
                        font-size: 56px;
                        position: relative;
                        > i {
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            margin: auto;
                            text-align: center;
                            margin-top: -28px;
                        }
                    }
                }
            }
        }
    }
}
</style>  
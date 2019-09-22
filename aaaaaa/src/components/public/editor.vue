<template>
  <div class="my-editor">
    <div ref="editor" style="text-align:left;max-height:30px"></div>
    <div ref="editort" style="text-align:left;overflow:auto"></div>
  </div>
</template>

<script>
import E from "wangeditor";

export default {
  name: "editor",
  props: ["value"],
  data() {
    return {
      editorContent: null
    };
  },
  mounted() {
    var editor = new E(this.$refs.editor, this.$refs.editort);
    if (this.value) {
    }
    editor.customConfig.onchange = data => {
      this.$emit("input", { source: "editor", data });
    };
    // editor.customConfig.showLinkImg = false;//隐藏网络图片
    editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
    // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
    editor.customConfig.fontNames = [
      "宋体",
      "微软雅黑",
      "Arial",
      "Tahoma",
      "Verdana",
      "Noto Sans TC"
    ];
    // 字体背景颜色
    editor.customConfig.colors = [
      "#000000",
      "#eeece0",
      "#1c487f",
      "#4d80bf",
      "#c24f4a",
      "#8baa4a",
      "#7b5ba1",
      "#46acc8",
      "#f9963b",
      "#ffffff"
    ];
    editor.customConfig.lang = {
      设置标题: "Title",
      正文: "p",
      链接文字: "Link text",
      链接: "Link",
      上传图片: "Upload image",
      上传: "Upload",
      创建: "Init",
      文字颜色: "Text Color",
      背景色: "Background Color",
      设置列表: "List",
      有序列表: "Ordered",
      无序列表: "Unordered",
      靠左: "Left",
      靠右: "Right",
      居中: "Center",
      网络图片: "Network picture",
      对齐方式: "Align",
      图片Link: "Image URL",
      插入表格: "InsertTable",
      插入: "Insert",
      init: "Insert",
      行: "Row",
      列的表格: "Col",
      字体: "font",
      编辑图片: "Edit pictures",
      删除图片: "delete",
      最大宽度: "Max width"
      // 还可自定添加更多
    };
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      // "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      // "video", // 插入视频
      // "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    editor.create();
  }
};
</script>

<style lang="less" scoped>
.my-editor {
  text-align: left;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  > div {
    flex: 1 1 auto;
  }
  /deep/ .w-e-menu {
    z-index: 0 !important;
  }
  & /deep/ .w-e-text {
    height: 95% !important;
    padding: 0 10px;
    overflow-y: initial;
  }
  /deep/ .w-e-list {
    padding: none;
    text-align: left;
  }
  /deep/ .w-e-toolbar {
    overflow-y: initial;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      flex: 1 1 auto;
      padding: 0 0;
    }
  }
}
</style>
 <style lang="less">
// /* table 样式 */
// table {
//     border-top: 1px solid #ccc;
//     border-left: 1px solid #ccc;
// }

// table td, table th {
//     border-bottom: 1px solid #ccc;
//     border-right: 1px solid #ccc;
//     padding: 3px 5px;
// }

// table th {
//     border-bottom: 2px solid #ccc;
//     text-align: center;
// }

// /* blockquote 样式 */
// blockquote {
//     display: block;
//     border-left: 8px solid #d0e5f2;
//     padding: 5px 10px;
//     margin: 10px 0;
//     line-height: 1.4;
//     font-size: 100%;
//     background-color: #f1f1f1;
// }

// /* code 样式 */
// code {
//     display: inline-block;
//     @css { * }display: inline;
//     @css { * }zoom: 1;
//     background-color: #f1f1f1;
//     border-radius: 3px;
//     padding: 3px 5px;
//     margin: 0 3px;
// }

// pre code {
//     display: block;
// }

// ul, ol {
//     margin: 10px 0 10px 20px;
// }
//
</style>

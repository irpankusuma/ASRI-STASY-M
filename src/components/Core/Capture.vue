<template>
  <div>
    <div class="screen-capture">
      <div id="capture" ref="capture"></div>
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import downloadjs from 'downloadjs';

export default {
    name: 'ScreenCapture',
    props: {
      html: Element,
      capturename: 'downloadfile.jpeg'
    },
    data() {
      return {
        drawFlag: false,
        mouseX: 0,
        mouseY: 0,
        ctx: null,
        oldPoint: {},
        imagefile: null,
        type:'image/jpeg'
      };
    },
    methods: {
        capture() {
          this.captureDom(this.html,canvas => {
            this.imagefile = canvas.toDataURL(this.type);
            downloadjs(this.imagefile,this.filename,this.type);
          });
        },
        captureDom(dom,callback) {
          let shareContent = dom; // 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
          let width = shareContent.offsetWidth; // 获取(原生）dom 宽度
          let height = shareContent.offsetHeight; // 获取(原生）dom 高
          let offsetTop = shareContent.offsetTop; //元素距离顶部的偏移量
          let canvas = document.createElement("canvas"); //创建canvas 对象
          canvas.id = "capture-canvas";
          let context = canvas.getContext("2d");
          // let scaleBy = this.getPixelRatio(context); //获取像素密度的方法 (也可以采用自定义缩放比例)
          let scaleBy = 4;
          canvas.width = width * scaleBy; //这里 由于绘制的dom 为固定宽度，居中，所以没有偏移
          canvas.height = (height + offsetTop) * scaleBy; // 注意高度问题，由于顶部有个距离所以要加上顶部的距离，解决图像高度偏移问题
          context.scale(scaleBy, scaleBy);
          let opts = {
            allowTaint: true, //允许加载跨域的图片
            tainttest: true, //检测每张图片都已经加载完成
            scale: scaleBy, // 添加的scale 参数
            canvas: canvas, //自定义 canvas
            logging: false, //日志开关，发布的时候记得改成false
            width: width, //dom 原始宽度
            height: height //dom 原始高度
          };

          html2canvas(shareContent, opts).then(canvas => {
            callback(canvas);
          });
        },
        getPixelRatio: function(context) {
          let backingStore =
            context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
          return (window.devicePixelRatio || 1) / backingStore;
        }
    }
}
</script>
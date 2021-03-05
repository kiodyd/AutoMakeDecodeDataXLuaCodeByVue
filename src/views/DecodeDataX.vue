
<template>
  <div>
    <!-- 主要组件-->
    <myData :unDecodeMsg = 'unDecodeMsg'></myData>
    <!-- 展示结果-->
    <a-button @click="openResultView" type="primary" style="width:75%;margin-top:20px;margin-bottom:10px">
      生成代码
    </a-button>
    <a-modal v-model="showResult" title="生成成功" @ok="reStart" okText="重新开始" width="60%">
      <a-result status="success" title="请手动复制代码">
        <a-icon type="smile" theme="twoTone" />
        <pre>{{buildRemark(0,unDecodeMsg) + '\n' + buildCode()}}</pre>
      </a-result>
    </a-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      unDecodeMsg:[],
      showResult:false
    };
  },
  methods: {
    //解析单个值
    decodeValue (owner,data,obj) {
      let res = owner+'.'+obj.propName+' = '
      if (obj.valueType == 0) {
        res = res+data+":GetInt(MsgKey."+obj.msgKey+")"
      }else if (obj.valueType == 1) {
        res = res+data+":GetInt64(MsgKey."+obj.msgKey+")"
      }else if (obj.valueType == 2) { 
        res = res+data+":GetUTF8String(MsgKey."+obj.msgKey+")"
      }
      return res+"\n"
    },
    //生成缩进
    buildSnap (layer) {
      return ("    ").repeat(layer)
    },
    //解析Array
    decodeTable (layer,owner,data,obj) {
      let res = this.buildSnap(layer) + owner + "." + obj.propName + " = {}\n"
      res = res + this.buildSnap(layer) + "local " + obj.propName + "Num = " + data + ":GetDataXArraySize(MsgKey." + obj.msgKey + ")\n"
      res = res + this.buildSnap(layer) + "for " + 'i'.repeat(layer+1) + " = 0, " + obj.propName + "Num - 1 do\n"
      res = res + this.buildSnap(layer+1) + "local " + obj.propName + "Data = " + data + ":GetDataXArrayElement(MsgKey." + obj.msgKey + ", " + 'i'.repeat(layer+1) + ")\n"
      res = res + this.buildSnap(layer+1) + "local " + obj.propName + "Array = {}\n"
      obj.subData.forEach(element => {
        if (element.valueType == 3) {
          res = res + this.decodeTable(layer+1,obj.propName+"Array",obj.propName+"Data",element)
        }else {
          res = res + this.buildSnap(layer+1) + this.decodeValue(obj.propName+"Array",obj.propName+"Data",element)
        }
      });
      res = res + this.buildSnap(layer+1) + "table.insert(" + owner + "." + obj.propName + ", " + obj.propName + "Array" + ")\n"
      res = res + this.buildSnap(layer) + "end\n"
      return res
    },
    //输出生成的代码
    buildCode () {
      let res = ""
      res = res + "local Info = {}\n"
      this.unDecodeMsg.forEach(element => {
        if (element.valueType == 3) {
          res = res + this.decodeTable(0,"Info","msgData",element)
        }else {
          res = res + this.decodeValue("Info","msgData",element)
        }
      });
      res = res + "return Info"
      return res
    },
    //生成注释
    buildRemark (layer,obj) {
      let res = ""
      //第一层需要生成lua的注释代码标记
      if (layer === 0) {
        res = res + "--[[\n"
      }else {
        res = res + this.buildSnap(layer) + "{\n"
      }

      //中间部分
      obj.forEach(element => {
        res = res + (this.buildSnap(layer + 1) + element.propName).padEnd(40," ") + element.remark + "\n"
        if (element.valueType == 3) {
          res = res + this.buildRemark(layer + 1, element.subData)
        }
      });

      //注释结尾
      if (layer === 0) {
        res = res + "]]\n"
      }else {
        res = res + this.buildSnap(layer) + "}\n"
      }

      return res
    },
    openResultView () {
      this.showResult = true;
    },
    reStart () {
      this.unDecodeMsg = []
      this.showResult = false;
    }
  },
}
</script>

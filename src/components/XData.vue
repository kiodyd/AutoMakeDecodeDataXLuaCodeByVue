<template>
  <a-card style="width: 80%;margin:auto;margin-top:10px">
    <div v-for="(value,index) in unDecodeMsg" 
        :key="Number(index)" style="margin: 10px">
      <div>
        <a-input
          v-model="value.propName"
          placeholder="输入用于程序中使用的变量名"
          style="width: 20%; margin-right: 12px"
        />
        <a-input
          v-model="value.msgKey"
          placeholder="输入服务端交互的解析ID"
          style="width: 20%; margin-right: 12px"
        />
        <a-input
          v-model="value.remark"
          placeholder="输入变量注释"
          style="width: 20%; margin-right: 12px"
        />
        <a-dropdown style="width: 20%; margin-right: 8px" >
          <a-menu slot="overlay" @click="e => {value.valueType = e.key}">
            <a-menu-item
              v-for="(type, index) in myDataXMsg.valueTypes"
              :key="Number(index)"
            >
              {{ type }}
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            {{myDataXMsg.valueTypes[value.valueType]}} <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-icon
          v-if="unDecodeMsg.length > 0"
          class="dynamic-delete-button"
          type="minus-circle-o"
          @click="removeData(value)"
        />
      </div>
      <div>
        <myData v-if="value.valueType === 3" :unDecodeMsg="value.subData"></myData>
      </div>
    </div>
    <div>
      <a-button type="dashed" style="width: 60%" @click="addDataXMsg">
        <a-icon type="plus" /> 增加解析数据
      </a-button>
    </div>
    <div>
    <!-- 实验性功能，从文档复制识别-->
    <a-button @click="openCopyView" type="danger" ghost style="width:60%;margin-top:10px">
      从协议文档复制（实验性功能，注意复制的格式）
    </a-button>
    <a-modal v-model="showCopyPage" title="实验性功能" @ok="startReadData" okText="解析" width="60%">
      <a-result title="请复制要解析的部分到文本框">
        <a-textarea placeholder="    | KeyId | v1.0.0 | int32 | 注释 |
      | KeyId | v1.0.0 | int64 | 注释 |
      | KeyId | v1.0.0 | utf8-string | 注释 |
      | KeyId | v1.0.0 | array | 注释 |"
        :rows="4" v-model="inputText" />
      </a-result>
    </a-modal>
    </div>
  </a-card>
</template>

<script>

export default {
  name: 'myData',
  props: {
    unDecodeMsg: Array
  },

  data() {
    return {
      myDataXMsg: {
        valueTypes: ["int32", "int64", "utf-8", "array"],
      },
      showCopyPage:false,
      inputText:""
    };
  },
  methods: {
    addDataXMsg(){
      this.unDecodeMsg.push({
        propName:"",
        msgKey:"",
        valueType:0,
        remark:"",
        subData:[]
      })
    },
    removeData(item) {
      let index = this.unDecodeMsg.indexOf(item);
      if (index !== -1) {
        this.unDecodeMsg.splice(index, 1);
      }
    },
    openCopyView () {
      this.showCopyPage = true;
    },
    startReadData () {
      this.readDataFromInput(this.inputText,this.unDecodeMsg);
      this.showCopyPage = false;
    },
    //从原有markdomn文档解析
    readDataFromInput (srcData,outData) {
      let allData = srcData.split('\n')
      allData.forEach(d => {
        let splitData = d.split('|')
        if (splitData.length == 6) {
          let _msgkey = splitData[1].trim()
          let _valueType = 0
          switch (splitData[3].trim().toLowerCase()) {
            case "int32":
              _valueType = 0
              break;
            case "int64":
              _valueType = 1
              break;
            case "utf8-string":
              _valueType = 2
              break;
            case "array":
              _valueType = 3
              break;
            default:
              _valueType = 3
              break;
          }
          let _remark = splitData[4].trim()
          outData.push({
            propName:"",
            msgKey:_msgkey,
            valueType:_valueType,
            remark:_remark,
            subData:[]
          })
        }
      });
    },
  },
};
</script>
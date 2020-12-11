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
  },
};
</script>
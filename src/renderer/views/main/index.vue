<template>
    <el-container style="height: 100%;">
        <el-main>
            <el-container style="margin-bottom:20px">
                <el-button type="primary" @click="refleshPage">刷新页面</el-button>
                <button class="gateBtn">
                    <img  src="~@/assets/vertical_bar.png" alt="vertical_bar">起1#
                </button>
                <button class="gateBtn">
                    <img  src="~@/assets/vertical_bar.png" alt="vertical_bar">起2#
                </button>
                <button class="gateBtn">
                    <img  src="~@/assets/cross_bar.png" alt="cross-bar">落1#
                </button>
                <button class="gateBtn">
                    <img  src="~@/assets/cross_bar.png" alt="cross-bar">落2#
                </button>
            </el-container>
            <el-container class="con-border">
                <el-header class="con-header" style="height:40px">电子过磅区</el-header>
                <el-main>
                    <el-row>
                        <el-col :span="6">
                            <div class="weight">
                                <p class="val">{{weight}}</p>
                                <p class="unit">吨</p>
                            </div>
                            <p class="warningInfo" v-if="warningInfo">{{warningInfo}} 15:25:36</p>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
            <el-container class="con-border">
                <el-header class="con-header" style="height:40px">磅单信息</el-header>
                <el-main>
                    <el-row>
                        <el-col :span="24">
                            <el-form :inline="true" :model="staticForm" ref="queryForm" class="query-form">
                                <el-form-item label="车牌号">
                                    <el-input v-model="staticForm.carNo" placeholder="车牌号" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="毛重">
                                    <el-input v-model="staticForm.grossWeight" placeholder="毛重" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="皮重">
                                    <el-input v-model="staticForm.tareWeight" placeholder="皮重" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="皮重">
                                    <el-input v-model="staticForm.netWeight" placeholder="净重" disabled></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
            <el-container class="con-border">
                <el-header class="con-header" style="height:40px">过磅记录</el-header>
                <el-main>
                    <!-- 搜索查询区域 -->
                    <el-row>
                        <el-col :span="24">
                            <el-form :inline="true" :model="queryForm" ref="queryForm" class="query-form">
                                <el-form-item label="过磅日期">
                                    <el-col :span="11">
                                        <el-form-item prop="startTime">
                                            <el-date-picker type="datetime" default-time="defaultStartTime" placeholder="开始时间" v-model="queryForm.start" style="width: 100%;" :clearable="false" :editable="false" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="text-c" :span="2">-</el-col>
                                    <el-col :span="11">
                                        <el-form-item prop="endTime">
                                            <el-date-picker type="datetime" default-time="defaultEndTime" placeholder="结束时间" v-model="queryForm.end" style="width: 100%;" :clearable="false" :editable="false" />
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="车牌号">
                                    <el-input v-model="queryForm.carNo" placeholder="车牌号"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                                    <el-button type="success" icon="el-icon-document" @click="exportExcel">导出</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <!-- 磅单信息列表 区域 -->
                    <el-row>
                        <el-col :span="24">
                            <el-table :data="tableDataList" height="193" border id="tableList"
                            :cell-style="cellStyle"
                            :header-cell-style="{ backgroundColor:'#EEF1F6',borderColor:'#DFE6EC',color:'#1F2D3D',padding:'4px 0'}">
                                <el-table-column type="selection" width="40"></el-table-column>
                                <el-table-column align="center" prop="poundOrderNo" label="磅单号"></el-table-column>
                                <el-table-column align="center" prop="startTime" label="开始时间"></el-table-column>
                                <el-table-column align="center" prop="endTime" label="结束时间"></el-table-column>
                                <el-table-column align="center" prop="carNo" label="车牌号"></el-table-column>
                                <el-table-column align="center" prop="grossWeight" label="毛重"></el-table-column>
                                <el-table-column align="center" prop="tareWeight" label="皮重"></el-table-column>
                                <el-table-column align="center" prop="netWeight" label="净重"></el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <!-- 分页区域 -->
                    <el-row style="margin-top:10px">
                        <el-col :span="24">
                            <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="queryForm.pageNo" 
                            :page-sizes="[1, 2, 5, 10]" :page-size="queryForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
// import {getTableData} from '@/api/sys'
import {mapState} from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
require('@/utils/httpserver')

export default {
  name: 'main_index',
  data () {
    return {
      weight: 0, // 实时称重值，用websocket获取
      queryForm: { // 获取过磅记录列表的参数对象
        carNo: '',
        startTime: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(),
        pageSize: 2, // 每页显示多少条数据
        pageNo: 1 // 当前的页码数
      },
      tableDataList: [], // 获取过磅记录列表
      totalNum: 0, // 列表数据总数
      defaultStartTime: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
      defaultEndTime: new Date(),
      path: 'ws://192.168.2.61:8890/A', // socket 连接路径
      socket: ''
    }
  },
  created () {
    this.getTableList()
  },
  mounted () {
    // 关闭login窗口
    this.$electron.ipcRenderer.send('closeLogin')
    // 初始化
    this.init()
    // this.staticForm = {...this.$store.state.weight.poundInfo}
    // console.log(this.staticForm)
  },
  computed: {
    ...mapState({
      staticForm: state => state.weight.poundInfo,
      warningInfo: state => state.weight.warningInfo
    })
  },
  methods: {
    init () {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open () {
      console.log('socket连接成功')
    },
    error () {
      console.log('连接错误')
    },
    getMessage (msg) {
      console.log(msg.data)
      this.weight = msg.data
    },
    send (params) {
      this.socket.send(params)
    },
    close () {
      console.log('socket已经关闭')
    },
    search () {
      this.getTableList()
      console.log(this.queryForm.carNo)
      // es6过滤得到满足搜索条件的展示数据list
      // var list = this.tableDataList.filter((item, index) => item.date1.includes(this.value))
      // list = list.filter(item => item.carNo.includes(this.queryForm.carNo))
      let list = this.tableDataList.filter(item => item.carNo.includes(this.queryForm.carNo))
      console.log(list)
      // 过滤分页
      // this.tableDataList = list.filter(index => index < this.queryForm.pageNo * this.queryForm.pageSize && index >= this.queryForm.pageSize * (this.queryForm.pageNo - 1))
      this.tableDataList = list
      this.totalNum = this.tableDataList.length
      console.log(this.tableDataList)
    },
    getTableList () {
      // getTableData(this.queryForm).then(response => {
      // console.log(response.data)
      // this.tableDataList = response.data.rows
      // this.totalNum = response.data.total
      // })
      let list = [{
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂A18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂B18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂C18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂A18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂B18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂A18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂B18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂C18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂A18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}, {
        poundOrderNo: 's2220222233',
        startTime: '2021-08-28 16:37:55',
        endTime: '2021-08-31 16:37:55',
        carNo: '鄂B18NB12',
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0}
      ]
      this.tableDataList = list
      this.totalNum = this.tableDataList.length
    },
    // 监听pageSize改变的事件
    handleSizeChange (newSize) {
      // 将监听接收到的每页显示多少条的数据newSize赋值给pageSize
      this.queryForm.pageSize = newSize
      // 修改完以后，重新发起请求获取一次数据
      this.getTableList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPageNo) {
      // 将监听接收到的每页显示多少条的数据newPage赋值给pageNo
      this.queryForm.pageNo = newPageNo
      // 修改完以后，重新发起请求获取一次数据
      this.getTableList()
    },
    refleshPage () {
      location.reload()
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      return 'padding:4px 0;border-color:#DFE6EC;color: #1F2D3D'
    },
    exportExcel () {
      /* generate workbook object from table */
      let wb = XLSX.utils.table_to_book(document.querySelector('#tableList'))
      /* get binary string as output */
      let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '过磅记录表.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') { console.log(e, wbout) }
      }
      return wbout
    }
  }
}
</script>

<style scoped>
    .con-border { border: 1px solid #EBEBEB; margin-bottom: 10px;}
    .con-header { line-height: 40px; background-color: #EEF1F6; border: 1px solid #B6C5D5; font-family: PingFang SC; color: #1F2F3D; 
    font-size: 14px; font-weight: 500; margin: -1px; }

    .weight {
        /* height: 150px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        display: flex;
        align-items: center; */
        width: 480px;
        text-align: right;
        font-size: 18px;
        color: #242930;
        border: 2px solid #1D2225;
        margin-bottom: 14px;
        /* background: #303133; */
    }
    
    .weight .val {
        height: 100px;
        background-color: #1D2225;
        font-size: 72px;
        font-weight: bold;
        color: #7BFF00;
        padding-right: 27px;
    }
    .weight .unit {
        height: 45px;
        line-height: 45px;
        padding-right: 8px;
    }
    .warningInfo {
        width: 470px;
        height: 38px;
        line-height: 38px;
        background: #FEF0F0;
        border: 2px solid #FBC4C4;
        padding-left: 10px;     
        color: #FF4949;
        font-size: 20px;     
        font-weight: 400;
    }
    .text-c {
        text-align: center;
    }
    
    .gateBtn {
        line-height: 30px;
        border: 1px solid #b3d8ff;
        margin-left: 10px;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        box-sizing: border-box;
        background-color: #fff;
        border-color: transparent;
        color: #303133;
        outline: none;
    }
    .gateBtn:hover, .gateBtn:active {
        color: #409EFF;
        background-color: #ecf5ff;
        border-color: #b3d8ff;
    }
    .gateBtn img { vertical-align: middle;}
</style>
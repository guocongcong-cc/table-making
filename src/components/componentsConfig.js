export const basicComponents = []

export const advanceComponents = []

export const layoutComponents = []

export const easyTableComponents = [
  {
    type: 'elBaseTable',
    icon: 'icon-table',
    options: {
      ref: "baseTable",
      tooltipEffect: "dark",
      style: "width: 100%",
      maxHeight:800,
      size:'small',
      border: true,
      stripe:true,
      fit:true,
      selectCl:null,
      headerCellStyle:{
        'backgroundColor': '#F4F6FC',
        'lineHeight': '40px',
        'fontSize': '12px',
        'color': "#909390"
      },
      columns:[],
      tableData:[],
      defaultValue: [],
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'elMltipleTable',
    icon: 'icon-fuwenbenkuang',
    options: {
      ref:"multipleTable",
      tooltipEffect:"dark",
      selectionChange:"handleSelectionChange",
      style: "width: 100%",
      style: "width: 100%",
      maxHeight: 800,
      size: 'small',
      border: true,
      stripe: true,
      fit: true,
      headerCellStyle: {
        'backgroundColor': '#F4F6FC',
        'lineHeight': '40px',
        'fontSize': '12px',
        'color': "#90939"
      },
      selectCl: null,
      columns: [],
      multipleSelection: [],
      tableData: [],
      defaultValue: [],
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'elTreeTable',
    icon: 'icon-zidingyishuju',
    options: {
      ref: "treeTable",
      style: "width: 100%",
      stripe: true,
      columns: [
        {
          prop: 'date',
          label: '日期',
          sortable: true,
          width: 150
        },
        {
          prop: 'name',
          label: '姓名',
          width: 200
        },
        {
          prop: 'address',
          label: '地址',
          width: ""
        }
      ],
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
            id: 321,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 322,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }]
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      defaultValue: [],
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  }
]

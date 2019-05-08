import React, { Component, createElement } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { Card, Badge, Table, Divider, Button, Select, notification } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'react-router-dom';
import Exception from '@/components/Exception';
import config from '../../components/Exception/typeConfig';
import router from 'umi/router';


const { Description } = DescriptionList;
const { Option } = Select;

class ExpenseType extends Component {
  state = {
    currentUser : {},
    projectId: null,
    projectList: [],
    expenseTypeList: [],

  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem("system-user"));
    if(currentUser) {
      this.setState({currentUser})
      this.getProjectList(currentUser.teamId)
    }
  }



  //获取项目集合
  getProjectList = (id) => {
    const option = {
      url: `http://localhost:8080/expense/project/list/by/team?id=${id}`,
      method: 'get',
    }
    axios(option).then(res=>{
      console.log(res.data)
      this.setState({
        projectList : res.data
      })
    })
  }

  //选择项目
  selectProject = (value) =>{
    console.log(value)
    if(value) {
      this.setState({ projectId : value })
      this.getExpenseTypeList(value)
    }
  }


  //获取项目下费用类型
  getExpenseTypeList = (id) => {
    const option = {
      url: `http://localhost:8080/expense/expenseType/list/dto/by/team?id=${id}`,
      method: 'get',
    }
    axios(option).then(res=>{
      this.setState({
        expenseTypeList : res.data
      })
    })
  }

  //创建费用类型
  createExpenseType =()=> {
    const { projectId, projectList } = this.state;
    if(projectList.size < 1 ) {
      notification.error({
        message: "请先创建项目!",
        description: "该团队下无项目!请先创建项目!",
      });
      return
    }
    if(!projectId){
      notification.error({
        message: "请先选择项目!",
        description: "请先选择项目!",
      });
      return;
    }
    router.push(`/expenseType/new/${projectId}`)
  }


  render() {

    const {loading} = this.props;
    const { projectList,expenseTypeList,currentUser } = this.state;
    const expenseTypeColumns = [
      {
        title: '费用类型ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '费用类型名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '费用类型标识缩写',
        dataIndex: 'shortName',
        key: 'shortName',
      },
      {
        title: '限额',
        dataIndex: 'maxAmount',
        key: 'maxAmount',
      },
      {
        title: '审批方式',
        dataIndex: 'approveStatusName',
        key: 'approveStatusName',
      },
      {
        title: '审批人',
        dataIndex: 'approveUserName',
        key: 'approveUserName',
      },
    ];

    return <PageHeaderWrapper title="费用类型管理" loading={loading}>
      <Card bordered={false}>
        <div style={{marginBottom:16,fontWeight:500,fontSize:24}}>选择项目</div>
        <Select placeholder="请选择项目" onChange={(value)=>this.selectProject(value)} style={{ width: '20%' }}>
          { projectList.map(item  => {
            return <Option value={item.id}>{item.name}</Option>
          })}
        </Select>
        <Divider style={{ marginBottom: 32 }} />
        <div style={{marginBottom:16,fontWeight:500,fontSize:24}}>费用类型</div>

        {currentUser && currentUser.rank ?
          <Button icon="plus" type="primary" onClick={() => this.createExpenseType()}>
            新建费用类型
          </Button> : ""
        }
        <Table
          style={{ marginBottom: 24,marginTop: 10 }}
          pagination={false}
          loading={loading}
          dataSource={expenseTypeList}
          columns={expenseTypeColumns}
          rowKey="id"
        />
      </Card>
    </PageHeaderWrapper>

  }
}

export default ExpenseType;

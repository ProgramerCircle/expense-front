import React, { Component, createElement, Suspense } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { Card, Badge, Table, Divider, Button, Select, notification, Row } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'react-router-dom';
import Exception from '@/components/Exception';
import config from '../../components/Exception/typeConfig';
import router from 'umi/router';
import styles from './Analysis.less';
import { Pie ,Gauge} from '@/components/Charts';
import Yuan from '@/utils/Yuan';
import Col from 'antd/es/grid/col';

const { Description } = DescriptionList;
const { Option } = Select;
const ProportionSales = React.lazy(() => import('./ProportionSales'));
class ProjectAnalyze extends Component {
  state = {
    currentUser : {},
    projectInfo: {},
    projectId: null,
    projectList: [],
    expenseTypeList: [],
    analyzeList :[],

  }

  componentDidMount() { 
    const currentUser = JSON.parse(localStorage.getItem("system-user"));
    if(currentUser) {
      if(!currentUser.teamId){
        router.push('/exception/noTeam')
      }
      if(currentUser.rank < 1){
        router.push('/exception/noAccess')
      }
      this.setState({currentUser})
      this.getProjectList(currentUser.teamId)
    }else {
      router.push('/user/login')
    }
  }



  //获取项目分析集合
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
      url: `http://localhost:8080/expense/project/analyze?id=${id}`,
      method: 'get',
    }
    axios(option).then(res=>{
      const analyzeList = [];
      const expenseTypeList = res.data.expenseTypeDTOS;
      console.log(expenseTypeList)
      if(expenseTypeList && expenseTypeList.length > 0) {
        expenseTypeList.forEach(item => {
          analyzeList.push({ x: item.name, y: item.amount })
        })
        console.log(analyzeList)
      }
      this.setState({
        projectInfo : res.data.project,
        expenseTypeList,
        analyzeList
      })
    })
  }


  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  render() {

    const {loading} = this.props;
    const { projectList,expenseTypeList,projectInfo,analyzeList } = this.state;
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
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '单据数量',
        dataIndex: 'count',
        key: 'count',
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
      </Card>

      <Row gutter={24}>
        <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <Card
            title={"项目详情"}
            style={{ marginBottom: 24 }}
            bodyStyle={{ textAlign: 'left' }}
            bordered={false}
            style={{ marginTop: 24 }}
          >
            <div style={{height:270}}>
              <h3>项目名称 : {projectInfo ? projectInfo.name : ""}</h3>
              <h3>项目预算额 : {projectInfo ? projectInfo.budgetAmount : ""}</h3>
              <h3>使用金额 : {projectInfo ? projectInfo.amount : ""}</h3>
              <h3>剩余金额 : {projectInfo ? projectInfo.budgetAmount - projectInfo.amount : ""}</h3>
              <h3>项目描述 : {projectInfo ? projectInfo.description : ""}</h3>
            </div>
          </Card>
        </Col>

        <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <Card
            title={"使用情况"}
            style={{ marginBottom: 24 }}
            bodyStyle={{ textAlign: 'center' }}
            bordered={false}
            style={{ marginTop: 24 }}
          >
            <Gauge
              title={"使用情况"}
              height={270}
              percent={projectInfo ? projectInfo.amount/projectInfo.budgetAmount*100 : 0}
            />
          </Card>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <Card
            loading={loading}
            bordered={false}
            title={"项目支出分析"}
            bodyStyle={{ padding: 24 }} style={{ marginTop: 24 }}
          >
            <Pie
              hasLegend
              subTitle={"支出额"}
              total={() => <Yuan>{analyzeList.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
              data={analyzeList}
              valueFormat={value => <Yuan>{value}</Yuan>}
              height={270}
              lineWidth={4}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} bodyStyle={{ textAlign: 'right' }}>
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

export default ProjectAnalyze;

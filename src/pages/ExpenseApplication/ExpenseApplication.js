import React, { Component, createElement, Fragment } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { Card, Badge, Table, Divider, Button, Select, notification, Form, Row, Col, Input, Icon } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'react-router-dom';
import Exception from '@/components/Exception';
import config from '../../components/Exception/typeConfig';
import router from 'umi/router';


const { Description } = DescriptionList;
const { Option } = Select;
const FormItem = Form.Item;

const statusMap = ['no', 'default','processing', 'success', 'error'];
const status = ['无','编辑中', '审批中', '审批通过', '驳回'];

import styles from './TableList.less';
@Form.create()
class ExpenseApplication extends Component {
  state = {
    currentUser : {},
    projectId: null,
    projectList: [],
    expenseTypeList: [],
    expenseApplicationList : [],
    applicationUserList :[],
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem("system-user"));
    if(currentUser) {
      this.setState({currentUser})
      this.getExpenseApplicationList(currentUser.id)
      this.getProjectList(currentUser.teamId)
    }
  }

  //获取费用申请单集合
  getExpenseApplicationList = (id) => {
    const option = {
      url: `http://localhost:8080/expense/expenseApplication/list/by/condition?applicationUser=${id}`,
      method: 'get',
    }
    axios(option).then(res=>{
      console.log(res.data)
      this.setState({
        expenseApplicationList : res.data
      })
    })
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

  //创建费用申请单
  createExpenseApplication =()=> {
    router.push(`/expenseApplication/new`)
  }

  handleFormReset = () => {
    const { form } = this.props;
    const {currentUser} = this.state;
    form.resetFields();
    this.setState({
      expenseTypeList : [],
      projectId : null,
    })
    this.getExpenseApplicationList(currentUser.id)
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { currentUser } = this.state;
    form.validateFields((err, values) => {
      const option = {
        url: 'http://localhost:8080/expense/expenseApplication/list/by/condition',
        params: {
          applicationUser: currentUser.id,
          expenseNo: values.expenseNo,
          projectId: values.projectId,
          expenseTypeId : values.expenseTypeId,
          status: values.status
        }
      }
      axios.get(option.url, {params:option.params}).then(res=>{
        console.log(res.data)
        this.setState({
          expenseApplicationList : res.data
        })
      }).catch(error => {
        notification.error({
          message: error.response.data.message,
          description: `响应状态码：${error.response.data.status}`
        });
      })
    });
  };

  submitApprove = (text, record) => {
    console.log(record)
    const{ currentUser } = this.state;
    const option = {
      url: `http://localhost:8080/expense/expenseApprove/submit?expenseApplicationId=${record.id}`,
      method: 'post',
    }
    axios(option).then(res=>{
      notification.success({
        message: "提交通过！",
        description: `响应状态码：200 OK`
      })
      this.getExpenseApplicationList(currentUser.id)
    }).catch(error => {
        notification.error({
          message: error.response.data.message,
          description: `响应状态码：${error.response.data.status}`
        });
    })
  }

  //渲染查询表单
  renderForm() {
    const { projectList , projectId ,expenseTypeList,applicationUserList} = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="费用申请单号">
              {getFieldDecorator('expenseNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="费用项目">
              {getFieldDecorator('projectId')(
                <Select placeholder="请选择项目" onChange={(value)=>this.selectProject(value)} style={{ width: '100%' }}>
                  {projectList.map(item => {
                    return <Option value={item.id}>{item.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="费用类型">
              {getFieldDecorator('expenseType')(
                <Select disabled={!projectId} placeholder="请选择费用类型" onChange={(value)=>this.getExpenseTypeInfo(value)} style={{ width: '100%' }}>
                  {expenseTypeList.map(item => {
                    return <Option value={item.id}>{item.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="审批状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">编辑中</Option>
                  <Option value="2">审批中</Option>
                  <Option value="3">审批通过</Option>
                  <Option value="4">审批驳回</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button style={{ marginLeft: 8,width: '20%' }} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8,width: '20%' }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </FormItem>
      </Form>
    );
  }

  render() {

    const {loading} = this.props;
    const { projectList,expenseTypeList,expenseApplicationList } = this.state;
    const expenseApplicationColumns = [
      {
        title: '费用申请单号',
        dataIndex: 'expenseNo',
        key: 'expenseNo',
      },
      {
        title: '申请单类型',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '申请人',
        dataIndex: 'applicationUser',
        key: 'applicationUser',
      },
      {
        title: '审批状态',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {record.status === 1 ? <a onClick={() => this.submitApprove(text,record)}>提交审批</a> :"" }
            {record.status === 1 ? <Divider type="vertical" /> :"" }
            <a onClick={() => this.submitApprove(text,record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return <PageHeaderWrapper title="费用类型管理" loading={loading}>
      <Card bordered={false}>
        <div style={{marginBottom:16,fontWeight:500,fontSize:24}}>查询条件</div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <Divider style={{ marginBottom: 32 }} />
        <div style={{marginBottom:16,fontWeight:500,fontSize:24}}>费用申请单</div>
        <Button icon="plus" type="primary" onClick={() => this.createExpenseApplication()}>
          新建费用申请单
        </Button>
        <Table
          style={{ marginBottom: 24,marginTop: 10 }}
          pagination={false}
          loading={loading}
          dataSource={expenseApplicationList}
          columns={expenseApplicationColumns}
          rowKey="id"
        />
      </Card>
    </PageHeaderWrapper>

  }


}

export default ExpenseApplication;

import React, { Component, createElement, Fragment } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { Card, Badge, Table, Divider, Button, notification } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'react-router-dom';
import Exception from '@/components/Exception';
import config from '../../components/Exception/typeConfig';
import router from 'umi/router';


const { Description } = DescriptionList;

class Team extends Component {
  state = {
    teamInfo: null,
    userList: []
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem("system-user"));
    console.log(currentUser)
    if(currentUser){
      this.setState({currentUser})
    }
    if(currentUser.teamId) {
      this.getTeamInfo(currentUser.teamId)
      this.getUserList(currentUser.teamId)
    }
  }

  //获取团队详情
  getTeamInfo = (id) => {
    const option = {
      url: `http://localhost:8080/expense/team/getTeamProject?id=${id}`,
      method: 'get',
    }
    axios(option).then(res=>{
      this.setState({
        teamInfo : res.data.team,
      })
    })
  }

  getUserList = (id) => {
    const option = {
      url: `http://localhost:8080/expense/user/list/by/team?id=${id}`,
      method: 'get',
    }
    axios(option).then(res=>{
      this.setState({
        userList : res.data,
      })
    })
  }

  setManager = (text, record) => {
    console.log(record)
    const{ currentUser } = this.state;
    const option = {
      url: `http://localhost:8080/expense/user/team/set/manager?userId=${record.id}`,
      method: 'post',
    }
    axios(option).then(res=>{
      notification.success({
        message: "设置成功！",
        description: `响应状态码：200 OK`
      })
      this.getUserList(currentUser.teamId)
    }).catch(error => {
      notification.error({
        message: error.response.data.message,
        description: `响应状态码：${error.response.data.status}`
      });
    })
  }

  cancelManager = (text, record) => {
    console.log(record)
    const{ currentUser } = this.state;
    const option = {
      url: `http://localhost:8080/expense/user/team/cancel/manager?userId=${record.id}`,
      method: 'post',
    }
    axios(option).then(res=>{
      notification.success({
        message: "取消成功！",
        description: `响应状态码：200 OK`
      })
      this.getUserList(currentUser.teamId)
    }).catch(error => {
      notification.error({
        message: error.response.data.message,
        description: `响应状态码：${error.response.data.status}`
      });
    })
  }


  render() {

    const {loading} = this.props;
    const { teamInfo,userList,currentUser} = this.state;

    const userColumns = [
      {
        title: '用户ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
    ];
    console.log(currentUser)
    if(currentUser && currentUser.rank){
      userColumns.push({
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {record.rank ? <a onClick={() => this.cancelManager(text,record)}>取消管理员</a> :<a onClick={() => this.setManager(text,record)}>设为管理员</a> }
          </Fragment>
        ),
      })
    }

    let renderPage;
    if(teamInfo){
      renderPage = (
        <PageHeaderWrapper title="基础详情页" loading={loading}>
          <Card bordered={false}>
            <DescriptionList size="large" title="团队详情" style={{ marginBottom: 32 }}>
              <Description term="团队名称">{teamInfo.name}</Description>
              <Description term="团队描述">{teamInfo.description}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <div style={{marginBottom:16,fontWeight:500,fontSize:24}}>用户列表</div>
            <Table
              style={{ marginBottom: 24,marginTop: 10 }}
              pagination={false}
              loading={loading}
              dataSource={userList}
              columns={userColumns}
              rowKey="id"
            />
          </Card>
        </PageHeaderWrapper>)
    }else {
      renderPage = (
        <Exception
          type="1001"
          linkElement={Link}
          redirect='/team/join'
          backText="前去加入"
        />
      )
    }


    return renderPage


  }
}

export default Team;

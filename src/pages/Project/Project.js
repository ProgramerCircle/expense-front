import React, { Component, createElement } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { Card, Badge, Table, Divider, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'react-router-dom';
import Exception from '@/components/Exception';
import config from '../../components/Exception/typeConfig';
import router from 'umi/router';


const { Description } = DescriptionList;

class Project extends Component {
  state = {
    currentUser: {},
    teamInfo: null,
    projects: [],

  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem("system-user"));
    console.log(currentUser)
    if(currentUser){
      this.setState(currentUser)
    }
    if(currentUser.teamId) {
      this.getTeamInfo(currentUser.teamId)
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
        projects : res.data.projects
      })
    }).catch(e => {
      console.log(e)
    })
  }

  //创建项目
  createProject =()=> {
    router.push(`/project/new`)
  }


  render() {

    const {loading} = this.props;
    const { teamInfo,projects,currentUser} = this.state;

    const projectColumns = [
      {
        title: '项目ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '项目代码',
        dataIndex: 'shortName',
        key: 'shortName',
      },
      {
        title: '项目描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '预算额',
        dataIndex: 'budgetAmount',
        key: 'budgetAmount',
      },
    ];

    let renderPage;
    if(teamInfo){
      renderPage = (
        <PageHeaderWrapper title="项目管理页" loading={loading}>
          <Card bordered={false}>
            <DescriptionList size="large" title="团队详情" style={{ marginBottom: 32 }}>
              <Description term="团队名称">{teamInfo.name}</Description>
              <Description term="团队描述">{teamInfo.description}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <div style={{marginBottom:16,fontWeight:500,fontSize:24}}>项目列表</div>
            {currentUser && currentUser.rank ?
              <Button icon="plus" type="primary" onClick={() => this.createProject()}>
              新建项目
              </Button> : ""
            }
            <Table
              style={{ marginBottom: 24,marginTop: 10 }}
              pagination={false}
              loading={loading}
              dataSource={projects}
              columns={projectColumns}
              rowKey="id"
            />
          </Card>
        </PageHeaderWrapper>)
    }else {
      renderPage = (
        <Exception
          type="1001"
          linkElement={Link}
          redirect='team/join'
          backText="前去加入"
        />
      )
    }


    return renderPage


  }
}

export default Project;

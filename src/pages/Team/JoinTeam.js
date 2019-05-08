import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, notification } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';
import axios from 'axios';
import router from 'umi/router';

class JoinTeam extends PureComponent {
  state = {
    currentUser : {},
    teamList :[],
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem("system-user"));
    if(currentUser) {
      console.log(currentUser)
      this.setState({currentUser})
      this.getTeamList()
    }
  }

  //获取团队集合
  getTeamList = () => {
    const option = {
      url: `http://localhost:8080/expense/team/list`,
      method: 'get',
    }
    axios(option).then(res=>{
      console.log(res.data)
      this.setState({
        teamList : res.data
      })
    })
  }

  joinTeam = (item) =>{
    const { currentUser } = this.state;
    const option = {
      url: `http://localhost:8080/expense/user/team/join?userId=${currentUser.id}&teamId=${item.id}`,
      method: 'post',
    }
    axios(option).then(res=>{
      notification.success({
        message: "加入成功!",
        description: "将跳转至团队管理页面!",
      });
      localStorage.setItem('system-user', JSON.stringify(res.data));
      router.push(`/team/manager`)
    })
  }

  render() {
    const { loading } = this.props;
    const { teamList } = this.state;


    return (
      <PageHeaderWrapper title="加入团队">
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={teamList}
            renderItem={item =>
              <List.Item key={item.id}>
                <Card hoverable className={styles.card} actions={[<a onClick={() => this.joinTeam(item)}>加入团队</a>]}>
                  <Card.Meta
                    title={<a>{item.name}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        {item.description}
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            }
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default JoinTeam;

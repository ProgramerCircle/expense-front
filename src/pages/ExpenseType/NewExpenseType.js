  import React, { Component } from 'react';
  import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
  import {
  Form,
  Input,
  Button,
  Card, notification, Radio, Select,
} from 'antd';
  import PageHeaderWrapper from '@/components/PageHeaderWrapper';
  import axios from 'axios';
  import router from 'umi/router';

  const FormItem = Form.Item;
  const RadioGroup = Radio.Group;
  const { Option } = Select;

  @Form.create()
  class NewExpenseType extends Component {
    state = {
      currentUser : {},
      projectId: "",
      approveStatus: 0,
      approveUserList: []
    }

    componentDidMount() {
      const currentUser = JSON.parse(localStorage.getItem("system-user"));
      const {projectId} = this.props.match.params;
      if(currentUser) {
        this.getApproveUser(currentUser.teamId);
        this.setState({currentUser,projectId})
      }
    }

    getApproveUser = (id)=>{
      const option = {
        url: `http://localhost:8080/expense/user/list/by/team?id=${id}`,
        method: 'get',
      }
      axios(option).then(res=>{
        this.setState( { approveUserList : res.data})
      })
    }

    handleSubmit = e => {
      const { form } = this.props;
      const { projectId } =  this.state;
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const option = {
            url: 'http://localhost:8080/expense/expenseType/create',
            method: 'post',
            data: {
              name: values.name,
              shortName: values.shortName,
              maxAmount: values.maxAmount,
              approveStatus: values.approveStatus > 0 ? true : false ,
              approveUser: values.approveUser ? values.approveUser : null,
              projectId: projectId,
            }
          }
          axios(option).then(res=>{
            router.push(`/expenseType/manager`)
          }).catch(error => {
            notification.error({
              message: error.response.data.message,
              description: `响应状态码：${error.response.data.status}`
            });
          })
        }
      });
    };

    handleApproveStatusChange = e => {
      const { value } = e.target;
      this.setState({ approveStatus : value });
    };



    render() {
      const { submitting } = this.props;
      const {
        form: { getFieldDecorator},
      } = this.props;

      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
      };

      const submitFormLayout = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 10, offset: 7 },
        },
      };
      const { approveStatus, approveUserList,currentUser } = this.state;

      return (
        <PageHeaderWrapper
          title={<FormattedMessage id="app.forms.basic.title" />}
          content={<FormattedMessage id="app.forms.basic.description" />}
        >
          <Card bordered={false}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              {/* 费用类型名称 */}
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.title.required' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
              </FormItem>
              {/* 项目名称 */}
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
                {getFieldDecorator('shortName', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.title.required' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
              </FormItem>
              {/* 费用类型限额 */}
              <FormItem {...formItemLayout} label="限额">
                {getFieldDecorator('maxAmount', {
                  rules: [
                    { required: true, message: '请输入限额' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法金额数字',
                    },
                  ],
                })(<Input prefix="￥" placeholder="请输入限额" />)}
              </FormItem>
              {/* 费用类型审批方式 */}
              <FormItem {...formItemLayout} label="审批方式">
                {getFieldDecorator('approveStatus', {
                  rules: [
                    { required: true, message: '请选择审批方式' },
                  ],
                })(
                  <RadioGroup onChange={this.handleApproveStatusChange}>
                    <Radio value="0">管理员审批</Radio>
                    <Radio value="1">指定人员审批</Radio>
                  </RadioGroup>)}
              </FormItem>
              {approveStatus > 0 ?
                <FormItem {...formItemLayout} label="审批人员">
                  {getFieldDecorator('approveUser', {
                    rules: [
                      { required: approveStatus ? false:true , message: '请选择审批方式' },
                    ],
                  })(<Select placeholder="请选择人员" style={{ width: '20%' }}>
                      {approveUserList.map(item => {
                        if(item.id !== currentUser.id ) {
                          return <Option value={item.id}>{item.name}</Option>
                        }
                      })}
                    </Select>
                  )}
                </FormItem> : ""}
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  <FormattedMessage id="form.submit" />
                </Button>
              </FormItem>
            </Form>
          </Card>
        </PageHeaderWrapper>
      );
    }
  }

  export default NewExpenseType;

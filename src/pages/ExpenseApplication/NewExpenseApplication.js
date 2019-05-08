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
  const { TextArea } = Input;

  @Form.create()
  class NewExpenseApplication extends Component {
    state = {
      currentUser : {},
      projectList :[],
      expenseTypeList: [],
      projectId: null,
      expenseType: {},
      expenseApplication:{},
    }

    componentDidMount() {
      const currentUser = JSON.parse(localStorage.getItem("system-user"));
      const {documentId} = this.props.match.params;
      if(documentId){
        //TODO
        //this.getExpenseDocument(documentId);
      }
      if(currentUser) {
        this.getProjectList(currentUser.teamId)
        this.setState({currentUser})
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

    //获取项目下费用类型
    getExpenseTypeList = (id) => {
      const option = {
        url: `http://localhost:8080/expense/expenseType/list/dto/by/team?id=${id}`,
        method: 'get',
      }
      axios(option).then(res => {
        this.setState({
          expenseTypeList: res.data
        })
      })
    }

    //获取当前费用类型信息
    getExpenseTypeInfo = (id) => {
      const option = {
        url: `http://localhost:8080/expense/expenseType/get?id=${id}`,
        method: 'get',
      }
      axios(option).then(res => {
        this.setState({
          expenseType: res.data
        })
      })
    }

    //
    getApproveUser = (id)=>{
      const option = {
        url: `http://localhost:8080/expense/user/list/by/team?id=${id}`,
        method: 'get',
      }
      axios(option).then(res=>{
        this.setState( { approveUserList : res.data})
      })
    }

    //
    handleSubmit = e => {
      const { form } = this.props;
      const { projectId,currentUser,expenseType } =  this.state;
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if(values.amount > expenseType.maxAmount){
            notification.error({
              message: "超额！",
              description: `金额超过费用类型金额上限，请修改后重试！`
            });
            return
          }
          const option = {
            url: 'http://localhost:8080/expense/expenseApplication/create',
            method: 'post',
            data: {
              description: values.description,
              amount: values.amount,
              expenseTypeId: values.expenseTypeId,
              projectId: values.projectId,
              teamId: currentUser.teamId,
              applicationUser:currentUser.id
            }
          }
          axios(option).then(res=>{
            router.push(`/expenseApplication/manager`)
          }).catch(error => {
            notification.error({
              message: error.response.data.message,
              description: `响应状态码：${error.response.data.status}`
            });
          })
        }
      });
    };


    //选择项目
    selectProject = (value) =>{
      console.log(value)
      if(value) {
        this.setState({ projectId : value })
        this.getExpenseTypeList(value)
      }
    }

    //选择费用
    selectExpenseType = (value) =>{
      console.log(value)
      if(value) {
        this.getExpenseTypeInfo(value)
      }
    }





    //
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
      const { approveStatus, projectList,expenseTypeList,projectId } = this.state;

      return (
        <PageHeaderWrapper
          title={<FormattedMessage id="app.forms.basic.title" />}
          content={<FormattedMessage id="app.forms.basic.description" />}
        >
          <Card bordered={false}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              {/* 项目 */}
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
                {getFieldDecorator('projectId', {
                  //initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.title.required' }),
                    },
                  ],
                })(
                  <Select placeholder="请选择项目" onChange={(value)=>this.selectProject(value)} style={{ width: '20%' }}>
                    {projectList.map(item => {
                      return <Option value={item.id}>{item.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>

              {/* 费用类型 */}
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
                {getFieldDecorator('expenseTypeId', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.title.required' }),
                    },
                  ],
                })(
                  <Select disabled={!projectId} placeholder="请选择费用类型" onChange={(value)=>this.getExpenseTypeInfo(value)} style={{ width: '20%' }}>
                    {expenseTypeList.map(item => {
                      return <Option value={item.id}>{item.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              {/* 单据描述 */}
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.goal.label" />}>
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.goal.required' }),
                    },
                  ],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder={formatMessage({ id: 'form.goal.placeholder' })}
                    rows={4}
                  />
                )}
              </FormItem>
              {/* 单据金额 */}
              <FormItem {...formItemLayout} label="金额">
                {getFieldDecorator('amount', {
                  rules: [
                    { required: true, message: '请输入金额' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法金额数字',
                    },
                  ],
                })(<Input prefix="￥" placeholder="请输入金额" />)}
              </FormItem>
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

  export default NewExpenseApplication;

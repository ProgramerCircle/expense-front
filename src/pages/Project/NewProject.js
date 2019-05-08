  import React, { PureComponent } from 'react';
  import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
  import {
  Form,
  Input,
  Button,
  Card, notification,
} from 'antd';
  import PageHeaderWrapper from '@/components/PageHeaderWrapper';
  import axios from 'axios';
  import router from 'umi/router';

  const FormItem = Form.Item;
  const { TextArea } = Input;

  @Form.create()
  class NewProject extends PureComponent {

    handleSubmit = e => {
      const { form } = this.props;
      const currentUser = JSON.parse(localStorage.getItem("system-user"));
      console.log(currentUser)
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const option = {
            url: 'http://localhost:8080/expense/project/create',
            method: 'post',
            data: {
              name: values.name,
              shortName: values.shortName,
              description: values.description,
              budgetAmount: values.budgetAmount,
              teamId: currentUser.teamId
            }
          }
          axios(option).then(res=>{
            currentUser.teamId = res.data.teamId
            localStorage.setItem('system-user', JSON.stringify(currentUser))
            router.push(`/project/manager`)
          }).catch(error => {
            notification.error({
              message: error.response.data.message,
              description: `响应状态码：${error.response.data.status}`
            });
          })
        }
      });
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

      return (
        <PageHeaderWrapper
          title={<FormattedMessage id="app.forms.basic.title" />}
          content={<FormattedMessage id="app.forms.basic.description" />}
        >
          <Card bordered={false}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              {/* 项目名称 */}
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
              {/* 项目代码 */}
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
              {/* 项目描述 */}
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
              <FormItem {...formItemLayout} label="预算额">
                {getFieldDecorator('budgetAmount', {
                  rules: [
                    { required: true, message: '请输入预算金额' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法金额数字',
                    },
                  ],
                })(<Input prefix="￥" placeholder="请输入预算金额" />)}
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

  export default NewProject;

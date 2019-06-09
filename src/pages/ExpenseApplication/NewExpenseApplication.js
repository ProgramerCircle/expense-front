  import React, { Component } from 'react';
  import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
  import {
  Form,
  Input,
  Button,
  Card, notification, Radio, Select,Upload,Icon,Modal
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
      imageId : null,
      imageUrl : "",
      fileList:[],
      previewVisible :false
    }

    componentDidMount() {
      const currentUser = JSON.parse(localStorage.getItem("system-user"));
      const {documentId} = this.props.match.params;
      if(currentUser) {
        if(currentUser.rank > 1){
          router.push('/exception/noFunction')
        }
        if(!currentUser.teamId){
          router.push('/exception/noTeam')
        }
        this.getProjectList(currentUser.teamId)
        this.setState({currentUser})
      }else {
        router.push('/user/login')
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
      const { projectId,currentUser,expenseType,imageId } =  this.state;
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
              evidenceId:imageId,
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


    handleUploadChange = (info) => {
      let fileList = [];
      if(info && info.file.status === "uploading"){
        fileList = [{...info.file}]
        this.setState({
          fileList
        })
        return
      }
      if(info && info.file.status === "done"){
        fileList = [{...info.file}]
        console.log(fileList)
        this.setState({
          fileList,
          imageUrl: info.file.response.path,
          imageId: info.file.response.id,
        })
        return
      }
      if(info && info.file.status === "removed" ){
        fileList = []
        this.setState({
          fileList,
          imageId: null,
        })
        return
      }
    }

    handlePreview = ()=> {
      this.setState({
        previewVisible : true
      })
    }

    cancelPreview =()=> {
      this.setState({
        previewVisible : false
      })
    }

    handleUploadBefore = (file) =>{
      //限制图片 格式
      const isJPG = file.type === 'image/jpeg';
      const isJPEG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';
      if (!(isJPG || isJPEG || isGIF || isPNG)) {
        notification.error({
          message: "图片上传失败",
          description: `只允许上传jpg,jpeg,gif,png格式的图片`
        });
        return false;
      }
      return true;
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
      const { projectList,expenseTypeList,projectId,imageUrl,fileList,previewVisible, } = this.state;

      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

      return (
        <PageHeaderWrapper
          title="新建费用申请单"
        >
          <Card bordered={false}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              {/* 项目 */}
              <FormItem {...formItemLayout} label="所属项目">
                {getFieldDecorator('projectId', {
                  rules: [
                    {
                      required: true,
                      message: "请选择项目！",
                    },
                  ],
                })(
                  <Select placeholder="选择项目" onChange={(value)=>this.selectProject(value)} style={{ width: '40%' }}>
                    {projectList.map(item => {
                      return <Option value={item.id}>{item.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>

              {/* 费用类型 */}
              <FormItem {...formItemLayout} label="费用类型">
                {getFieldDecorator('expenseTypeId', {
                  rules: [
                    {
                      required: true,
                      message:"选择费用类型！",
                    },
                  ],
                })(
                  <Select disabled={!projectId} placeholder="请选择费用类型" onChange={(value)=>this.getExpenseTypeInfo(value)} style={{ width: '40%' }}>
                    {expenseTypeList.map(item => {
                      return <Option value={item.id}>{item.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              {/* 单据描述 */}
              <FormItem {...formItemLayout} label="费用描述">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: "请输入费用描述",
                    },
                  ],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="费用描述"
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
                })(<Input prefix="￥" placeholder="请输入金额" style={{ width: '40%' }} />)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="上传凭证图片"
              >
                <Upload
                  action="http://localhost:8080/expense/expenseApplication/evidence"
                  data={file => ({
                    uploadFile: file, // file 是当前正在上传的图片
                  })}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview} // 点击图片缩略图，进行预览
                  beforeUpload={this.handleUploadBefore} // 上传之前，对图片的格式做校验，并获取图片的宽高
                  onChange={this.handleUploadChange} // 每次上传图片时，都会触发这个方法
                >
                  {fileList.length < 1 ? uploadButton : null}
                </Upload>
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  <FormattedMessage id="form.submit" />
                </Button>
              </FormItem>
            </Form>
          </Card>
          <Modal visible={previewVisible} footer={null} onCancel={this.cancelPreview}>
            <img style={{ width: '100%' }} src={imageUrl} />
          </Modal>
        </PageHeaderWrapper>
      );
    }
  }

  export default NewExpenseApplication;

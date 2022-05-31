import React, { useState, useEffect } from 'react'
import {
  DatePicker,
  Button,
  Input,
  Typography,
  Form,
  Table,
  Modal,
  Row,
  Col,
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import moment from 'moment'
import axios from 'axios'
import 'antd/dist/antd.css'

import { IT_MANAGE_URL } from '../../utils/variables'
import { Grid } from '@material-ui/core'

const { Paragraph } = Typography

const Maintenance = () => {
  const [headerModal, setHeaderModal] = useState('')
  const [contentModal, setContentModal] = useState('')
  const [dataAdd, setDataAdd] = useState({})
  const [dataDelete, setDataDelete] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [dataSearch, setDataSearch] = useState('')
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    // console.log("USEEFFECT")F
    getAllReports()
    // getReportByDepartment();
  }, [])

  const getAllReports = async () => {
    await axios.get(IT_MANAGE_URL + '/management/reports').then((response) => {
      console.log(response.data)
      setDataSource(response.data)
    })
  }

  const getReportByDepartment = async () => {
    // console.log({department: dataSearch})
    await axios
      .get(IT_MANAGE_URL + '/management/reports/department/' + dataSearch)
      .then((response) => {
        console.log(response.data)
        setDataSource(response.data)
      })
  }

  const postReportData = async () => {
    await axios
      .post(IT_MANAGE_URL + '/management/reports', dataAdd)
      .then((response) => {
        console.log(response.status)
        getAllReports()
        //   setDataSource(response.data);
      })
  }

  const deleteReportDataById = async ({ id }) => {
    console.log(id)
    await axios
      .delete(IT_MANAGE_URL + '/management/reports/' + id)
      .then((response) => {
        console.log(response.status)
        //   setDataSource(response.data);
      })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (headerModal === 'บันทึกข้อมูล') {
      postReportData()
      setDataSource((pre) => {
        return [...pre, dataAdd]
      })
    } else {
      setDataSource((pre) => {
        deleteReportDataById({ id: dataDelete.id })
        return pre.filter((e) => e.id !== dataDelete.id)
      })
    }

    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onAddData = (values) => {
    setHeaderModal('บันทึกข้อมูล')
    setContentModal('คุณต้องการบันทึกข้อมูลหรือไม่ ?')
    const newData = {
      number: Math.random() * 1000,
      date: values.data.date.format('yyyy-MM-DD'),
      user_name: values.data.user_name,
      department: values.data.department,
      hardware_type: values.data.hardware_type,
      hardware_serial: values.data.hardware_serial,
      problem: values.data.problem,
      solution: values.data.solution,
      maintenance_name: values.data.maintenance_name,
    }
    setDataAdd(newData)
    showModal()
  }

  const onDeleteData = (record) => {
    setHeaderModal('ลบข้อมูล')
    setContentModal('คุณต้องการลบข้อมูลหรือไม่ ?')
    setDataDelete(record)
    showModal()
  }

  const column = [
    {
      key: '1',
      title: 'No.',
      dataIndex: 'number',
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      key: '2',
      title: 'วันที่',
      dataIndex: 'date',
      render: (date) => {
        return moment(date).format('yyyy-MM-DD')
      },
    },
    {
      key: '3',
      title: 'ชื่อผู้แจ้ง',
      dataIndex: 'user_name',
    },
    {
      key: '4',
      title: 'แผนกสาขา',
      dataIndex: 'department',
    },
    {
      key: '5',
      title: 'ชนิดอุปกรณ์',
      dataIndex: 'hardware_type',
    },
    {
      key: '6',
      title: 'รุ่น/รหัสเครื่อง',
      dataIndex: 'hardware_serial',
    },
    {
      key: '7',
      title: 'ปัญหา/สาเหตุ',
      dataIndex: 'problem',
    },
    {
      key: '8',
      title: 'การแก้ไข',
      dataIndex: 'solution',
    },
    {
      key: '9',
      title: 'ผู้แก้ไข',
      dataIndex: 'maintenance_name',
    },
    {
      key: '10',
      title: 'ลบข้อมูล',
      render: (record) => {
        return (
          <DeleteOutlined
            style={{ color: 'red', marginLeft: 10 }}
            onClick={() => {
              onDeleteData(record)
            }}
          />
        )
      },
    },
  ]

  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        layout="horizontal"
        name="nest-messages"
        onFinish={onAddData}
      >
        <Form.Item
          name={['data', 'date']}
          label="วันที่แจ้ง"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name={['data', 'user_name']}
          label="ชื่อผู้แจ้ง"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['data', 'department']}
          label="แผนก/สาขา"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['data', 'hardware_type']}
          label="ชนิดของอุปกรณ์"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['data', 'hardware_serial']}
          label="รุ่น/รหัสเครื่อง"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['data', 'problem']}
          label="ปัญหา/สาเหตุ"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={['data', 'solution']}
          label="การแก้ไข"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={['data', 'maintenance_name']}
          label="ผู้แก้ไข"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
          <Button type="primary" htmlType="submit">
            บันทึกข้อมูล
          </Button>
        </Form.Item>
      </Form>
      <Grid
        container
        spacing={3}
        lg={{ order: 2 }}
        style={{
          justifyContent: 'flex-end',
          display: 'flex',
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <Input
            placeholder="ค้นหาจาก แผนก/สาขา"
            onChange={(e) => {
              setDataSearch(e.target.value)
              // console.log(dataSearch)
            }}
          />
          <Button
            style={{ width: '100%', marginTop: 16 }}
            type="primary"
            onClick={() => {
              getReportByDepartment()
            }}
          >
            ค้นหาข้อมูล
          </Button>
        </Grid>
      </Grid>

      <Modal
        title={headerModal}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{contentModal}</p>
      </Modal>
      <Table
        // columns={columns}
        // rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={column}
      />
    </>
  )
}

export default Maintenance

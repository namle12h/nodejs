import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
} from 'antd';

const { Option } = Select;

const RegisterStaff: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // format ngày
    const hireDate = values.hireDate ? values.hireDate.format('YYYY-MM-DD') : null;

    const payload = {
      name: values.name,
      phone: values.phone,
      username: values.username,
      passwordHash: values.password, // server sẽ hash
      email: values.email,
      role: values.role,
      hireDate: hireDate,
      status: values.status,
    };

    try {
      const res = await fetch('http://localhost:8080/api/staff/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        message.success('Tạo nhân viên thành công!');
        form.resetFields();
      } else {
        const err = await res.text();
        message.error('Lỗi: ' + err);
      }
    } catch (error) {
      message.error('Không kết nối được server');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Đăng ký Staff</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: 'Nhập tên nhân viên' }]}
        >
          <Input placeholder="Nhập tên nhân viên" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Chức vụ (Role)"
          name="role"
          initialValue="STAFF"
        >
          <Select>
            <Option value="STAFF">Staff</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày vào làm"
          name="hireDate"
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          initialValue="ACTIVE"
        >
          <Select>
            <Option value="ACTIVE">ACTIVE</Option>
            <Option value="INACTIVE">INACTIVE</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterStaff;

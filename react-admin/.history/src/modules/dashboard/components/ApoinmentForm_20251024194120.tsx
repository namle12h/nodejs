
import { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, Card, message } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchAppointmentsById, useUpdateAppointment, fetchStaffList, fetchRoomList, fetchServiceList } from "../../../shared/services/appointmentApi";

const { Option } = Select;
const { TextArea } = Input;

interface EditAppointmentProps {
  id: number;
  onClose?: () => void;
}

const EditAppointment: React.FC<EditAppointmentProps> = ({ id, onClose }) => {
  const [form] = Form.useForm();
  const { mutate: updateAppointment, isPending } = useUpdateAppointment();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [roomList, setRoomList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const data = await fetchAppointmentsById(id);

        form.setFieldsValue({
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          startAt: data.startAt ? dayjs(data.startAt) : null,
          endAt: data.endAt ? dayjs(data.endAt) : null,
          status: data.status?.toLowerCase(),
          note: data.notes,
          staffId: data.staffId,   // nếu API có staffId
          roomId: data.roomId,
          serviceId:data.serviceId     // nếu API có roomId
        });
      } catch (error) {
        console.error("❌ Lỗi khi tải chi tiết:", error);
        message.error("Không thể tải dữ liệu lịch hẹn!");
      }
    };

    loadData();
  }, [id, form]);


  useEffect(() => {
    const loadMetaData = async () => {
      try {
        const [staffData, roomData, serviceData] = await Promise.all([
          fetchStaffList(),
          fetchRoomList(),
          fetchServiceList(),
        ]);
        setStaffList(staffData);
        setRoomList(roomData);
        setServiceList(serviceData);
      } catch (err) {
        message.error("Không thể tải danh sách nhân viên hoặc phòng hoặc dịch vụ!");
      }
    };
    loadMetaData();
  }, []);


  const handleSubmit = (values: any) => {
    const payload = {
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail,
      status: values.status,
      notes: values.note, 
      startAt: dayjs(values.startAt).format("YYYY-MM-DDTHH:mm:ss"),
      endAt: dayjs(values.endAt).format("YYYY-MM-DDTHH:mm:ss"),
      serviceId: values.service.Id || null, 
      staffId: values.staffId || null,
      roomId: values.roomId || null,
    };

    console.log("📤 JSON gửi lên API:", JSON.stringify(payload, null, 2));

    updateAppointment(
      { id, data: payload },
      {
        onSuccess: () => {
          message.success("Cập nhật lịch hẹn thành công!");
          if (onClose) onClose();
        },
        onError: (err) => {
          console.error("❌ Lỗi cập nhật:", err);
        },
      }
    );
  };



  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên khách hàng" name="contactName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="contactPhone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="contactEmail">
          <Input />
        </Form.Item>


        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Thời gian bắt đầu" name="startAt" rules={[{ required: true }]}>
            <DatePicker showTime className="w-full" />
          </Form.Item>
          <Form.Item label="Thời gian kết thúc" name="endAt" rules={[{ required: true }]}>
            <DatePicker showTime className="w-full" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Dịch vụ" name="serviceId" rules={[{ required: true }]}>
            <Select placeholder="Chọn dịch vụ">
              {serviceList.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Nhân viên phụ trách" name="staffId" rules={[{ required: true }]}>
            <Select placeholder="Chọn nhân viên">
              {staffList.map((staff) => (
                <Option key={staff.id} value={staff.id}>
                  {staff.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Phòng thực hiện" name="roomId" rules={[{ required: true }]}>
            <Select placeholder="Chọn phòng">
              {roomList.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Trạng thái lịch hẹn" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="Pending">Đang chờ</Option>
              <Option value="Confirmed">Đã xác nhận</Option>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="Cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <TextArea rows={2} />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isPending}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default EditAppointment;

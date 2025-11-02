

// import { Form, Input } from "antd";
// import { useEffect } from "react"; // 👈 Cần import useEffect
// import AddressSelector from "../components/AddressSelector";

// interface Location {
//     id: number;
//     full_name: string;
//     // allow extra fields returned by the API
//     [key: string]: any;
// }

// // 🆕 Định nghĩa kiểu User mà component này mong đợi
// type User = { 
//     id?: number; 
//     name?: string | null; 
//     email?: string | null; 
//     phone?: string | null; 
// };

// const { TextArea } = Input;

// // 🆕 Cập nhật interface để chấp nhận prop user
// interface ShippingInfoProps {
//     form: any;
//     user: User | null; // 👈 Đã thêm user prop
//     cities: Location[];
//     setCities: (cities: Location[]) => void;
//     districts: Location[];
//     setDistricts: (districts: Location[]) => void;
//     communes: Location[];
//     setCommunes: (communes: Location[]) => void;
// }

// const ShippingInfo: React.FC<ShippingInfoProps> = ({
//     form,
//     user, // 👈 Destructure prop user
//     cities,
//     setCities,
//     districts,
//     setDistricts,
//     communes,
//     setCommunes
// }) => {
    
//     // ✅ Logic tự động điền dữ liệu từ user (Zustand)
//     useEffect(() => {
//         if (user) {
//             // Sử dụng form.setFieldsValue để điền sẵn thông tin
//             form.setFieldsValue({
//                 fullName: user.name || '',
//                 email: user.email || '',
//                 phone: user.phone || '',
//                 // Nếu user có lưu địa chỉ mặc định, bạn cũng có thể điền vào đây:
//                 // city: user.defaultCityId,
//                 // district: user.defaultDistrictId,
//                 // commune: user.defaultCommuneId,
//                 // detailAddress: user.defaultDetailAddress,
//             });
//         }
//     }, [user, form]); 

//     return (
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-6xl mx-auto">
//             <h2 className="text-xl font-bold mb-4">Thông tin Giao hàng</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <Form.Item
//                     label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Họ tên</span>}
//                     name="fullName"
//                     rules={[
//                         { required: true, message: "Vui lòng nhập họ tên" },
//                         {
//                             pattern: /^[A-Za-zÀ-Ỹà-ỹ\s']{2,}$/,
//                             message: "Họ tên không hợp lệ. Chỉ bao gồm chữ cái và khoảng trắng."
//                         },
//                         {
//                             validator: (_, value) =>
//                                 value && value.trim().split(/\s+/).length < 2
//                                     ? Promise.reject("Vui lòng nhập đầy đủ họ và tên")
//                                     : Promise.resolve()
//                         }
//                     ]}

//                 >

//                     <Input
//                         placeholder="Nguyễn Văn A"
//                         prefix={<i className="fas fa-user text-gray-400 mr-2" />}
//                         className="rounded-lg w-full"
//                     />
//                 </Form.Item>

//                 <Form.Item
//                     label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Số điện thoại</span>}
//                     name="phone"
//                     rules={[
//                         { required: true, message: "Vui lòng nhập số điện thoại" },
//                         {
//                             // pattern: /^(0[2-9])[0-9]{8}$/,
//                             message: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số bắt đầu bằng 0"
//                         }
//                     ]}
//                 >
//                     <Input
//                         placeholder="0912345678"
//                         prefix={<i className="fas fa-phone text-gray-400 mr-2" />}
//                         className="rounded-lg w-full"
//                     />
//                 </Form.Item>
//             </div>

//             <div className="mb-4">
//                 <Form.Item
//                     label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Email</span>}
//                     name="email"
//                     rules={[
//                         { required: true, message: "Vui lòng nhập email" },
//                         { type: "email", message: "Email không hợp lệ" }
//                     ]}
//                 >
//                     <Input
//                         placeholder="example@gmail.com"
//                         prefix={<i className="fas fa-envelope text-gray-400 mr-2" />}
//                         className="rounded-lg w-full"
//                     />
//                 </Form.Item>
//             </div>

//             <div className="mb-4">
//                 <AddressSelector
//                     form={form}
//                     cities={cities}
//                     setCities={setCities}
//                     districts={districts}
//                     setDistricts={setDistricts}
//                     communes={communes}
//                     setCommunes={setCommunes}
//                 />
//             </div>

//             <div className="mb-4">
//                 <Form.Item
//                     label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Địa chỉ chi tiết</span>}
//                     name="detailAddress"
//                     rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
//                 >
//                     <Input
//                         placeholder="Số nhà, tên đường"
//                         prefix={<i className="fas fa-home text-gray-400 mr-2" />}
//                         className="rounded-lg w-full"
//                     />
//                 </Form.Item>
//             </div>

//             <div className="mb-4">
//                 <Form.Item label="Ghi chú đơn hàng" name="note">
//                     <TextArea
//                         placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
//                         rows={4}
//                         className="rounded-lg w-full"
//                     />
//                 </Form.Item>
//             </div>
//         </div>
//     );
// };

// export default ShippingInfo;

import { Form, Input } from "antd";
import { useEffect } from "react";
import AddressSelector from "../components/AddressSelector";

interface Location {
  id: number;
  full_name: string;
  [key: string]: any;
}

type User = {
  id?: number;
  receiverName?: string | null;
  email?: string | null;
  receiverPhone?: string | null;
};

const { TextArea } = Input;

interface ShippingInfoProps {
  form: any;
  user: User | null;
  cities: Location[];
  setCities: (cities: Location[]) => void;
  districts: Location[];
  setDistricts: (districts: Location[]) => void;
  communes: Location[];
  setCommunes: (communes: Location[]) => void;
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({
  form,
  user,
  cities,
  setCities,
  districts,
  setDistricts,
  communes,
  setCommunes,
}) => {
  // ✅ Chỉ cần 1 useEffect duy nhất để fill dữ liệu user
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        receiverName: user.receiverName || "",
        receiverPhone: user.receiverPhone || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Thông tin Giao hàng</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Họ tên */}
        <Form.Item
          label={
            <span className="flex items-center">
              <span className="text-red-500 mr-1">*</span> Họ tên
            </span>
          }
          name="receiverName"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên" },
            {
              pattern: /^[A-Za-zÀ-Ỹà-ỹ\s']{2,}$/,
              message:
                "Họ tên không hợp lệ. Chỉ bao gồm chữ cái và khoảng trắng.",
            },
            {
              validator: (_, value) =>
                value && value.trim().split(/\s+/).length < 2
                  ? Promise.reject("Vui lòng nhập đầy đủ họ và tên")
                  : Promise.resolve(),
            },
          ]}
        >
          <Input
            placeholder="Nguyễn Văn A"
            prefix={<i className="fas fa-user text-gray-400 mr-2" />}
            className="rounded-lg w-full"
          />
        </Form.Item>

        {/* Số điện thoại */}
        <Form.Item
          label={
            <span className="flex items-center">
              <span className="text-red-500 mr-1">*</span> Số điện thoại
            </span>
          }
          name="receiverPhone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại không hợp lệ. Phải có 10 chữ số bắt đầu bằng 0.",
            },
          ]}
        >
          <Input
            placeholder="0912345678"
            prefix={<i className="fas fa-phone text-gray-400 mr-2" />}
            className="rounded-lg w-full"
          />
        </Form.Item>
      </div>

      {/* Email */}
      <div className="mb-4">
        <Form.Item
          label={
            <span className="flex items-center">
              <span className="text-red-500 mr-1">*</span> Email
            </span>
          }
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            placeholder="example@gmail.com"
            prefix={<i className="fas fa-envelope text-gray-400 mr-2" />}
            className="rounded-lg w-full"
          />
        </Form.Item>
      </div>

      {/* Địa chỉ 3 cấp */}
      <div className="mb-4">
        <AddressSelector
          form={form}
          cities={cities}
          setCities={setCities}
          districts={districts}
          setDistricts={setDistricts}
          communes={communes}
          setCommunes={setCommunes}
        />
      </div>

      {/* Địa chỉ chi tiết */}
      <div className="mb-4">
        <Form.Item
          label={
            <span className="flex items-center">
              <span className="text-red-500 mr-1">*</span> Địa chỉ chi tiết
            </span>
          }
          name="addressDetail"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
        >
          <Input
            placeholder="Số nhà, tên đường"
            prefix={<i className="fas fa-home text-gray-400 mr-2" />}
            className="rounded-lg w-full"
          />
        </Form.Item>
      </div>

      {/* Ghi chú */}
      <div className="mb-4">
        <Form.Item label="Ghi chú đơn hàng" name="note">
          <TextArea
            placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
            rows={4}
            className="rounded-lg w-full"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default ShippingInfo;

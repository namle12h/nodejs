import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Image, message, Pagination, Popconfirm, Space, Table, Tag, type PopconfirmProps, type TableProps } from "antd";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { env } from "../helpers/getEnvs";
import { axiosClient } from "../lib/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";


interface DataType {
  id: number;
  product_name: string;
  thumbnail?: string;
  images?: string[];
  price: number;
  discount: number;
  stock: number;
  sku?: string;
  barcode?: string;
  status?: string;
  description?: string;
  category?: { id: number; name: string };
  brand?: { id: number; name: string };
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function ProductsPage() {
  const navigate = useNavigate(); // hook phải gọi bên trong function component

  // get page và limit
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);



  const handleConfirm = (id: number): PopconfirmProps['onConfirm'] =>
    async () => {
      console.log(id);
      mutationDelete.mutate(id);
    };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('Click on No');
  };



  const fetchProducts = async ({ queryKey }: any) => {
    const [_key, page = 1, limit = 5] = queryKey;
    const response = await axiosClient.get(`${env.API_URL}/v1/products`, {
      params: { page, limit },
    });
    return response.data.data;
  };

  const KEYs = {
    getProducts: () => {
      return ['products', page, limit];
    }
  }


  const queryProducts = useQuery({
    queryKey: KEYs.getProducts(), // react query sẽ cache data theo key này
    // thêm query param vào caches
    // để ý truyền page và limit vào queryKey để khi thay đổi page hoặc limit thì query sẽ tự động chạy lại
    queryFn: fetchProducts, // function that returns a promise
  });
  console.log('<<==>> queryProducts', queryProducts.data);

  const queryClient = useQueryClient();

  /// begin DELETE PRODUCT



  const deleteProduct = async (id: number) => {
    const response = await axiosClient.delete(`${env.API_URL}/v1/products/${id}`);
    return response.data.data;
  }



  const mutationDelete = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      message.success("Deleted successfully");
      // sau khi xóa thành công thì refetch lại danh sách sản phẩm
      queryClient.invalidateQueries({ queryKey: KEYs.getProducts() });
    },
    onError: (err) => {
      console.log("Error deleting", err);
    }
  })

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.brand?.name ? `${record.brand.name} • ` : ""}
            {record.category?.name ?? ""}
          </div>
        </div>
      ),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail, record) =>
        thumbnail ? (
          <Image
            src={thumbnail}
            alt={record.product_name}
            width={64}
            height={64}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
            }}
          >
            No
          </div>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price, record) => {
        const discount = record.discount ?? 0;
        const finalPrice = Math.max(0, price - discount);
        return discount > 0 ? (
          <div style={{ textAlign: "right" }}>
            <div style={{ textDecoration: "line-through", color: "#999" }}>
              {formatCurrency(price)}
            </div>
            <div style={{ fontWeight: 700 }}>
              {formatCurrency(finalPrice)}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "right", fontWeight: 700 }}>
            {formatCurrency(price)}
          </div>
        );
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (record.isActive === false) return <Tag color="default">Hidden</Tag>;
        if (status?.toLowerCase().includes("available"))
          return <Tag color="green">{status}</Tag>;
        if (status?.toLowerCase().includes("out"))
          return <Tag color="orange">{status}</Tag>;
        return <Tag color="red">{status ?? "Unknown"}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => console.log("edit", record.id)} />
          <Button onClick={() => console.log("images", record.id)}>
            Images
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={handleConfirm(record.id)
            }
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];


  return (
    <Card
      title="Products List"
      extra={
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => alert("Thêm mới sản phẩm")}
        >
          Thêm mới
        </Button>
      }
    >
      <Table<DataType>
        columns={columns}
        dataSource={queryProducts.data?.products ?? []}
        rowKey="id"
        pagination={false} // không sử dụng pagenation của table
      />

      <Pagination
        current={page}      // hiển thị đúng trang hiện tại
        pageSize={limit}    // hiển thị đúng số item / page
        showSizeChanger
        total={queryProducts.data?.pagination.total ?? 0}
        onChange={(newPage, newPageSize) => {
          console.log(newPage, newPageSize);
          navigate(`/products?page=${newPage}&limit=${newPageSize}`);
        }}
      />

    </Card>
  );
}

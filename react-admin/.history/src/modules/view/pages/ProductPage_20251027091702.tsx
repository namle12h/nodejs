import { useProducts } from "../../../shared/services/productApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import BookingModal from "../components/BookingModal";
import BookingButtonFixed from "../components/ButtonBooking";
import { useState } from "react";
import { Button, Card, Pagination, Rate, Select, Spin, Tag } from "antd";
import Search from "antd/es/input/Search";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductCategories from "../components/ProductCategories";
import { useCart } from "../../../shared/stores/useCart";

export default function ProductPageView() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [label, setLabel] = useState(searchParams.get("label") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "default");

  const { addToCart } = useCart(); 

  // ✅ Gọi API
  const { data: products, isLoading, isError } = useProducts(page, limit);

  // ✅ Lấy dữ liệu từ backend
  const productList = products?.content ?? [];
  const total = products?.totalElements ?? 0;

  const handleSearch = (value: string) => {
    setKeyword(value);
    setSearchParams({ keyword: value, label, sort });
  };

  const handleFilterChange = (value: string) => {
    setLabel(value);
    setSearchParams({ keyword, label: value, sort });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setSearchParams({ keyword, label, sort: value });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  // ✅ Error
  if (isError) {
    return (
      <div className="text-center text-red-500 py-20">
        Lỗi tải sản phẩm. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div>
      <Header />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-[1200px]">
          {/* Tiêu đề */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Catalog <span className="text-pink-500">Sản Phẩm</span>
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Khám phá các sản phẩm chăm sóc da cao cấp từ những thương hiệu uy tín hàng đầu thế giới.
            </p>
          </div>

          {/* Bộ lọc + tìm kiếm */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium">🔍 Lọc sản phẩm:</span>
              <Select defaultValue={label} onChange={handleFilterChange} style={{ width: 180 }}>
                <Select.Option value="all">Tất cả sản phẩm</Select.Option>
                <Select.Option value="premium">Premium</Select.Option>
                <Select.Option value="sale">Giảm giá</Select.Option>
                <Select.Option value="popular">Bán chạy</Select.Option>
              </Select>

              <Select defaultValue={sort} onChange={handleSortChange} style={{ width: 150 }}>
                <Select.Option value="default">Mặc định</Select.Option>
                <Select.Option value="priceAsc">Giá tăng dần</Select.Option>
                <Select.Option value="priceDesc">Giá giảm dần</Select.Option>
              </Select>

              <Search
                placeholder="Tìm sản phẩm..."
                allowClear
                enterButton
                onSearch={handleSearch}
                style={{ width: 240 }}
                defaultValue={keyword}
              />
            </div>

            <p className="text-gray-500 text-sm">
              Hiển thị {productList.length} / {total} sản phẩm
            </p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {productList.map((p: any) => (
              <Card
                key={p.id}
                hoverable
                onClick={() => navigate(`/products/${p.id}`)}
                cover={
                  <div className="relative">
                    <img
                      src={p.imageUrl || "/upload/product-default.jpg"}
                      alt={p.name}
                      className="h-56 w-full object-cover rounded-t-xl"
                    />
                    {p.label && (
                      <Tag
                        color={
                          p.label === "Bán chạy"
                            ? "red"
                            : p.label === "Premium"
                              ? "purple"
                              : p.label === "Giảm giá"
                                ? "green"
                                : "blue"
                        }
                        className="absolute top-3 left-3 font-semibold"
                      >
                        {p.label}
                      </Tag>
                    )}
                  </div>
                }
                className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                styles={{ body: { padding: "16px" } }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {p.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {p.description}
                </p>

                <div className="flex items-center gap-1 mb-2">
                  <Rate disabled allowHalf defaultValue={p.rating || 4.5} />
                  <span className="text-gray-500 text-xs">
                    ({p.reviews || 0} đánh giá)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-pink-600 font-bold text-lg">
                    {p.salePrice?.toLocaleString()} VND
                  </span>
                  <div className="flex gap-2">
                    <Button type="primary" className="!bg-pink-600 hover:!bg-pink-700">
                      Thêm vào giỏ
                    </Button>
                    <Button
                      type="default"
                      className="border-pink-500 text-pink-500 hover:bg-pink-50"
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination backend */}
          <div className="flex justify-center mt-12">
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </section>

      <FeaturedProducts />
      <ProductCategories />

      <BookingModal open={open} onClose={() => setOpen(false)} />
      <BookingButtonFixed onClick={() => setOpen(true)} />
      <Footer />
    </div>
  );
}

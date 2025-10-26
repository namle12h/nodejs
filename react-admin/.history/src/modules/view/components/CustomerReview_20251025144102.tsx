import { useState, useEffect } from "react";
import {
  Rate,
  Button,
  Input,
  Progress,
  Card,
  Upload,
  message,
  Spin,
  Empty,
} from "antd";
import {
  StarFilled,
  LikeOutlined,
  MessageOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useReviews,
  useCreateReview,
} from "../../../shared/services/reviewApi";
import { useAuthStore } from "../../../shared/stores/authStore";
import { User } from "lucide-react";

const { TextArea } = Input;

interface ProductReviewSectionProps {
  serviceId: number;
}

export default function ProductReviewSection({
  serviceId,
}: ProductReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);


  const { user } = useAuthStore();




  // ✅ Log debug serviceId
  console.log("🧠 serviceId nhận được:", serviceId);

  // ✅ Lấy dữ liệu review từ API
  const {
    data: res,
    isLoading,
    refetch,
  } = useReviews("Service", serviceId, true);

  const reviews = res || [];
  const filteredReviews =
    selectedStar && selectedStar > 0
      ? reviews.filter((r: any) => r.rating === selectedStar)
      : reviews;

  const visibleReviews = filteredReviews.slice(0, 3);
  const hiddenReviews = filteredReviews.slice(3);

  // ✅ Gọi lại khi serviceId có giá trị
  useEffect(() => {
    if (serviceId) {
      console.log("🔁 Gọi refetch() vì serviceId có giá trị:", serviceId);
      refetch();
    }
  }, [serviceId, refetch]);

  // ✅ Hook tạo review mới
  const { mutate: createReview, isPending } = useCreateReview();

  // ✅ Tính toán trung bình và phân bố sao
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
  }));



  // ✅ Upload ảnh preview
  const handleUploadChange = ({ fileList }: any) => {
    if (fileList.length > 6) {
      message.warning("Chỉ được tải tối đa 5 ảnh và 1 video!");
      return;
    }
    setFileList(fileList);
  };

  console.log("🧩 Reviews data:", reviews);

  // ✅ Gửi đánh giá
  const handleSubmit = () => {


    if (!comment || rating === 0)
      return message.warning("Vui lòng nhập nội dung và chọn số sao!");

    const newReview = {
      rating,
      comment,
      imageUrl: fileList[0]?.thumbUrl || null,
      reviewType: "Service",
      refId: serviceId,
      customerId: 55, // tạm hardcode ID khách hàng test
      fileList,
    };

    createReview(newReview, {
      onSuccess: () => {
        message.success("🎉 Gửi đánh giá thành công!");
        setComment("");
        setRating(0);
        setFileList([]);
        setShowForm(false);
        refetch();
      },
    });
  };

  return (
  <div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Đánh giá khách hàng</h2>

    {isLoading ? (
      <div className="text-center py-10">
        <Spin tip="Đang tải đánh giá..." />
      </div>
    ) : (
      <>
        {/* --- Tổng quan sao --- */}
        <div className="flex items-center gap-6 mb-8">
          <div className="text-center">
            <p className="text-pink-600 text-4xl font-bold">
              {avgRating.toFixed(1)}
            </p>
            <Rate disabled allowHalf value={avgRating} />
            <p className="text-sm text-gray-500">{totalReviews} đánh giá</p>
            <Button
              type="primary"
              className="bg-red-600 hover:bg-red-700 mt-3 px-6 py-5 rounded-lg font-semibold"
              onClick={() => {
                if (!user) {
                  message.info("Vui lòng đăng nhập để đánh giá dịch vụ.");
                  return;
                }
                setShowForm(!showForm);
              }}
            >
              Đánh giá dịch vụ
            </Button>
          </div>

          <div className="flex-1 space-y-2">
            {ratingDistribution.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-gray-500">{r.star}★</span>
                <Progress
                  percent={(r.count / totalReviews) * 100 || 0}
                  showInfo={false}
                  strokeColor="#facc15"
                  className="flex-1"
                />
                <span className="text-gray-500 text-sm">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Form viết đánh giá --- */}
        {showForm && (
          <Card className="mb-8 bg-gray-50 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Viết đánh giá của bạn</h3>
            <Rate
              className="mb-4"
              value={rating}
              onChange={(value) => setRating(value)}
            />
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={3000}
              placeholder="Chia sẻ cảm nhận của bạn..."
            />
            <div className="mt-4">
              <p className="text-gray-600 mb-2 text-sm">
                Thêm tối đa 5 ảnh và 1 video
              </p>
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                accept="image/*,video/*"
              >
                {fileList.length >= 6 ? null : (
                  <div>
                    <UploadOutlined />
                    <div className="mt-1 text-xs text-gray-600">
                      Thêm ảnh/video
                    </div>
                  </div>
                )}
              </Upload>
            </div>
            <div className="flex justify-end mt-3 gap-3">
              <Button onClick={() => setShowForm(false)}>Hủy</Button>
              <Button
                type="primary"
                loading={isPending}
                className="bg-black hover:bg-gray-800"
                onClick={handleSubmit}
              >
                Gửi bình luận
              </Button>
            </div>
          </Card>
        )}

        {/* --- Danh sách đánh giá --- */}
        {filteredReviews.length === 0 ? (
          <Empty description="Chưa có đánh giá nào cho dịch vụ này" />
        ) : (
          <div className="divide-y">
            {filteredReviews.map((r: any, i: number) => (
              <div key={r.id || i} className="py-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 text-white flex items-center justify-center rounded-full font-bold">
                    {r.customer?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">{r.customer?.name || "Khách hàng"}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Rate disabled defaultValue={r.rating} />
                      <span>
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                          : "Gần đây"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-1 text-gray-700">{r.comment}</p>

                {r.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={r.imageUrl}
                      alt="review-img"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    )}
  </div>
);

}

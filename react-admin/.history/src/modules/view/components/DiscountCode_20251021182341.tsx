import { Input, Button } from "antd";

interface DiscountCodeProps {
  discountCode: string;
  applyDiscount: () => void;
  setDiscountCode: (value: string) => void;
  discountApplied: boolean;
  discountAmount: number;
}

export default function DiscountCode({
  discountCode,
  applyDiscount,
  setDiscountCode,
  discountApplied,
  discountAmount,
}: DiscountCodeProps) {
  return (
    <div className="pt-2">
      <p className="text-gray-600 mb-2">Mã giảm giá:</p>

      {/* Ô nhập mã và nút áp dụng */}
      <div className="flex">
        <Input
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="rounded-l-lg border-r-0"
        />
        <Button
          type="primary"
          onClick={applyDiscount}
          className="!rounded-button rounded-r-lg bg-blue-500 whitespace-nowrap"
        >
          Áp dụng
        </Button>
      </div>

      {/* Hiển thị thông tin giảm giá */}
      {discountApplied && (
        <div className="flex justify-between mt-2 text-green-600">
          <p>Giảm giá:</p>
          <p>-{discountAmount.toLocaleString()} VND</p>
        </div>
      )}
    </div>
  );
}

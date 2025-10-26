interface PaymentTotalProps {
  totalAfterDiscount: number;
}

export default function PaymentTotal({ totalAfterDiscount }: PaymentTotalProps) {
  return (
    <div className="py-4">
      {/* Tổng thanh toán */}
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg">Tổng thanh toán:</p>
        <p className="font-bold text-xl text-red-600">
          {totalAfterDiscount.toLocaleString()} VND
        </p>
      </div>

      {/* Ghi chú VAT */}
      <p className="text-gray-500 text-sm text-right">(Đã bao gồm VAT)</p>
    </div>
  );
}

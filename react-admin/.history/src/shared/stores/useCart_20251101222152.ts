import { useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export function useCart() {
  // 1. FIX: Củng cố hàm khởi tạo useState với try...catch và lọc dữ liệu hỏng
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    
    if (saved) {
      try {
        const parsedCart: CartItem[] = JSON.parse(saved);

        // Lọc các mục không hợp lệ để tránh lỗi render sau khi reload
        return parsedCart.filter(item => 
          item && 
          typeof item.id === 'number' && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );
      } catch (e) {
        console.error("Lỗi khi phân tích giỏ hàng từ localStorage:", e);
        return []; // Trả về mảng rỗng nếu lỗi
      }
    }
    return [];
  });

  // 2. Thêm log theo dõi việc lưu vào localStorage
  useEffect(() => {
    // console.log("LƯU giỏ hàng vào localStorage:", cart); 
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
          // 3. FIX: Đảm bảo giá trị price là số hợp lệ (chuẩn hóa)
          const safePrice = Number(product.salePrice) > 0 ? Number(product.salePrice) : 0;
          
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: safePrice,
            imageUrl: product.imageUrl,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // 4. Thêm log theo dõi việc xóa giỏ hàng
  const clearCart = () => {
    console.log("!!! HÀM clearCart ĐÃ ĐƯỢC GỌI BẤT NGỜ KHI RELOAD !!!");
    setCart([]);
  }

  // 5. FIX: Củng cố tính toán totalPrice (đảm bảo nhân các giá trị là số)
  const totalPrice = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice };
}
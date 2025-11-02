import { useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    // return saved ? JSON.parse(saved) : [];
    if (saved) {
      try {
        // Cố gắng parse chuỗi JSON
        const parsedCart: CartItem[] = JSON.parse(saved);

        // Lọc các mục không hợp lệ (ví dụ: bị thiếu thuộc tính quan trọng
        // hoặc quantity <= 0 do lỗi trước đó)
        return parsedCart.filter(item => 
          item && 
          typeof item.id === 'number' && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );
      } catch (e) {
        console.error("Lỗi khi phân tích giỏ hàng từ localStorage:", e);
        // Trả về mảng rỗng nếu chuỗi JSON bị hỏng
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
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
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.salePrice,
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

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice };
}

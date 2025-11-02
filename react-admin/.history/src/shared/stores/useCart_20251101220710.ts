// import { useState, useEffect } from "react";

// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   imageUrl: string;
//   quantity: number;
// }

// export function useCart() {
//   const [cart, setCart] = useState<CartItem[]>(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product: any) => {
//     setCart((prev) => {
//       const existing = prev.find((item) => item.id === product.id);
//       if (existing) {
//         return prev.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [
//           ...prev,
//           {
//             id: product.id,
//             name: product.name,
//             price: product.salePrice,
//             imageUrl: product.imageUrl,
//             quantity: 1,
//           },
//         ];
//       }
//     });
//   };

//   const removeFromCart = (id: number) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id: number, quantity: number) => {
//     if (quantity <= 0) return removeFromCart(id);
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => setCart([]);

//   const totalPrice = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice };
// }

import { useState, useEffect } from "react";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

export function useCart() {
    // 1. Khởi tạo state ban đầu là rỗng hoặc null, KHÔNG đọc localStorage
    // Điều này đảm bảo trạng thái ban đầu giống hệt trên Server và Client (nếu bạn dùng SSR)
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false); // Cờ báo hiệu đã load xong từ localStorage

    // 2. Dùng useEffect để đọc localStorage LẦN ĐẦU TIÊN (chỉ chạy trên Client)
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            setCart(JSON.parse(saved));
        }
        setIsLoaded(true); // Đánh dấu đã load xong
    }, []);

    // 3. Dùng useEffect để lưu trữ mỗi khi cart thay đổi (chỉ chạy trên Client)
    useEffect(() => {
        if (isLoaded) { // Chỉ lưu khi đã load xong lần đầu
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isLoaded]);


    const addToCart = (product: any) => {
        // Logic thêm vào giỏ hàng (giữ nguyên)
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

    // 4. Trả về isLoaded để component sử dụng có thể hiển thị loading nếu cần
    return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, isLoaded };
}
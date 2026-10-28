import React, { useState, useEffect } from "react";

import { Product } from "../interfaces/Product";

import { CartContext } from "./cartContext";

interface CartProviderProps {
  children: React.ReactNode;
}

function CartProvider({ children }: CartProviderProps): React.ReactElement {
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const updatedCart = cart.some((item) => item.name === product.name)
      ? cart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: (item.quantity ?? 0) + 1 }
            : item,
        )
      : [...cart, product];

    setCart(updatedCart);
  };

  const deleteToCart = (product: Product) => {
    const newCart = cart.filter((item) => item.name !== product.name);

    setCart(newCart);
  };

  const deleteAllToCart = () => {
    setCart([]);
  };

  const updateProductQuantity = (index: number, quantity: number) => {
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, quantity } : item,
    );

    setCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        deleteToCart,
        updateProductQuantity,
        deleteAllToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;

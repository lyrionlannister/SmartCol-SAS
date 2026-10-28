import React from "react";
import { GiShoppingCart } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Swal from "sweetalert2";

import sendCartToServer from "@/services/sendCartToServer";
import { Product } from "@/interfaces/Product";
import { useCartContext } from "@/context/cartContext";

interface CartProps {
  products?: Array<Product>;
}

const Cart: React.FC<CartProps> = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let { cart } = useCartContext();
  const { deleteToCart, updateProductQuantity, deleteAllToCart } =
    useCartContext();

  const itemCount = cart.reduce(
    (total, product) => total + (product.quantity ?? 0),
    0,
  );

  const handleSendCart = async () => {
    if (cart.length === 0) {
      return;
    }

    try {
      const response = await sendCartToServer(cart);

      if (response?.message === "Email sent successfully") {
        Swal.fire({
          title: "Cotización enviada con éxito",
          text: "Te contactaremos pronto para finalizar la compra.",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "bg-primary font-semibold",
          },
        });
        deleteAllToCart();
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al enviar la cotización.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al enviar el carrito:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedCart = [...cart];

    updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
    updateProductQuantity(index, newQuantity);
  };

  return (
    <div className="relative">
      <a
        className="bg-primary/25 bg-opacity-50 flex cursor-pointer justify-center items-center border-2 border-primary text-white p-2 rounded-full shadow-2xl"
        id="cartcontainer"
        onClick={onOpen}
      >
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
            {itemCount}
          </span>
        )}
        <GiShoppingCart className="text-primary" size={40} />
      </a>

      <Modal
        className="bg-background/90"
        isOpen={isOpen}
        placement="bottom-center"
        size="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-center text-primary">Cotización</h2>
              </ModalHeader>
              <ModalBody>
                <div className="overflow-y-auto max-h-72">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-center text-primary">Item</th>
                        <th className="text-center text-primary">Producto</th>
                        <th className="text-center text-primary">Cantidad</th>
                        <th className="text-center text-primary" />
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((product, index) => (
                        <tr key={index}>
                          <td className="text-center py-2">{index + 1}</td>
                          <td className="text-left py-2">{product.name}</td>
                          <td className="text-center py-2">
                            <input
                              className="w-16 py-1 text-center bg-background/90 border-b-2 border-primary focus:outline-none"
                              max={40}
                              min="0"
                              type="number"
                              value={product.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  index,
                                  Number(e.target.value),
                                )
                              }
                            />
                          </td>
                          <td
                            className="text-center hover:cursor-pointer py-2 px-8"
                            onClick={() => deleteToCart(product)}
                          >
                            <MdDelete className="text-danger-600" size={20} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="text-white font-bold bg-danger-600/80 text-center"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  className="text-white font-bold bg-primary/80 text-center"
                  onClick={handleSendCart}
                  onPress={onClose}
                >
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Cart;

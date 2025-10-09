import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // adjust path

// inside your ProductDetails component:
const { user, token } = useContext(AuthContext); // assuming you have JWT token here for auth

const handleAddToCart = async () => {
  if (!user) {
    navigate("/login");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // send JWT token for auth
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart.");
    }

    const data = await response.json();
    alert(`"${product.name}" added to cart!`);
    // Optionally update cart UI here or notify cart context
  } catch (error) {
    alert(error.message || "Error adding product to cart.");
  }
};

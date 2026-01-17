import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosInstance";

// inside ProductDetails component
const { user } = useAuth();

const handleAddToCart = async () => {
  if (!user) {
    navigate("/login");
    return;
  }

  try {
    await axiosInstance.post("/cart/add", {
      productId: product.id,
      quantity: 1,
    });

    alert(`"${product.name}" added to cart!`);
  } catch (error) {
    console.error("Add to cart error:", error);
    alert(error.response?.data?.message || "Error adding product to cart.");
  }
};

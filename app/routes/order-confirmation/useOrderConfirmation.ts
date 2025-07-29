import { useNavigate } from "react-router";

export function useOrderConfirmation() {
  const navigate = useNavigate();

  const continueShopping = () => {
    navigate("/");
  };

  const returnToHome = () => {
    navigate("/");
  };

  return {
    state: {},
    actions: {
      continueShopping,
      returnToHome,
    },
  };
} 
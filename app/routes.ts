import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("components/Layout.tsx", [
    index("routes/home/Home.tsx"),
    route("cart", "routes/cart/Cart.tsx"),
    route("checkout", "routes/checkout/Checkout.tsx"),
    route("order-confirmation", "routes/order-confirmation/OrderConfirmation.tsx"),
    route("product/:productId", "routes/product-details/ProductDetails.tsx"),
  ]),
  route("api/trpc/*", "routes/api.trpc.$.ts"),
] satisfies RouteConfig;

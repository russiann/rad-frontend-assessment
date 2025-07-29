import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Product } from "../../../utils/trpc";

type ProductTabsProps = {
  product: Product;
};

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <div>
      <Tabs aria-label="Product information">
        <Tab key="specs" title="Specifications">
          <Card>
            <CardBody>
              <div className="space-y-4">
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-default-500">Name</dt>
                  <dd className="text-sm text-default-900 col-span-2">{product.name}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-default-500">Category</dt>
                  <dd className="text-sm text-default-900 col-span-2">{product.category}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-default-500">Stock</dt>
                  <dd className="text-sm text-default-900 col-span-2">{product.stock} units available</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-default-500">Price</dt>
                  <dd className="text-sm text-default-900 col-span-2">${product.price.toFixed(2)}</dd>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="shipping" title="Shipping">
          <Card>
            <CardBody>
              <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
              <ul className="space-y-2 text-default-700">
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:truck" className="text-primary mt-1" />
                  <span>Free shipping on orders over $50</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:clock" className="text-primary mt-1" />
                  <span>Delivery typically within 3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:refresh-cw" className="text-primary mt-1" />
                  <span>Easy 30-day returns and exchanges</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
} 
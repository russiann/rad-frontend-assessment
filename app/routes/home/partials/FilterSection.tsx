import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

type FilterSectionProps = {
  selectedCategory: string;
  selectedSort: string;
  onCategoryFilter: (category: string) => void;
  onSortChange: (sort: string) => void;
};

export function FilterSection({ 
  selectedCategory, 
  selectedSort, 
  onCategoryFilter, 
  onSortChange 
}: FilterSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Dropdown>
        <DropdownTrigger>
          <Button 
            variant="bordered" 
            endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
          >
            Filter by Category
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Categories"
          onAction={(key) => onCategoryFilter(key as string)}
        >
          <DropdownItem key="all">All Categories</DropdownItem>
          <DropdownItem key="electronics">Electronics</DropdownItem>
          <DropdownItem key="clothing">Clothing</DropdownItem>
          <DropdownItem key="footwear">Footwear</DropdownItem>
          <DropdownItem key="home">Home</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
      <Dropdown>
        <DropdownTrigger>
          <Button 
            variant="bordered" 
            endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
          >
            Sort by Price
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Sort options"
          onAction={(key) => onSortChange(key as string)}
        >
          <DropdownItem key="default">Default</DropdownItem>
          <DropdownItem key="low-to-high">Low to High</DropdownItem>
          <DropdownItem key="high-to-low">High to Low</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
} 
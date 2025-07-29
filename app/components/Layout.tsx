import React, { useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as HeroUILink, 
        Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link, useLocation, Outlet } from "react-router";
import { useCartContext } from "../contexts/CartContext";
import { useChatContext } from "../contexts/ChatContext";
import { ChatContainer } from "./AiAssistant/containers/ChatContainer";
import DevFloatingToggle from "./DevFloatingToggle";

export default function Layout() {
  const location = useLocation();
  const { isOpen, onOpenChange } = useChatContext();
  const { state: cartState } = useCartContext();
  
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Determine if chat should be available on current page
  const isChatAvailable = () => {
    const pathname = location.pathname;
    
    // Chat available on home page
    if (pathname === '/') return true;
    
    // Chat available on product pages
    if (pathname.startsWith('/product/')) return true;
    
    // Not available on other pages (cart, checkout, order-confirmation, etc.)
    return false;
  };

  const showChat = isChatAvailable();

  // Close chat when navigating to pages where chat is not available
  useEffect(() => {
    if (!showChat && isOpen) {
      onOpenChange();
    }
  }, [showChat, isOpen, onOpenChange]);

  return (
    <div className="h-screen flex flex-col">
      <DevFloatingToggle />
      <Navbar maxWidth="full" isBordered>
        <NavbarBrand>
          <Link to="/" className="flex items-center">
            <Icon icon="lucide:shopping-bag" className="text-primary mr-2 text-xl" />
            <p className="font-bold text-inherit">React Shopping</p>
          </Link>
        </NavbarBrand>
        
        <NavbarContent justify="end" className="gap-4" >
          {/* Desktop Cart */}
          <NavbarItem className="hidden sm:flex" isActive={isActive("/cart")}>
            <HeroUILink as={Link} to="/cart" color={isActive("/cart") ? "primary" : "foreground"}>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shopping-cart" className="text-lg" />
                <span>Cart{totalItems > 0 ? ` (${totalItems})` : ''}</span>
              </div>
            </HeroUILink>
          </NavbarItem>
          
          {/* Mobile Cart */}
          <NavbarItem className="sm:hidden" isActive={isActive("/cart")}>
            <Button
              as={Link}
              to="/cart"
              isIconOnly
              variant="light"
              className="relative"
            >
              <Icon icon="lucide:shopping-cart" className="text-lg" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </NavbarItem>
          
          {/* Chat Button */}
          {showChat && (
            <NavbarItem>
              <Button
                isIconOnly
                variant="light"
                onPress={() => onOpenChange()}
                aria-label="Toggle assistant sidebar"
              >
                <Icon icon="lucide:message-circle" className="text-lg" />
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
      
      <div className="flex" style={{ height: 'calc(100vh - 64px - 60px)' }}>
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {showChat && <ChatContainer />}
      </div>
      
      <footer className="py-4 px-6 border-t bg-content1 flex-shrink-0" style={{ height: '60px' }}>
        <div className="max-w-7xl mx-auto text-center text-default-500 text-sm">
          © {new Date().getFullYear()} React Shopping. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 
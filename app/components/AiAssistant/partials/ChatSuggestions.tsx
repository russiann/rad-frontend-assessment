import React from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import { useLocation, useParams } from "react-router";
import { Icon } from "@iconify/react";

type SuggestionType = 'best-deals' | 'trending' | 'gift-help' | 'product-info' | 'good-deal' | 'complementary';

type Suggestion = {
  id: string;
  text: string;
  type: SuggestionType;
  icon: string;
};

type ChatSuggestionsProps = {
  onSuggestionClick: (suggestion: Suggestion) => void;
  isLoading?: boolean;
};

export function ChatSuggestions({ onSuggestionClick, isLoading }: ChatSuggestionsProps) {
  const location = useLocation();
  const { productId } = useParams();
  
  const isProductPage = location.pathname.includes('/product/');
  const isHomePage = location.pathname === '/';

  const getContextualSuggestions = (): Suggestion[] => {
    if (isProductPage) {
      return [
        { 
          id: 'product-info', 
          text: 'Tell me more about this product', 
          type: 'product-info',
          icon: 'lucide:info'
        },
        { 
          id: 'good-deal', 
          text: 'Is this a good deal?', 
          type: 'good-deal',
          icon: 'lucide:trending-down'
        },
        { 
          id: 'complementary', 
          text: 'What goes well with this?', 
          type: 'complementary',
          icon: 'lucide:package-plus'
        }
      ];
    }
    
    if (isHomePage) {
      return [
        { 
          id: 'best-deals', 
          text: 'Show me the best deals', 
          type: 'best-deals',
          icon: 'lucide:tag'
        },
        { 
          id: 'trending', 
          text: "What's trending now?", 
          type: 'trending',
          icon: 'lucide:trending-up'
        },
        { 
          id: 'gift-help', 
          text: 'Help me find a gift', 
          type: 'gift-help',
          icon: 'lucide:gift'
        }
      ];
    }

    return [];
  };

  const suggestions = getContextualSuggestions();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="border-t bg-content1 px-3 py-3">
      <div className="mb-2">
        <span className="text-xs text-default-500 font-medium">Quick suggestions:</span>
      </div>
      <ScrollShadow 
        orientation="horizontal" 
        hideScrollBar
        className="w-full"
      >
        <div className="flex gap-2 pb-1">
          {suggestions.map((suggestion) => (
            <Chip
              key={suggestion.id}
              variant="bordered"
              color="primary"
              className="cursor-pointer whitespace-nowrap hover:bg-primary-50 transition-colors"
              onClick={() => !isLoading && onSuggestionClick(suggestion)}
              startContent={<Icon icon={suggestion.icon} className="text-sm" />}
            >
              {suggestion.text}
            </Chip>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
} 
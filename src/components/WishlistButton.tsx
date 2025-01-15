import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlist';
import { useAuthStore } from '../store/auth';
import type { Product } from '../lib/types';
import { cn } from '../lib/utils';

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export default function WishlistButton({ product, className }: WishlistButtonProps) {
  const { user } = useAuthStore();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    if (inWishlist) {
      await removeItem(product.id);
    } else {
      await addItem(product);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-2 rounded-full shadow-lg transition-colors",
        inWishlist
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white text-gray-800 hover:bg-gray-100",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5",
          inWishlist && "fill-current"
        )}
      />
    </button>
  );
}
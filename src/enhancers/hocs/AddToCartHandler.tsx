import React, { memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/redux/hooks';
import { cartActions } from '../../store/redux/slices/cartSlice';

export interface AddToCartHandlerRenderProps {
  onClick?: () => void,
  children: React.ReactNode;
  selected?: boolean;
}

interface Props {
  productId: string | null,
  render: (props: AddToCartHandlerRenderProps) => React.ReactElement,
}

export const AddToCartHandler: React.FC<Props> = memo(({
  productId,
  render,
}) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart.ids);

  if (productId === null) {
    return render({ children: 'Add to cart' })
  }
  
  const isInCart = cart.includes(productId);
  
  const toggleProductInCart = useCallback(() => {
    console.log(isInCart);
    dispatch(
      isInCart
        ? cartActions.remove(productId)
        : cartActions.add(productId),
    );
  }, [productId, isInCart]);

  return render({
    onClick: toggleProductInCart,
    selected: isInCart,
    children: isInCart ? 'Added to cart' : 'Add to cart',
  });
});
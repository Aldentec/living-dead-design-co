import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, variant = null, quantity = 1 } = action.payload;
      
      // Create unique item key based on product ID and variant
      const itemKey = variant ? `${product.id}-${variant.option}-${variant.value}` : product.id;
      
      const existingItemIndex = state.items.findIndex(item => item.key === itemKey);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + quantity,
          totalAmount: calculateTotal(updatedItems)
        };
      } else {
        // New item, add to cart
        const newItem = {
          key: itemKey,
          product,
          variant,
          quantity,
          price: product.salePrice || product.price
        };
        
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + quantity,
          totalAmount: calculateTotal(updatedItems)
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const { itemKey } = action.payload;
      const itemToRemove = state.items.find(item => item.key === itemKey);
      
      if (!itemToRemove) return state;
      
      const updatedItems = state.items.filter(item => item.key !== itemKey);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: calculateTotal(updatedItems)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemKey, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: { itemKey } });
      }
      
      const itemIndex = state.items.findIndex(item => item.key === itemKey);
      if (itemIndex === -1) return state;
      
      const oldQuantity = state.items[itemIndex].quantity;
      const updatedItems = [...state.items];
      updatedItems[itemIndex].quantity = quantity;
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - oldQuantity + quantity,
        totalAmount: calculateTotal(updatedItems)
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0
      };
    
    case CART_ACTIONS.LOAD_CART:
      return action.payload;
    
    default:
      return state;
  }
}

// Calculate total amount
function calculateTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Initial cart state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Save cart to memory (you could extend this to save to backend)
  useEffect(() => {
    // In a real app, you might want to save to backend or localStorage
    // For now, we'll just keep it in memory during session
  }, [cart]);

  // Cart actions
  const addToCart = (product, variant = null, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, variant, quantity }
    });
  };

  const removeFromCart = (itemKey) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { itemKey }
    });
  };

  const updateQuantity = (itemKey, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { itemKey, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getItemInCart = (productId, variant = null) => {
    const itemKey = variant ? `${productId}-${variant.option}-${variant.value}` : productId;
    return cart.items.find(item => item.key === itemKey);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const calculateTotals = (items) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
  const existingItem = state.items.find((item) => item.id === action.payload.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + action.payload.quantity;
    existingItem.quantity = Math.min(newQuantity, action.payload.stock);
  } else {
    state.items.push({ ...action.payload, quantity: Math.min(action.payload.quantity, action.payload.stock) });
  }

  const totals = calculateTotals(state.items);
  state.totalAmount = totals.totalAmount;
  state.totalItems = totals.totalItems;
},


    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },

    updateQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== action.payload.id);
        } else if (action.payload.quantity <= item.stock) {
          item.quantity = action.payload.quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

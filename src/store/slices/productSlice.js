import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/product/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
); 

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/singleProduct/${id}`);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProductsWithAI = createAsyncThunk(
  'product/searchProductsWithAI',
  async (userPrompt, { rejectWithValue }) => {
    try {
      const response = await api.post('/product/ai-search', { userPrompt });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'AI search failed');
    }
  }
);

export const createReview = createAsyncThunk(
  'product/createReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/product/post-new/review/${productId}`, { rating, comment });
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create review'
      return rejectWithValue(message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'product/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await api.delete(`/product/delete/review/${productId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/delete',
  async ({ productId }, { rejectWithValue }) => {
    try {
      await api.delete(`/product/admin/delete/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/product/admin/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);


export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/product/admin/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.updatedProduct;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);


const initialState = {
  products: [],
  product: null,
  reviews: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  filters: {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 999999,
    rating: 0,
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // AI Search
    builder
      .addCase(searchProductsWithAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsWithAI.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(searchProductsWithAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      //update product
      builder
  .addCase(updateProduct.fulfilled, (state, action) => {
    state.product = action.payload;
    state.loading = false;
  })
  .addCase(updateProduct.pending, (state) => {
    state.loading = true;
  })
  .addCase(updateProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });


    // Create Review
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.review);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // Create Product
builder
  .addCase(createProduct.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(createProduct.fulfilled, (state, action) => {
    state.loading = false;
    state.products.unshift(action.payload); // Add new product at top
  })
  .addCase(createProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });


       // Delete Product
       builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = productSlice.actions;
export default productSlice.reducer;

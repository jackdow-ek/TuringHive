import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const SearchContext = createContext();

const initialState = {
  uploadedImage: null,
  searchResults: null,
  productInfo: null,
  loading: false,
  loadingStage: '',
  error: null,
  filters: {
    sortBy: 'price',
    marketplace: 'all'
  }
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_LOADING_STAGE':
      return { ...state, loadingStage: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false, loadingStage: '' };
    case 'SET_UPLOADED_IMAGE':
      return { ...state, uploadedImage: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { 
        ...state, 
        searchResults: action.payload.results,
        productInfo: action.payload.productInfo,
        loading: false,
        loadingStage: '',
        error: null
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_RESULTS':
      return { 
        ...state, 
        searchResults: null, 
        productInfo: null, 
        uploadedImage: null,
        error: null 
      };
    default:
      return state;
  }
};

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const uploadImage = async (file) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_LOADING_STAGE', payload: 'Resim yükleniyor...' });
      dispatch({ type: 'SET_ERROR', payload: null });

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        dispatch({ type: 'SET_UPLOADED_IMAGE', payload: response.data });
        dispatch({ type: 'SET_LOADING_STAGE', payload: 'Resim başarıyla yüklendi' });
        return response.data;
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const searchProducts = async (filename) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_LOADING_STAGE', payload: 'Yapay zeka ile ürün analiz ediliyor...' });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await axios.post('/api/search', { filename });

      if (response.data.success) {
        dispatch({ type: 'SET_LOADING_STAGE', payload: 'Sonuçlar derleniyor...' });
        dispatch({ 
          type: 'SET_SEARCH_RESULTS', 
          payload: {
            results: response.data.marketplace_results,
            productInfo: response.data.product_info
          }
        });
        return response.data;
      } else {
        throw new Error(response.data.error || 'Search failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Search failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearResults = () => {
    dispatch({ type: 'CLEAR_RESULTS' });
  };

  const value = {
    ...state,
    uploadImage,
    searchProducts,
    setFilters,
    clearResults
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 
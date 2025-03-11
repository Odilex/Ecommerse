import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  language: string;
  isLoading: boolean;
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  modal: {
    visible: boolean;
    type: string | null;
    data: any;
  };
}

const initialState: UIState = {
  theme: 'light',
  language: 'en',
  isLoading: false,
  toast: {
    visible: false,
    message: '',
    type: 'info',
  },
  modal: {
    visible: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast = {
        ...state.toast,
        visible: false,
      };
    },
    showModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        visible: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    hideModal: (state) => {
      state.modal = {
        visible: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setLoading,
  showToast,
  hideToast,
  showModal,
  hideModal,
} = uiSlice.actions;

export default uiSlice.reducer; 
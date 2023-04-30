import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

export const updateFolder = (newState: string[]) => (dispatch: any) => {
  return dispatch(updateFolderAction(newState));
};

export const updateImageByMerge = (newState: {}) => (dispatch: any) => {
  return dispatch(updateImageByMergeAction(newState));
};

export const updateImage = (newState: {}) => (dispatch: any) => {
  return dispatch(updateImageAction(newState));
};

const foldersDuck = createSlice({
  name: "folderDuck",
  initialState: { folders: [], images: {} },
  reducers: {
    updateFolderAction: (
      state: { folders: string[]; images: object },
      action: PayloadAction<string[]>
    ) => {
      state.folders = action.payload;
    },
    updateImageByMergeAction: (
      state: {
        folders: string[];
        images: {};
      },
      action: PayloadAction<{}>
    ) => {
      state.images = { ...state.images, ...action.payload };
    },
    updateImageAction: (
      state: {
        folders: string[];
        images: {};
      },
      action: PayloadAction<{}>
    ) => {
      state.images = action.payload;
    },
  },
});

const { updateFolderAction, updateImageByMergeAction, updateImageAction } =
  foldersDuck.actions;

export default foldersDuck.reducer;

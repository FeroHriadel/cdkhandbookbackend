import { configureStore } from "@reduxjs/toolkit";
import tagsSlice from "./slices/tagsSlice";
import categoriesSlice from "./slices/categoriesSlice";
import { useDispatch, useSelector, useStore } from "react-redux";


export const makeStore = () => {
    return configureStore({reducer: {
        tags: tagsSlice, 
        categories: categoriesSlice,
    }})
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

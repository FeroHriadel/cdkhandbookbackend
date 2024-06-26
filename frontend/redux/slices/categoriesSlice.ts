import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/models/models";



const initialState: Category[] = [];


function sortByName(arr: Category[]) {
    return arr.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
}



export const categoriesSlice = createSlice({
    initialState,
    name: `categoriesSlice`,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            return action.payload;
        },
        addCategory: (state, action: PayloadAction<Category>) => {
            let newState = [...state, {...action.payload}];
            let sorted = sortByName(newState);
            return sorted;
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            let filtered = [...state].filter(t => t.id !== action.payload);
            console.log(filtered);
            return filtered;
        },
        editCategory: (state, action: PayloadAction<Category>) => {
            let idx = state.findIndex(t => t.id === action.payload.id);
            let newState = [...state];
            newState.splice(idx, 1);
            newState.push(action.payload);
            let sorted = sortByName(newState);
            return sorted;
        }
    }
});


export default categoriesSlice.reducer;
export const { setCategories, addCategory, removeCategory, editCategory } = categoriesSlice.actions;

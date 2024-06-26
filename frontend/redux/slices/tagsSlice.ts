import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tag } from "@/models/models";



const initialState: Tag[] = [];


function sortByName(arr: Tag[]) {
    return arr.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
}



export const tagsSlice = createSlice({
    initialState,
    name: `tagsSlice`,
    reducers: {
        setTags: (state, action: PayloadAction<Tag[]>) => {
            return action.payload;
        },
        addTag: (state, action: PayloadAction<Tag>) => {
            let newState = [...state, {...action.payload}];
            let sorted = sortByName(newState);
            return sorted;
        },
        removeTag: (state, action: PayloadAction<string>) => {
            let filtered = [...state].filter(t => t.id !== action.payload);
            return filtered;
        },
        editTag: (state, action: PayloadAction<Tag>) => {
            let idx = state.findIndex(t => t.id === action.payload.id);
            let newState = [...state];
            newState.splice(idx, 1);
            newState.push(action.payload);
            let sorted = sortByName(newState);
            return sorted;
        }
    }
});


export default tagsSlice.reducer;
export const { setTags, addTag, removeTag, editTag } = tagsSlice.actions;

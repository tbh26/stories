import { Story } from "../Data";

export const fetchStories = 'OUTSET_FETCH_STORIES';
export const processSuccess = 'PROCESS_FETCH_SUCCESS';
export const processFail = 'PROCESS_FETCH_FAILURE';
export const removeStory = 'REMOVE_STORY';
export const noStories = [];
export const initialStoriesState = {data: noStories, isLoading: false, loadError: false};
export const fetchStoriesState = {data: noStories, isLoading: true, loadError: false};
export const storiesErrorState = {data: noStories, isLoading: false, loadError: true};

export type StoriesState = {
    data: Story[];
    isLoading: boolean;
    loadError: boolean;
}

export const storiesReducer = (state: StoriesState, action: { type: string; payload: any }) => {
    console.debug('storiesReducer, action: ', action);
    let newState = {...state};
    switch (action.type) {
        case fetchStories:
            console.debug('(sr) fetch stories...');
            return fetchStoriesState;
        case processSuccess:
            newState = {data: action.payload.data, isLoading: false, loadError: false};
            console.debug('(sr) process success result; new state:', newState);
            return newState;
        case processFail:
            newState = storiesErrorState;
            console.debug('(sr) process failure; new state:', newState);
            return newState;
        case removeStory:
            newState.data = state.data.filter(
                (story: Story) => action.payload.objectID !== story.objectID
            );
            console.debug('(sr) remove story; new state:', newState);
            return newState;
        default:
            console.error(`storiesReducer, unknown action type: ${action.type}`);
            return state;
    }
}

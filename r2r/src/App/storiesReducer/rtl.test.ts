import {
    fetchStories,
    fetchStoriesState,
    initialStoriesState,
    noStories, processFail,
    processSuccess, removeStory, storiesErrorState,
    storiesReducer, StoriesState
} from ".";
import { someStories, storyOne, storyThree, storyTwo } from "../rtl.test";

describe('Stories Reducer', function () {
    test('stories "loading" state', function () {
        const newState = storiesReducer(initialStoriesState, {type: fetchStories, payload: null});
        let expectedState = fetchStoriesState;
        // expect(newState.data.length).toBe(expectedState.data.length);
        expect(newState.data.length).toBe(noStories.length);
        expect(newState.isLoading).toBeTruthy();
        expect(newState.loadError).toBe(expectedState.loadError);
    });

    test('fetch stories, process success', function () {
        const newState = storiesReducer(initialStoriesState, {type: processSuccess, payload: {data: someStories}});
        let expectedState: StoriesState = initialStoriesState;
        expectedState.data = someStories;
        expect(newState.data.length).toBe(expectedState.data.length);
        expect(newState.isLoading).toBe(expectedState.isLoading);
        expect(newState.loadError).toBeFalsy();
    });

    test('fetch stories, process failure', function () {
        const newState = storiesReducer(initialStoriesState, {type: processFail, payload: {data: someStories}});
        let expectedState: StoriesState = storiesErrorState;
        expect(newState.data.length).toBe(expectedState.data.length);
        expect(newState.isLoading).toBe(expectedState.isLoading);
        expect(newState.loadError).toBeTruthy();
    });

    test('remove story', function () {
        const loadedStoriesState = storiesReducer(initialStoriesState, {
            type: processSuccess,
            payload: {data: someStories}
        });
        const newState = storiesReducer(loadedStoriesState, {
            type: removeStory,
            payload: {objectID: storyOne.objectID}
        });
        let expectedState: StoriesState = initialStoriesState;
        expectedState.data = [storyTwo, storyThree]; // storyOne is removed
        expect(newState.data.length).toBe(expectedState.data.length);
        expect(newState.isLoading).toBeFalsy();
        expect(newState.loadError).toBeFalsy();
    });

});

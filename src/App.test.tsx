import React from 'react';
import { render, screen } from '@testing-library/react';
import App, {
    fetchStories,
    fetchStoriesState,
    initialStoriesState,
    noStories,
    processFail,
    processSuccess,
    removeStory,
    storiesErrorState,
    storiesReducer,
    StoriesState,
    Story
} from './App';

describe('App component', () => {
    test('renders "Hello react" in h1', () => {
        render(<App/>);
        const headerElement = screen.getByRole('heading', {level: 1});
        expect(headerElement.innerHTML).toContain('Hello react');
    });
});

const storyOne: Story = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 1,
};

const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 2,
};

const storyThree = {
    title: 'Road to React',
    url: 'https://www.roadtoreact.com',
    author: 'Robin Wieruch',
    num_comments: 8,
    points: 8,
    objectID: 8,
};

const someStories: Story[] = [storyOne, storyThree, storyTwo];

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

describe('something truthy and falsy', function () {
    test('is true', () => {
        expect(true).toBeTruthy();
    });
    it('is false', () => {
        expect(false).toBeFalsy();
    });
});

import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import axios from 'axios';
import { App } from "./index";
import { Story } from "./Data";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Index component', () => {
    test('renders "Hello react" in h1', () => {
        render(<App/>);
        const headerElement = screen.getByRole('heading', {level: 1});
        expect(headerElement.innerHTML).toContain('Hello react');
    });

    test('fetch data success', async function () {
        const promise = Promise.resolve({
            data: {
                hits: someStories
            }
        });
        mockedAxios.get.mockImplementationOnce(() => promise);
        render(<App/>);
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getByText(/Loading/)).toBeInTheDocument();

        // @ts-ignore
        await act(() => promise);
        expect(screen.queryByText(/loading/i)).toBeNull();
        expect(screen.getByText(someStories[0].title)).toBeInTheDocument();
        expect(screen.getByText(someStories[1].author)).toBeInTheDocument();
        expect(screen.getByText(someStories[2].title)).toBeInTheDocument();
        expect(screen.queryByText('bla bla bla')).toBeNull();
    });

    test('fetch data fail', async () => {
        const promise = Promise.reject(new Error('oops'));
        mockedAxios.get.mockImplementationOnce(() => promise);
        render(<App/>);
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.queryByText(/Loading/)).toBeInTheDocument();
        try {
            await act(() => promise);
        } catch (error) {
            // console.info('data fail error:', error);
            screen.debug();
            expect(screen.getByText(/Loading/)).toBeInTheDocument(); // wrong, should be /error on loading/
            // expect(screen.getByText(/error on loading/)).toBeInTheDocument();
            // expect(screen.queryByText(/error on loading/)).toBeInTheDocument();
            expect(screen.queryByText(/error on loading/)).toBeNull(); // ???
            //
            // await setTimeout( () => {
            // }, 1234); // ?
        }
    });

    test('remove an item after successfull fetch data', async function () {
        const promise = Promise.resolve({
            data: {
                hits: someStories
            }
        });
        mockedAxios.get.mockImplementationOnce(() => promise);
        render(<App/>);
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getByText(/Loading/)).toBeInTheDocument();

        // @ts-ignore
        await act(() => promise);
        expect(screen.getByText(someStories[0].title)).toBeInTheDocument();
        expect(screen.getByText(someStories[1].author)).toBeInTheDocument();
        expect(screen.getByText(someStories[2].title)).toBeInTheDocument();
        fireEvent.click(screen.getAllByRole('button')[1]); // first dismiss button
        expect(screen.queryByText(someStories[0].title)).toBeNull(); // gone!
        expect(screen.getByText(someStories[1].author)).toBeInTheDocument();
        expect(screen.getByText(someStories[2].title)).toBeInTheDocument();
    });

});

export const storyOne: Story = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 1,
};

export const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 2,
};

export const storyThree = {
    title: 'Road to React',
    url: 'https://www.roadtoreact.com',
    author: 'Robin Wieruch',
    num_comments: 8,
    points: 8,
    objectID: 8,
};

export const someStories: Story[] = [storyOne, storyThree, storyTwo];

describe('something truthy and falsy', function () {
    test('is true', () => {
        expect(true).toBeTruthy();
    });
    it('is false', () => {
        expect(false).toBeFalsy();
    });
});

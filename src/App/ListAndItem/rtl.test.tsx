import { fireEvent, render, screen } from "@testing-library/react";
import { Item } from ".";
import React from "react";
import { storyThree, storyTwo } from "../rtl.test";

describe('Item component', function () {
    test('render (some) Item properties', function () {
        render(<Item item={storyThree} purgeItem={(id) => console.debug('remove id', id)}/>);
        // screen.debug();
        expect(screen.getByText(storyThree.author)).toBeInTheDocument();
        expect(screen.getByText(storyThree.title)).toHaveAttribute('href', storyThree.url);
        expect(screen.getAllByText(storyThree.num_comments)).toHaveLength(2); // tricky; num_comments and points are both 8
    });

    test('button', function () {
        const removeIdMock = jest.fn();
        render(<Item item={storyTwo} purgeItem={removeIdMock}/>);
        //screen.debug();
        fireEvent.click(screen.getByRole('button'));
        expect(removeIdMock).toHaveBeenCalledTimes(1);
        expect(removeIdMock).not.toHaveBeenCalledWith(storyThree.objectID);
        expect(removeIdMock).toHaveBeenCalledWith(storyTwo.objectID);
    });
});

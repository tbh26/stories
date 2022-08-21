import { SearchForm, SearchFormProps } from ".";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

describe('SearchForm component', function () {
    const sfProps: SearchFormProps = {
        inputItem: 'React',
        searchSubmit: jest.fn(),
        filterUpdate: jest.fn(),
        hasFocus: true
    };

    test('basic rendering', function () {
        render(<SearchForm {...sfProps}  />);
        //screen.debug();
        const labelElement = screen.getByLabelText(/Search/);
        // console.debug('labelElement:', labelElement);
        expect(labelElement).toBeInTheDocument();
    });

    test('update input', function () {
        render(<SearchForm {...sfProps}  />);
        const inputElement = screen.getByDisplayValue(sfProps.inputItem);
        fireEvent.change(inputElement, {target: {value: 'rxjs'}});
        expect(sfProps.filterUpdate).toHaveBeenCalledTimes(1);
        //expect(sfProps.inputItem).toBe('rxjs'); // oops, no update :)
    });

    test('(click) submit', function () {
        render(<SearchForm {...sfProps}  />);
        const buttonElement = screen.getByRole('button');
        const once = 1;
        fireEvent.submit(buttonElement);
        expect(sfProps.searchSubmit).toHaveBeenCalledTimes(once);
    });

});

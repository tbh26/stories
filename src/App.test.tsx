import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
    test('renders "Hello react" in h1', () => {
        render(<App/>);
        const headerElement = screen.getByRole('heading', {level: 1});
        expect(headerElement.innerHTML).toContain('Hello react');
    });
});

describe('something truthy and falsy', () => {
    test('is true', () => {
        expect(true).toBe(true);
    });
    it('is false', () => {
        expect(false).not.toBe(true);
    });
});

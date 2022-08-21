import React, { MutableRefObject, useEffect, useRef } from "react";
import styled from "styled-components";
import { StyledButton } from "../Button";

export type SearchFormProps = {
    inputItem: string;
    filterUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    hasFocus: boolean;
};

export const SearchForm = ({inputItem, filterUpdate, searchSubmit, hasFocus}: SearchFormProps) => (
    <StyledSearchForm onSubmit={searchSubmit}>
        <LabeledInput value={inputItem} onInputChange={filterUpdate} hasFocus={hasFocus}>
            <strong>Search for </strong>
        </LabeledInput>
        <StyledButton type='submit'>search</StyledButton>
    </StyledSearchForm>
);

const StyledSearchForm = styled.form`
  padding: 10px 0;
  display: flex;
  align-items: baseline;

  button {
    margin-left: 8px;
  }
`;

type LabeledInputProps = {
    value: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    hasFocus?: boolean;
    children?: React.ReactNode;
}

const LabeledInput = ({value, onInputChange, type = 'text', hasFocus = false, children}: LabeledInputProps) => {
    // const inputRef = useRef<HTMLInputElement>();
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        if (hasFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [hasFocus]);

    return (
        <StyledLabeledInput>
            {children} &nbsp;
            <input value={value} onChange={onInputChange} type={type} ref={inputRef}/>
        </StyledLabeledInput>
    );
}

const StyledLabeledInput = styled.label`
  padding: 8px;

  input {
    font-size: 20px;
    letter-spacing: 1px;
    padding: 8px;
  }
`;

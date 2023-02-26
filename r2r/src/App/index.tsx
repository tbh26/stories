import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Check } from '../assets/check.svg';
import { Parent } from "./Parent";

export const App = function () {

    function echoFun(message: string): string {
        return message;
    }

    return (
        <Container id='container'>

            <header>
                <h1 className='primary-header'>Hello {echoFun('react')} world. <Check height='36px' width='36px'/></h1>
            </header>

            <Parent id='first'/>
            <br/>
            <Parent id='next' hasFocus/>
            <br/>
            <Parent id='last'/>

            <footer><h2>footer</h2></footer>
        </Container>
    );
}

const Container = styled.div`
  min-height: 100vw;
  padding: 20px;
  background: linear-gradient(to left, #eff, #ffe);
  color: #222;

  .primary-header {
    font-size: 36px;
    font-weight: 400;
    letter-spacing: 2px;
  }

  .primary-header svg {
    margin: auto 2px;
    fill: green;
  }

  .primary-header svg:hover {
    fill: blue;
  }
`;

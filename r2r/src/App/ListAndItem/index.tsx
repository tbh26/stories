import { Story } from "../Data";
import React, { memo } from "react";
import { ReactComponent as Dismiss } from "../../assets/X.svg";
import styled from "styled-components";
import { StyledButton } from "../Button";

export type ListProps = {
    list: Story[];
    deleteItem: (id: number) => void;
};

export const List = memo(({list, deleteItem}: ListProps) => {
    if (list && list.length && list.length !== 0) {
        console.debug(`List component (${list.length} items). `);
        return (
            <ul style={{paddingLeft: 0}}>
                {
                    list.map((item) => (
                        <Item key={item.objectID} item={item} purgeItem={deleteItem}/>
                    ))
                }
            </ul>
        );
    } else {
        console.debug('ListAndItem component (no entries).');
        return (
            <section>
                <b>-</b>
            </section>
        );
    }
});

export type ItemProps = {
    item: Story;
    purgeItem: (id: number) => void;
};

export const Item = ({item, purgeItem}: ItemProps) => {
    const {
        url,
        title,
        author,
        num_comments,
        points,
        objectID
    } = item;
    return (
        <StyledLiItem>
            <SubItem width='40%'>
                <a href={url}>{title}</a>
            </SubItem>
            <SubItem width='10%'>author: </SubItem>
            <SubItem width='15%'>{author}</SubItem>
            <SubItem width='15%'># comments: </SubItem>
            {num_comments ? <SubItem>{num_comments}</SubItem> : <SubItem> - </SubItem>}
            <SubItem width='10%'>points: </SubItem>
            <SubItem>{points}</SubItem>
            <StyledButton style={{width: '5%'}}
                          type='button'
                          onClick={() => {
                              purgeItem(objectID)
                          }}>
                <Dismiss height='16px' width='16px'/>
            </StyledButton>
        </StyledLiItem>
    );
};

const StyledLiItem = styled.li`
  margin: 4px;
  padding: 8px;
  border-radius: 4px;
  background: #ddd;
  list-style: none;
  display: flex;
  align-items: center;

  button {
    padding-top: 8px;
  }

  button svg {
    fill: red;
  }
`;

type SubItemProp = {
    width?: string;
}

const SubItem = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${({width = '5%'}: SubItemProp) => width};
`;

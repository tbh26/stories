import React, {
    memo,
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ReactComponent as Check } from './assets/check.svg';
import { ReactComponent as Dismiss } from './assets/X.svg';

export const noItem = '';
export const fetchStories = 'OUTSET_FETCH_STORIES';
export const processSuccess = 'PROCESS_FETCH_SUCCESS';
export const processFail = 'PROCESS_FETCH_FAILURE';
export const removeStory = 'REMOVE_STORY';
export const noStories = [];
export const initialStoriesState = {data: noStories, isLoading: false, loadError: false};
export const fetchStoriesState = {data: noStories, isLoading: true, loadError: false};
export const storiesErrorState = {data: noStories, isLoading: false, loadError: true};

type StoriesState = {
    data: Story[];
    isLoading: boolean;
    loadError: boolean;
}

const hnBaseApi = 'https://hn.algolia.com/api/v1';

const App = () => {

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

export function useStoredState(key: string, initialState: string): [string, (newValue: string) => void] {
    const isMounted = useRef(false);

    const [value, setValue] = useState(localStorage.getItem(key) || initialState);

    useEffect(() => {
        if (!isMounted.current) {
            console.debug(`useStoredState, skip initial render.   (key: ${key})`);
            isMounted.current = true;
        } else {
            console.debug(`useStoredState, key: ${key}, value: ${value}`);
            localStorage.setItem(key, value);
        }
    }, [key, value])

    return [value, setValue];
}

const storiesReducer = (state: StoriesState, action: { type: string; payload: any }) => {
    console.debug('storiesReducer, action: ', action);
    let newState = {...state};
    switch (action.type) {
        case fetchStories:
            console.debug('(sr) fetch stories...');
            return fetchStoriesState;
        case processSuccess:
            newState = {data: action.payload.data, isLoading: false, loadError: false};
            console.debug('(sr) process success result; newstate:', newState);
            return newState;
        case processFail:
            newState = storiesErrorState;
            console.debug('(sr) process failure; newstate:', newState);
            return newState;
        case removeStory:
            newState.data = state.data.filter(
                (story: Story) => action.payload.objectId !== story.objectID
            );
            console.debug('(sr) remove story; newState:', newState);
            return newState;
        default:
            console.error(`storiesReducer, unknown action type: ${action.type}`);
            return state;
    }
}

type Story = {
    objectID: string;
    url: string;
    title: string;
    author: string;
    num_comments: number;
    points: number;
};

function getSumComments(stories: { data: Story[] }): number {
    const commentsCount = stories.data.reduce((result, value) => result + value.num_comments, 0);
    console.debug('getSumComments count:', commentsCount);
    return commentsCount;
}

type ParentProps = {
    id: string;
    hasFocus?: boolean;
}

const Parent = ({id, hasFocus = false}: ParentProps) => {
    const key = `${id}.searchTerm`;
    const [stories, dispatchStories] = useReducer(storiesReducer, initialStoriesState);
    const [inputItem, setInputItem] = useStoredState(key, noItem);

    console.debug(`Parent component.   (id: ${id}) `);

    const handleFilterUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        // console.debug('keyChange event: ', event);
        console.debug('keyChange (event) search-term: ', searchTerm);
        setInputItem(searchTerm);
    }

    function getStories(): Story[] {
        return stories.data;
    }

    const removeItem = useCallback((id: string) => {
        console.debug(`remove story with id: ${id}.`);
        dispatchStories({type: removeStory, payload: {objectId: id}});
    }, []);

    const handleFetchStories = useCallback(async () => {
        dispatchStories({type: fetchStories, payload: fetchStoriesState});
        let hnUrl = `${hnBaseApi}/search`;
        if (inputItem !== noItem) {
            hnUrl = `${hnBaseApi}/search?query=${inputItem}`;
        }
        try {
            const newStoriesState = {...initialStoriesState};
            const result = await axios.get(hnUrl);
            console.info(`hn api ${id} result:`, result);
            newStoriesState.data = result.data.hits;
            dispatchStories({type: processSuccess, payload: newStoriesState});
        } catch {
            dispatchStories({type: processFail, payload: storiesErrorState});
        }
    }, [inputItem, id]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetchStories();
    }

    const sumComments = useMemo(() => getSumComments(stories), [stories]);

    return (
        <>
            <hr/>
            <SearchForm inputItem={inputItem}
                        filterUpdate={handleFilterUpdate}
                        searchSubmit={handleSearchSubmit}
                        hasFocus={hasFocus}/>
            <br/>
            {
                stories.loadError ? (<section>error on loading</section>) :
                    stories.isLoading ? (<section>Loading ...</section>) : (
                        <section>
                            <List list={getStories()} deleteItem={removeItem}/>
                        </section>
                    )
            }
            <br/>
            <aside>
                == {id} filter: &ldquo;{inputItem}&rdquo;, # total comments: {sumComments} ==
            </aside>
            <hr/>
        </>
    );
}

type SearchFormProps = {
    inputItem: string;
    filterUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    hasFocus: boolean;
};

const SearchForm = ({inputItem, filterUpdate, searchSubmit, hasFocus}: SearchFormProps) => (
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

const StyledButton = styled.button`
  background: transparent;
  border: 2px solid #222;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;

  :hover {
    color: #eee;
    background: #222;
    border: 4px solid #888;
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

type ListProps = {
    list: Story[];
    deleteItem: (id: string) => void;
};

const List = memo(({list, deleteItem}: ListProps) => {
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
        console.debug('List component (no entries).');
        return (
            <section>
                <b>-</b>
            </section>
        );
    }
});
type ItemProps = {
    item: Story;
    purgeItem: (id: string) => void;
};

const Item = ({item, purgeItem}: ItemProps) => {
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

export default App;

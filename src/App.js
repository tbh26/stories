import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import './App.css';

export const noItem = '';
export const fetchStories = 'OUTSET_FETCH_STORIES';
export const processSuccess = 'PROCESS_FETCH_SUCCESS';
export const processFail = 'PROCESS_FETCH_FAILURE';
export const removeStory = 'REMOVE_STORY';
export const noStories = [];
export const initialStoriesState = {data: noStories, isLoading: false, loadError: false};
export const fetchStoriesState = {data: noStories, isLoading: true, loadError: false};
export const storiesErrorState = {data: noStories, isLoading: false, loadError: true};

const hnBaseApi = 'https://hn.algolia.com/api/v1';

const App = () => {

    function echoFun(mesg) {
        return mesg;
    }

    return (
        <main className='container'>

            <header>
                <h1>Hello {echoFun('react')} world.</h1>
            </header>

            <Parent id='first'/>
            <br/>
            <Parent id='next' hasFocus/>
            <br/>
            <Parent id='last'/>

        </main>
    );
}

export function useStoredState(key, initialState) {
    const [value, setValue] = useState(localStorage.getItem(key) || initialState);

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value])

    return [value, setValue];
}

const storiesReducer = (state, action) => {
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
                (story) => action.payload.objectId !== story.objectID
            );
            console.debug('(sr) remove story; newState:', newState);
            return newState;
        default:
            console.error(`storiesReducer, unknown action type: ${action.type}`);
            return state;
    }
}

const Parent = ({id, hasFocus = false}) => {
    const key = `${id}.searchTerm`;
    const [stories, dispatchStories] = useReducer(storiesReducer, initialStoriesState);
    const [inputItem, setInputItem] = useStoredState(key, noItem);

    const handleFilterUpdate = (event) => {
        const searchTerm = event.target.value;
        console.debug('keyChange event: ', event);
        setInputItem(searchTerm);
    }

    function getStories() {
        return stories.data;
    }

    const removeItem = (id) => {
        console.debug(`remove story with id: ${id}.`);
        dispatchStories({type: removeStory, payload: {objectId: id}});
    }

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

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFetchStories();
    }

    return (
        <>
            <hr/>
            <SearchForm inputItem={inputItem} filterUpdate={handleFilterUpdate} searchSubmit={handleSearchSubmit}
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
                == {id} filter: &ldquo;{inputItem}&rdquo; ==
            </aside>
            <hr/>
        </>
    );
}

const SearchForm = ({inputItem, filterUpdate, searchSubmit, hasFocus}) => (
    <form onSubmit={searchSubmit}>
        <LabeledInput value={inputItem} onInputChange={filterUpdate} hasFocus={hasFocus}>
            <strong>Search:</strong>
        </LabeledInput>
        <span> </span>
        <button type='submit'>search</button>
    </form>
);


const LabeledInput = ({value, onInputChange, type = 'text', hasFocus = false, children}) => {
    const inputRef = useRef();

    useEffect(() => {
        if (hasFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [hasFocus]);

    return (
        <label>
            {children} &nbsp;
            <input value={value} onChange={onInputChange} type={type} ref={inputRef}/>
        </label>
    );
}

const List = ({list, deleteItem}) => {
    if (list && list.length && list.length !== 0) {
        return (
            <ul>
                {
                    list.map((item) => (
                        <Item key={item.objectID} item={item} purgeItem={deleteItem}/>
                    ))
                }
            </ul>
        );
    } else {
        return (
            <section>
                <b>-</b>
            </section>
        );
    }
}

const Item = ({item, purgeItem}) => {
    const {
        url,
        title,
        author,
        num_comments,
        points,
        objectID
    } = item;
    return (
        <li>
            <span>
                <a href={url}>{title}</a>
            </span>
            <span>, author: </span>
            <span>{author}</span>
            <span>, # comments: </span>
            <span>{num_comments}</span>
            <span>, points: </span>
            <span>{points} &nbsp; </span>
            <button type='button' onClick={() => {
                purgeItem(objectID)
            }}><strong>X</strong></button>
        </li>
    );
};

export default App;

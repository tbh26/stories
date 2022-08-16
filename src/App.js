import { useEffect, useReducer, useRef, useState } from "react";

export const noFilter = '';
export const fetchStories = 'OUTSET_FETCH_STORIES';
export const processSuccess = 'PROCESS_FETCH_SUCCESS';
export const processFail = 'PROCESS_FETCH_FAILURE';
export const removeStory = 'REMOVE_STORY';
export const noStories = [];
export const initialStoriesState = {data: noStories, isLoading: false, loadError: false};
export const fetchStoriesState = {data: noStories, isLoading: true, loadError: false};
export const storiesErrorState = {data: noStories, isLoading: false, loadError: true};

const techStuff = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke II',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Road to React',
        url: 'https://www.roadtoreact.com/',
        author: 'Robin Wieruch',
        num_comments: 3,
        points: 9,
        objectID: 13,
    },
    {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
    {
        title: 'Road to GraphQL',
        url: 'https://www.roadtographql.com/',
        author: 'Robin Wieruch',
        num_comments: 2,
        points: 8,
        objectID: 14,
    },
];

const otherStuff = [
    {
        title: 'Reactie',
        url: 'https://example.org/',
        author: 'Jojo',
        num_comments: 7,
        points: 1,
        objectID: 35,
    },
    {
        title: 'Rebus',
        url: 'https://puzzle.net/',
        author: 'Pipo',
        num_comments: 0,
        points: 5,
        objectID: 36,
    },
    {
        title: 'Reductie',
        url: 'https://sale.org/',
        author: 'ac / dc',
        num_comments: 3,
        points: 3,
        objectID: 37,
    },
    {
        title: 'Redactie',
        url: 'https://paper.com/',
        author: 'Clark Kent',
        num_comments: 13,
        points: 7,
        objectID: 39,
    },
];

const App = () => {

    function echoFun(mesg) {
        return mesg;
    }

    return (
        <main>

            <header>
                <h1>Hello {echoFun('react')} world.</h1>
            </header>

            <Parent id='tech'/>

            <br/> <br/>

            <Parent id='other' hasFocus/>

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
            newState = {data: action.payload.stories, isLoading: false, loadError: false};
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
    const [itemFilter, setItemFilter] = useStoredState(key, noFilter);

    const handleFilterUpdate = (event) => {
        const searchTerm = event.target.value
        setItemFilter(searchTerm);
    }

    function getStories() {
        console.debug(`getStories, itemFilter: ${itemFilter}, stories:`, stories);
        if (itemFilter === noFilter) {
            return stories.data;
        } else {
            return stories.data.filter((story) => story.title.toLowerCase().includes(itemFilter.toLowerCase()));
        }
    }

    const removeItem = (id) => {
        console.debug(`remove story with id: ${id}.`);
        dispatchStories({type: removeStory, payload: {objectId: id}});
    }

    useEffect(() => {
        dispatchStories({type: fetchStories, payload: fetchStoriesState});
        const getAsyncStories = () => {
            let stories = otherStuff;
            if (id === 'tech') {
                stories = techStuff;
            }
            const timeOut = Math.floor(Math.random() * 4500);
            if (timeOut % 7) {
                return new Promise((resolve) => {
                    return setTimeout(() => {
                        console.info(`resolve, id: ${id}, time-out: ${timeOut}`);
                        return resolve({data: {stories, isLoading: false, loadError: false}});
                    }, timeOut);
                });
            } else {
                return new Promise((reject) => {
                    return setTimeout(() => {
                        console.error(`reject, id: ${id}, time-out: ${timeOut}`);
                        return reject(storiesErrorState);
                    }, timeOut);
                })
            }
        };
        getAsyncStories()
            .then(result => {
                console.debug('promise result: ', result);
                if (result && result.loadError) {
                    return dispatchStories({type: processFail, payload: result.data});
                } else {
                    return dispatchStories({type: processSuccess, payload: result.data});
                }
            })
            .catch(() => dispatchStories({type: processFail, payload: storiesErrorState}));
    }, [id]);

    return (
        <>
            <section>
                <LabeledInput value={itemFilter} onInputChange={handleFilterUpdate} hasFocus={hasFocus}>
                    <strong>Search:</strong>
                </LabeledInput>
            </section>
            <hr/>
            {
                stories.loadError ? (<section>error on loading</section>) :
                    stories.isLoading ? (<section>Loading ...</section>) : (
                        <section>
                            <List list={getStories()} deleteItem={removeItem}/>
                        </section>
                    )
            }
            <hr/>
            <aside>
                =-= {id} filter: &ldquo;{itemFilter}&rdquo; =-=
            </aside>
        </>
    );
}

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

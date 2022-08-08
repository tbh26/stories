import { useEffect, useRef, useState } from "react";

export const noFilter = '';

export const initialStories = [];

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

const Parent = ({id, hasFocus = false}) => {
    const key = `${id}.searchTerm`;
    const [list, updateList] = useState(initialStories);
    const [itemFilter, setItemFilter] = useStoredState(key, noFilter);
    const [isLoading, setIsLoading] = useState(false);

    const handleFilterUpdate = (event) => {
        const searchTerm = event.target.value
        setItemFilter(searchTerm);
    }

    function storiesFiltered() {
        if (itemFilter === noFilter) {
            return list;
        } else {
            return list.filter((story) => story.title.toLowerCase().includes(itemFilter.toLowerCase()));
        }
    }

    const removeItem = (id) => {
        const newList = list.filter((item) => (item.objectID !== id));
        updateList(newList);
    }

    useEffect(() => {
        setIsLoading(true);
        const getAsyncStories = () => {
            let stories = otherStuff;
            if (id === 'tech') {
                stories = techStuff;
            }
            return new Promise((resolve) => {
                const timeOut = Math.floor(Math.random() * 4500);
                return setTimeout(() => {
                    console.info(`id: ${id}, time-out: ${timeOut}`);
                    setIsLoading(false);
                    return resolve({data: {stories}});
                }, timeOut);
            });
        };
        getAsyncStories().then(result => updateList(result.data.stories));
    }, [id]);

    if (isLoading) {
        return <section>Loading ...</section>
    }

    return (
        <>
            <section>
                <LabeledInput value={itemFilter} onInputChange={handleFilterUpdate} hasFocus={hasFocus}>
                    <strong>Search:</strong>
                </LabeledInput>
            </section>
            <hr/>
            <section>
                <List list={storiesFiltered()} deleteItem={removeItem}/>
            </section>
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
    if (list.length === 0) {
        return (
            <section>
                <b>-</b>
            </section>
        );
    } else {
        return (
            <ul>
                {
                    list.map((item) => (
                        <Item key={item.objectID} item={item} purgeItem={deleteItem}/>
                    ))
                }
            </ul>
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

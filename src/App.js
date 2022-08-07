import {useEffect, useState} from "react";

export const noFilter = '';

const App = () => {

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
            title: 'Redux',
            url: 'https://redux.js.org/',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectID: 1,
        },
    ];

    const otherStuff = [
        {
            title: 'Reactie',
            url: 'https://example.org/',
            author: 'Jojo',
            num_comments: 7,
            points: 1,
            objectID: 5,
        },
        {
            title: 'Reductie',
            url: 'https://sale.org/',
            author: 'ac / dc',
            num_comments: 3,
            points: 12,
            objectID: 7,
        },
    ];

    function echoFun(mesg) {
        return mesg;
    }

    return (
        <main>

            <header>
                <h1>Hello {echoFun('react')} world.</h1>
            </header>

            <Parent itemslist={techStuff} id='tech' />

            <br/> <br/>

            <Parent itemslist={otherStuff} id='other' />

        </main>
    );
}

const Parent = (props) => {
    const items = props.itemslist;
    const id = props.id;
    const key = `${id}.searchTerm`;
    const [itemFilter, setItemFilter] = useState(localStorage.getItem(key) || noFilter);

    const handleFilterUpdate = (event) => {
        const searchTerm = event.target.value
        setItemFilter(searchTerm);
    }

    useEffect(() => {
        localStorage.setItem(key, itemFilter);
    }, [key, itemFilter])

    function storiesFiltered() {
        if (itemFilter === noFilter) {
            return items;
        } else {
            return items.filter((story) => story.title.toLowerCase().includes(itemFilter.toLowerCase()));
        }
    }

    return (
        <article>
            <section>
                <Search searchTerm={itemFilter} updateSearchTerm={handleFilterUpdate} />
            </section>
            <hr/>
            <section>
                <List list={storiesFiltered()}/>
            </section>
            <hr/>
            <aside>
                =-= {id} filter: &ldquo;{itemFilter}&rdquo; =-=
            </aside>
        </article>
    );
}

const Search = ({searchTerm, updateSearchTerm}) => (
    <label>
        search:
        <input type="text" value={searchTerm} onChange={updateSearchTerm}/>
    </label>
);


const List = ({list}) => (
    <ul>
        {
            list.map((item) => (
                <Item key={item.objectID} item={item} />
            ))
        }
    </ul>
);

const Item = ({ item }) => {
    const {
        url,
        title,
        author,
        num_comments,
        points
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
            <span>{points}</span>
        </li>
    );
};

export default App;

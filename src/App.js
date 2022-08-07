import {useState} from "react";


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
            <hr/>
            <Parent itemslist={techStuff}/>
            <hr/>
            <Parent itemslist={otherStuff}/>
            <hr/>
        </main>
    );
}

const Parent = (props) => {
    const items = props.itemslist;
    const [itemFilter, setItemFilter] = useState(noFilter);

    const handleFilterUpdate = (term) => {
        setItemFilter(term)
    }

    return (
        <article>
            <section>
                <Search updateSearchTerm={handleFilterUpdate}/>
            </section>
            <hr/>
            <section>
                <List list={items}/>
            </section>
            <hr/>
            <aside>
                items-filter: &ldquo;{itemFilter}&rdquo;
            </aside>
        </article>
    );
}

const Search = (props) => (
    <label>
        search:
        <input type="text" onChange={(e) => {
            props.updateSearchTerm(e.target.value);
        }}/>
    </label>
)


const List = (props) => (
    <ul>
        {props.list.map(item => (
            <Item key={item.objectID} item={item}/>
        ))}
    </ul>
);

const Item = (props) => {
    const item = props.item;
    return (
        <li>
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            <span>, author: </span>
            <span>{item.author}</span>
            <span>, # comments: </span>
            <span>{item.num_comments}</span>
            <span>, points: </span>
            <span>{item.points}</span>
        </li>
    );
};

export default App;

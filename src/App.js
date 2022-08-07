import {useState} from "react";

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

    function echoFun(mesg) {
        return mesg;
    }

    return (
        <main>
            <header>
                <h1>Hello {echoFun('react')} world.</h1>
            </header>
            <section>
                <Search/>
            </section>
            <hr/>
            <section>
                <List list={techStuff}/>
            </section>
            <hr/>
            <section>
                <List list={techStuff}/>
            </section>
            <hr/>
            <section>
                <Search/>
            </section>
        </main>
    );
}

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        console.debug('event; ', event);
        console.info(`event.target.value: ${event.target.value} `);
        setSearchTerm(event.target.value);
    };

    return (
        <section>
            <label>
                search:
                <input type="text" onChange={handleChange}/>
            </label>
            <aside>
                searching for: {searchTerm}
            </aside>
        </section>
    );
};

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

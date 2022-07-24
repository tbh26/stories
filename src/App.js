const list = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
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

const App = () => {
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
                <List/>
            </section>
            <hr/>
            <section>
                <List/>
            </section>
            <hr/>
            <section>
                <Search/>
            </section>
        </main>
    );
}

const Search = () => (
    <label>
        search:
        <input type="text"/>
    </label>
);

const List = () => (
    <ul>
        {list.map(item => (
                <li key={item.objectID}>
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
            )
        )
        }
    </ul>
);

export default App;

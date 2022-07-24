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

function App() {
    function echoFun(mesg) {
        return mesg;
    }

    return (
        <main>
            <header>
                <h1>Hello {echoFun('react 18')} world.</h1>
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

function Search() {
    return (
        <label>
            search:
            <input type="text"/>
        </label>
    );
}

function List() {
    return (
        <ul>
            {list.map(function (item) {
                return (
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
                );
            })}
        </ul>
    );
}

export default App;

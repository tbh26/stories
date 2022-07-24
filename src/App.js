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
                <h1>Hello {echoFun('react')} world.</h1>
            </header>
            <section>
                <label>
                    search
                    <input type="text"/>
                </label>
            </section>
            <section>
                <ul>
                    {list.map(function (item) {
                        return <li key={item.objectID}>{item.title}</li>;
                    })}
                </ul>
            </section>
        </main>
    );
}

export default App;

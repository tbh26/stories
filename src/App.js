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
        </main>
    );
}

export default App;

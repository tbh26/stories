
const m = { // message
    h: "Hello",
    r: "react",
    w: "world"
};

function App() {
  return (
    <main>
      <header>
        <h1>{m.h} {m.r} {m.w}.</h1>
      </header>
      <section>
            <label>
                search
                <input type="text" />
                (label around)
            </label>
      </section>
      <section>
          <label htmlFor="search2">search again (label above) </label>
          <input id="search2" type="text" />
      </section>
    </main>
  );
}

export default App;

import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"

export function Counter(): ReactElement {
  const [counter, setCounter] = useState(0)
  // const [focus, setFocus] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setTimeout( () => {
      // console.info({ focus })
      console.info('set (auto) focus')
      // setFocus(true)
      buttonRef.current?.focus()
    }, 531)
  }, [])

//  useEffect(() => { // async
  useLayoutEffect(() => { // sync
    if (buttonRef.current) {
      buttonRef.current.style.backgroundColor = "green"

    }
  }, [])

  return (
    <div>
      <div>Count: {counter}</div>
      <div>
        <button
          // autoFocus
          // autoFocus={true}
          ref={buttonRef}
          className="btn btn-primary"
          onClick={() => setCounter(counter + 1)}
        >
          Increment
        </button>
      </div>
    </div>
  )
}

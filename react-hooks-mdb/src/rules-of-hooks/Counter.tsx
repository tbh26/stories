import React, { ReactElement, useEffect, useRef, useState } from "react"

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

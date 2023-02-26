import * as localforage from "localforage"
import React, { ReactElement, useEffect, useRef, useState } from "react"

import { LabeledInput, Loading } from "../components"
import { usePerson } from "../hooks/usePerson"
import { Person } from "../types/person"
import { initialPerson } from "../utils"

function savePerson(person: Person | null): void {
  console.info(`saving person: ${person}`)
  localforage.setItem("person", person)
}

export function PersonEditor(): ReactElement {
  // const person = initialPerson
  // const [person, setPerson] = useState(initialPerson)
  // const [person, setPerson] = useState<Person | null>(initialPerson)
  const [person, setPerson] = usePerson(initialPerson)
  const firstInput = useRef<HTMLInputElement>()

  useEffect(() => {
    setTimeout(() => {
      firstInput.current?.focus()
    }, 531)

  }, [])

  // useEffect(() => {
  //   const getPerson = async () => {
  //     const person = await localforage.getItem<Person>("person")
  //     setPerson(person ?? initialPerson)
  //   }
  //
  //   getPerson()
  // }, [])
  //
  // useEffect(() => {
  //   savePerson(person)
  // }, [person])
  //
  if (!person) return <Loading/>

  return (
    <form
      className="person-editor"
      onSubmit={(e) => {
        e.preventDefault()
        alert(`Submitting\n${JSON.stringify(person, null, 2)}`)
      }}
    >
      <h2>Person Editor</h2>
      <LabeledInput
        ref={firstInput}
        label="Firstname:"
        value={person.firstname}
        onChange={(e) => {
          const newPerson = {
            ...person,
            firstname: e.target.value,
          }
          console.log("Updated person:", newPerson)
          setPerson(newPerson)
          if (newPerson.firstname === "Pipo") {
            setPerson((state) => {
              const newState = {
                ...state!,
                surname: "de Clown",
                phone: '012 9753 468'
              }
              return newState
            })
          }
        }}
      />
      <LabeledInput
        label="Surname:"
        value={person.surname}
        onChange={(e) => {
          const newPerson = { ...person, surname: e.target.value }
          console.log("Updated person:", newPerson)
          setPerson(newPerson)
        }}
      />
      <LabeledInput
        label="Email:"
        value={person.email}
        onChange={(e) => {
          const newPerson = { ...person, email: e.target.value }
          console.log("Updated person:", newPerson)
          setPerson(newPerson)
        }}
      />
      <LabeledInput
        label="Address:"
        value={person.address}
        onChange={(e) => {
          const newPerson = { ...person, address: e.target.value }
          console.log("Updated person:", newPerson)
          setPerson(newPerson)
        }}
      />
      <LabeledInput
        label="Phone:"
        value={person.phone}
        onChange={(e) => {
          const newPerson = { ...person, phone: e.target.value }
          console.log("Updated person:", newPerson)
          setPerson(newPerson)
        }}
      />
      <hr />
      <div className="btn-group">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
      <hr />
      <pre>{JSON.stringify(person, null, 2)}</pre>
    </form>
  )
}

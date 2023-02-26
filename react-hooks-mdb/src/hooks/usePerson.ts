import localforage from "localforage"
import { useEffect, useState } from "react"
import { Person } from "../types/person"
import { initialPerson } from "../utils"


function savePerson(person: Person | null): void {
  console.info(`saving person: ${person}`)
  localforage.setItem("person", person)
}

export function usePerson(initialPerson: Person) {
  const [person, setPerson] = useState<Person | null>(initialPerson)

  useEffect(() => {
    const getPerson = async () => {
      const person = await localforage.getItem<Person>("person")
      setPerson(person ?? initialPerson)
    }

    getPerson()
  }, [initialPerson])

  useEffect(() => {
    savePerson(person)
  }, [person])

  return [person, setPerson] as const
}

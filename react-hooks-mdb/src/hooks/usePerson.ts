import localforage from "localforage"
import { useEffect, useState } from "react"
import { Person } from "../types/person"
//import { initialPerson } from "../utils"
import { sleep } from "../utils"
import { useIsMounted } from "./useIsMounted"


function savePerson(person: Person | null): void {
  console.info(`saving person: ${person}`)
  localforage.setItem("person", person)
}

export function usePerson(initialPerson: Person) {
  const [person, setPerson] = useState<Person | null>(initialPerson)
  const isMounted = useIsMounted()

  useEffect(() => {
    const getPerson = async () => {
      const person = await localforage.getItem<Person>("person")
      await sleep(700)   // tobe commented
      if (isMounted.current) {
        setPerson(person ?? initialPerson)
      }
    }

    getPerson()
  }, [initialPerson, isMounted])

  useEffect(() => {
    savePerson(person)
  }, [person])

  return [person, setPerson] as const
}

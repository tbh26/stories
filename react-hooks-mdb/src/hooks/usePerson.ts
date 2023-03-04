import localforage from "localforage"
import { useEffect, useState } from "react"
import { Person } from "../types/person"
//import { initialPerson } from "../utils"
import { sleep } from "../utils"
import { useIsMounted } from "./useIsMounted"
import { useDebounce } from "./useDebounce"


function savePerson(person: Person | null): void {
  console.info('saving', { person } )
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

  useDebounce(() => {
    savePerson(person)
  }, 1234)

  return [person, setPerson] as const
}

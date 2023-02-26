import { useEffect, useRef, useState } from "react";
import { Story } from "../Data";

export function useStoredState(key: string, initialState: string): [string, (newValue: string) => void] {
    const isMounted = useRef(false);

    const [value, setValue] = useState(localStorage.getItem(key) || initialState);

    useEffect(() => {
        if (!isMounted.current) {
            console.debug(`useStoredState, skip initial render.   (key: ${key})`);
            isMounted.current = true;
        } else {
            console.debug(`useStoredState, key: ${key}, value: ${value}`);
            localStorage.setItem(key, value);
        }
    }, [key, value])

    return [value, setValue];
}

export function getSumComments(stories: { data: Story[] }): number {
    const commentsCount = stories.data.reduce((result, value) => result + value.num_comments, 0);
    console.debug('getSumComments count:', commentsCount);
    return commentsCount;
}

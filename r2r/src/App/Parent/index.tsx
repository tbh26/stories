import React, { useCallback, useMemo, useReducer } from "react";
import {
    fetchStories,
    fetchStoriesState,
    initialStoriesState, processFail,
    processSuccess,
    removeStory, storiesErrorState,
    storiesReducer
} from "../storiesReducer";
import { hnBaseApi, noItem, Story } from "../Data";
import axios from "axios";
import { getSumComments, useStoredState } from "../util";
import { List } from "../ListAndItem";
import { SearchForm } from "../Search";

export type ParentProps = {
    id: string;
    hasFocus?: boolean;
}

export const Parent = ({id, hasFocus = false}: ParentProps) => {
    const key = `${id}.searchTerm`;
    const [stories, dispatchStories] = useReducer(storiesReducer, initialStoriesState);
    const [inputItem, setInputItem] = useStoredState(key, noItem);

    console.debug(`Parent component.   (id: ${id}) `);

    const handleFilterUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        // console.debug('keyChange event: ', event);
        console.debug('keyChange (event) search-term: ', searchTerm);
        setInputItem(searchTerm);
    }

    function getStories(): Story[] {
        return stories.data;
    }

    const removeItem = useCallback((id: number) => {
        console.debug(`remove story with id: ${id}.`);
        dispatchStories({type: removeStory, payload: {objectID: id}});
    }, []);

    const handleFetchStories = useCallback(async () => {
        dispatchStories({type: fetchStories, payload: fetchStoriesState});
        let hnUrl = `${hnBaseApi}/search`;
        if (inputItem !== noItem) {
            hnUrl = `${hnBaseApi}/search?query=${inputItem}`;
        }
        try {
            const newStoriesState = {...initialStoriesState};
            const result = await axios.get(hnUrl);
            console.info(`hn api ${id} result:`, result);
            newStoriesState.data = result.data.hits;
            dispatchStories({type: processSuccess, payload: newStoriesState});
        } catch {
            dispatchStories({type: processFail, payload: storiesErrorState});
        }
    }, [inputItem, id]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetchStories();
    }

    const sumComments = useMemo(() => getSumComments(stories), [stories]);

    return (
        <>
            <hr/>
            <SearchForm inputItem={inputItem}
                        filterUpdate={handleFilterUpdate}
                        searchSubmit={handleSearchSubmit}
                        hasFocus={hasFocus}/>
            <br/>
            {
                stories.loadError ? (<section>error on loading</section>) :
                    stories.isLoading ? (<section>Loading ...</section>) : (
                        <section>
                            <List list={getStories()} deleteItem={removeItem}/>
                        </section>
                    )
            }
            <br/>
            <aside>
                == {id} filter: &ldquo;{inputItem}&rdquo;, # total comments: {sumComments} ==
            </aside>
            <hr/>
        </>
    );
}

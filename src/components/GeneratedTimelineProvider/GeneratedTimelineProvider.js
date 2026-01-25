"use client"
import { createContext } from "react"
import useLocalStorage from "@/hooks/useLocalStorage";

export const GeneratedTimelineContext = createContext();

function GeneratedTimelineProvider({ children }) {
    const [timelines, setTimelines] = useLocalStorage("timelines", [])

    const addTimeline = (timeline) => {
        setTimelines(prev => [timeline, ...prev]);
    };

    const deleteTimeline = (index) => {
        setTimelines(prev => prev.filter((_, i) => i !== index));
    };

    const uploadTimeline = (timeline) => {
        setTimelines(prev => [timeline, ...prev]);
    };

    const updateTimeline = (index, updatedTimeline) => {
        setTimelines(prev => prev.map((t, i) => i === index ? updatedTimeline : t));
    };

    // Get the most recent timeline (first in array)
    const latestTimeline = timelines && timelines.length > 0 ? timelines[0] : null;

    return (
        <GeneratedTimelineContext.Provider value={{
            timelines,
            setTimelines,
            addTimeline,
            deleteTimeline,
            uploadTimeline,
            updateTimeline,
            latestTimeline
        }}>
            {children}
        </GeneratedTimelineContext.Provider>
    )
}

export default GeneratedTimelineProvider;
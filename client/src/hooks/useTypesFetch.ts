import { useEffect, useState } from "react";

export type ValueProcessor = (value: string) => string | string[]
export type Sorter = Parameters<Array<string>["sort"]>[0]

export function useTypesFetch(category: string, type: string, valueProcessor?: ValueProcessor, sorter?: Sorter): [string[], boolean] {
    const [types, setTypes] = useState<string[]>([])
    const [fetched, setFetched] = useState(false)
    useEffect(() => {
        fetch(`/api/${category}/types/${type}`)
            .then(res => res.json(), error => console.error(`Failed to fetch '${type}' types:\n${error}`))
            .then((data: string[]) => {
                if (valueProcessor) {
                    data = [...new Set(data.map(valueProcessor).flat())]
                }
                if (sorter) {
                    data = data.sort(sorter)
                }
                setTypes(data)
                setFetched(true)
            })
    }, [])
    return [types, fetched]
}
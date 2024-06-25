import { useState } from "react"

function useUpdateableState<T>(defaultValue: T): [T, (newValues?: Partial<T>) => void] {
    const [value, setValue] = useState<T>(defaultValue)
    const updateValue = (newValues?: Partial<T>) => {
        setValue(oldValue => newValues ? ({ ...oldValue, ...newValues }) : {...oldValue})
    }
    return [value, updateValue]
}

export default useUpdateableState
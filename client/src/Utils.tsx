function displayString(internal: string): string {
    return internal[0].toUpperCase() + internal.slice(1).replace("_", " ")
}

function before(str: string, before: string): string {
    const index = str.indexOf(before);
    return index == -1 ? str : str.substring(0, index);
}

export default {displayString, before}
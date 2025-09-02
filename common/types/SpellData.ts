export default interface SpellData {
    level: number;
    name: string;
    school: string;
    source: string;
    casting_time: string;
    range: string;
    components: string[];
    duration: string;
    description: string;
    spell_lists: string[];
}

const SPELL_DATA_KEYS = new Set(["level", "name", "school", "source", "casting_time", "range", "components", "duration", "description", "spell_lists"])
export type SpellDataKey = keyof SpellData

export function isValidSpellDataKey(key: string): key is SpellDataKey {
    return SPELL_DATA_KEYS.has(key)
}

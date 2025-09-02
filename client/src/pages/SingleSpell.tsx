import { Button } from "react-bootstrap";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import Spell from "../components/Spell.tsx";
import SpellData from "../../../common/types/SpellData.ts";

export async function spellLoader({ params }: LoaderFunctionArgs) {
    return fetch("/api/spells/" + params.spell).then(res => res.json());
}

function SingleSpell() {
    const spell = useLoaderData() as SpellData;
    return (
        <>
            <title>{spell.name}</title>
            <Spell spell={spell} />
            <Button href="/spells">Back</Button>
        </>
    );
}

export default SingleSpell;

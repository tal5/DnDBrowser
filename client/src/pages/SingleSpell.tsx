import { Button } from "react-bootstrap";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import Spell from "../components/Spell.tsx";

export async function spellLoader({ params }: LoaderFunctionArgs) {
    return fetch("/api/spells/" + params.spell).then(res => res.json());
}

function SingleSpell() {
    const spell = useLoaderData() as Record<string, any>;
    return (
        <>
            <title>{spell.name}</title>
            <Spell spell={spell} />
            <Button href="/spells">Back</Button>
        </>
    );
}

export default SingleSpell;

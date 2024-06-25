import { Button } from "react-bootstrap";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export async function spellLoader({ params }: LoaderFunctionArgs) {
  return fetch("/api/spell/" + params.spell).then(res => res.json());
}

function Spell() {
  const spell = useLoaderData() as Record<string, any>;
  return (
    <>
      <p>Name: {spell.name}</p>
      <p>Level: {spell.level}</p>
      <p>Source: {spell.source}</p>
      <p>School: {spell.school}</p>
      <p>Casting time: {spell.casting_time}</p>
      <p>Range: {spell.range}</p>
      <p>Components: {JSON.parse(spell.components).join(", ")}</p>
      <p>Duration: {spell.duration}</p>
      <h6>Description:</h6>
      <div dangerouslySetInnerHTML={{ __html: spell.description }} />
      <p>Spell lists: {JSON.parse(spell.spell_lists).join(", ")}</p>
      <Button href="/spells">Back</Button>
    </>
  );
}

export default Spell;

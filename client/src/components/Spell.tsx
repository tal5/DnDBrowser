import SpellData from "../../../common/types/SpellData.ts";

interface Props {
    spell: SpellData
}

function Spell({spell}: Props) {
  return (
    <>
      <p>Name: {spell.name}</p>
      <p>Level: {spell.level}</p>
      <p>Source: {spell.source}</p>
      <p>School: {spell.school}</p>
      <p>Casting time: {spell.casting_time}</p>
      <p>Range: {spell.range}</p>
      <p>Components: {spell.components.join(", ")}</p>
      <p>Duration: {spell.duration}</p>
      <h6>Description:</h6>
      <div dangerouslySetInnerHTML={{ __html: spell.description }} />
      <p>Spell lists: {spell.spell_lists.join(", ")}</p>
    </>
  );
}

export default Spell;

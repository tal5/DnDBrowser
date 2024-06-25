import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";

interface Props {
  spells: any[];
}

function SpellsAccordion(props: Props) {
  if (props.spells.length == 0) {
    return <p>No spells found!</p>
  }
  return (
    <Accordion>
      {props.spells.map((spell, index) => (
        <Accordion.Item key={index} eventKey={index.toString()}>
          <Accordion.Header className={index % 2 == 0 ? "graySpells" : ""}>{spell.name}</Accordion.Header>
          <Accordion.Body>
            <p>Level: {spell.level}</p>
            <p>Source: {spell.source}</p>
            <p>School: {spell.school}</p>
            <p>Casting time: {spell.casting_time}</p>
            <p>Range: {spell.range}</p>
            <p>Components: {JSON.parse(spell.components).join(", ")}</p>
            <p>Duration: {spell.duration}</p>
            <h6>Description:</h6>
            <div dangerouslySetInnerHTML={{__html: spell.description}}/>
            <p>Spell lists: {JSON.parse(spell.spell_lists).join(", ")}</p>
            <Button href={"/spell/" + spell.name}>Open</Button>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default SpellsAccordion;

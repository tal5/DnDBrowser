import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Spell from "./Spell.tsx";

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
            <Spell spell={spell} />
            <Button href={"/spell/" + spell.name}>Open</Button>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default SpellsAccordion;

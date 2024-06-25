import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import * as Filter from "../Filter";
import Utils from "../Utils";
import SpellsAccordion from "../components/SpellsAccordion";
import { useSearchParams } from "react-router-dom";

function SpellBrowser() {
  const [spells, setSpells] = useState<[] | null>(null);
  const rawSearchParams = useSearchParams();
  const [searchParams] = rawSearchParams;

  useEffect(() => {
    fetch("/api/spells?" + searchParams)
      .then((res) => res.json())
      .then(setSpells);
  }, [searchParams]);

  return (
    <Container fluid>
      <Row>
        <Col xs="auto">{Filter.createChecklist("level", rawSearchParams)}</Col>
        <Col xs="auto">{Filter.createChecklist("school", rawSearchParams)}</Col>
        <Col xs="auto">
          {Filter.createChecklist("casting_time", rawSearchParams, (value) =>
            Utils.before(value, ",")
          )}
        </Col>
        <Col xs="auto">
          {Filter.createChecklist(
            "source",
            rawSearchParams,
            (value) => value.split("/"),
            (a, b) => {
              const aStarts = a.startsWith("Unearthed Arcana");
              const bStarts = b.startsWith("Unearthed Arcana");
              if (aStarts && !bStarts) {
                return 1;
              }
              if (!aStarts && bStarts) {
                return -1;
              }
              return 0;
            }
          )}
        </Col>
        <Col xs="auto">
          {Filter.createChecklist("spell_lists", rawSearchParams, (value) =>
            JSON.parse(value).map((option: string) =>
              Utils.before(option, " (Optional)")
            )
          )}
        </Col>
        <Col xs="auto">
          {Filter.createChecklist("duration", rawSearchParams)}
        </Col>
        <Col xs="auto">{Filter.createChecklist("range", rawSearchParams)}</Col>
        <Col xs="auto">
          {Filter.createChecklist("components", rawSearchParams, (value) =>
            JSON.parse(value)
              .map((option: string) => Utils.before(option, " ("))
              .filter((option: string) => option.length == 1)
          )}
        </Col>
      </Row>
      <Row>{spells && <SpellsAccordion spells={spells} />}</Row>
    </Container>
  );
}

export default SpellBrowser;

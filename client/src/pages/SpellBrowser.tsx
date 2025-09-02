import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import * as Filter from "../Filter";
import Utils from "../Utils";
import SpellsAccordion from "../components/SpellsAccordion";
import { useSearchParams } from "react-router-dom";

type ExcludeFirst<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? Rest : []


function createChecklist(...params: ExcludeFirst<Parameters<typeof Filter.createChecklist>>): ReturnType<typeof Filter.createChecklist> {
  return Filter.createChecklist("spells", ...params)
}

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
        <Col xs="auto">{createChecklist("level", rawSearchParams)}</Col>
        <Col xs="auto">{createChecklist("school", rawSearchParams)}</Col>
        <Col xs="auto">
          {createChecklist("casting_time", rawSearchParams, (value) =>
            Utils.before(value, ",")
          )}
        </Col>
        <Col xs="auto">
          {createChecklist(
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
          {createChecklist("spell_lists", rawSearchParams, (value) =>
            Utils.before(value, " (Optional)")
          )}
        </Col>
        <Col xs="auto">
          {createChecklist("duration", rawSearchParams)}
        </Col>
        <Col xs="auto">{createChecklist("range", rawSearchParams)}</Col>
        <Col xs="auto">
          {createChecklist("components", rawSearchParams, (value) =>
            Utils.before(value, " (")
          )}
        </Col>
      </Row>
      <Row>{spells && <SpellsAccordion spells={spells} />}</Row>
    </Container>
  );
}

export default SpellBrowser;

import { PlaceholderButton } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";

interface Props {
  title: string;
  values: string[] | undefined;
  checkedValues: Set<string> | undefined;
  onSelect: (selected: string) => void;
  onRemove: (removed: string) => void;
}

function Checklist(props: Props) {
  if (!props.values) {
    return <PlaceholderButton xs={10} />;
  }
  return (
    <DropdownButton title={props.title}>
      {props.values.map((value, index) => (
        <div key={index} className="checklist-wrapper">
          <Form.Check
            checked={props.checkedValues?.has(value) ?? false}
            label={value}
            className="checklist-check"
            onChange={(event) =>
              event.target.checked
                ? props.onSelect(value)
                : props.onRemove(value)
            }
          />
        </div>
      ))}
    </DropdownButton>
  );
}

/*
interface Props {
  id: keyof StringArrayParams;
  filter: ReturnType<typeof useUpdateableState<Filter>>;
  valueProcessor?: (value: string) => string | string[];
  sorter?: Parameters<Array<string>["sort"]>[0];
}

function Checklist(props: Props) {
  const id = props.id;
  const [types, hasTypes] = useTypesFetch(
    id,
    props.valueProcessor,
    props.sorter
  );
  if (!hasTypes) {
    return <Placeholder.Button xs={10} />;
  }
  const [filter, updateFilter] = props.filter;
  const name = Utils.displayString(props.id) + ": ";
  const values = () => filter[id];
  return (
    <DropdownButton
      title={name + (values().length > 0 ? values().join(", ") : "Any")}
    >
      {types.map((option, index) => (
        <div className="checklist-wrapper">
          <Form.Check
            key={index}
            label={option}
            className="checklist-check"
            onChange={(event) => {
              if (event.target.checked) {
                updateFilter({ [id]: [option, ...filter[id]] });
              } else {
                values().splice(values().indexOf(option), 1);
                updateFilter();
              }
            }}
          />
        </div>
      ))}
    </DropdownButton>
  );
}
*/

export default Checklist;

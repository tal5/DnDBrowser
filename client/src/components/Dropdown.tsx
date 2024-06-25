import DropdownButton from "react-bootstrap/DropdownButton";
import InternalDropdown from "react-bootstrap/Dropdown";
import useUpdateableState from "../hooks/useUpdateableState";
import Filter from "../Filter";
import useTypesFetch from "../hooks/useTypesFetch";
import Utils from "../Utils"

interface Props {
  id: keyof Filter;
  filter: ReturnType<typeof useUpdateableState<Filter>>
}

function Dropdown(props: Props) {
  const id = props.id
  const [types, hasTypes] = useTypesFetch(id)
  if (!hasTypes) {
    return <p>Loading...</p>
  }
  const [filter, updateFilter] = props.filter
  const name = Utils.displayString(props.id) + ": "
  return (
    <DropdownButton
      title={name + filter[id]}
      onSelect={value => updateFilter({[id]: value})}
    >
      {types.map((value, index) =>
        <InternalDropdown.Item key={index} eventKey={value}>{value}</InternalDropdown.Item>
      )}
    </DropdownButton>
  );
}

export default Dropdown;

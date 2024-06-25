interface Props {
  spells: any[]
}

function ListGroup(props: Props) {
  return (
    <>
      <h1>Spells</h1>
      <ul className="list-group">
        {props.spells.map((spell, index) => (
          <li
            key={index}
            className="list-group-item"
          >
            {spell.name}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;

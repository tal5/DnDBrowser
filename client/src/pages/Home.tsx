import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return <Button onClick={_ => navigate("/spells")}>Spells</Button>
}

export default Home;
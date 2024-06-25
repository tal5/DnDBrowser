import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import SpellBrowser from "./pages/SpellBrowser";
import Spell, {spellLoader} from "./pages/Spell";
import Home from "./pages/Home";

const router = createBrowserRouter([
    {
      path: "/",
      Component: Outlet,
      children: [
        {
          index: true,
          Component: Home
        },
        {
          path: "spells",
          Component: SpellBrowser,
        },
        {
          path: "spell/:spell",
          Component: Spell,
          loader: spellLoader
        }
      ]
    }
  ])

function App() {
  return <RouterProvider router={router}/>
}

export default App;

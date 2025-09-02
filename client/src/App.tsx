import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import SpellBrowser from "./pages/SpellBrowser";
import SingleSpell, {spellLoader} from "./pages/SingleSpell.tsx";
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
          Component: SingleSpell,
          loader: spellLoader
        }
      ]
    }
  ])

function App() {
  return <RouterProvider router={router}/>
}

export default App;

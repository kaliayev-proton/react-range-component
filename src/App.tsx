import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Exercise1 } from "./components/Exercise1";
import { Exercise2 } from "./components/Exercise2";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/exercise1">Exercise 1</Link>
          </li>
          <li>
            <Link to="/exercise2">Exercise 2</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/exercise1" element={<Exercise1 />} />
        <Route path="/exercise2" element={<Exercise2 />} />
      </Routes>
    </Router>
  );
}

export default App;

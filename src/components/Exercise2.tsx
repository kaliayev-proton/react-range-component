import { useEffect, useState } from "react";
import { Range } from "../stories";

export const Exercise2 = () => {
  const [dataExercise, setDataExercise] = useState([0, 0]);
  useEffect(() => {
    fetch("http://demo6947846.mockable.io/exercise2")
      .then((response) => response.json())
      .then((data) => setDataExercise([data.min, data.max]));
  }, []);
  return (
    <div>
      <Range range={dataExercise} />
    </div>
  );
};

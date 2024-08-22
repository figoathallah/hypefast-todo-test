import { FC } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Todo from "./App";
const { PUBLIC_URL } = process.env;

const appRoutes: FC = () => {
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route
          path="/"
          element={<Todo id={0} title={""} status={false} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default appRoutes;

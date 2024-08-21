import { FC, useState, useEffect } from "react";

interface TodoProps {
  title: string;
  status: boolean;
}

const Todo: FC<TodoProps> = ({ title, status }) => {
  const [formData, setFormData] = useState<TodoProps>({
    title,
    status,
  });

  const [buttonVisible, setButtonVisible] = useState<boolean>(true);
  const [todos, setTodos] = useState([]);

  const apiUrl = "http://localhost:8000/api/todos/";

  const handleButtonVisibility = () => {
    setButtonVisible((prevVisible) => !prevVisible);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!handleValidation) {
      console.log("Nope, try again");
    } else {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setTodos(data);
      }
    }
  };

  const handleValidation = (): boolean => {
    const form = document.getElementById("todoItem") as HTMLFormElement;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setTodos(data);
    };
    fetchData();
  }, [apiUrl]);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div
          className="d-flex justify-content-between align-items-center mt-5"
          style={{ width: "40%" }}
        >
          <p className="fw-bold mb-10">Things you should be doing today...</p>
          <div>
            <button
              className="btn btn-primary mx-2"
              data-bs-toggle="collapse"
              data-bs-target="#todoInput"
              aria-expanded="false"
              aria-controls="todoInput"
              onClick={handleButtonVisibility}
              disabled={!buttonVisible}
            >
              Add New
            </button>
            <button className="btn btn-danger ms-2">Clear</button>
          </div>
        </div>

        <div className="collapse mt-5" style={{ width: "40%" }} id="todoInput">
          <div className="d-flex justify-content-between align-items-center">
            <form id="todoItem" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                onChange={handleChange}
                required
              ></input>
            </form>
            <div>
              <button
                className="btn btn-primary mx-2"
                data-bs-toggle="collapse"
                data-bs-target="#todoInput"
                aria-expanded="false"
                aria-controls="todoInput"
                onClick={handleButtonVisibility}
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                className="btn btn-primary ms-2"
                type="submit"
                form="todoItem"
                onClick={handleValidation}
              >
                Create
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          {todos.length > 0 ? (
            <div
              className="row mb-3 mt-3"
              style={{ width: "100%", maxWidth: "550px" }}
            >
              {todos.map((todo) => (
                <div
                  className="card card-custom card-rounded card-p shadow mt-3"
                  style={{ width: "100%", minWidth: "550px" }}
                >
                  <p>{todo["title"]}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="card card-custom card-rounded card-p shadow mt-4"
              style={{ width: "100%", maxWidth: "550px" }}
            >
              <div className="d-flex justify-content-center">
                <p className="mt-5 mb-5">Nothing to do yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Todo;

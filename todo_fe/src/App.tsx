import { FC, useState, useEffect, useRef } from "react";

interface TodoProps {
  id: number;
  title: string;
  status: boolean;
}

const Todo: FC<TodoProps> = ({ id, title, status }) => {
  const [formData, setFormData] = useState<TodoProps>({
    id,
    title,
    status,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const [buttonVisible, setButtonVisible] = useState<boolean>(true);
  const [todos, setTodos] = useState<TodoProps[]>([]);

  const apiUrl = "http://localhost:8000/api/todos/";

  function getCookie(name: string): string | undefined {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
    return cookieValue || undefined;
  }
  const csrfToken = getCookie("csrftoken");

  const handleButtonVisibility = () => {
    setButtonVisible((prevVisible) => !prevVisible);
    if (buttonVisible) {
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  const handleStatus = async (id: number) => {
    const currentTodo = todos.find((todo) => todo.id === id);
    if (!currentTodo) return;
    const updatedStatus = !currentTodo.status;
    const response = await fetch(apiUrl + `${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body: JSON.stringify({ title: currentTodo.title, status: updatedStatus }),
    });

    if (response.ok) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, status: updatedStatus } : todo
        )
      );
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(apiUrl + `${id}/`, {
      method: "DELETE",
      headers: {
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
    });
    if (response.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const handleClearAll = async () => {
    const response = await fetch(apiUrl + "clear/", {
      method: "DELETE",
      headers: {
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
    });
    if (response.ok) {
      setTodos([]);
    }
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

    const getTodoItem = async () => {
      if (formData.id) {
        const response = await fetch(apiUrl + `${formData.id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            ...data,
            title: data.title,
            status: data.status,
          });
        }
      }
    };
    getTodoItem();
  }, [apiUrl, formData.id]);

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
            <button
              className="btn btn-danger ms-2"
              data-bs-toggle="modal"
              data-bs-target="#clearAllConfirm"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="collapse mt-5" style={{ width: "40%" }} id="todoInput">
          <div className="d-flex justify-content-between align-items-center">
            <form id="todoItem" ref={formRef} onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                onChange={handleChange}
                required
                style={{ width: "160%" }}
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
                  key={todo.id}
                  className="card card-custom card-rounded card-p shadow mt-3"
                  style={{ width: "100%", minWidth: "550px" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-start">
                      <i
                        className="mb-2 mt-2"
                        onClick={() => handleStatus(todo.id)}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.cursor = "pointer")
                        }
                      >
                        {todo.status ? (
                          <img
                            src="/check-green.png"
                            alt="check"
                            style={{ width: "90%" }}
                          />
                        ) : (
                          <img
                            src="/check.png"
                            alt="check"
                            style={{ width: "90%" }}
                          />
                        )}
                      </i>
                      <p className="mx-2 mt-2">{todo["title"]}</p>
                    </div>
                    <i
                      onClick={() => handleDelete(todo.id)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.cursor = "pointer")
                      }
                    >
                      <img src="/dash-circle.svg" alt="delete" />
                    </i>
                  </div>
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

      <div className="modal fade" tabIndex={-1} id="clearAllConfirm">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"> Confirm deletion </h5>
            </div>
            <div className="modal-body">
              <p>Confirm to clear all todos?</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary ms-2"
                data-bs-dismiss="modal"
              >
                <span>Cancel</span>
              </button>
              <button
                className="btn btn-danger ms-2"
                data-bs-dismiss="modal"
                onClick={handleClearAll}
              >
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;

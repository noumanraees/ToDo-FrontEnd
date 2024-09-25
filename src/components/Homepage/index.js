import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "low",
  });

  const fetchUser = async () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  };

  const fetchTasks = async () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/tasks/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTasks(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddTask = async () => {
    console.log("New Task Data: ", newTask);
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "/tasks/create",
        newTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/delete`,
        {
          taskId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // const handleEditTask = async (taskId, updatedTaskData) => {
  //   try {
  //     const res = await axios.put(
  //       `${process.env.REACT_APP_API_URL}/tasks/${taskId}`,
  //       updatedTaskData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     const updatedTasks = tasks.map((task) =>
  //       task._id === taskId ? res.data.data : task
  //     );
  //     setTasks(updatedTasks);
  //   } catch (err) {
  //     console.error("Error updating task:", err);
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    !localStorage.getItem("token") && navigate("/login");
    fetchUser();
    fetchTasks();
    console.log("Tasks: ", tasks);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {user.name}</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.taskSection}>
        <h2 style={styles.subTitle}>Task List</h2>
        {tasks.length > 0 ? (
          <ul style={styles.taskList}>
            {tasks.map((task) => (
              <li key={task._id} style={styles.taskItem}>
                <span style={styles.taskText}>
                  <strong>{task.title}</strong> - {task.description} - -{" "}
                  {task.priority} -{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noTaskText}>No tasks added yet.</p>
        )}
      </div>

      <div style={styles.formSection}>
        <h3>Add New Task</h3>
        <form style={styles.form}>
          <input
            type="text"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={styles.input}
          />
          <textarea
            placeholder="Enter task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            style={styles.textarea}
          />
          <label>Priority: </label>
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            style={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <br />
          <label>Deadline: </label>
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) =>
              setNewTask({ ...newTask, deadline: e.target.value })
            }
            style={styles.input}
          />
          <br />
          <button
            type="button"
            onClick={handleAddTask}
            style={styles.addButton}
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
export default Homepage;

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f7f7f7",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    color: "#333",
    fontSize: "24px",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  taskSection: {
    marginBottom: "30px",
  },
  subTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "10px",
  },
  taskList: {
    listStyleType: "none",
    padding: 0,
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "20px",
  },
  formSection: {
    marginTop: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  select: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

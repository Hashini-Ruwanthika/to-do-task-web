import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { taskApi } from "./api/taskApi";
import { Task } from "./types/task";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (title: string, description: string) => {
    try {
      setError(null);
      const newTask = await taskApi.createTask(title, description);
      // Prepend new task and keep only latest 5
      setTasks((prev: Task[]) => [newTask, ...prev].slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      setError(null);
      await taskApi.completeTask(id);
      // Remove completed task from UI
      setTasks((prev: Task[]) => prev.filter((t: Task) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete task");
    }
  };

  if (loading) {
    return <div className="app-container">Loading...</div>;
  }

  return (
    <div className="app-container">
      {error && <div className="error-message">{error}</div>}
      <div className="app-content">
        <div className="form-section">
          <TaskForm onSubmit={handleCreate} />
        </div>
        <div className="list-section">
          <TaskList tasks={tasks} onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}

export default App;

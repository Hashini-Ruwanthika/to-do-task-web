import { Task } from '../types/task'
import './TaskCard.css'

interface TaskCardProps {
  task: Task
  onComplete: (id: number) => void
}

function TaskCard({ task, onComplete }: TaskCardProps) {
  const handleComplete = () => {
    onComplete(task.id)
  }

  return (
    <div className="task-card">
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
      </div>
      <button className="done-button" onClick={handleComplete}>
        Done
      </button>
    </div>
  )
}

export default TaskCard


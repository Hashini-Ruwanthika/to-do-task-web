import TaskCard from './TaskCard'
import { Task } from '../types/task'
import './TaskList.css'

interface TaskListProps {
  tasks: Task[]
  onComplete: (id: number) => void
}

function TaskList({ tasks, onComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <h2>To-Do Tasks</h2>
        <p className="empty-message">No tasks yet. Create your first task!</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      <h2>To-Do Tasks</h2>
      <div className="task-cards">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={onComplete} />
        ))}
      </div>
    </div>
  )
}

export default TaskList


import { useState, FormEvent } from 'react'
import './TaskForm.css'

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void
}

function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !description.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(title.trim(), description.trim())
      setTitle('')
      setDescription('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="task-form">
      <h2>Add a Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  )
}

export default TaskForm


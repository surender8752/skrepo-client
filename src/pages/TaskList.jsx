import React, { useEffect, useState } from 'react'
import axios from '../api/axiosInstance'
import TaskCard from '../components/TaskCard'
import { Link } from 'react-router-dom'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete task?')) return
    try {
      await axios.delete(`/tasks/${id}`)
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="center">Loading...</div>

  return (
    <div>
      <div className="page-header">
        <h2>Your Tasks</h2>
        <Link to="/tasks/add" className="btn">Add Task</Link>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet. Create one!</p>
      ) : (
        <div className="tasks-grid">
          {tasks.map(t => (
            <TaskCard key={t._id} task={t} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

// import React, { useEffect, useState } from 'react'
// import axios from '../api/axiosInstance'
// import TaskCard from '../components/TaskCard'
// import { Link } from 'react-router-dom'

// export default function TaskList() {
//   const [tasks, setTasks] = useState([])
//   const [loading, setLoading] = useState(true)

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get('/tasks')
//       setTasks(res.data)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { fetchTasks() }, [])

//   const handleDelete = async (id) => {
//     if (!confirm('Delete task?')) return
//     try {
//       await axios.delete(`/tasks/${id}`)
//       setTasks(tasks.filter(t => t._id !== id))
//     } catch (err) {
//       console.error(err)
//     }
//   }


  

//   if (loading) return <div className="center">Loading...</div>



//   return (
//     <div>
//       <div className="page-header">
//         <h2>Your Tasks</h2>
//         <Link to="/tasks/add" className="btn">Add Task</Link>
        
    
      
        
    


//       </div>

//       {tasks.length === 0 ? (
//         <p>No tasks yet. Create one!</p>
//       ) : (
//         <div className="tasks-grid">
//           {tasks.map(t => (
//             <TaskCard key={t._id} task={t} onDelete={handleDelete} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }



// import React, { useState } from 'react';

// const tasks = [
//   { id: 1, title: "Design login page", description: "UI for login" },
//   { id: 2, title: "Set up database", description: "MongoDB schema" },
//   { id: 3, title: "Write documentation", description: "Project README" },
// ];

// const LiveTaskFilter = () => {
//   const [search, setSearch] = useState("");

//   // Live filter tasks as user types
//   const visibleTasks = tasks.filter(task =>
//     task.title.toLowerCase().includes(search.toLowerCase()) ||
//     task.description.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by task name or description..."
//         value={search}
//         onChange={e => setSearch(e.target.value)}
//         style={{marginBottom: '12px', width: '100%'}}
//       />
//       <ul>
//         {visibleTasks.map(task => (
//           <li key={task.id}>
//             <strong>{task.title}</strong>: {task.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default LiveTaskFilter;

import React, { useEffect, useState, useMemo } from 'react'
import axios from '../api/axiosInstance'
import TaskCard from '../components/TaskCard'
import { Link } from 'react-router-dom'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filter and Sort States
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('none')

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

  // Priority order mapping for sorting
  const priorityOrder = {
    'Low': 1,
    'Medium': 2,
    'High': 3
  }

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // 1. Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      )
    }

    // 2. Apply priority filter
    if (priorityFilter !== 'All') {
      result = result.filter(task => task.priority === priorityFilter)
    }

    // 3. Apply sorting
    if (sortOrder === 'asc') {
      // Low → Medium → High
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    } else if (sortOrder === 'desc') {
      // High → Medium → Low
      result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    }

    return result
  }, [tasks, searchQuery, priorityFilter, sortOrder])

  if (loading) return <div className="center">Loading...</div>

  return (
    <div>
      <div className="page-header">
        <h2>Your Tasks</h2>
        <Link to="/tasks/add" className="btn">Add Task</Link>
      </div>

      {/* Filter Controls Section */}
      <div className="filters-section">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {/* Priority Filter Dropdown */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="none">Sort by Priority</option>
          <option value="asc">Low → Medium → High</option>
          <option value="desc">High → Medium → Low</option>
        </select>
      </div>

      {filteredAndSortedTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="tasks-grid">
          {filteredAndSortedTasks.map(t => (
            <TaskCard key={t._id} task={t} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

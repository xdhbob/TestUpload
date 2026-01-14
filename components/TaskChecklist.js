import { useState, useEffect } from 'react'

export default function TaskChecklist() {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('task_checklist_v1')
      if (raw) setTasks(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('task_checklist_v1', JSON.stringify(tasks))
    } catch (e) {}
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setTasks(prev => [{ id: Date.now(), text: t, done: false }, ...prev])
    setText('')
  }

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  return (
    <div>
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="New task"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md" type="submit">Add</button>
      </form>

      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} className="w-4 h-4" />
              <span className={`${task.done ? 'line-through text-gray-400' : ''} text-sm`}>{task.text}</span>
            </label>
            <button onClick={() => remove(task.id)} className="text-red-500 hover:text-red-700">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

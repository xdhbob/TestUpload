import TaskChecklist from '../components/TaskChecklist'

export default function Home() {
  return (
    <main className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-md mt-10">
        <div className="card">
          <h1 className="text-2xl font-semibold mb-4">Task Checklist</h1>
          <TaskChecklist />
          <div className="mt-6 pt-4 border-t border-gray-200">
            <a
              href="/snake"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block text-center"
            >
              Play Snake Game
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

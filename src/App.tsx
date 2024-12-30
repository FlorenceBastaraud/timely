import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [timelineData, setTimelineData] = useState<{
    name: string
    workHours: number
    lunchBreak: number
    shortBreak: number
    workSession: number
    startHour: string
  } | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [dailySchedule, setDailySchedule] = useState<string[]>([])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)

    const name = formData.get('name')?.toString() || ''
    const workHours = parseFloat(formData.get('workHours')?.toString() || '7')
    const lunchBreak = parseFloat(
      formData.get('lunchBreak')?.toString() || '1.5'
    )
    const shortBreak = parseFloat(
      formData.get('shortBreak')?.toString() || '10'
    )
    const workSession = parseFloat(
      formData.get('workSession')?.toString() || '50'
    )
    const startHour = formData.get('startHour')?.toString() || '09:00'

    setTimelineData({
      name,
      workHours,
      lunchBreak,
      shortBreak,
      workSession,
      startHour,
    })
    setShowForm(false)

    // Generate schedule
    const schedule = generateSchedule(
      workHours,
      lunchBreak,
      shortBreak,
      workSession,
      startHour
    )
    setDailySchedule(schedule)
  }

  const generateSchedule = (
    workHours: number,
    lunchBreak: number,
    shortBreak: number,
    workSession: number,
    startHour: string
  ) => {
    const schedule = []
    const start = new Date(`1970-01-01T${startHour}:00`)
    const currentTime = new Date(start)

    const totalMinutes = workHours * 60
    const lunchBreakMinutes = lunchBreak * 60
    const shortBreakMinutes = shortBreak
    const workSessionMinutes = workSession

    let timeElapsed = 0
    let lunchTaken = false

    while (timeElapsed < totalMinutes) {
      // Check if it's time for the lunch break (12 PM or 1 PM)
      const currentHour = currentTime.getHours()
      if (
        !lunchTaken &&
        (currentHour === 12 || currentHour === 13) &&
        timeElapsed + lunchBreakMinutes <= totalMinutes
      ) {
        schedule.push(
          `Lunch break from ${currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        )
        currentTime.setMinutes(currentTime.getMinutes() + lunchBreakMinutes)
        timeElapsed += lunchBreakMinutes
        lunchTaken = true
        continue
      }

      // Work session
      if (timeElapsed + workSessionMinutes <= totalMinutes) {
        schedule.push(
          `Work session from ${currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        )
        currentTime.setMinutes(currentTime.getMinutes() + workSessionMinutes)
        timeElapsed += workSessionMinutes
      }

      // Short break
      if (timeElapsed + shortBreakMinutes <= totalMinutes) {
        schedule.push(
          `Short break from ${currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        )
        currentTime.setMinutes(currentTime.getMinutes() + shortBreakMinutes)
        timeElapsed += shortBreakMinutes
      }
    }

    return schedule
  }

  return (
    <main className="relative bg-[#131313] m-auto flex justify-center items-center min-h-[100vh] flex-col gap-6 p-8">
      {/* Display current time */}
      {timelineData && (
        <div className="absolute top-4 left-4 text-white text-lg font-semibold">
          {currentTime}
        </div>
      )}

      {!timelineData && !showForm && (
        <>
          <motion.h1
            className="font-roboto text-6xl font-bold text-accent z-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Timely
          </motion.h1>
          <div className="text-xl text-white text-center italic z-10">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Customize your work sessions, track your progress,
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              and stay on time with smart alerts
            </motion.p>
          </div>
          <motion.button
            className="mt-3 px-4 py-2 text-sm bg-accent text-dark font-medium rounded-3xl shadow-lg hover:bg-primary transition-all z-10"
            onClick={() => setShowForm(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3, duration: 0.8, ease: 'backIn' }}
          >
            Start Planning
          </motion.button>
        </>
      )}

      {showForm && (
        <motion.div
          className="p-6 rounded shadow-lg w-[90%] z-10 flex justify-center items-center text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="w-full text-center">
            <label className="block text-sm text-gray-700 mb-2">
              <input
                name="name"
                type="text"
                className="w-full mt-1 p-2 border rounded-3xl text-center bg-transparent text-white"
                placeholder="Enter your name"
              />
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              <input
                name="workHours"
                type="number"
                step="0.1"
                className="w-full mt-1 p-2 border rounded-3xl text-center bg-transparent text-white"
                placeholder="Total work hours (default 7)"
              />
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              <input
                name="lunchBreak"
                type="number"
                step="0.1"
                className="w-full mt-1 p-2 border rounded-3xl text-center bg-transparent text-white"
                placeholder="Lunch break duration in hours (default 1.5)"
              />
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              <input
                name="shortBreak"
                type="number"
                step="0.1"
                className="w-full mt-1 p-2 border rounded-3xl text-center bg-transparent text-white"
                placeholder="Short break duration in minutes (default 10)"
              />
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              <input
                name="workSession"
                type="number"
                step="0.1"
                className="w-full mt-1 p-2 border rounded-3xl text-center bg-transparent text-white"
                placeholder="Work session duration in minutes (default 50)"
              />
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              <input
                name="startHour"
                type="time"
                className="w-full mt-1 p-2 border rounded-3xl text-center bg-transparent text-white"
                defaultValue="09:00"
              />
            </label>
            <button
              type="submit"
              className="mt-3 px-4 py-2 text-sm bg-accent text-dark font-medium rounded-3xl shadow-lg hover:bg-primary transition-all"
            >
              Save Plan
            </button>
          </form>
        </motion.div>
      )}

      {timelineData && (
        <div className="text-white mt-6">
          <h2 className="text-2xl font-bold">
            Work Plan for {timelineData.name}
          </h2>
          <ul className="list-disc ml-4">
            {dailySchedule.map((entry, index) => (
              <li key={index} className="mt-1">
                {entry}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}

export default App

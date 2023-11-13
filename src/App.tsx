import { createRef, useCallback, useEffect, useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import Circle from "./components/Circle"
import { useIntervalEffect, useToggle } from "@react-hookz/web"
// import './App.css'

const totalBeat = 4

const getNextBeat = (currentBeat: number) => {
  if (currentBeat >= totalBeat) {
    return 1
  } else return currentBeat + 1
}

function App() {
  const [enabled, toggleEnabled] = useToggle(false)

  const [bpm, setBpm] = useState(120)
  const [currentBeat, setCurrentBeat] = useState(1)
  const [passedTime, setPassedTime] = useState(0)

  const [lastUpdatedTime, setLastUpdatedTime] = useState(Date.now())

  const interval = (60 / bpm) * 1000 // ms

  const onInterval = useCallback(() => {
    const delta = Date.now() - lastUpdatedTime

    const newPassedTime = passedTime + delta
    if (newPassedTime >= interval) {
      setCurrentBeat(getNextBeat(currentBeat))
      setPassedTime(newPassedTime % interval)
    } else {
      setPassedTime(newPassedTime)
    }

    // debug
    console.log(currentBeat, passedTime)

    setLastUpdatedTime(Date.now())
  }, [lastUpdatedTime])

  const reset = () => {
    setCurrentBeat(1)
    setPassedTime(0)
    setLastUpdatedTime(Date.now())
  }

  useIntervalEffect(onInterval, enabled ? 0 : undefined)

  useEffect(() => {
    if (enabled) {
      reset()
    }
  }, [enabled])

  const bpmInputRef = createRef<HTMLInputElement>()

  // 처음 렌더링 시 값 집어넣기
  useEffect(() => {
    if (bpmInputRef.current != null) {
      bpmInputRef.current.value = String(bpm)
    }
  }, [])

  return (
    <div className="flex flex-col h-[100vh] justify-center gap-8">
      <h1 className="text-5xl text-center">Metronome</h1>
      <div className="flex flex-row justify-center gap-8">
        <Circle percent={currentBeat === 1 ? (passedTime / interval) * 100 : 0}>
          <span className="text-3xl">1</span>
        </Circle>
        <Circle percent={currentBeat === 2 ? (passedTime / interval) * 100 : 0}>
          <span className="text-3xl">2</span>
        </Circle>
        <Circle percent={currentBeat === 3 ? (passedTime / interval) * 100 : 0}>
          <span className="text-3xl">3</span>
        </Circle>
        <Circle percent={currentBeat === 4 ? (passedTime / interval) * 100 : 0}>
          <span className="text-3xl">4</span>
        </Circle>
      </div>
      <div className="flex flex-row justify-center gap-8 items-center">
        <div className="flex flex-row gap-2 items-center">
          <input
            type="number"
            className="w-[4.5rem] bg-neutral-700 p-2 rounded-lg"
            ref={bpmInputRef}
            onBlur={(e) => {
              setBpm(Number(e.target.value))
              reset()
            }}
          />
          <span>BPM</span>
        </div>
        <button
          type="button"
          className="bg-neutral-600 w-auto px-6 py-3 hover:bg-neutral-700 transition rounded-lg"
          onClick={() => toggleEnabled()}
        >
          {enabled ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  )
}

export default App

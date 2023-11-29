import { createRef, useEffect, useState } from "react"
import { useTimer } from "react-use-precision-timer"

import Circle from "./components/Circle"
import { useToggle } from "@react-hookz/web"
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
  const [shouldBeatChangeAt, setShouldBeatChangeAt] = useState(Date.now()) // 시작시간에 interval 값을 계속 더한 값. 다음 비트로 바뀌어야 하는 정확한 시각
  const [diffMillisBetweenBeats, setDiffMillisBetweenBeats] = useState(0) // shouldBeatChangeAt 시간에서 얼마나 틀어졌는지 차이를 저장, interval 보정에 사용

  const interval = (60 / bpm) * 1000 // ms
  const calibratedInterval = interval - diffMillisBetweenBeats // 틀어진 시간만큼 빼서 interval 보정

  const onInterval = () => {
    const delta = Date.now() - lastUpdatedTime

    const newPassedTime = passedTime + delta
    if (newPassedTime >= calibratedInterval) {
      // console.log(
      //   "trig 1",
      //   interval,
      //   passedTime,
      //   newPassedTime,
      //   getNextBeat(currentBeat),
      //   newPassedTime % interval
      // )
      setCurrentBeat(getNextBeat(currentBeat))
      setPassedTime(newPassedTime % calibratedInterval)

      console.log(diffMillisBetweenBeats, interval, calibratedInterval)

      // 비트가 바뀔 때 다음 비트로 바뀌어야 하는 정확한 시각도 같이 업데이트
      setShouldBeatChangeAt((prev) => prev + interval)
      setDiffMillisBetweenBeats(Date.now() - shouldBeatChangeAt) // 보정값도 같이 업데이트
    } else {
      setPassedTime(newPassedTime)
    }

    // debug
    // console.log(currentBeat, passedTime)

    setLastUpdatedTime(Date.now())
  }

  const reset = () => {
    setCurrentBeat(1)
    setPassedTime(0)
    setLastUpdatedTime(Date.now())
    setShouldBeatChangeAt(Date.now() + interval)
    setDiffMillisBetweenBeats(0)
  }

  const timer = useTimer({ delay: 10, startImmediately: false }, onInterval)

  useEffect(() => {
    if (enabled) {
      reset()
      timer.start()
    } else {
      timer.stop()
    }
  }, [enabled])

  // bpm이 변경되면 리셋
  useEffect(() => {
    reset()
  }, [bpm])

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
      <div>
        {currentBeat} {diffMillisBetweenBeats}
      </div>
    </div>
  )
}

export default App

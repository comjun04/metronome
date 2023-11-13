import { FC, ReactNode } from "react"

type TCircleProps = {
  children: ReactNode
  percent: number
}

const Circle: FC<TCircleProps> = ({ children, percent }) => {
  if (percent < 0) percent = 0
  else if (percent > 100) percent = 100

  const deg = (percent / 100) * 360

  return (
    <div
      className="text-black rounded-full p-24 relative"
      style={{
        background: `conic-gradient(yellow ${deg}deg, gray ${deg}deg 360deg)`,
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  )
}

export default Circle

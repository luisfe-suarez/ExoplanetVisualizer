import React from 'react'

interface CompareToggleProps {
  overlayMode: boolean
  onToggle: (overlayMode: boolean) => void
}

const CompareToggle: React.FC<CompareToggleProps> = ({
  overlayMode,
  onToggle
}) => {
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked)
  }

  return (
    <div className="compare-toggle">
      <input
        id="overlay-toggle"
        type="checkbox"
        checked={overlayMode}
        onChange={handleToggle}
      />
      <label htmlFor="overlay-toggle">
        Overlay Mode
      </label>
    </div>
  )
}

export default CompareToggle

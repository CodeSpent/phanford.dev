import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface IButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string
  disabled?: boolean
  icon?: IconProp
  iconPosition?: 'left' | 'right'
}
const Button = ({ icon, text, onClick, iconPosition }: IButtonProps) => {
  const classNames = []

  if (iconPosition === 'right') {
    classNames.push('flex-row-reverse')
  }
  return (
    <button className={`${classNames} flex items-center gap-3 rounded p-4`} onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {text}
    </button>
  )
}

export default Button

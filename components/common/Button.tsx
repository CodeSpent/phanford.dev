import React from 'react'
import Link from 'next/link'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type ButtonVariant = 'primary' | 'secondary' | 'solid-secondary' | 'danger' | 'ghost' | 'icon-prominent' | 'icon-minimal'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: IconProp | React.ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
  disabled?: boolean
}

interface ButtonAsButtonProps extends BaseButtonProps {
  as?: 'button'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

interface ButtonAsLinkProps extends BaseButtonProps {
  as: 'link'
  href: string
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const getVariantClasses = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
    case 'secondary':
      return 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-transparent'
    case 'solid-secondary':
      return 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white border-transparent'
    case 'danger':
      return 'bg-red-600 hover:bg-red-500 text-white border-transparent'
    case 'ghost':
      return 'text-gray-400 hover:text-white border-transparent bg-transparent'
    case 'icon-prominent':
      return 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white border-transparent rounded-lg'
    case 'icon-minimal':
      return 'bg-black/50 hover:bg-black/70 text-white border-transparent rounded-full'
    default:
      return 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-transparent'
  }
}

const getSizeClasses = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-4 py-2 text-sm'
    case 'lg':
      return 'px-4 py-2 text-base'
    default:
      return 'px-4 py-2 text-sm'
  }
}

const renderIcon = (icon: IconProp | React.ReactNode) => {
  if (React.isValidElement(icon)) {
    return icon
  }
  if (typeof icon === 'object' && 'iconName' in (icon as any)) {
    return <FontAwesomeIcon icon={icon as IconProp} className="h-4 w-4" />
  }
  return null
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'secondary',
    size = 'md',
    icon,
    iconPosition = 'left',
    className = '',
    disabled = false,
    ...restProps
  } = props

  const baseClasses = 'inline-flex items-center font-medium rounded-lg transition-colors duration-200 border gap-2'
  const variantClasses = getVariantClasses(variant)
  const sizeClasses = getSizeClasses(size)
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`.trim()

  const content = (
    <>
      {icon && iconPosition === 'left' && renderIcon(icon)}
      <span>{children}</span>
      {icon && iconPosition === 'right' && renderIcon(icon)}
    </>
  )

  if (props.as === 'link') {
    const { href } = props
    return (
      <Link href={href} className={allClasses}>
        {content}
      </Link>
    )
  }

  const { onClick, type = 'button' } = props as ButtonAsButtonProps
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={allClasses}
    >
      {content}
    </button>
  )
}
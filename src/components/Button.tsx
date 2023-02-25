import clsx from 'clsx'
import { Component, JSX, splitProps } from 'solid-js'

interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?(event: MouseEvent): void
  text?: string
}

export const Button: Component<Props> = (props) => {
  const [local, others] = splitProps(props, ['onClick', 'text', 'class'])

  return (
    <button
      class={clsx(buttonClasses, local.class)}
      onClick={(event) => local.onClick?.(event)}
      {...others}
    >
      {local.text}
    </button>
  )
}

const buttonClasses = `
  border
  border-2
  border-ctp-mauve
  hover:border-ctp-blue
  rounded
  text-ctp-mauve
  hover:text-ctp-blue
  hover:bg-ctp-blue/10
  font-bold
  px-4 py-2
`
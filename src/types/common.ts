import type { Dispatch, SetStateAction } from 'react'

export type ReactDispatch<T> = Dispatch<SetStateAction<T>>
export type VoidFunction = () => void

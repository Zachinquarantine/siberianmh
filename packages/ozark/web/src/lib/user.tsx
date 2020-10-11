import * as React from 'react'
import type { IUser } from '@ozark/types'

export const UserState = React.createContext<IUser | null>(null)

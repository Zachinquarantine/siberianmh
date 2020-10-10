import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './styles/index.scss'
import { Routes } from './routes'
import useAxios from 'axios-hooks'
import { UserState } from './lib/user'

const App = () => {
  const [{ data, loading }] = useAxios('/users/me')

  if (loading) {
    return null
  }

  console.log(data)

  return (
    <UserState.Provider value={data}>
      <Routes />
    </UserState.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

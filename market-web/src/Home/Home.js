import React from 'react'
import { Link } from 'react-router-dom'
import './home.css'
import NavBar from './nav'
import CoinTable from './coinTable'

export default function Home() {
  return (
    <div>
      <NavBar />
      <CoinTable />
    </div>
  )
}

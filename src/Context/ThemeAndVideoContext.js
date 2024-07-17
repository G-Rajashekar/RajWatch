import React from 'react'

const ThemeAndVideoContext = React.createContext({
  isDarkTheme: false,
  changeTheme: () => {},
  savedVideos: [],
  addVideo: () => {},
})

export default ThemeAndVideoContext

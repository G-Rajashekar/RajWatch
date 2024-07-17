import {useState} from 'react'
import {Switch, Route} from 'react-router-dom'
import ThemeAndVideoContext from './Context/ThemeAndVideoContext'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Trending from './components/Trending' 
import Gaming from './components/Gaming'
import SavedVideos from './components/SavedVideos'
import VideoDetailView from './components/VideoDetailView'
const App = () => {
  const [isDarkTheme, setDarkTheme] = useState(false)
  const [savedVideos, setSavedVideos] = useState([])

  const changeTheme = () => {
    setDarkTheme(prevTheme => !prevTheme)
  }

  const addVideo = video => {
    const index = savedVideos.findIndex(eachVideo => eachVideo.id === video.id)
    if (index === -1) {
      setSavedVideos(prevSavedVideos => [...prevSavedVideos, video])
    } else {
      const newSavedVideos = savedVideos.filter(
        eachVideo => eachVideo.id !== video.id,
      )
      setSavedVideos(newSavedVideos)
    }
  }

  return (
    <ThemeAndVideoContext.Provider
      value={{
        isDarkTheme,
        changeTheme,
        savedVideos,
        addVideo,
      }}
    >
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/trending" component={Trending} />
        <ProtectedRoute exact path="/gaming" component={Gaming} />
        <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
         <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoDetailView}
          />
      </Switch>
    </ThemeAndVideoContext.Provider>
  )
}

export default App

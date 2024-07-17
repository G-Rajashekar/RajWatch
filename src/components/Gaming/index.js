import {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {SiYoutubegaming} from 'react-icons/si'

import Header from '../Header'
import NavigationBar from '../NavigationBar'
import ThemeAndVideoContext from '../../Context/ThemeAndVideoContext'
import FailureView from '../FailureView'
import GameVideoCard from '../GameVideoCard'

import {
  GamingContainer,
  GamingTitleIconContainer,
  GamingVideoTitle,
  GamingVideoList,
  GamingText,
  LoaderContainer,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Gaming = () => {
  const [gamingDetails, setGamingDetails] = useState({
    status: apiStatusConstants.initial,
    videosList: [],
  })
  const {isDarkTheme} = useContext(ThemeAndVideoContext)

  useEffect(() => {
    const getVideos = async () => {
      setGamingDetails(prevState => ({
        ...prevState,
        status: apiStatusConstants.inProgress,
      }))

      const jwtToken = Cookies.get('jwt_token')
      const url = `https://apis.ccbp.in/videos/gaming`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.videos.map(eachVideo => ({
          id: eachVideo.id,
          title: eachVideo.title,
          thumbnailUrl: eachVideo.thumbnail_url,
          viewCount: eachVideo.view_count,
        }))
        setGamingDetails({
          status: apiStatusConstants.success,
          videosList: updatedData,
        })
      } else {
        setGamingDetails({status: apiStatusConstants.failure, videosList: []})
      }
    }
    getVideos()
  }, [])

  const renderLoadingView = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </LoaderContainer>
  )

  const onRetry = () => {
    setGamingDetails({status: apiStatusConstants.initial, videosList: []})
  }

  const renderFailureView = () => {
    return <FailureView onRetry={onRetry} />
  }

  const renderVideosView = () => {
    const {videosList} = gamingDetails
    return (
      <GamingVideoList>
        {videosList.map(eachVideo => (
          <GameVideoCard key={eachVideo.id} videoDetails={eachVideo} />
        ))}
      </GamingVideoList>
    )
  }

  const renderTrendingVideos = () => {
    const {status} = gamingDetails

    switch (status) {
      case apiStatusConstants.success:
        return renderVideosView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'
  const textColor = isDarkTheme ? '#f9f9f9' : '#231f20'

  return (
    <div>
      <Header />
      <NavigationBar />
      <GamingContainer data-testid="gaming" bgColor={bgColor}>
        <GamingVideoTitle>
          <GamingTitleIconContainer>
            <SiYoutubegaming size={35} color="#ff0000" />
          </GamingTitleIconContainer>
          <GamingText color={textColor}>Gaming</GamingText>
        </GamingVideoTitle>
        {renderTrendingVideos()}
      </GamingContainer>
    </div>
  )
}

export default Gaming

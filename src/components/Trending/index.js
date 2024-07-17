import {useEffect, useState, useContext} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {HiFire} from 'react-icons/hi'
import Header from '../Header'
import NavigationBar from '../NavigationBar'
import ThemeAndVideoContext from '../../Context/ThemeAndVideoContext'
import FailureView from '../FailureView'
import VideoCard from '../VideoCard'
import {
  TrendingContainer,
  TitleIconContainer,
  TrendingVideoTitle,
  TrendingVideoList,
  TrendingText,
  LoaderContainer,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const TrendingVideos = () => {
  const [trendingVideos, setTrendingVideos] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const {isDarkTheme} = useContext(ThemeAndVideoContext)

  useEffect(() => {
    getVideos()
  }, [])

  const getVideos = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/trending`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.videos.map(eachVideo => ({
          id: eachVideo.id,
          title: eachVideo.title,
          thumbnailUrl: eachVideo.thumbnail_url,
          viewCount: eachVideo.view_count,
          publishedAt: eachVideo.published_at,
          name: eachVideo.channel.name,
          profileImageUrl: eachVideo.channel.profile_image_url,
        }))
        setTrendingVideos(updatedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const renderLoadingView = () => (
    <LoaderContainer data-testid='loader'>
      <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
    </LoaderContainer>
  )

  const renderVideosView = () => (
    <TrendingVideoList>
      {trendingVideos.map(eachVideo => (
        <VideoCard key={eachVideo.id} videoDetails={eachVideo} />
      ))}
    </TrendingVideoList>
  )

  const renderFailureView = () => <FailureView onRetry={getVideos} />

  const renderTrendingVideos = () => {
    switch (apiStatus) {
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
    <div data-testid='trending'>
      <Header />
      <NavigationBar />
      <TrendingContainer data-testid='trending' bgColor={bgColor}>
        <TrendingVideoTitle>
          <TitleIconContainer>
            <HiFire size={35} color='#ff0000' />
          </TitleIconContainer>
          <TrendingText color={textColor}>Trending</TrendingText>
        </TrendingVideoTitle>
        {renderTrendingVideos()}
      </TrendingContainer>
    </div>
  )
}

export default TrendingVideos

import {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import NavigationBar from '../NavigationBar'
import ThemeAndVideoContext from '../../Context/ThemeAndVideoContext'
import FailureView from '../FailureView'
import PlayVideoView from '../PlayVideoView'

import {VideoDetailViewContainer, LoaderContainer} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const VideoDetailView = props => {
  const [playDetails, setPlayDetails] = useState({
    status: apiStatusConstants.initial,
    videoData: {},
    isLiked: false,
    isDisliked: false,
  })
  const {isDarkTheme} = useContext(ThemeAndVideoContext)

  const formattedData = data => ({
    id: data.video_details.id,
    title: data.video_details.title,
    videoUrl: data.video_details.video_url,
    thumbnailUrl: data.video_details.thumbnail_url,
    viewCount: data.video_details.view_count,
    publishedAt: data.video_details.published_at,
    description: data.video_details.description,
    name: data.video_details.channel.name,
    profileImageUrl: data.video_details.channel.profile_image_url,
    subscriberCount: data.video_details.channel.subscriber_count,
  })

  useEffect(() => {
    const getData = async () => {
      setPlayDetails(prevState => ({
        ...prevState,
        status: apiStatusConstants.inProgress,
      }))

      const {match} = props
      const {params} = match
      const {id} = params
      const jwtToken = Cookies.get('jwt_token')

      const url = `https://apis.ccbp.in/videos/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = formattedData(data)
        setPlayDetails({
          status: apiStatusConstants.success,
          videoData: updatedData,
        })
      } else {
        setPlayDetails({status: apiStatusConstants.failure, videoData: {}})
      }
    }
    getData()
  }, [props.match.params.id])

  const clickLiked = () => {
    const {isLiked} = playDetails
    const newStatus = !isLiked
    setPlayDetails(prevState => ({
      ...prevState,
      isLiked: newStatus,
      isDisliked: newStatus ? false : prevState.isDisliked,
    }))
  }

  const clickDisLiked = () => {
    const {isDisliked} = playDetails
    const newStatus = !isDisliked
    setPlayDetails(prevState => ({
      ...prevState,
      isDisliked: newStatus,
      isLiked: newStatus ? false : prevState.isLiked,
    }))
  }

  const renderLoadingView = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </LoaderContainer>
  )

  const renderPlayVideoView = () => {
    const {videoData, isLiked, isDisliked} = playDetails
    return (
      <PlayVideoView
        videoDetails={videoData}
        clickLiked={clickLiked}
        clickDisLiked={clickDisLiked}
        isLiked={isLiked}
        isDisliked={isDisliked}
      />
    )
  }

  const onRetry = () => {
    setPlayDetails({
      status: apiStatusConstants.initial,
      videoData: {},
      isLiked: false,
      isDisliked: false,
    })
  }

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const renderVideoDetailView = () => {
    const {status} = playDetails

    switch (status) {
      case apiStatusConstants.success:
        return renderPlayVideoView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'

  return (
    <>
      <Header />
      <NavigationBar />
      <VideoDetailViewContainer
        data-testid="videoItemDetails"
        bgColor={bgColor}
      >
        {renderVideoDetailView()}
      </VideoDetailViewContainer>
    </>
  )
}

export default VideoDetailView

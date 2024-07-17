import React, {useState, useEffect} from 'react'
import Header from '../Header'
import NavigationBar from '../NavigationBar'
import HomeCard from '../HomeCard'
import Cookies from 'js-cookie'
import FailureView from '../FailureView'
import ThemeAndVideoContext from '../../Context/ThemeAndVideoContext'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch, AiOutlineClose} from 'react-icons/ai'
import {
  HomeContainer,
  BannerContainer,
  BannerImage,
  BannerText,
  BannerButton,
  BannerLeftPart,
  BannerRightPart,
  BannerCloseButton,
  SearchContainer,
  SearchInput,
  SearchIconContainer,
  LoaderContainer,
  NoVideosView,
  NoVideosImage,
  NoVideosHeading,
  NoVideosNote,
  RetryButton,
  VideoCardList,
} from './styledComponents'

const initialApiConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Home = () => {
  const [homeVideosDetails, setHomeVideosDetails] = useState({
    status: initialApiConstants.initial,
    videosList: [],
    searchInput: '',
  })

  useEffect(() => {
    const fetchVideos = async () => {
      setHomeVideosDetails(prevState => ({
        ...prevState,
        status: initialApiConstants.progress,
      }))

      const jwtToken = Cookies.get('jwt_token')
      const {searchInput} = homeVideosDetails
      const apiUrl = `https://apis.ccbp.in/videos/all?search=${searchInput}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }

      try {
        const response = await fetch(apiUrl, options)
        if (!response.ok) {
          throw new Error('Failed to fetch videos')
        }
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

        setHomeVideosDetails(prevState => ({
          ...prevState,
          status: initialApiConstants.success,
          videosList: updatedData,
        }))
      } catch (error) {
        console.error('Error fetching videos:', error)
        setHomeVideosDetails(prevState => ({
          ...prevState,
          status: initialApiConstants.failure,
        }))
      }
    }

    fetchVideos()
  }, [homeVideosDetails.searchInput])

  const onChangeSearchInput = event => {
    const {value} = event.target
    setHomeVideosDetails(prevState => ({
      ...prevState,
      searchInput: value,
    }))
  }

  const onRetry = () => {
    setHomeVideosDetails(prevState => ({
      ...prevState,
      searchInput: '',
    }))
  }

  const renderLoadingView = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </LoaderContainer>
  )

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const renderSuccessView = () => {
    const {videosList} = homeVideosDetails
    const videosCount = videosList.length

    if (videosCount > 0) {
      return (
        <VideoCardList>
          {videosList.map(eachVideo => (
            <HomeCard key={eachVideo.id} video={eachVideo} />
          ))}
        </VideoCardList>
      )
    } else {
      return (
        <NoVideosView>
          <NoVideosImage
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
            alt="no videos"
          />
          <NoVideosHeading>No Search results found</NoVideosHeading>
          <NoVideosNote>
            Try different keywords or remove search filter
          </NoVideosNote>
          <RetryButton type="button" onClick={onRetry}>
            Retry
          </RetryButton>
        </NoVideosView>
      )
    }
  }

  const renderHomeContent = () => {
    const {status} = homeVideosDetails

    switch (status) {
      case initialApiConstants.progress:
        return renderLoadingView()
      case initialApiConstants.failure:
        return renderFailureView()
      case initialApiConstants.success:
        return renderSuccessView()
      default:
        return null
    }
  }

  return (
    <ThemeAndVideoContext.Consumer>
      {({isDarkTheme}) => {
        const bgColor = isDarkTheme ? '#181818' : '#f9f9f9'
        const textColor = isDarkTheme ? '#f9f9f9' : '#231f20'

        return (
          <>
            <Header />
            <NavigationBar />
            <HomeContainer bgColor={bgColor}>
              <BannerContainer>
                <BannerLeftPart>
                  <BannerImage
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                    alt="nxt watch logo"
                  />
                  <BannerText>
                    Buy Nxt Watch Premium prepaid plans with <br /> UPI
                  </BannerText>
                  <BannerButton type="button">GET IT NOW</BannerButton>
                </BannerLeftPart>
                <BannerRightPart>
                  <BannerCloseButton>
                    <AiOutlineClose size={25} />
                  </BannerCloseButton>
                </BannerRightPart>
              </BannerContainer>
              <SearchContainer>
                <SearchInput
                  type="search"
                  placeholder="Search"
                  value={homeVideosDetails.searchInput}
                  onChange={onChangeSearchInput}
                  color={textColor}
                />
                <SearchIconContainer>
                  <AiOutlineSearch size={20} />
                </SearchIconContainer>
              </SearchContainer>
              {renderHomeContent()}
            </HomeContainer>
          </>
        )
      }}
    </ThemeAndVideoContext.Consumer>
  )
}

export default Home

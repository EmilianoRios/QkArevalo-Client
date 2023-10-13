import './LoadingPage.css'

const LoadingPage = () => {
  return (
    <div className={'container-loader'}>
      <div className={'loader-load'}>
        <div className={'loader-small'}></div>
        <div className={'loader-large'}></div>
      </div>
    </div>
  )
}

export default LoadingPage

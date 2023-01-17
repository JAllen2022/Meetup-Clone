import rightArrow from '../../assets/HomePageRightArrow.png'

function ImageLinks({props}) {
    console.log('checking props', props)
    return (
      <div className='home-page-image-divs'>
        <img className='home-page-images-in-divs' src={props.image} />
        <p>
          {props.text}
          <span>
                    <img style={{paddingLeft:5, width:12, height:12}} src={rightArrow} />
          </span>
        </p>
      </div>
    );
}

export default ImageLinks;

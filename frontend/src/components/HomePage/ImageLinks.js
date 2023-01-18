
import { Link } from "react-router-dom";

function ImageLinks({ props }) {
  console.log("checking props", props);
  return (
    <Link className='home-links' to="/groups">
      <div className="home-page-image-divs">
        <div className="home-page-image-container">
          <img className="home-page-images-in-divs" src={props.image} />
        </div>
        <p>
          {props.text}
          <i class="fa-solid fa-arrow-right"></i>
        </p>
      </div>
    </Link>
  );
}

export default ImageLinks;

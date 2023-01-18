import rightArrow from "../../assets/HomePageRightArrow.png";
import { Link } from "react-router-dom";

function ImageLinks({ props }) {
  console.log("checking props", props);
  return (
    <Link to='/groups'>
      <div className="home-page-image-divs">
        <img className="home-page-images-in-divs" src={props.image} />
        <p>
          {props.text}
          <span>
            <img
              style={{ paddingLeft: 5, width: 12, height: 12 }}
              src={rightArrow}
            />
          </span>
        </p>
      </div>
    </Link>
  );
}

export default ImageLinks;

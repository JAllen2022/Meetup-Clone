import { Link } from "react-router-dom";

function ImageLinks({ props }) {
  return (
    <Link className="home-links" to="/search/groups">
      <div className="home-page-image-divs">
        <img className="home-page-images-in-divs" src={props.image} />
      </div>
      <p className="home-page-image-sub-headings">
        {props.text}
        <i className="fa-solid fa-arrow-right fa-solid-profile"></i>
      </p>
    </Link>
  );
}

export default ImageLinks;

import iosPhone from "../../assets/ScreenIos.jpg";
import androidPhone from "../../assets/ScreenAndroid.jpg";
import AppleStore from "../../assets/SVGFiles/AppleStore";
import GooglePlay from "../../assets/SVGFiles/GooglePlay";
import "./AppStore.css";

export default function App() {
  return (
    <div className="app-store-container">
      <div className="app-store-left-image-container">
        <img
          className="app-store-phone-images"
          src={iosPhone}
          alt="IOS image"
        />
      </div>
      <div className="app-store-middle-container">
        <div className="app-store-middle-logo">
          <img
            className="linkup-logo app-store"
            src="https://see.fontimg.com/api/renderfont4/rg9Rx/eyJyIjoiZnMiLCJoIjo2OCwidyI6MjAwMCwiZnMiOjM0LCJmZ2MiOiIjRjY1OTU5IiwiYmdjIjoiI0ZGRkZGRiIsInQiOjF9/TFU/ananda-black-personal-use-regular.png"
            alt="logo"
          />
        </div>
        <div className="app-store-middle-text">Stay connected.</div>
        <div className="app-store-middle-text">Download the app.</div>
        <div className="app-store-buttons">
          <a href="https://apps.apple.com/us/app/meetup/id375990038">
            <AppleStore />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.meetup&hl=en-US">
            {" "}
            <GooglePlay />
          </a>
        </div>
      </div>
      <div className="app-store-right-image-container">
        <img
          className="app-store-phone-images"
          src={androidPhone}
          alt="IOS image"
        />
      </div>
    </div>
  );
}

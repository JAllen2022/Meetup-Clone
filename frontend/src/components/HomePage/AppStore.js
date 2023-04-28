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
        <div>Icon Here</div>
        <div className="app-store-middle-text">Stay connected.</div>
        <div className="app-store-middle-text">Download the app.</div>
        <div>
          <AppleStore />
          <GooglePlay />
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

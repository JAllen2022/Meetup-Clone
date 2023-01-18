
import ImageLinks from './ImageLinks'
import { homePageDivElements } from './homePageDivElements';
import TopRightBlob from "../../assets/SVGFiles/TopRightBlob";
import BottomLeftBlob from '../../assets/SVGFiles/BottomLeftBlob';
import MiddleBlob from '../../assets/SVGFiles/MiddleBlob';
import './HomePage.css'
import HomeImage from '../../assets/SVGFiles/HomeImage';



function HomePage() {

    return (
      <>
        <TopRightBlob />
        <MiddleBlob />
        <BottomLeftBlob />

        <div className="home-page-body">
          <div className="home-two-top-divs">
            <div className="">
              <h1>The people platform—Where interests become friendships</h1>
              <p>
                Whatever your interest, from hiking and reading to networking
                and skill sharing, there are thousands of people who share it on
                Meetup. Events are happening every day—log in to join the fun.
              </p>
            </div>
            <HomeImage />
          </div>
          <div className="home-page-image-links">
            {homePageDivElements.map((ele) => (
              <ImageLinks props={ele} />
            ))}
          </div>
        </div>
      </>
    );
}


export default HomePage;

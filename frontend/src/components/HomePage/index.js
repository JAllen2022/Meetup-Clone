import ImageLinks from "./ImageLinks";
import { homePageDivElements } from "./homePageDivElements";
import TopRightBlob from "../../assets/SVGFiles/TopRightBlob";
import BottomLeftBlob from "../../assets/SVGFiles/BottomLeftBlob";
import MiddleBlob from "../../assets/SVGFiles/MiddleBlob";
import HomeImage from "../../assets/SVGFiles/HomeImage";
import LinkUpWorks from "./LinkUpWorks";
import "./HomePage.css";

function HomePage() {
  return (
    <>
      <div className="blob-container">
        <TopRightBlob />
        <MiddleBlob />
        <BottomLeftBlob />
      </div>
      <div className="home-page-body">
        <div className="home-two-top-divs">
          <div className="">
            <h1 className=" home-title">
              The people platform—Where interests become friendships
            </h1>
            <p className="home-sub-title">
              Whatever your interest, from hiking and reading to networking and
              skill sharing, there are thousands of people who share it on
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
        <LinkUpWorks />
      </div>
    </>
  );
}

export default HomePage;

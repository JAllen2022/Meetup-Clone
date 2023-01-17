import homeImage from '../../assets/HomePageImage.png'
import ImageLinks from './ImageLinks'
import { homePageDivElements } from './homePageDivElements';
import './HomePage.css'


function HomePage() {

    return (
      <div className="home-page-body">
        <div className="home-two-top-divs">
          <div className="">
            <h1>The people platform—Where interests become friendships</h1>
            <p>
              Whatever your interest, from hiking and reading to networking and
              skill sharing, there are thousands of people who share it on
              Meetup. Events are happening every day—log in to join the fun.
            </p>
          </div>
          <div>
            <img id="home-page-image" src={homeImage} alt="home page image" />
          </div>
        </div>
            <div className="home-page-image-links">
                {homePageDivElements.map(ele => <ImageLinks props={ele} />)}
            </div>
      </div>
    );
}

export default HomePage;

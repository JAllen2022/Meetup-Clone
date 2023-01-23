import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal'
import './HomePage.css'

function LinkUpWorks() {
    const user = useSelector(state=>state.session.user)
    return (
      <div className="link-up-works-container">
        <h2 className="link-up-works-title">How Linkup Works</h2>
        <div className="link-up-works-info">
          Meet new people who share your interests through online and in-person
          events. It’s free to create an account.
        </div>
        <div className="link-up-works-link-group">
          <div className="link-up-works-link-group-card-info">
            <div className="link-up-works-image-container">
              <img src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256" />
            </div>
            <Link
              className="link-up-works-image-container-title"
              to="/search/groups"
            >
              Join a group
            </Link>
            <p className="link-up-works-description">
              Do what you love, meet others who love it, find your community.
              The rest is history!
            </p>
          </div>
          <div className="link-up-works-link-group-card-info">
            <div className="link-up-works-image-container">
              <img
                className="link-up-works-image"
                src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256"
              />
            </div>
            <Link
              className="link-up-works-image-container-title"
              to="/search/events"
            >
              Find an event
            </Link>
            <p className="link-up-works-description">
              Events are happening on just about any topic you can think of,
              from online gaming and photography to yoga and hiking.
            </p>
          </div>
          <div className="link-up-works-link-group-card-info">
            <div className="link-up-works-image-container">
              <img src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256" />
            </div>
            {user ? (
              <Link
                className="link-up-works-image-container-title"
                to="/create-group"
              >
                Start a group
              </Link>
            ) : (
              <OpenModalMenuItem
                itemText={
                  <div className="link-up-works-image-container-title">
                    Start a group
                  </div>
                }
                modalComponent={<SignupFormModal />}
              />
            )}
            <p className="link-up-works-description">
              You don’t have to be an expert to gather people together and
              explore shared interests.
            </p>
          </div>
        </div>
       {!user && ( <OpenModalMenuItem
          itemText={
            <div className="link-up-works-sign-up-button">Join LinkUp</div>
          }
          modalComponent={<SignupFormModal />}
        />)}
      </div>
    );
}

export default LinkUpWorks;

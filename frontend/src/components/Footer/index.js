import { useSelector } from "react-redux";
import "./Footer.css";
import { useHistory } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";
import { useModal } from "../../context/Modal";

function Footer() {
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const { setModalContent } = useModal();

  return (
    <div className="footer-outer-container">
      <div className="footer-inner-container">
        <div className="footer-top">
          Create your own Meetup group.{" "}
          <span
            className="footer-get-started-button"
            onClick={() =>
              user
                ? history.push("/create-group")
                : setModalContent(<LoginFormModal />)
            }
          >
            {" "}
            Get started.
          </span>
        </div>
        <div className="footer-middle">
          <div className="footer-left-container">
            <div className="footer-language-title">Developed with: </div>
            <div className="footer-horizontal-languages">
              <div className="footer-languages">
                <div className="footer-language header">Frontend</div>
                <div className="footer-language">Javascript</div>
                <div className="footer-language">React</div>
                <div className="footer-language">Redux</div>
                <div className="footer-language">HTML5</div>
                <div className="footer-language">CSS3</div>
              </div>
              <div className="footer-languages">
                <div className="footer-language header">Backend</div>
                <div className="footer-language">Javascript</div>
                <div className="footer-language">Express</div>
                <div className="footer-language">Postgress</div>
                <div className="footer-language">Sequelize</div>
              </div>
            </div>
          </div>
          <div className="footer-right-container">
            <div> Developer Information: </div>
            <div className="footer-dev-links">
              <a href="https://github.com/JAllen2022">
                <i className="fa-brands fa-github"></i>
              </a>{" "}
              <a href="https://www.linkedin.com/in/jasonallen715/">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

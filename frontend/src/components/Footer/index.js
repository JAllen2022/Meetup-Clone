import "./Footer.css";

function Footer() {
  return (
    <div className="footer-outer-container">
      <div className="footer-inner-container">
        <div className="footer-left-right-container">
          <div className="footer-language-title">Developed with: </div>
          <div className="footer-languages">
            {" "}
            JavaScript, Express, React, Redux, HTML5, CSS3, Postgress,
            Sequelize, Render
          </div>
        </div>
        <div className="footer-left-right-container">
          <div> Developer Information: </div>
          <div className='footer-dev-links'>
            <a href="https://github.com/JAllen2022">
              <i class="fa-brands fa-github"></i>
            </a>
              {" "}

            <a href="https://www.linkedin.com/in/jasonallen715/">
              <i class="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

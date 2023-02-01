import "./Groups.css";

export default function Groups() {
  return (
    <div className="user-group-page-outer-container">
      <div className="user-group-page-left-container">
        <div className="user-group-page-left-return-home-container">
          <div className="left-arrow-container">
            <i class="fa-solid fa-arrow-left"></i>
          </div>
          <div className="back-to-home-page-text"> Back to home page</div>
        </div>
      </div>
      <div className="user-group-page-right-container">
        <h1>Your Groups</h1>
        <div className="user-group-page-group-card-container">
          <div className="group-page-group-card">
                      <div className="group-page-group-card-image"> My image</div>
                      <p>Group</p>
          </div>
          <div className="group-page-group-card">My Group</div>
          <div className="group-page-group-card">My Group</div>
          <div className="group-page-group-card">My Group</div>
          <div className="group-page-group-card">My Group</div>
          <div className="group-page-group-card">My Group</div>
        </div>
      </div>
    </div>
  );
}

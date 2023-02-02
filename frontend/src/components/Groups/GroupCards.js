import "./GroupCards.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function GroupCards({ group }) {
    const history = useHistory();

    const groupClick = () => {
        console.log('checking the click')
        history.push(`/groups/${group.id}/about`);
    }

    return (
    <div className="group-page-group-card" onClick={groupClick}>
          <div className="group-page-group-card-image-container">
              <img className='group-page-group-card-image' src={group.previewImage ? group.previewImage : ''} alt='group-image' />
      </div>
      <p>{group.name}</p>
    </div>
  );
}

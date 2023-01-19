import { Link, useHistory } from 'react-router-dom'
import defaultImage from "../../assets/DefaultGroupImage.png";
import DivCardBodyGroup from "./DivCardBodyGroup";
import DivCardBodyEvents from './DivCardBodyEvents';

function DivCards({ event, group }) {
  const history = useHistory();
  let previewImage;
  if (event) previewImage = event.previewImage;
  else previewImage = group.previewImage;

  const directToGroup = () => {
    if (group) {
      let directToGroup = `/groups/${group.id}`
      history.push(directToGroup)
    } else {
      let directToGroup = `events/${event.id}`;
      history.push(directToGroup);
    }
  }

  return (
    <div onClick={directToGroup} className="div-card">
      <div className="div-card-image">
        {
          <img
            className="div-card-indiv-image"
            src={previewImage ? previewImage : defaultImage}
            alt="group image"
          />
        }
      </div>
      {group ? <DivCardBodyGroup group={group} /> : <DivCardBodyEvents event={event} />}
    </div>
  );
}

export default DivCards;

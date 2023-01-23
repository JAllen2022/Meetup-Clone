import './Photos.css'
import "./GroupPage.css";
import { useSelector } from 'react-redux';

function Photos() {
    const groupImages = useSelector(state => state.groups.singleGroup.GroupImages)
    return (
      <div className="group-details-pictures-tab-container">
        {groupImages?.map((imageObject, index) => (
          <div id="index" className="group-details-image-container">
            <img className='group-details-image'src={imageObject.url} />
          </div>
        ))}
      </div>
    );
}

export default Photos;

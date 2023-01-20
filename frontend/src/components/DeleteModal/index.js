import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkDeleteGroup } from "../../store/groups";
import { thunkDeleteEvent } from "../../store/events";
import { useModal } from "../../context/Modal";
import "./DeleteModal.css";

function DeleteModal({ type, groupId, eventId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const deleteObject = () => {
    if (type === "Group") {
      dispatch(thunkDeleteGroup(groupId));
      history.push("/search/groups");
    } else {
      dispatch(thunkDeleteEvent(eventId));
      history.push("/search/events");
    }
    closeModal();
  };

  return (
    <div className="delete-modal-outer-container">
      <div className="delete-modal-inner-container">
        <h1 className="delete-modal-inner-text-title">
          Are you sure you want to delete your {type}?
        </h1>
        <div className="delete-modal-button-options">
          <div
            className="delete-modal-cancel-button"
            onClick={() => closeModal()}
          >
            Cancel
          </div>
          <div className="delete-modal-delete-button" onClick={deleteObject}>
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;

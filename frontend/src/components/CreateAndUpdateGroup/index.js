import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  thunkCreateGroup,
  thunkUpdateGroup,
  resetSingleGroup,
  thunkGetSingleGroup,
} from "../../store/groups";
import "./CreateAndUpdateGroup.css";

function CreateAndUpdateGroup() {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [privateVar, setPrivateVar] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState([]);
  const group = useSelector((state) => state.groups.singleGroup);
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();

  const editPage = window.location.href.includes("edit") ? true : false;

  useEffect(() => {
    setName(group.name ? group.name : "");
    setAbout(group.about ? group.about : "");
    setCity(group.city ? group.city : "");
    setType(group.type ? group.type : "");
    setState(group.state ? group.state : "");
    setPrivateVar(group.private ? group.private : false);
  }, [group]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...group,
      name,
      about,
      type,
      private: privateVar,
      city,
      state,
    };

    setErrors([]);
    if (!window.location.href.includes("edit")) {
      dispatch(thunkCreateGroup(payload))
        .then((data) => {
          history.push(`/groups/${data.payload.id}/about`);
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(Object.values(data.errors));
          else setErrors([data.message]);
        });
    } else {
      dispatch(thunkUpdateGroup(payload))
        .then((data) => {
          history.push(`/groups/${data.payload.id}`);
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(Object.values(data.errors));
          else setErrors([data.message]);
        });
    }
  };

  const cancelForm = (e) => {
    e.preventDefault();
    if (editPage) history.push(`/groups/${group.id}`);
    else history.goBack();
  };

  return (
    <div className="create-group-container">
      <h1 className="create-group-title">
        {editPage ? "Update group:" : "Create a group:"}
      </h1>
      <form className="create-group-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li className="errors" key={idx}>
              {error}
            </li>
          ))}
        </ul>
        <div>
          <label className="form-label">Group Name</label>
          <input
            className="form-inputs"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">City</label>
          <input
            className="form-inputs"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">State</label>
          <input
            className="form-inputs"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">About</label>
          <textarea
            className="form-inputs"
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
        </div>
        <div className="form-radio">
          <label htmlFor="online-option">Online</label>
          <input
            id="online-option"
            type="radio"
            value="online"
            checked={type === "Online"}
            onChange={() => setType("Online")}
          ></input>

          <label id="in-person" htmlFor="in-person-option">
            In person
          </label>
          <input
            id="in-person-option"
            type="radio"
            value="in-person"
            checked={type === "In person"}
            onChange={() => setType("In person")}
          ></input>
        </div>
        <div className="form-private-checkmark-container">
          <label htmlFor="private">Private: </label>
          <input
            type="checkbox"
            id="private"
            checked={privateVar}
            onChange={(e) => setPrivateVar((prevState) => !prevState)}
          />
        </div>
        <div className="form-end-button-container">
          <button
            className="form-submit-button create-cancel"
            type="submit"
            onClick={cancelForm}
          >
            Cancel
          </button>
          <button className="form-submit-button create-cancel" type="submit">
            {editPage ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAndUpdateGroup;

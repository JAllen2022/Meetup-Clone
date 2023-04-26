import EmptySearchIcon from "../../assets/SVGFiles/EmptySearchIcon";
import "./NoResults.css";

export default function NoResults({ tab }) {
  return (
    <div className="no-result-container">
      <EmptySearchIcon />
      <div className="no-results-text">
        Sorry, there are no {tab} results for
        "asdfl;kajsmsrhqkzmsrqhzkmsrqhzkmsqr" near you.
      </div>
    </div>
  );
}

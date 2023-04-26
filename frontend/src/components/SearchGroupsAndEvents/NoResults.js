import { useSelector } from "react-redux";
import EmptySearchIcon from "../../assets/SVGFiles/EmptySearchIcon";
import "./NoResults.css";

export default function NoResults({ tab }) {
  const searchText = useSelector((state) => state.search.searchText);
  return (
    <div className="no-result-container">
      <EmptySearchIcon />
      <div className="no-results-text">
        Sorry, there are no {tab} results for "{searchText}" near you.
      </div>
    </div>
  );
}

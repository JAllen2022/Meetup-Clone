import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./SearchBar.css";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import { setSearch } from "../../store/search";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const search = useSelector((state) => state.search.searchText);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the search term, like make an API call or navigate to a search results page
    dispatch(thunkGetAllEvents({ name: searchTerm }));
    dispatch(setSearch(searchTerm));
    history.push("/search/events");
    console.log(searchTerm);
  };

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search LinkUp..."
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
      />
      <button type="submit" className="search-bar-submit">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
}

export default SearchBar;

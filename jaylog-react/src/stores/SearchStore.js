import { useState } from "react";

const SearchStore = () => {
  const [search, setSearch] = useState("");

  return { search, setSearch };
};

export default SearchStore;

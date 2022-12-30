import { useState } from "react";

const UrlStore = () => {
  const [prevUrl, setPrevUrl] = useState("");

  return { prevUrl, setPrevUrl };
};

export default UrlStore;

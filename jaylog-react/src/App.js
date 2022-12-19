import ChangeInfo from "pages/ChangeInfo";
import Error404 from "pages/Error404";
import InsertPost from "pages/InsertPost";
import Join from "pages/Join";
import Login from "pages/Login";
import My from "pages/My";
import Post from "pages/Post";
import Posts from "pages/Posts";
import UpdatePost from "pages/UpdatePost";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "stores/RootStore";

const App = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/post/:postIdx" element={<Post />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/insert-post" element={<InsertPost />} />
          <Route path="/update-post/:postIdx" element={<UpdatePost />} />
          <Route path="/my" element={<My />} />
          <Route path="/change-info" element={<ChangeInfo />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;

// react-router-dom v6 버전의 라우팅은 AppNew.js 참고

import CommonLayout from "components/layouts/CommonLayout";
import Error404 from "pages/Error404";
import Post from "pages/Post";
import Posts from "pages/Posts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StoreProvider } from "stores/RootStore";

// 추후 성능 개선용으로 연구
// 같은 레이아웃이면 레이아웃을 재렌더링하지 않음

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CommonLayout isNavbar={true}>
        <Posts />
      </CommonLayout>
    ),
    errorElement: <Error404 />,
  },
  {
    path: "/post/:postIdx",
    element: (
      <CommonLayout isNavbar={true}>
        <Post />
      </CommonLayout>
    ),
    errorElement: <Error404 />,
  },

  // {
  //   path: "/",
  //   element: <CommonLayout isNavbar={true} />,
  //   errorElement: <Error404 />,
  //   children: [
  //     {
  //       index: true,
  //       element: <Posts />,
  //     },
  //     {
  //       path: "post/:postIdx",
  //       element: <Post />,
  //     },
  //   ],
  // },
  // {
  //   path: "/",
  //   element: <CommonLayout isNavbar={true} />,
  //   errorElement: <Error404 />,
  //   children: [
  //     {
  //       path: "1",
  //       element: <Posts />,
  //     },
  //     {
  //       path: "post/:postIdx",
  //       element: <Post />,
  //     },
  //   ],
  // },
]);

function AppNew() {
  return (
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  );
}

export default AppNew;

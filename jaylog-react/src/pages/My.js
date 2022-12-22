import MyCard from "components/commons/MyCard";
import CommonLayout from "components/layouts/CommonLayout";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "stores/RootStore";
import { customAxios } from "utils/CustomAxios";

const My = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const [myPostList, setMyPostList] = useState([]);
  const [likePostList, setLikePostList] = useState([]);

  // const [modalShow, setModalShow] = useState(false);

  // const handleModalShow = () => setModalShow(true);
  // const handleModalClose = () => setModalShow(false);
  // const modalCallback = (tokens) => {
  //   localStorage.setItem("accessToken", tokens.accessToken);
  //   localStorage.setItem("refreshToken", tokens.refreshToken);
  //   authStore.setLoginUserByToken(tokens.accessToken);
  //   handleModalClose();
  //   navigate("/change-info");
  // };

  const getMyInfo = () => {
    customAxios
      .privateAxios({
        method: `get`,
        url: `/api/v1/user/my`,
      })
      .then((response) => {
        if (response.status === 200) {
          setMyPostList(response.data.content.myPostList);
          setLikePostList(response.data.content.likePostList);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.detail != null) {
          alert(JSON.stringify(error.response.data.detail));
        } else if (error?.response?.data?.message != null) {
          alert(error.response.data.message);
        } else {
          alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (authStore.loginUser === null) {
      alert("로그인이 필요합니다.");
      navigate("/login", { replace: true });
    } else if (authStore.loginUser !== undefined) {
      getMyInfo();
    }
  }, [authStore]);

  return (
    <CommonLayout>
      {/* <CheckUserModal
        modalShow={modalShow}
        modalClose={handleModalClose}
        callback={modalCallback}
      /> */}
      {authStore.loginUser ? (
        <div>
          <Container>
            <Row className="row-cols-2 justify-content-center my-5">
              <Col>
                <div className="d-flex justify-content-center">
                  <img
                    src={authStore.loginUser.profileImage}
                    className="ratio ratio-1x1 rounded-circle"
                    style={{ width: "100px", height: "100px" }}
                    alt="profile"
                  />
                </div>
              </Col>
              <Col>
                <h2>{authStore.loginUser.id}</h2>
                <p>{authStore.loginUser.simpleDesc}</p>
                {/* <Anchor
                  href="#"
                  style={{ color: "#20c997" }}
                  onClick={handleModalShow}
                >
                  내 정보 수정
                </Anchor> */}
                <Link to="/change-info" style={{ color: "#20c997" }}>
                  내 정보 수정
                </Link>
              </Col>
            </Row>
            <hr className="border-3 border-top" />
          </Container>
          <Container className="mt-5">
            <Row className="row-cols-1 row-cols-md-2">
              <Col>
                <h5 className="text-center">내 글</h5>
                <Row className="row-cols-1 card-group my-5">
                  {myPostList.map((post, index) => (
                    <MyCard key={index} post={post} />
                  ))}
                </Row>
              </Col>
              <Col>
                <h5 className="text-center">내가 좋아요 한 글</h5>
                <Row className="row-cols-1 card-group my-5">
                  {likePostList.map((post, index) => (
                    <MyCard key={index} post={post} />
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        ""
      )}
    </CommonLayout>
  );
};

export default My;

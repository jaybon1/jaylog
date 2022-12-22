import { Viewer } from "@toast-ui/react-editor";
import LikeRedImg from "assets/img/like-red.svg";
import LikeImg from "assets/img/like.svg";
import CommonLayout from "components/layouts/CommonLayout";
import produce from "immer";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore, useUrlStore } from "stores/RootStore";
import { customAxios } from "utils/CustomAxios";

const Post = () => {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { postIdx } = useParams();
  const authStore = useAuthStore();
  const urlStore = useUrlStore();

  const clickLikeCount = () => {
    if (authStore.loginUser == null) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (authStore.loginUser.idx === post.writer.idx) {
      alert("자신의 글은 좋아요를 누를 수 없습니다.");
      return;
    }

    if (isNaN(postIdx)) {
      alert("잘못된 접근입니다.");
      return;
    }

    customAxios
      .privateAxios({
        method: `post`,
        url: `api/v1/posts/like/${postIdx}`,
      })
      .then((response) => {
        if (response.status === 200) {
          setPost(
            produce((draft) => {
              draft.likeCount = response.data.content.likeCount;
              draft.likeClicked = response.data.content.likeClicked;
            })
          );
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
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

  const getPost = useCallback(() => {
    if (isNaN(postIdx)) {
      alert("잘못된 접근입니다.");
      return;
    }

    const selectedAxios =
      authStore.loginUser != null
        ? customAxios.privateAxios
        : customAxios.publicAxios;

    selectedAxios({
      method: `get`,
      url: `/api/v1/posts/${postIdx}`,
    })
      .then((response) => {
        if (response.status === 200) {
          setPost(response.data.content);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.detail != null) {
          alert(JSON.stringify(error.response.data.detail));
        } else if (error?.response?.data?.message != null) {
          alert(error.response.data.message);
        } else {
          alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
      })
      .finally(() => {});
  }, [authStore, postIdx]);

  const deletePost = () => {
    if (isNaN(postIdx)) {
      alert("잘못된 접근입니다.");
      return;
    }

    // https://studyingych.tistory.com/62
    // confirm 실사용 시 위처럼 구현하여 사용할 것
    if (window.confirm("정말 삭제하시겠습니까?") === false) return;

    customAxios
      .privateAxios({
        method: `delete`,
        url: `/api/v1/posts/${postIdx}`,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("삭제되었습니다.");
          goBack();
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
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

  const goBack = () => {
    if (urlStore.prevUrl.includes("/my")) {
      navigate("/my", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (authStore.loginUser !== undefined) {
      getPost();
    }
  }, [authStore, getPost]);

  // useMemo useCallback 최적화 관련글
  // https://haragoo30.medium.com/usememo-usecallback%EC%9D%84-%EC%96%B8%EC%A0%9C-%EC%8D%A8%EC%95%BC%EB%90%98%EB%82%98-6a5e6f30f759
  // https://velog.io/@hyunjine/React-Rendering-Optimization

  return (
    <CommonLayout>
      {post != null ? (
        <Container className="p-5">
          <h1>제목</h1>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span>
                <Image
                  src={post?.writer.profileImage}
                  className="ratio ratio-1x1 rounded-circle me-2"
                  style={{ width: "20px", height: "20px" }}
                  alt="profile"
                />
                <strong>{post?.writer.id}</strong>
              </span>
              <span className="text-black-50 fw-light ms-3">
                {post?.createDate}
              </span>
            </div>
            <button id="likeButton" className="btn" onClick={clickLikeCount}>
              <Image
                src={post?.likeClicked ? LikeRedImg : LikeImg}
                width="15"
                alt="좋아요"
              />
              <span id="likeCount" className="mx-2 fs-6 text-black-50 fw-light">
                {post?.likeCount}
              </span>
            </button>
            {authStore.loginUser?.idx != null &&
            authStore.loginUser?.idx === post?.writer.idx ? (
              <div>
                <Button
                  variant="outline-success"
                  type="button"
                  onClick={() => {
                    navigate(`/update-post/${postIdx}`);
                  }}
                >
                  수정
                </Button>
                <Button
                  variant="outline-danger"
                  className="ms-2"
                  type="button"
                  onClick={deletePost}
                >
                  삭제
                </Button>
              </div>
            ) : null}
          </div>
          <div style={{ marginTop: "100px" }}></div>
          {post ? <Viewer initialValue={post.content} /> : null}
          <Row className="mt-5">
            <Col className="d-flex justify-content-center">
              <Button variant="outline-dark" type="button" onClick={goBack}>
                목록으로
              </Button>
            </Col>
          </Row>
        </Container>
      ) : null}
    </CommonLayout>
  );
};

export default Post;

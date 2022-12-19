import { Viewer } from "@toast-ui/react-editor";
import LikeImg from "assets/img/like.svg";
import LikeRedImg from "assets/img/like-red.svg";
import CommonLayout from "components/layouts/CommonLayout";
import { useCallback, useEffect, useState } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAuthStore } from "stores/RootStore";
import { customAxios } from "utils/CustomAxios";
import produce from "immer";

const Post = () => {
  const [post, setPost] = useState(null);
  const { postIdx } = useParams();
  const authStore = useAuthStore();

  const clickLikeCount = useCallback(() => {
    if (authStore.loginUser == null) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (authStore.loginUser.idx === post.writer.idx) {
      alert("자신의 글은 좋아요를 누를 수 없습니다.");
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
  }, [authStore, post, postIdx]);

  const getPost = useCallback(() => {
    const selectedAxios =
      localStorage.getItem("accessToken") != null
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
  }, [postIdx]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  return (
    <CommonLayout isNavbar={true}>
      <Container className="ps-5 pe-5 my-5">
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
              <Button variant="outline-success" type="button">
                수정
              </Button>
              <Button variant="outline-danger" className="ms-2" type="button">
                삭제
              </Button>
            </div>
          ) : null}
        </div>
        {post ? <Viewer initialValue={post.content} /> : null}
      </Container>
    </CommonLayout>
  );
};

export default Post;

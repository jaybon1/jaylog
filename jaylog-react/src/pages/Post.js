import { Viewer } from "@toast-ui/react-editor";
import LikeImg from "assets/img/like.svg";
import CommonLayout from "components/layouts/CommonLayout";
import { Button, Container, Image } from "react-bootstrap";

const Post = () => {
  return (
    <CommonLayout isNavbar={true}>
      <Container className="ps-5 pe-5 my-5">
        <h1>제목</h1>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span>
              <Image
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                className="ratio ratio-1x1 rounded-circle me-2"
                style={{ width: "20px", height: "20px" }}
                alt="profile"
              />
              <strong>작성자</strong>
            </span>
            <span className="text-black-50 fw-light ms-3">2022-11-22</span>
          </div>
          <button id="likeButton" className="btn">
            <Image src={LikeImg} width="15" />
            <span id="likeCount" className="mx-2 fs-6 text-black-50 fw-light">
              0
            </span>
          </button>
          <div>
            <Button variant="outline-success" type="button">
              수정
            </Button>
            <Button variant="outline-danger" className="ms-2" type="button">
              삭제
            </Button>
          </div>
        </div>
        <Viewer initialValue="내용" />
      </Container>
    </CommonLayout>
  );
};

export default Post;

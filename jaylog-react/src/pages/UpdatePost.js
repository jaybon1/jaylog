import { Editor } from "@toast-ui/react-editor";
import ExitImg from "assets/img/exit.svg";
import CommonLayout from "components/layouts/CommonLayout";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "stores/RootStore";
import { customAxios } from "utils/CustomAxios";

const UpdatePost = () => {
  const refs = useRef({
    title: null,
    /** @type {Editor} editor */
    editor: null,
  });

  const { postIdx } = useParams();
  const authStore = useAuthStore();

  const [editorHeight, setEditorHeight] = useState(0);

  const getPost = () => {
    if (isNaN(postIdx)) {
      alert("잘못된 접근입니다.");
      return;
    }

    customAxios
      .privateAxios({
        method: `get`,
        url: `/api/v1/posts/${postIdx}?update=true`,
      })
      .then((response) => {
        if (response.status === 200) {
          refs.current.title.value = response.data.content.title;
          refs.current.editor
            .getInstance()
            .setMarkdown(response.data.content.content);
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

  useEffect(() => {
    refs.current.editor.getInstance().setMarkdown("");
    setEditorHeight(`${window.innerHeight - 190}px`);
    window.addEventListener("resize", () =>
      setEditorHeight(`${window.innerHeight - 190}px`)
    );
  }, []);

  useEffect(() => {
    if (authStore.loginUser != null) {
      getPost();
    }
  }, [authStore]);

  return (
    <CommonLayout>
      <Row>
        <Col>
          <Form.Control
            ref={(el) => (refs.current.title = el)}
            className="border-0 w-100 fs-1 mt-3 mb-3"
            type="text"
            placeholder="제목을 입력하세요"
          />
        </Col>
      </Row>
      <Editor
        ref={(el) => (refs.current.editor = el)}
        previewStyle="vertical"
        initialEditType="markdown"
        height={editorHeight}
      />
      <Row className="row fixed-bottom p-3 bg-white shadow-lg">
        <Col className="me-auto">
          <Link
            to={`/post/${postIdx}`}
            replace={true}
            className="text-decoration-none text-dark"
          >
            <Image src={ExitImg} />
            <span className="m-2">나가기</span>
          </Link>
        </Col>
        <Col className="col-auto">
          <Button
            className="btn-light fw-bold text-white"
            type="button"
            style={{ backgroundColor: "#20c997" }}
          >
            수정하기
          </Button>
        </Col>
      </Row>
    </CommonLayout>
  );
};

export default UpdatePost;

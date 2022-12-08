import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import ExitImg from "assets/img/exit.svg";
import CommonLayout from "components/layouts/CommonLayout";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const InsertPost = () => {
  const navigate = useNavigate();

  const refs = useRef({
    title: null,
    /** @type Editor editor */
    editor: null,
  });

  const [editorHeight, setEditorHeight] = useState(0);

  const checkLogin = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        jwtDecode(accessToken);
      } catch (e) {
        alert("잘못된 접근입니다.");
        localStorage.removeItem("accessToken");
        navigate("/", { replace: true });
      }
    }
  };

  // 임시저장 함수
  const tempSave = () => {
    const tempPost = {
      title: refs.current.title.value,
      content: refs.current.editor.getMarkdown(),
    };

    localStorage.setItem("tempPost", JSON.stringify(tempPost));
    alert("임시저장되었습니다.");
  };

  // 글작성 페이지 이동시 임시저장된 글이 있으면 불러오기
  const tempPostCheck = () => {
    const tempPost = localStorage.getItem("tempPost");
    if (tempPost != null) {
      if (window.confirm("임시저장된 글이 있습니다. 불러오시겠습니까?")) {
        const tempPost = JSON.parse(localStorage.getItem("tempPost"));
        refs.current.title.value = tempPost.title;
        refs.current.editor.setMarkdown(tempPost.content);
      } else {
        localStorage.removeItem("tempPost");
      }
    }
  };

  // 글 저장시 유효성 검사 함수
  const validateFields = () => {
    const titleElement = refs.current.title;
    const content = refs.current.editor.getMarkdown();

    if (titleElement.value == "") {
      alert("제목을 입력하세요.");
      return false;
    }

    if (content == "") {
      alert("내용을 입력하세요.");
      return false;
    }

    return true;
  };

  // 글 저장 함수
  const insertPost = () => {
    if (!validateFields()) {
      return;
    }

    const titleElement = refs.current.title;
    const content = refs.current.editor.getMarkdown();

    // 정규표현식을 이용한 태그 제거
    const markdownImageRegex = /\[.*\]\((.*)\)/gi;
    const markdownRegex = /(\*|_|#|`|~|>|!|\[|\]|\(|\)|\{|\}|\||\\)/gi;

    const summary = content
      .replace(markdownImageRegex, "")
      .replace(markdownRegex, "")
      .substring(0, 151);

    const imageList = content.match(markdownImageRegex);
    const thumbnailMarkdown = imageList != null ? imageList[0] : null;

    const thumbnail = thumbnailMarkdown
      ? thumbnailMarkdown.substring(
          thumbnailMarkdown.indexOf("](") + 2,
          thumbnailMarkdown.length - 1
        )
      : null;

    // post 객체 생성
    const post = {
      title: titleElement.value,
      thumbnail: thumbnail,
      content: content,
      summary: summary,
      // userIdx: loginUser.idx,
    };

    alert("저장되었습니다.");

    // location.replace("./index.html");
  };

  useEffect(() => {
    refs.current.editor.getInstance().setMarkdown("");
    setEditorHeight(`${window.innerHeight - 190}px`);
    window.addEventListener("resize", () =>
      setEditorHeight(`${window.innerHeight - 190}px`)
    );
    checkLogin();
    tempPostCheck();
  }, []);

  // useEffect(() => {
  //   refs.current.editor
  //     .getInstance()
  //     .setHeight(`${window.innerHeight - 190}px`);
  //   window.addEventListener("resize", () => {
  //     refs.current.editor
  //       .getInstance()
  //       .setHeight(`${window.innerHeight - 190}px`);
  //   });
  // }, []);

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
          <Link to={-1} className="text-decoration-none text-dark">
            <Image src={ExitImg} />
            <span className="m-2">나가기</span>
          </Link>
        </Col>
        <Col className="col-auto">
          <Button
            className="btn-light fw-bold"
            type="button"
            onClick={tempSave}
          >
            임시저장
          </Button>
        </Col>
        <Col className="col-auto">
          <Button
            className="btn-light fw-bold text-white"
            type="button"
            style={{ backgroundColor: "#20c997" }}
          >
            게시하기
          </Button>
        </Col>
      </Row>
    </CommonLayout>
  );
};

export default InsertPost;

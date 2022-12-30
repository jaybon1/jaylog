import { Editor } from "@toast-ui/react-editor";
import ExitImg from "assets/img/exit.svg";
import WriteLayout from "components/layouts/WriteLayout";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "stores/RootStore";
import usePendingFunction from "use/usePendingFunction";
import { customAxios } from "utils/CustomAxios";

const UpdatePost = () => {
  const refs = useRef({
    title: null,
    /** @type {Editor} editor */
    editor: null,
  });

  const navigate = useNavigate();
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
        if (response?.status === 200) {
          refs.current.title.value = response.data.content.title;
          refs.current.editor
            .getInstance()
            .setMarkdown(response.data.content.content);
        }
      });
  };

  // 글 저장시 유효성 검사 함수
  const validateFields = () => {
    const titleElement = refs.current.title;
    const content = refs.current.editor.getInstance().getMarkdown();

    if (titleElement.value === "") {
      alert("제목을 입력하세요.");
      return false;
    }

    if (content === "") {
      alert("내용을 입력하세요.");
      return false;
    }

    return true;
  };

  // 글 수정 함수
  const [updatePost, isPending] = usePendingFunction(async () => {
    if (!validateFields()) {
      return;
    }

    const titleElement = refs.current.title;
    const content = refs.current.editor.getInstance().getMarkdown();

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
    };

    // post 객체를 서버로 전송
    await customAxios
      .privateAxios({
        method: `put`,
        url: `/api/v1/posts/${postIdx}`,
        data: post,
      })
      .then((response) => {
        if (response?.status === 200) {
          alert("수정되었습니다.");
          navigate(`/post/${postIdx}`, { replace: true });
        }
      });
  });

  useEffect(() => {
    refs.current.editor.getInstance().setMarkdown("");
    setEditorHeight(`${window.innerHeight - 190}px`);
    window.addEventListener("resize", () =>
      setEditorHeight(`${window.innerHeight - 190}px`)
    );
  }, []);

  useEffect(() => {
    if (authStore.loginUser === null) {
      alert("로그인이 필요합니다.");
      navigate("/login", { replace: true });
    } else if (authStore.loginUser !== undefined) {
      getPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WriteLayout>
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
            onClick={updatePost}
            disabled={isPending}
          >
            수정하기
          </Button>
        </Col>
      </Row>
    </WriteLayout>
  );
};

export default UpdatePost;

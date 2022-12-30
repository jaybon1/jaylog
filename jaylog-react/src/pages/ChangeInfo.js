import CheckUserModal from "components/commons/CheckUserModal";
import UserInfoLayout from "components/layouts/UserInfoLayout";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "stores/RootStore";
import usePendingFunction from "use/usePendingFunction";
import { customAxios } from "utils/CustomAxios";

const ChangeInfo = () => {
  const refs = useRef({
    profileImageElement: null,
    fileElement: null,
    pwElement: null,
    pw2Element: null,
    simpleDescElement: null,
  });
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const [modalShow, setModalShow] = useState(true);
  const handleModalClose = () => {
    navigate("/my", { replace: true });
  };
  const modalCallback = (tokens) => {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    authStore.setLoginUserByToken(tokens.accessToken);
    setModalShow(false);
  };

  const setDefaultProfileImg = () => {
    refs.current.profileImageElement.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  };

  const setChangeProfileImg = () => {
    const fileElement = refs.current.fileElement;

    if (fileElement.files && fileElement.files[0]) {
      const myFile = fileElement.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        refs.current.profileImageElement.setAttribute("src", e.target.result);
      };

      reader.readAsDataURL(myFile);
    }
  };

  const validateFields = () => {
    const { pwElement, pw2Element } = refs.current;

    if (pwElement.value !== pw2Element.value) {
      alert("비밀번호가 일치하지 않습니다.");
      pw2Element.focus();
      return false;
    }

    return true;
  };

  const [requestChangeInfo, isPending] = usePendingFunction(async () => {
    if (!validateFields()) {
      return;
    }

    const user = {
      profileImage: refs.current.profileImageElement.src,
      password: refs.current.pwElement.value
        ? refs.current.pwElement.value
        : null,
      simpleDesc: refs.current.simpleDescElement.value,
    };

    await customAxios
      .privateAxios({
        method: `put`,
        url: `/api/v1/user/change`,
        data: user,
      })
      .then((response) => {
        if (response?.status === 200) {
          alert(response.data.message);
          navigate("/login", { replace: true });
        }
      });
  });

  useEffect(() => {
    if (authStore.loginUser === null) {
      alert("로그인이 필요합니다.");
      navigate("/login", { replace: true });
    }
  }, [authStore, navigate]);

  if (modalShow || authStore.loginUser == null) {
    return (
      <CheckUserModal
        modalShow={modalShow}
        modalClose={handleModalClose}
        callback={modalCallback}
      />
    );
  }

  return (
    <UserInfoLayout isNavbar={true}>
      <Card className="shadow-2-strong" style={{ borderRadius: "1rem" }}>
        <Card.Body className="p-5 text-center">
          <h3 className="mb-3">내 정보 수정</h3>
          <div className="d-flex justify-content-center">
            <span>
              <Image
                ref={(el) => (refs.current.profileImageElement = el)}
                src={authStore.loginUser.profileImage}
                className="ratio ratio-1x1 rounded-circle"
                style={{ width: "100px", height: "100px" }}
                alt="profile"
              />
              <Form.Control
                ref={(el) => (refs.current.fileElement = el)}
                type="file"
                accept="image/*"
                className="mt-3 mb-3"
                style={{ width: "100%" }}
                onClick={setDefaultProfileImg}
                onChange={setChangeProfileImg}
              />
            </span>
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="idAddOn">아이디</InputGroup.Text>
            <Form.Control
              defaultValue={authStore.loginUser.id}
              type="text"
              aria-describedby="idAddOn"
              disabled
            />
          </InputGroup>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="pwAddOn">새 비밀번호</InputGroup.Text>
                <Form.Control
                  ref={(el) => (refs.current.pwElement = el)}
                  type="password"
                  aria-describedby="pwAddOn"
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="pw2AddOn">비번확인</InputGroup.Text>
                <Form.Control
                  ref={(el) => (refs.current.pw2Element = el)}
                  type="password"
                  aria-describedby="pw2AddOn"
                />
              </InputGroup>
            </Col>
          </Row>
          <InputGroup className="mb-3">
            <InputGroup.Text id="simpleDescAddOn">한 줄 소개</InputGroup.Text>
            <Form.Control
              ref={(el) => (refs.current.simpleDescElement = el)}
              type="text"
              defaultValue={authStore.loginUser.simpleDesc}
              aria-describedby="simpleDescAddOn"
            />
          </InputGroup>
          <Row>
            <Col>
              <Button
                variant="outline-primary"
                type="button"
                style={{ width: "100%" }}
                onClick={() => navigate("/my", { replace: true })}
              >
                취소
              </Button>
            </Col>
            <Col className="col-8">
              <Button
                className="btn-primary"
                type="button"
                style={{ width: "100%" }}
                onClick={requestChangeInfo}
                disabled={isPending}
              >
                수정하기
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </UserInfoLayout>
  );
};

export default ChangeInfo;

import JaylogImg from "assets/img/jaylog.png";
import UserInfoLayout from "components/layouts/UserInfoLayout";
import { useEffect, useRef } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "stores/RootStore";
import usePendingFunction from "use/usePendingFunction";
import { customAxios } from "utils/CustomAxios";

const Login = () => {
  const refs = useRef({
    idElement: null,
    pwElement: null,
    rememberMeElement: null,
  });

  const authStore = useAuthStore();
  const navigate = useNavigate();

  const validateFields = () => {
    if (refs.current.idElement.value === "") {
      alert("아이디를 입력해주세요.");
      refs.current.idElement.focus();
      return false;
    }

    if (refs.current.pwElement.value === "") {
      alert("비밀번호를 입력해주세요.");
      refs.current.pwElement.focus();
      return false;
    }

    return true;
  };

  const [requestLogin, isPending] = usePendingFunction(async () => {
    if (!validateFields()) {
      return;
    }

    const { idElement, pwElement, rememberMeElement } = refs.current;

    const loginUser = {
      id: idElement.value,
      password: pwElement.value,
    };

    await customAxios
      .publicAxios({
        method: `post`,
        url: `/api/v1/sign/in`,
        data: loginUser,
      })
      .then((response) => {
        if (response.status === 200) {
          if (rememberMeElement.checked) {
            localStorage.setItem("rememberId", JSON.stringify(idElement.value));
          } else {
            localStorage.removeItem("rememberId");
          }
          const content = response.data.content;
          localStorage.setItem("accessToken", content.accessToken);
          localStorage.setItem("refreshToken", content.refreshToken);
          authStore.setLoginUserByToken(content.accessToken);
          navigate("/");
        }
      });
  });

  const enterKeyLogin = (event) => {
    if (event.keyCode === 13) {
      requestLogin();
    }
  };

  const setLoginPage = () => {
    refs.current.idElement.focus();
    const rememberId = JSON.parse(localStorage.getItem("rememberId"));
    if (rememberId !== null) {
      refs.current.idElement.value = rememberId;
      refs.current.rememberMeElement.checked = true;
    }
  };

  useEffect(() => {
    setLoginPage();
  }, []);

  useEffect(() => {
    authStore.setLoginUser(null);
  }, [authStore]);

  return (
    <UserInfoLayout isNavbar={true}>
      <Card className="shadow-2-strong" style={{ borderRadius: "1rem" }}>
        <Card.Body className="p-5 text-center">
          <h3 className="mb-3">
            <img src={JaylogImg} style={{ height: "100px" }} alt="jaylog"></img>
          </h3>
          <InputGroup className="mb-3">
            <InputGroup.Text id="idAddOn">&nbsp;아이디 &nbsp;</InputGroup.Text>
            <Form.Control
              ref={(el) => (refs.current.idElement = el)}
              type="text"
              aria-describedby="idAddOn"
            />
          </InputGroup>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="idAddOn">비밀번호</InputGroup.Text>
                <Form.Control
                  ref={(el) => (refs.current.pwElement = el)}
                  type="password"
                  onKeyUp={enterKeyLogin}
                />
              </InputGroup>
            </Col>
          </Row>
          <Form.Group className="d-flex justify-content-start mb-4">
            <Form.Check
              type="checkbox"
              ref={(el) => (refs.current.rememberMeElement = el)}
              label="아이디 기억하기"
            ></Form.Check>
          </Form.Group>
          <Button
            className="btn-primary"
            type="button"
            style={{ width: "100%" }}
            onClick={requestLogin}
            disabled={isPending}
          >
            로그인
          </Button>
          <hr className="my-4" />
          <Link to="/join">아이디가 없으신가요? 회원가입</Link>
        </Card.Body>
      </Card>
    </UserInfoLayout>
  );
};

export default Login;

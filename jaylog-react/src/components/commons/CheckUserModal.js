import { useRef } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { customAxios } from "utils/CustomAxios";

const CheckUserModal = ({ modalShow, modalClose, callback }) => {
  const refs = useRef({
    pwElement: null,
  });

  const validateFields = () => {
    if (refs.current.pwElement.value === "") {
      alert("비밀번호를 입력해주세요.");
      refs.current.pwElement.focus();
      return false;
    }

    return true;
  };

  const requestCheckUser = () => {
    if (!validateFields()) {
      return;
    }

    const checkUser = {
      password: refs.current.pwElement.value,
    };

    customAxios
      .privateAxios({
        method: `post`,
        url: `/api/v1/sign/check`,
        data: checkUser,
      })
      .then((response) => {
        if (response.status === 200) {
          callback(response.data.content);
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

  const enterKeyLogin = (event) => {
    if (event.keyCode === 13) {
      requestCheckUser();
    }
  };

  return (
    <Modal
      show={modalShow}
      onHide={modalClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>본인 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text id="idAddOn">비밀번호</InputGroup.Text>
          <Form.Control
            ref={(el) => (refs.current.pwElement = el)}
            type="password"
            onKeyUp={enterKeyLogin}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={modalClose}>
          취소
        </Button>
        <Button variant="primary" onClick={requestCheckUser}>
          체크
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckUserModal;

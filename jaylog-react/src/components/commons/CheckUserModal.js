import { useEffect, useRef } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useAuthStore } from "stores/RootStore";
import usePendingFunction from "use/usePendingFunction";
import { customAxios } from "utils/CustomAxios";

const CheckUserModal = ({ modalShow, modalClose, callback }) => {
  const refs = useRef({
    idElement: null,
    pwElement: null,
  });

  const authStore = useAuthStore();

  const validateFields = () => {
    if (refs.current.pwElement.value === "") {
      alert("비밀번호를 입력해주세요.");
      refs.current.pwElement.focus();
      return false;
    }

    return true;
  };

  const [requestCheckUser, isPending] = usePendingFunction(async () => {
    if (!validateFields()) {
      return;
    }

    const checkUser = {
      password: refs.current.pwElement.value,
    };

    await customAxios
      .privateAxios({
        method: `post`,
        url: `/api/v1/sign/check`,
        data: checkUser,
      })
      .then((response) => {
        if (response?.status === 200) {
          callback(response.data.content);
        }
      });
  });

  const enterKeyCheckUser = (event) => {
    if (event.keyCode === 13) {
      requestCheckUser();
    }
  };

  useEffect(() => {
    if (authStore.loginUser != null) {
      refs.current.idElement.value = authStore.loginUser.id;
    }
  }, [authStore]);

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
          <InputGroup.Text>아이디</InputGroup.Text>
          <Form.Control
            ref={(el) => (refs.current.idElement = el)}
            type="text"
            disabled
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>비밀번호</InputGroup.Text>
          <Form.Control
            ref={(el) => (refs.current.pwElement = el)}
            type="password"
            onKeyUp={enterKeyCheckUser}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={modalClose}>
          취소
        </Button>
        <Button
          variant="primary"
          onClick={requestCheckUser}
          disabled={isPending}
        >
          체크
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckUserModal;

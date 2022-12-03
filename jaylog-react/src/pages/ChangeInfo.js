import UserInfoLayout from "components/layouts/UserInfoLayout";
import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";

const ChangeInfo = () => {
  return (
    <UserInfoLayout isNavbar={true}>
      <Card className="shadow-2-strong" style={{ borderRadius: "1rem" }}>
        <Card.Body className="p-5 text-center">
          <h3 className="mb-3">내 정보 수정</h3>
          <div className="d-flex justify-content-center">
            <span>
              <Image
                id="userProfileImg"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                class="ratio ratio-1x1 rounded-circle"
                style={{ width: "100px", height: "100px" }}
                alt="profile"
              />
              <Form.Control
                type="file"
                className="mt-3 mb-3"
                style={{ width: "100%" }}
              />
            </span>
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="idAddOn">아이디</InputGroup.Text>
            <Form.Control type="text" aria-describedby="idAddOn" disabled />
          </InputGroup>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="pwAddOn">비밀번호</InputGroup.Text>
                <Form.Control type="password" aria-describedby="pwAddOn" />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="pw2AddOn">비번확인</InputGroup.Text>
                <Form.Control type="password" aria-describedby="pw2AddOn" />
              </InputGroup>
            </Col>
          </Row>
          <InputGroup className="mb-3">
            <InputGroup.Text id="simpleDescAddOn">한 줄 소개</InputGroup.Text>
            <Form.Control type="text" aria-describedby="simpleDescAddOn" />
          </InputGroup>
          <Button className="btn-primary" style={{ width: "100%" }}>
            회원가입
          </Button>
        </Card.Body>
      </Card>
    </UserInfoLayout>
  );
};

export default ChangeInfo;

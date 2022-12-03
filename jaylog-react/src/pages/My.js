import MyCard from "components/commons/MyCard";
import CommonLayout from "components/layouts/CommonLayout";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const My = () => {
  const tempList = [1, 2, 3];

  return (
    <CommonLayout isNavbar={true}>
      <Container>
        <Row className="row-cols-2 justify-content-center my-5">
          <Col>
            <div className="d-flex justify-content-center">
              <img
                id="userProfileImg"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                class="ratio ratio-1x1 rounded-circle"
                style={{ width: "100px", height: "100px" }}
                alt="profile"
              />
            </div>
          </Col>

          <Col>
            <h2>내 아이디</h2>
            <p id="userSimpleDesc">한 줄 소개</p>
            <Link to="" style={{ color: "#20c997" }}>
              내 정보 수정
            </Link>
          </Col>
        </Row>
        <hr className="border-3 border-top" />
      </Container>
      <Container className="mt-5">
        <Row className="row-cols-1 row-cols-md-2">
          <Col>
            <h5 className="text-center">내 글</h5>
            <Row className="row-cols-1 card-group my-5">
              {tempList.map((item, index) => (
                <MyCard key={index} item={item} />
              ))}
            </Row>
          </Col>
          <Col>
            <h5 className="text-center">내가 좋아요 한 글</h5>
            <Row className="row-cols-1 card-group my-5">
              {tempList.map((item, index) => (
                <MyCard key={index} item={item} />
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </CommonLayout>
  );
};

export default My;

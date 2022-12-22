import LikeImg from "assets/img/like.svg";
import NoimageImg from "assets/img/no-image.png";
import React from "react";
import { Card, Col, Image, InputGroup, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useUrlStore } from "stores/RootStore";

const MyCard = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlStore = useUrlStore();

  /** @type {React.CSSProperties} jaybonCardContainer */
  const jaybonCardContainer = {
    height: "150px",
    overflow: "hidden",
  };

  /** @type {React.CSSProperties} jaybonCardImg */
  const jaybonCardImg = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  };

  /** @type {React.CSSProperties} jaybonCardText */
  const jaybonCardText = {
    display: "-webkit-box",
    wordWrap: "break-word",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    height: "100px",
  };

  /** @type {React.CSSProperties} jaybonCardText */
  const jaybonTitle = {
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  return (
    <Col>
      <Card className="m-3">
        <div style={jaybonCardContainer}>
          <Card.Img
            variant="top"
            src={post.thumbnail ? post.thumbnail : NoimageImg}
            style={jaybonCardImg}
            alt="..."
          />
        </div>
        <Card.Body>
          <Card.Title
            onClick={() => {
              urlStore.setPrevUrl(location.pathname);
              navigate(`/post/${post.idx}`);
            }}
            style={jaybonTitle}
          >
            {post.title}
          </Card.Title>
          <Card.Text style={jaybonCardText}>{post.summary}</Card.Text>
          <small className="text-muted">{post.createDate}</small>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col>
              <InputGroup>
                <Image
                  src={post.writer.profileImage}
                  alt="profile"
                  className="ratio ratio-1x1 rounded-circle me-2"
                  style={{ width: "24px", height: "24px" }}
                />
                <strong>{post.writer.id}</strong>
              </InputGroup>
            </Col>
            <Col className="col-auto">
              <InputGroup>
                <Image src={LikeImg} width="15" />
                <span className="mx-2 fs-6 text-black-50 fw-light">
                  {post.likeCount}
                </span>
              </InputGroup>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default MyCard;

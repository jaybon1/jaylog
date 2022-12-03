-- jaylog.`User` definition

CREATE TABLE `User` (
  `idx` int(11) NOT NULL AUTO_INCREMENT COMMENT '기본 키',
  `id` varchar(100) NOT NULL COMMENT '유저 아이디',
  `password` varchar(100) NOT NULL COMMENT '유저 비밀번호',
  `simple_desc` varchar(200) DEFAULT NULL COMMENT '한 줄 소개',
  `profile_image` mediumtext DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' COMMENT '프로필 이미지',
  `role` varchar(100) NOT NULL DEFAULT 'BLOGER' COMMENT '유저 등급',
  `create_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` datetime DEFAULT NULL COMMENT '수정일',
  `delete_date` datetime DEFAULT NULL COMMENT '삭제일',
  PRIMARY KEY (`idx`),
  UNIQUE KEY `User_id_UN` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- jaylog.Post definition

CREATE TABLE `Post` (
  `idx` int(11) NOT NULL AUTO_INCREMENT COMMENT '기본키',
  `title` varchar(200) NOT NULL COMMENT '글 제목',
  `thumbnail` mediumtext DEFAULT NULL COMMENT '썸네일',
  `content` longtext NOT NULL COMMENT '내용',
  `summary` varchar(152) DEFAULT NULL COMMENT '요약',
  `user_idx` int(11) NOT NULL COMMENT '작성자 User idx',
  `create_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` datetime DEFAULT NULL COMMENT '수정일',
  `delete_date` datetime DEFAULT NULL COMMENT '삭제일',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- jaylog.`Like` definition

CREATE TABLE `Like` (
  `idx` int(11) NOT NULL AUTO_INCREMENT COMMENT '기본키',
  `post_idx` int(11) NOT NULL COMMENT '글 번호',
  `user_idx` int(11) NOT NULL COMMENT '좋아요 누른사람',
  `create_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` datetime DEFAULT NULL COMMENT '수정일',
  `delete_date` datetime DEFAULT NULL COMMENT '삭제일',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
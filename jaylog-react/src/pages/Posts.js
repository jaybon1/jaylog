import MyCard from "components/commons/MyCard";
import CommonLayout from "components/layouts/CommonLayout";
import { useEffect, useState } from "react";
import { CardGroup, Container } from "react-bootstrap";
import { useSearchStore } from "stores/RootStore";
import usePendingFunction from "use/usePendingFunction";
import { customAxios } from "utils/CustomAxios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const searchStore = useSearchStore();

  const [getPosts] = usePendingFunction(async () => {
    await customAxios
      .publicAxios({
        method: `get`,
        url: `/api/v1/posts?search=${searchStore.search}`,
      })
      .then((response) => {
        if (response?.status === 200) {
          setPosts(response.data.content);
        }
      });
  }, 500);

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStore.search]);

  return (
    <CommonLayout>
      <Container className="mt-3">
        <CardGroup className="jaybon-card-group row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4">
          {posts.map((post, index) => (
            <MyCard key={index} post={post} />
          ))}
        </CardGroup>
      </Container>
    </CommonLayout>
  );
};

export default Posts;

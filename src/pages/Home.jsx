import React, { useEffect, useState, useTransition } from "react";
// import AnimationLine from "../components/common/AnimationLine";
import StoryCard from "../components/core/home/StoryCard";
import PostsCard from "../components/common/postcard/PostsCard";
import { getAllPosts } from "../services/operations/postAPi";
import { useSelector } from "react-redux";

const Home = () => {
  const { token, user } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const result = await getAllPosts();
    if (result.success) {
      setPosts(result.data);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="min-h-screen max-w-[900px] mx-auto p-4">
      <section className="flex flex-col justify-between gap-6 mt-6 ">
        <StoryCard />

        <div className="flex flex-col gap-20 mt-20 mx-auto w-full">
          {posts?.length !== 0 ? (
            posts?.map((post) => (
              <PostsCard
                key={post._id}
                userOfPost={post.user}
                postDetail={post}
                setPosts={setPosts}
                token={token}
                currentUser={user}
                isInProfile={user ? true : false}
              />
            ))
          ) : (
            <p>No posts to show</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

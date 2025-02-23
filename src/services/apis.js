const BASE_URL = import.meta.env.VITE_BASE_URL;

const loginAPiEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  SIGNUP_API: BASE_URL + "/auth/register",
  LOGOUT_API: BASE_URL + "/auth/logout",
};

const postApiEndpoints = {
  GET_ALL_POSTS: BASE_URL + "/posts/getAllPosts",
  CREATE_POST: BASE_URL + "/posts/createPost",
};

const profileAPiEndpoints = {
  USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  UPDATE_PROFILE: BASE_URL + "/profile/updateProfile",
  GET_USER_POSTS: BASE_URL + "/profile/getUserPosts",
};

const likeApiEndpoints = {
  LIKE_API: BASE_URL + "/likes/like",
  UNLIKE_API: BASE_URL + "/likes/unlike",
};

const commentApiEndpoints = {
  CREATE_COMMENT_API: BASE_URL + "/comments/create-comment",
  DELETE_COMMENT_API: BASE_URL + "/comments/delete",
  DELETE_REPLY_COMMENT_API: BASE_URL + "/comments/delete-reply",
  GET_COMMENTS_OF_POST_API: BASE_URL + "/comments/comments-of-post",
  REPLY_TO_COMMENT_API: BASE_URL + "/comments/reply-to-comment",
};

const storiesEndpoints = {
  CREATE_STORY: BASE_URL + "/stories/createStories",
};

export {
  loginAPiEndpoints,
  postApiEndpoints,
  profileAPiEndpoints,
  likeApiEndpoints,
  commentApiEndpoints,
  storiesEndpoints,
};

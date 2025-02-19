const BASE_URL = import.meta.env.VITE_BASE_URL;

const loginAPiEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  SIGNUP_API: BASE_URL + "/auth/register",
  LOGOUT_API: BASE_URL + "/auth/logout",
};

const postApiEndpoints = {
  GET_ALL_POSTS: BASE_URL + "/posts/getAllPosts",
  GET_USER_POSTS: BASE_URL + "/posts/getUserPosts",
  CREATE_POST: BASE_URL + "/posts/createPost",
};

const profileAPiEndpoints = {
  USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  UPDATE_PROFILE: BASE_URL + "/profile/updateProfile",
};

const likeApiEndpoints = {
  LIKE_API: BASE_URL + "/likes/like",
  UNLIKE_API: BASE_URL + "/likes/unlike",
};

const commentApiEndpoints = {
  COMMENT_API: BASE_URL + "/comments/createComment",
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

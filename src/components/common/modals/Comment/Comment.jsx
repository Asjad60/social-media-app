import React, { useEffect, useRef, useState } from "react";
import { timeAgo } from "../../../../utils/dateFormatter";
import useClickOutside from "../../../../hooks/useClickOutside";
import { EllipsisVertical } from "lucide-react";
import Btn from "../../Btn";
import { deleteComment } from "../../../../services/operations/commentAPI";
import Reply from "./Reply";

const Comment = ({
  setReplyTo,
  userOfPost,
  user,
  commentList,
  inputRef,
  postDetail,
  token,
  fetchComments,
  setPage,
  page,
}) => {
  const [viewReplies, setViewReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const { ref, isVisible, setIsVisible } = useClickOutside();
  const commentScrollRef = useRef(null);

  const toggleReplies = (commentId) => {
    setViewReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(postDetail._id, commentId, token);
    await fetchComments();
  };

  const handleDialog = (id) => {
    setIsVisible(id);
  };

  const handleReply = (commentId, replyToUser, name) => {
    setReplyTo({ name: name, commentId: commentId, replyToUser: replyToUser });
    if (inputRef.current) {
      inputRef.current.focus();
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const handleInfiniteScroll = async () => {
      if (!commentScrollRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } =
        commentScrollRef.current;

      if (scrollTop + clientHeight >= scrollHeight) {
        // console.log("Reached bottom of comments");
        setPage((prev) => prev + 1);
      }
    };

    const container = commentScrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleInfiniteScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleInfiniteScroll);
      }
    };
  }, [commentScrollRef.current]);

  const fetchingComments = async () => {
    setLoading(true);
    await fetchComments(setLoading);
    setLoading(false);
  };

  useEffect(() => {
    if (page > 1 && page <= Number(commentList.pages)) {
      fetchingComments();
    }
  }, [page]);

  return (
    <div
      ref={commentScrollRef}
      className="p-4 h-[500px] space-y-4 overflow-y-auto flex-grow"
    >
      {commentList?.comments?.map((comment) => (
        <div key={comment?._id} className="flex flex-col gap-3">
          <div className="flex justify-between">
            {/* User Comments and nested replies */}
            <div className="flex gap-4">
              <img
                src={comment?.user?.profilePic}
                alt={comment?.user?.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 aspect-square"
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{comment?.user?.name}</span>
                  <span className="text-sm text-gray-500">
                    {comment?.createdAt && timeAgo(comment?.createdAt)}
                  </span>
                  {comment?.user?._id === postDetail?.user?._id && (
                    <span className="text-gray-600 font-semibold text-sm">
                      Author
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mt-1">{comment?.comment}</p>

                {/* reply button */}
                {comment?.replies?.length > 0 && (
                  <Btn
                    bg={"none"}
                    notPadding={true}
                    customClass="text-sm !opacity-70"
                    onClick={() => toggleReplies(comment._id)}
                  >
                    {comment?.replies?.length} replies
                  </Btn>
                )}
              </div>
            </div>

            {/* Dialog for deleting or replying */}
            <div className="flex gap-2 relative">
              <Btn
                bg={"none"}
                notPadding={true}
                customClass={"!opacity-60"}
                onClick={() => handleDialog(comment._id)}
              >
                <EllipsisVertical size={18} />
              </Btn>

              {isVisible === comment?._id && (
                <div
                  ref={ref}
                  className={`flex flex-col gap-1 text-[10px] absolute right-5 -bottom-10 z-[900] bg-gray-700 rounded-lg p-2`}
                >
                  {(comment?.user._id === user?._id ||
                    userOfPost?._id === user?._id) && (
                    <Btn
                      bg={"inherit"}
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </Btn>
                  )}
                  <Btn
                    bg={"inherit"}
                    customClass={"border-t border-t-gray-500 rounded-none"}
                    onClick={() =>
                      handleReply(
                        comment._id,
                        comment.user._id,
                        comment.user.name
                      )
                    }
                  >
                    Reply
                  </Btn>
                </div>
              )}
            </div>
          </div>

          {viewReplies[comment?._id] &&
            comment?.replies?.length > 0 &&
            comment.replies.map((reply) => (
              <Reply
                key={reply._id}
                replyDetail={reply}
                commentId={comment._id}
                handleReply={handleReply}
                authorId={postDetail?.user?._id}
              />
            ))}
        </div>
      ))}

      {loading && (
        <div className="flex justify-center">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Comment;

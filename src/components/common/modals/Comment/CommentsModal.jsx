import React, { useEffect, useRef, useState, useTransition } from "react";
import { Send, X } from "lucide-react";
import { Modal } from "../Modal";
import Btn from "../../Btn";
import {
  createComment,
  getCommentsOfaPost,
  replyToComment,
} from "../../../../services/operations/commentAPI";
import { useSelector } from "react-redux";
import Comment from "./Comment";

export default function CommentsModal({
  isOpen,
  onClose,
  comments = [],
  postDetail,
  userOfPost,
}) {
  const { token, user } = useSelector((state) => state.user);
  const [commentList, setCommentList] = useState({});
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [replyTo, setReplyTo] = useState({
    name: "",
    commentId: "",
    replyToUser: "",
  });
  const inputRef = useRef(null);
  // console.log(comments);

  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      if (replyTo.commentId && replyTo.replyToUser && newComment.trim()) {
        await replyToComment(
          replyTo.commentId,
          newComment,
          replyTo.replyToUser,
          token
        );
        fetchComments();
        setReplyTo({ name: "", commentId: "", replyToUser: "" });
        setNewComment("");
        return;
      }

      if (newComment.trim()) {
        await createComment(postDetail._id, newComment, token);
        fetchComments();
        setNewComment("");
      }
    });
  };

  const fetchComments = async (setLoading) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // console.log("calling API");
    const res = await getCommentsOfaPost(
      postDetail._id,
      token,
      page,
      10,
      setLoading
    );

    if (res.data) {
      setCommentList((prev) => ({
        ...res.data,
        comments:
          page === 1
            ? res.data.comments
            : [...prev.comments, ...res.data.comments],
      }));
    }
  };

  useEffect(() => {
    fetchComments(setLoading);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comments">
      <div className="flex flex-col h-[500px] justify-between">
        {!loading ? (
          commentList?.comments?.length ? (
            <Comment
              setReplyTo={setReplyTo}
              userOfPost={userOfPost}
              user={user}
              commentList={commentList}
              inputRef={inputRef}
              postDetail={postDetail}
              token={token}
              fetchComments={fetchComments}
              setPage={setPage}
              page={page}
            />
          ) : (
            <p className="text-center">No comments</p>
          )
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="loader"></div>
          </div>
        )}

        {/* form for commenting */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-t-gray-500 p-4"
        >
          {replyTo.name && replyTo.commentId && (
            <span className="p-1 text-sm rounded-lg capitalize bg-blue-800 flex gap-1 w-fit items-center">
              @{replyTo.name}
              <Btn
                type={"button"}
                bg={"none"}
                notPadding={true}
                onClick={() =>
                  setReplyTo({ name: "", commentId: "", replyToUser: "" })
                }
              >
                <X size={15} />
              </Btn>
            </span>
          )}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              name="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="formData"
            />
            <Btn type="submit" disabled={!newComment.trim() || isPending}>
              <Send className="w-4 h-4" />
            </Btn>
          </div>
        </form>
      </div>
    </Modal>
  );
}

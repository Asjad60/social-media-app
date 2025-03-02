import React from "react";
import useClickOutside from "../../../../hooks/useClickOutside";
import { useSelector } from "react-redux";
import Btn from "../../Btn";
import { EllipsisVertical } from "lucide-react";
import { timeAgo } from "../../../../utils/dateFormatter";
import { deleteReplyComment } from "../../../../services/operations/commentAPI";

const Reply = ({ replyDetail, commentId, handleReply, authorId }) => {
  const { token, user } = useSelector((state) => state.user);
  const { ref, isVisible, setIsVisible } = useClickOutside();

  const handleDeleteReply = async (replyId) => {
    await deleteReplyComment(replyId, commentId, token);
  };

  return (
    <div className="px-6">
      <div className="flex justify-between w-full relative">
        <div className="flex gap-2 justify-between">
          <img
            src={replyDetail?.user?.profilePic}
            alt={replyDetail?.user?.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 aspect-square"
          />
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm">
                {replyDetail?.user?.name}
              </span>
              <span className="text-sm text-gray-500">
                {replyDetail?.createdAt && timeAgo(replyDetail?.createdAt)}
              </span>
              {replyDetail.user._id === authorId && (
                <span className="text-sm text-gray-600 font-semibold">
                  Author
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-1 text-[13px]">
              <span className="text-blue-600 p-1 bg-gray-900 rounded-xl">
                @{replyDetail?.to?.name}
              </span>{" "}
              {replyDetail?.comment}
            </p>
          </div>
        </div>

        {/* Dialog for deleting or replying */}
        <div className="flex gap-2">
          <Btn
            bg={"none"}
            notPadding={true}
            customClass={"!opacity-60"}
            onClick={() => setIsVisible(replyDetail._id)}
          >
            <EllipsisVertical size={18} />
          </Btn>

          {isVisible === replyDetail?._id && (
            <div
              ref={ref}
              className={`flex flex-col gap-1 text-[10px] absolute right-5 -bottom-10 z-[900] bg-gray-700 rounded-lg p-2`}
            >
              {replyDetail?.user._id === user?._id && (
                <Btn
                  bg={"inherit"}
                  onClick={() => handleDeleteReply(replyDetail._id)}
                >
                  Delete
                </Btn>
              )}
              <Btn
                bg={"inherit"}
                customClass={"border-t border-t-gray-500 rounded-none"}
                onClick={() =>
                  handleReply(
                    commentId,
                    replyDetail.user._id,
                    replyDetail.user.name
                  )
                }
              >
                Reply
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reply;

import React from "react";
import { Heart } from "lucide-react";
import { Modal } from "./Modal";
import { Link } from "react-router-dom";
import dummyprofile from "../../../assets/images/blankprofilepic.webp";

export default function LikedByModal({ isOpen, onClose, likes, currentUser }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
      <div className="divide-y">
        {likes.map((user) => (
          <Link to={`/user-profile/${user.userId._id}`} key={user.userId._id}>
            <div
              key={user.userId._id}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <img
                src={user.userId.profilePic || dummyprofile}
                alt={user.userId.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium flex-grow capitalize">
                {currentUser?._id === user.userId?._id
                  ? "You"
                  : user.userId.name}
              </span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </div>
          </Link>
        ))}
      </div>
    </Modal>
  );
}

import React, { useState, useRef } from "react";
import { ImagePlus, X, Tag } from "lucide-react";
import Btn from "../components/common/Btn";
import toast from "react-hot-toast";
import { createPost } from "../services/operations/postAPi";
import { useSelector } from "react-redux";

const maxFileLength = 5;

export function CreatePost({ setCreatePostModal }) {
  const { token } = useSelector((state) => state.user);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filesToSend, setFilesToSend] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef(null);

  const handleMediaChange = async (e) => {
    const files = e.target.files;
    if (!files) return;

    if (mediaFiles.length + files.length > maxFileLength) {
      toast.error("Maximum file limit reached");
      return;
    }
    setFilesToSend((prev) => [...prev, ...files]);
    const newFiles = Array.from(files);

    try {
      const newMediaUrls = await Promise.all(
        newFiles.map((file) => {
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = () => resolve(fileReader.result);
            fileReader.onerror = reject;
          });
        })
      );

      setMediaFiles((prev) => [...prev, ...newMediaUrls]);
    } catch (error) {
      toast.error("Error reading files");
      console.error("File reading error:", error);
    }
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setFilesToSend((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const {
      content: { value },
    } = e.target.elements;

    const formData = new FormData();

    if (
      value.trim() ||
      (mediaFiles.length > 0 && mediaFiles.length <= maxFileLength)
    ) {
      if (filesToSend.length) {
        filesToSend.map((file) => {
          formData.append("media", file);
        });
      }
      if (value) formData.append("content", value);
      if (tags.length) formData.append("tags", JSON.stringify(tags));

      await createPost(formData, token);

      // Reset form
      setCreatePostModal(false);
      setMediaFiles([]);
      setTags([]);
      setTagInput("");
      fileInputRef.current.value = "";
    }
  }

  return (
    <div
      className="flex justify-center flex-col items-center fixed inset-0 bg-black/10 backdrop-blur-sm p-6"
      onClick={(e) => setCreatePostModal(false)}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="aimate-post-form bg-gray-900 rounded-xl shadow-md  max-w-2xl w-full mx-auto mb-6"
      >
        {/* heading */}
        <div className="flex justify-between text-white p-3">
          <h2 className="text-2xl font-semibold">Create Post</h2>
          <Btn
            bg={"none"}
            notPadding={true}
            onClick={() => setCreatePostModal(false)}
          >
            <X />
          </Btn>
        </div>

        <div className="overflow-auto max-h-[80vh]">
          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="p-4 grid grid-cols-2 gap-4">
              {mediaFiles.map((url, index) => {
                const type = url.split("/")[0].split(":")[1];
                console.log(type);
                return type === "image" ? (
                  <div key={url} className="relative aspect-square group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Btn
                      bg={"rgba(0,0,0,0.5)"}
                      notPadding={true}
                      type="button"
                      onClick={() => removeMedia(index)}
                      customClass="absolute top-2 right-2  text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </Btn>
                  </div>
                ) : (
                  <div key={url} className="relative aspect-square group">
                    <video
                      src={url}
                      className=" aspect-auto object-cover rounded-lg"
                      autoPlay
                      controls
                    />
                    <Btn
                      bg={"rgba(0,0,0,0.5)"}
                      notPadding={true}
                      type="button"
                      onClick={() => removeMedia(index)}
                      customClass="absolute top-2 right-2  text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </Btn>
                  </div>
                );
              })}
            </div>
          )}

          {/* Content Input */}
          <div className="p-4">
            <textarea
              name="content"
              placeholder="What's on your mind?"
              className="formData min-h-[120px] placeholder-gray-400"
              maxLength={100}
            />
          </div>

          {/* Tags Input */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-800 text-blue-300 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  #{tag}
                  <Btn
                    type="button"
                    bg={"none"}
                    notPadding={true}
                    onClick={() => removeTag(tag)}
                    customClass="hover:text-blue-800"
                  >
                    <X size={14} />
                  </Btn>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-gray-400" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags (press Enter)"
                className="formData text-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* Actions media */}
          <div className="px-4 py-3 border-t border-gray-500 mt-2 flex items-center justify-between">
            <input
              type="file"
              name="media"
              ref={fileInputRef}
              onChange={handleMediaChange}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
            <Btn
              type="button"
              bg={"none"}
              notPadding={false}
              onClick={() => fileInputRef.current?.click()}
              customClass=" text-gray-600 hover:text-blue-500"
            >
              <ImagePlus size={20} />
              <span>Add Media</span>
            </Btn>
            <Btn type="submit" disabled={mediaFiles.length === 0}>
              Post
            </Btn>
          </div>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import Btn from "../../common/Btn";

const storiesData = [
  { id: 1, name: "friend1", imageUrl: "url1" },
  { id: 2, name: "friend2", imageUrl: "url2" },
  // Add more stories here
];

const StoryCard = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Simulate fetching stories from an API
    setStories(storiesData);
  }, []);

  return (
    <div className="flex gap-2 mt-20">
      {stories.map((story) => (
        <Btn
          customClass={"w-18 h-8 rounded-full bg-gray-300"}
          bg={"none"}
          key={story.id}
        >
          <div className="flex flex-col items-center gap-1">
            <img
              src={story.imageUrl}
              alt={`${story.name}'s story`}
              className="w-full h-full object-cover rounded-full"
            />
            <p className="text-sm">{story.name}</p>
          </div>
        </Btn>
      ))}
    </div>
  );
};

export default StoryCard;

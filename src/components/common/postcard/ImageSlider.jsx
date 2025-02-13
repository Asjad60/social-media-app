import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Zoom, Pagination } from "swiper/modules";

export default function ImageSlider({ data }) {
  return (
    <div onDoubleClick={(e) => e.stopPropagation()}>
      <Swiper
        style={{
          "--swiper-pagination-color": "#981fa1",
          "--swiper-pagination-bullet-inactive-color": "#fff",
          "--swiper-pagination-bullet-inactive-opacity": "0.7",
        }}
        zoom={true}
        pagination={{
          clickable: true,
        }}
        spaceBetween={10}
        modules={[Zoom, Pagination]}
        className="mySwiper max-w-[380px] md:max-w-[500px] max-h-[500px] w-full bg-black/35 "
      >
        {data.map((uri, i) => {
          const imageType = uri.split(".").pop();
          return imageType === "mp4" ? (
            <SwiperSlide key={i} className="">
              <div className="swiper-zoom-container flex items-center h-full">
                <video
                  src={uri}
                  className=" w-full h-full aspect-auto mt-23 object-contain"
                  autoPlay
                  muted
                  loop
                />
              </div>
            </SwiperSlide>
          ) : (
            <SwiperSlide key={i} className="">
              <div className="swiper-zoom-container">
                <img
                  src={uri}
                  alt="post-image"
                  className=" w-full h-full aspect-square object-cover "
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

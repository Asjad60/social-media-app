import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Zoom, Pagination } from "swiper/modules";

const getMediaType = (uri) => {
  const extension = uri.split(".").pop();
  return extension === "mp4" ? "video" : "image";
};

export default function ImageSlider({ data }) {
  return (
    <div onDoubleClick={(e) => e.stopPropagation()}>
      <Swiper
        style={{
          "--swiper-pagination-color": "#981fa1",
          "--swiper-pagination-bullet-inactive-color": "#5072A7",
          "--swiper-pagination-bullet-inactive-opacity": "0.7",
        }}
        zoom={true}
        pagination={{ clickable: true }}
        spaceBetween={10}
        modules={[Zoom, Pagination]}
        className="max-w-[380px] md:max-w-[868px] h-[500px] flex items-center justify-center"
      >
        {data.map((uri, i) => {
          const mediaType = getMediaType(uri);

          return (
            <SwiperSlide key={i}>
              <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                {mediaType === "video" ? (
                  <video
                    src={uri}
                    preload="metadata"
                    className="max-w-full max-h-full aspect-auto object-contain "
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                  />
                ) : (
                  <img
                    src={uri}
                    alt="post"
                    className="max-w-full max-h-full aspect-auto object-contain "
                    loading="lazy"
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

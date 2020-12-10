import React from "react";

function isImage(url) {
  return url.match(/jpg$|png$|jpeg$|gif$|webp$/g);
}

function renderVideoTag(media) {
  const url = media.scrubber_media_url;
  const format = url.split(".").pop();
  return (
    <video height={media.height} width={media.width} controls muted autoPlay>
      <source src={media.fallback_url} type={`video/${format}`} />
    </video>
  );
}

function debounce(cb, ref) {
  return function () {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      cb();
    }, 1000);
  };
}

function wait(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function apiClient(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) return data;

  const error = new Error(data.message || "Failed fetching data");
  error.response = data;
  throw error;
}

export { renderVideoTag, isImage, debounce, wait, apiClient };

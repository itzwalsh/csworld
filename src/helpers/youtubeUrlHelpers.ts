export const getThumbnail = (videoUrl: string) => {
  let video, results;
  const getThumb = function (url: string) {
    if (url === null) {
      return "";
    }
    results = /[\?&]v=([^&#]*)/.exec(url);
    video = results === null ? url : results[1];
    return "http://img.youtube.com/vi/" + video;
  };

  return getThumb(videoUrl);
};

export const getEmbedLink = (videoUrl: string) => {
  if (videoUrl === null) {
    return "";
  }

  const replacedUrl = videoUrl.replace("watch?v=", "embed/");

  return replacedUrl;
};

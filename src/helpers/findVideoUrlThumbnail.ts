export const getThumbnail = (videoUrl: string) => {
  let video, results, maxRes, defaultRes;
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
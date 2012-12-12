
var TYPE_RE = /.(\w{3,4})$/i;


function parseSourceTag(el) {

   var src = el.attr("src"),
      type = (el.attr("type") || "").replace("video/", ""),
      suffix = src.split(TYPE_RE)[1];

   return { src: src, suffix: suffix || type, type: type || suffix };
}

function parseSourceArray(sources) {
   return $.map(sources, function(el) {
      var type; $.each(el, function(key, value) { type = key; });
      el.type = type;
      el.src = el[type];
      return el;
   });
}


/* Resolves video object from initial configuration and from load() method */
function URLResolver(root, videoTag) {

   var self = this,
      sources = [];

   // initial sources
   if ($.isArray(videoTag)) {
      sources = parseSourceArray(videoTag);

      videoTag = $("<video/>", { 'class': 'fp-engine' }).appendTo(root);

      $.each(sources, function(i, src) {
         videoTag.append($("<source/>", { type: 'video/' + src.type, src: src.src }));
      });

   } else {
      $("source", videoTag).each(function() {
         sources.push(parseSourceTag($(this)));
      });
   }

   if (!sources.length) sources.push(parseSourceTag(videoTag));
   self.initialSources = sources;

   self.resolve = function(video) {

      if (!video) video = { sources: sources };

      if ($.isArray(video)) {
         video = { sources: parseSourceArray(video) }

      } else if (typeof video == 'string') {

         video = { src: video, sources: [] };

         $.each(sources, function(i, source) {
            if (source.type != 'flash') {
               video.sources.push({
                  type: source.type,
                  src: video.src.replace(TYPE_RE, "") + "." + source.suffix
               });
            }
         });
      }

      return video;
   };

};

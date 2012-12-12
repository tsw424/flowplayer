
flowplayer(function(player, root) {

   // no embedding
   if (player.conf.embed === false) return;

   var conf = player.conf,
      ui = $(".fp-ui", root),
      trigger = $("<a/>", { "class": "fp-embed", title: 'Copy to your site'}).appendTo(ui),
      target = $("<div/>", { 'class': 'fp-embed-code'})
         .append("<label>Paste this HTML code on your site to embed.</label><textarea/>").appendTo(ui),
      area = $("textarea", target);

   player.embedCode = function() {

      var video = player.video,
         width = video.width || root.width(),
         height = video.height || root.height(),
         embedConf = { video: [] };

      // configuration
      $.each(['origin', 'analytics', 'logo', 'key', 'rtmp', 'ratio', 'skin', 'embed'], function(i, key) {
         if (conf[key]) embedConf[key] = conf[key];
      });

      // redundant stuff
      if (!conf.key) {
         delete embedConf.origin;
         delete embedConf.logo;
      }

      // video
      $.each(video.sources, function(i, src) {
         var v = {};
         v[src.type] = src.src;
         embedConf.video.push(v);
      });

      return "<iframe frameborder=0 webkitAllowFullScreen mozallowfullscreen allowFullScreen noresize" +
         " scrolling=no " +
         " width=" + width +
         " height=" + height +
         " src='" + conf.embed + "?" + escape(JSON.stringify(embedConf)) +
         "'></iframe>";
   };

   root.fptip(".fp-embed", "is-embedding");

   area.click(function() {
      this.select();
   });

   trigger.click(function() {
      area.text(player.embedCode());
      area[0].focus();
      area[0].select();
   });

});


$.fn.fptip = function(trigger, active) {

   return this.each(function() {

      var root = $(this);

      function close() {
         root.removeClass(active);
         $(document).unbind(".st");
      }

      $(trigger || "a", this).click(function(e) {

         e.preventDefault();

         root.toggleClass(active);

         if (root.hasClass(active)) {

            $(document).bind("keydown.st", function(e) {
               if (e.which == 27) close();

            // click:close
            }).bind("click.st", function(e) {
               if (!$(e.target).parents("." + active).length) close();
            });
         }

      });

   });

};


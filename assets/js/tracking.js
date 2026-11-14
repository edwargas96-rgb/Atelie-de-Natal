/* Meta Pixel + API de Conversões (deduplicação por event_id). Só ativa se pixelId estiver configurado. */
(function () {
  var C = window.ATELIE_CONFIG || {};
  var T = (window.AtelieTrack = {});
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
  function cookie(n) { var m = document.cookie.match("(?:^|; )" + n + "=([^;]*)"); return m ? decodeURIComponent(m[1]) : undefined; }

  if (C.pixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", C.pixelId);
  }

  T.track = function (name, data, custom) {
    var id = uid();
    data = data || {};
    if (window.fbq && C.pixelId) fbq(custom ? "trackCustom" : "track", name, data, { eventID: id });
    if (C.pixelId && C.capiEndpoint) {
      var body = JSON.stringify({ event_name: name, event_id: id, event_source_url: location.href, custom_data: data, fbp: cookie("_fbp"), fbc: cookie("_fbc") });
      try {
        if (navigator.sendBeacon) navigator.sendBeacon(C.capiEndpoint, new Blob([body], { type: "application/json" }));
        else fetch(C.capiEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true });
      } catch (e) {}
    }
  };

  T.track("PageView");
})();

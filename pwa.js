(function () {
  var btn = document.getElementById('instalarApp');
  var evento = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('SW no registrado', e); });
    });
  }

  var yaInstalada = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (yaInstalada && btn) btn.parentElement.hidden = true;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    evento = e;
  });

  window.addEventListener('appinstalled', function () {
    evento = null;
    if (btn) btn.parentElement.hidden = true;
  });

  if (btn) btn.addEventListener('click', function () {
    if (evento) {
      evento.prompt();
      evento.userChoice.then(function () { evento = null; });
    } else {
      alert('Para instalar TACTIKA:\n\n• Chrome / Edge: haz clic en el ícono de instalar (⊕) al final de la barra de direcciones, o menú ⋮ → "Instalar TACTIKA".\n• Safari (Mac): Archivo → "Agregar al Dock".\n• Firefox no permite instalar apps web de escritorio.\n\nNota: la página debe abrirse desde https:// o localhost, no desde un archivo local.');
    }
  });
})();

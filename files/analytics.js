// Google Analytics 4. Replace the ID below with the Measurement ID from analytics.google.com
// (Admin > Data streams > Web > "G-..."). Nothing is sent while it is the placeholder.
var GA_ID = 'G-XXXXXXXXXX';
if (/^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX') {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

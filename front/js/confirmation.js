const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const zoneOrderId = document.getElementById("orderId");
zoneOrderId.textContent = orderId
localStorage.clear();

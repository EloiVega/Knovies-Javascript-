// console.log(location.origin);
const pathname = location.pathname.split('/')[1];
location.href = `${location.origin}/${pathname? pathname+'/' : ''}Knovies.html`;
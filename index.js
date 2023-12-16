console.log(location.origin);
const pathname = location.pathname.split('/')[1];
console.log(pathname);
location.href = `${location.origin}/Knovies.html`;
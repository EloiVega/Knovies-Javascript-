// console.log(location.origin);
const pathname = location.pathname.split('/')[1];
const repo = pathname === 'Knovies-Javascript-'? pathname + '/': '';
location.href = `${location.origin}/${repo}Knovies.html`;
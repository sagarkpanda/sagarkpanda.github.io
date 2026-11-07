function n(t){if(!t)return"";const e=new Date(t);return Number.isNaN(e.getTime())?String(t):new Intl.DateTimeFormat("en-IN",{dateStyle:"medium"}).format(e)}export{n as d};

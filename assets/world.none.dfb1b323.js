import{i as R}from"./Dice.6c1fb4a4.js";import"./app.70b61a83.js";import"./style.a87c9e06.js";var I=Object.defineProperty,w=(t,e,i)=>e in t?I(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,m=(t,e,i)=>(w(t,typeof e!="symbol"?e+"":e,i),i),f=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},o=(t,e,i)=>(f(t,e,"read from private field"),i?i.call(t):e.get(t)),h=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},r=(t,e,i,l)=>(f(t,e,"write to private field"),l?l.call(t,i):e.set(t,i),i),c=(t,e,i,l)=>({set _(s){r(t,e,s,i)},get _(){return o(t,e,l)}}),g,n,p,a,u,v;class T{constructor(e){m(this,"config"),h(this,g,void 0),m(this,"initialized",!1),h(this,n,{}),h(this,p,0),h(this,a,0),h(this,u,[]),h(this,v,void 0),m(this,"noop",()=>{}),this.onInitComplete=e.onInitComplete||this.noop,this.onThemeLoaded=e.onThemeLoaded||this.noop,this.onRollResult=e.onRollResult||this.noop,this.onRollComplete=e.onRollComplete||this.noop,this.onDieRemoved=e.onDieRemoved||this.noop,this.initialized=this.initScene(e)}async initScene(e){this.config=e.options,this.onInitComplete()}resize(){}loadTheme(){return Promise.resolve()}updateConfig(e){Object.assign(this.config,e)}addNonDie(e){console.log("die",e),clearTimeout(o(this,v));const{id:i,value:l,...s}=e,d={id:i,value:l,config:s};o(this,n)[i]=d,o(this,u).push(setTimeout(()=>{this.handleAsleep(d)},c(this,p)._++*this.config.delay)),r(this,v,setTimeout(()=>{this.onRollComplete()},500))}add(e){console.log("add die"),this.addNonDie(e)}remove(e){console.log("remove die");const i=o(this,n)[e.id];i.hasOwnProperty("d10Instance")&&(delete o(this,n)[i.d10Instance.id],c(this,a)._--),delete o(this,n)[e.id],c(this,a)._--,this.onDieRemoved(e.rollId)}clear(){!Object.keys(o(this,n)).length&&!o(this,a)||(o(this,u).forEach(e=>clearTimeout(e)),Object.values(o(this,n)).forEach(e=>{e.mesh&&e.mesh.dispose()}),r(this,n,{}),r(this,p,0),r(this,a,0))}async handleAsleep(e){var i,l;if(e.asleep=!0,await R.getRollResult(e),e.d10Instance||e.dieParent){if((i=e==null?void 0:e.d10Instance)!=null&&i.asleep||(l=e==null?void 0:e.dieParent)!=null&&l.asleep){const s=e.config.sides===100?e:e.dieParent,d=e.config.sides===10?e:e.d10Instance;d.value===0&&s.value===0?s.value=100:s.value=s.value+d.value,this.onRollResult({rollId:s.config.rollId,value:s.value})}}else e.config.sides===10&&e.value===0&&(e.value=10),this.onRollResult({rollId:e.config.rollId,value:e.value});c(this,a)._++}}g=new WeakMap,n=new WeakMap,p=new WeakMap,a=new WeakMap,u=new WeakMap,v=new WeakMap;export{T as default};

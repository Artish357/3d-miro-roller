import"./style.a87c9e06.js";import{r as e,j as r,R as f,c as p,A as y}from"./app.f867e2c3.js";const x=({children:s})=>{const[n,l]=e.exports.useState([]),[c,d]=e.exports.useState({id:"",name:""}),t=miro.board.storage.collection("rollHistory"),m=o=>{miro.board.events.broadcast("roll-result",o);const a=[...n,o];t.set("rollHistory",a),l(a.slice(-100))};e.exports.useEffect(()=>{miro.board.getUserInfo().then(o=>d(o)),t.onValue("rollHistory",o=>{o===void 0?t.set("rollHistory",[]):l(o)})},[]);const u={rollHistory:n,userInfo:c,panelData:miro.board.ui.getPanelData(),storeRollResult:m};return r(f.Provider,{value:u,children:s})},i=document.getElementById("root");i&&p(i).render(r(x,{children:r(y,{})}));

import{g}from"./helpers.980390ba.js";async function p(){miro.board.ui.on("icon:click",async()=>{await miro.board.ui.openPanel({url:"miro.html"})}),miro.board.events.on("roll-result",async t=>{let l=String(t);l.length>80&&(l="..."+l.slice(-75)),await miro.board.notifications.showInfo(l)}),miro.board.ui.on("custom:roll-formula-tag",async({items:t})=>{const l=t.flatMap(a=>a.tagIds),i=await miro.board.get({type:"tag",id:l}),n=t[0].content.replaceAll("&#43;","+").replaceAll("&#45;","-"),[o,e,r]=[...n.matchAll(/([+-]?\d+)/g)].map(a=>a[0]).map(a=>parseFloat(a)).concat([0,0,0]),c=i.map(a=>{const m=a.title.replaceAll("X",`${o}`).replaceAll("+X",`+${o}`).replaceAll("-X",`-${o}`).replaceAll("Y",`${e}`).replaceAll("+Y",`+${e}`).replaceAll("-Y",`-${e}`).replaceAll("Z",`${r}`).replaceAll("+Z",`+${r}`).replaceAll("-Z",`-${r}`),d=g();return{formula:m,rollId:d}}).slice(0,1),s=Math.random().toString(36).substring(7);miro.board.ui.openPanel({url:`miro.html?r=${s}`,data:{rolls:c,description:n}})}),await miro.board.experimental.action.register({event:"roll-formula-tag",ui:{label:{en:"Roll the attached tag formula"},icon:"cube"},scope:"local",predicate:{$where:"this.tagIds && this.tagIds.length > 0"},contexts:{item:{}}}),miro.board.events.on("roll-result",async t=>{let l=String(t);l.length>80&&(l="..."+l.slice(-75)),await miro.board.notifications.showInfo(l)})}p();
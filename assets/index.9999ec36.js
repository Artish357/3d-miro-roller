import"./style.a87c9e06.js";async function r(){miro.board.ui.on("icon:click",async()=>{await miro.board.ui.openPanel({url:"miro.html"})}),miro.board.events.on("roll-result",async t=>{let a=String(t);a.length>80&&(a="..."+a.slice(-75)),await miro.board.notifications.showInfo(a)}),miro.board.ui.on("custom:roll-formula-tag",async({items:t})=>{const a=t.flatMap(o=>o.tagIds),i=(await miro.board.get({type:"tag",id:a})).map(o=>o.title);miro.board.ui.openPanel({url:`miro.html?r=${Math.random()}`,data:{formulas:[i[0]]}})}),await miro.board.experimental.action.register({event:"roll-formula-tag",ui:{label:{en:"Roll the attached tag formula"},icon:"hexagon"},scope:"local",predicate:{$where:"this.tagIds && this.tagIds.length > 0"},contexts:{item:{}}}),miro.board.events.on("roll-result",async t=>{let a=String(t);a.length>80&&(a="..."+a.slice(-75)),await miro.board.notifications.showInfo(a)})}r();

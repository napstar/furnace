var AU=AU||{};!function(e){var t={};function n(e,t,n){if(e===t)return{stepSize:0,steps:0,intervalTime:0};var o=t-e,a=n/o,i=o<0?-1:1,r=Math.abs(o/i);return a=n/r,Math.abs(a)<1e3/60&&(a=1e3/60,i=o/(r=Math.ceil(Math.abs(n/a)))),{stepSize:i,steps:r-1,intervalTime:a}}"undefined"!=typeof module&&(t.CalculateAnimationSpecs=n),t.GetCSSPropertyBecauseIE=function(t,n){if("undefined"!=typeof getComputedStyle)return window.getComputedStyle(t)[n];var o=t.currentStyle[n];return"auto"===o&&(o=e.animate.CalculateAuto(t,n)),o},t.CalculateAuto=function(e,t){var n,o;return"height"===t?(n=e.clientHeight,e.style[t]="auto",o=e.clientHeight,e.style[t]=n+"px"):(n=e.clientWidth,e.style[t]="auto",o=e.clientWidth,e.style[t]=n+"px"),parseInt(o)},t.Stop=function(e){clearInterval(e.AUanimation)},t.Run=function(t){var o=t.element,a=t.speed||250;void 0===o.length&&(o=[o]),"function"!=typeof t.callback&&(t.callback=function(){}),o[0].AUinteration=0,o[0].AUinterations=o.length;for(var i=0;i<o.length;i++){var r=o[i];e.animate.Stop(r);var l=parseInt(e.animate.GetCSSPropertyBecauseIE(r,t.property)),p=t.endSize;"auto"===t.endSize&&(p=e.animate.CalculateAuto(r,t.property));var u=n(l,p,a),c=l;u.stepSize<0?r.AUtoggleState="closing":u.stepSize>0&&(r.AUtoggleState="opening"),function(n,a,i,r,l){n.AUanimation=setInterval(function(){if(a===l||0===r.steps){if(e.animate.Stop(n),n.style[t.property]=l+"px",n.AUtoggleState="",o[0].AUinteration++,"auto"===t.endSize&&(n.style[t.property]=""),o[0].AUinteration>=o[0].AUinterations)return t.callback()}else i+=r.stepSize,n.style[t.property]=i+"px",r.steps--},Math.abs(r.intervalTime))}(r,l,c,u,p)}},t.Toggle=function(t){var n=t.element,o=t.property||"height",a=t.speed||250,i=t.closeSize||0,r=t.openSize||"auto";void 0===n.length&&(n=[n]),"function"!=typeof t.prefunction&&(t.prefunction=function(){}),"function"!=typeof t.postfunction&&(t.postfunction=function(){}),"function"!=typeof t.callback&&(t.callback=function(){}),n[0].AUtoggleInteration=0,n[0].AUtoggleInterations=n.length;for(var l=0;l<n.length;l++){var p,u=n[l];e.animate.Stop(u);var c="",s="",f=parseInt(e.animate.GetCSSPropertyBecauseIE(u,t.property));if(f===i||"closing"===u.AUtoggleState)p=r,c="opening",s="open";else{if(f===i&&"opening"!==u.AUtoggleState)throw new Error("AU.animate.Toggle cannot determine state of element");p=i,c="closing",s="closed"}t.prefunction(u,c),e.animate.Run({element:u,endSize:p,property:o,speed:a,callback:function(){if(n[0].AUtoggleInteration++,n[0].AUtoggleInteration===n[0].AUinterations){var e=t.callback(u,s);return t.postfunction(u,s),e}t.postfunction(u,s)}})}},e.animate=t}(AU),"undefined"!=typeof module&&(module.exports=AU),"undefined"!=typeof exports&&(Object.defineProperty(exports,"__esModule",{value:!0}),eval("exports.default = AU"));
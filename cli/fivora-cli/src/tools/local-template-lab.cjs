#!/usr/bin/env node
const Q=require("node:crypto"),E=require("node:fs"),A=require("node:http"),f=require("node:path"),{spawn:O}=require("node:child_process"),Z=4174,q=4173,M=96*1024,v="127.0.0.1",U="/__fivora_local_preview",ee=`(()=>{const p=["market","place"].join(""),R="__"+p.toUpperCase()+"_LOCAL_VISUAL_BRIDGE__",y=p.toUpperCase()+"_PREVIEW_",h=t=>y+t;if(window.__FIVORA_LOCAL_VISUAL_BRIDGE__||window[R])return;window.__FIVORA_LOCAL_VISUAL_BRIDGE__=!0,window[R]=!0;const O="FIVORA_PREVIEW_EDIT_MODE",V=h("EDIT_MODE"),x="FIVORA_PREVIEW_ELEMENT_CLICKED",P=h("ELEMENT_CLICKED"),G="FIVORA_PREVIEW_READY",U=h("READY"),T="data-preview-field-path",L="data-preview-list-path",v="data-preview-item-path",w="data-fivora-local-edit-target",A="data-fivora-local-selected-target",C="data-"+p+"-local-edit-target",_="data-"+p+"-local-selected-target",B="[data-preview-field-path], [data-preview-list-path], [data-preview-item-path]";let r=window.parent!==window,E=new Map,l=null,i=null,m="*";const g=document.createElement("style");g.setAttribute("data-fivora-local-visual-bridge",""),g.setAttribute("data-"+p+"-local-visual-bridge",""),g.textContent=["["+w+"], ["+C+"] {","  outline: 2px solid #06b6d4 !important;","  outline-offset: 3px !important;","  cursor: pointer !important;","  box-shadow: 0 0 0 5px rgba(6, 182, 212, 0.16) !important;","}","["+A+"], ["+_+"] {","  outline: 2px dashed #06b6d4 !important;","  outline-offset: 3px !important;","  box-shadow: 0 0 0 5px rgba(6, 182, 212, 0.18) !important;","}",'html[data-fivora-local-edit-mode="true"] [data-preview-field-path],','html[data-fivora-local-edit-mode="true"] [data-preview-list-path],','html[data-fivora-local-edit-mode="true"] [data-preview-item-path],','html[data-fivora-local-edit-mode="true"] [data-preview-field-path],','html[data-fivora-local-edit-mode="true"] [data-preview-list-path],','html[data-fivora-local-edit-mode="true"] [data-preview-item-path] {',"  cursor: pointer !important;","}"].join(\`
\`),document.head.appendChild(g),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(r)),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(r));function Y(t){return t.source!==window.parent?!1:(m==="*"&&t.origin&&t.origin!=="null"&&(m=t.origin),m==="*"||t.origin===m)}function I(t){window.parent.postMessage(t,m)}function b(){l&&(l.removeAttribute(w),l.removeAttribute(C)),l=null}function F(t){i&&i!==t&&(i.removeAttribute(A),i.removeAttribute(_)),i=t,i.setAttribute(A,"true"),i.setAttribute(_,"true")}function W(){i&&(i.removeAttribute(A),i.removeAttribute(_)),i=null}function S(t){return t instanceof Element?t.closest(B):null}function k(t,e){const c=E.get(e);return c&&["string","number","boolean"].includes(typeof c.value)?c.value:t instanceof HTMLImageElement?t.currentSrc||t.src||"":(t.textContent||"").trim()}function K(t){if(!r)return;const e=S(t.target);!e||e===l||(b(),l=e,l.setAttribute(w,"true"))}function N(t){if(!r||!l)return;const e=t.relatedTarget;e instanceof Node&&l.contains(e)||b()}function j(t,e,c){const f=[],s=new Set(e?[e]:[]),n=c||e&&e.replace(/(\\[\\d+\\])?\\.\\w+$/,"").replace(/\\[\\d+\\]$/,"");if(n)for(const[a,o]of E)a!==e&&!s.has(a)&&(a.startsWith(n+".")||a.startsWith(n+"["))&&o?.kind!=="collection"&&(s.add(a),f.push({path:a,label:o.label||a.split(".").pop()||"Content",type:o.type||"text"}));let d=t instanceof Element?t:null,u=0;for(;d&&d!==document.body&&u<3;){const a=d.getAttribute(T);if(a&&a!==e&&!s.has(a)){const o=E.get(a);o?.kind!=="collection"&&(s.add(a),f.push({path:a,label:o?.label||a.split(".").pop()||"Content",type:o?.type||"text"}))}d=d.parentElement,u+=1}return f}function H(t){if(!r)return;const e=S(t.target);if(!e)return;t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),F(e);const c=e.closest("["+T+"]"),f=e.closest("["+L+"]"),s=e.closest("["+v+"]"),n=c?.getAttribute(T)||null,d=f?.getAttribute(L)||null,u=s?.getAttribute(v)||null,a=n?E.get(n):null,o=e.getBoundingClientRect(),D=u?.match(/\\[(\\d+)\\](?!.*\\[\\d+\\])/),M={type:x,fieldPath:n,fieldValue:n?k(c||e,n):"",elementTag:e.tagName.toLowerCase(),isImage:e instanceof HTMLImageElement||a?.type==="image",boundingRect:{top:o.top,left:o.left,width:o.width,height:o.height},collectionPath:d,listPath:d,itemPath:u,itemIndex:D?Number(D[1]):null,descriptorKind:n?"field":d?"collection":null,relatedFields:j(e,n,u)};I(M),I({...M,type:P})}window.addEventListener("message",t=>{!Y(t)||!t.data||typeof t.data!="object"||t.data.type!==O&&t.data.type!==V||(r=t.data.editMode===!0,E=new Map(Array.isArray(t.data.fields)?t.data.fields.filter(e=>e&&typeof e.path=="string").map(e=>[e.path,e]):[]),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(r)),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(r)),r||(b(),W()))}),document.addEventListener("mouseover",K,!0),document.addEventListener("mouseout",N,!0),document.addEventListener("click",H,!0),I({type:G,pathname:window.location.pathname}),I({type:U,pathname:window.location.pathname})})();`;let D=ee;try{const e=require("./template-preview-focus-bridge.cjs");typeof e=="string"&&e.trim()&&(D=e)}catch{}function p(e){process.stderr.write(`Local Template Lab: ${e}
`),process.exit(1)}try{new Function(D)}catch(e){p(`Visual editor bridge is invalid: ${e.message}`)}function W(e,t,a){if(e===void 0)return a;const r=Number(e);return(!Number.isInteger(r)||r<1024||r>65535)&&p(`${t} must be a port between 1024 and 65535.`),r}function te(e){const t=[...e];let a="",r,n,s=!1;for(let m=0;m<t.length;m+=1){const d=t[m];d==="--api-port"?(r=t[m+1],m+=1):d.startsWith("--api-port=")?r=d.slice(11):d==="--preview-port"?(n=t[m+1],m+=1):d.startsWith("--preview-port=")?n=d.slice(15):d==="--skip-install"?s=!0:d==="--help"||d==="-h"?(process.stdout.write(["Fivora Local Template Lab","","Usage:","  npm run lab -- <template-directory> [options]","","Options:","  --api-port <port>      Loopback controller port (default: 4174)","  --preview-port <port>  Template dev-server port (default: 4173)","  --skip-install         Do not install missing local dependencies",""].join(`
`)),process.exit(0)):d.startsWith("-")?p(`Unknown option: ${d}`):a?p(`Unexpected argument: ${d}`):a=d}return a||p("A template directory is required. Run with --help for usage."),{templatePath:f.resolve(a),apiPort:W(r,"--api-port",Z),previewPort:W(n,"--preview-port",q),skipInstall:s}}function B(e,t){try{return JSON.parse(E.readFileSync(e,"utf8"))}catch(a){p(`${t} is missing or invalid at ${e}: ${a instanceof Error?a.message:"unknown error"}`)}}const i=te(process.argv.slice(2));E.existsSync(i.templatePath)||p(`Template directory does not exist: ${i.templatePath}`),E.statSync(i.templatePath).isDirectory()||p(`Template path must be a directory: ${i.templatePath}`);const ae=["fivora-template.json","fivora-template.json"].find(e=>E.existsSync(f.join(i.templatePath,e)))||"fivora-template.json",re=f.join(i.templatePath,ae),ne=f.join(i.templatePath,"package.json"),c=B(re,"Template manifest"),T=B(ne,"package.json");c.framework!=="nextjs-static-export"&&p('Template manifest framework must be "nextjs-static-export".'),(!T.scripts||typeof T.scripts.dev!="string")&&p("Template package.json must define a dev script for live preview."),(typeof c.siteDataFile!="string"||!c.siteDataFile.trim())&&p("Template manifest siteDataFile is required.");const j=f.resolve(i.templatePath,c.siteDataFile.trim()),N=f.relative(i.templatePath,j);(N.startsWith("..")||f.isAbsolute(N))&&p("Template manifest siteDataFile must stay inside the template directory.");const H=Q.randomBytes(24).toString("base64url"),y=`http://${v}:${i.apiPort}`,G=`http://${v}:${i.previewPort}`,$=`${y}${U}`,ie=f.join(__dirname,"fivora-template-validator.cjs");let P=!1,u=null,h=null,I=null,_=null,b=0;const k=5;let x="",R="";const o={protocolVersion:2,connected:!0,templateName:typeof c.name=="string"&&c.name.trim()?c.name.trim():typeof T.name=="string"?T.name:f.basename(i.templatePath),templatePath:i.templatePath,previewUrl:$,apiUrl:y,devStatus:"starting",devError:null,startedAt:new Date().toISOString(),validation:{status:"idle",startedAt:null,completedAt:null,exitCode:null}};function l(e,t){const a=t.toString();e==="dev"?x=`${x}${a}`.slice(-M):R=`${R}${a}`.slice(-M),process.stdout.write(a)}function K(){return{...o,devLog:x,validationLog:R}}function oe(e,t){const a=e.headers.origin;a&&/^(https?:\/\/|null$)/.test(a)&&(t.setHeader("Access-Control-Allow-Origin",a),t.setHeader("Vary","Origin")),t.setHeader("Access-Control-Allow-Headers","Authorization, Content-Type"),t.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS"),t.setHeader("Access-Control-Allow-Private-Network","true"),t.setHeader("Cache-Control","no-store"),t.setHeader("X-Content-Type-Options","nosniff")}function g(e,t,a){const r=JSON.stringify(a);e.statusCode=t,e.setHeader("Content-Type","application/json; charset=utf-8"),e.setHeader("Content-Length",Buffer.byteLength(r)),e.end(r)}function se(e){return e.headers.authorization===`Bearer ${H}`}function le(){try{return JSON.parse(E.readFileSync(j,"utf8"))}catch(e){throw new Error(`Unable to read ${c.siteDataFile}: ${e instanceof Error?e.message:"unknown error"}`)}}function de(){return h?!1:(R="",o.validation={status:"running",startedAt:new Date().toISOString(),completedAt:null,exitCode:null},h=O(process.execPath,[ie,"validate",i.templatePath],{cwd:__dirname,env:process.env,stdio:["ignore","pipe","pipe"]}),h.stdout.on("data",e=>l("validation",e)),h.stderr.on("data",e=>l("validation",e)),h.on("error",e=>{l("validation",`
Unable to start validation: ${e.message}
`)}),h.on("close",e=>{o.validation={...o.validation,status:e===0?"passed":"failed",completedAt:new Date().toISOString(),exitCode:e},h=null}),!0)}function V(){if(P||o.devStatus==="ready")return;const e=A.get(G,t=>{if(t.resume(),t.statusCode&&t.statusCode<500){o.devStatus="ready",o.devError=null,b=0,process.stdout.write(`
Live preview ready: ${$}
`);return}I=setTimeout(V,600)});e.setTimeout(900,()=>e.destroy()),e.on("error",()=>{I=setTimeout(V,600)})}function pe(e){if(!(P||_)){if(b>=k){o.devStatus="failed",o.devError=e;return}b+=1,o.devStatus="starting",o.devError=null,l("dev",`
Preview server stopped during navigation (${e}). Restarting (${b}/${k})...
`),_=setTimeout(()=>{_=null,F()},900)}}function ce(){const e=f.join(i.templatePath,"node_modules");if(!i.skipInstall&&!E.existsSync(e)){o.devStatus="installing";const t=typeof c.installCommand=="string"&&c.installCommand.trim()?c.installCommand.trim():"npm install";l("dev",`Installing local dependencies with: ${t}
`);const a=O(t,{cwd:i.templatePath,env:process.env,shell:!0,stdio:["ignore","pipe","pipe"]});u=a,a.stdout.on("data",r=>l("dev",r)),a.stderr.on("data",r=>l("dev",r)),a.on("error",r=>{o.devStatus="failed",o.devError=r.message,u=null}),a.on("close",r=>{if(u=null,r!==0){o.devStatus="failed",o.devError=`Dependency installation exited with code ${r}.`;return}F()});return}F()}function F(){o.devStatus="starting",o.devError=null,l("dev",`Starting template source server on ${G}. Source edits will hot reload.
`),u=O(process.platform==="win32"?"npm.cmd":"npm",["run","dev","--","--hostname",v,"--port",String(i.previewPort)],{cwd:i.templatePath,env:{...process.env,NEXT_PUBLIC_SITE_BASE_PATH:""},shell:process.platform==="win32",stdio:["ignore","pipe","pipe"]}),u.stdout.on("data",e=>l("dev",e)),u.stderr.on("data",e=>l("dev",e)),u.on("error",e=>{o.devStatus="failed",o.devError=e.message,u=null}),u.on("close",(e,t)=>{if(u=null,!P){const a=t?`signal ${t}`:`exit code ${e}`;pe(a)}}),V()}function ue(){return`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    html, body, #template-preview { width: 100%; height: 100%; margin: 0; border: 0; }
    body { overflow: hidden; background: #080808; }
    #template-preview { display: block; }
    #bridge-error { position: fixed; inset: 16px; z-index: 10; display: none;
      padding: 16px; color: #fecaca; background: #450a0a; font: 14px system-ui; }
  </style>
</head>
<body>
  <div id="bridge-error"></div>
  <iframe id="template-preview" title="Local template preview"></iframe>
  <script>
    (() => {
      const BRIDGE_SOURCE = ${JSON.stringify(D)};
      const preview = document.getElementById('template-preview');
      const errorBox = document.getElementById('bridge-error');
      const PREVIOUS_PREVIEW_PREFIX = ['MARKET', 'PLACE'].join('') + '_PREVIEW_';
      const previousPreviewMessage = (suffix) => PREVIOUS_PREVIEW_PREFIX + suffix;
      const savedMessages = new Map();
      let childReady = false;
      let portalOrigin = '*';
      let installTimer = null;

      function sendToChild(payload) {
        preview.contentWindow?.postMessage(payload, '*');
      }

      function sendToPortal(payload) {
        window.parent.postMessage(payload, portalOrigin);
      }

      window.addEventListener('message', (event) => {
        if (!event.data || typeof event.data !== 'object') return;
        if (event.source === window.parent) {
          if (portalOrigin === '*' && event.origin && event.origin !== 'null') {
            portalOrigin = event.origin;
          }
          if (portalOrigin !== '*' && event.origin !== portalOrigin) return;
          if (event.data.type === 'FIVORA_PREVIEW_EDIT_MODE' ||
              event.data.type === previousPreviewMessage('EDIT_MODE') ||
              event.data.type === 'FIVORA_PREVIEW_SITE_DATA' ||
              event.data.type === previousPreviewMessage('SITE_DATA') ||
              event.data.type === 'FIVORA_PREVIEW_FOCUS_PAGE' ||
              event.data.type === previousPreviewMessage('FOCUS_PAGE')) {
            savedMessages.set(event.data.type, event.data);
          }
          if (childReady && (String(event.data.type || '').startsWith('FIVORA_PREVIEW_') || String(event.data.type || '').startsWith(PREVIOUS_PREVIEW_PREFIX))) {
            sendToChild(event.data);
          }
          return;
        }
        if (event.source !== preview.contentWindow) return;
        if (event.data.type === 'FIVORA_PREVIEW_READY' || event.data.type === previousPreviewMessage('READY')) {
          childReady = true;
          savedMessages.forEach(sendToChild);
          sendToPortal(event.data);
          return;
        }
        if (String(event.data.type || '').startsWith('FIVORA_PREVIEW_') || String(event.data.type || '').startsWith(PREVIOUS_PREVIEW_PREFIX)) {
          sendToPortal(event.data);
        }
      });

      function installBridge() {
        if (
          !preview.contentDocument ||
          preview.contentDocument.readyState !== 'complete' ||
          preview.contentWindow.__FIVORA_LOCAL_VISUAL_BRIDGE_ATTACHED__ === true
        ) {
          return;
        }
        try {
          const script = preview.contentDocument.createElement('script');
          script.setAttribute('data-fivora-local-visual-bridge', '');
          script.textContent = BRIDGE_SOURCE;
          preview.contentDocument.head.appendChild(script);
          preview.contentWindow.__FIVORA_LOCAL_VISUAL_BRIDGE_ATTACHED__ = true;
          script.remove();
        } catch (error) {
          errorBox.style.display = 'block';
          errorBox.textContent = 'Unable to attach the local visual editor: ' + error.message;
        }
      }

      preview.addEventListener('load', () => {
        childReady = false;
        window.clearTimeout(installTimer);
        // Next development hydration can continue briefly after load. Attach
        // after it settles, while the wrapper watchdog below keeps the bridge
        // present after a hard reload or development refresh.
        installTimer = window.setTimeout(installBridge, 600);
      });

      window.setInterval(installBridge, 900);

      preview.src = '/';
    })();
  <\/script>
</body>
</html>`}function w(e){if(!e||typeof e!="object")return!1;const t="code"in e?String(e.code):"";return t==="ECONNRESET"||t==="ECONNABORTED"||t==="EPIPE"||t==="ERR_STREAM_DESTROYED"}function me(e,t){const a={...e.headers};a.host=`${v}:${i.previewPort}`,delete a["accept-encoding"],delete a.authorization;const r=A.request({hostname:v,port:i.previewPort,method:e.method,path:e.url,headers:a},n=>{t.writeHead(n.statusCode||502,n.statusMessage,n.headers),n.on("error",s=>{w(s)||l("dev",`
Preview proxy upstream error: ${s.message}
`),t.writableEnded||t.destroy()}),t.on("error",s=>{w(s)||l("dev",`
Preview proxy response error: ${s.message}
`),n.destroy()}),n.pipe(t)});r.on("error",n=>{w(n)||l("dev",`
Preview proxy request error: ${n.message}
`),t.headersSent?t.writableEnded||t.destroy():g(t,502,{message:`Local preview is not ready: ${n.message}`})}),e.on("error",n=>{w(n)||l("dev",`
Preview proxy client error: ${n.message}
`),r.destroy()}),e.pipe(r)}const C=A.createServer((e,t)=>{const a=new URL(e.url||"/",y);if(e.method==="GET"&&a.pathname===U){const r=ue();t.writeHead(200,{"Cache-Control":"no-store","Content-Length":Buffer.byteLength(r),"Content-Type":"text/html; charset=utf-8"}),t.end(r);return}if(!a.pathname.startsWith("/api/")){me(e,t);return}if(oe(e,t),e.method==="OPTIONS"){t.statusCode=204,t.end();return}if(!se(e)){g(t,401,{message:"Invalid Local Template Lab token."});return}if(e.method==="GET"&&a.pathname==="/api/status"){g(t,200,K());return}if(e.method==="GET"&&a.pathname==="/api/site-data"){try{g(t,200,{manifest:c,siteData:le(),siteDataFile:c.siteDataFile})}catch(r){g(t,500,{message:r instanceof Error?r.message:"Unable to read site data."})}return}if(e.method==="POST"&&a.pathname==="/api/validate"){if(!de()){g(t,409,{message:"Validation is already running."});return}g(t,202,K());return}g(t,404,{message:"Local Template Lab endpoint not found."})});function fe(e,t){const a=()=>{e.destroyed||e.destroy(),t.destroyed||t.destroy()},r=n=>{w(n)||l("dev",`
Preview proxy socket error: ${n.message}
`),a()};e.on("error",r),t.on("error",r),e.on("close",()=>{t.destroyed||t.end()}),t.on("close",()=>{e.destroyed||e.end()}),t.pipe(e),e.pipe(t)}C.on("upgrade",(e,t,a)=>{if(e.url?.startsWith("/api/")){t.destroy();return}t.on("error",s=>{w(s)||l("dev",`
Preview proxy upgrade client error: ${s.message}
`)});const r={...e.headers};r.host=`${v}:${i.previewPort}`;const n=A.request({hostname:v,port:i.previewPort,method:e.method,path:e.url,headers:r});n.on("upgrade",(s,m,d)=>{const Y=Object.entries(s.headers).flatMap(([z,L])=>(Array.isArray(L)?L:[L]).filter(S=>S!==void 0).map(S=>`${z}: ${S}`)).join(`\r
`);t.write(`HTTP/1.1 ${s.statusCode||101} ${s.statusMessage||"Switching Protocols"}\r
${Y}\r
\r
`),a.length&&m.write(a),d.length&&t.write(d),fe(t,m)}),n.on("error",s=>{w(s)||l("dev",`
Preview proxy upgrade upstream error: ${s.message}
`),t.destroyed||t.destroy()}),n.end()});function X(e){!e||e.killed||e.kill("SIGTERM")}function J(){P||(P=!0,I&&clearTimeout(I),_&&clearTimeout(_),X(h),X(u),C.close(()=>process.exit(0)),setTimeout(()=>process.exit(0),1500).unref())}C.on("error",e=>{p(`Unable to start loopback controller at ${y}: ${e instanceof Error?e.message:"unknown error"}`)}),C.listen(i.apiPort,v,()=>{process.stdout.write(["","Fivora Local Template Lab is running.",`Template: ${o.templateName}`,`Controller URL: ${y}`,`Connection token: ${H}`,`Preview URL: ${$}`,"","Paste the controller URL and connection token into Developer Portal > Local Test Lab.","Press Ctrl+C to stop. No template files are uploaded by this process.",""].join(`
`)),ce()}),process.on("SIGINT",J),process.on("SIGTERM",J);

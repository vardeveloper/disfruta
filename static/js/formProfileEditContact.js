(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["formProfileEditContact"],{"11e9":function(t,e,r){var n=r("52a7"),a=r("4630"),i=r("6821"),s=r("6a99"),o=r("69a8"),u=r("c69a"),l=Object.getOwnPropertyDescriptor;e.f=r("9e1e")?l:function(t,e){if(t=i(t),e=s(e,!0),u)try{return l(t,e)}catch(r){}if(o(t,e))return a(!n.f.call(t,e),t[e])}},"13a9":function(t,e,r){},"1d61":function(t,e,r){"use strict";var n=r("6c1e"),a=r.n(n);a.a},3812:function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("label",{staticClass:"field-content",attrs:{for:t.id},on:{change:t.updated}},[r("span",{staticClass:"field-main"},[r("span",{staticClass:"field-label",style:t.styleLabel},[t._v(t._s(t.label))]),r("span",{staticClass:"field-input",class:{"field-input-checked":t.value}},[r("input",{attrs:{id:t.id,name:t.name,type:t.type},domProps:{checked:t.value}})])]),t._l(t.errors,function(e){return[r("label",{staticClass:"error",attrs:{for:t.id}},[t._v(t._s(e))])]})],2)},a=[],i={name:"FormCheckbox",props:{id:{default:"",type:String},name:{default:"",type:String},type:{default:"checkbox",type:String},value:{default:""},label:{default:"",type:String},errors:{default:function(){return[]},type:Array},attrs:{default:function(){return{}},type:Object},styleLabel:{default:"",type:String}},data:function(){return{value_:null}},methods:{updated:function(t){this.value_=t.target.checked,this.$emit("input",this.value_)}},created:function(){this.value&&(this.value_=1)},mounted:function(){var t;if(this.$refs.input||(this.$refs.input=this.$el.querySelector(".field-input > input")),this.$refs.input&&this.$refs.input.checked&&this.updated({target:this.$refs.input}),this.attrs)for(t in this.attrs)this.$refs.input.setAttribute(t,this.attrs[t])}},s=i,o=(r("bf79"),r("2877")),u=Object(o["a"])(s,n,a,!1,null,"74dabad8",null);e["a"]=u.exports},"39ec":function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"form",class:{"form-loading":t.isFormBusy}},[r("div",{staticClass:"form-title"},[t._t("header")],2),t.submitSuccess?t._e():r("form",{ref:"form",attrs:{action:t.action,method:t.method},on:{submit:t.handleSubmit}},[r("div",{staticClass:"form-overlay"}),t._t("main"),r("div",{staticClass:"buttons-center"},[t._t("footer")],2)],2)])},a=[],i={name:"Form",props:{action:{default:""},method:{default:"POST"},isFormBusy:{default:0},submitSuccess:{default:!1,type:Boolean}},data:function(){return{messageSuccess:null}},methods:{handleSubmit:function(t){this.$emit("submit",t)},submit:function(){this.$refs.form.submit()}},mounted:function(){for(var t=this.$el.querySelectorAll("form > *"),e=t.length,r=0,n={};r<e;++r)n=t[r],n&&n.style&&(n.style.opacity=0);function a(){r<e&&(n=t[r],n&&n.style&&(n.style.opacity=1),++r,setTimeout(a,100))}r=0,n={},setTimeout(a,250)}},s=i,o=(r("7fc1"),r("2877")),u=Object(o["a"])(s,n,a,!1,null,"67aed4f9",null);e["a"]=u.exports},4536:function(t,e,r){},"4e82":function(t,e,r){"use strict";var n=r("6f6f"),a=r.n(n);a.a},"5dbc":function(t,e,r){var n=r("d3f4"),a=r("8b97").set;t.exports=function(t,e,r){var i,s=e.constructor;return s!==r&&"function"==typeof s&&(i=s.prototype)!==r.prototype&&n(i)&&a&&a(t,i),t}},"6c1e":function(t,e,r){},"6f6f":function(t,e,r){},"7fc1":function(t,e,r){"use strict";var n=r("13a9"),a=r.n(n);a.a},"80f8":function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("Form",{ref:"form",attrs:{method:"POST",isFormBusy:t.isFormBusy,submitSuccess:t.formSubmitSuccess},on:{submit:t.handleSubmit},scopedSlots:t._u([{key:"header",fn:function(){return[t.formSubmitSuccess?[r("p",{staticClass:"form-message-success"},[t._v("Gracias, tus datos fueron actualizados correctamente.")]),r("div",{staticClass:"buttons-center"},[r("a",{staticClass:"button",on:{click:function(e){return e.preventDefault(),t.handleCancelBtn(e)}}},[t._v("Aceptar")])])]:[r("h3",[t._v("Verifica tus datos")])]]},proxy:!0},{key:"main",fn:function(){return[t.errorCustom?r("p",{staticClass:"form-message-error",domProps:{innerHTML:t._s(t.errorCustom)}}):t._e(),r("input",{attrs:{type:"hidden",name:"_xsrf"},domProps:{value:t.$store.state.handler.xsrf}}),r("FormInput",{ref:"email",attrs:{label:"Ingresa tu nuevo correo electrónico",id:"email",name:"email",errors:t.errorsEmail},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}}),r("FormInput",{ref:"phone",attrs:{label:"Ingresa tu nuevo celular",id:"phone",name:"phone",errors:t.errorsPhone,attrs:{maxlength:9}},model:{value:t.phone,callback:function(e){t.phone=e},expression:"phone"}}),r("p",[r("small",[t._v("Estos datos se actualizarán en la base de datos de Profuturo AFP.")])]),r("FormCheckbox",{attrs:{label:"Acepto los términos y condiciones de uso.",id:"term",name:"accept_terms",errors:t.errorsTerm,styleLabel:"font-size: 12px"},model:{value:t.term,callback:function(e){t.term=e},expression:"term"}})]},proxy:!0},{key:"footer",fn:function(){return[r("a",{staticClass:"button-simple",on:{click:function(e){return e.preventDefault(),t.handleCancelBtn(e)}}},[t._v("Cancelar")]),r("button",{staticClass:"button",attrs:{type:"submit"}},[t._v(t._s(t.submitLabel))])]},proxy:!0}])})},a=[],i=(r("cadf"),r("551c"),r("f751"),r("097d"),r("39ec")),s=r("db6d"),o=r("3812"),u=r("bc3a"),l=r.n(u),c=/^9(\d){8}$/,f=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,p={name:"FormProfileEditContact",components:{Form:i["a"],FormInput:s["a"],FormCheckbox:o["a"]},props:{submitLabel:{default:"Actualizar"},requestProfileOnInit:{default:!1,type:Boolean},allowNormalSubmit:{default:!1,type:Boolean}},data:function(){return{isFormBusy:0,formSubmitSuccess:!1,email:null,phone:null,term:null,errorsEmail:[],errorsPhone:[],errorsTerm:[],errorCustom:null}},watch:{email:function(){this.validEmail()},phone:function(){this.validPhone()},term:function(){this.validTerm()}},computed:{profile:function(){return this.$store.state.profile}},methods:{handleCancelBtn:function(){this.$emit("cancel")},validTerm:function(){var t=[];return this.term||t.push("Este campo es requerido"),this.errorsTerm=t,t.length},validEmail:function(){var t=this.email,e=[];return t?f.test(t)||e.push("Email inválido"):e.push("Este campo es requerido"),this.errorsEmail=e,e.length},validPhone:function(){var t=this.phone,e=[];return t?c.test(t)||e.push("Teléfono inválido"):e.push("Este campo es requerido"),this.errorsPhone=e,e.length},validate:function(){return this.validEmail()+this.validPhone()+this.validTerm()},handleSubmit:function(t){var e,r=this;t.preventDefault(),0===r.validate()&&(r.allowNormalSubmit?r.$refs.form&&"function"===typeof r.$refs.form.submit&&r.$refs.form.submit():(r.isFormBusy=1,r.$refs.form&&"function"===typeof r.$refs.form.submit&&(e=new FormData,e.append("email",r.email),e.append("phone",r.phone),e.append("_xsrf",r.$store.state.handler.xsrf),e.append("accept_terms",!0),l()({url:"/perfil/edit",method:"post",data:e,headers:{"x-requested-with":"XMLHttpRequest"}}).then(function(e){var n=e.data;if(r.isFormBusy=0,n&&n.ok){r.formSubmitSuccess=!0,r.$store.dispatch("setProfileEmail",r.email),r.$store.dispatch("setProfilePhone",r.phone);try{gtag("event","profile_update")}catch(t){}}else n.errors?r.errorCustom=n.errors.join("<br/>"):r.errorCustom="Ocurri&oacute; un error inesperado. Por favor, vuelva a intentarlo"}).catch(function(){r.isFormBusy=0,r.errorCustom="Ocurri&oacute; un error inesperado. Por favor, vuelva a intentarlo"}))))},getProfileData:function(){var t=this;t.isFormBusy=1,l()({url:"/perfil/edit",method:"GET",headers:{"x-requested-with":"XMLHttpRequest"}}).then(function(e){var r=e.data;t.isFormBusy=0,r&&r.ok&&(r.email&&(t.$store.dispatch("setProfileEmail",r.email),t.email=r.email),r.phone&&(t.$store.dispatch("setProfilePhone",r.phone),t.phone=r.phone))}).catch(function(){t.isFormBusy=0})}},created:function(){var t=this.$store.state.profile;t&&(t.email&&(this.email=t.email),t.phone&&(this.phone=t.phone))},mounted:function(){var t=this;t.requestProfileOnInit&&t.getProfileData()}},d=p,m=(r("4e82"),r("2877")),h=Object(m["a"])(d,n,a,!1,null,"62236928",null);e["default"]=h.exports},"8b97":function(t,e,r){var n=r("d3f4"),a=r("cb7c"),i=function(t,e){if(a(t),!n(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,n){try{n=r("9b43")(Function.call,r("11e9").f(Object.prototype,"__proto__").set,2),n(t,[]),e=!(t instanceof Array)}catch(a){e=!0}return function(t,r){return i(t,r),e?t.__proto__=r:n(t,r),t}}({},!1):void 0),check:i}},9093:function(t,e,r){var n=r("ce10"),a=r("e11e").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,a)}},aa77:function(t,e,r){var n=r("5ca1"),a=r("be13"),i=r("79e5"),s=r("fdef"),o="["+s+"]",u="​",l=RegExp("^"+o+o+"*"),c=RegExp(o+o+"*$"),f=function(t,e,r){var a={},o=i(function(){return!!s[t]()||u[t]()!=u}),l=a[t]=o?e(p):s[t];r&&(a[r]=l),n(n.P+n.F*o,"String",a)},p=f.trim=function(t,e){return t=String(a(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(c,"")),t};t.exports=f},bf79:function(t,e,r){"use strict";var n=r("4536"),a=r.n(n);a.a},c5f6:function(t,e,r){"use strict";var n=r("7726"),a=r("69a8"),i=r("2d95"),s=r("5dbc"),o=r("6a99"),u=r("79e5"),l=r("9093").f,c=r("11e9").f,f=r("86cc").f,p=r("aa77").trim,d="Number",m=n[d],h=m,v=m.prototype,b=i(r("2aeb")(v))==d,y="trim"in String.prototype,_=function(t){var e=o(t,!1);if("string"==typeof e&&e.length>2){e=y?e.trim():p(e,3);var r,n,a,i=e.charCodeAt(0);if(43===i||45===i){if(r=e.charCodeAt(2),88===r||120===r)return NaN}else if(48===i){switch(e.charCodeAt(1)){case 66:case 98:n=2,a=49;break;case 79:case 111:n=8,a=55;break;default:return+e}for(var s,u=e.slice(2),l=0,c=u.length;l<c;l++)if(s=u.charCodeAt(l),s<48||s>a)return NaN;return parseInt(u,n)}}return+e};if(!m(" 0o1")||!m("0b1")||m("+0x1")){m=function(t){var e=arguments.length<1?0:t,r=this;return r instanceof m&&(b?u(function(){v.valueOf.call(r)}):i(r)!=d)?s(new h(_(e)),r,m):_(e)};for(var g,S=r("9e1e")?l(h):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),$=0;S.length>$;$++)a(h,g=S[$])&&!a(m,g)&&f(m,g,c(h,g));m.prototype=v,v.constructor=m,r("2aba")(n,d,m)}},db6d:function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"field-content",class:{"field-state-open":t.isOpen},on:{focusin:t.handleFocus,focusout:t.handleFocus,change:t.updated}},[r("label",{staticClass:"field-label",attrs:{for:t.id}},[t._v(t._s(t.label))]),r("label",{staticClass:"field-label-helper",attrs:{for:t.id}},[t._v(t._s(t.label))]),r("div",{staticClass:"field-input"},[t._t("input",[r("input",{ref:"input",attrs:{type:t.type,id:t.id,name:t.name},domProps:{value:t.value},on:{keyup:t.updated}})])],2),t._t("errors",[t._l(t.errors,function(e){return[r("label",{staticClass:"error",attrs:{for:t.id}},[t._v(t._s(e))])]})])],2)},a=[],i=(r("c5f6"),{name:"FormInput",props:{id:{default:"",type:String},name:{default:"",type:String},type:{default:"text",type:String},label:{default:"",type:String},open:{default:0,type:Number},value:{default:""},errors:{default:function(){return[]},type:Array},attrs:{default:function(){return{}},type:Object}},data:function(){return{isOpen:0,value_:null}},watch:{open:function(t){this.isOpen=t},value:function(t){this.isOpen=t?1:0}},methods:{handleFocus:function(t){var e=t.type,r=t.target;"focusout"===e&&r&&!r.value?this.isOpen=0:"focusin"!==e||this.isOpen||(this.isOpen=1)},updated:function(t){this.value_=t.target.value,this.$emit("input",this.value_)}},created:function(){this.value_=this.value,this.value_&&(this.isOpen=1)},mounted:function(){var t;if(this.$refs.input||(this.$refs.input=this.$el.querySelector(".field-input > input")||this.$el.querySelector(".field-input > select")),this.$refs.input&&this.$refs.input.value&&this.updated({target:this.$refs.input}),this.attrs)for(t in this.attrs)this.$refs.input.setAttribute(t,this.attrs[t])}}),s=i,o=(r("1d61"),r("2877")),u=Object(o["a"])(s,n,a,!1,null,"714762ba",null);e["a"]=u.exports},fdef:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);
//# sourceMappingURL=formProfileEditContact.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["search"],{"77e0":function(e,t,a){"use strict";var o=a("8baa"),s=a.n(o);s.a},"79ce":function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Page",{scopedSlots:e._u([{key:"header",fn:function(){return[a("BaseHeader")]},proxy:!0},{key:"main",fn:function(){return[e.isBusy?a("Loader"):e._e(),e.results&&e.results.length>0?[a("h1",{staticClass:"title"},[e._v('Resultados de la búsqueda para "'+e._s(decodeURIComponent(e.query.q||""))+'"')]),a("div",{staticClass:"coupons"},[e._l(e.results,function(e){return[a("Coupon",{attrs:{name:e.name,coupon_type:e.coupon_type,coupon_value:e.coupon_value,excerpt:e.excerpt,highlight:e.highlight,id:e.id,slug:e.slug,store_name:e.store_name,store_img:e.store_img,img:e.highlight?e.img_large:e.img,cname:e.category_slug?"page-"+e.category_slug:"",category_slug:e.category_slug,category_id:e.category_id}})]})],2)]:[0==e.isBusy?a("div",{staticClass:"result"},[a("h1",{staticClass:"title"},[e._v('No se encontraron resultados para la búsqueda de: "'+e._s(decodeURIComponent(e.query.q||""))+'"')])]):e._e()]]},proxy:!0},{key:"footer",fn:function(){return[a("Footer")]},proxy:!0}])})},s=[],n=(a("386d"),a("28a5"),a("fc23")),r=a("1f43"),l=a("b2c8"),i=a("7c53"),c=a("d4f3"),u=a("555f"),h=a("bc3a"),d=a.n(h),g=window.__template_data,p={name:"Search",mixins:[i["a"]],components:{Page:n["a"],BaseHeader:r["a"],Footer:l["a"],Coupon:c["a"],Loader:u["a"]},data:function(){return{query:{},isBusy:1,allowScrollNavigation:0,results:null}},watch:{$route:"search"},methods:{getData:function(e){var t=this;t.isBusy=1,g&&g.searchResults?(t.results=[].concat(g.searchResults||[]),g.searchResults=null,delete g.searchResults,t.isBusy=0,"function"===typeof e&&e()):d.a.get("?q="+t.$route.query.q+"&xhr="+(new Date).getTime(),{headers:{"x-requested-with":"XMLHttpRequest"}}).then(function(a){t.isBusy=0,a&&a.data&&(t.results=[].concat(a.data.data||[])),"function"===typeof e&&e()}).catch(function(){t.isBusy=0,"function"===typeof e&&e()})},parseQueryString:function(){for(var e=location.search.split("?").join("").split("&"),t={},a=0,o=e.length,s=[];a<o;++a)s=e[a].split("="),t[s[0]]=s[1];return t},search:function(){this.query=this.$route.query,this.getData()}},mounted:function(){var e=this;e.query=e.parseQueryString(),e.getData(function(){e.initPageScrollEvents()})}},m=p,f=(a("77e0"),a("2877")),v=Object(f["a"])(m,o,s,!1,null,"1029eb8b",null);t["default"]=v.exports},"7c53":function(e,t,a){"use strict";var o=a("5176"),s=a.n(o),n=(a("7f7f"),a("4557"));t["a"]={data:function(){return{allowScrollNavigation:0,isScrollBottom:0,isNextPageCalled:0,isScrollTop:1,isPrevPageCalled:0,scrollTopTimeout:0,scrollBottomTimeout:0,$wrap:{},$header:{}}},computed:{nextMenu:function(){var e=this.$store.state.nextMenu||{};return e.id?e:{}},prevMenu:function(){var e=this.$store.state.prevMenu||{};return e.id?e:{}},currentMenu:function(){var e=this.$store.state.currentMenu||{};return e.id?e:{}},nextPageUrl:function(){var e=this.nextMenu||{};return e.id?{name:"category",params:{slug:e.slug,id:e.id,index:e.index}}:{name:"",params:{}}},prevPageUrl:function(){var e=this.prevMenu||{};return e.id?{name:"category",params:{slug:e.slug,id:e.id,index:e.index}}:{name:"home",params:{}}},getPageNextLoader:function(){return function(){return this.$el.querySelector(".page-next-loader-trigger")}}},methods:{resetScroll:function(){var e=this;this.$el.scrollTop=0,this.isResetScroll=1,this.isScrollBottom=0,this.isNextPageCalled=0,e.$store.dispatch("setIsNextPageCalled",0),this.isScrollTop=1,this.$el.classList.remove("page-state-bottom"),e.isPrevPageCalled=0,e.$store.dispatch("setIsPrevPageCalled",0)},handleScrollTop:function(e){var t=this,a=t.$el,o=t.scrollSpeed.get(e);o<-10||e<100?a.classList.contains("page-stick-header")&&a.classList.remove("page-stick-header"):o>0&&e>100&&(a.classList.contains("page-stick-header")||a.classList.add("page-stick-header")),t.allowScrollNavigation&&(t.isScrollTop=0===e?1:0)},handleScrollBottom:function(e){var t=this,a=t.$el,o=0,s=0;t.isNextPageCalled||(o=t.$wrap.clientHeight,s=a.clientHeight,t.allowScrollNavigation&&(e+s>=o?(t.isScrollBottom=1,a.classList.add("page-state-bottom")):(t.isScrollBottom=0,a.classList.remove("page-state-bottom"))))},handleScroll:function(){var e=this,t=e.$el.scrollTop;clearTimeout(e.scrollTopTimeout),e.scrollTopTimeout=setTimeout(function(){e.handleScrollTop(t)},1),clearTimeout(e.scrollBottomTimeout),e.scrollBottomTimeout=setTimeout(function(){e.handleScrollBottom(t)},50)},handleWheel:function(e){var t=this,a=e.deltaY,o=Math.abs(t.wheelSpeed.get(a));o>20?a>0&&t.isScrollBottom&&!t.isNextPageCalled?(t.isNextPageCalled=1,t.$store.dispatch("setIsNextPageCalled",1),t.handleNextPage()):a<0&&t.isScrollTop&&!t.isPrevPageCalled&&(t.isPrevPageCalled=1,t.$store.dispatch("setIsPrevPageCalled",1),t.handlePrevPage()):o<=1&&t.isPrevPageCalled&&(t.isPrevPageCalled=0,t.$store.dispatch("setIsPrevPageCalled",0))},handleNextPage:function(){this.nextPageUrl&&this.nextPageUrl.name&&this.$router.push({name:this.nextPageUrl.name,params:s()({},this.nextPageUrl.params)})},handlePrevPage:function(){this.prevPageUrl&&this.prevPageUrl.name&&this.$router.push({name:this.prevPageUrl.name,params:s()({},this.prevPageUrl.params)})},pageTransitionPrev:function(e,t){var a=this;a.endPageScrollEvents(),setTimeout(function(){"function"===typeof a.pageEnterTopTransition?a.pageEnterTopTransition(e.params.slug,function(){"function"===typeof t&&t(),a.resetScroll(),setTimeout(function(){a.initPageScrollEvents()},100)}):("function"===typeof t&&t(),a.resetScroll(),setTimeout(function(){a.initPageScrollEvents()},100))},100)},pageTransitionNext:function(e,t){var a=this;a.endPageScrollEvents(),setTimeout(function(){"function"===typeof a.pageEnterTransition?a.pageEnterTransition(e.params.slug,function(){t(),a.resetScroll(),setTimeout(function(){a.initPageScrollEvents()},100)}):(t(),a.resetScroll(),setTimeout(function(){a.initPageScrollEvents()},100))},100)},initPageScrollEvents:function(){this.$el.addEventListener("scroll",this.handleScroll),this.allowScrollNavigation&&this.$el.addEventListener("wheel",this.handleWheel)},endPageScrollEvents:function(){this.$el.removeEventListener("scroll",this.handleScroll),this.allowScrollNavigation&&this.$el.removeEventListener("wheel",this.handleWheel)},configureIconScroll:function(e){e=e||{};var t=this,a=e.$el||t.$el,o=e.scrollTop||a.scrollTop,s=e.viewportHeight||a.clientHeight,n=e.viewportScrollHeight||t.$wrap.clientHeight;t.$iconScroll&&(n-(s+o)<200?t.$iconScroll.classList.contains("icon-scroll-active")||t.$iconScroll.classList.add("icon-scroll-active"):t.$iconScroll.classList.remove("icon-scroll-active"))}},updated:function(){this.configureIconScroll()},mounted:function(){var e=this,t=e.$el;e.$wrap=t.querySelector(".page-wrap"),e.$header=t.querySelector(".page-header"),e.$iconScroll=t.querySelector(".icon-scroll"),e.scrollSpeed=new n["a"],e.wheelSpeed=new n["a"]}}},"8baa":function(e,t,a){}}]);
//# sourceMappingURL=search.js.map
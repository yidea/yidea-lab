//GA Local integrate
if(!IS_LOCAL_TEST){
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-18369335-1']);
    _gaq.push(['_setDomainName', 'none']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/u/ga_debug.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}
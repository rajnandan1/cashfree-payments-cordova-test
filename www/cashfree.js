var exec = require('cordova/exec');

var PLUGIN_NAME = 'Cashfree';

var Cashfree = {
    echo: function(phrase, cb) {
        exec(cb, null, PLUGIN_NAME, 'echo', [phrase]);
    },
    checkout: function(sdkInput, cb) {
        return new Promise(function(resolve, reject) {
            var order = sdkInput.order;
            var url = "https://test.cashfree.com/billpay/checkout/post/submit";
            var toolbarcolor = "#7d49f0";
            var closebuttoncolor = "#ffffff";

            if (sdkInput.toolbarcolor) toolbarcolor = sdkInput.toolbarcolor;
            if (sdkInput.closebuttoncolor) closebuttoncolor = sdkInput.closebuttoncolor;
            if (sdkInput.env !== undefined && sdkInput.env == "PROD") url = "https://www.cashfree.com/checkout/post/submit";
           
            var pageContent = '<html><body><form id="redirectForm" method="post" action="' + url + '">';
            pageContent = pageContent + '<input type="hidden" name="source" value="cordova-sdk"/>';
            pageContent = pageContent + '<input type="hidden" name="appId" value="' + sdkInput.appId + '"/>';
            pageContent = pageContent + '<input type="hidden" name="tokenData" value="' + sdkInput.cftoken + '"/>';
            //pageContent = pageContent + '<input type="hidden" name="returnUrl" value="https://92e12e4ca49e.ngrok.io/play/return2.php"/>';
            for (let key in order) {
                if (order.hasOwnProperty(key)) {
                    pageContent = pageContent + '<input type="hidden" name="' + key + '" value="' + order[key] + '"/>';
                }
            }
            pageContent = pageContent + '</form><script type="text/javascript">window.onload = function(){document.getElementById("redirectForm").submit()};</script></body></html>';
            var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
            var browserObjectOptions = [
                "hidenavigationbuttons=yes",
                "hidden=no",
                "location=yes",
                "hideurlbar=yes",
                "clearsessioncache=yes",
                "clearcache=yes",
                "toolbarcolor=" + toolbarcolor,
                "hardwareback=no",
                "closebuttoncolor=" + closebuttoncolor,
                "useWideViewPort=no",
                "lefttoright=yes",
                "zoom=no",
                /**ios*/
                "hidespinner=no",
                "toolbarposition=top",
                "enableViewportScale=no",
                "enableViewportScale=yes"
            ];

            var browserRef = cordova.InAppBrowser.open(
                pageContentUrl,
                "_self",
                browserObjectOptions.join()
            );
            browserRef.addEventListener("message", function(event) {
                browserRef.close();
                return resolve(event.data)
            });

        });


    }
};

module.exports = Cashfree;
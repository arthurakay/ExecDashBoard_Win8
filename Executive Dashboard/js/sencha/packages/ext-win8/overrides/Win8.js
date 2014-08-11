//@ override Ext.env.Ready
(function (E) {
    var v = E.getVersion();

    if (v.major < 5 || (v.major === 5 && v.minor === 0 && v.patch === 0)) {
        //<debug>
        E.Error.raise('The "ext-win8" package must be used with Ext JS 5.0.1 or higher.');
        //</debug>
        return;
    }

    else if (v.major === 5 && v.minor === 0 && v.patch < 2) {
        /*
         * EXTJS-14614 is fixed in Ext JS > 5.0.1
         */
        (function (Ready) {
            var invokeAll = Ready.invokeAll;
            Ready.invokeAll = function () {
                return MSApp.execUnsafeLocalFunction(function () {
                    return invokeAll.call(Ready);
                });
            };
        })(E.env.Ready);

        (function (EXT) {
            var MScallback = EXT.callback;

            EXT.callback = function (callback, scope, args, delay, caller, defaultScope) {
                return MSApp.execUnsafeLocalFunction(function () {
                    return MScallback.call(EXT, callback, scope, args, delay, caller, defaultScope);
                });
            };
        })(E);
    }
})(Ext);

Ext.elevateFunction = function (fn, scope, args) {
    //to satisfy the Windows 8 CSP:
    // http://msdn.microsoft.com/en-us/library/windows/apps/hh767331....
    return MSApp.execUnsafeLocalFunction(function () {
        return fn.apply(scope, args);
    });
};
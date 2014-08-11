//@ override Ext.env.Ready
Ext.elevateFunction = function (fn, scope, args) {
    //to satisfy the Windows 8 CSP:
    // http://msdn.microsoft.com/en-us/library/windows/apps/hh767331....
    return MSApp.execUnsafeLocalFunction(function () {
        return fn.apply(scope, args);
    });
};

//When microloader has finished loading all dependencies
(function (Ready) {
    var invokeAll = Ready.invokeAll;
    Ready.invokeAll = function () {
        return MSApp.execUnsafeLocalFunction(function () {
            return invokeAll.call(Ready);
        });
    };
})(Ext.env.Ready);

//the Grids throw errors after loading their JSON data... callbacks need to be wrapped in elevateFunction()
(function (E) {
    var MScallback = E.callback;

    E.callback = function (callback, scope, args, delay, caller, defaultScope) {
        return MSApp.execUnsafeLocalFunction(function () {
            return MScallback.call(E, callback, scope, args, delay, caller, defaultScope);
        });
    };
})(Ext);
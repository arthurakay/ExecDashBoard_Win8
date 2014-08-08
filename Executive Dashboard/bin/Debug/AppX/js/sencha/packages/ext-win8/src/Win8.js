/**
 * @class Ext.Win8
 * An override for Ext JS 5.0.1+ that allows the framework to run inside a native Windows 8 application.
 *
 * @author Arthur Kay (www.akawebdesign.com)
 */
Ext.define('Ext.Win8', {
    override: 'Ext',

    elevateFunction: function (fn, scope, args) {
        //to satisfy the Windows 8 CSP:
        //    http://msdn.microsoft.com/en-us/library/windows/apps/hh767331.aspx
        return MSApp.execUnsafeLocalFunction(function () {
            return fn.apply(scope, args);
        });
    }
});
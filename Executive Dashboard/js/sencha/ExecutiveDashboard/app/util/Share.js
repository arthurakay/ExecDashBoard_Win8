Ext.define('ExecDashboard.util.Share', {
    singleton : true,

    getImageDataFromCanvas: function () {
        var canvas = Ext.ComponentQuery.query('#KPI_CHART')[0].el.query('canvas')[3];
        var img = canvas.toDataURL("image/png");      // Get the data as an image.

        //chop off the "data:image/png;base64," at the beginning
        return img.substr(22);
    },

    shareCanvasImage: function (e) {
        var request = e.request;
        var deferral = request.getDeferral();

        var imgData = Windows.Security.Cryptography.CryptographicBuffer.decodeFromBase64String(
            ExecDashboard.util.Share.getImageDataFromCanvas()
        );

        Windows.Storage.KnownFolders.picturesLibrary.createFileAsync(
            "transfer.png",
            Windows.Storage.CreationCollisionOption.replaceExisting
        ).done(
            function (file) {
                Windows.Storage.FileIO.writeBufferAsync(file, imgData).done(function () {
                    var streamReference = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(file);

                    request.data.properties.title = "Sencha wants to share...";
                    request.data.properties.description = "Executive Dashboard running on Windows 8!";
                    request.data.properties.thumbnail = streamReference;

                    request.data.setStorageItems([file]);
                    request.data.setBitmap(streamReference);

                    deferral.complete();
                });
            }
        );

        //var request = e.request;
        //request.data.properties.title = "Debugmode";
        //request.data.properties.description = "Debugmode Share App";
        //request.data.setText("Hello from DebugMode App");
    }
});
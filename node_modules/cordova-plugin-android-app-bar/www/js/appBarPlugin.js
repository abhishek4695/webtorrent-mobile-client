/*global cordova, module*/
var pluginName = 'AppBarPlugin';

module.exports = {
    setActions: function(menuItems, successCallback, errorCallback) {
        return cordova.exec(successCallback, errorCallback, pluginName, 'setActions',
            (Array.isArray(menuItems)) ? menuItems : [menuItems]);
    }
};

# Android App Bar

Implements material design app bars, as described here:

http://www.google.com/design/spec/layout/structure.html#structure-app-bar

Note that since app bars are just special cases of toolbars then this project should evolve to cope with toolbars more generally.

More technical information is here:

http://developer.android.com/design/patterns/actionbar.html

## Enabling an App Bar

Cordova apps don't have the app or action bar by default, so we must enable it. The easiest way to do this is to use a theme that has an app bar, such as one of the new Material Design themes. Your application's `AndroidManifest.xml` would need to be set to something like this:

```xml
<activity android:theme="@android:style/Theme.Material.Light" ...
```

See the article [Using the Material Theme](https://developer.android.com/training/material/theme.html) for details of other Material Design themes.

In the future we'll allow app bars to be enabled in other themes.

This is the only change you'll need to make to your application, since everything else is configured when the plugin is installed. Just in case anything goes wrong though, here's a description of what other settings are changed.

### ShowTitle

The app bar is not visible by default but this is changed by setting `ShowTitle`:

```xml
<preference name="ShowTitle" value="true" />
```

Note that this setting is already present in `plugin.xml` and is only discussed here for reference.

### Fullscreen

Even when we have enabled the app bar it won't be visible, since Cordova sets itself up to be fullscreen. This can be disabled with the `Fullscreen` option:

```xml
<preference name="Fullscreen" value="false" />
```

Note that this setting is already present in `plugin.xml` and is only discussed here for reference.

## Adding the Plugin to Your Application

```shell
cordova plugin add http://github.com/markbirbeck/cordova-plugin-android-app-bar.git
```

## Adding an Actions Menu to the App Bar

A menu can be added to the top right with the `setActions` method:

```javascript
appBar.setActions(
    [
        {
            action: 'Help'
        },
        {
            action: 'Add',
            button: true
        }
    ],
    function (action){
        console.log(action);
    },
    function (message){
        console.log('ERROR setting actions: ' + message);
    }
);
```

This will create a menu with two options, one labelled 'Help' and the other 'Add'. The 'Add' entry will appear on the app bar as a button, if there is space on the display, whilst 'Help' will always appear in the menu:

![Android app bar menu with one button and overflow](https://www.evernote.com/shard/s21/sh/5a85580c-8094-4c5b-ad04-3256852d1795/0ce009922237c384bdc2293a3160c987/deep/0/Genymotion-for-personal-use---steroids-(1080x1920,-480dpi)---192.168.59.101.png)

Any errors will be reported to the second callback function provided, and any activity on the menus will be provided via the first callback.

## Development

This release is to set the ball rolling, but there's lots more that can be added. All contributions welcome.
package com.markbirbeck.cordova.plugin;

import android.annotation.TargetApi;
import android.app.ActionBar;
import android.app.Activity;
import android.os.Build;
import android.util.Log;
import android.view.Menu;
import android.view.Window;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
public class AppBarPlugin extends CordovaPlugin {
    private static final String TAG = "AppBarPlugin";

    private MenuDefinition menuDef = null;

    @Override
    public boolean execute(final String action, final JSONArray data, final CallbackContext callbackContext) throws JSONException {
        /**
         * Before we do anything, check that we actually have a bar to work with:
         */

        final Activity ctx = (Activity) cordova;
        final ActionBar bar = ctx.getActionBar();

        /**
         * If there is no bar it could be because the feature is not available:
         */

        if (null == bar) {
            Window window = ctx.getWindow();

            if(!window.hasFeature(Window.FEATURE_ACTION_BAR)) {
                callbackContext.error("ActionBar feature is not available.");
            } else {
                callbackContext.error("No ActionBar is available");
            }
            return true;
        }

        /**
         * Process the actions:
         */

        switch (action) {

            /**
             * There are two phases to creating a menu; the first is to grab the menu settings,
             * save them, and then trigger a refresh of the menu. The second step is indicated
             * by receiving the 'onCreateOptionsMenu' message -- caused by the menu refresh --
             * and the saved settings are used to redraw the menu:
             */

            case "setActions":
                menuDef = new MenuDefinition(data, callbackContext);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
                    ctx.invalidateOptionsMenu();
                }

                return true;

            default:

                return false;
        }
    }

    @Override
    public Object onMessage(String id, final Object data) {
        switch (id) {

            /**
             * Create an actions menu from the definition:
             */

            case "onCreateOptionsMenu":
                if (menuDef != null) {
                    menuDef.createMenu((Menu) data, (Activity) cordova);
                }
                break;

            /**
             * Trigger the selected action:
             */

            case "onOptionsItemSelected":
                if (menuDef != null) {
                    menuDef.fire(data.toString());
                }
                break;

            /**
             * Log other messages:
             */

            default:
                Log.d(TAG, "onMessage: " + id + ": " + data);
                return null;
        }

        return true;
    }
}

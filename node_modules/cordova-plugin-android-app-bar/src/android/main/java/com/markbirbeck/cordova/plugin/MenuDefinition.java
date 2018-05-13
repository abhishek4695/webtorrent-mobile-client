package com.markbirbeck.cordova.plugin;

import android.app.Activity;
import android.view.Menu;
import android.view.MenuItem;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

class MenuDefinition {
    final JSONArray mDefinition;
    final CallbackContext mCallbackContext;

    public MenuDefinition(JSONArray definition, final CallbackContext callbackContext) {
        mDefinition = definition;
        mCallbackContext = callbackContext;
    }

    public void createMenu(final Menu menu, final Activity ctx) {
        ctx.runOnUiThread(new Runnable() {

            @Override
            public void run() {

                for (int i = 0; i < mDefinition.length(); ++i) {
                    try {
                        final JSONObject itemDef = mDefinition.getJSONObject(i);
                        final String title = itemDef.isNull("action") ? "" : itemDef.getString("action");

                        MenuItem item = menu.add(title);
                        item.setShowAsAction((itemDef.has("button") && itemDef.getBoolean("button")) ? MenuItem.SHOW_AS_ACTION_IF_ROOM : MenuItem.SHOW_AS_ACTION_WITH_TEXT);
                    } catch (JSONException e) {
                        fire("ERROR processing menu" + e);
                    }
                }
                fire("SUCCESS processing menu");
            }
        });
    }

    public void fire(String action) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, action);

        result.setKeepCallback(true);
        mCallbackContext.sendPluginResult(result);
    }
}

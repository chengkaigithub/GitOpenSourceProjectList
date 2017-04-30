package com.gitopensourceprojectlist.reactnative;

import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.gitopensourceprojectlist.R;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by chengkai on 2017/4/29.
 */

public class CKToast extends ReactContextBaseJavaModule {

    public static final String LENGTH_LONG = "LENGTH_LONG";
    public static final String LENGTH_SHORT = "LENGTH_SHORT";

    public CKToast(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }

    @ReactMethod
    public void show(String msg, int time) {
        Toast.makeText(getCurrentActivity(), msg, time).show();
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> map = new HashMap<>();
        map.put(LENGTH_LONG, Toast.LENGTH_LONG);
        map.put(LENGTH_SHORT, Toast.LENGTH_SHORT);
        return map;
    }

    @ReactMethod
    public void alert(final Callback success, final Callback error) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
        View inflate = LayoutInflater.from(getCurrentActivity()).inflate(R.layout.dialog_layout, null);
        final EditText name = (EditText) inflate.findViewById(R.id.et_name);
        final EditText password = (EditText) inflate.findViewById(R.id.et_password);
        builder.setTitle("提示").setView(inflate);
        builder.setPositiveButton("确认", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String result = name.getText().toString() + "-" + password.getText().toString();
                success.invoke(result);
            }
        }).setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                error.invoke("user cancel.");
            }
        }).show();
    }
}

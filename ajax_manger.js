var formManager = (function(){
    var defaultSettings = {
            async: false,
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            context: this,
            data: new Date().getTime(),
            dataType: 'JSON',
            global: true,
            ifModified: false,
            jsonp: false,
            beforeSend: function(){},
            error: function(){},
            success: function(){},
            complete: function(){}
        },
        settings = {};

    function mergeSettings($form)
    {
        if (settings = $form.attr('settings'))
        {
            settings = $.extend(defaultSettings, $.parseJSON(settings));
        }
        else
        {
            settings = defaultSettings;
        }

        return settings;
    }

    function submit(action, method, data)
    {
        $.ajax({
            async: settings.async,
            cache: settings.cache,
            contentType: settings.contentType,
            context: settings.context,
            data: data,
            dataType: settings.dataType,
            global: settings.global,
            ifModified: settings.ifModifies,
            jsonp: settings.jsonp,
            type: method,
            url: action,
            beforeSend: function (xhr, params){
                settings.beforeSend(xhr, params);
            },
            error: function (xhr, status, error) {
                settings.error()
            },
            success: function (data, status, xhr) {
                settings.success(data, status, xhr)
            },
            complete: function (xht, status) {
                settings.complete(xht, status)
            }
        });
    }

    function getCallback(str, context)
    {
        var namespaces = str.split('.'),
            f = namespaces.pop();
        for (var segment in namespaces)
        {
            context = context[namespaces[segment]];
        }

        return context[f];
    }

    function prepareCallable($form)
    {
        var str = '';
        if (str = $form.data('beforesend'))
        {
            settings.beforeSend = getCallback(str, window);
        }

        if (str = $form.data('complete'))
        {
            settings.complete = getCallback(str, window);
        }

        if (str = $form.data('success'))
        {
            settings.success = getCallback(str, window);
        }

        if (str = $form.data('error'))
        {
            settings.error = getCallback(str, window);
        }

    }

    return {
        'submit' : function(form)
        {
            var $form = $(form),
                action = $form.attr('action'),
                method = $form.attr('method'),
                serialized = $form.serialize();

            settings = mergeSettings($form);

            prepareCallable($form);

            submit(action, method, serialized);
        }
    }
})();
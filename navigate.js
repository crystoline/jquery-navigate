$(function(){


    if(NProgress){
        NProgress.configure({ easing: 'ease', speed: 50, showSpinner: true });
    }
    $(document)

        .ajaxStart(function () {
            if(NProgress){
                NProgress.set(0.4);
                NProgress.start();
            }
        })
        .ajaxStop(function () {
            if(NProgress){
                NProgress.set(0.9);
                setTimeout(function () {
                    NProgress.done();
                    NProgress.remove();
                }, 1000)


            }
        });


    var anchor_handler = function(e){

        e.preventDefault();
        var obj = $(this);//alert(obj);
        var url =  '';
        if(obj.attr('data-href')){
            url = obj.attr('data-href');
        }else if(obj.attr('href')){
            url = obj.attr('href');
        }
            var method =  'get';
        var dst = (obj.attr('data-dst'))? obj.attr('data-dst'): '#content';
        var data = {}

        var title = (obj.attr('title'))? obj.attr('title'): url;
        var options = {
            url: url,
            method: method,
            dst: dst,
            data: data
        }

        do_ajax(options)
        //alert($('meta[name="base-url"]').attr('content') + "#"+url);
        if(!obj.attr('data-temp'))
            history.pushState(options, title, $('meta[name="base-url"]').attr('content')+'#'+get_url(url));


    }

    var form_handler = function(e){
        e.preventDefault();
        var obj = $(this)
        var url = (obj.attr('action'))? obj.attr('action'): '';
        var method = (obj.attr('method'))? obj.attr('method'): 'get';
        var dst = (obj.attr('data-dst'))? obj.attr('data-dst'): '#content';
        var attach = (obj.attr('data-attach'))? obj.attr('data-attach'): 'replace';


        var data = new FormData($(this)[0]);

        console.log(data);

        var title = (obj.attr('title'))? obj.attr('title'): url;
        var options = {
            url: url,
            method: method,
            dst: dst,
            data: data,
            attach:attach,
            cache: false
        }
        if(!obj.attr('data-temp') && method.toLowerCase() == 'get'){
            var opt = options
            opt.data = $(this).serializeArray();
            history.pushState(opt, title,$('meta[name="base-url"]').attr('content')+"#"+get_url(url));
        }
        do_ajax(options)
    }
    window.addEventListener('popstate', function(e) {
        var options = e.state;

        if (options == null) {

        } else {
            do_ajax(options)
        }
    });
    $(document).on('click', 'a[data-ajax=true], [data-ajax-links] a[data-ajax-links] a', anchor_handler);
    $(document).on('submit', 'form[data-ajax=true]', form_handler);
    $(document).on('change', '.selectAll', function(e) {//select all check boxes

        var checkboxes = $(this).closest('table').find(':checkbox');
        e.preventDefault
        if($(this).is(":checked:not([disabled])")) {
            checkboxes.prop('checked', true);
        } else {
            checkboxes.prop('checked', false);
        }
    });
})

$(function(e){
    var url = location.hash; //alert(url);
    if(url){
        var options = {
            url: $('meta[name="base-url"]').attr('content') + get_url(url.replace("#", "")),
            method: 'get',
            cache: false,
            dst: '#content'
        }
        //alert(get_url(url.replace("#", "")));
        do_ajax(options);
    }
})
function do_ajax(options){
    var dest = $(options.dst);

    options.url  = $('meta[name="base-url"]').attr('content') + get_url(options.url)
    //alert( options.url)
    $.ajax({
        cache: false,
        url: options.url,
        method: options.method,//type of posting the data
        data: options.data,

        cache: false,
        contentType: false,
        processData: false,
        //async: (options.method == 'post') ? false: true,

        success: function (data) {
            //alert( dest.html())
            switch (options.attach){
                case 'prepend': dest.prepend(data); break;
                case 'append': dest.append(data); break;
                case 'replace': dest.html(data); break;
                default: dest.html(data);
            }
            //alert( dest.html())
            //r();
        },
        error: function(xhr, ajaxOptions, thrownError){
            // alert(ajaxOptions)
            var base_url = $('meta[name="base-url"]').attr('content');
            switch(xhr.status){
                case 401:  window.location =  base_url ; break;
                default:
                    var msg = $('<div class="alert alert-warning alert-dismissible" role="alert" style="margin-top: 50px">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span></button>'+
                        '<strong>An Error Occurred! </strong> '+thrownError+ '</div>');
                    dest.html(msg);

                    msg.fadeTo(5000, 500).slideUp(500, function(){
                        $(this).alert('close');
                    });
                    dest.append(xhr.responseText);
                    console.log(xhr);
            }
            //what to do in error
        },
        complete: function () {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        },
        timeout : 300000//timeout of the ajax call
    });
   // alert(get_url('http://myinvoice.org/dashboard/1/officer'));
}

function get_url(url){
    var base_url = $('meta[name="base-url"]').attr('content');
    //alert(base_url);
    var site_url = (base_url)? base_url: '';
    if(url.indexOf(site_url) == 0){
        return url.replace(site_url,'');
    }
    else return url;
}

$(function () {
    $reload = $('<button id="navigate-reload" class="btn btn-primary" style="position: fixed; z-index: 1040;top: 100px; right: 10px"><i class="fa fa-refresh"></i></button>');
    $('body').append($reload);
    $(document).on('click', '#navigate-reload', function (e) {
        var options = history.state;

        console.log(options)
        if (options == null) {
            //alert('no Event');
        } else {
            do_ajax(options)
        }
    })
})